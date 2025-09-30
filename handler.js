const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();
const dotenv = require('dotenv');

dotenv.config();

// Middleware para parsing do body
app.use(bodyParser.json());

// Configuração do Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'WhatsApp Cloud API Webhook',
            version: '1.0.0',
            description: 'API para receber e processar webhooks do WhatsApp Cloud API. Suporta todos os tipos de mensagens: texto, áudio, imagem, vídeo, documento, localização, pedidos, reações, stickers e muito mais.',
            contact: {
                name: 'WhatsApp Webhook API',
                email: 'support@example.com'
            }
        },
        servers: [
            {
                url: process.env.API_URL || 'http://localhost:3000',
                description: 'Servidor de desenvolvimento'
            }
        ]
    },
    apis: ['./handler.js', './index.js']
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Servir o arquivo JSON do Swagger
app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// Servir a interface do Swagger
app.get('/docs', (req, res) => {
    res.sendFile(__dirname + '/swagger-ui.html');
});

const token = process.env.TOKEN;
const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
const phoneNumberId = process.env.PHONE_NUMBER_ID;

/**
 * @swagger
 * /webhook:
 *   get:
 *     tags:
 *       - Webhook
 *     summary: Verificação do Webhook
 *     description: Endpoint para verificação do webhook pelo Facebook. Usado durante a configuração inicial.
 *     parameters:
 *       - in: query
 *         name: hub.mode
 *         required: true
 *         schema:
 *           type: string
 *           example: subscribe
 *         description: Modo de verificação (sempre 'subscribe')
 *       - in: query
 *         name: hub.verify_token
 *         required: true
 *         schema:
 *           type: string
 *           example: your_verify_token
 *         description: Token de verificação configurado no painel do Facebook
 *       - in: query
 *         name: hub.challenge
 *         required: true
 *         schema:
 *           type: string
 *           example: challenge_string
 *         description: String de desafio enviada pelo Facebook
 *     responses:
 *       200:
 *         description: Webhook verificado com sucesso
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: challenge_string
 *       403:
 *         description: Token de verificação inválido
 */
// Endpoint para verificação do webhook (GET)
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const verify_token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    console.log('Webhook verification attempt:', { 
        mode, 
        verify_token, 
        challenge,
        expectedToken: token,
        tokensMatch: verify_token === token
    });

    // Verificar se todos os parâmetros necessários estão presentes
    if (!mode || !verify_token || !challenge) {
        console.log('Missing required parameters:', { mode, verify_token, challenge });
        return res.status(400).send('Missing required parameters');
    }

    // Verificar se o token de verificação está configurado
    if (!token) {
        console.log('TOKEN not configured in environment variables');
        return res.status(500).send('Server configuration error');
    }

    if (mode === 'subscribe' && verify_token === token) {
        console.log('Webhook verified successfully');
        // IMPORTANTE: Retornar o challenge como texto puro, não JSON
        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send(challenge);
    } else {
        console.log('Webhook verification failed:', {
            modeMatch: mode === 'subscribe',
            tokenMatch: verify_token === token,
            receivedToken: verify_token,
            expectedToken: token
        });
        res.status(403).send('Forbidden');
    }
});

/**
 * @swagger
 * /webhook:
 *   post:
 *     tags:
 *       - Webhook
 *     summary: Receber Notificações do Webhook
 *     description: Endpoint para receber notificações de mensagens e status do WhatsApp. Processa todos os tipos de mensagens.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               object:
 *                 type: string
 *                 example: whatsapp_business_account
 *               entry:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "102290129340398"
 *                     changes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           value:
 *                             type: object
 *                             properties:
 *                               messaging_product:
 *                                 type: string
 *                                 example: whatsapp
 *                               metadata:
 *                                 type: object
 *                                 properties:
 *                                   display_phone_number:
 *                                     type: string
 *                                     example: "15550783881"
 *                                   phone_number_id:
 *                                     type: string
 *                                     example: "106540352242922"
 *                               messages:
 *                                 type: array
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                     id:
 *                                       type: string
 *                                       example: "wamid.HBgLMTY1MDM4Nzk0MzkVAgASGBQzQUFERjg0NDEzNDdFODU3MUMxMAA="
 *                                     from:
 *                                       type: string
 *                                       example: "16505551234"
 *                                     timestamp:
 *                                       type: string
 *                                       example: "1750096325"
 *                                     type:
 *                                       type: string
 *                                       enum: [text, audio, image, video, document, location, order, reaction, sticker, interactive, contacts, button]
 *                                     text:
 *                                       type: object
 *                                       properties:
 *                                         body:
 *                                           type: string
 *                                           example: "Olá! Como posso ajudar?"
 *                               statuses:
 *                                 type: array
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                     id:
 *                                       type: string
 *                                       example: "wamid.HBgLMTY1MDM4Nzk0MzkVAgASGBQzQUFERjg0NDEzNDdFODU3MUMxMAA="
 *                                     status:
 *                                       type: string
 *                                       enum: [sent, delivered, read, failed]
 *                                       example: delivered
 *                                     timestamp:
 *                                       type: string
 *                                       example: "1750096325"
 *                                     recipient_id:
 *                                       type: string
 *                                       example: "16505551234"
 *                           field:
 *                             type: string
 *                             example: messages
 *     responses:
 *       200:
 *         description: Notificação processada com sucesso
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error processing webhook"
 */
// Endpoint para receber notificações do webhook (POST)
app.post('/webhook', (req, res) => {
    console.log('Webhook notification received:', JSON.stringify(req.body, null, 2));
    
    try {
        const body = req.body;
        
        // Verificar se é uma notificação válida do WhatsApp
        if (body.object === 'whatsapp_business_account') {
            body.entry.forEach(entry => {
                entry.changes.forEach(change => {
                    if (change.field === 'messages') {
                        console.log('Processing message change:', change.value);
                        // Aqui você pode processar as mensagens recebidas
                        processMessage(change.value);
                    }
                });
            });
        }
        
        res.sendStatus(200);
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.sendStatus(500);
    }
});

// Função para processar mensagens recebidas
function processMessage(messageData) {
    console.log('Processing message:', messageData);
    
    if (messageData.messages) {
        messageData.messages.forEach(message => {
            console.log('Received message:', {
                from: message.from,
                type: message.type,
                timestamp: message.timestamp,
                text: message.text?.body || 'No text content'
            });
            
            // Processar diferentes tipos de mensagens
            switch (message.type) {
                case 'text':
                    processTextMessage(message);
                    break;
                case 'audio':
                    processAudioMessage(message);
                    break;
                case 'button':
                    processButtonMessage(message);
                    break;
                case 'contacts':
                    processContactsMessage(message);
                    break;
                case 'document':
                    processDocumentMessage(message);
                    break;
                case 'image':
                    processImageMessage(message);
                    break;
                case 'interactive':
                    processInteractiveMessage(message);
                    break;
                case 'location':
                    processLocationMessage(message);
                    break;
                case 'order':
                    processOrderMessage(message);
                    break;
                case 'reaction':
                    processReactionMessage(message);
                    break;
                case 'sticker':
                    processStickerMessage(message);
                    break;
                case 'system':
                    processSystemMessage(message);
                    break;
                case 'video':
                    processVideoMessage(message);
                    break;
                case 'errors':
                    processErrorMessage(message);
                    break;
                case 'status':
                    processStatusMessage(message);
                    break;
                case 'unsupported':
                    processUnsupportedMessage(message);
                    break;
                default:
                    console.log('Unknown message type:', message.type);
                    processUnknownMessage(message);
            }
        });
    }
    
    if (messageData.statuses) {
        messageData.statuses.forEach(status => {
            console.log('Message status update:', {
                id: status.id,
                status: status.status,
                timestamp: status.timestamp,
                recipient_id: status.recipient_id
            });
        });
    }
}

// Função específica para processar mensagens de pedidos
function processOrderMessage(message) {
    console.log('Processing order message:', message);
    
    const order = message.order;
    if (!order) {
        console.error('Order data not found in message');
        return;
    }
    
    const orderData = {
        messageId: message.id,
        from: message.from,
        timestamp: message.timestamp,
        catalogId: order.catalog_id,
        orderText: order.text,
        productItems: order.product_items || []
    };
    
    console.log('Order details:', {
        catalogId: orderData.catalogId,
        orderText: orderData.orderText,
        totalItems: orderData.productItems.length,
        products: orderData.productItems.map(item => ({
            productId: item.product_retailer_id,
            quantity: item.quantity,
            price: item.item_price,
            currency: item.currency
        }))
    });
    
    // Calcular total do pedido
    const totalAmount = orderData.productItems.reduce((total, item) => {
        return total + (item.item_price * item.quantity);
    }, 0);
    
    console.log('Order total:', totalAmount, orderData.productItems[0]?.currency || 'USD');
    
    // Aqui você pode implementar lógica adicional como:
    // - Salvar o pedido no banco de dados
    // - Enviar confirmação para o cliente
    // - Notificar o sistema de vendas
    // - Processar pagamento
    
    handleOrderProcessing(orderData);
}

// Função para processar o pedido (implementar lógica de negócio)
function handleOrderProcessing(orderData) {
    console.log('Handling order processing for:', orderData.from);
    
    // Exemplo de lógica de processamento:
    // 1. Validar produtos no catálogo
    // 2. Verificar disponibilidade
    // 3. Calcular impostos e frete
    // 4. Gerar número do pedido
    // 5. Enviar confirmação
    
    // Por enquanto, apenas log
    console.log('Order processing completed for message:', orderData.messageId);
}

// ===== HANDLERS PARA DIFERENTES TIPOS DE MENSAGENS =====

// Processar mensagens de texto
function processTextMessage(message) {
    console.log('Processing text message:', {
        from: message.from,
        text: message.text?.body,
        timestamp: message.timestamp
    });
    
    // Implementar lógica para mensagens de texto
    // Ex: responder automaticamente, salvar no banco, etc.
}

// Processar mensagens de áudio
function processAudioMessage(message) {
    console.log('Processing audio message:', {
        from: message.from,
        audioId: message.audio?.id,
        mimeType: message.audio?.mime_type,
        sha256: message.audio?.sha256,
        timestamp: message.timestamp
    });
    
    // Implementar lógica para áudio
    // Ex: transcrever áudio, salvar arquivo, etc.
}

// Processar mensagens de botão
function processButtonMessage(message) {
    console.log('Processing button message:', {
        from: message.from,
        buttonText: message.button?.text,
        buttonPayload: message.button?.payload,
        timestamp: message.timestamp
    });
    
    // Implementar lógica para botões
    // Ex: processar ações baseadas no payload
}

// Processar mensagens de contatos
function processContactsMessage(message) {
    console.log('Processing contacts message:', {
        from: message.from,
        contacts: message.contacts,
        timestamp: message.timestamp
    });
    
    // Implementar lógica para contatos
    // Ex: salvar contatos, sincronizar agenda, etc.
}

// Processar mensagens de documento
function processDocumentMessage(message) {
    console.log('Processing document message:', {
        from: message.from,
        documentId: message.document?.id,
        filename: message.document?.filename,
        mimeType: message.document?.mime_type,
        sha256: message.document?.sha256,
        timestamp: message.timestamp
    });
    
    // Implementar lógica para documentos
    // Ex: salvar arquivo, processar conteúdo, etc.
}

// Processar mensagens de imagem
function processImageMessage(message) {
    console.log('Processing image message:', {
        from: message.from,
        imageId: message.image?.id,
        mimeType: message.image?.mime_type,
        sha256: message.image?.sha256,
        caption: message.image?.caption,
        timestamp: message.timestamp
    });
    
    // Implementar lógica para imagens
    // Ex: salvar imagem, processar OCR, etc.
}

// Processar mensagens interativas
function processInteractiveMessage(message) {
    console.log('Processing interactive message:', {
        from: message.from,
        interactiveType: message.interactive?.type,
        interactiveData: message.interactive,
        timestamp: message.timestamp
    });
    
    // Implementar lógica para mensagens interativas
    // Ex: processar listas, botões, respostas, etc.
}

// Processar mensagens de localização
function processLocationMessage(message) {
    console.log('Processing location message:', {
        from: message.from,
        latitude: message.location?.latitude,
        longitude: message.location?.longitude,
        name: message.location?.name,
        address: message.location?.address,
        timestamp: message.timestamp
    });
    
    // Implementar lógica para localização
    // Ex: salvar coordenadas, buscar endereços próximos, etc.
}

// Processar reações
function processReactionMessage(message) {
    console.log('Processing reaction message:', {
        from: message.from,
        emoji: message.reaction?.emoji,
        messageId: message.reaction?.message_id,
        timestamp: message.timestamp
    });
    
    // Implementar lógica para reações
    // Ex: salvar reação, notificar sobre like/dislike, etc.
}

// Processar stickers
function processStickerMessage(message) {
    console.log('Processing sticker message:', {
        from: message.from,
        stickerId: message.sticker?.id,
        mimeType: message.sticker?.mime_type,
        sha256: message.sticker?.sha256,
        animated: message.sticker?.animated,
        timestamp: message.timestamp
    });
    
    // Implementar lógica para stickers
    // Ex: salvar sticker, responder com sticker similar, etc.
}

// Processar mensagens do sistema
function processSystemMessage(message) {
    console.log('Processing system message:', {
        from: message.from,
        systemData: message.system,
        timestamp: message.timestamp
    });
    
    // Implementar lógica para mensagens do sistema
    // Ex: processar mudanças de grupo, configurações, etc.
}

// Processar vídeos
function processVideoMessage(message) {
    console.log('Processing video message:', {
        from: message.from,
        videoId: message.video?.id,
        mimeType: message.video?.mime_type,
        sha256: message.video?.sha256,
        caption: message.video?.caption,
        timestamp: message.timestamp
    });
    
    // Implementar lógica para vídeos
    // Ex: salvar vídeo, extrair frames, processar conteúdo, etc.
}

// Processar erros
function processErrorMessage(message) {
    console.log('Processing error message:', {
        from: message.from,
        errorData: message.errors,
        timestamp: message.timestamp
    });
    
    // Implementar lógica para erros
    // Ex: notificar administradores, log de erros, etc.
}

// Processar status de mensagens
function processStatusMessage(message) {
    console.log('Processing status message:', {
        from: message.from,
        statusData: message.status,
        timestamp: message.timestamp
    });
    
    // Implementar lógica para status
    // Ex: atualizar status de entrega, notificar sobre leitura, etc.
}

// Processar mensagens não suportadas
function processUnsupportedMessage(message) {
    console.log('Processing unsupported message:', {
        from: message.from,
        unsupportedData: message.unsupported,
        timestamp: message.timestamp
    });
    
    // Implementar lógica para mensagens não suportadas
    // Ex: notificar sobre formato não suportado, etc.
}

// Processar mensagens desconhecidas
function processUnknownMessage(message) {
    console.log('Processing unknown message type:', {
        from: message.from,
        type: message.type,
        timestamp: message.timestamp
    });
    
    // Implementar lógica para tipos desconhecidos
    // Ex: log para análise, notificação para desenvolvedores, etc.
}

/**
 * @swagger
 * /send-message:
 *   post:
 *     tags:
 *       - Messages
 *     summary: Enviar Mensagem
 *     description: Endpoint para enviar mensagens via WhatsApp. Suporta texto e templates.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - type
 *               - message
 *             properties:
 *               to:
 *                 type: string
 *                 example: "5511999999999"
 *                 description: Número do destinatário
 *               type:
 *                 type: string
 *                 enum: [text, template]
 *                 example: text
 *                 description: Tipo da mensagem
 *               message:
 *                 type: object
 *                 description: Conteúdo da mensagem
 *                 properties:
 *                   text:
 *                     type: string
 *                     example: "Olá! Esta é uma mensagem de teste."
 *                   template_name:
 *                     type: string
 *                     example: "hello_world"
 *                   language_code:
 *                     type: string
 *                     example: "en_US"
 *     responses:
 *       200:
 *         description: Mensagem enviada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messaging_product:
 *                   type: string
 *                   example: "whatsapp"
 *                 contacts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       input:
 *                         type: string
 *                         example: "5511999999999"
 *                       wa_id:
 *                         type: string
 *                         example: "5511999999999"
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "wamid.HBgLMTY1MDM4Nzk0MzkVAgASGBQzQUFERjg0NDEzNDdFODU3MUMxMAA="
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing required fields: to, type, message"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to send message"
 */
// Endpoint para enviar mensagens
app.post('/send-message', async (req, res) => {
    try {
        const { to, type, message } = req.body;
        
        if (!to || !type || !message) {
            return res.status(400).json({
                error: 'Missing required fields: to, type, message'
            });
        }
        
        if (!accessToken || !phoneNumberId) {
            return res.status(500).json({
                error: 'WhatsApp credentials not configured'
            });
        }
        
        const result = await sendWhatsAppMessage(to, type, message);
        res.json(result);
        
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Função para enviar mensagem via WhatsApp Graph API
async function sendWhatsAppMessage(to, type, message) {
    const url = `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`;
    
    let payload;
    
    if (type === 'template') {
        payload = {
            messaging_product: 'whatsapp',
            to: to,
            type: 'template',
            template: {
                name: message.template_name || 'hello_world',
                language: {
                    code: message.language_code || 'en_US'
                }
            }
        };
    } else if (type === 'text') {
        payload = {
            messaging_product: 'whatsapp',
            to: to,
            type: 'text',
            text: {
                body: message.text
            }
        };
 } else {
        throw new Error('Unsupported message type');
    }
    
    try {
        const response = await axios.post(url, payload, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Message sent successfully:', response.data);
        return response.data;
        
    } catch (error) {
        console.error('WhatsApp API error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error?.message || 'WhatsApp API error');
    }
}

/**
 * @swagger
 * /send-hello-world:
 *   post:
 *     tags:
 *       - Messages
 *     summary: Enviar Template Hello World
 *     description: Endpoint simplificado para enviar o template hello_world.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *             properties:
 *               to:
 *                 type: string
 *                 example: "5511999999999"
 *                 description: Número do destinatário
 *     responses:
 *       200:
 *         description: Template enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messaging_product:
 *                   type: string
 *                   example: "whatsapp"
 *                 contacts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       input:
 *                         type: string
 *                         example: "5511999999999"
 *                       wa_id:
 *                         type: string
 *                         example: "5511999999999"
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "wamid.HBgLMTY1MDM4Nzk0MzkVAgASGBQzQUFERjg0NDEzNDdFODU3MUMxMAA="
 *       400:
 *         description: Número do destinatário não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing required field: to"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to send template"
 */
// Endpoint para enviar template hello_world (exemplo)
app.post('/send-hello-world', async (req, res) => {
    try {
        const { to } = req.body;
        
        if (!to) {
            return res.status(400).json({
                error: 'Missing required field: to'
            });
        }
        
        const result = await sendWhatsAppMessage(to, 'template', {
            template_name: 'hello_world',
            language_code: 'en_US'
        });
        
        res.json(result);
        
    } catch (error) {
        console.error('Error sending hello world template:', error);
        res.status(500).json({ error: 'Failed to send template' });
    }
});

/**
 * @swagger
 * /test-order:
 *   post:
 *     tags:
 *       - Testing
 *     summary: Testar Processamento de Pedidos
 *     description: Endpoint para testar o processamento de mensagens de pedidos.
 *     responses:
 *       200:
 *         description: Teste executado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order processing test completed"
 *                 orderId:
 *                   type: string
 *                   example: "wamid.test123"
 *                 totalItems:
 *                   type: integer
 *                   example: 2
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to test order processing"
 */
// Endpoint para testar processamento de pedidos (simulação)
app.post('/test-order', (req, res) => {
    try {
        // Simular uma mensagem de pedido para teste
        const mockOrderMessage = {
            id: 'wamid.test123',
            from: '16505551234',
            timestamp: Date.now().toString(),
            type: 'order',
            order: {
                catalog_id: '194836987003835',
                text: 'Love these!',
                product_items: [
                    {
                        product_retailer_id: 'di9ozbzfi4',
                        quantity: 2,
                        item_price: 30,
                        currency: 'USD'
                    },
                    {
                        product_retailer_id: 'nqryix03ez',
                        quantity: 1,
                        item_price: 25,
                        currency: 'USD'
                    }
                ]
            }
        };
        
        console.log('Testing order processing with mock data');
        processOrderMessage(mockOrderMessage);
        
        res.json({
            message: 'Order processing test completed',
            orderId: mockOrderMessage.id,
            totalItems: mockOrderMessage.order.product_items.length
        });
        
    } catch (error) {
        console.error('Error testing order processing:', error);
        res.status(500).json({ error: 'Failed to test order processing' });
    }
});

module.exports.handler = serverless(app);
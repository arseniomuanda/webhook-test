const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

app.use(bodyParser.json());

// Configuração do Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'WhatsApp Cloud API Webhook',
            version: '1.0.0',
            description: 'API para receber e processar webhooks do WhatsApp Cloud API. Suporta todos os tipos de mensagens.',
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

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});


// Endpoint para verificação do webhook (GET)
app.get('/', (req, res) => {
    const mode = req.query['hub.mode'];
    const verify_token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const myToken = process.env.VERIFY_TOKEN;

    console.log('Webhook verification attempt:', { mode, verify_token, challenge });

    if (mode === 'subscribe' && verify_token === myToken) {
        console.log('Webhook verified successfully');
        res.status(200).send(challenge);
    } else {
        console.log('Webhook verification failed');
        res.sendStatus(403);
    }
});

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


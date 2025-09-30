// Import Express.js
const express = require('express');
const axios = require('axios');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Configuração do Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
      title: 'WhatsApp Business Webhook API',
            version: '1.0.0',
      description: 'API completa para webhook do WhatsApp Business Account com envio de mensagens automáticas e manuais',
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
  apis: ['./index.js']
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Set port and verify_token
const port = process.env.PORT || 3000;
const verifyToken = "test_token_123";

// WhatsApp API credentials
const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
const phoneNumberId = process.env.PHONE_NUMBER_ID;
const businessAccountId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '1510212923444565';

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - Webhook
 *     summary: Verificação do Webhook
 *     description: Endpoint para verificação do webhook pelo Facebook/WhatsApp durante a configuração inicial
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
 *           example: test_token_123
 *         description: Token de verificação configurado
 *       - in: query
 *         name: hub.challenge
 *         required: true
 *         schema:
 *           type: string
 *           example: challenge_string_12345
 *         description: String de desafio enviada pelo Facebook
 *     responses:
 *       200:
 *         description: Webhook verificado com sucesso
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: challenge_string_12345
 *       403:
 *         description: Token de verificação inválido
 *       400:
 *         description: Parâmetros obrigatórios ausentes
 */
// Route for GET requests
app.get('/', (req, res) => {
  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

  console.log('Webhook verification attempt:', { 
    mode, 
    verify_token: token, 
    challenge,
    expectedToken: verifyToken,
    tokensMatch: token === verifyToken
  });

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED');
        res.status(200).send(challenge);
    } else {
        console.log('Webhook verification failed');
    res.status(403).end();
  }
});

/**
 * @swagger
 * /:
 *   post:
 *     tags:
 *       - Webhook
 *     summary: Receber Notificações do Webhook
 *     description: Endpoint para receber notificações do WhatsApp Business Account. Processa mensagens, status, templates e outros eventos.
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
 *                 description: Tipo do objeto (sempre 'whatsapp_business_account')
 *               entry:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "1510212923444565"
 *                       description: ID da conta WhatsApp Business
 *                     changes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           field:
 *                             type: string
 *                             enum: [messages, message_echoes, message_template_quality_update, message_template_status_update, account_alerts, business_capability_update, messaging_handovers, phone_number_name_update, phone_number_quality_update, account_review_update, smb_message_echoes, security, account_update, user_preferences]
 *                             example: messages
 *                             description: Tipo de evento recebido
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
 *                                     example: "+1 555 150 1055"
 *                                   phone_number_id:
 *                                     type: string
 *                                     example: "822762660918263"
 *                               messages:
 *                                 type: array
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                     id:
 *                                       type: string
 *                                       example: "wamid.HBgMMjQ0OTQzMzAyMDIzFQIAERgSRjFBOTMwRkMyQzk0OEQyQTE5AA=="
 *                                     from:
 *                                       type: string
 *                                       example: "244943302023"
 *                                     timestamp:
 *                                       type: string
 *                                       example: "1640995200"
 *                                     type:
 *                                       type: string
 *                                       enum: [text, audio, image, video, document, location, contacts, interactive, button, order, reaction, sticker, system, unknown]
 *                                       example: text
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
 *                                       example: "wamid.HBgMMjQ0OTQzMzAyMDIzFQIAERgSRjFBOTMwRkMyQzk0OEQyQTE5AA=="
 *                                     status:
 *                                       type: string
 *                                       enum: [sent, delivered, read, failed]
 *                                       example: delivered
 *                                     timestamp:
 *                                       type: string
 *                                       example: "1640995200"
 *                                     recipient_id:
 *                                       type: string
 *                                       example: "244943302023"
 *     responses:
 *       200:
 *         description: Notificação processada com sucesso
 *       500:
 *         description: Erro interno do servidor
 */
// Route for POST requests
app.post('/', (req, res) => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`\n\nWebhook received ${timestamp}\n`);
  console.log(JSON.stringify(req.body, null, 2));
    
    try {
        const body = req.body;
        
    // Verificar se é um webhook do WhatsApp Business Account
        if (body.object === 'whatsapp_business_account') {
      console.log(`\n📱 WhatsApp Business Account webhook received`);
      
      // Extrair dados específicos do webhook
      const extractedData = extractWebhookData(body);
      if (extractedData) {
        console.log('✅ Webhook data extracted successfully');
      }
      
      if (body.entry) {
            body.entry.forEach(entry => {
          console.log(`\n📋 Processing entry for WhatsApp Business Account: ${entry.id}`);
          
          if (entry.changes) {
            entry.changes.forEach(async (change) => {
              console.log(`\n🔄 Change detected in field: ${change.field}`);
              console.log(`📊 Change value:`, JSON.stringify(change.value, null, 2));
              
              // Processar diferentes tipos de campos do WhatsApp Business Account
              switch (change.field) {
                case 'account_alerts':
                  processAccountAlerts(change.value);
                  break;
                case 'business_capability_update':
                  processBusinessCapabilityUpdate(change.value);
                  break;
                case 'message_echoes':
                  processMessageEchoes(change.value);
                  break;
                case 'message_template_quality_update':
                  processMessageTemplateQualityUpdate(change.value);
                  break;
                case 'message_template_status_update':
                  processMessageTemplateStatusUpdate(change.value);
                  break;
                case 'messages':
                  await processMessages(change.value);
                  break;
                case 'messaging_handovers':
                  processMessagingHandovers(change.value);
                  break;
                case 'phone_number_name_update':
                  processPhoneNumberNameUpdate(change.value);
                  break;
                case 'phone_number_quality_update':
                  processPhoneNumberQualityUpdate(change.value);
                  break;
                case 'account_review_update':
                  processAccountReviewUpdate(change.value);
                  break;
                case 'smb_message_echoes':
                  processSMBMessageEchoes(change.value);
                  break;
                case 'security':
                  processSecurity(change.value);
                  break;
                case 'account_update':
                  processAccountUpdate(change.value);
                  break;
                case 'user_preferences':
                  processUserPreferences(change.value);
                  break;
                default:
                  console.log(`❓ Unknown WhatsApp Business Account field: ${change.field}`);
              }
            });
          }
        });
      }
    }
    // Manter o processamento original para outros formatos
    else if (body.entry) {
      body.entry.forEach(entry => {
        console.log(`\n📋 Processing entry for user: ${entry.id}`);
        
        if (entry.changes) {
          entry.changes.forEach(change => {
            console.log(`\n🔄 Change detected in field: ${change.field}`);
            console.log(`📊 Change value:`, JSON.stringify(change.value, null, 2));
            
            // Processar diferentes tipos de campos
            switch (change.field) {
              case 'about':
                processAboutField(change.value);
                    break;
              case 'birthday':
                processBirthdayField(change.value);
                    break;
              case 'locale':
                processLocaleField(change.value);
                    break;
              case 'email':
                processEmailField(change.value);
                    break;
              case 'first_name':
                processFirstNameField(change.value);
                    break;
              case 'gender':
                processGenderField(change.value);
                    break;
              case 'hometown':
                processHometownField(change.value);
                    break;
              case 'last_name':
                processLastNameField(change.value);
                    break;
              case 'likes':
                processLikesField(change.value);
                    break;
                case 'location':
                processLocationField(change.value);
                    break;
              case 'name':
                processNameField(change.value);
                    break;
              case 'photos':
                processPhotosField(change.value);
                    break;
              case 'posts':
                processPostsField(change.value);
                    break;
              case 'profile_pic':
                processProfilePicField(change.value);
                    break;
              case 'quotes':
                processQuotesField(change.value);
                    break;
              case 'relationship_status':
                processRelationshipStatusField(change.value);
                    break;
              case 'television':
                processTelevisionField(change.value);
                    break;
              case 'videos':
                processVideosField(change.value);
                    break;
                default:
                console.log(`❓ Unknown field: ${change.field}`);
            }
        });
    }
      });
    }
    
    res.status(200).end();
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    res.status(500).end();
  }
});

// ===== FUNÇÕES PARA ENVIAR MENSAGENS VIA WHATSAPP API =====

async function sendWhatsAppMessage(to, message, type = 'text') {
        if (!accessToken || !phoneNumberId) {
    console.log('❌ WhatsApp credentials not configured');
    return null;
  }

  try {
    const url = `https://graph.facebook.com/v23.0/${phoneNumberId}/messages`;
    
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
    } else {
        payload = {
            messaging_product: 'whatsapp',
            to: to,
            type: 'text',
            text: {
          body: message
            }
        };
    }
    
        const response = await axios.post(url, payload, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        
    console.log('✅ Message sent successfully:', response.data);
        return response.data;
        
    } catch (error) {
    console.error('❌ Error sending WhatsApp message:', error.response?.data || error.message);
    return null;
  }
}

// ===== FUNÇÕES PARA PROCESSAR CAMPOS DO WHATSAPP BUSINESS ACCOUNT =====

function processAccountAlerts(data) {
  console.log('🚨 Account alerts:', data);
}

function processBusinessCapabilityUpdate(data) {
  console.log('💼 Business capability update:', data);
  if (data.max_daily_conversation_per_phone) {
    console.log(`📊 Max daily conversations per phone: ${data.max_daily_conversation_per_phone}`);
  }
  if (data.max_phone_numbers_per_waba) {
    console.log(`📊 Max phone numbers per WABA: ${data.max_phone_numbers_per_waba}`);
  }
}

function processMessageEchoes(data) {
  console.log('📤 Message echoes:', data);
}

function processMessageTemplateQualityUpdate(data) {
  console.log('📝 Template quality update:', data);
  console.log(`📊 Template: ${data.message_template_name} (${data.message_template_language})`);
  console.log(`📊 Quality score: ${data.previous_quality_score} → ${data.new_quality_score}`);
}

function processMessageTemplateStatusUpdate(data) {
  console.log('📋 Template status update:', data);
  console.log(`📊 Template: ${data.message_template_name} (${data.message_template_language})`);
  console.log(`📊 Event: ${data.event}`);
  if (data.reason) {
    console.log(`📊 Reason: ${data.reason}`);
  }
}

async function processMessages(data) {
  console.log('💬 Messages received:', data);
  
  if (data.messages) {
    for (const message of data.messages) {
      console.log(`📨 Message from ${message.from}: ${message.text?.body || 'Media/Other'}`);
      console.log(`📊 Message type: ${message.type}`);
      console.log(`📊 Message ID: ${message.id}`);
      
      // Enviar resposta automática para mensagens de texto
      if (message.text && message.text.body && message.from) {
        const responseMessage = `Olá! Recebi sua mensagem: "${message.text.body}". Como posso ajudar?`;
        console.log(`📤 Sending auto-reply to ${message.from}...`);
        
        await sendWhatsAppMessage(message.from, responseMessage);
      }
    }
  }
  
  if (data.statuses) {
    data.statuses.forEach(status => {
      console.log(`📊 Message status: ${status.status} for message ${status.id}`);
    });
  }
}

function processMessagingHandovers(data) {
  console.log('🤝 Messaging handovers:', data);
}

function processPhoneNumberNameUpdate(data) {
  console.log('📞 Phone number name update:', data);
  console.log(`📊 Phone: ${data.display_phone_number}`);
  console.log(`📊 Decision: ${data.decision}`);
  if (data.requested_verified_name) {
    console.log(`📊 Requested name: ${data.requested_verified_name}`);
  }
}

function processPhoneNumberQualityUpdate(data) {
  console.log('📊 Phone number quality update:', data);
  console.log(`📊 Phone: ${data.display_phone_number}`);
  console.log(`📊 Event: ${data.event}`);
  console.log(`📊 Limit: ${data.old_limit} → ${data.current_limit}`);
}

function processAccountReviewUpdate(data) {
  console.log('🔍 Account review update:', data);
  console.log(`📊 Decision: ${data.decision}`);
}

function processSMBMessageEchoes(data) {
  console.log('📱 SMB Message echoes:', data);
}

function processSecurity(data) {
  console.log('🔒 Security event:', data);
  console.log(`📊 Phone: ${data.display_phone_number}`);
  console.log(`📊 Event: ${data.event}`);
  if (data.requester) {
    console.log(`📊 Requester: ${data.requester}`);
  }
}

function processAccountUpdate(data) {
  console.log('🔄 Account update:', data);
  console.log(`📊 Phone: ${data.phone_number}`);
  console.log(`📊 Event: ${data.event}`);
  
  if (data.ban_info) {
    console.log(`📊 Ban state: ${data.ban_info.waba_ban_state}`);
  }
  
  if (data.business_verification_status) {
    console.log(`📊 Verification status: ${data.business_verification_status}`);
  }
}

function processUserPreferences(data) {
  console.log('⚙️ User preferences:', data);
}

/**
 * @swagger
 * /send-message:
 *   post:
 *     tags:
 *       - Mensagens
 *     summary: Enviar Mensagem WhatsApp
 *     description: Endpoint para enviar mensagens manuais via WhatsApp Business API
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - message
 *             properties:
 *               to:
 *                 type: string
 *                 example: "244943302023"
 *                 description: Número de telefone do destinatário (formato internacional sem +)
 *               message:
 *                 type: string
 *                 example: "Olá! Esta é uma mensagem de teste do webhook."
 *                 description: Conteúdo da mensagem a ser enviada
 *               type:
 *                 type: string
 *                 enum: [text, audio, image, video, document, location, contacts, interactive, button, order, reaction, sticker]
 *                 default: text
 *                 example: text
 *                 description: Tipo da mensagem (atualmente suporta apenas 'text')
 *     responses:
 *       200:
 *         description: Mensagem enviada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Message sent successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     messaging_product:
 *                       type: string
 *                       example: whatsapp
 *                     contacts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           input:
 *                             type: string
 *                             example: "244943302023"
 *                           wa_id:
 *                             type: string
 *                             example: "244943302023"
 *                     messages:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "wamid.HBgMMjQ0OTQzMzAyMDIzFQIAERgSRjFBOTMwRkMyQzk0OEQyQTE5AA=="
 *       400:
 *         description: Dados de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Missing required fields: to, message"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Failed to send message"
 */
// ===== ENDPOINTS PARA TEMPLATES =====

/**
 * @swagger
 * /templates:
 *   get:
 *     tags:
 *       - Templates
 *     summary: Listar Templates
 *     description: Lista todos os templates disponíveis na conta WhatsApp Business
 *     responses:
 *       200:
 *         description: Lista de templates obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "hello_world"
 *                       name:
 *                         type: string
 *                         example: "hello_world"
 *                       status:
 *                         type: string
 *                         enum: [PENDING, APPROVED, REJECTED, DISABLED, PAUSED, PENDING_DELETION, DELETED]
 *                         example: "APPROVED"
 *                       category:
 *                         type: string
 *                         enum: [AUTHENTICATION, MARKETING, UTILITY]
 *                         example: "UTILITY"
 *                       language:
 *                         type: string
 *                         example: "en_US"
 *                       components:
 *                         type: array
 *                         items:
 *                           type: object
 *       500:
 *         description: Erro ao obter templates
 */
app.get('/templates', async (req, res) => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v23.0/${businessAccountId}/message_templates`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('📋 Templates obtidos:', response.data);
    res.json({
      success: true,
      data: response.data.data,
      total: response.data.data.length
    });
  } catch (error) {
    console.error('❌ Erro ao obter templates:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch templates',
      details: error.response?.data || error.message
    });
  }
});

/**
 * @swagger
 * /templates:
 *   post:
 *     tags:
 *       - Templates
 *     summary: Criar Template
 *     description: Cria um novo template para mensagens do WhatsApp Business
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - language
 *               - components
 *             properties:
 *               name:
 *                 type: string
 *                 example: "welcome_message"
 *                 description: Nome único do template
 *               category:
 *                 type: string
 *                 enum: [AUTHENTICATION, MARKETING, UTILITY]
 *                 example: "UTILITY"
 *                 description: Categoria do template
 *               language:
 *                 type: string
 *                 example: "en_US"
 *                 description: Idioma do template
 *               components:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: [HEADER, BODY, FOOTER, BUTTONS]
 *                       example: "BODY"
 *                     text:
 *                       type: string
 *                       example: "Olá {{1}}! Bem-vindo ao nosso serviço."
 *                     buttons:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                             enum: [QUICK_REPLY, URL, PHONE_NUMBER]
 *                           text:
 *                             type: string
 *                             example: "Visitar Site"
 *                           url:
 *                             type: string
 *                             example: "https://example.com"
 *     responses:
 *       200:
 *         description: Template criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro ao criar template
 */
app.post('/templates', async (req, res) => {
  try {
    const { name, category, language, components } = req.body;
    
    if (!name || !category || !language || !components) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, category, language, components'
      });
    }

    const templateData = {
      name,
      category,
      language,
      components
    };

    const response = await axios.post(
      `https://graph.facebook.com/v23.0/${businessAccountId}/message_templates`,
      templateData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Template criado:', response.data);
    res.json({
      success: true,
      message: 'Template created successfully',
      data: response.data
    });
  } catch (error) {
    console.error('❌ Erro ao criar template:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to create template',
      details: error.response?.data || error.message
    });
  }
});

/**
 * @swagger
 * /templates/{templateName}:
 *   get:
 *     tags:
 *       - Templates
 *     summary: Obter Template Específico
 *     description: Obtém informações detalhadas de um template específico
 *     parameters:
 *       - in: path
 *         name: templateName
 *         required: true
 *         schema:
 *           type: string
 *           example: "welcome_message"
 *         description: Nome do template
 *     responses:
 *       200:
 *         description: Template obtido com sucesso
 *       404:
 *         description: Template não encontrado
 *       500:
 *         description: Erro ao obter template
 */
app.get('/templates/:templateName', async (req, res) => {
  try {
    const { templateName } = req.params;
    
    const response = await axios.get(
      `https://graph.facebook.com/v23.0/${businessAccountId}/message_templates/${templateName}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`📋 Template ${templateName} obtido:`, response.data);
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error(`❌ Erro ao obter template ${req.params.templateName}:`, error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch template',
      details: error.response?.data || error.message
    });
  }
});

/**
 * @swagger
 * /send-template:
 *   post:
 *     tags:
 *       - Templates
 *     summary: Enviar Mensagem com Template
 *     description: Envia uma mensagem usando um template aprovado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - template_name
 *             properties:
 *               to:
 *                 type: string
 *                 example: "244943302023"
 *                 description: Número do destinatário
 *               template_name:
 *                 type: string
 *                 example: "welcome_message"
 *                 description: Nome do template aprovado
 *               language:
 *                 type: string
 *                 example: "en_US"
 *                 description: Idioma do template
 *               components:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: [header, body, button]
 *                     parameters:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                             enum: [text, image, video, document]
 *                           text:
 *                             type: string
 *                             example: "João"
 *     responses:
 *       200:
 *         description: Mensagem com template enviada com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro ao enviar mensagem
 */
app.post('/send-template', async (req, res) => {
  try {
    const { to, template_name, language = 'en_US', components = [] } = req.body;
    
    if (!to || !template_name) {
            return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, template_name'
      });
    }

    const messageData = {
      messaging_product: 'whatsapp',
      to: to,
      type: 'template',
      template: {
        name: template_name,
        language: {
          code: language
        },
        components: components
      }
    };

    const response = await axios.post(
      `https://graph.facebook.com/v23.0/${phoneNumberId}/messages`,
      messageData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Mensagem com template enviada:', response.data);
    res.json({
      success: true,
      message: 'Template message sent successfully',
      data: response.data
    });
    } catch (error) {
    console.error('❌ Erro ao enviar template:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to send template message',
      details: error.response?.data || error.message
    });
  }
});

/**
 * @swagger
 * /templates/{templateName}:
 *   delete:
 *     tags:
 *       - Templates
 *     summary: Deletar Template
 *     description: Remove um template específico da conta WhatsApp Business
 *     parameters:
 *       - in: path
 *         name: templateName
 *         required: true
 *         schema:
 *           type: string
 *           example: "welcome_message"
 *         description: Nome do template a ser deletado
 *     responses:
 *       200:
 *         description: Template deletado com sucesso
 *       404:
 *         description: Template não encontrado
 *       500:
 *         description: Erro ao deletar template
 */
app.delete('/templates/:templateName', async (req, res) => {
  try {
    const { templateName } = req.params;
    
    const response = await axios.delete(
      `https://graph.facebook.com/v23.0/${businessAccountId}/message_templates`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        params: {
          name: templateName
        }
      }
    );

    console.log(`🗑️ Template ${templateName} deletado:`, response.data);
    res.json({
      success: true,
      message: 'Template deleted successfully',
      data: response.data
    });
  } catch (error) {
    console.error(`❌ Erro ao deletar template ${req.params.templateName}:`, error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to delete template',
      details: error.response?.data || error.message
    });
  }
});

/**
 * @swagger
 * /templates/{templateName}/recreate:
 *   post:
 *     tags:
 *       - Templates
 *     summary: Recriar Template
 *     description: Deleta um template existente e cria um novo com o mesmo nome (para templates rejeitados)
 *     parameters:
 *       - in: path
 *         name: templateName
 *         required: true
 *         schema:
 *           type: string
 *           example: "welcome_message"
 *         description: Nome do template a ser recriado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *               - language
 *               - components
 *             properties:
 *               category:
 *                 type: string
 *                 enum: [AUTHENTICATION, MARKETING, UTILITY]
 *                 example: "UTILITY"
 *               language:
 *                 type: string
 *                 example: "en_US"
 *               components:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Template recriado com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro ao recriar template
 */
app.post('/templates/:templateName/recreate', async (req, res) => {
  try {
    const { templateName } = req.params;
    const { category, language, components } = req.body;
    
    if (!category || !language || !components) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: category, language, components'
      });
    }

    // Primeiro, deletar o template existente
    try {
      await axios.delete(
        `https://graph.facebook.com/v23.0/${businessAccountId}/message_templates`,
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
          },
          params: {
            name: templateName
          }
        }
      );
      console.log(`🗑️ Template ${templateName} deletado antes da recriação`);
    } catch (deleteError) {
      console.log(`⚠️ Template ${templateName} não encontrado para deletar, continuando...`);
    }

    // Aguardar um momento antes de recriar
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Criar novo template com o mesmo nome
    const templateData = {
      name: templateName,
      category,
      language,
      components
    };

    const response = await axios.post(
      `https://graph.facebook.com/v23.0/${businessAccountId}/message_templates`,
      templateData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`✅ Template ${templateName} recriado:`, response.data);
    res.json({
      success: true,
      message: 'Template recreated successfully',
      data: response.data
    });
  } catch (error) {
    console.error(`❌ Erro ao recriar template ${req.params.templateName}:`, error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to recreate template',
      details: error.response?.data || error.message
    });
  }
});

// Endpoint para enviar mensagens manualmente
app.post('/send-message', async (req, res) => {
  try {
    const { to, message, type = 'text' } = req.body;
    
    if (!to || !message) {
            return res.status(400).json({
        error: 'Missing required fields: to, message'
      });
    }
    
    const result = await sendWhatsAppMessage(to, message, type);
    
    if (result) {
      res.json({
        success: true,
        message: 'Message sent successfully',
        data: result
      });
    } else {
      res.status(500).json({
        error: 'Failed to send message'
      });
    }
        
    } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
  console.log(`📱 WhatsApp webhook ready!`);
  console.log(`📤 Send messages to: POST /send-message`);
  console.log(`🔧 Configure these environment variables:`);
  console.log(`   - WHATSAPP_ACCESS_TOKEN`);
  console.log(`   - PHONE_NUMBER_ID`);
});
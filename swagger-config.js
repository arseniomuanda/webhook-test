// Configuração do Swagger para WhatsApp Cloud API Webhook
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'WhatsApp Cloud API Webhook',
            version: '1.0.0',
            description: 'API para receber e processar webhooks do WhatsApp Cloud API',
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
        ],
        components: {
            schemas: {
                WebhookVerification: {
                    type: 'object',
                    properties: {
                        'hub.mode': {
                            type: 'string',
                            example: 'subscribe'
                        },
                        'hub.verify_token': {
                            type: 'string',
                            example: 'your_verify_token'
                        },
                        'hub.challenge': {
                            type: 'string',
                            example: 'challenge_string'
                        }
                    }
                },
                SendMessageRequest: {
                    type: 'object',
                    required: ['to', 'type', 'message'],
                    properties: {
                        to: {
                            type: 'string',
                            example: '5511999999999',
                            description: 'Número do destinatário'
                        },
                        type: {
                            type: 'string',
                            enum: ['text', 'template'],
                            example: 'text',
                            description: 'Tipo da mensagem'
                        },
                        message: {
                            type: 'object',
                            description: 'Conteúdo da mensagem',
                            properties: {
                                text: {
                                    type: 'string',
                                    example: 'Olá! Esta é uma mensagem de teste.'
                                },
                                template_name: {
                                    type: 'string',
                                    example: 'hello_world'
                                },
                                language_code: {
                                    type: 'string',
                                    example: 'en_US'
                                }
                            }
                        }
                    }
                },
                SendMessageResponse: {
                    type: 'object',
                    properties: {
                        messaging_product: {
                            type: 'string',
                            example: 'whatsapp'
                        },
                        contacts: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    input: {
                                        type: 'string',
                                        example: '5511999999999'
                                    },
                                    wa_id: {
                                        type: 'string',
                                        example: '5511999999999'
                                    }
                                }
                            }
                        },
                        messages: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'string',
                                        example: 'wamid.HBgLMTY1MDM4Nzk0MzkVAgASGBQzQUFERjg0NDEzNDdFODU3MUMxMAA='
                                    }
                                }
                            }
                        }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            example: 'Missing required fields'
                        }
                    }
                },
                OrderMessage: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            example: 'wamid.HBgLMTY1MDM4Nzk0MzkVAgASGBQzQUFERjg0NDEzNDdFODU3MUMxMAA='
                        },
                        from: {
                            type: 'string',
                            example: '16505551234'
                        },
                        timestamp: {
                            type: 'string',
                            example: '1750096325'
                        },
                        type: {
                            type: 'string',
                            example: 'order'
                        },
                        order: {
                            type: 'object',
                            properties: {
                                catalog_id: {
                                    type: 'string',
                                    example: '194836987003835'
                                },
                                text: {
                                    type: 'string',
                                    example: 'Love these!'
                                },
                                product_items: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            product_retailer_id: {
                                                type: 'string',
                                                example: 'di9ozbzfi4'
                                            },
                                            quantity: {
                                                type: 'integer',
                                                example: 2
                                            },
                                            item_price: {
                                                type: 'number',
                                                example: 30
                                            },
                                            currency: {
                                                type: 'string',
                                                example: 'USD'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    apis: ['./handler.js', './index.js']
};

module.exports = swaggerOptions;

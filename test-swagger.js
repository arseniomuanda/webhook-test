// Teste simples para verificar se o Swagger está funcionando
const express = require('express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

// Configuração mínima do Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'WhatsApp Cloud API Webhook',
            version: '1.0.0',
            description: 'API para receber e processar webhooks do WhatsApp Cloud API.',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de desenvolvimento'
            }
        ]
    },
    apis: ['./handler.js', './index.js']
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

console.log('Swagger spec generated successfully');
console.log('Number of paths:', Object.keys(swaggerSpec.paths || {}).length);
console.log('Available paths:', Object.keys(swaggerSpec.paths || {}));

// Teste de parsing
try {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log('Swagger UI configured successfully');
} catch (error) {
    console.error('Error configuring Swagger UI:', error.message);
}

console.log('Test completed successfully');

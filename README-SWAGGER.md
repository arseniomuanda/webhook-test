# 📚 WhatsApp Business Webhook API - Documentação Swagger

## 🚀 Acesso à Documentação

### **Swagger UI Interface**
```
http://localhost:3000/api-docs
```

## 📋 Endpoints Disponíveis

### 1. **Webhook Verification** 
- **GET** `/`
- **Descrição:** Verificação do webhook pelo Facebook/WhatsApp
- **Parâmetros:** `hub.mode`, `hub.verify_token`, `hub.challenge`

### 2. **Webhook Notifications**
- **POST** `/`
- **Descrição:** Receber notificações do WhatsApp Business Account
- **Suporta:** Mensagens, status, templates, alertas, etc.

### 3. **Enviar Mensagens**
- **POST** `/send-message`
- **Descrição:** Enviar mensagens manuais via WhatsApp
- **Body:**
  ```json
  {
    "to": "244943302023",
    "message": "Sua mensagem aqui",
    "type": "text"
  }
  ```

## 🔧 Configuração

### **Variáveis de Ambiente (.env)**
```
WHATSAPP_ACCESS_TOKEN=seu_token_aqui
PHONE_NUMBER_ID=seu_phone_number_id
PORT=3000
API_URL=http://localhost:3000
```

### **Instalação de Dependências**
```bash
npm install swagger-jsdoc swagger-ui-express
```

## 📱 Funcionalidades

### **✅ Webhook Verification**
- Verificação automática do token
- Resposta com challenge string
- Logs detalhados

### **✅ Processamento de Eventos**
- **Mensagens:** Texto, áudio, imagem, vídeo, documento
- **Status:** Enviado, entregue, lido, falhou
- **Templates:** Qualidade e status de templates
- **Alertas:** Alertas da conta
- **Segurança:** Eventos de segurança
- **Atualizações:** Conta, preferências, capacidades

### **✅ Resposta Automática**
- Resposta automática a mensagens recebidas
- Mensagens personalizadas
- Suporte a emojis

### **✅ Envio Manual**
- API REST para envio de mensagens
- Suporte a diferentes tipos de mensagem
- Validação de dados

## 🧪 Testando a API

### **1. Verificar Webhook**
```bash
curl "http://localhost:3000/?hub.mode=subscribe&hub.verify_token=test_token_123&hub.challenge=test_challenge"
```

### **2. Enviar Mensagem**
```bash
curl -X POST http://localhost:3000/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "to": "244943302023",
    "message": "Olá! Teste do webhook.",
    "type": "text"
  }'
```

### **3. Testar Webhook POST**
```bash
curl -X POST http://localhost:3000/ \
  -H "Content-Type: application/json" \
  -d '{
    "object": "whatsapp_business_account",
    "entry": [{
      "id": "1510212923444565",
      "changes": [{
        "field": "messages",
        "value": {
          "messaging_product": "whatsapp",
          "metadata": {
            "display_phone_number": "+1 555 150 1055",
            "phone_number_id": "822762660918263"
          },
          "messages": [{
            "id": "wamid.test123",
            "from": "244943302023",
            "timestamp": "1640995200",
            "type": "text",
            "text": {
              "body": "Olá! Como posso ajudar?"
            }
          }]
        }
      }]
    }]
  }'
```

## 📊 Logs e Monitoramento

### **Logs de Verificação**
```
Webhook verification attempt: {
  mode: 'subscribe',
  verify_token: 'test_token_123',
  challenge: 'challenge_string',
  expectedToken: 'test_token_123',
  tokensMatch: true
}
WEBHOOK VERIFIED
```

### **Logs de Mensagens**
```
📱 WhatsApp Business Account webhook received
📋 Processing entry for WhatsApp Business Account: 1510212923444565
🔄 Change detected in field: messages
✅ Message sent successfully: {
  messaging_product: 'whatsapp',
  contacts: [ { input: '244943302023', wa_id: '244943302023' } ],
  messages: [ { id: 'wamid.HBgMMjQ0OTQzMzAyMDIzF...' } ]
}
```

## 🎯 Próximos Passos

1. **Acesse a documentação:** `http://localhost:3000/api-docs`
2. **Teste os endpoints** usando a interface Swagger
3. **Configure o webhook** no Facebook Developer Console
4. **Monitore os logs** para verificar funcionamento
5. **Personalize as respostas** automáticas conforme necessário

## 🔗 Links Úteis

- **Swagger UI:** http://localhost:3000/api-docs
- **WhatsApp Business API:** https://developers.facebook.com/docs/whatsapp
- **Facebook Developer Console:** https://developers.facebook.com/

---
**📱 WhatsApp Business Webhook API v1.0.0**  
*Documentação gerada automaticamente via Swagger*

# 📋 Guia Prático: Como Usar Templates do WhatsApp

## 🎯 **Templates Disponíveis no Seu Sistema:**

### **1. 🟢 `hello_world` (APROVADO)**
```json
{
  "name": "hello_world",
  "status": "APPROVED",
  "category": "UTILITY",
  "components": [
    {
      "type": "HEADER",
      "text": "Hello World"
    },
    {
      "type": "BODY", 
      "text": "Welcome and congratulations!! This message demonstrates your ability to send a WhatsApp message notification from the Cloud API, hosted by Meta. Thank you for taking the time to test with us."
    },
    {
      "type": "FOOTER",
      "text": "WhatsApp Business Platform sample message"
    }
  ]
}
```

### **2. 🔴 `welcome_message` (REJEITADO)**
```json
{
  "name": "welcome_message",
  "status": "REJECTED",
  "category": "UTILITY",
  "components": [
    {
      "type": "BODY",
      "text": "Olá {{1}}! Bem-vindo ao nosso serviço. Seu código de verificação é {{2}}."
    }
  ]
}
```

## 🚀 **Como Usar Templates:**

### **📤 1. Enviar Template Simples (hello_world)**

#### **Via API:**
```bash
curl -X POST http://localhost:3000/send-template \
  -H "Content-Type: application/json" \
  -d '{
    "to": "244943302023",
    "template_name": "hello_world",
    "language": "en_US"
  }'
```

#### **Via PowerShell:**
```powershell
$body = @{
    to = "244943302023"
    template_name = "hello_world"
    language = "en_US"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/send-template" -Method POST -Body $body -ContentType "application/json"
```

#### **Resposta Esperada:**
```json
{
  "success": true,
  "message": "Template message sent successfully",
  "data": {
    "messaging_product": "whatsapp",
    "contacts": [{"input": "244943302023", "wa_id": "244943302023"}],
    "messages": [{"id": "wamid.HBgMMjQ0OTQz..."}]
  }
}
```

### **📤 2. Enviar Template com Parâmetros (quando aprovado)**

#### **Exemplo com Template de Boas-vindas:**
```bash
curl -X POST http://localhost:3000/send-template \
  -H "Content-Type: application/json" \
  -d '{
    "to": "244943302023",
    "template_name": "welcome_message",
    "language": "en_US",
    "components": [
      {
        "type": "body",
        "parameters": [
          {
            "type": "text",
            "text": "João"
          },
          {
            "type": "text", 
            "text": "123456"
          }
        ]
      }
    ]
  }'
```

## 🔧 **Configuração Necessária:**

### **1. Permissões do Token:**
O token precisa ter as seguintes permissões:
- `whatsapp_business_messaging`
- `whatsapp_business_management`

### **2. Configuração no Facebook Developer:**
1. Acesse: https://developers.facebook.com/
2. Vá para seu app > WhatsApp > Configuration
3. Verifique se o token tem as permissões corretas
4. Teste o template no WhatsApp Business Manager

### **3. Variáveis de Ambiente:**
```env
WHATSAPP_ACCESS_TOKEN=seu_token_aqui
PHONE_NUMBER_ID=seu_phone_number_id
WHATSAPP_BUSINESS_ACCOUNT_ID=seu_business_account_id
```

## 📊 **Status dos Templates:**

| Status | Pode Usar? | Descrição |
|--------|-------------|-----------|
| **APPROVED** | ✅ SIM | Template aprovado e pronto para uso |
| **PENDING** | ❌ NÃO | Aguardando aprovação (pode levar 24h) |
| **REJECTED** | ❌ NÃO | Rejeitado - precisa ser corrigido |
| **DISABLED** | ❌ NÃO | Desabilitado pelo administrador |

## 🧪 **Testes Práticos:**

### **1. Listar Templates:**
```bash
curl http://localhost:3000/templates
```

### **2. Verificar Template Específico:**
```bash
curl http://localhost:3000/templates/hello_world
```

### **3. Enviar Template:**
```bash
curl -X POST http://localhost:3000/send-template \
  -H "Content-Type: application/json" \
  -d '{
    "to": "244943302023",
    "template_name": "hello_world",
    "language": "en_US"
  }'
```

## 🎯 **Exemplos de Uso Real:**

### **📱 Mensagem de Boas-vindas:**
```json
{
  "to": "244943302023",
  "template_name": "hello_world",
  "language": "en_US"
}
```

**Resultado:** O usuário receberá:
```
Hello World

Welcome and congratulations!! This message demonstrates your ability to send a WhatsApp message notification from the Cloud API, hosted by Meta. Thank you for taking the time to test with us.

WhatsApp Business Platform sample message
```

### **🔐 Código de Verificação (quando template for aprovado):**
```json
{
  "to": "244943302023",
  "template_name": "welcome_message",
  "language": "en_US",
  "components": [
    {
      "type": "body",
      "parameters": [
        {"type": "text", "text": "João"},
        {"type": "text", "text": "123456"}
      ]
    }
  ]
}
```

**Resultado:** O usuário receberá:
```
Olá João! Bem-vindo ao nosso serviço. Seu código de verificação é 123456.
```

## 🚨 **Problemas Comuns e Soluções:**

### **❌ Erro: "Application does not have permission"**
**Solução:**
1. Verifique se o token tem as permissões corretas
2. Regenerar o token no Facebook Developer Console
3. Aguardar alguns minutos para propagação

### **❌ Erro: "Template name does not exist"**
**Solução:**
1. Verificar se o template está aprovado
2. Usar o nome exato do template
3. Verificar se o idioma está correto

### **❌ Erro: "Template rejected"**
**Solução:**
1. Corrigir o template conforme feedback
2. Aguardar nova aprovação
3. Usar templates aprovados temporariamente

## 📚 **Documentação Swagger:**

### **Acesse a documentação completa:**
```
http://localhost:3000/api-docs
```

### **Endpoints disponíveis:**
- **GET** `/templates` - Listar templates
- **POST** `/templates` - Criar template
- **GET** `/templates/{name}` - Obter template específico
- **POST** `/send-template` - Enviar mensagem com template

## 🎯 **Próximos Passos:**

1. **✅ Use o template `hello_world`** (já aprovado)
2. **⏳ Aguarde aprovação** do `welcome_message`
3. **🔧 Configure permissões** se necessário
4. **📱 Teste com números reais**
5. **📊 Monitore os logs** para verificar funcionamento

---
**📱 WhatsApp Business Templates - Guia Prático**  
*Como usar templates de forma eficiente*

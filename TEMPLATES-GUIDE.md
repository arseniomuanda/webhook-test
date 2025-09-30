# 📋 Guia Completo: Templates do WhatsApp Business

## 🎯 O que são Templates?

Os **templates** são mensagens pré-aprovadas pelo WhatsApp que podem ser enviadas para qualquer usuário, mesmo que não tenha iniciado uma conversa. São essenciais para:

- **📢 Mensagens promocionais** (Marketing)
- **🔐 Códigos de verificação** (Authentication) 
- **📞 Notificações transacionais** (Utility)

## 🚀 Endpoints Disponíveis

### **1. Listar Templates**
```bash
GET /templates
```
**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "name": "hello_world",
      "status": "APPROVED",
      "category": "UTILITY",
      "language": "en_US",
      "components": [...]
    }
  ],
  "total": 1
}
```

### **2. Criar Template**
```bash
POST /templates
```
**Body:**
```json
{
  "name": "welcome_message",
  "category": "UTILITY",
  "language": "en_US",
  "components": [
    {
      "type": "BODY",
      "text": "Olá {{1}}! Bem-vindo ao nosso serviço."
    }
  ]
}
```

### **3. Obter Template Específico**
```bash
GET /templates/{templateName}
```

### **4. Enviar Mensagem com Template**
```bash
POST /send-template
```
**Body:**
```json
{
  "to": "244943302023",
  "template_name": "hello_world",
  "language": "en_US"
}
```

## 📊 Categorias de Templates

### **🔐 AUTHENTICATION**
- Códigos de verificação
- Senhas temporárias
- Confirmações de segurança

**Exemplo:**
```json
{
  "name": "verification_code",
  "category": "AUTHENTICATION",
  "components": [
    {
      "type": "BODY",
      "text": "Seu código de verificação é: {{1}}"
    }
  ]
}
```

### **📢 MARKETING**
- Promoções
- Ofertas especiais
- Novidades de produtos

**Exemplo:**
```json
{
  "name": "promo_offer",
  "category": "MARKETING",
  "components": [
    {
      "type": "HEADER",
      "format": "TEXT",
      "text": "🎉 Oferta Especial!"
    },
    {
      "type": "BODY",
      "text": "Olá {{1}}! Aproveite {{2}}% de desconto em todos os produtos!"
    },
    {
      "type": "BUTTONS",
      "buttons": [
        {
          "type": "URL",
          "text": "Ver Oferta",
          "url": "https://example.com/promo"
        }
      ]
    }
  ]
}
```

### **📞 UTILITY**
- Confirmações de pedidos
- Atualizações de status
- Lembretes de agendamento

**Exemplo:**
```json
{
  "name": "order_confirmation",
  "category": "UTILITY",
  "components": [
    {
      "type": "BODY",
      "text": "Seu pedido #{{1}} foi confirmado e será entregue em {{2}}."
    }
  ]
}
```

## 🧩 Componentes de Templates

### **📝 BODY (Corpo)**
```json
{
  "type": "BODY",
  "text": "Mensagem principal com {{1}} parâmetros"
}
```

### **📋 HEADER (Cabeçalho)**
```json
{
  "type": "HEADER",
  "format": "TEXT",
  "text": "Título da mensagem"
}
```

### **🔗 BUTTONS (Botões)**
```json
{
  "type": "BUTTONS",
  "buttons": [
    {
      "type": "URL",
      "text": "Visitar Site",
      "url": "https://example.com"
    },
    {
      "type": "QUICK_REPLY",
      "text": "Sim"
    }
  ]
}
```

### **📄 FOOTER (Rodapé)**
```json
{
  "type": "FOOTER",
  "text": "Texto do rodapé"
}
```

## 📱 Status dos Templates

| Status | Descrição |
|--------|-----------|
| **PENDING** | Aguardando aprovação |
| **APPROVED** | ✅ Aprovado e pronto para uso |
| **REJECTED** | ❌ Rejeitado (verificar diretrizes) |
| **DISABLED** | ⏸️ Desabilitado |
| **PAUSED** | ⏸️ Pausado temporariamente |
| **PENDING_DELETION** | 🗑️ Aguardando exclusão |
| **DELETED** | 🗑️ Excluído |

## 🧪 Exemplos Práticos

### **1. Template de Boas-vindas**
```bash
curl -X POST http://localhost:3000/templates \
  -H "Content-Type: application/json" \
  -d '{
    "name": "welcome_new_user",
    "category": "UTILITY",
    "language": "en_US",
    "components": [
      {
        "type": "BODY",
        "text": "Olá {{1}}! Bem-vindo à nossa plataforma. Seu ID de usuário é {{2}}."
      }
    ]
  }'
```

### **2. Template de Código de Verificação**
```bash
curl -X POST http://localhost:3000/templates \
  -H "Content-Type: application/json" \
  -d '{
    "name": "verification_code",
    "category": "AUTHENTICATION",
    "language": "en_US",
    "components": [
      {
        "type": "BODY",
        "text": "Seu código de verificação é: {{1}}. Válido por 5 minutos."
      }
    ]
  }'
```

### **3. Template com Botões**
```bash
curl -X POST http://localhost:3000/templates \
  -H "Content-Type: application/json" \
  -d '{
    "name": "survey_request",
    "category": "UTILITY",
    "language": "en_US",
    "components": [
      {
        "type": "BODY",
        "text": "Olá {{1}}! Gostaria de participar da nossa pesquisa de satisfação?"
      },
      {
        "type": "BUTTONS",
        "buttons": [
          {
            "type": "QUICK_REPLY",
            "text": "Sim, participar"
          },
          {
            "type": "QUICK_REPLY",
            "text": "Não, obrigado"
          }
        ]
      }
    ]
  }'
```

## 📤 Enviando Templates

### **Template Simples (sem parâmetros)**
```bash
curl -X POST http://localhost:3000/send-template \
  -H "Content-Type: application/json" \
  -d '{
    "to": "244943302023",
    "template_name": "hello_world",
    "language": "en_US"
  }'
```

### **Template com Parâmetros**
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
          }
        ]
      }
    ]
  }'
```

## 🔧 Configuração no Facebook Developer

### **1. Acesse o Facebook Developer Console**
```
https://developers.facebook.com/
```

### **2. Configure o Webhook**
- **Callback URL:** `https://seu-dominio.com/`
- **Verify Token:** `test_token_123`
- **Webhook Fields:** `messages`, `message_template_status_update`

### **3. Crie Templates**
- Vá para **WhatsApp > Message Templates**
- Clique em **Create Template**
- Preencha os campos obrigatórios
- Aguarde aprovação (pode levar até 24h)

## 📊 Monitoramento

### **Logs de Templates**
```
📋 Templates obtidos: {
  "data": [
    {
      "name": "hello_world",
      "status": "APPROVED",
      "category": "UTILITY"
    }
  ]
}

✅ Template criado: {
  "id": "1050304190373251",
  "status": "PENDING",
  "category": "UTILITY"
}

✅ Mensagem com template enviada: {
  "messaging_product": "whatsapp",
  "contacts": [{"input": "244943302023", "wa_id": "244943302023"}],
  "messages": [{"id": "wamid.HBgMMjQ0OTQz..."}]
}
```

## 🎯 Melhores Práticas

### **✅ Do's**
- Use templates para mensagens importantes
- Mantenha mensagens claras e concisas
- Teste templates antes de usar em produção
- Monitore o status de aprovação

### **❌ Don'ts**
- Não use templates para conversas casuais
- Evite spam com templates de marketing
- Não ignore as diretrizes do WhatsApp
- Não use parâmetros desnecessários

## 🔗 Links Úteis

- **Swagger UI:** http://localhost:3000/api-docs
- **WhatsApp Business API:** https://developers.facebook.com/docs/whatsapp
- **Template Guidelines:** https://developers.facebook.com/docs/whatsapp/message-templates
- **Facebook Developer Console:** https://developers.facebook.com/

---
**📱 WhatsApp Business Templates v1.0.0**  
*Guia completo para gerenciamento de templates*

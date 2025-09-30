# 📋 Exemplo Oficial: Template Seguindo a Documentação Facebook

## 🎯 **Baseado na Documentação Oficial:**
[Facebook Graph API - Message Templates](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#Creating)

## 🚀 **Criando Template Seguindo as Regras Oficiais:**

### **1. Template de Promoção Sazonal (MARKETING)**

```json
{
  "name": "seasonal_promotion",
  "language": "en",
  "category": "MARKETING",
  "components": [
    {
      "type": "HEADER",
      "format": "TEXT",
      "text": "Our {{1}} is on!",
      "example": {
        "header_text": [
          "Summer Sale"
        ]
      }
    },
    {
      "type": "BODY",
      "text": "Shop now through {{1}} and use code {{2}} to get {{3}} off of all merchandise.",
      "example": {
        "body_text": [
          [
            "the end of August","25OFF","25%"
          ]
        ]
      }
    },
    {
      "type": "FOOTER",
      "text": "Use the buttons below to manage your marketing subscriptions"
    },
    {
      "type": "BUTTONS",
      "buttons": [
        {
          "type": "QUICK_REPLY",
          "text": "Unsubscribe from Promos"
        },
        {
          "type": "QUICK_REPLY",
          "text": "Unsubscribe from All"
        }
      ]
    }
  ]
}
```

### **2. Template de Atualização de Pedido (UTILITY)**

```json
{
  "name": "order_delivery_update",
  "language": "en_US",
  "category": "UTILITY",
  "components": [
    {
      "type": "HEADER",
      "format": "LOCATION"
    },
    {
      "type": "BODY",
      "text": "Good news {{1}}! Your order #{{2}} is on its way to the location above. Thank you for your order!",
      "example": {
        "body_text": [
          [
            "Mark",
            "566701"
          ]
        ]
      }
    },
    {
      "type": "FOOTER",
      "text": "To stop receiving delivery updates, tap the button below."
    },
    {
      "type": "BUTTONS",
      "buttons": [
        {
          "type": "QUICK_REPLY",
          "text": "Stop Delivery Updates"
        }
      ]
    }
  ]
}
```

### **3. Template de Código de Verificação (AUTHENTICATION)**

```json
{
  "name": "verification_code",
  "language": "en_US",
  "category": "AUTHENTICATION",
  "components": [
    {
      "type": "BODY",
      "text": "Your verification code is: {{1}}. This code will expire in {{2}} minutes.",
      "example": {
        "body_text": [
          [
            "123456",
            "5"
          ]
        ]
      }
    }
  ]
}
```

## 🧪 **Testando com a API Atualizada (v23.0):**

### **1. Criar Template de Promoção:**
```bash
curl -X POST http://localhost:3000/templates \
  -H "Content-Type: application/json" \
  -d '{
    "name": "seasonal_promotion",
    "language": "en",
    "category": "MARKETING",
    "components": [
      {
        "type": "HEADER",
        "format": "TEXT",
        "text": "Our {{1}} is on!",
        "example": {
          "header_text": [
            "Summer Sale"
          ]
        }
      },
      {
        "type": "BODY",
        "text": "Shop now through {{1}} and use code {{2}} to get {{3}} off of all merchandise.",
        "example": {
          "body_text": [
            [
              "the end of August","25OFF","25%"
            ]
          ]
        }
      },
      {
        "type": "FOOTER",
        "text": "Use the buttons below to manage your marketing subscriptions"
      },
      {
        "type": "BUTTONS",
        "buttons": [
          {
            "type": "QUICK_REPLY",
            "text": "Unsubscribe from Promos"
          },
          {
            "type": "QUICK_REPLY",
            "text": "Unsubscribe from All"
          }
        ]
      }
    ]
  }'
```

### **2. Enviar Template com Parâmetros:**
```bash
curl -X POST http://localhost:3000/send-template \
  -H "Content-Type: application/json" \
  -d '{
    "to": "244943302023",
    "template_name": "seasonal_promotion",
    "language": "en",
    "components": [
      {
        "type": "header",
        "parameters": [
          {
            "type": "text",
            "text": "Black Friday"
          }
        ]
      },
      {
        "type": "body",
        "parameters": [
          {
            "type": "text",
            "text": "December 31st"
          },
          {
            "type": "text",
            "text": "BLACK50"
          },
          {
            "type": "text",
            "text": "50%"
          }
        ]
      }
    ]
  }'
```

## 📊 **Categorias Oficiais:**

### **🔐 AUTHENTICATION**
- Códigos de verificação
- Senhas temporárias
- Confirmações de segurança

### **📢 MARKETING**
- Promoções e ofertas
- Campanhas publicitárias
- Novidades de produtos

### **📞 UTILITY**
- Confirmações de pedidos
- Atualizações de status
- Lembretes de agendamento

## 🧩 **Componentes Oficiais:**

### **📝 HEADER**
```json
{
  "type": "HEADER",
  "format": "TEXT|IMAGE|DOCUMENT|VIDEO|LOCATION",
  "text": "Título da mensagem",
  "example": {
    "header_text": ["Exemplo"]
  }
}
```

### **📋 BODY**
```json
{
  "type": "BODY",
  "text": "Mensagem principal com {{1}} parâmetros",
  "example": {
    "body_text": [
      ["Parâmetro 1", "Parâmetro 2"]
    ]
  }
}
```

### **🔗 BUTTONS**
```json
{
  "type": "BUTTONS",
  "buttons": [
    {
      "type": "QUICK_REPLY",
      "text": "Resposta Rápida"
    },
    {
      "type": "URL",
      "text": "Visitar Site",
      "url": "https://example.com"
    },
    {
      "type": "PHONE_NUMBER",
      "text": "Ligar",
      "phone_number": "+1234567890"
    }
  ]
}
```

### **📄 FOOTER**
```json
{
  "type": "FOOTER",
  "text": "Texto do rodapé"
}
```

## 🔧 **Configuração Atualizada:**

### **Versão da API:**
- **Antes:** v18.0
- **Agora:** v23.0 (seguindo documentação oficial)

### **Endpoints Atualizados:**
- **GET** `/templates` - Listar templates
- **POST** `/templates` - Criar template
- **GET** `/templates/{name}` - Obter template específico
- **POST** `/send-template` - Enviar mensagem com template

## 📚 **Documentação Oficial:**

### **Links Importantes:**
- [Message Templates API](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#Creating)
- [Template Components](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/components)
- [Template Categories](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/#categories)

### **Swagger UI Atualizado:**
```
http://localhost:3000/api-docs
```

## 🎯 **Próximos Passos:**

1. **✅ API atualizada** para v23.0
2. **📋 Teste templates** seguindo documentação oficial
3. **🔧 Configure permissões** corretas
4. **📱 Teste com números reais**
5. **📊 Monitore aprovação** dos templates

---
**📱 WhatsApp Business Templates - Seguindo Documentação Oficial**  
*Implementação baseada na documentação oficial do Facebook*

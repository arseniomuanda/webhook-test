# ✏️ Guia Completo: Como Editar Templates do WhatsApp

## 📋 **Limitações do WhatsApp Business:**

### **🚫 Templates NÃO Podem Ser Editados Diretamente:**
- **APPROVED** - Não pode ser editado (apenas usado)
- **PENDING** - Não pode ser editado (aguardando aprovação)
- **REJECTED** - Não pode ser editado (apenas deletado)

### **✅ Opções Disponíveis:**

## 🛠️ **Métodos para "Editar" Templates:**

### **1. 🗑️ Deletar Template Rejeitado:**

#### **Via API:**
```bash
DELETE /templates/{templateName}
```

#### **Via PowerShell:**
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/templates/welcome_message" -Method DELETE
```

#### **Via cURL:**
```bash
curl -X DELETE http://localhost:3000/templates/welcome_message
```

### **2. 🔄 Recriar Template (Deletar + Criar Novo):**

#### **Via API:**
```bash
POST /templates/{templateName}/recreate
```

#### **Body:**
```json
{
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

#### **Via PowerShell:**
```powershell
$body = @{
    category = "UTILITY"
    language = "en_US"
    components = @(
        @{
            type = "BODY"
            text = "Olá {{1}}! Bem-vindo ao nosso serviço."
        }
    )
} | ConvertTo-Json -Depth 3

Invoke-WebRequest -Uri "http://localhost:3000/templates/welcome_message/recreate" -Method POST -Body $body -ContentType "application/json"
```

### **3. ➕ Criar Novo Template com Nome Diferente:**

#### **Para Templates Aprovados:**
- **Não pode editar** templates aprovados
- **Solução:** Criar novo template com nome diferente
- **Exemplo:** `welcome_message_v2`, `welcome_message_new`

## 🎯 **Cenários de Edição:**

### **🔴 Template REJECTED (Rejeitado):**

#### **Opção 1: Deletar e Recriar**
```bash
# 1. Deletar template rejeitado
curl -X DELETE http://localhost:3000/templates/welcome_message

# 2. Criar novo template corrigido
curl -X POST http://localhost:3000/templates \
  -H "Content-Type: application/json" \
  -d '{
    "name": "welcome_message",
    "category": "UTILITY",
    "language": "en_US",
    "components": [
      {
        "type": "BODY",
        "text": "Olá {{1}}! Bem-vindo ao nosso serviço."
      }
    ]
  }'
```

#### **Opção 2: Recriar Automaticamente**
```bash
curl -X POST http://localhost:3000/templates/welcome_message/recreate \
  -H "Content-Type: application/json" \
  -d '{
    "category": "UTILITY",
    "language": "en_US",
    "components": [
      {
        "type": "BODY",
        "text": "Olá {{1}}! Bem-vindo ao nosso serviço."
      }
    ]
  }'
```

### **🟡 Template PENDING (Pendente):**

#### **Não Pode Ser Editado:**
- **Aguardar aprovação** ou rejeição
- **Se rejeitado:** Usar métodos acima
- **Se aprovado:** Não pode ser editado

### **🟢 Template APPROVED (Aprovado):**

#### **Não Pode Ser Editado:**
- **Apenas usar** para envio de mensagens
- **Para alterar:** Criar novo template com nome diferente

## 📊 **Exemplos Práticos:**

### **1. Corrigir Template Rejeitado:**

#### **Template Original (REJECTED):**
```json
{
  "name": "welcome_message",
  "status": "REJECTED",
  "category": "UTILITY",
  "text": "Olá {{1}}! Bem-vindo ao nosso serviço. Seu código de verificação é {{2}}."
}
```

#### **Problemas Identificados:**
- **Categoria incorreta:** UTILITY vs AUTHENTICATION
- **Conteúdo misto:** Boas-vindas + Verificação
- **Propósito não específico**

#### **Solução: Separar em Dois Templates:**

##### **Template 1: Boas-vindas (UTILITY)**
```json
{
  "name": "welcome_new_user",
  "category": "UTILITY",
  "language": "en_US",
  "components": [
    {
      "type": "BODY",
      "text": "Olá {{1}}! Bem-vindo ao nosso serviço. Estamos aqui para ajudar você."
    },
    {
      "type": "FOOTER",
      "text": "Para suporte, entre em contato conosco."
    }
  ]
}
```

##### **Template 2: Código de Verificação (AUTHENTICATION)**
```json
{
  "name": "verification_code",
  "category": "AUTHENTICATION",
  "language": "en_US",
  "components": [
    {
      "type": "BODY",
      "text": "Seu código de verificação é: {{1}}. Este código expira em {{2}} minutos."
    },
    {
      "type": "FOOTER",
      "text": "Nunca compartilhe este código com terceiros."
    }
  ]
}
```

### **2. Processo de Recriação:**

#### **Passo 1: Deletar Template Rejeitado**
```bash
curl -X DELETE http://localhost:3000/templates/welcome_message
```

#### **Passo 2: Aguardar (2 segundos)**
```javascript
await new Promise(resolve => setTimeout(resolve, 2000));
```

#### **Passo 3: Criar Template Corrigido**
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
        "text": "Olá {{1}}! Bem-vindo ao nosso serviço."
      }
    ]
  }'
```

## 🔧 **Endpoints Disponíveis:**

### **📋 Listar Templates:**
```bash
GET /templates
```

### **➕ Criar Template:**
```bash
POST /templates
```

### **🔍 Obter Template Específico:**
```bash
GET /templates/{templateName}
```

### **🗑️ Deletar Template:**
```bash
DELETE /templates/{templateName}
```

### **🔄 Recriar Template:**
```bash
POST /templates/{templateName}/recreate
```

### **📤 Enviar Mensagem com Template:**
```bash
POST /send-template
```

## 📚 **Documentação Swagger:**

### **Acesse a documentação completa:**
```
http://localhost:3000/api-docs
```

### **Endpoints de Edição:**
- **DELETE** `/templates/{name}` - Deletar template
- **POST** `/templates/{name}/recreate` - Recriar template

## 🎯 **Melhores Práticas:**

### **✅ Antes de Criar Template:**
- **Planejar** estrutura e conteúdo
- **Separar** funcionalidades diferentes
- **Usar categorias** corretas
- **Testar** em ambiente de desenvolvimento

### **✅ Para Templates Rejeitados:**
- **Analisar** motivo da rejeição
- **Corrigir** problemas identificados
- **Separar** funcionalidades mistas
- **Usar categorias** apropriadas

### **✅ Para Templates Aprovados:**
- **Não tentar editar** (não é possível)
- **Criar novo template** se necessário
- **Manter** templates existentes funcionando
- **Documentar** mudanças

## 🚨 **Limitações Importantes:**

### **❌ Não É Possível:**
- **Editar** templates aprovados
- **Editar** templates pendentes
- **Alterar** nome de templates existentes
- **Modificar** templates em uso

### **✅ É Possível:**
- **Deletar** templates rejeitados
- **Recriar** templates com correções
- **Criar** novos templates
- **Usar** templates aprovados

---
**📱 WhatsApp Business Template Editing**  
*Guia completo para gerenciamento de templates*

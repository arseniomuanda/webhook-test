# 📱 Exemplos Práticos: Como Usar Templates

## 🎯 **Seus Templates Disponíveis:**

### **✅ `hello_world` (APROVADO - PODE USAR)**
- **Status:** APPROVED ✅
- **Categoria:** UTILITY
- **Parâmetros:** Nenhum
- **Uso:** Mensagem de boas-vindas padrão

### **❌ `welcome_message` (REJEITADO - NÃO PODE USAR)**
- **Status:** REJECTED ❌
- **Categoria:** UTILITY  
- **Parâmetros:** {{1}} = Nome, {{2}} = Código
- **Uso:** Aguardando nova aprovação

## 🚀 **Exemplos de Uso:**

### **1. 📤 Enviar Template Simples (hello_world)**

#### **Via PowerShell:**
```powershell
$body = @{
    to = "244943302023"
    template_name = "hello_world"
    language = "en_US"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/send-template" -Method POST -Body $body -ContentType "application/json"
```

#### **Via cURL:**
```bash
curl -X POST http://localhost:3000/send-template \
  -H "Content-Type: application/json" \
  -d '{
    "to": "244943302023",
    "template_name": "hello_world",
    "language": "en_US"
  }'
```

#### **Via Swagger UI:**
1. Acesse: `http://localhost:3000/api-docs`
2. Vá para **Templates > POST /send-template**
3. Clique em **Try it out**
4. Cole o JSON:
```json
{
  "to": "244943302023",
  "template_name": "hello_world",
  "language": "en_US"
}
```

### **2. 📋 Listar Todos os Templates**

#### **Via PowerShell:**
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/templates" -Method GET
```

#### **Via cURL:**
```bash
curl http://localhost:3000/templates
```

### **3. 🔍 Verificar Template Específico**

#### **Via PowerShell:**
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/templates/hello_world" -Method GET
```

#### **Via cURL:**
```bash
curl http://localhost:3000/templates/hello_world
```

## 📱 **O que o Usuário Recebe:**

### **Template `hello_world`:**
```
Hello World

Welcome and congratulations!! This message demonstrates your ability to send a WhatsApp message notification from the Cloud API, hosted by Meta. Thank you for taking the time to test with us.

WhatsApp Business Platform sample message
```

## 🧪 **Testes Práticos:**

### **Teste 1: Enviar para +244 943 302 023**
```powershell
$body = @{
    to = "244943302023"
    template_name = "hello_world"
    language = "en_US"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/send-template" -Method POST -Body $body -ContentType "application/json"
```

### **Teste 2: Enviar para +244 923 493 348**
```powershell
$body = @{
    to = "244923493348"
    template_name = "hello_world"
    language = "en_US"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/send-template" -Method POST -Body $body -ContentType "application/json"
```

## 📊 **Respostas Esperadas:**

### **✅ Sucesso:**
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

### **❌ Erro de Permissão:**
```json
{
  "success": false,
  "error": "Failed to send template message",
  "details": {
    "error": {
      "message": "Application does not have permission for this action",
      "type": "OAuthException",
      "code": 10
    }
  }
}
```

### **❌ Template Não Encontrado:**
```json
{
  "success": false,
  "error": "Failed to send template message",
  "details": {
    "error": {
      "message": "Template name does not exist in the translation",
      "type": "OAuthException",
      "code": 132001
    }
  }
}
```

## 🔧 **Solução de Problemas:**

### **Problema: "Application does not have permission"**
**Solução:**
1. Verificar permissões do token no Facebook Developer Console
2. Regenerar o token com permissões corretas
3. Aguardar propagação (alguns minutos)

### **Problema: "Template name does not exist"**
**Solução:**
1. Verificar se o template está aprovado
2. Usar o nome exato: `hello_world`
3. Verificar se o idioma está correto: `en_US`

### **Problema: "Template rejected"**
**Solução:**
1. Aguardar nova aprovação
2. Corrigir o template conforme feedback
3. Usar templates aprovados temporariamente

## 📚 **Documentação Completa:**

### **Swagger UI:**
```
http://localhost:3000/api-docs
```

### **Guias Criados:**
- **`TEMPLATE-USAGE-GUIDE.md`** - Guia completo de uso
- **`TEMPLATE-EXAMPLES.md`** - Exemplos práticos
- **`TEMPLATES-GUIDE.md`** - Documentação técnica

## 🎯 **Próximos Passos:**

1. **✅ Teste o template `hello_world`** (já funcionando)
2. **⏳ Aguarde aprovação** do `welcome_message`
3. **🔧 Configure permissões** se necessário
4. **📱 Teste com números reais**
5. **📊 Monitore os logs** para verificar funcionamento

---
**📱 WhatsApp Business Templates - Exemplos Práticos**  
*Como usar templates de forma eficiente*

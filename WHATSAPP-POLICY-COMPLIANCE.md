# 📋 Conformidade com a Política do WhatsApp Business

## 🚨 **Análise do Template Rejeitado:**

### **Template `welcome_message` (REJECTED):**
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

## 🔍 **Possíveis Violações da Política:**

### **1. 🚫 Violação de Categoria (UTILITY vs AUTHENTICATION)**
**Problema:** Template contém "código de verificação" mas está categorizado como UTILITY
**Solução:** Deve ser categorizado como AUTHENTICATION

### **2. 🚫 Conteúdo Misto (Boas-vindas + Verificação)**
**Problema:** Template mistura duas funcionalidades diferentes
**Solução:** Separar em dois templates distintos

### **3. 🚫 Falta de Contexto Específico**
**Problema:** Template genérico sem propósito claro
**Solução:** Especificar exatamente quando usar

## ✅ **Templates Conformes com a Política:**

### **1. Template de Boas-vindas (UTILITY) - CORRETO:**
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

### **2. Template de Código de Verificação (AUTHENTICATION) - CORRETO:**
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

## 📋 **Regras da Política do WhatsApp Business:**

### **1. 🎯 Categorias Corretas:**

#### **🔐 AUTHENTICATION**
- Códigos de verificação
- Senhas temporárias
- Confirmações de segurança
- **NÃO pode misturar** com outras funcionalidades

#### **📞 UTILITY**
- Confirmações de pedidos
- Atualizações de status
- Lembretes de agendamento
- **NÃO pode incluir** códigos de verificação

#### **📢 MARKETING**
- Promoções e ofertas
- Campanhas publicitárias
- **Requer opt-in** explícito do usuário

### **2. 🚫 Proibições Específicas:**

#### **Conteúdo Proibido:**
- **Spam** ou mensagens não solicitadas
- **Conteúdo ofensivo** ou sexualmente explícito
- **Informações médicas** sem autorização
- **Dados financeiros** sensíveis (números de cartão, contas bancárias)
- **Discriminação** baseada em características pessoais

#### **Uso Proibido:**
- **Impersonação** de outras empresas
- **Atividade criminosa** ou terrorista
- **Produtos ilegais** (drogas, armas, etc.)
- **Jogos de azar** sem licença apropriada

### **3. ✅ Requisitos Obrigatórios:**

#### **Opt-in Explícito:**
- Usuário deve **consentir** em receber mensagens
- **Categorias específicas** de mensagens
- **Instruções claras** de como optar por sair

#### **Perfil de Negócio Completo:**
- **Informações de contato** (email, telefone, website)
- **Informações precisas** e atualizadas
- **Não pode enganar** sobre a natureza do negócio

#### **Janela de 24 Horas:**
- **Respostas livres** dentro de 24h após mensagem do usuário
- **Templates aprovados** para mensagens fora da janela
- **Escalação humana** disponível

## 🛠️ **Como Corrigir Templates Rejeitados:**

### **1. Separar Funcionalidades:**
```json
// ❌ ERRADO - Misto
{
  "text": "Olá {{1}}! Bem-vindo. Seu código é {{2}}."
}

// ✅ CORRETO - Separado
// Template 1: Boas-vindas
{
  "text": "Olá {{1}}! Bem-vindo ao nosso serviço."
}

// Template 2: Verificação
{
  "text": "Seu código de verificação é: {{1}}."
}
```

### **2. Usar Categorias Corretas:**
```json
// ❌ ERRADO
{
  "category": "UTILITY",
  "text": "Código de verificação: {{1}}"
}

// ✅ CORRETO
{
  "category": "AUTHENTICATION",
  "text": "Código de verificação: {{1}}"
}
```

### **3. Adicionar Contexto Específico:**
```json
// ❌ ERRADO - Genérico
{
  "text": "Olá {{1}}! Bem-vindo."
}

// ✅ CORRETO - Específico
{
  "text": "Olá {{1}}! Bem-vindo à nossa plataforma de e-commerce. Sua conta foi criada com sucesso."
}
```

## 📊 **Checklist de Conformidade:**

### **✅ Antes de Criar Template:**
- [ ] **Categoria correta** (AUTHENTICATION, UTILITY, MARKETING)
- [ ] **Propósito específico** e claro
- [ ] **Conteúdo apropriado** para a categoria
- [ ] **Parâmetros necessários** apenas
- [ ] **Linguagem clara** e profissional

### **✅ Durante o Uso:**
- [ ] **Opt-in explícito** do usuário
- [ ] **Respeitar opt-out** imediatamente
- [ ] **Usar apenas templates aprovados**
- [ ] **Manter perfil atualizado**
- [ ] **Fornecer suporte humano**

### **✅ Monitoramento:**
- [ ] **Verificar feedback** dos usuários
- [ ] **Monitorar taxa de bloqueio**
- [ ] **Ajustar conteúdo** conforme necessário
- [ ] **Manter qualidade** das conversas

## 🎯 **Templates Recomendados para Aprovação:**

### **1. Template de Confirmação de Pedido:**
```json
{
  "name": "order_confirmation",
  "category": "UTILITY",
  "language": "en_US",
  "components": [
    {
      "type": "BODY",
      "text": "Seu pedido #{{1}} foi confirmado e será entregue em {{2}}."
    }
  ]
}
```

### **2. Template de Atualização de Status:**
```json
{
  "name": "status_update",
  "category": "UTILITY",
  "language": "en_US",
  "components": [
    {
      "type": "BODY",
      "text": "Seu pedido #{{1}} está {{2}}. Acompanhe em tempo real."
    }
  ]
}
```

### **3. Template de Código de Verificação:**
```json
{
  "name": "verification_code",
  "category": "AUTHENTICATION",
  "language": "en_US",
  "components": [
    {
      "type": "BODY",
      "text": "Seu código de verificação é: {{1}}. Válido por {{2}} minutos."
    },
    {
      "type": "FOOTER",
      "text": "Nunca compartilhe este código."
    }
  ]
}
```

## 📚 **Recursos Oficiais:**

### **Links Importantes:**
- [WhatsApp Business Messaging Policy](https://business.whatsapp.com/policy)
- [Template Guidelines](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates)
- [Best Practices](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/best-practices)

### **Suporte:**
- **Business Help Center** - Para problemas com WhatsApp Business App
- **Policy Enforcement** - Para problemas com WhatsApp Business Platform
- **Developer Support** - Para questões técnicas

---
**📱 WhatsApp Business Policy Compliance**  
*Guia para conformidade com as políticas oficiais*

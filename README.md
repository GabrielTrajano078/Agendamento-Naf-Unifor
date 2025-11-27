# 📅 Sistema de Agendamento NAF - Unifor

Sistema web para agendamento de atendimentos do Núcleo de Apoio Fiscal (NAF) da Universidade de Fortaleza.

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)

---

## ✨ Funcionalidades

### 👤 Usuário
- Cadastro e login
- Agendar atendimentos (presencial ou WhatsApp)
- Visualizar seus agendamentos
- Excluir agendamentos cancelados

### 👨‍💼 Administrador
- Gerenciar todos os agendamentos
- Alterar status (pendente, confirmado, concluído, cancelado)
- Visualizar usuários cadastrados
- Gerenciar tipos de atendimento
- Exportar dados para CSV

---

## 🛠️ Tecnologias

| Frontend | Backend | Banco de Dados |
|----------|---------|----------------|
| React + TypeScript | Node.js + Express | MongoDB Atlas |
| Tailwind CSS | JWT (autenticação) | Mongoose |
| shadcn/ui | bcrypt (senhas) | |

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- Conta no MongoDB Atlas

### 1. Clone o repositório
```bash
git clone https://github.com/GabrielTrajano078/Agendamento-Naf-Unifor.git
cd Agendamento-Naf-Unifor
```

### 2. Configure as variáveis de ambiente

**Frontend (.env na raiz):**
```env
VITE_API_URL=http://localhost:3000/api
```

**Backend (server/.env):**
```env
PORT=3000
MONGO_URI=sua_string_mongodb
JWT_SECRET=sua_chave_secreta
```

### 3. Instale as dependências e execute

**Backend:**
```bash
cd server
npm install
node server.js
```

**Frontend:**
```bash
npm install
npm run dev
```

### 4. Acesse
- **Frontend:** http://localhost:8080
- **Backend:** http://localhost:3000

---

## 👥 Equipe

Desenvolvido por estudantes da **Universidade de Fortaleza (Unifor)**.

---

## 📄 Licença

Este projeto é de uso acadêmico.

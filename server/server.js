// server/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';

// Importando Rotas
import agendamentoRoutes from './routes/agendamentoRoutes.js'; 
import userRoutes from "./routes/userRoutes.js"

// Carrega as variáveis de ambiente do .env
dotenv.config();

const app = express();
// Usa a porta do .env ou assume 3000 como padrão
const PORT = process.env.PORT || 3000; 

// --- Middlewares ---
// Habilita CORS para todas as origens (ok para dev)
app.use(cors()); 
// Habilita o Express a entender JSON no corpo das requisições
app.use(express.json());


// --- Rotas ---
app.get('/', (req, res) => {
  res.send('API do Sistema de Agendamentos Online');
});


app.use('/api/agendamentos', agendamentoRoutes);
app.use('/api/usuarios', userRoutes);

// Rota coringa (404): deve ser a **última**
app.use((req, res) => {
  res.status(404).json({
    erro: 'Rota não encontrada',
    caminho: req.originalUrl
  });
});

// --- Função para Iniciar o Servidor ---

const startServer = async () => {
  try {
    // 1. Tenta conectar ao Banco de Dados PRIMEIRO
    await connectDB(); 
    
    // 2. Se a conexão for bem-sucedida, INICIA o servidor
    app.listen(PORT, () => {
      console.log(`✅ Servidor rodando na porta ${PORT}`);
      console.log(`🔗 Conectado ao MongoDB com sucesso.`);
    });

    
  } catch (error) {
    // 3. Se a conexão com o DB falhar, exibe o erro e encerra
    console.error('❌ Falha ao conectar ao banco de dados.');
    console.error(error);
    process.exit(1); // Encerra o processo com um código de falha
  }
};

// --- Inicia o servidor ---
startServer();
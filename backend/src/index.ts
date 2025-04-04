import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { ProxyNetworkProvider } from '@multiversx/sdk-core/out';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/oracle-challenger')
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Configuração do MultiversX
const networkProvider = new ProxyNetworkProvider(process.env.MULTIVERSX_API_URL || 'https://gateway.multiversx.com');

// Rotas
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Rota para obter o perfil de um usuário
app.get('/api/profile/:address', async (req, res) => {
  try {
    const { address } = req.params;
    // Implementar lógica para obter perfil do blockchain
    res.json({ address, profile: {} });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter perfil' });
  }
});

// Rota para obter o ranking de usuários
app.get('/api/ranking', async (req, res) => {
  try {
    // Implementar lógica para obter ranking do blockchain
    res.json({ users: [] });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter ranking' });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
}); 
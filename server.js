if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const asyncHandler = require('express-async-handler');
const gerarPost = require('./scripts/gerarPost');

const app = express();

// Middlewares globais
app.use(helmet());
app.use(compression());
app.use(morgan('tiny'));

// Arquivos estáticos com cache
app.use(express.static('public', { maxAge: '1d', etag: true }));

// Rota principal
app.get('/post', asyncHandler(async (req, res) => {
  const novoPost = await gerarPost();
  res.json(novoPost);
}));

// Erro genérico
app.use((err, req, res, next) => {
  console.error('Erro geral:', err);
  res.status(500).json({
    erro: 'Erro interno no servidor.',
    detalhe: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));

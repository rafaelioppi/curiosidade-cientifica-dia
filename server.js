if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const asyncHandler = require('express-async-handler');
const path = require('path');
const gerarPost = require('./scripts/gerarPost');

const app = express();

// Helmet com política CSP personalizada
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
    },
  })
);

// Middlewares globais
app.use(compression());
app.use(morgan('tiny'));

// Arquivos estáticos com cache de 1 dia
app.use(express.static('public', { maxAge: '1d', etag: true }));

// Rota raiz para Render não retornar erro 502
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Cache em memória para a rota /post
let cachePost = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 1000 * 60 * 2; // 2 minutos

// Rota principal
app.get('/post', asyncHandler(async (req, res) => {
  const now = Date.now();

  if (cachePost && now - cacheTimestamp < CACHE_DURATION) {
    return res.json(cachePost);
  }

  const novoPost = await gerarPost();
  cachePost = novoPost;
  cacheTimestamp = now;

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

// Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));

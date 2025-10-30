if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const asyncHandler = require('express-async-handler');
const path = require('path');
const fs = require('fs');
const gerarPost = require('./scripts/gerarPost');

const app = express();

// Helmet com política CSP ajustada para permitir estilos e fontes externas
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
    },
  })
);

// Middlewares globais
app.use(compression());
app.use(morgan('tiny'));

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d', etag: true }));

// Rota raiz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para gerar novo post (sem cache)
app.get('/post', asyncHandler(async (req, res) => {
  const novoPost = await gerarPost();
  res.json(novoPost);
}));

// Rota para retornar histórico de posts
app.get('/historico', (req, res) => {
  const filePath = path.join(__dirname, 'data/posts.json');

  if (!fs.existsSync(filePath)) {
    return res.json([]);
  }

  try {
    let posts = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // Ordena do mais recente para o mais antigo
    posts.sort((a, b) => new Date(b.data) - new Date(a.data));

    // Filtro opcional por data: /historico?data=2025-10-30
    const { data } = req.query;
    if (data) {
      posts = posts.filter(post => post.data === data);
    }

    res.json(posts);
  } catch (err) {
    console.error('❌ Erro ao ler histórico:', err.message);
    res.status(500).json({ erro: 'Erro ao ler histórico.' });
  }
});

// Tratamento de erro
app.use((err, req, res, next) => {
  console.error('Erro geral:', err);
  res.status(500).json({
    erro: 'Erro interno no servidor.',
    detalhe: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const asyncHandler = require('express-async-handler');
const path = require('path');
const fs = require('fs');
const gerarPost = require('./scripts/gerarPost');

const app = express();

// 🧠 Permite leitura de JSON no corpo da requisição
app.use(express.json());

// 🔐 Segurança com Helmet e política CSP personalizada
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdn.jsdelivr.net'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:', '*'],

    },
  })
);

// 📁 Garante que a pasta de logs exista
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// 📝 Middleware para registrar IP e rota acessada com horário local
app.use((req, res, next) => {
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  const log = `[${timestamp}] IP: ${ip} - ${req.method} ${req.originalUrl}\n`;

  fs.appendFile(path.join(logDir, 'acessos.log'), log, (err) => {
    if (err) console.error('❌ Erro ao registrar acesso:', err.message);
  });

  next();
});

// 🌐 Middlewares globais
app.use(compression());
app.use(morgan('tiny'));

// 📦 Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',
  etag: true
}));

// 🏠 Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 🧠 Rota para gerar novo post com assunto
const assuntosPadrao = [
  "buracos negros", "inteligência artificial", "física quântica", "DNA", "vacinas",
  "neurociência", "robótica", "energia solar", "células-tronco", "universo",
  "fotossíntese", "engenharia genética", "partículas subatômicas", "tecnologia espacial",
  "big bang", "matéria escura", "antimatéria", "computação quântica", "psicologia",
  "biotecnologia", "astrobiologia", "gravidade", "relatividade", "missões espaciais",
  "nanotecnologia", "biodiversidade", "engenharia aeroespacial", "visão computacional",
  "criptografia", "redes neurais", "economia comportamental", "arqueologia"
];

app.post('/post', asyncHandler(async (req, res) => {
  let assunto = req.body.assunto?.trim();

  if (!assunto) {
    const index = Math.floor(Math.random() * assuntosPadrao.length);
    assunto = assuntosPadrao[index];
    console.log(`🎲 Assunto aleatório selecionado: ${assunto}`);
  }

  try {
    const novoPost = await gerarPost(assunto);

    if (!novoPost || typeof novoPost !== 'object' || !novoPost.conteudo) {
      console.warn('⚠️ Post gerado está vazio ou inválido.');
      return res.status(500).json({ erro: 'Falha ao gerar conteúdo.', assunto });
    }

    res.json(novoPost);
  } catch (err) {
    console.error('❌ Erro ao gerar post:', err.message);
    res.status(500).json({ erro: 'Erro ao gerar post', detalhe: err.message });
  }
  }));


// 📜 Rota para retornar histórico
app.get('/historico', (req, res) => {
  const filePath = path.join(__dirname, 'data/posts.json');

  if (!fs.existsSync(filePath)) {
    return res.json([]);
  }

  try {
    const conteudo = fs.readFileSync(filePath, 'utf-8');

    // Verifica se o conteúdo parece ser HTML (erro comum)
    if (conteudo.trim().startsWith('<')) {
      console.warn('⚠️ Conteúdo inválido detectado no posts.json (HTML encontrado).');
      return res.status(500).json({ erro: 'Arquivo de histórico corrompido. Conteúdo inválido.' });
    }

    let posts = JSON.parse(conteudo);
    if (!Array.isArray(posts)) {
      console.warn('⚠️ posts.json não contém um array.');
      return res.status(500).json({ erro: 'Formato inválido no histórico.' });
    }

    posts.sort((a, b) => new Date(b.data) - new Date(a.data));

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

// 🔍 Rota para visualizar o log no navegador com formatação
app.get('/ver-log', (req, res) => {
  const logPath = path.join(logDir, 'acessos.log');

  if (!fs.existsSync(logPath)) {
    return res.status(404).send('Arquivo de log não encontrado.');
  }

  try {
    const conteudo = fs.readFileSync(logPath, 'utf-8');
    res.setHeader('Content-Type', 'text/html');
    res.send(`<pre>${conteudo}</pre>`);
  } catch (err) {
    console.error('❌ Erro ao ler o log:', err.message);
    res.status(500).send('Erro ao ler o log.');
  }
});

// ⚠️ Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro geral:', err);
  res.status(500).json({
    erro: 'Erro interno no servidor.',
    detalhe: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 🚀 Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

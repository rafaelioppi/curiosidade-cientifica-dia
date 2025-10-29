require('dotenv').config();
const express = require('express');
const app = express();
const gerarPost = require('./scripts/gerarPost'); // função que cria o post dinamicamente

app.use(express.static('public'));

app.get('/post', async (req, res) => {
  try {
    const novoPost = await gerarPost(); // gera novo conteúdo em tempo real
    res.json(novoPost); // envia como JSON
  } catch (err) {
    console.error('❌ Erro ao gerar post:', err.message);
    res.status(500).json({ erro: 'Não foi possível gerar o post do dia.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));

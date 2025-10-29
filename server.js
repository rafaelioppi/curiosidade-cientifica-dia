require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const gerarPost = require('./gerarPost'); // sua função que cria o post dinamicamente

app.use(express.static('public'));

app.get('/post', async (req, res) => {
  try {
    const novoPost = await gerarPost(); // gera novo conteúdo
    res.setHeader('Content-Type', 'application/json');
    res.send(novoPost); // envia diretamente o conteúdo gerado
  } catch (err) {
    console.error('Erro ao gerar post:', err);
    res.status(500).json({ erro: 'Não foi possível gerar o post do dia.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));

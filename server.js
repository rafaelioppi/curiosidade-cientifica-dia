require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.static('public'));

app.get('/post', (req, res) => {
  const postPath = path.join(__dirname, 'posts', 'post-dia.json');
  try {
    const post = fs.readFileSync(postPath, 'utf-8');
    res.setHeader('Content-Type', 'application/json');
    res.send(post);
  } catch (err) {
    res.status(500).json({ erro: 'Não foi possível carregar o post do dia.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));

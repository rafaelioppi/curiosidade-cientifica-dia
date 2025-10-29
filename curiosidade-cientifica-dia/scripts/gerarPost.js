require('dotenv').config();
const fs = require('fs');
const axios = require('axios');

async function gerarPost() {
  const prompt = 'Crie uma curiosidade científica curta e interessante.';

  // 1. Gerar texto com Gemini
  const resposta = await axios.post(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + process.env.GEMINI_API_KEY,
    {
      contents: [{ parts: [{ text: prompt }] }]
    }
  );
  const conteudo = resposta.data.candidates[0].content.parts[0].text;

  // 2. Buscar imagem com Unsplash
  const imagemBusca = await axios.get(
    'https://api.unsplash.com/photos/random',
    {
      params: { query: 'science', orientation: 'landscape' },
      headers: { Authorization: 'Client-ID ' + process.env.UNSPLASH_ACCESS_KEY }
    }
  );
  const imagem = imagemBusca.data.urls.regular;

  // 3. Salvar post com imagem
  const post = {
    data: new Date().toISOString().split('T')[0],
    conteudo,
    imagem
  };
  fs.writeFileSync('./posts/post-dia.json', JSON.stringify(post, null, 2));
}

gerarPost();

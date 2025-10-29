require('dotenv').config();
const fs = require('fs');
const axios = require('axios');

async function gerarPost() {
  const prompt = 'Crie uma curiosidade científica curta e interessante.';
  let conteudo = 'Curiosidade não disponível.';
  let imagem = '';

  // 1. Gerar texto com Gemini
  try {
    const resposta = await axios.post(
      'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=' + process.env.GEMINI_API_KEY,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );
    conteudo = resposta.data.candidates[0].content.parts[0].text;
  } catch (err) {
    console.error('Erro ao gerar texto com Gemini:', err.response?.data?.error?.message || err.message);
  }

  // 2. Buscar imagem com Unsplash
  try {
    const imagemBusca = await axios.get(
      'https://api.unsplash.com/photos/random',
      {
        params: { query: 'science', orientation: 'landscape' },
        headers: { Authorization: 'Client-ID ' + process.env.UNSPLASH_ACCESS_KEY }
      }
    );
    imagem = imagemBusca.data.urls.regular;
  } catch (err) {
    console.error('Erro ao buscar imagem no Unsplash:', err.response?.data?.errors || err.message);
  }

  // 3. Salvar post com imagem
  const post = {
    data: new Date().toISOString().split('T')[0],
    conteudo,
    imagem
  };

  try {
    fs.writeFileSync('./posts/post-dia.json', JSON.stringify(post, null, 2));
    console.log('✅ Post gerado com sucesso!');
  } catch (err) {
    console.error('Erro ao salvar o post:', err.message);
  }
}

gerarPost();

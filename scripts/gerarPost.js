require('dotenv').config();
const axios = require('axios');

async function gerarPost() {
  const prompt = 'Crie uma curiosidade científica curta e interessante.';
  let conteudo = 'Curiosidade não disponível.';
  let imagem = '';

  // 1. Gerar texto com Gemini
  try {
    const resposta = await axios({
      method: 'post',
      url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        key: process.env.GEMINI_API_KEY
      },
      data: {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ]
      }
    });

    const candidates = resposta.data.candidates;
    if (candidates && candidates.length > 0) {
      conteudo = candidates[0].content.parts[0].text;
    }
  } catch (err) {
    console.error('❌ Erro ao gerar texto com Gemini:', err.response?.data?.error?.message || err.message);
  }

  // 2. Buscar imagem com Unsplash
  try {
    const imagemBusca = await axios.get('https://api.unsplash.com/photos/random', {
      params: { query: 'science', orientation: 'landscape' },
      headers: { Authorization: 'Client-ID ' + process.env.UNSPLASH_ACCESS_KEY }
    });
    imagem = imagemBusca.data.urls.regular;
  } catch (err) {
    console.error('❌ Erro ao buscar imagem no Unsplash:', err.response?.data?.errors || err.message);
  }

  // 3. Criar objeto do post
  const post = {
    data: new Date().toISOString().split('T')[0],
    conteudo,
    imagem
  };

  return post;
}

module.exports = gerarPost;

require('dotenv').config();
const axios = require('axios');

// Instância otimizada do axios (reaproveita conexões e define timeouts)
const api = axios.create({
  timeout: 8000, // evita ficar preso em requisições lentas
});

// Função principal
async function gerarPost() {
  const prompt = 'Crie uma curiosidade científica curta e interessante.';
  const post = {
    data: new Date().toISOString().split('T')[0],
    conteudo: 'Curiosidade não disponível.',
    imagem: ''
  };

  // --- 1. Gerar texto com Gemini ---
  try {
    const { data } = await api.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        headers: { 'Content-Type': 'application/json' },
        params: { key: process.env.GEMINI_API_KEY }
      }
    );

    const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (texto) post.conteudo = texto.trim();
  } catch (err) {
    console.error('❌ Erro ao gerar texto com Gemini:', err.response?.data?.error?.message || err.message);
  }

  // --- 2. Buscar imagem com Unsplash ---
  try {
    const { data } = await api.get('https://api.unsplash.com/photos/random', {
      params: { query: 'science', orientation: 'landscape' },
      headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` }
    });
    post.imagem = data?.urls?.regular || '';
  } catch (err) {
    console.error('❌ Erro ao buscar imagem no Unsplash:', err.response?.data?.errors || err.message);
  }

  return post;
}

module.exports = gerarPost;

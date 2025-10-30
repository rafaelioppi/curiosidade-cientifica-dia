require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function gerarPost() {
  const prompt = 'Crie uma curiosidade científica curta e interessante.';
  let conteudo = 'Curiosidade não disponível.';
  let imagem = '';

  // Função para gerar texto com Gemini
  const gerarTextoComGemini = async () => {
    try {
      const resposta = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
        {
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        },
        { params: { key: process.env.GEMINI_API_KEY } }
      );

      const candidates = resposta.data.candidates;
      if (candidates && candidates.length > 0) {
        return candidates[0].content.parts[0].text;
      }
    } catch (err) {
      console.error('❌ Erro ao gerar texto com Gemini:', err.response?.data?.error?.message || err.message);
    }
    return conteudo;
  };

  // Função para buscar imagem do Unsplash
  const buscarImagemUnsplash = async () => {
    try {
      const res = await axios.get('https://api.unsplash.com/photos/random', {
        params: { query: 'science', orientation: 'landscape' },
        headers: { Authorization: 'Client-ID ' + process.env.UNSPLASH_ACCESS_KEY }
      });
      return res.data.urls.regular;
    } catch (err) {
      console.error('❌ Erro ao buscar imagem no Unsplash:', err.response?.data?.errors || err.message);
      return '';
    }
  };

  // Executa as duas requisições em paralelo
  [conteudo, imagem] = await Promise.all([gerarTextoComGemini(), buscarImagemUnsplash()]);

  const post = {
    data: new Date().toISOString().split('T')[0],
    conteudo,
    imagem
  };

  // Caminho do arquivo de histórico
  const filePath = path.join(__dirname, '../data/posts.json');

  try {
    let historico = [];

    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      historico = JSON.parse(raw);
    }

    historico.push(post);

    fs.writeFileSync(filePath, JSON.stringify(historico, null, 2));
  } catch (err) {
    console.error('❌ Erro ao salvar post no histórico:', err.message);
  }

  return post;
}

module.exports = gerarPost;

require('dotenv').config();
console.log("🔑 GEMINI_API_KEY está definida?", !!process.env.GEMINI_API_KEY);
const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function gerarPost(assunto = '') {
  const tema = assunto.trim() ? ` sobre ${assunto.trim()}` : '';
  const prompt = `Crie uma curiosidade científica curta e interessante${tema}.`;
  let conteudo = 'Curiosidade não disponível.';
  let imagem = '';

  // 🔬 Gerar texto com Gemini
  const gerarTextoComGemini = async () => {
    try {
      const resposta = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
        { contents: [{ role: 'user', parts: [{ text: prompt }] }] },
        { params: { key: process.env.GEMINI_API_KEY } }
      );

      console.log("🔍 Resposta Gemini:", JSON.stringify(resposta.data, null, 2));

      const candidates = resposta.data?.candidates;
      const texto = candidates?.[0]?.content?.parts?.[0]?.text;

      if (texto && typeof texto === 'string' && texto.trim().length > 0) {
        return `${texto.trim()}\n\n🔬 Fonte: Gemini (Google AI)`;
      }
    } catch (err) {
      console.error('❌ Erro ao gerar texto com Gemini:', err.response?.data?.error?.message || err.message);
    }
    return conteudo;
  };

  // 🖼️ Buscar imagem do Unsplash
  const buscarImagemUnsplash = async () => {
    try {
      const res = await axios.get('https://api.unsplash.com/photos/random', {
        params: { query: assunto || 'science', orientation: 'landscape' },
        headers: { Authorization: 'Client-ID ' + process.env.UNSPLASH_ACCESS_KEY }
      });
      return res.data?.urls?.regular || '';
    } catch (err) {
      console.error('❌ Erro ao buscar imagem no Unsplash:', err.response?.data?.errors || err.message);
      return '';
    }
  };

  // 🚀 Executa em paralelo
  [conteudo, imagem] = await Promise.all([gerarTextoComGemini(), buscarImagemUnsplash()]);

  // Data no horário de SP
  const dataSP = new Date().toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' });

  const post = {
    data: dataSP,
    conteudo,
    imagem,
    timestamp: Date.now()
  };

  // 📁 Salvar histórico
  const historicoPath = path.join(__dirname, '../data/posts.json');
  try {
    let historico = [];
    if (fs.existsSync(historicoPath)) {
      historico = JSON.parse(fs.readFileSync(historicoPath, 'utf-8'));
    }
    historico.push(post);
    fs.writeFileSync(historicoPath, JSON.stringify(historico, null, 2));
    console.log("📜 Histórico salvo com sucesso. Total de posts:", historico.length);
  } catch (err) {
    console.error('❌ Erro ao salvar no histórico:', err.message);
  }

  return post;
}

// ✅ Executa automaticamente se chamado diretamente
if (require.main === module) {
  gerarPost().then(post => {
    console.log("✅ Post gerado com sucesso:");
    console.log(post);
  });
}

module.exports = gerarPost;

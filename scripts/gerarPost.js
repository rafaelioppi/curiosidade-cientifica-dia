

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 🔍 Verificar variáveis de ambiente
if (!process.env.GEMINI_API_KEY || !process.env.UNSPLASH_ACCESS_KEY) {
  console.error("❌ Variáveis de ambiente não definidas corretamente.");
  process.exit(1);
}

// 🔬 Função para gerar curiosidade com Gemini
async function gerarTextoComGemini(prompt) {
  try {
    const resposta = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      { contents: [{ role: 'user', parts: [{ text: prompt }] }] },
      { params: { key: process.env.GEMINI_API_KEY } }
    );
    const texto = resposta.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (texto && typeof texto === 'string' && texto.trim().length > 0) {
      return `${texto.trim()}\n\n🔬 Fonte: Gemini (Google AI)`;
    }
  } catch (err) {
    console.error('❌ Erro ao gerar texto com Gemini:', err.response?.data?.error?.message || err.message);
  }
  return 'Curiosidade não disponível.';
}

// 🖼️ Função para buscar imagem no Unsplash
async function buscarImagemUnsplash(assunto) {
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
}

// 🧠 Lista de assuntos científicos
const assuntos = [/* ... seus 120 assuntos ... */]; // mantido como está

// 📁 Caminho do histórico
const historicoDir = path.join(__dirname, 'data');
const historicoPath = path.join(historicoDir, 'posts.json');

// 🚀 Função principal
(async () => {
  if (!fs.existsSync(historicoDir)) {
    fs.mkdirSync(historicoDir);
  }

  let historico = [];
  if (fs.existsSync(historicoPath)) {
    historico = JSON.parse(fs.readFileSync(historicoPath, 'utf-8'));
  }

  for (const assunto of assuntos) {
    console.log(`🔄 Gerando post sobre: ${assunto}`);
    const prompt = `Crie uma curiosidade científica curta e interessante sobre ${assunto}.`;
    const conteudo = await gerarTextoComGemini(prompt);
    const imagem = await buscarImagemUnsplash(assunto);
    const dataSP = new Date().toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' });

    historico.push({
      data: dataSP,
      assunto,
      conteudo,
      imagem,
      timestamp: Date.now()
    });

    // Salvar após cada post para evitar perda em caso de erro
    fs.writeFileSync(historicoPath, JSON.stringify(historico, null, 2));
  }

  console.log("✅ Todos os posts foram gerados e salvos. Total:", historico.length);
})();

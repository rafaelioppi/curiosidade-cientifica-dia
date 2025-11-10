require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 🔍 Verificar variável obrigatória
if (!process.env.GEMINI_API_KEY || !process.env.UNSPLASH_ACCESS_KEY) {
  console.error("❌ Variáveis de ambiente não definidas: GEMINI_API_KEY ou UNSPLASH_API_KEY.");
  process.exit(1);
}

// 📁 Caminho do histórico
const historicoDir = path.join(__dirname, '../data');
const historicoPath = path.join(historicoDir, 'posts.json');

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
      params: { query: assunto || 'science' },
      headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` }
    });
    return res.data?.urls?.regular || '';
  } catch (err) {
    console.error('❌ Erro ao buscar imagem no Unsplash:', err.message);
    return '';
  }
}

// 🚀 Função principal para gerar um post
async function gerarPost(assunto = '') {
  const tema = assunto.trim() ? ` sobre ${assunto.trim()}` : '';
  const prompt = `Crie uma curiosidade científica curta e interessante${tema}.`;
  const conteudo = await gerarTextoComGemini(prompt);
  const imagem = await buscarImagemUnsplash(assunto);
  const dataSP = new Date().toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' });

  const post = {
    data: dataSP,
    assunto,
    conteudo,
    imagem,
    timestamp: Date.now()
  };

  try {
    if (!fs.existsSync(historicoDir)) {
      fs.mkdirSync(historicoDir);
    }

    let historico = [];

    if (fs.existsSync(historicoPath)) {
      const conteudoBruto = fs.readFileSync(historicoPath, 'utf-8').trim();

      if (conteudoBruto === '') {
        console.warn('⚠️ Arquivo de histórico vazio. Inicializando com array vazio.');
        historico = [];
      } else if (conteudoBruto.startsWith('<')) {
        console.warn('⚠️ Conteúdo inválido detectado no histórico (HTML encontrado). Ignorando.');
        historico = [];
      } else {
        try {
          historico = JSON.parse(conteudoBruto);
          if (!Array.isArray(historico)) {
            console.warn('⚠️ Histórico não é um array. Recriando.');
            historico = [];
          }
        } catch (parseErr) {
          console.error('❌ Erro ao interpretar histórico JSON:', parseErr.message);
          historico = [];
        }
      }
    }

    historico.push(post);
    fs.writeFileSync(historicoPath, JSON.stringify(historico, null, 2));
    console.log("📜 Histórico salvo com sucesso. Total de posts:", historico.length);
  } catch (err) {
    console.error('❌ Erro ao salvar no histórico:', err.message);
  }

  return post;
}

// ✅ Lista de assuntos
const assuntos = [ /* ... mesma lista de assuntos ... */ ];

// 🚀 Executa sempre que o script for chamado diretamente
if (require.main === module) {
  const assuntoAleatorio = assuntos[Math.floor(Math.random() * assuntos.length)];
  gerarPost(assuntoAleatorio).then(post => {
    console.log("🧠 Curiosidade gerada:", post.conteudo);
  });
}

module.exports = gerarPost;

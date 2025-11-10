require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 🔍 Verificar variável obrigatória
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ Variável GEMINI_API_KEY não definida.");
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

// 🖼️ Função para buscar imagem no Openverse
async function buscarImagemOpenverse(assunto) {
  try {
    const res = await axios.get('https://api.openverse.engineering/v1/images', {
      params: {
        q: assunto || 'science',
        license: 'cc0,pdm,by',
        page_size: 1
      }
    });

    const resultados = res.data?.results;
    if (resultados && resultados.length > 0) {
      return resultados[0].url || '';
    } else {
      console.warn('⚠️ Nenhuma imagem encontrada no Openverse para:', assunto);
      return '';
    }
  } catch (err) {
    console.error('❌ Erro ao buscar imagem no Openverse:', err.response?.data?.message || err.message);
    return '';
  }
}

// 🚀 Função principal para gerar um post
async function gerarPost(assunto = '') {
  const tema = assunto.trim() ? ` sobre ${assunto.trim()}` : '';
  const prompt = `Crie uma curiosidade científica curta e interessante${tema}.`;
  const conteudo = await gerarTextoComGemini(prompt);
  const imagem = await buscarImagemOpenverse(assunto);
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
      historico = JSON.parse(fs.readFileSync(historicoPath, 'utf-8'));
    }

    // 🔥 Removido o bloqueio de postagens múltiplas por dia
    historico.push(post);
    fs.writeFileSync(historicoPath, JSON.stringify(historico, null, 2));
    console.log("📜 Histórico salvo com sucesso. Total de posts:", historico.length);
  } catch (err) {
    console.error('❌ Erro ao salvar no histórico:', err.message);
  }

  return post;
}


// ✅ Lista de assuntos
const assuntos = [
  "buracos negros", "inteligência artificial", "evolução humana", "física quântica", "neurociência",
  "teoria das cordas", "energia escura", "matéria escura", "DNA", "RNA", "vacinas", "imunologia",
  "cérebro", "memória", "sono", "sonhos", "gravidade", "relatividade", "tempo", "espaço",
  "universo", "galáxias", "estrelas", "planetas", "exoplanetas", "vida extraterrestre",
  "astrobiologia", "biotecnologia", "engenharia genética", "clonagem", "células-tronco",
  "fotossíntese", "ecossistemas", "biodiversidade", "extinção", "mudanças climáticas",
  "aquecimento global", "camada de ozônio", "oceano", "correntes marítimas", "vulcões",
  "terremotos", "placas tectônicas", "meteorologia", "raios", "tornados", "furacões",
  "energia solar", "energia eólica", "energia nuclear", "fusão nuclear", "fissão nuclear",
  "partículas subatômicas", "aceleradores de partículas", "bóson de Higgs", "antimatéria",
  "computação quântica", "robótica", "nanotecnologia", "materiais inteligentes", "óptica",
  "laser", "termodinâmica", "entropia", "eletricidade", "magnetismo", "eletromagnetismo",
  "ondas gravitacionais", "tecnologia espacial", "foguetes", "satélites", "GPS", "ISS",
  "missões espaciais", "Marte", "Lua", "Júpiter", "Saturno", "Urano", "Netuno", "Plutão",
  "cometas", "asteroides", "meteoritos", "big bang", "cosmologia", "tempo profundo",
  "arqueologia", "antropologia", "linguística", "psicologia", "sociologia", "economia comportamental",
  "matemática", "álgebra", "geometria", "cálculo", "estatística", "probabilidade", "teoria dos jogos",
  "criptografia", "segurança digital", "internet", "redes neurais", "machine learning",
  "deep learning", "visão computacional", "biometria", "engenharia elétrica", "engenharia civil",
  "engenharia mecânica", "engenharia aeroespacial", "engenharia ambiental", "engenharia de materiais"
];
// ✅ Executa apenas 1 post por dia
// 🚀 Executa sempre que o script for chamado diretamente
if (require.main === module) {
  const assuntoAleatorio = assuntos[Math.floor(Math.random() * assuntos.length)];
  gerarPost(assuntoAleatorio).then(post => {
    console.log("🧠 Curiosidade gerada:", post.conteudo);
  });
}

module.exports = gerarPost;

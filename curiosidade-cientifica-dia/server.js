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

  // 2. Buscar imagem relacionada (usando termo genérico ou baseado no texto)
  const termoImagem = 'curiosidade científica';
  const imagemBusca = await axios.get(`https://api.bing.microsoft.com/v7.0/images/search?q=${encodeURIComponent(termoImagem)}&count=1`, {
    headers: { 'Ocp-Apim-Subscription-Key': process.env.BING_API_KEY }
  });
  const imagem = imagemBusca.data.value[0]?.contentUrl || '';

  // 3. Salvar post com imagem
  const post = {
    data: new Date().toISOString().split('T')[0],
    conteudo,
    imagem
  };
  fs.writeFileSync('./posts/post-dia.json', JSON.stringify(post, null, 2));
}

gerarPost();

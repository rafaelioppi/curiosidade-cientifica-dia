async function carregarHistorico() {
  try {
    const res = await fetch('/historico');
    const posts = await res.json();

    for (const post of posts) {
      adicionarPostNaPagina(post, false);
    }
  } catch (err) {
    console.error('❌ Erro ao carregar histórico:', err);
  }
}

async function carregarCuriosidade() {
  const loaderSpinner = document.getElementById('loader-spinner');
  const loaderText = document.getElementById('loader-text');
  const botaoNova = document.getElementById('btn-nova');

  loaderSpinner.style.display = 'block';
  loaderText.style.display = 'block';
  botaoNova.style.display = 'none';

  const marcador = document.createElement('div');
  marcador.id = 'marcador-scroll';
  const conteudoEl = document.getElementById('conteudo');
  conteudoEl.insertBefore(marcador, conteudoEl.firstChild);
  marcador.scrollIntoView({ behavior: 'smooth', block: 'start' });

  try {
    const res = await fetch('/post', { cache: 'no-store' });
    if (!res.ok) throw new Error('Erro HTTP ' + res.status);

    const post = await res.json();
    adicionarPostNaPagina(post, true);
  } catch (err) {
    console.error('❌ Erro ao carregar curiosidade:', err);
    const hoje = new Date();
    const dataFallback = hoje.toISOString().split('T')[0];
    adicionarPostNaPagina({
      data: dataFallback,
      conteudo: 'Erro ao carregar a curiosidade científica.',
      imagem: ''
    }, true);
  } finally {
    loaderSpinner.style.display = 'none';
    loaderText.style.display = 'none';
    const marcador = document.getElementById('marcador-scroll');
    if (marcador) marcador.remove();
  }
}

function adicionarPostNaPagina({ data, conteudo, imagem }, rolar = false) {
  const conteudoEl = document.getElementById('conteudo');

  const postCard = document.createElement('div');
  postCard.className = 'card';

  const texto = document.createElement('p');
  const [ano, mes, dia] = data.split('-');
  const dataFormatada = `${dia}/${mes}/${ano}`;
  const horaFormatada = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  texto.textContent = `${dataFormatada} ${horaFormatada} — ${conteudo}`;
  postCard.appendChild(texto);

  if (imagem) {
    const img = document.createElement('img');
    img.src = imagem;
    img.alt = 'Imagem da curiosidade científica';
    img.className = 'imagem-post';
    postCard.appendChild(img);
  }

  // Insere o novo card no topo da lista
  conteudoEl.insertBefore(postCard, conteudoEl.firstChild);

  // Exibe o botão após adicionar a curiosidade
  if (rolar) {
    const botaoNova = document.getElementById('btn-nova');
    if (botaoNova) botaoNova.style.display = 'inline-block';
  }
}

// Inicializa ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  carregarHistorico();
  carregarCuriosidade();
});

// Ativa o botão para gerar nova curiosidade
const botaoNova = document.getElementById('btn-nova');
if (botaoNova) {
  botaoNova.addEventListener('click', carregarCuriosidade);
}

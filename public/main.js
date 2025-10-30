let todosOsPosts = [];

function renderizarGrupos(posts) {
  const conteudoEl = document.getElementById('conteudo');
  conteudoEl.innerHTML = ''; // limpa todos os grupos

  for (let i = 0; i < posts.length; i += 2) {
    const grupo = posts.slice(i, i + 2);
    adicionarGrupoNaPagina(grupo);
  }
}

async function carregarHistorico() {
  try {
    const res = await fetch('/historico');
    todosOsPosts = await res.json();
    renderizarGrupos(todosOsPosts);
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
    todosOsPosts.unshift(post); // adiciona ao início
    renderizarGrupos(todosOsPosts);
  } catch (err) {
    console.error('❌ Erro ao carregar curiosidade:', err);
    const hoje = new Date();
    const dataFallback = hoje.toISOString().split('T')[0];
    const postErro = {
      data: dataFallback,
      conteudo: 'Erro ao carregar a curiosidade científica.',
      imagem: ''
    };
    todosOsPosts.unshift(postErro);
    renderizarGrupos(todosOsPosts);
  } finally {
    loaderSpinner.style.display = 'none';
    loaderText.style.display = 'none';
    const marcador = document.getElementById('marcador-scroll');
    if (marcador) marcador.remove();

    const botaoNova = document.getElementById('btn-nova');
    if (botaoNova) botaoNova.style.display = 'inline-block';
  }
}

function adicionarGrupoNaPagina(grupo) {
  const conteudoEl = document.getElementById('conteudo');

  const grupoContainer = document.createElement('div');
  grupoContainer.className = 'grupo-posts';

  for (const post of grupo) {
    const postCard = document.createElement('div');
    postCard.className = 'card';

    const texto = document.createElement('p');
    const [ano, mes, dia] = post.data.split('-');
    const dataFormatada = `${dia}/${mes}/${ano}`;
    const horaFormatada = new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    texto.textContent = `${dataFormatada} ${horaFormatada} — ${post.conteudo}`;
    postCard.appendChild(texto);

    if (post.imagem) {
      const img = document.createElement('img');
      img.src = post.imagem;
      img.alt = 'Imagem da curiosidade científica';
      img.className = 'imagem-post';
      postCard.appendChild(img);
    }

    grupoContainer.appendChild(postCard);
  }

  conteudoEl.appendChild(grupoContainer);
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

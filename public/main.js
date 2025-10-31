let todosOsPosts = [];

function renderizarPosts(posts) {
  const conteudoEl = document.getElementById('conteudo');
  conteudoEl.innerHTML = '';

  posts.forEach(post => {
    const col = document.createElement('div');
    col.className = 'col-card';

    const card = document.createElement('div');
    card.className = 'card';

    const wrapper = document.createElement('div');
    wrapper.className = 'card-content-wrapper';

    // Data e hora formatada
    if (post.data) {
      const dataOriginal = new Date(post.data);
      const dataBR = dataOriginal.toLocaleString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'America/Sao_Paulo'
      });

      const dataEl = document.createElement('p');
      dataEl.className = 'card-date';
      dataEl.textContent = dataBR.replace(' de ', ' • '); // ex: "30 out • 14:30"
      dataEl.style.fontSize = '0.85rem';
      dataEl.style.color = '#555';
      dataEl.style.marginBottom = '0.5rem';
      wrapper.appendChild(dataEl);
    }

    // Texto do post
    const texto = document.createElement('p');
    texto.className = 'card-text';
    texto.textContent = post.conteudo;
    wrapper.appendChild(texto);

    // Imagem, se houver
    if (post.imagem) {
      const img = document.createElement('img');
      img.src = post.imagem;
      img.alt = 'Imagem da curiosidade';
      img.className = 'imagem-post';
      wrapper.appendChild(img);
    }

    card.appendChild(wrapper);
    col.appendChild(card);
    conteudoEl.appendChild(col);
  });
}

// Carregar histórico
async function carregarHistorico() {
  try {
    const res = await fetch('/historico');
    if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
    todosOsPosts = await res.json();
    renderizarPosts(todosOsPosts);
  } catch (err) {
    console.error('❌ Erro ao carregar histórico:', err);
  }
}

// Carregar nova curiosidade
async function carregarCuriosidade() {
  const loaderWrapper = document.getElementById('loader-wrapper');
  const botaoNova = document.getElementById('btn-nova');

  loaderWrapper.style.display = 'block';
  botaoNova.style.display = 'none';

  try {
    const res = await fetch('/post', { cache: 'no-store' });
    if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
    const post = await res.json();
    todosOsPosts.unshift(post);
    renderizarPosts(todosOsPosts);
  } catch (err) {
    console.error('❌ Erro ao carregar curiosidade:', err);
  } finally {
    loaderWrapper.style.display = 'none';
    botaoNova.style.display = 'inline-block';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  carregarHistorico();
  document.getElementById('btn-nova').addEventListener('click', carregarCuriosidade);
});

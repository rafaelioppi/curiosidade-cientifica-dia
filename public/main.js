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
      dataEl.textContent = dataBR.replace(' de ', ' • ');
      dataEl.style.fontSize = '0.85rem';
      dataEl.style.color = '#555';
      dataEl.style.marginBottom = '0.5rem';
      wrapper.appendChild(dataEl);
    }

    // ✅ Assunto, se disponível
    if (post.assunto) {
      const assuntoEl = document.createElement('p');
      assuntoEl.className = 'card-assunto';
      assuntoEl.textContent = `🧠 Assunto: ${post.assunto}`;
      assuntoEl.style.fontWeight = 'bold';
      assuntoEl.style.marginBottom = '0.5rem';
      wrapper.appendChild(assuntoEl);
    }

    // Texto do post (com quebras de linha preservadas)
    const texto = document.createElement('p');
    texto.className = 'card-text';
    texto.innerHTML = post.conteudo.replace(/\n/g, '<br>');
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

// Carregar nova curiosidade com assunto
async function carregarCuriosidade() {
  const loaderWrapper = document.getElementById('loader-wrapper');
  const botaoNova = document.getElementById('btn-nova');
  const campoAssunto = document.getElementById('campo-assunto');
  const assunto = campoAssunto?.value?.trim() || '';

  loaderWrapper.style.display = 'block';
  botaoNova.style.display = 'none';

  try {
    const res = await fetch('/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assunto }),
      cache: 'no-store'
    });

    if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
    const post = await res.json();
    todosOsPosts.unshift(post);
    renderizarPosts(todosOsPosts);

    // ✅ Preencher campo com o assunto usado
    if (post.assunto && campoAssunto) {
      campoAssunto.value = post.assunto;
    }
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

async function carregarHistorico() {
  try {
    const res = await fetch('/historico');
    const posts = await res.json();

    for (const post of posts) {
      adicionarPostNaPagina(post, false); // não rola ao carregar histórico
    }
  } catch (err) {
    console.error('❌ Erro ao carregar histórico:', err);
  }
}

async function carregarCuriosidade() {
  const loaderSpinner = document.getElementById('loader-spinner');
  const loaderText = document.getElementById('loader-text');

  loaderSpinner.style.display = 'block';
  loaderText.style.display = 'block';

  try {
    const res = await fetch('/post', { cache: 'no-store' });
    if (!res.ok) throw new Error('Erro HTTP ' + res.status);

    const post = await res.json();
    adicionarPostNaPagina(post, true); // rola ao adicionar nova curiosidade
  } catch (err) {
    console.error('❌ Erro ao carregar curiosidade:', err);
    adicionarPostNaPagina({
      data: new Date().toISOString().split('T')[0],
      conteudo: 'Erro ao carregar a curiosidade científica.',
      imagem: ''
    }, true);
  } finally {
    loaderSpinner.style.display = 'none';
    loaderText.style.display = 'none';
  }
}

function adicionarPostNaPagina({ data, conteudo, imagem }, rolar = false) {
  const conteudoEl = document.getElementById('conteudo');

  const postCard = document.createElement('div');
  postCard.className = 'card';

  const texto = document.createElement('p');
  const agora = new Date();
  const horaFormatada = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const [ano, mes, dia] = data.split('-');
  const dataFormatada = `${dia}/${mes}/${ano}`;

  texto.textContent = `${dataFormatada} ${horaFormatada} — ${conteudo}`;
  postCard.appendChild(texto);

  if (imagem) {
    const img = document.createElement('img');
    img.src = imagem;
    img.alt = 'Imagem da curiosidade científica';
    img.className = 'imagem-post';
    postCard.appendChild(img);
  }

  conteudoEl.appendChild(postCard);

  if (rolar) {
    rolarParaUltimoCard();
  }
}

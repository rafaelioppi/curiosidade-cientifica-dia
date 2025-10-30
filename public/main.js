async function carregarCuriosidade() {
  const textoEl = document.getElementById('texto');
  const imagemEl = document.getElementById('imagem');
  const cardImagem = document.getElementById('card-imagem');
  const loaderSpinner = document.getElementById('loader-spinner');
  const loaderText = document.getElementById('loader-text');

  // Mostrar animações de carregamento
  loaderSpinner.style.display = 'block';
  loaderText.style.display = 'block';
  textoEl.textContent = '';
  cardImagem.hidden = true;

  try {
    const res = await fetch('/post', { cache: 'no-store' });
    if (!res.ok) throw new Error('Erro HTTP ' + res.status);

    const { conteudo, imagem } = await res.json();

    textoEl.textContent = conteudo || 'Curiosidade não disponível.';

    if (imagem) {
      imagemEl.src = imagem;
      imagemEl.loading = 'lazy';
      cardImagem.hidden = false;
    } else {
      cardImagem.hidden = true;
    }
  } catch (err) {
    console.error('❌ Erro ao carregar curiosidade:', err);
    textoEl.textContent = 'Erro ao carregar a curiosidade científica.';
    cardImagem.hidden = true;
  } finally {
    // Esconder animações de carregamento
    loaderSpinner.style.display = 'none';
    loaderText.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', carregarCuriosidade);

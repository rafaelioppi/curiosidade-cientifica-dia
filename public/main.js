async function carregarCuriosidade() {
  const textoEl = document.getElementById('texto');
  const imagemEl = document.getElementById('imagem');

  try {
    const res = await fetch('/post', { cache: 'no-store' });
    if (!res.ok) throw new Error('Erro HTTP ' + res.status);

    const { conteudo, imagem } = await res.json();

    textoEl.textContent = conteudo || 'Curiosidade não disponível.';

    if (imagem) {
      imagemEl.src = imagem;
      imagemEl.loading = 'lazy';
      imagemEl.hidden = false;
    } else {
      imagemEl.hidden = true;
    }
  } catch (err) {
    console.error('❌ Erro ao carregar curiosidade:', err);
    textoEl.textContent = 'Erro ao carregar a curiosidade científica.';
    imagemEl.hidden = true;
  }
}

document.addEventListener('DOMContentLoaded', carregarCuriosidade);

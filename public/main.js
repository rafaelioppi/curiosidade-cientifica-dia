async function carregarCuriosidade() {
  const conteudoEl = document.getElementById('conteudo');
  const imagemEl = document.getElementById('imagem');

  try {
    const res = await fetch('/post', { cache: 'no-store' });
    if (!res.ok) throw new Error('Erro HTTP ' + res.status);

    const data = await res.json();
    conteudoEl.textContent = data.conteudo || 'Curiosidade não disponível.';

    if (data.imagem) {
      imagemEl.src = data.imagem;
      imagemEl.loading = 'lazy';
      imagemEl.removeAttribute('hidden'); // mostra a imagem
    } else {
      imagemEl.setAttribute('hidden', ''); // esconde a imagem
    }
  } catch (err) {
    console.error('❌ Erro ao carregar curiosidade:', err);
    conteudoEl.textContent = 'Erro ao carregar a curiosidade científica.';
    imagemEl.setAttribute('hidden', '');
  }
}

document.addEventListener('DOMContentLoaded', carregarCuriosidade);

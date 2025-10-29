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
      imagemEl.style.display = 'block';
      imagemEl.loading = 'lazy';
    } else {
      imagemEl.style.display = 'none';
    }
  } catch (err) {
    console.error('❌ Erro ao carregar curiosidade:', err);
    conteudoEl.textContent = 'Erro ao carregar a curiosidade científica.';
    imagemEl.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', carregarCuriosidade);

# 🧪 Curiosidade Científica do Dia

[![Deploy on Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

> “A ciência não é só feita de grandes descobertas. Às vezes, uma boa curiosidade é o que acende a faísca.” — Rafael Ioppi

Este projeto é uma máquina de curiosidades. Todos os dias, ele acorda cedo, conversa com uma IA, busca uma imagem inspiradora e publica uma curiosidade científica novinha em folha. Tudo isso sem que você precise levantar da cama.

---

## 🌐 O que ele faz

- 🧠 Gera um texto curto e curioso com a ajuda do **Gemini 2.5 Flash**
- 🖼️ Escolhe uma imagem aleatória e temática via **Unsplash API**
- 📦 Salva o conteúdo em dois arquivos:
  - `public/posts/post-dia.json` → o post do dia
  - `data/posts.json` → o histórico completo
- 🤖 Executa automaticamente todos os dias às 6h da manhã (horário de Brasília) via **GitHub Actions**
- 🔐 Faz push para o repositório usando um **token pessoal (GH_PAT)**

---

## 🛠️ Tecnologias e APIs

| Ferramenta     | Função                  |
|----------------|-------------------------|
| Node.js        | Execução do script      |
| Gemini API     | Geração de texto        |
| Unsplash API   | Imagem ilustrativa      |
| GitHub Actions | Automação diária        |
| GH_PAT         | Autenticação para push  |
| dotenv         | Variáveis de ambiente   |
| axios          | Requisições HTTP        |
| fs / path      | Manipulação de arquivos |

---

## 📦 Instalação

```bash
git clone https://github.com/rafaelioppi/curiosidade-cientifica-dia.git
cd curiosidade-cientifica-dia
npm install


🔑 Configuração
Crie um arquivo .env com suas chaves:

env
GEMINI_API_KEY=your_gemini_api_key
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
🧠 Gerar manualmente
bash
npm run gerar
⚙️ Automação
O workflow gerar-post.yml roda todos os dias e realiza:

Instalação de dependências

Execução do script

Commit e push automático

📁 Exemplo de saída
json
{
  "data": "2025-11-03 06:00:00",
  "conteudo": "Sabia que o DNA humano compartilha cerca de 60% com o das bananas?",
  "imagem": "https://images.unsplash.com/photo-...",
  "timestamp": 1730625600000
}
💡 Ideias futuras
Página web que consome o post-dia.json

Integração com redes sociais

API pública para curiosidades científicas


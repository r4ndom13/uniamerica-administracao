# Administração — Descomplica UniAmérica

Landing page mobile para a campanha de graduação em Administração. Inclui HTML, CSS, JavaScript, fontes, imagens, animações por rolagem e contatos oficiais.

## Hospedar em outro lugar

O site é estático: não exige instalação de dependências, compilação, banco de dados nem variáveis de ambiente.

- **Netlify:** importe este repositório, deixe o comando de build vazio e use `.` como diretório de publicação. Também é possível enviar a pasta completa por upload.
- **Vercel:** importe este repositório, selecione o preset `Other`, deixe o comando de build vazio e use `.` como diretório de saída.
- **Hospedagem tradicional:** envie todo o conteúdo desta pasta para a pasta pública do domínio, mantendo `index.html` na raiz.
- **GitHub Pages:** nas configurações do repositório, selecione publicação pela branch `main`, pasta `/ (root)`.

## Prévia local

Com Python instalado, execute na pasta do projeto:

```sh
python -m http.server 8080
```

Depois, abra `http://localhost:8080`.

## Arquivos principais

- `index.html`: conteúdo da landing page.
- `style.css`, `refinements.css`, `draft.css`, `fluid.css` e `contact.css`: estilos e adaptações responsivas.
- `script.js`: interações, vídeo, faixa contínua e efeitos ligados à rolagem.
- `assets/`: imagens e fontes utilizadas na página.
- `motion/`: recursos de animação, com licença e créditos correspondentes.
- `posts.html?p=1`, `?p=2` e `?p=3`: peças da campanha em HTML.

## Conversão e contatos

A inscrição continua no site oficial da instituição. O WhatsApp abre uma conversa com mensagem preenchida e depende da ação da pessoa para enviar. E-mails e telefone usam os aplicativos configurados no dispositivo. O vídeo carrega do YouTube ao clicar.

O projeto mantém os ativos e a identidade visual fornecidos para a campanha. A licença do Motion Anything está em `motion/LICENSE` e os créditos em `motion/NOTICE.md`.
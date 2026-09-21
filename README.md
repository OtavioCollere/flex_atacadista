# Flex Atacadista — Landing + E-commerce

Site estático (HTML/CSS/JS puro, sem build e sem dependências).

## Estrutura

```
index.html       landing page institucional
landing.css      tokens do design system + estilos da landing
loja.html        e-commerce (catálogo, busca, filtros, carrinho)
flex-store.css   estilos da loja
flex-data.js     catálogo: departamentos, categorias, produtos
flex-app.js      router por hash + render das telas da loja
assets/flex/     logo e imagens de produto
assets/landing/  fotos da fachada e do estoque
```

A landing foi convertida do pacote do design system para HTML/CSS estático: o
template original era um canvas com React + runtime próprio, que não roda em
hospedagem estática. Tokens, componentes e conteúdo são os mesmos.

## Rodando local

```bash
cd /Users/otaviotakaki/Documents/development/flex_atacadista
python3 -m http.server 8000
```

Abra http://localhost:8000 (landing) e http://localhost:8000/loja.html (loja).

Alternativas: `npx serve .` ou a extensão Live Server do VS Code ("Go Live").

A loja usa rotas por hash (`loja.html#/d/festas`), então qualquer servidor de
arquivos estáticos serve — não precisa de rewrite nem de backend.

## Deploy na Vercel

Importar o repositório e deixar tudo no padrão:

- Framework Preset: **Other**
- Build Command: vazio
- Output Directory: vazio (raiz do repo)
- Install Command: vazio

A Vercel serve o `index.html` da raiz como home. Cada push na `main` publica.

Sem `vercel.json`: com `cleanUrls: true` a raiz passa a responder 404 nesse
tipo de deploy estático (testado em deploy real). Os links internos usam
`loja.html`, então não há o que ganhar com URL limpa aqui.

Os links "Acessar Loja" apontam para `loja.html` neste repo; para mandar o
tráfego para a loja atual, trocar pelo endereço dela no `index.html`.

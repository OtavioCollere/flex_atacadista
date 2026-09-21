# Flex Atacadista — Landing + E-commerce

Site estático (HTML/CSS/JS puro, sem build e sem dependências).

## Estrutura

```
index.html       landing page (placeholder — a definitiva entra aqui)
loja.html        e-commerce (catálogo, busca, filtros, carrinho)
flex-store.css   estilos da loja
flex-data.js     catálogo: departamentos, categorias, produtos
flex-app.js      router por hash + render das telas da loja
assets/flex/     logo e imagens de produto
```

## Rodando local

```bash
cd /Users/otaviotakaki/Documents/development/flex_atacadista
python3 -m http.server 8000
```

Abra http://localhost:8000 (landing) e http://localhost:8000/loja.html (loja).

Alternativas: `npx serve .` ou a extensão Live Server do VS Code (botão "Go Live").

A loja usa rotas por hash (`loja.html#/d/festas`), então qualquer servidor de
arquivos estáticos serve — não precisa de rewrite nem de backend.

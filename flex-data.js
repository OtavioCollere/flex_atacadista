/* Flex Atacadista — catálogo (estrutura derivada do menu atual, reorganizada em Departamento > Categoria > Subcategoria) */
window.FLEX = (function(){
const slug=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
const D=[
 {name:'Festas',desc:'Balões, adereços e efeitos para festas, eventos e decoração.',cats:[
  {name:'Balões',subs:[['Balão Látex',312],['Balão Látex Coração',48],['Balão Metalizado',260],['Balão Metalizado Número',96],['Balão Bubble',14],['Acessórios para Balão',142]]},
  {name:'Adereços',subs:[['Asas e Tiaras',88],['Chapéus e Máscaras',124],['Colares e Pulseiras',150],['Óculos',62],['Saias e Fantasias',40],['Marabu e Pétalas',33]]},
  {name:'Efeitos',subs:[['Lança-confete',27],['Fumaça Colorida',18],['Pó Colorido',22],['Spray e Serpentina',31]]},
  {name:'Cortinas e Painéis',subs:[['Cortina Metalizada',44],['Cortina Coração',12],['Cortina KS',9]]}
 ]},
 {name:'Confeitaria',desc:'Aromas, formas, cake boards e tudo para produção de bolos e doces.',cats:[
  {name:'Insumos',subs:[['Aromas e Essências',76],['Corantes',54],['Chocolate e Cobertura',38]]},
  {name:'Utensílios',subs:[['Formas',120],['Bicos e Sacos',66],['Espátulas',24]]},
  {name:'Apresentação',subs:[['Cake Board',52],['Forminhas',210],['Toppers',88]]}
 ]},
 {name:'Embalagens',desc:'Cestas, sacolas e caixas para presente, cestas e delivery.',cats:[
  {name:'Cestas',subs:[['Cesta de Papel',36],['Cesta de Palha',28],['Cesta de Vime',19]]},
  {name:'Sacolas e Caixas',subs:[['Sacola de Papel',140],['Caixa Presente',96],['Celofane e Fitas',72]]}
 ]},
 {name:'Decoração',desc:'Painéis, toalhas, velas e itens de mesa para compor a festa.',cats:[
  {name:'Mesa',subs:[['Toalhas',44],['Descartáveis',380],['Velas',60]]},
  {name:'Ambiente',subs:[['Painéis',52],['Bandeirolas',28],['Luminárias',14]]}
 ]},
 {name:'Papelaria',desc:'Papéis, adesivos e materiais para convites, tags e artesanato.',cats:[
  {name:'Papéis',subs:[['Papel Cartão',64],['Papel de Seda',40],['Crepom',30]]},
  {name:'Adesivos e Tags',subs:[['Adesivos',110],['Tags',48]]}
 ]}
];
D.forEach(d=>{d.slug=slug(d.name);d.count=0;d.cats.forEach(c=>{c.slug=slug(c.name);c.dept=d;c.subs=c.subs.map(([n,q])=>({name:n,count:q,slug:slug(n),cat:c}));c.count=c.subs.reduce((a,s)=>a+s.count,0);d.count+=c.count;});});
const findSub=s=>{for(const d of D)for(const c of d.cats)for(const x of c.subs)if(x.slug===s)return x;};

/* Subcategorias internas da página "Acessórios para Balão" */
const ACESS_SUBS=[['Varetas',38],['Suportes e Bases',24],['Bombas e Infladores',11],['Adesivos',17],['LED',9],['Balão Bubble',14],['Confetes',21],['Gliter',8]].map(([n,q])=>({name:n,count:q,slug:slug(n)}));
const BRANDS=['DF Festas','Piffer','Joy','São Roque','Regina','Festcolor'];

const P=[
 ['DF-VAR30-BR','DF Festas','Vareta 30 cm com Kit Suporte para Balão – Branco','varetas',10,50,119.30,'Caixa',420,'best'],
 ['DF-VAR30-IN','DF Festas','Vareta 30 cm com Kit Suporte para Balão – Incolor','varetas',10,50,119.30,'Caixa',380,'best'],
 ['PF170083','Piffer','Bomba Manual para Balão Cores Sortidas','bombas-e-infladores',10,1,63.92,'Caixa',96,null],
 ['PF170006IN','Piffer','Vareta Grossa 70 cm Incolor','varetas',1,50,58.95,'Caixa',210,null],
 ['DF-VAR30-P','DF Festas','Vareta 30 cm com Kit Suporte para Balão – Incolor','varetas',1,10,2.67,'Pacote',1500,null],
 ['SR-SUP40','São Roque','Suporte de Mesa para Balão 40 cm – Branco','suportes-e-bases',1,5,18.40,'Pacote',64,'new'],
 ['FC-BASEARCO','Festcolor','Base para Arco de Balão Desmontável 2 m','suportes-e-bases',1,1,89.90,'Unidade',22,null],
 ['JY-LED10','Joy','LED para Balão Bubble Luz Branca','led',1,10,24.90,'Pacote',140,null],
 ['RG-ADTEAMO','Regina','Adesivo para Balão “Te Amo” Dourado','adesivos',1,100,14.50,'Pacote',88,null],
 ['FC-CONFCOR','Festcolor','Confete Metalizado Coração 250 g – Rosé','confetes',1,1,12.80,'Pacote',52,'off',15.90],
 ['SR-BUB18','São Roque','Balão Bubble Transparente 18″','balao-bubble',1,5,39.90,'Pacote',31,null],
 ['JY-GLIT100','Joy','Gliter para Balão 100 g – Prata','gliter',1,1,9.90,'Pacote',7,null],
 ['PF-BOMBADP','Piffer','Bomba Dupla Ação Profissional','bombas-e-infladores',1,1,34.90,'Unidade',18,null],
 ['DF-INFLEL','DF Festas','Inflador Elétrico 2 Bicos 600 W','bombas-e-infladores',1,1,189.00,'Unidade',9,null],
 ['RG-ADESTR','Regina','Adesivo para Balão Estrela Prata','adesivos',1,100,14.50,'Pacote',120,null],
 ['FC-TIRAMOS','Festcolor','Tira para Mosaico de Balão 1 m','suportes-e-bases',1,10,22.00,'Pacote',44,'new'],
 ['SR-VAR40-BR','São Roque','Vareta 40 cm com Copinho – Branco','varetas',1,50,32.00,'Pacote',260,null],
 ['DF-VAR30-PR','DF Festas','Vareta 30 cm com Kit Suporte para Balão – Preto','varetas',10,50,119.30,'Caixa',0,null],
 ['JY-CONFMET','Joy','Confete Metalizado Redondo 1 cm 250 g – Ouro','confetes',1,1,12.80,'Pacote',77,null],
 ['PF-VAR50','Piffer','Vareta 50 cm Incolor','varetas',1,50,41.50,'Pacote',130,null]
].map(([sku,brand,name,sub,pct,un,price,unit,stock,tag,old])=>({sku,brand,name,sub,pct,un,price,unit,stock,tag,old,total:pct*un,unitPrice:price/(pct*un),cat:'acessorios-para-balao'}));

const HOME_BEST=[P[0],P[2],P[10],P[7],P[5],P[16]];
const HOME_NEW=[P[5],P[15],P[13],P[7],P[9],P[12]];
const HOME_OFF=[P[9],P[1],P[3],P[18],P[8],P[19]];

const FAQ_ACESS=[
 ['Qual vareta usar para balão de látex nº 9?','Para balões nº 9 e nº 11, a vareta de 30 cm com copinho é o padrão. Para balões maiores (nº 16 em diante) ou arranjos de chão, use varetas de 40 a 70 cm com base de mesa.'],
 ['Quantas varetas vêm em uma caixa fechada?','As caixas da DF Festas trazem 10 pacotes com 50 unidades, totalizando 500 varetas com copinho. O preço por unidade cai cerca de 60% em relação ao pacote avulso.'],
 ['O que preciso para montar um arco de balões?','Base para arco desmontável, tiras para mosaico ou fita de arco, bomba manual ou inflador elétrico e balões de dois ou três tamanhos. Todos estão nesta categoria e em Balão Látex.'],
 ['O LED funciona em qualquer balão bubble?','Sim. O LED de haste encaixa em balões bubble de 18″ a 24″ e dura em média 12 horas. Vendido em pacotes de 10 unidades.']
];
const GUIDES=[
 ['Guia','Como escolher acessórios para balão?','Vareta, suporte, bomba ou LED: o que cada item faz e quando usar em festas, eventos e vitrines.'],
 ['Checklist','Materiais para decoração de festa infantil','Lista completa por quantidade de convidados, de balões a descartáveis e painel.'],
 ['Atacado','Como comprar em caixa fechada e economizar','Entenda as faixas de preço por volume e como montar seu pedido mínimo.']
];
return {D,P,slug,findSub,ACESS_SUBS,BRANDS,HOME_BEST,HOME_NEW,HOME_OFF,FAQ_ACESS,GUIDES};
})();

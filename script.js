import { db, ref, onValue, push, update } from "./firebase.js";

const formAdd = document.getElementById("formAdd");
const novoNomeInput = document.getElementById("novoNome");

const formMDO = document.getElementById("formMDO");
const selectNome = document.getElementById("nome");

const rankingEl = document.getElementById("ranking");

const totalMembrosEl = document.getElementById("totalMembros");
const totalVersiculosEl = document.getElementById("totalVersiculos");

let membros = [];

/* CARREGAR DADOS ONLINE */

db.ref("membros").on("value", snapshot => {

membros = [];

snapshot.forEach(child => {

membros.push({
id: child.key,
...child.val()
});

});

atualizarSelect();
renderizarRanking();

});

/* SELECT */

function atualizarSelect(){

selectNome.innerHTML="";

membros.forEach(m=>{

const option=document.createElement("option");

option.value=m.id;
option.textContent=m.nome;

selectNome.appendChild(option);

});

}

/* RANKING */

function renderizarRanking(){

rankingEl.innerHTML="";

let totalGeral=0;

membros
.sort((a,b)=>(b.m+b.d+b.o)-(a.m+a.d+a.o))
.forEach((m,index)=>{

const total=m.m+m.d+m.o;

totalGeral+=total;

const li=document.createElement("li");

li.innerHTML=`
<strong>${index+1}º ${m.nome}</strong><br>
M${m.m} - D${m.d} - O${m.o}
`;

rankingEl.appendChild(li);

});

totalMembrosEl.textContent=membros.length;

totalVersiculosEl.textContent=totalGeral;

}

/* ADICIONAR */

formAdd.addEventListener("submit",e=>{

e.preventDefault();

const nome=novoNomeInput.value.trim();

if(!nome) return;

const existe=membros.some(m=>m.nome.toLowerCase()==nome.toLowerCase());

if(existe){

alert("Nome já existe");

return;

}

db.ref("membros").push({

nome:nome,
m:0,
d:0,
o:0

});

novoNomeInput.value="";

});

/* LANÇAR */

formMDO.addEventListener("submit",e=>{

e.preventDefault();

const id=selectNome.value;

const med=parseInt(meditacao.value)||0;
const dec=parseInt(decoracao.value)||0;
const ora=parseInt(oracao.value)||0;

if(med==0 && dec==0 && ora==0){

alert("Digite valores");

return;

}

const pessoa=membros.find(m=>m.id==id);

db.ref("membros/"+id).update({

m:pessoa.m+med,
d:pessoa.d+dec,
o:pessoa.o+ora

});

formMDO.reset();

});

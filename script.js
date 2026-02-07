const formAdd = document.getElementById("formAdd");
const novoNomeInput = document.getElementById("novoNome");

const formMDO = document.getElementById("formMDO");
const selectNome = document.getElementById("nome");

const rankingEl = document.getElementById("ranking");

const totalMembrosEl = document.getElementById("totalMembros");
const totalVersiculosEl = document.getElementById("totalVersiculos");

let membros = JSON.parse(localStorage.getItem("ACRO_MDO")) || [];

/* ================= SALVAR ================= */

function salvar() {
  localStorage.setItem("ACRO_MDO", JSON.stringify(membros));
}

/* ================= SELECT ================= */

function atualizarSelect() {
  selectNome.innerHTML = "";
  membros.forEach(m => {
    const option = document.createElement("option");
    option.value = m.nome;
    option.textContent = m.nome;
    selectNome.appendChild(option);
  });
}

/* ================= RANKING ================= */

function renderizarRanking() {
  rankingEl.innerHTML = "";

  let totalGeral = 0;

  membros
      .sort((a, b) => (b.m + b.d + b.o) - (a.m + a.d + a.o))
      .forEach((membro, index) => {
        const total = membro.m + membro.d + membro.o;
        totalGeral += total;

        const li = document.createElement("li");

        if (index === 0) li.classList.add("top1");
        if (index === 1) li.classList.add("top2");
        if (index === 2) li.classList.add("top3");

        li.innerHTML = `
        <strong>${index + 1}º ${membro.nome}</strong><br>
        M${membro.m} - D${membro.d} - O${membro.o}
        <div style="font-size:12px; opacity:.7">Total: ${total}</div>
      `;

        rankingEl.appendChild(li);
      });

  totalMembrosEl.textContent = membros.length;
  totalVersiculosEl.textContent = totalGeral;
}

/* ================= ADICIONAR ================= */

formAdd.addEventListener("submit", e => {
  e.preventDefault();

  const nome = novoNomeInput.value.trim();
  if (!nome) return;

  const existe = membros.some(m => m.nome.toLowerCase() === nome.toLowerCase());

  if (existe) {
    alert("Nome já cadastrado.");
    return;
  }

  membros.push({ nome, m: 0, d: 0, o: 0 });

  salvar();
  atualizarSelect();
  renderizarRanking();

  novoNomeInput.value = "";
});

/* ================= LANÇAMENTO ================= */

formMDO.addEventListener("submit", e => {
  e.preventDefault();

  const nome = selectNome.value;
  const med = parseInt(document.getElementById("meditacao").value) || 0;
  const dec = parseInt(document.getElementById("decoracao").value) || 0;
  const ora = parseInt(document.getElementById("oracao").value) || 0;

  if (med === 0 && dec === 0 && ora === 0) {
    alert("Informe pelo menos um valor.");
    return;
  }

  const pessoa = membros.find(m => m.nome === nome);
  if (!pessoa) return;

  pessoa.m += med;
  pessoa.d += dec;
  pessoa.o += ora;

  salvar();
  renderizarRanking();
  formMDO.reset();
});

/* ================= INIT ================= */

atualizarSelect();
renderizarRanking();

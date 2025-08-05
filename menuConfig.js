export function inicializarMenuConfiguracoes() {
  const menuHamburguer = document.getElementById("menuHamburguer");
  const painelConfig = document.getElementById("painelConfig");
  const btnCorFundo = document.getElementById("btnCorFundo");
  const areaCor = document.querySelector(".area-cor");
  const btnSairConta = document.getElementById("btnSairConta");
  const welcomeName = document.getElementById("welcomeName");
  const mainView = document.getElementById("mainView");
  const authScreen = document.getElementById("authScreen");

  // 🌐 Abrir/fechar painel de configurações
  menuHamburguer.addEventListener("click", (e) => {
    e.stopPropagation();
    painelConfig.classList.toggle("ativo");
    document.body.classList.toggle("menu-aberto");
  });

  document.addEventListener("click", (e) => {
    if (
      painelConfig.classList.contains("ativo") &&
      !painelConfig.contains(e.target) &&
      e.target !== menuHamburguer
    ) {
      painelConfig.classList.remove("ativo");
      document.body.classList.remove("menu-aberto");
      areaCor.style.display = "none";
    }
  });

  painelConfig.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // 🚪 Sair da conta e resetar
  btnSairConta.addEventListener("click", () => {
    welcomeName.textContent = "";
    authScreen.style.display = "block";
    mainView.style.display = "none";
    window.photoList = [];
    window.usuarioLogado = "";
    localStorage.removeItem("fundoPersonalizado");
    document.body.style.backgroundColor = "#ffffff";
    mainView.style.color = "#000000";
    areaCor.style.display = "none";
    btnCorFundo.style.backgroundColor = "#ffffff";
  });
}
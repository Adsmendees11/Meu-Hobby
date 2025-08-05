// galeria-publica.js
document.addEventListener("DOMContentLoaded", () => {
  const imagens = document.querySelectorAll("img");
  let currentlyExpanded = null;
  const velocidadeMovimento = 2;
  const tamanhoPadrao = 120;
// 🔤 Adiciona texto no canto superior direito
const textoSuperior = document.createElement("div");
textoSuperior.textContent = "MEU HOBBY"; // <- Mude para o que quiser!

textoSuperior.style.cssText = `
  position: fixed;
  top: 16px;
  font-family: Georgia, Helvetica, sans-serif;
  font-size: 20px;
  letter-spacing: 1px;
  color: #3d0075;
  background-color: rgba(255,255,255,0.85);
  padding: 10px 10px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  text-align: center;
  z-index: 1000;
`;

document.body.appendChild(textoSuperior);

  imagens.forEach(img => {
    configurarImagemFlutuante(img);
    iniciarMovimento(img);

    img.addEventListener("click", () => {
      if (currentlyExpanded && currentlyExpanded !== img) {
        encolherImagem(currentlyExpanded);
        currentlyExpanded = null;
      }

      if (!img.classList.contains("expandida")) {
        expandirImagemComTransicao(img);
        currentlyExpanded = img;
      } else {
        encolherImagem(img);
        currentlyExpanded = null;
      }
    });
  });

  function configurarImagemFlutuante(img) {
    img.style.position = "absolute";
    img.style.width = `${tamanhoPadrao}px`;
    img.style.height = `${tamanhoPadrao}px`;
    img.style.objectFit = "cover";
    img.style.borderRadius = "12px";
    img.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
    img.style.transition = "all 0.6s ease";
    img.style.cursor = "pointer";
  }

  function iniciarMovimento(img) {
    const limiteX = window.innerWidth - tamanhoPadrao;
    const limiteY = window.innerHeight - tamanhoPadrao;
    let dx = (Math.random() - 0.5) * velocidadeMovimento;
    let dy = (Math.random() - 0.5) * velocidadeMovimento;

    img.style.left = `${Math.random() * limiteX}px`;
    img.style.top = `${Math.random() * limiteY}px`;

    img.motionInterval = setInterval(() => {
      if (img.classList.contains("expandida")) return;

      let x = parseFloat(img.style.left) + dx;
      let y = parseFloat(img.style.top) + dy;

      if (x < 0 || x > limiteX) dx *= -1;
      if (y < 0 || y > limiteY) dy *= -1;

      img.style.left = `${Math.max(0, Math.min(x, limiteX))}px`;
      img.style.top = `${Math.max(0, Math.min(y, limiteY))}px`;
    }, 30);
  }

  function expandirImagemComTransicao(img) {
    img.classList.add("expandida");
    img.style.zIndex = "10"; // Joga pra frente das outras ao expandir

    if (img.motionInterval) {
      clearInterval(img.motionInterval);
      img.motionInterval = null;
    }

    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const maxW = winW * 0.7;
    const maxH = winH * 0.7;

    const tempImg = new Image();
    tempImg.src = img.src;

    tempImg.onload = () => {
      const ratio = tempImg.width / tempImg.height;
      let alvoW = maxW;
      let alvoH = alvoW / ratio;

      if (alvoH > maxH) {
        alvoH = maxH;
        alvoW = alvoH * ratio;
      }

      img.style.width = `${alvoW}px`;
      img.style.height = `${alvoH}px`;
      img.style.left = `${(winW - alvoW) / 2}px`;
      img.style.top = `${(winH - alvoH) / 2}px`;
    };
  }

  function encolherImagem(img) {
    img.classList.remove("expandida");
    img.style.zIndex = "1";
    img.style.width = `${tamanhoPadrao}px`;
    img.style.height = `${tamanhoPadrao}px`;
    iniciarMovimento(img);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // … seu código existente da galeria …

  // 🔘 Criar botão de login no canto superior direito
  const btnLogin = document.createElement("a");
  btnLogin.href = "http://127.0.0.1:5500/index.html";
  btnLogin.textContent = "Criar minha galeria";
  btnLogin.style.cssText = `
    position: fixed;
    top: 16px;
    right: 20px;
    padding: 10px 16px;
    background-color: #3d0075ff;
    color: white;
    font-family: sans-serif;
    font-size: 14px;
    border-radius: 8px;
    text-decoration: none;
    z-index: 1000;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    transition: background 0.3s ease;
  `;
  btnLogin.addEventListener("mouseover", () => {
    btnLogin.style.backgroundColor = "#20004bff"; // Cor mais escura ao passar o mouse
  });
  btnLogin.addEventListener("mouseout", () => {
    btnLogin.style.backgroundColor = "#3f0072ff";
  });

  document.body.appendChild(btnLogin);
});
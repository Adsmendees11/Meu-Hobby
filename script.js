// Referência aos elementos da tela de autenticação
const authScreen = document.getElementById("authScreen"); // Tela de login/registro
const loginBtn = document.getElementById("loginBtn"); // Botão de login
const registerBtn = document.getElementById("registerBtn"); // Botão de registro
const userNameInput = document.getElementById("userNameInput"); // Campo de nome de usuário
const userPasswordInput = document.getElementById("userPasswordInput"); // Campo de senha
const welcomeName = document.getElementById("welcomeName"); // Saudação personalizada para o usuário logado

// Referência aos elementos relacionados à galeria de fotos
const addBox = document.getElementById("addPhotoBox"); // Caixa clicável para adicionar fotos
const photoInput = document.getElementById("photoInput"); // Input de tipo 'file' para upload de imagens
const previewPhotos = document.getElementById("previewPhotos"); // Área de pré-visualização das fotos
const createGalleryBtn = document.getElementById("createGalleryBtn"); // Botão para criar galeria (não usado aqui)
const mainView = document.getElementById("mainView"); // Tela principal da aplicação
const galleryView = document.getElementById("galleryView"); // Tela de visualização da galeria
const backBtn = document.getElementById("backBtn"); // Botão de voltar
const btnCorFundo = document.getElementById("btnCorFundo"); // Botão para alterar cor de fundo

// Variáveis auxiliares
let photoList = []; // Lista das imagens do usuário
let floatingPhotos = []; // (Possivelmente para animações ou visualização flutuante)
let currentlyExpanded = null; // Referência à imagem expandida (se houver)

// 🔐 Evento de login
loginBtn.addEventListener("click", () => {
  const username = userNameInput.value.trim(); // Nome de usuário sem espaços
  const password = userPasswordInput.value.trim(); // Senha sem espaços

  // Chamada para API de login
  fetch("http://localhost:3001/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.username) {
        // Se login for bem-sucedido
        welcomeName.textContent = `Olá, ${data.username}!`;
        authScreen.style.display = "none"; // Oculta tela de login
        mainView.style.display = "block"; // Mostra tela principal

        // Busca fotos do usuário
        fetch(`http://localhost:3001/get-photos/${username}`)
          .then(res => res.json())
          .then(data => {
            photoList = data.photos;
            updatePreview(); // Atualiza visualização das imagens
          });
      } else {
  alert(data.message); // Mensagem de erro da API

  // Mostra o botão "Esqueci minha senha"
  const forgotBtn = document.getElementById("forgotPasswordBtn");
  forgotBtn.style.display = "inline-block";

  // Remove mensagem de suporte se já apareceu antes
  document.getElementById("supportMessage").style.display = "none";
  document.getElementById("supportMessage").innerHTML = "";
}
    })
    .catch(() => alert("Erro ao conectar com o servidor.")); // Falha de rede
});

// 🆘 Evento de esqueci minha senha
document.getElementById("forgotPasswordBtn").addEventListener("click", () => {
  const suporte = `
    <p style="
      text-align: center;
      font-size: 16px;
      color: #333;
      background-color: #f9f9f9;
      padding: 20px;
      margin-top: 20px;
      border-radius: 10px;
    ">
      Para redefinir sua senha, entre em contato com o suporte:<br>
      <strong>meuhobby011@gmail.com</strong>
    </p>
  `;
  const msg = document.getElementById("supportMessage");
  msg.innerHTML = suporte;
  msg.style.display = "block";
});

// ✍️ Evento de cadastro
registerBtn.addEventListener("click", () => {
  const username = userNameInput.value.trim();
  const password = userPasswordInput.value.trim();

  // Chamada para API de registro
  fetch("http://localhost:3001/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message); // Feedback para o usuário
      if (data.message.includes("sucesso")) {
        localStorage.setItem("usuarioNome", username); // 🌟 Salva o nome do usuário
        loginBtn.click(); // Faz login automaticamente após cadastro
      }
    })
    .catch(() => alert("Erro ao conectar com o servidor."));
});

// 📷 Evento de adição de fotos
addBox.addEventListener("click", () => photoInput.click()); // Simula clique no input de arquivo

photoInput.addEventListener("change", () => {
  const files = photoInput.files; // Arquivos selecionados

  if (files.length + photoList.length > 10) {
    alert("Máximo de 10 fotos."); // Limite de fotos
    return;
  }

  const username = welcomeName.textContent.replace("Olá, ", "").replace("!", ""); // Extrai nome

  // Para cada foto selecionada
  [...files].forEach(file => {
    const reader = new FileReader(); // Lê arquivos localmente
    reader.onload = function (e) {
      const imageData = e.target.result; // Base64 da imagem

      photoList.push(imageData); // Adiciona à lista
      updatePreview(); // Atualiza pré-visualização

      // Salva foto no backend
      fetch("http://localhost:3001/save-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, imageData })
      });
    };
    reader.readAsDataURL(file); // Converte imagem para base64
  });

  photoInput.value = ""; // Limpa o input
});

// 🖼️ Atualizar a pré-visualização das últimas 3 fotos
function updatePreview() {
  previewPhotos.innerHTML = ""; // Limpa a área de preview

  const lastThree = photoList.slice(-3); // Seleciona as 3 últimas fotos
  const username = welcomeName.textContent.replace("Olá, ", "").replace("!", ""); // Extrai nome do usuário

  lastThree.forEach(src => {
    // Cria container para a imagem e botão de remoção
    const container = document.createElement("div");
    container.className = "preview-container";

    const img = document.createElement("img");
    img.src = src;
    img.className = "preview-img";

    // Botão de remoção de foto
    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "x";

    // Ao clicar no botão, remove a imagem do servidor e da interface
    removeBtn.onclick = () => {
      const username = welcomeName.textContent.replace("Olá, ", "").replace("!", "");

      fetch("http://localhost:3001/delete-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, imageData: src })
      })
        .then(res => res.json())
        .then(data => {
          console.log(data.message);
          photoList = photoList.filter(p => p !== src); // Remove da lista
          updatePreview(); // Atualiza a visualização
        })
        .catch(err => {
          console.error("Erro ao excluir foto:", err);
          alert("Erro ao excluir foto do banco.");
        });
    };

    container.appendChild(img);
    container.appendChild(removeBtn);
    previewPhotos.appendChild(container);
  });
}

// 🎨 Criar galeria flutuante com as imagens adicionadas
createGalleryBtn.addEventListener("click", () => {
  if (photoList.length === 0) {
    alert("⚠️ Você precisa adicionar pelo menos uma foto.");
    return;
  }

  mainView.style.display = "none"; // Oculta visualização principal
  galleryView.style.display = "block"; // Mostra galeria flutuante
  const corSalva = localStorage.getItem("fundoPersonalizado");
if (corSalva) {
  aplicarCorFundo(corSalva);  // Aplica diretamente no galleryView
}

  galleryView.querySelectorAll("img").forEach(img => img.remove()); // Limpa imagens antigas
  floatingPhotos = [];
  currentlyExpanded = null;

  // Cria imagem flutuante para cada foto
  photoList.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    galleryView.appendChild(img);
    floatingPhotos.push(img);

    movePhotoRandom(img); // Aplica movimento randômico

    // Expansão e retração ao clicar
    img.addEventListener("click", () => {
      if (currentlyExpanded && currentlyExpanded !== img) {
        shrinkImage(currentlyExpanded);
        currentlyExpanded = null;
      }

      if (!img.classList.contains("expanded")) {
        expandImage(img);
        currentlyExpanded = img;
      } else {
        shrinkImage(img);
        currentlyExpanded = null;
      }
    });
  });
});

//Botão voltar tela inicial
const backToHomeBtn = document.getElementById("backToHomeBtn");
if (backToHomeBtn) {
  backToHomeBtn.addEventListener("click", () => {
    galleryView.style.display = "none";
    authScreen.style.display = "block";
    mainView.style.display = "none";
    document.body.style.backgroundColor = "#ffffffff";
  });
}

// 🔍 Expande imagem clicada ao centro da tela
function expandImage(img) {
  img.classList.add("expanded"); // Aplica classe para estilo de expansão
  img.style.zIndex = "999"; // Traz a imagem para frente
  clearInterval(img.motionInterval); // Para o movimento flutuante

  const winW = window.innerWidth; // Largura da janela
  const winH = window.innerHeight; // Altura da janela
  const maxW = winW * 0.6; // Largura máxima de 60% da tela
  const maxH = winH * 0.6; // Altura máxima de 60% da tela

  const image = new Image();
  image.src = img.src;

  // Após carregar imagem, calcula proporção ideal
  image.onload = () => {
    let ratio = image.width / image.height; // Proporção original
    let targetW = maxW;
    let targetH = targetW / ratio;

    // Se a altura estourar o limite, recalcula baseado na altura
    if (targetH > maxH) {
      targetH = maxH;
      targetW = targetH * ratio;
    }

    // Posiciona e redimensiona ao centro da tela
    img.style.width = `${targetW}px`;
    img.style.height = `${targetH}px`;
    img.style.left = `${(winW - targetW) / 2}px`;
    img.style.top = `${(winH - targetH) / 2}px`;
  };
}

// 📉 Retrai imagem para visualização compacta
function shrinkImage(img) {
  img.classList.remove("expanded"); // Remove expansão
  img.style.zIndex = "1"; // Reposiciona z-index
  img.style.width = "100px"; // Tamanho padrão reduzido
  img.style.height = "100px";
  movePhotoRandom(img, true); // Reinicia movimento randômico
}

// 🌀 Aplica movimento aleatório à imagem flutuante
function movePhotoRandom(img, resetDirection = false) {
  const maxW = window.innerWidth - 110; // Limites horizontais
  const maxH = window.innerHeight - 110; // Limites verticais
  const x = Math.random() * maxW; // Posição inicial X
  const y = Math.random() * maxH; // Posição inicial Y
  img.style.left = `${x}px`;
  img.style.top = `${y}px`;

  let dx = (Math.random() - 0.5) * 3.5; // Velocidade horizontal
  let dy = (Math.random() - 0.5) * 3.5; // Velocidade vertical

  if (resetDirection) {
    // Gera nova direção aleatória se solicitado
    dx = (Math.random() - 0.5) * 3.5;
    dy = (Math.random() - 0.5) * 3.5;
  }

  // Loop de movimento contínuo
  img.motionInterval = setInterval(() => {
    if (img.classList.contains("expanded")) return; // Para se expandida

    let newX = parseFloat(img.style.left) + dx;
    let newY = parseFloat(img.style.top) + dy;

    // Redireciona se atingir bordas
    const limitX = window.innerWidth - 110;
    const limitY = window.innerHeight - 110;

    if (newX < 0 || newX > limitX) dx = (Math.random() - 0.5) * 3.5;
    if (newY < 0 || newY > limitY) dy = (Math.random() - 0.5) * 3.5;

    // Atualiza posição na tela
    img.style.left = `${Math.max(0, Math.min(newX, limitX))}px`;
    img.style.top = `${Math.max(0, Math.min(newY, limitY))}px`;
  }, 20); // Velocidade de atualização: 50 vezes por segundo
}

// 🔙 Retorna da visualização de galeria para tela principal
backBtn.addEventListener("click", () => {
  galleryView.style.display = "none"; // Esconde galeria
  mainView.style.display = "block"; // Mostra tela principal
  document.body.style.backgroundColor = "#ffffffff"; // Reseta cor de fundo
});

// 📋 Copia o link da galeria para a área de transferência
function copiarLinkGaleria() {
  const username = welcomeName.textContent.replace("Olá, ", "").replace("!", "");
  const url = `http://localhost:3001/gallery/${username}`;
  navigator.clipboard.writeText(url)
    .then(() => alert("✅ Link copiado:\n" + url))
    .catch(() => alert("❌ Erro ao copiar o link."));
}

// Torna a função acessível globalmente
window.copiarLinkGaleria = copiarLinkGaleria;

// 🌟 Exibe uma frase aleatória na tela inicial
const frases = [
  "Seu jeito, seu estilo 😎",
  "Crie, viva, compartilhe 🎨",
  "Explore o que te faz feliz 🌟",
  "Crie momentos que valem a pena 💭",
  "Inspire-se com seu hobby 💡"
];

let index = 0;
const taglinesEl = document.getElementById("taglines");

function mostrarFrase() {
  taglinesEl.style.opacity = 0;
  setTimeout(() => {
    taglinesEl.textContent = frases[index];
    taglinesEl.style.opacity = 1;
    index = (index + 1) % frases.length;
  }, 500);
}

mostrarFrase();
setInterval(mostrarFrase, 3000);


// 🌐 Menu hamburguer para configurações
import { inicializarMenuConfiguracoes } from "./menuConfig.js";
inicializarMenuConfiguracoes();


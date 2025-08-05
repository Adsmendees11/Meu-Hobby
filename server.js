// 📦 Importação de módulos necessários
const express = require("express"); // Framework para criar servidor HTTP
const cors = require("cors"); // Permite requisições de outros domínios (Cross-Origin)
const bodyParser = require("body-parser"); // Lê dados enviados no corpo da requisição
const bcrypt = require("bcrypt"); // Criptografa senhas
const mysql = require("mysql2"); // Conecta com banco de dados MySQL

const app = express(); // Inicializa o servidor Express
const PORT = 3001; // Porta onde o servidor será executado

// 🛡️ Configuração do CORS para permitir acesso do frontend local
app.use(cors({
  origin: "http://127.0.0.1:5500", // Origem permitida (Live Server)
  credentials: true // Permite envio de cookies/autenticação (não usado aqui, mas seguro deixar)
}));

// 🔧 Configuração do body-parser para aceitar imagens grandes
app.use(bodyParser.json({ limit: "10mb" })); // Limite de 10MB para imagens em base64

// 🔌 Conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Usuário do MySQL
  password: "GarethBalee@711", // Senha do MySQL
  database: "meu_hobby" // Nome do banco de dados
});

// Testa conexão com o banco
db.connect(err => {
  if (err) {
    console.error("Erro ao conectar ao MySQL:", err);
    return;
  }
  console.log("Conectado ao MySQL!");
});

// ✍️ Rota para cadastro de novo usuário
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Preencha nome e senha." });
  }

  // Verifica se o usuário já existe
  db.query("SELECT * FROM users WHERE username = ?", [username], async (err, results) => {
    if (err) return res.status(500).json({ message: "Erro no banco." });
    if (results.length > 0) return res.status(400).json({ message: "Usuário já existe." });

    // Criptografa a senha e salva no banco
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], err => {
      if (err) return res.status(500).json({ message: "Erro ao cadastrar." });
      res.json({ message: "Cadastro realizado com sucesso!" });
    });
  });
});

// 🔐 Rota de login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Busca usuário no banco
  db.query("SELECT * FROM users WHERE username = ?", [username], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ message: "Usuário não encontrado." });
    }

    const user = results[0];
    const isValid = await bcrypt.compare(password, user.password); // Verifica senha

    if (!isValid) {
      return res.status(401).json({ message: "Senha incorreta." });
    }

    res.json({ message: "Login bem-sucedido", username }); // Retorna sucesso
  });
});

// 🗑️ Rota para excluir uma foto
app.post("/delete-photo", (req, res) => {
  const { username, imageData } = req.body;

  if (!username || !imageData) {
    return res.status(400).json({ message: "Dados incompletos." });
  }

  // Busca ID do usuário
  db.query("SELECT id FROM users WHERE username = ?", [username], (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ message: "Usuário não encontrado." });
    }

    const userId = results[0].id;

    // Exclui foto associada ao usuário
    db.query("DELETE FROM photos WHERE user_id = ? AND image_data = ?", [userId, imageData], err => {
      if (err) {
        console.error("Erro ao excluir foto:", err);
        return res.status(500).json({ message: "Erro ao excluir foto." });
      }

      console.log("Foto excluída com sucesso para usuário:", username);
      res.json({ message: "Foto excluída com sucesso!" });
    });
  });
});

// 💾 Rota para salvar uma nova foto
app.post("/save-photo", (req, res) => {
  const { username, imageData } = req.body;

  if (!username || !imageData) {
    return res.status(400).json({ message: "Dados incompletos." });
  }

  // Busca ID do usuário
  db.query("SELECT id FROM users WHERE username = ?", [username], (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ message: "Usuário não encontrado." });
    }

    const userId = results[0].id;

    // Insere foto no banco
    db.query("INSERT INTO photos (user_id, image_data) VALUES (?, ?)", [userId, imageData], err => {
      if (err) return res.status(500).json({ message: "Erro ao salvar foto." });
      res.json({ message: "Foto salva com sucesso!" });
    });
  });
});

// 📸 Rota para buscar todas as fotos de um usuário
app.get("/get-photos/:username", (req, res) => {
  const username = req.params.username;

  // Busca ID do usuário
  db.query("SELECT id FROM users WHERE username = ?", [username], (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ message: "Usuário não encontrado." });
    }

    const userId = results[0].id;

    // Busca fotos associadas ao usuário
    db.query("SELECT image_data FROM photos WHERE user_id = ?", [userId], (err, photoResults) => {
      if (err) return res.status(500).json({ message: "Erro ao buscar fotos." });
      res.json({ photos: photoResults.map(p => p.image_data) }); // Retorna array de imagens
    });
  });
});

// 🌐 Rota para exibir galeria de fotos de um usuário
app.get("/gallery/:username", (req, res) => {
  const username = req.params.username;

  db.query("SELECT id FROM users WHERE username = ?", [username], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).send("Usuário não encontrado.");
    }

    const userId = results[0].id;

    db.query("SELECT image_data FROM photos WHERE user_id = ?", [userId], (err, photoResults) => {
      if (err) return res.status(500).send("Erro ao buscar fotos.");

      const imagens = photoResults.map(p => p.image_data);

      const html = `
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
          <meta charset="UTF-8">
          <title>Galeria de ${username}</title>
          <link rel="stylesheet" href="http://127.0.0.1:5500/galeria-publica.css">
          <script defer src="http://127.0.0.1:5500/galeria-publica.js"></script>
          <style>
            body { margin: 0; overflow: hidden; background: #f9f9f9; }
            img {
              position: absolute;
              width: 180px;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.2);
              animation: flutuar 12s infinite ease-in-out;
            }
            @keyframes flutuar {
              0% { transform: translateY(0); }
              50% { transform: translateY(-30px); }
              100% { transform: translateY(0); }
            }
          </style>
        </head>
        <body>
          ${imagens.map(src => `
            <img src="${src}" style="top:${Math.random()*80 + 10}%; left:${Math.random()*80 + 10}%;" />
          `).join("")}
        </body>
        </html>
      `;
      res.send(html);
    });
  });
});

// 🚀 Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
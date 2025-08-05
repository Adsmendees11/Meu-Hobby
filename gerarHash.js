//usado para alterar senha de usuário.
const bcrypt = require("bcrypt");

async function gerarHashSenha(senhaEmTexto) {
  const hash = await bcrypt.hash(senhaEmTexto, 10);
  console.log("Hash gerado:", hash);
}

gerarHashSenha("123"); //nova senha
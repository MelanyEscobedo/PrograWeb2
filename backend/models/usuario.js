const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  nombre_usuario: {
    type: String,
    required: true
  },
  imagen_perfil: {
    type: String
  }
});

module.exports = mongoose.model("Usuario", usuarioSchema);
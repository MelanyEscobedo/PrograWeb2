const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  apellidos: {
    type: String,
    required: true
  },
  fecha_nacimiento: {
    type: Date,
    required: true
  },
  correo_electronico: {
    type: String,
    required: true,
    unique: true
  },
  nombre_usuario: {
    type: String,
    required: true,
    unique: true
  },
  contrasena: {
    type: String,
    required: true
  },
  imagen_perfil: {
    type: String,
    default: ""
  }
}, {
  collection: "usuarios"
});

module.exports = mongoose.model("Usuario", usuarioSchema);
const mongoose = require("mongoose");

const publicacionSchema = new mongoose.Schema({
  contenido: String,
  fecha_publicacion: {
    type: Date,
    default: Date.now
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario"
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categoria"
  }
});

module.exports = mongoose.model("Publicacion", publicacionSchema);
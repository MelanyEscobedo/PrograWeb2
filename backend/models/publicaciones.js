const mongoose = require("mongoose");

const publicacionSchema = new mongoose.Schema({
  contenido: {
    type: String,
    required: true
  },
  fecha_publicacion: {
    type: Date,
    default: Date.now
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  pelicula: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pelicula",
    required: true
  }
}, {
  collection: "publicaciones"
});

module.exports = mongoose.model("Publicacion", publicacionSchema);
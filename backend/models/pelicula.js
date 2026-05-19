const mongoose = require("mongoose");

const peliculaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  poster: {
    type: String,
    default: ""
  },
  categoria: {
    type: String,
    default: "Sin categoría"
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario"
  }
}, {
  collection: "peliculas"
});

module.exports = mongoose.model("Pelicula", peliculaSchema);
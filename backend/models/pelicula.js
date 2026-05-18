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
    required: true
  }
}, {
  collection: "peliculas"
});

module.exports = mongoose.model("Pelicula", peliculaSchema);
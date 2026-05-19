const mongoose = require("mongoose");

const comentarioSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  texto: {
    type: String,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

const publicacionSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  calificacion: {
    type: Number,
    required: true,
    min: 0,
    max: 10
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
  },
  comentarios: [comentarioSchema],
  fechaPublicacion: {
    type: Date,
    default: Date.now
  }
}, {
  collection: "publicaciones"
});

module.exports = mongoose.model("Publicacion", publicacionSchema);
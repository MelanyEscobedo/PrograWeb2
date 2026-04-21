const mongoose = require("mongoose");

const categoriaSchema = new mongoose.Schema({
  nombre_categoria: String
});

module.exports = mongoose.model("Categoria", categoriaSchema);
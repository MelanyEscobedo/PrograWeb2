const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const publicacionesRoutes = require("./routes/publicaciones");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/animareview")
  .then(() => console.log("Mongo conectado"))
  .catch(err => console.log(err));

app.use("/api/publicaciones", publicacionesRoutes);

app.listen(5000, () => {
  console.log("Servidor corriendo en puerto 5000");
});
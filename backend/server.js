const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

const publicacionesRoutes = require("./routes/publicaciones");
const usuariosRoutes = require("./routes/usuarios");
const peliculasRoutes = require("./routes/peliculas");

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/animareview";

app.use(cors({
  origin: "*"
}));
app.use(express.json());
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect(MONGO_URI)
  .then(() => console.log("Mongo conectado"))
  .catch(err => console.log(err));

app.use("/api/publicaciones", publicacionesRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/peliculas", peliculasRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const Pelicula = require("../models/pelicula");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/posters");
  },

  filename: (req, file, cb) => {
    const nombre =
      Date.now() + path.extname(file.originalname);

    cb(null, nombre);
  }
});

const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const peliculas = await Pelicula.find().sort({ titulo: 1 });
    res.json(peliculas);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/",
  upload.single("poster"),
  async (req, res) => {
    try {

      const nuevaPelicula = new Pelicula({
        titulo: req.body.titulo,
        categoria: req.body.categoria,
        usuario: req.body.usuario,
        poster: req.file
          ? `/uploads/posters/${req.file.filename}`
          : ""
      });

      await nuevaPelicula.save();

      res.status(201).json({
        success: true,
        pelicula: nuevaPelicula
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

module.exports = router;
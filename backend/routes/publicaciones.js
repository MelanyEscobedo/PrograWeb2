const express = require("express");
const router = express.Router();
const Publicacion = require("../models/publicaciones");

router.get("/", async (req, res) => {
  try {
    const { search, user, startDate, endDate } = req.query;

    let filtro = {};

    if (search) {
      filtro.contenido = { $regex: search, $options: "i" };
    }

    if (user) {
      filtro.usuario = user;
    }

    if (startDate || endDate) {
      filtro.fecha_publicacion = {};
      if (startDate) filtro.fecha_publicacion.$gte = new Date(startDate);
      if (endDate) filtro.fecha_publicacion.$lte = new Date(endDate);
    }

    const publicaciones = await Publicacion.find(filtro)
      .populate("usuario")
      .populate("categoria")
      .sort({ fecha_publicacion: -1 });

    res.json(publicaciones);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const nuevaPublicacion = new Publicacion(req.body);
    await nuevaPublicacion.save();
    res.status(201).json(nuevaPublicacion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
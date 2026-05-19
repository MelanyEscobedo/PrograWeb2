const express = require("express");
const router = express.Router();

const Publicacion = require("../models/publicaciones");
const ValoracionPublicacion = require("../models/valoracionPublicacion");

router.get("/", async (req, res) => {
  try {
    const { orden = "recientes" } = req.query;

    let publicaciones = await Publicacion.find()
      .populate("usuario", "nombre_usuario imagen_perfil")
      .populate("pelicula", "titulo poster")
      .populate("pelicula", "titulo poster categoria")
      .sort({ fechaPublicacion: -1 });

    const publicacionesConPromedio = await Promise.all(
      publicaciones.map(async (pub) => {
        const promedio = await ValoracionPublicacion.aggregate([
          {
            $match: {
              publicacion: pub._id
            }
          },
          {
            $group: {
              _id: "$publicacion",
              promedio: { $avg: "$valor" },
              total: { $sum: 1 }
            }
          }
        ]);

        const promedioEstrellas = promedio.length > 0 ? promedio[0].promedio : 0;

        return {
          ...pub.toObject(),
          promedioEstrellas,
          promedioDecimal: promedioEstrellas * 2,
          totalValoraciones: promedio.length > 0 ? promedio[0].total : 0
        };
      })
    );

    if (orden === "mejorValoradas") {
      publicacionesConPromedio.sort(
        (a, b) => b.promedioDecimal - a.promedioDecimal
      );
    }

    res.json(publicacionesConPromedio);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const nuevaPublicacion = new Publicacion(req.body);
    await nuevaPublicacion.save();

    res.status(201).json({
      success: true,
      publicacion: nuevaPublicacion
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

router.post("/:id/valorar", async (req, res) => {
  try {
    const { usuario, valor } = req.body;
    const { id } = req.params;

    const existe = await ValoracionPublicacion.findOne({
      usuario,
      publicacion: id
    });

    if (existe) {
      return res.status(400).json({
        success: false,
        message: "Ya valoraste esta publicación."
      });
    }

    const nuevaValoracion = new ValoracionPublicacion({
      usuario,
      publicacion: id,
      valor
    });

    await nuevaValoracion.save();

    res.status(201).json({
      success: true,
      message: "Valoración guardada."
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
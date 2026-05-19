const express = require("express");
const router = express.Router();

const Publicacion = require("../models/publicaciones");
const ValoracionPublicacion = require("../models/valoracionPublicacion");

const agregarPromedios = async (publicaciones) => {
  return await Promise.all(
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

      const promedioEstrellas =
        promedio.length > 0 ? promedio[0].promedio : 0;

      return {
        ...pub.toObject(),
        promedioEstrellas,
        promedioDecimal: promedioEstrellas * 2,
        totalValoraciones: promedio.length > 0 ? promedio[0].total : 0
      };
    })
  );
};

router.get("/", async (req, res) => {
  try {
    const {
      orden = "recientes",
      user,
      search,
      startDate,
      endDate
    } = req.query;

    const filtro = {};

    if (user) {
      filtro.usuario = user;
    }

    if (search) {
      filtro.$or = [
        { titulo: { $regex: search, $options: "i" } },
        { descripcion: { $regex: search, $options: "i" } }
      ];
    }

    if (startDate || endDate) {
      filtro.fechaPublicacion = {};

      if (startDate) {
        filtro.fechaPublicacion.$gte = new Date(startDate);
      }

      if (endDate) {
        const fechaFinal = new Date(endDate);
        fechaFinal.setHours(23, 59, 59, 999);
        filtro.fechaPublicacion.$lte = fechaFinal;
      }
    }

    const publicaciones = await Publicacion.find(filtro)
      .populate("usuario", "nombre_usuario imagen_perfil")
      .populate("pelicula", "titulo poster categoria")
      .sort({ fechaPublicacion: -1 });

    let publicacionesConPromedio = await agregarPromedios(publicaciones);

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

router.get("/:id", async (req, res) => {
  try {
    const publicacion = await Publicacion.findById(req.params.id)
      .populate("usuario", "nombre_usuario imagen_perfil")
      .populate("pelicula", "titulo poster categoria")
      .populate("comentarios.usuario", "nombre_usuario imagen_perfil");

    const publicacionesConPromedio = await agregarPromedios([publicacion]);

    res.json(publicacionesConPromedio[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:id/comentar", async (req, res) => {
  try {
    const { usuario, texto } = req.body;

    const publicacion = await Publicacion.findById(req.params.id);

    publicacion.comentarios.push({
      usuario,
      texto,
      fecha: new Date()
    });

    await publicacion.save();

    res.json({
      success: true,
      message: "Comentario agregado."
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
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

    const valoracion = await ValoracionPublicacion.findOneAndUpdate(
      {
        usuario,
        publicacion: id
      },
      {
        valor,
        fecha: new Date()
      },
      {
        returnDocument: "after",
        upsert: true
      }
    );

    res.json({
      success: true,
      message: "Valoración guardada.",
      valoracion
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { titulo, descripcion, calificacion } = req.body;

    const publicacion = await Publicacion.findByIdAndUpdate(
      req.params.id,
      {
        titulo,
        descripcion,
        calificacion
      },
      { returnDocument: "after" }
    );

    res.json({
      success: true,
      publicacion
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await ValoracionPublicacion.deleteMany({
      publicacion: req.params.id
    });

    await Publicacion.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Publicación y valoraciones eliminadas."
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
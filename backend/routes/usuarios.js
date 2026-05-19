const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const multer = require("multer");
const fs = require("fs");
const Usuario = require("../models/usuario");

if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

if (!fs.existsSync("uploads/usuarios")) {
    fs.mkdirSync("uploads/usuarios");
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/usuarios");
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

router.post("/registro", upload.single("imagen_perfil"), async (req, res) => {
    try {
        const {
            nombre,
            apellidos,
            fecha_nacimiento,
            correo_electronico,
            nombre_usuario,
            contrasena
        } = req.body;

        if (
            !nombre ||
            !apellidos ||
            !fecha_nacimiento ||
            !correo_electronico ||
            !nombre_usuario ||
            !contrasena
        ) {
            return res.json({
                success: false,
                message: "Faltan datos obligatorios."
            });
        }

        const usuarioExistente = await Usuario.findOne({
            $or: [
                { correo_electronico },
                { nombre_usuario }
            ]
        });

        if (usuarioExistente) {
            return res.json({
                success: false,
                message: "El usuario o correo ya existe."
            });
        }

        const passwordHash = await bcrypt.hash(contrasena, 10);

        const nuevoUsuario = new Usuario({
            nombre,
            apellidos,
            fecha_nacimiento,
            correo_electronico,
            nombre_usuario,
            contrasena: passwordHash,
            imagen_perfil: req.file
                ? `/uploads/usuarios/${req.file.filename}`
                : ""
        });

        await nuevoUsuario.save();

        res.json({
            success: true,
            message: "Usuario registrado correctamente."
        }) ;

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { nombre_usuario, contrasena } = req.body;

        const usuario = await Usuario.findOne({ nombre_usuario });

        if (!usuario) {
            return res.json({
                success: false,
                message: "Usuario no encontrado."
            });
        }

        const passwordCorrecta = await bcrypt.compare(
            contrasena,
            usuario.contrasena
        );

        if (!passwordCorrecta) {
            return res.json({
                success: false,
                message: "Contraseña incorrecta."
            });
        }

        res.json({
            success: true,
            usuario
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select("-contrasena");
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", upload.single("imagen_perfil"), async (req, res) => {
  try {
    const datos = {};

    if (req.body.nombre) {
        datos.nombre = req.body.nombre;
    }

    if (req.body.apellidos) {
      datos.apellidos = req.body.apellidos;
    }

    if (req.body.fecha_nacimiento) {
      datos.fecha_nacimiento = req.body.fecha_nacimiento;
    }

    if (req.body.contrasena) {
      datos.contrasena = await bcrypt.hash(req.body.contrasena, 10);
    }

    if (req.file) {
      datos.imagen_perfil = `/uploads/usuarios/${req.file.filename}`;
    }

    const usuario = await Usuario.findByIdAndUpdate(
        req.params.id,
        datos,
        { returnDocument: "after" }
    ).select("-contrasena");

    res.json({
      success: true,
      usuario
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
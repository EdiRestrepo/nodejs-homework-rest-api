// Importar el modelo de usuario y la dependencia para manejo de errores NotFound
const User = require("../service/schemas/users");
const { NotFound } = require("http-errors");

// Controlador para la verificación de correo electrónico
const emailVerify = async (req, res, next) => {
  // Obtener el token de verificación de los parámetros de la solicitud
  const { verificationToken } = req.params;

  try {
    // Buscar un usuario en la base de datos que tenga el token de verificación proporcionado
    const user = await User.findOne({ verificationToken });

    // Si no se encuentra el usuario, lanzar una excepción NotFound
    if (!user) {
      throw new NotFound("User not found");
    }

    // Actualizar el usuario para marcarlo como verificado y eliminar el token de verificación
    await User.updateOne(
      { verificationToken },
      { verify: true, verificationToken: null }
    );

    // Enviar una respuesta exitosa al cliente
    res.status(200).json({
      status: "success",
      message: "Verification successful",
    });
  } catch (error) {
    // Pasar cualquier error al middleware de manejo de errores
    next(error);
  }
};

// Exportar el controlador para su uso en otras partes de la aplicación
module.exports = emailVerify;
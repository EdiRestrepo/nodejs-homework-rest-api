// Importar el modelo de usuario y el servicio de correo electrónico
const User = require("../service/schemas/users");
const emailService = require("../service/emailService");

// Controlador para volver a enviar el correo de verificación
const resendVerificationEmailCtrl = async (req, res, next) => {
  const { email } = req.body;

  // Comprobar si el campo de correo electrónico está presente en la solicitud
  if (!email) {
    return res.status(400).json({ message: "Missing required field email" });
  }

  try {
    // Buscar un usuario en la base de datos con la dirección de correo electrónico proporcionada
    const user = await User.findOne({ email });

    // Si no se encuentra el usuario, responder con un código de estado 400 (Bad Request)
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Si el usuario ya está verificado, responder con un código de estado 400
    if (user.verify) {
      return res.status(400).json({ message: "Verification email sent" });
    }

    // Si el usuario no está verificado, obtener el token de verificación existente
    const verificationToken = user.verificationToken;

    // Enviar el correo de verificación nuevamente utilizando el servicio de correo electrónico
    await emailService.sendEmail(email, verificationToken);

    // Responder con un código de estado 200 y un mensaje de éxito
    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    // Pasar cualquier error al middleware de manejo de errores
    next(error);
  }
};

// Exportar el controlador para su uso en otras partes de la aplicación
module.exports = resendVerificationEmailCtrl;
export function notFound(req, res) {
  res.status(404).json({
    success: false,
    error: "Not Found",
    message: `No existe la ruta ${req.method} ${req.originalUrl}.`,
  });
}

export function errorHandler(error, req, res, next) {
  console.error(error);

  let statusCode = error.statusCode || 500;
  let message = statusCode === 500
    ? "Error interno del servidor."
    : error.message;

  if (error.name === "CastError" || error.name === "ValidationError") {
    statusCode = 400;
    message =
      error.name === "ValidationError"
        ? Object.values(error.errors)
            .map((item) => item.message)
            .join(", ")
        : "El identificador o uno de los valores enviados no tiene un formato valido.";
  } else if (error.code === 11000) {
    statusCode = 409;
    message = "Ya existe un registro con uno de los valores unicos enviados.";
  } else if (error instanceof SyntaxError && "body" in error) {
    statusCode = 400;
    message = "El cuerpo de la solicitud debe contener JSON valido.";
  } else if (statusCode !== 500) {
    message = error.message || "Solicitud no valida.";
  }

  res.status(statusCode).json({
    success: false,
    error: statusCode === 500 ? "Internal Server Error" : "Request Error",
    message,
  });
}

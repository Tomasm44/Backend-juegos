import jwt from "jsonwebtoken"

export const verificarToken = (req, res, next) => {
  // Usamos 'let' porque vamos a modificar la variable 'token'
  let token = req.headers.authorization 

  if (!token) {
    return res.status(401).json({ message: "No autorizado" })
  }

  // ESTO ES LO QUE FALTABA: Limpiar el prefijo "Bearer "
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  try {
    // Aquí "secreto" debe ser igual al que usaste para crear el token
    const data = jwt.verify(token, "secreto") 
    req.user = data
    next()
  } catch (error) {
    res.status(401).json({ message: "Token inválido" })
  }
}
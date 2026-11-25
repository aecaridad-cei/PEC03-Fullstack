import User from "../models/User.js";

export async function getAllUsers(req, res, next) {
  try {
    const users = await User.find().sort({ nombre: 1 });
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserById(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado.",
      });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

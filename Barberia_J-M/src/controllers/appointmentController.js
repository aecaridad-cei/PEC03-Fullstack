import Appointment from "../models/Appointment.js";

export async function getAllAppointments(req, res, next) {
  try {
    const appointments = await Appointment.find().sort({ fecha: 1, horaInicio: 1 });
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAppointmentById(req, res, next) {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Cita no encontrada.",
      });
    }

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
}

export async function createAppointment(req, res, next) {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json({
      success: true,
      message: "Cita creada correctamente.",
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateAppointment(req, res, next) {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Cita no encontrada.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cita actualizada correctamente.",
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteAppointment(req, res, next) {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Cita no encontrada.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cita eliminada correctamente.",
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
}

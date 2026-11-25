import express from "express";
import {
  createAppointment,
  deleteAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.route("/").get(getAllAppointments).post(createAppointment);
router
  .route("/:id")
  .get(getAppointmentById)
  .put(updateAppointment)
  .delete(deleteAppointment);

export default router;

import express from "express";
import {bookReservation, deleteReservation,getReservations, editReservation} from "../controllers/reservationController.js"
const router = express.Router();

// @desc book new reservation
router.post("/book",bookReservation);

// @desc delete the reservation
router.post("/delete",deleteReservation);

// @desc get reservations
router.get("/",getReservations);

// @desc edit the reservation
router.patch("/edit",editReservation);
export default router;

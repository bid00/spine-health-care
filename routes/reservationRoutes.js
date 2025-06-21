import express from "express";
import {bookReservation, deleteReservation,getReservations, editReservation} from "../controllers/reservationController.js"
const router = express.Router();

// book new reservation
router.post("/book",bookReservation);

// delete the reservation
router.post("/delete",deleteReservation);

// get reservations
router.get("/",getReservations);

// edit the reservation
router.patch("/edit",editReservation);
export default router;

import Reservation from "../models/reservationModel.js";

//  book new Reservation
//  /api/reservations/book
const bookReservation = async (req, res) => {
  try {
    const { date, timeSlot , reportId}=req.body;
    const userId = req.user._id;
    const existing = await Reservation.findOne({ date, timeSlot });
    if (existing) {
      return res.status(400).json({ message: 'This time slot is already booked.' });
    }

    const reservation = new Reservation({
      reportId,
      date,
      timeSlot,
      userId
    });

    await reservation.save();

    res.status(201).json({
      message: 'Reservation booked successfully',
      reservation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

//  get user reservations
//  /api/reservations/
const getReservations = async(req,res)=>{
  const userId = req.user._id;
  try {
    const reservations = await Reservation.find({userId}).populate("reportId");
    if (!reservations) {
      return res.status(404).json({message:"no reservations"});
    }
    return res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({message :"Server Error",error: error.message});
  }
}

//  delete reservation
// /api/reservations/delete
const deleteReservation = async (req,res)=>{
  const userId = req.user._id;
  const reservationId = req.body.reservationId;
  !reservationId?res.status(400).json({message:"reservationID is required"}):'';
  try {

    const reservation = await Reservation.findById(reservationId);
    if (!reservation.userId.toString() === userId) {
      return res.status(403).json({message:"you are not authorized to delete that reservation"});
    }
    await reservation.deleteOne();
    return res.status(200).json({message:"reservation deleted successfully"});
  } catch (error) {
    res.status(500).json({message :"Server Error",error: error.message});
  }
}

//  edit reservation
// /api/reservations/edit
const editReservation = async(req,res)=>{
  const userId = req.user._id;
  const reservationId = req.body.reservationId;
  const {date,timeSlot}= req.body
  !reservationId?res.status(400).json({message:"reservationID is required"}):'';
  try {

    const reservation = await Reservation.findById(reservationId);
    if (!reservation.userId.toString() === userId) {
      return res.status(403).json({message:"you are not authorized to edit that reservation"});
    }
    const existing = await Reservation.findOne({ date, timeSlot });
    if (existing && existing._id.toString() !== reservationId) {
      return res.status(400).json({ message: "This time slot is already booked." });
    }
    reservation.date = date;
    reservation.timeSlot = timeSlot;
    await reservation.save();
    return res.status(200).json({message:"reservation edited successfully"});
  } catch (error) {
    res.status(500).json({message :"Server Error",error: error.message});
  }

}
export {bookReservation , deleteReservation ,getReservations , editReservation};
import { mongoose } from "mongoose";

const reservationtSchema = new mongoose.Schema({
    reportId:{
        type:mongoose.Schema.ObjectId,
        ref:"Report",
        required:true
    },
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    date: {
        type: Date,
        required: true,
    },
    timeSlot: {
        type: String, 
        required: true,
    },
    status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
});

const Reservation = mongoose.model("Reservation",reservationtSchema);
export default Reservation;
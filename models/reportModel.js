import { mongoose } from "mongoose";

const reportSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:"Users",
        required:true
    },
    diseaseName:{
        type:String
    },
    dangerScore:{
        type: Number
    },
    confidence:{
        type: Number
    },
    picture:{
        type:String,
        default:"",
        required:true
    },
    
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Report = mongoose.model('Report',reportSchema);

export default Report;
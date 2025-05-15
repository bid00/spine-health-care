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
    picture:{
        type:String,
        default:"",
        required:true
    },
    dangerScore:{
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Report = mongoose.model('Report',reportSchema);

export default Report;
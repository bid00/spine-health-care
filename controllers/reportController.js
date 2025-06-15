import Report from "../models/reportModel.js";


// @desc NEW REPORT
// @desc /api/report/new
const newReport = async (req,res) => {
    const userId = req.user._id;
    const picture = req.file ? `/uploads/report/${req.file.filename}` : null;

    try {
        const imageUrl = {picture: `${req.protocol}://${req.get("host")}${picture}`};
        const response= await fetch("http://127.0.0.1:5000/predict",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify(imageUrl)
        })
        const modelData = await response.json();
        const {diseaseName , dangerScore , confidence} = modelData;
        const report = new Report({userId,picture,dangerScore:parseFloat(dangerScore),diseaseName,confidence:parseFloat(confidence)});
        await report.save();
        return res.status(200).json(report);
    } catch (error) {
        return res.status(500).json({message :"Server Error",error: error.message});
    }

}

// @desc get user reports
// @route /api/report/
const getReports = async (req,res)=>{
    const userId = req.user._id;

    try {
        const reports = await Report.find({userId});
    if (reports) {
        const updatedReports = reports.map(report => ({
            _id:report._id,
            userId: report.userId,
            diseaseName:report.diseaseName,
            dangerScore:report.dangerScore,
            confidence:report.confidence,
            picture:`${req.protocol}://${req.get("host")}${report.picture}`
        }));
        return res.status(200).json(updatedReports);
    }
        return res.status(404).json({"message":"user don't have any reports"})

    } catch (error) {
        return res.status(500).json({message :"Server Error",error: error.message});
    }
    
    
}

export {newReport,getReports};
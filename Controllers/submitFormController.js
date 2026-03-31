import HostelVisit from "../Models/HostelVisit.js";

export const submitReport = async (req, res) => {
    try {
        const {
            date,
            hostelName,
            subordinateTeacher,
            generalComments,
            maintenanceRequired,
            complaints
        } = req.body;

        
        const imagePaths = req.files ? req.files.map(file => file.path.replace(/\\/g, '/')) : [];

        if (!date || !hostelName || !maintenanceRequired || !complaints) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }

        const newReport = new HostelVisit({
            teacher: req.userId,
            teacherName: req.user?.name || "Unknown",
            date,
            hostelName,
            subordinateTeacher,
            generalComments,
            maintenanceRequired,
            complaints,
            images: imagePaths
        });

        await newReport.save();

        res.status(201).json({
            success: true,
            message: "Report submitted successfully.",
            data: newReport
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error submitting report: " + error.message
        });
    }
};

export const getReports = async (req, res)=>{
    try {
        const reports = await HostelVisit.find({
            teacher: req.userId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: reports
        
        })
    } catch (error){
        res.status(500).json({
            success: false,
            message: "Error fetching reports: " + error.message
        });
    }
}
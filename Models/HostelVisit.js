import mongoose from "mongoose";

const hostelVisitSchema = new mongoose.Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    teacherName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    hostelName: {
        type: String,
        required: true
    },
    subordinateTeacher: {
        type: String
    },
    generalComments: {
        type: String
    },
    maintenanceRequired: {
        type: String,
        required: true,

    },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Rejected", "Resolved"],
        default: "Pending"
    },
    complaints: {
        type: String,
        required: true
    },
    images: [{
        type: String
    }]
}, { timestamps: true });

const HostelVisit = mongoose.model("HostelVisit", hostelVisitSchema);
export default HostelVisit;
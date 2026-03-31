import mongoose from "mongoose";

const forwardContactSchema = new mongoose.Schema(
  {
    // Matches HostelVisit.maintenanceRequired (e.g. "Electricity", "Water", "Other")
    mainCategory: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true, trim: true },
    contactRole: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

const ForwardContact = mongoose.model("ForwardContact", forwardContactSchema);
export default ForwardContact;


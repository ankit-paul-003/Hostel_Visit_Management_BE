import HostelVisit from "../Models/HostelVisit.js";

export const getAllComplaints = async (req, res) => {
  try {
    
    const complaints = await HostelVisit.find({})
      .sort({ date: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: complaints
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching complaints: " + error.message
    });
  }
};

export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["Pending", "In Progress", "Rejected", "Resolved"];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status."
      });
    }

    const updated = await HostelVisit.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Complaint not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Complaint status updated successfully.",
      data: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating complaint status: " + error.message
    });
  }
};


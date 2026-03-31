import ForwardContact from "../Models/ForwardContact.js";

const validateRequiredFields = (fields, res) => {
  for (const [key, value] of Object.entries(fields)) {
    if (!value || String(value).trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required field: ${key}`
      });
    }
  }
  return null;
};

export const getForwardContacts = async (req, res) => {
  try {
    const contacts = await ForwardContact.find({}).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: contacts
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching forward contacts: " + error.message
    });
  }
};

export const createForwardContact = async (req, res) => {
  try {
    const { mainCategory, contactPerson, contactNumber, contactRole } = req.body;

    const validationError = validateRequiredFields(
      { mainCategory, contactPerson, contactNumber, contactRole },
      res
    );
    if (validationError) return;

    const existing = await ForwardContact.findOne({ mainCategory, contactPerson, contactNumber });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "This contact already exists for the given category."
      });
    }

    const newContact = new ForwardContact({
      mainCategory: String(mainCategory).trim(),
      contactPerson: String(contactPerson).trim(),
      contactNumber: String(contactNumber).trim(),
      contactRole: String(contactRole).trim()
    });

    await newContact.save();

    return res.status(201).json({
      success: true,
      message: "Forward contact created successfully.",
      data: newContact
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating forward contact: " + error.message
    });
  }
};

export const updateForwardContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { mainCategory, contactPerson, contactNumber, contactRole } = req.body;

    const validationError = validateRequiredFields(
      { mainCategory, contactPerson, contactNumber, contactRole },
      res
    );
    if (validationError) return;

    const updated = await ForwardContact.findByIdAndUpdate(
      id,
      {
        mainCategory: String(mainCategory).trim(),
        contactPerson: String(contactPerson).trim(),
        contactNumber: String(contactNumber).trim(),
        contactRole: String(contactRole).trim()
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Forward contact not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Forward contact updated successfully.",
      data: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating forward contact: " + error.message
    });
  }
};

export const deleteForwardContact = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ForwardContact.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Forward contact not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Forward contact deleted successfully."
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting forward contact: " + error.message
    });
  }
};


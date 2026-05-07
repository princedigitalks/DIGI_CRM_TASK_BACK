const {
  createStatusService,
  fetchAllStatusesService,
  updateStatusService,
  deleteStatusService,
} = require("../service/status");

exports.createStatus = async (req, res) => {
  try {
    console.log("Creating status with body:", req.body);
    const status = await createStatusService(req.body);
    res.status(201).json({ success: true, data: status });
  } catch (err) {
    console.error("Status creation error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getAllStatuses = async (req, res) => {
  try {
    const { type = "Project" } = req.query;
    const data = await fetchAllStatusesService(type);
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const status = await updateStatusService(req.params.id, req.body);
    res.status(200).json({ success: true, data: status });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteStatus = async (req, res) => {
  try {
    await deleteStatusService(req.params.id);
    res.status(200).json({ success: true, message: "Status deleted" });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

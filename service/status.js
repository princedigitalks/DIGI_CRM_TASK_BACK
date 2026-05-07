const Status = require("../model/status");

exports.createStatusService = async (body) => {
  const status = await Status.create(body);
  return status;
};

exports.fetchAllStatusesService = async (type = "Project") => {
  const data = await Status.find({ type }).sort({ createdAt: 1 });
  return data;
};

exports.updateStatusService = async (id, body) => {
  const status = await Status.findByIdAndUpdate(id, body, { new: true });
  return status;
};

exports.deleteStatusService = async (id) => {
  await Status.findByIdAndDelete(id);
};

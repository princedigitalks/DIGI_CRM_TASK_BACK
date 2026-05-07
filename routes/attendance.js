const express = require('express');
const router = express.Router();
const Attendance = require('../model/attendance');

// Get all attendance for a staff member
router.get('/staff/:staffId', async (req, res) => {
  try {
    const records = await Attendance.find({ staffId: req.params.staffId }).sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Clock In
router.post('/clock-in', async (req, res) => {
  const { staffId, date, clockIn } = req.body;
  
  // Check if already clocked in today (optional, but good for safety)
  const existing = await Attendance.findOne({ staffId, date, clockOut: null });
  if (existing) {
    return res.status(400).json({ message: 'Already clocked in' });
  }

  const record = new Attendance({
    staffId,
    date,
    clockIn,
    status: 'Active'
  });

  try {
    const newRecord = await record.save();
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Clock Out
router.post('/clock-out', async (req, res) => {
  const { staffId, date, clockOut, totalHours } = req.body;
  
  try {
    const record = await Attendance.findOne({ staffId, date, clockOut: null }).sort({ createdAt: -1 });
    if (!record) {
      return res.status(404).json({ message: 'No active session found' });
    }

    record.clockOut = clockOut;
    record.totalHours = totalHours;
    record.status = 'Completed';
    
    const updated = await record.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;

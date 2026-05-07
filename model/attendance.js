const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  clockIn: {
    type: String, // HH:MM AM/PM
    required: true
  },
  clockOut: {
    type: String, // HH:MM AM/PM
    default: null
  },
  totalHours: {
    type: String,
    default: '—'
  },
  status: {
    type: String,
    enum: ['Active', 'Completed'],
    default: 'Active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);

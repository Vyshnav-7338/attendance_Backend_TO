const mongoose = require('mongoose');

const checkInOutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  checkInPhoto: {
    type: Object,
    required: true
  },
  checkOutPhoto: {
    type: Object
  },
  isCheckedIn: {
    type: Boolean,
    default: true
  },
  checkInTime: {
    type: Date
  },
  checkOutTime: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('CheckInOut', checkInOutSchema);

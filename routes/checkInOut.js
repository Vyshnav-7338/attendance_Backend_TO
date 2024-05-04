// routes/checkInOut.js
const express = require('express');
const router = express.Router();
const CheckInOut = require('../models/CheckInOut');
const multer = require("multer");
const path = require("path");
const authenticate = require('../jwt');


const storage = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
});

// POST /api/checkInOut
router.post('/api/checkin', upload.single('checkInPhoto'),authenticate, async (req, res) => {
  try {
    const userId = req.userId;

      const newCheckIn = new CheckInOut({
          userId,
          checkInPhoto: req.file.filename,
          isCheckedIn: true,
          checkInTime: new Date()
      });
      await newCheckIn.save();

      res.status(201).json({ message: 'Checked in successfully' });
  } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ error: 'Internal server error' });
  }
});
router.put('/api/checkout', upload.single('checkOutPhoto'),authenticate, async (req, res) => {
  try {
    const userId = req.userId;

      const latestCheckIn = await CheckInOut.findOne({ userId, isCheckedIn: true }).sort({ createdAt: -1 });

      if (!latestCheckIn) {
          return res.status(404).json({ error: 'User has not checked in' });
      }

      latestCheckIn.isCheckedIn = false;
      latestCheckIn.checkOutPhoto = req.file.filename; 
      latestCheckIn.checkOutTime = new Date();
      await latestCheckIn.save();

      res.status(200).json({ message: 'Checked out successfully' });
  } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/api/attendance', async (req, res) => {
  try {
      let filter = {};
      const { date } = req.query;
      
      // If date is provided, filter by createdAt date
      if (date) {
          filter = {
              createdAt: {
                  $gte: new Date(date),
                  $lt: new Date(date + 'T23:59:59.999Z')
              }
          };
      }
      
      const attendance = await CheckInOut.find(filter);
      res.json(attendance);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/api/checkInOut', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lt: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1))
      };
    } else if (startDate) {
      query.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.createdAt = { $lt: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)) };
    }

    const checkInOutData = await CheckInOut.find(query).populate('userId', 'name').exec();

    // Calculate monthly attendance for each user separately
    const monthlyAttendance = {};
    checkInOutData.forEach(entry => {
      const user = entry.userId.name;
      const monthYear = entry.createdAt.toISOString().slice(0, 7); // Extracts YYYY-MM
      if (!monthlyAttendance[user]) {
        monthlyAttendance[user] = {};
      }
      if (!monthlyAttendance[user][monthYear]) {
        monthlyAttendance[user][monthYear] = { checkIns: 0, checkOuts: 0 };
      }
      if (entry.isCheckedIn) {
        monthlyAttendance[user][monthYear].checkIns++;
      } else {
        monthlyAttendance[user][monthYear].checkOuts++;
      }
    });

    res.json({ checkInOutData, monthlyAttendance });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

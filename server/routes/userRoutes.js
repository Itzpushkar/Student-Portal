const express = require('express');
const router = express.Router();
const { 
  getDashboard, 
  savePersonalDetails, 
  submitSemester, 
  selectSemester,
  uploadMarksheets 
} = require('../controllers/userController');

router.post('/dashboard', getDashboard);
router.post('/personal', savePersonalDetails);
router.post('/academic', uploadMarksheets, submitSemester);
router.post('/select-semester', selectSemester);

module.exports = router;

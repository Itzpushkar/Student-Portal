const express = require('express');
const router = express.Router();
const { 
  getDashboard, 
  savePersonalDetails, 
  submitSemester, 
  selectSemester,
  uploadMarksheets,
  handleUploadError
} = require('../controllers/userController');

router.post('/dashboard', getDashboard);
router.post('/personal', savePersonalDetails);
router.post('/academic', uploadMarksheets, handleUploadError, submitSemester);
router.post('/select-semester', selectSemester);

module.exports = router;

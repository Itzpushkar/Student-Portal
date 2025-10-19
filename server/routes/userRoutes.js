const express = require('express');
const router = express.Router();
const { getDashboard, savePersonalDetails, submitSemester, selectSemester } = require('../controllers/userController');
const upload = require('../middleware/upload');

router.post('/dashboard', getDashboard);
router.post('/personal', savePersonalDetails);
router.post('/academic', upload.array('uploads', 5), submitSemester);
router.post('/select-semester', selectSemester);

module.exports = router;

// // const User = require('../models/User');
// // const bcrypt = require('bcryptjs');
// // const sendOTP = require('../utils/OTPMailer');

// // exports.signup = async (req, res) => {
// //   try {
// //     const { enrollmentNo, username, email, password, fullName } = req.body;

// //     // Check if user exists
// //     if (await User.findOne({ $or: [{ email }, { username }] }))
// //       return res.status(400).json({ msg: 'Email or username already exists' });

// //     // Hash password
// //     const hashedPassword = await bcrypt.hash(password, 10);

// //     const user = new User({ enrollmentNo, username, email, password: hashedPassword, personalDetails: { fullName } });
    
// //     // Generate OTP
// //     const otp = Math.floor(100000 + Math.random() * 900000).toString();
// //     user.otp = otp;

// //     await user.save();

// //     // Send OTP email
// //     await sendOTP(email, otp);

// //     res.json({ msg: 'OTP sent to your email. Please verify.' });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ msg: 'Server error' });
// //   }
// // };

// // exports.verifyOTP = async (req, res) => {
// //   try {
// //     const { email, otp } = req.body;
// //     const user = await User.findOne({ email });
// //     if (!user) return res.status(400).json({ msg: 'User not found' });

// //     if (user.isVerified) return res.status(400).json({ msg: 'User already verified' });
// //     if (user.otp !== otp) return res.status(400).json({ msg: 'Invalid OTP' });

// //     user.isVerified = true;
// //     user.otp = null;
// //     await user.save();

// //     res.json({ msg: 'OTP verified. You can now login.' });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ msg: 'Server error' });
// //   }
// // };

// // exports.login = async (req, res) => {
// //   try {
// //     const { username, password } = req.body;
// //     const user = await User.findOne({ username });
// //     if (!user) return res.status(400).json({ msg: 'User not found' });
// //     if (!user.isVerified) return res.status(400).json({ msg: 'Email not verified' });

// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) return res.status(400).json({ msg: 'Incorrect password' });

// //     res.json({ msg: 'Login successful', user });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ msg: 'Server error' });
// //   }
// // };


// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const sendOTP = require('../utils/OTPMailer');

// exports.signup = async (req, res) => {
//   try {
//     const { enrollmentNo, username, email, password, fullName } = req.body;

//     // Check if user exists
//     if (await User.findOne({ $or: [{ email }, { username }] }))
//       return res.status(400).json({ msg: 'Email or username already exists' });

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user
//     const user = new User({
//       enrollmentNo,
//       username,
//       email,
//       password: hashedPassword,
//       personalDetails: { fullName },
//       isVerified: false,
//     });

//     // Generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     user.otp = otp;

//     await user.save();

//     // Send OTP
//     await sendOTP(email, otp);

//     // Return user info (including _id)
//     res.json({ msg: 'OTP sent to your email. Please verify.', user: { _id: user._id, email: user.email } });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: 'Server error' });
//   }
// };

// exports.verifyOTP = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ msg: 'User not found' });

//     if (user.isVerified) return res.status(400).json({ msg: 'User already verified' });
//     if (user.otp !== otp) return res.status(400).json({ msg: 'Invalid OTP' });

//     user.isVerified = true;
//     user.otp = null;
//     await user.save();

//     res.json({ msg: 'OTP verified', user }); // return user for frontend login
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: 'Server error' });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });
//     if (!user) return res.status(400).json({ msg: 'User not found' });
//     if (!user.isVerified) return res.status(400).json({ msg: 'Email not verified' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ msg: 'Incorrect password' });

//     res.json({ msg: 'Login successful', user });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: 'Server error' });
//   }
// };


const User = require('../models/User');
const bcrypt = require('bcryptjs');
const sendOTP = require('../utils/OTPMailer');

exports.signup = async (req, res) => {
  try {
    const { enrollmentNo, username, email, password, fullName } = req.body;

    if (await User.findOne({ $or: [{ email }, { username }] }))
      return res.status(400).json({ msg: 'Email or username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      enrollmentNo,
      username,
      email,
      password: hashedPassword,
      personalDetails: { fullName },
      isVerified: false
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;

    await user.save();

    await sendOTP(email, otp);

    res.json({ msg: 'OTP sent to your email. Please verify.', user: { email: user.email, _id: user._id } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    if (user.isVerified) return res.status(400).json({ msg: 'User already verified' });
    if (user.otp !== otp) return res.status(400).json({ msg: 'Invalid OTP' });

    user.isVerified = true;
    user.otp = null;
    await user.save();

    res.json({ msg: 'OTP verified', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'User not found' });
    if (!user.isVerified) return res.status(400).json({ msg: 'Email not verified' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Incorrect password' });

    res.json({ msg: 'Login successful', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

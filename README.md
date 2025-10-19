# 🎓 Student Portal - Complete Academic Management System

A comprehensive student portal system built with React frontend and Node.js/Express backend, featuring OTP verification, progressive semester management, PDF generation, and email notifications.

## 🌟 Features

### Authentication System
- **Signup with OTP Verification**: Students create accounts with email verification
- **Secure Login**: Username/password authentication
- **Session Management**: Persistent user sessions

### Personal Details Management
- **Comprehensive Form**: Full name, DOB, contact, address, 10th percentage, course, branch
- **Auto-fill**: Personal details from signup are pre-filled
- **Update Capability**: Students can update their personal information

### Academic Details Management
- **Semester-wise Progression**: Students can only access current and past semesters
- **Progressive Unlocking**: Future semesters unlock as students progress
- **Marksheet Upload**: Multiple image uploads for each semester
- **GPA Tracking**: Track GPA, backlogs, and remarks for each semester

### PDF Generation & Email
- **Automatic PDF Creation**: Complete student details with marksheet images
- **Email Delivery**: PDFs sent to student's registered email
- **Admin Excel Export**: Data automatically exported to Excel for admin use

### User Experience
- **Responsive Design**: Works on desktop and mobile devices
- **Intuitive Navigation**: Clear step-by-step process
- **Real-time Validation**: Form validation and error handling
- **Status Tracking**: Visual indicators for completed sections

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Email service (Gmail, Outlook, etc.)

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables:**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/student-portal
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   JWT_SECRET=your-jwt-secret
   ```

5. **Start the server:**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd student-portal-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
Student-Portal/
├── server/                    # Backend API
│   ├── config/
│   │   └── db.js             # Database configuration
│   ├── controllers/
│   │   ├── authController.js # Authentication logic
│   │   └── userController.js # User management logic
│   ├── middleware/
│   │   └── upload.js         # File upload middleware
│   ├── models/
│   │   └── User.js           # User data model
│   ├── routes/
│   │   ├── authRoutes.js     # Authentication routes
│   │   └── userRoutes.js     # User management routes
│   ├── utils/
│   │   ├── emailService.js   # Email service
│   │   ├── generateOTP.js    # OTP generation
│   │   ├── otpMailer.js      # OTP email sender
│   │   └── sendEmail.js      # General email sender
│   └── uploads/              # File storage
│       └── marksheets/       # Marksheet images
├── student-portal-frontend/   # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── OTPModal.jsx           # OTP verification modal
│   │   │   ├── PersonalDetailsForm.jsx # Personal details form
│   │   │   ├── AcademicDetailsForm.jsx # Academic details form
│   │   │   └── SemesterSelector.jsx   # Semester selection
│   │   ├── context/
│   │   │   ├── AuthProvider.jsx       # Authentication context
│   │   │   └── useAuth.js             # Authentication hook
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx          # Login page
│   │   │   ├── SignupPage.jsx         # Signup page
│   │   │   └── DashboardPage.jsx      # Main dashboard
│   │   ├── api/
│   │   │   ├── apiClient.js           # API client configuration
│   │   │   ├── auth.js                # Authentication API calls
│   │   │   └── user.js                # User API calls
│   │   └── App.jsx                    # Main app component
│   └── public/                        # Static assets
└── README.md                          # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/login` - User login

### User Management
- `POST /api/user/dashboard` - Get user dashboard data
- `POST /api/user/personal` - Update personal details
- `POST /api/user/academic` - Submit academic details
- `POST /api/user/select-semester` - Update current semester

## 📊 Database Schema

### User Model
```javascript
{
  enrollmentNo: String (unique),
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  otp: String,
  isVerified: Boolean,
  personalDetails: {
    fullName: String,
    dob: String,
    contact: String,
    address: String,
    tenthPercentage: String,
    course: String,
    branch: String,
    profilePhoto: String,
    isCompleted: Boolean,
    completedAt: Date
  },
  academicDetails: [{
    semester: Number,
    gpa: String,
    backlogs: Number,
    remarks: String,
    marksheetImages: [String],
    isCompleted: Boolean,
    completedAt: Date
  }],
  currentSemester: Number,
  isPersonalDetailsCompleted: Boolean,
  isAcademicDetailsCompleted: Boolean,
  lastLogin: Date
}
```

## 🎯 User Flow

### First Time User
1. **Signup**: Fill basic details (name, email, username, enrollment no, password)
2. **OTP Verification**: Verify email with OTP
3. **Personal Details**: Complete personal information form
4. **Academic Details**: Fill academic details for current semester
5. **PDF Generation**: System generates and emails PDF with all details

### Returning User
1. **Login**: Enter username and password
2. **Dashboard**: View current status and options
3. **Update Details**: Modify personal or academic information
4. **Semester Progression**: Select new semester when promoted
5. **Add New Semester**: Fill details for new semester

## 🔒 Security Features

- **Password Hashing**: bcrypt for secure password storage
- **OTP Verification**: Email-based account verification
- **File Upload Validation**: Only image files allowed
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for specific origins

## 📧 Email Configuration

The system uses Nodemailer for email services. Configure your email provider in the environment variables:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

For Gmail, use App Passwords instead of your regular password.

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to Heroku, Vercel, or your preferred platform

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to Netlify, Vercel, or your preferred platform

## 🛠️ Development

### Adding New Features
1. Update the User model if needed
2. Add new API endpoints in controllers
3. Create new routes
4. Update frontend components
5. Test thoroughly

### File Upload
- Images are stored in `server/uploads/marksheets/`
- Maximum file size: 5MB
- Allowed formats: JPG, PNG, GIF, etc.

## 📋 TODO / Future Enhancements

- [ ] Admin dashboard for managing students
- [ ] Bulk email notifications
- [ ] Advanced reporting features
- [ ] Mobile app development
- [ ] Integration with college management systems
- [ ] Real-time notifications
- [ ] Document templates customization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for educational institutions**

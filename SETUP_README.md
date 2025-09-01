# Arogya Rahita - Complete Setup Guide

This project has been updated with the following features:

## ✅ Implemented Features

### 1. SMS OTP Instead of Email OTP
- OTP is now sent via SMS using Twilio
- Updated auth controller to use phone numbers from user profiles
- Added SMS service with Twilio integration

### 2. User Profile Icon in Header
- User profile icon is now visible in the header
- Clicking it opens a user profile modal
- Profile can be edited and updated

### 3. Categories from Database
- Categories are now fetched from the database
- Dynamic category display on home page
- Clicking categories navigates to filtered products

### 4. Products from Database
- All products are now fetched from the database
- Products section and featured products use real data
- Loading states and error handling implemented

### 5. User Profile Editing
- Users can edit their profile information
- Profile updates are saved to the database
- Added new fields: phone, address, city, state, pincode

### 6. Working Search Bar
- Search functionality implemented in header
- Searches through product names, descriptions, and categories
- Results are displayed on the products page

### 7. Product Detail Page
- Clicking "Buy Now" opens detailed product page
- Shows product image, details, pricing, and stock
- Quantity selector and add to cart functionality

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- Twilio account (for SMS OTP)

### 1. Server Setup

```bash
cd server
npm install
```

#### Environment Variables
Create a `.env` file in the server directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/arogyamrahita

# JWT Secrets
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here

# Twilio Configuration for SMS OTP
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here

# Cloudinary Configuration for Image Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name_here
CLOUDINARY_API_KEY=your_cloudinary_api_key_here
CLOUDINARY_API_SECRET=your_cloudinary_api_secret_here

# Base URL for the application
BASE_URL=http://localhost:5000
```

#### Twilio Setup
1. Sign up for a Twilio account at [twilio.com](https://twilio.com)
2. Get your Account SID and Auth Token from the Twilio Console
3. Get a Twilio phone number
4. Add these credentials to your `.env` file

#### Cloudinary Setup
1. Sign up for a Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Get your Cloud Name, API Key, and API Secret from the Cloudinary Dashboard
3. Add these credentials to your `.env` file

#### Start Server
```bash
npm run dev
```

### 2. Client Setup

```bash
cd client
npm install
```

#### Start Client
```bash
npm start
```

## 📱 SMS OTP Configuration

The system now sends OTP codes via SMS instead of email:

1. **Twilio Integration**: Uses Twilio's SMS service
2. **Phone Number**: OTP is sent to the phone number stored in user profile
3. **Fallback**: If SMS fails, the system continues (for development)

## ☁️ Cloudinary Image Storage

Product images are now stored on Cloudinary:

1. **Cloud Storage**: Images are uploaded directly to Cloudinary
2. **Database URLs**: Cloudinary URLs are saved in the database
3. **Automatic Optimization**: Images are automatically resized and optimized
4. **CDN Delivery**: Fast image delivery via Cloudinary's CDN

## 🔍 Search Functionality

The search bar in the header now works:

1. **Real-time Search**: Searches through product names, descriptions, and categories
2. **Navigation**: Search results are displayed on the products page
3. **Query Parameters**: Search terms are passed via URL parameters

## 👤 User Profile Management

Users can now manage their profiles:

1. **Profile Fields**: Name, phone, address, city, state, pincode
2. **Edit Mode**: Toggle between view and edit modes
3. **Database Updates**: All changes are saved to the database
4. **Real-time Updates**: Profile changes are reflected immediately

## 🛍️ Product Management

Products are now fully integrated with the database:

1. **Dynamic Loading**: Products are fetched from the database
2. **Categories**: Products are organized by categories
3. **Search**: Products can be searched and filtered
4. **Detail Pages**: Full product information with images and descriptions

## 🎯 Buy Now Functionality

Clicking "Buy Now" now works properly:

1. **Product Detail Page**: Opens a dedicated product page
2. **Full Information**: Shows product image, details, pricing, and stock
3. **Quantity Selection**: Users can choose quantity before adding to cart
4. **Add to Cart**: Products can be added to cart from detail page

## 🎨 UI/UX Improvements

1. **Loading States**: Skeleton loading animations for better UX
2. **Error Handling**: Proper error messages and retry buttons
3. **Responsive Design**: Mobile-friendly layouts
4. **Modern Styling**: Clean, professional appearance

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (sends SMS OTP)
- `POST /api/auth/verify-otp` - Verify OTP
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with search/category filters)
- `GET /api/products/categories` - Get all categories
- `GET /api/products/:id` - Get product by ID

## 🚨 Important Notes

1. **Twilio Credentials**: Make sure to add valid Twilio credentials for SMS to work
2. **Cloudinary Credentials**: Make sure to add valid Cloudinary credentials for image storage
3. **Database**: Ensure MongoDB is running and accessible
4. **Phone Numbers**: Users must provide valid phone numbers during registration
5. **Environment Variables**: All required environment variables must be set

## 🐛 Troubleshooting

### SMS Not Working
- Check Twilio credentials in `.env` file
- Verify phone number format (should include country code)
- Check Twilio account balance

### Images Not Uploading
- Check Cloudinary credentials in `.env` file
- Verify Cloudinary account is active
- Check file size limits (5MB max)
- Ensure image format is supported (jpg, jpeg, png, gif, webp)

### Products Not Loading
- Ensure MongoDB is running
- Check database connection string
- Verify product data exists in database

### Search Not Working
- Check if products API is responding
- Verify search query parameters
- Check browser console for errors

## 📞 Support

If you encounter any issues:

1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check MongoDB connection and data

## 🎉 Success!

Once everything is set up correctly, you should have:

- ✅ SMS OTP authentication (sent to phone numbers)
- ✅ Cloudinary image storage (images stored in cloud, URLs in database)
- ✅ Dynamic product loading from database
- ✅ Working search functionality
- ✅ User profile management
- ✅ Product detail pages
- ✅ Category filtering
- ✅ Modern, responsive UI

The application is now fully functional with all requested features implemented!

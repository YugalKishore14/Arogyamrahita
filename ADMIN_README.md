# Admin Dashboard - Arogya Rahita

## Overview
This admin dashboard provides comprehensive product management functionality for the Arogya Rahita website. It allows administrators to create, edit, delete, and manage products with images, prices, descriptions, and inventory.

## Features

### 🔐 Authentication & Security
- Admin-only access with role-based authentication
- JWT token-based security
- Logout functionality
- Protected API endpoints

### 📦 Product Management
- **Create Products**: Add new products with comprehensive details
- **Edit Products**: Modify existing product information
- **Delete Products**: Soft delete products (mark as inactive)
- **View Products**: See all products with their current status

### 🖼️ Image Management
- **Image Upload**: Direct file upload support (JPG, PNG, GIF)
- **File Validation**: 5MB size limit with format validation
- **Image Preview**: See current product images
- **Cloud Storage Ready**: Easy to integrate with cloud services

### 💰 Pricing System
- **Old Price**: Original product price (displayed with strikethrough)
- **New Price**: Current selling price (highlighted)
- **Currency**: Indian Rupees (₹) support

### 📝 Product Details
- **Name**: Product title
- **Description**: Detailed product information
- **Category**: Product classification (health, wellness, supplements, etc.)
- **Stock**: Inventory quantity
- **Status**: Active/Inactive toggle

## Technical Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **CORS** enabled for cross-origin requests

### Frontend
- **React.js** with hooks
- **CSS Modules** for styling
- **Responsive Design** for mobile and desktop
- **Modern UI** with gradient backgrounds and glassmorphism

## Setup Instructions

### 1. Server Setup
```bash
cd server
npm install
npm run dev
```

### 2. Client Setup
```bash
cd client
npm install
npm start
```

### 3. Database Setup
- Ensure MongoDB is running
- Set up environment variables (MONGO_URI, JWT_SECRET)
- Create an admin user with role: "admin"

### 4. Environment Variables
Create a `.env` file in the server directory:
```env
MONGO_URI=mongodb://localhost:27017/arogyamrahita
JWT_SECRET=your_secret_key_here
PORT=4000
```

## API Endpoints

### Public Routes
- `GET /api/products` - Get all active products
- `GET /api/products/:id` - Get product by ID

### Admin Routes (Protected)
- `POST /api/products/upload-image` - Upload product image
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/admin/all` - Get all products (including inactive)

## Usage Guide

### Adding a New Product
1. Click the "+ Add Product" button
2. Fill in product details:
   - Product name
   - Description
   - Upload image (drag & drop or click to browse)
   - Set old and new prices
   - Select category
   - Enter stock quantity
3. Click "Add Product" to save

### Editing a Product
1. Click the "Edit" button on any product card
2. Modify the desired fields
3. Click "Update Product" to save changes

### Deleting a Product
1. Click the "Delete" button on any product card
2. Confirm deletion in the popup
3. Product will be marked as inactive

### Image Upload
1. Click "Choose File" in the image upload section
2. Select an image file (JPG, PNG, GIF)
3. File will be uploaded automatically
4. Image URL will be populated in the form

## File Structure

```
server/
├── models/
│   ├── User.js          # User model with admin roles
│   └── Product.js       # Product model
├── controllers/
│   └── product.controller.js  # Product CRUD operations
├── routes/
│   └── product.route.js      # Product API routes
├── services/
│   └── image.service.js      # Image upload handling
├── middlewares/
│   └── auth.middleware.js    # Authentication & authorization
└── uploads/                  # Image storage directory

client/
├── src/
│   ├── Admin/
│   │   └── Dashboard.js      # Main admin dashboard
│   ├── components/
│   │   └── ImageUpload.js    # Image upload component
│   └── css/
│       └── AdminDashboard.module.css  # Dashboard styling
```

## Security Features

- **Role-based Access Control**: Only users with admin role can access
- **JWT Token Validation**: Secure API access
- **Input Validation**: Server-side validation for all inputs
- **File Type Validation**: Only image files allowed
- **File Size Limits**: 5MB maximum file size
- **SQL Injection Protection**: MongoDB with Mongoose

## Responsive Design

The dashboard is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## Future Enhancements

- **Bulk Operations**: Import/export multiple products
- **Advanced Search**: Filter and search products
- **Analytics Dashboard**: Sales and inventory reports
- **Cloud Storage**: Integration with AWS S3 or similar
- **Real-time Updates**: WebSocket for live updates
- **Audit Logs**: Track all admin actions

## Troubleshooting

### Common Issues

1. **Image Upload Fails**
   - Check file size (must be < 5MB)
   - Ensure file is an image (JPG, PNG, GIF)
   - Verify server uploads directory exists

2. **Authentication Errors**
   - Check JWT token in localStorage
   - Ensure user has admin role
   - Verify server is running

3. **Database Connection Issues**
   - Check MongoDB connection string
   - Ensure MongoDB service is running
   - Verify network connectivity

### Support
For technical support or questions, please contact the development team.

---

**Note**: This admin dashboard is designed specifically for the Arogya Rahita website and includes all necessary features for comprehensive product management.

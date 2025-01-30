# PHOTO SHARING APP

## Features Implemented

### 1. Nodemon for Development
- Automatically restarts the Node.js application when file changes are detected
- Ensures smoother development workflow by removing the need for manual server restarts

### 2. Dynamic Templating with EJS
- Uses EJS (Embedded JavaScript) to generate dynamic content in HTML pages
- Implements partials for reusable components like headers, footers, and sidebars to avoid code duplication

### 3. MariaDB Integration
- Configured MariaDB to handle relational data storage with robust features like transactions and foreign keys
- Utilizes MariaDB's pluggable storage engine architecture for efficient database operations

### 4. User Authentication and Password Management
- Password encryption using bcryptjs to securely store passwords in the database
- User login functionality with secure password comparison

### 5. User Sessions with express-session
- Implements user authentication using sessions to track logged-in users
- Protects routes by ensuring users are logged in before accessing specific pages

### 6. User Logout and Session Destruction
- Provides functionality for logging out users by destroying the session and clearing the session data

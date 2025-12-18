# 🏨 Hotel Booking Website

A full-stack hotel booking application built with Python Flask backend and React frontend. This application allows users to register hotels, manage room inventory, search for available rooms, and make bookings - similar to platforms like Trip.com.

## 🚀 Features

### Hotel Management
- **Register New Hotels**: Add hotels with details like name, location, description, and amenities
- **Update Hotel Information**: Edit existing hotel information
- **View All Hotels**: Browse all registered hotels

### Room Management
- **Add Rooms to Hotels**: Create different room types with pricing and inventory
- **Room Types**: Support for various room categories (Deluxe, Standard, Suite, etc.)
- **Inventory Management**: Track total available rooms

### Booking System
- **Search Available Rooms**: Check room availability by date range and hotel
- **Real-time Availability**: System automatically calculates available rooms based on existing bookings
- **Make Bookings**: Reserve rooms for specific dates
- **View Bookings**: See all bookings or filter by guest email

## 🛠️ Technology Stack

### Backend
- **Python 3.x**: Programming language
- **Flask**: Lightweight web framework
- **SQLite**: Simple, file-based database (perfect for getting started)
- **Flask-CORS**: Handle Cross-Origin Resource Sharing

### Frontend
- **React 18**: Modern UI library
- **Vite**: Fast build tool and dev server
- **Axios**: HTTP client for API calls
- **CSS3**: Custom styling with responsive design

## 📋 Prerequisites

- Python 3.7 or higher
- Node.js 16 or higher
- npm (comes with Node.js)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/alvinjchua888/Hotel-Booking-Website.git
cd Hotel-Booking-Website
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run the Flask server
python app.py
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:3000`

## 📖 Usage Guide

### 1. Managing Hotels

1. Navigate to the **"Manage Hotels"** tab
2. Fill in the hotel registration form:
   - Hotel Name (required)
   - Location (required)
   - Description (optional)
   - Amenities (optional, comma-separated)
3. Click **"Create Hotel"** to register
4. To edit, click the **"Edit"** button on any hotel card

### 2. Adding Rooms

1. In the **"Manage Hotels"** tab, click **"Add Rooms to Hotel"**
2. Select a hotel from the dropdown
3. Enter room details:
   - Room Type (e.g., Deluxe, Standard)
   - Price per night
   - Total number of rooms
4. Click **"Add Room"**

### 3. Searching for Rooms

1. Go to the **"Search Rooms"** tab
2. Enter your travel dates:
   - Check-in date
   - Check-out date
3. Optionally select a specific hotel
4. Click **"Search Rooms"** to see available options

### 4. Making a Booking

1. After searching, click **"Book Now"** on your preferred room
2. Fill in the booking form:
   - Your name
   - Your email
   - Check-in and check-out dates
   - Number of rooms needed
3. Click **"Confirm Booking"**

### 5. Viewing Bookings

1. Navigate to the **"My Bookings"** tab
2. View all bookings or filter by email address
3. See booking details including total cost

## 🗄️ Database Schema

### Hotels Table
```sql
- id (INTEGER PRIMARY KEY)
- name (TEXT)
- location (TEXT)
- description (TEXT)
- amenities (TEXT)
- created_at (TIMESTAMP)
```

### Rooms Table
```sql
- id (INTEGER PRIMARY KEY)
- hotel_id (INTEGER, FOREIGN KEY)
- room_type (TEXT)
- price (REAL)
- total_rooms (INTEGER)
```

### Bookings Table
```sql
- id (INTEGER PRIMARY KEY)
- room_id (INTEGER, FOREIGN KEY)
- guest_name (TEXT)
- guest_email (TEXT)
- check_in_date (DATE)
- check_out_date (DATE)
- num_rooms (INTEGER)
- created_at (TIMESTAMP)
```

## 🔌 API Endpoints

### Hotels
- `GET /api/hotels` - Get all hotels
- `GET /api/hotels/<id>` - Get specific hotel
- `POST /api/hotels` - Create new hotel
- `PUT /api/hotels/<id>` - Update hotel

### Rooms
- `GET /api/hotels/<id>/rooms` - Get rooms for a hotel
- `POST /api/rooms` - Add new room
- `GET /api/rooms/available` - Search available rooms (query params: check_in, check_out, hotel_id)

### Bookings
- `GET /api/bookings` - Get all bookings (optional query param: email)
- `POST /api/bookings` - Create new booking

### Health Check
- `GET /api/health` - Server health check

## 🚀 Production Deployment

### Backend (Flask)
For production, consider using:
- **Gunicorn** as WSGI server
- **PostgreSQL** or **MySQL** instead of SQLite
- Environment variables for configuration
- Proper error handling and logging

### Frontend (React)
```bash
npm run build
```
Deploy the `dist` folder to static hosting (Netlify, Vercel, etc.)

## 🔒 Security Considerations

- Add authentication and authorization
- Validate and sanitize all user inputs
- Use environment variables for sensitive data
- Implement rate limiting
- Add HTTPS in production
- Validate date ranges and booking constraints

## 🎨 Customization

The application uses a clean, modern design with:
- Purple gradient color scheme
- Responsive layout for mobile devices
- Smooth transitions and hover effects
- Clear visual feedback for user actions

You can customize colors in `frontend/src/App.css` by modifying the CSS variables.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ using GitHub Copilot

---

**Note**: This is a starter project. For production use, add proper authentication, payment processing, email notifications, and more robust error handling.

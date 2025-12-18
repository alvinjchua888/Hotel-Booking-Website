# Quick Start Guide

Get the hotel booking website running in minutes!

## Prerequisites

- Python 3.7+
- Node.js 16+
- npm (comes with Node.js)

## Step 1: Start the Backend

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start Flask server (runs on http://localhost:5000)
python app.py
```

The backend server will start and create a SQLite database file (`hotel_booking.db`) automatically.

## Step 2: Start the Frontend (New Terminal)

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies (first time only)
npm install

# Start Vite dev server (runs on http://localhost:3000)
npm run dev
```

## Step 3: Use the Application

Open your browser and navigate to **http://localhost:3000**

### First Steps:

1. **Manage Hotels Tab** - Register your first hotel
2. **Manage Hotels Tab** - Add rooms to your hotel
3. **Search Rooms Tab** - Search for available rooms
4. **Search Rooms Tab** - Click "Book Now" and complete a booking
5. **My Bookings Tab** - View your bookings

## Sample Data

To quickly test the application, create a hotel and rooms via the API:

```bash
# Create a hotel
curl -X POST http://localhost:5000/api/hotels \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Hotel","location":"New York","description":"Test hotel","amenities":"WiFi, Pool"}'

# Add a room (use hotel ID from previous response)
curl -X POST http://localhost:5000/api/rooms \
  -H "Content-Type: application/json" \
  -d '{"hotel_id":1,"room_type":"Deluxe","price":199.99,"total_rooms":10}'
```

## Troubleshooting

### Backend Issues

- **Port 5000 already in use**: Change the port in `backend/app.py` (line 294)
- **Module not found**: Ensure you're in the backend directory and ran `pip install -r requirements.txt`

### Frontend Issues

- **Port 3000 already in use**: Vite will automatically suggest port 3001
- **Cannot connect to backend**: Ensure the Flask server is running on port 5000

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore the API endpoints
- Customize the UI styling in `frontend/src/App.css`
- Add authentication and payment processing for production use

Enjoy your hotel booking website! 🏨

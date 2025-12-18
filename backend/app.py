from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import sqlite3
import os

app = Flask(__name__)
CORS(app)

DATABASE = 'hotel_booking.db'

def get_db():
    """Get database connection"""
    db = sqlite3.connect(DATABASE)
    db.row_factory = sqlite3.Row
    return db

def init_db():
    """Initialize database with tables"""
    db = get_db()
    cursor = db.cursor()
    
    # Hotels table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS hotels (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            location TEXT NOT NULL,
            description TEXT,
            amenities TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Rooms table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS rooms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            hotel_id INTEGER NOT NULL,
            room_type TEXT NOT NULL,
            price REAL NOT NULL,
            total_rooms INTEGER NOT NULL,
            FOREIGN KEY (hotel_id) REFERENCES hotels (id)
        )
    ''')
    
    # Bookings table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            room_id INTEGER NOT NULL,
            guest_name TEXT NOT NULL,
            guest_email TEXT NOT NULL,
            check_in_date DATE NOT NULL,
            check_out_date DATE NOT NULL,
            num_rooms INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (room_id) REFERENCES rooms (id)
        )
    ''')
    
    db.commit()
    db.close()

# Initialize database on startup
init_db()

@app.route('/api/hotels', methods=['GET'])
def get_hotels():
    """Get all hotels"""
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM hotels')
    hotels = [dict(row) for row in cursor.fetchall()]
    db.close()
    return jsonify(hotels)

@app.route('/api/hotels/<int:hotel_id>', methods=['GET'])
def get_hotel(hotel_id):
    """Get a specific hotel"""
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM hotels WHERE id = ?', (hotel_id,))
    hotel = cursor.fetchone()
    db.close()
    
    if hotel:
        return jsonify(dict(hotel))
    return jsonify({'error': 'Hotel not found'}), 404

@app.route('/api/hotels', methods=['POST'])
def create_hotel():
    """Create a new hotel"""
    data = request.json
    
    if not data.get('name') or not data.get('location'):
        return jsonify({'error': 'Name and location are required'}), 400
    
    db = get_db()
    cursor = db.cursor()
    cursor.execute('''
        INSERT INTO hotels (name, location, description, amenities)
        VALUES (?, ?, ?, ?)
    ''', (data['name'], data['location'], data.get('description', ''), data.get('amenities', '')))
    
    hotel_id = cursor.lastrowid
    db.commit()
    db.close()
    
    return jsonify({'id': hotel_id, 'message': 'Hotel created successfully'}), 201

@app.route('/api/hotels/<int:hotel_id>', methods=['PUT'])
def update_hotel(hotel_id):
    """Update an existing hotel"""
    data = request.json
    
    db = get_db()
    cursor = db.cursor()
    
    # Check if hotel exists
    cursor.execute('SELECT * FROM hotels WHERE id = ?', (hotel_id,))
    if not cursor.fetchone():
        db.close()
        return jsonify({'error': 'Hotel not found'}), 404
    
    cursor.execute('''
        UPDATE hotels
        SET name = ?, location = ?, description = ?, amenities = ?
        WHERE id = ?
    ''', (data.get('name'), data.get('location'), data.get('description', ''), 
          data.get('amenities', ''), hotel_id))
    
    db.commit()
    db.close()
    
    return jsonify({'message': 'Hotel updated successfully'})

@app.route('/api/hotels/<int:hotel_id>/rooms', methods=['GET'])
def get_hotel_rooms(hotel_id):
    """Get all rooms for a hotel"""
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM rooms WHERE hotel_id = ?', (hotel_id,))
    rooms = [dict(row) for row in cursor.fetchall()]
    db.close()
    return jsonify(rooms)

@app.route('/api/rooms', methods=['POST'])
def create_room():
    """Create a new room"""
    data = request.json
    
    required_fields = ['hotel_id', 'room_type', 'price', 'total_rooms']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    db = get_db()
    cursor = db.cursor()
    cursor.execute('''
        INSERT INTO rooms (hotel_id, room_type, price, total_rooms)
        VALUES (?, ?, ?, ?)
    ''', (data['hotel_id'], data['room_type'], data['price'], data['total_rooms']))
    
    room_id = cursor.lastrowid
    db.commit()
    db.close()
    
    return jsonify({'id': room_id, 'message': 'Room created successfully'}), 201

@app.route('/api/rooms/available', methods=['GET'])
def get_available_rooms():
    """Get available rooms based on date range"""
    check_in = request.args.get('check_in')
    check_out = request.args.get('check_out')
    hotel_id = request.args.get('hotel_id')
    
    db = get_db()
    cursor = db.cursor()
    
    # Build query based on whether dates are provided
    if check_in and check_out:
        query = '''
            SELECT r.*, h.name as hotel_name, h.location as hotel_location,
                   r.total_rooms - COALESCE(SUM(CASE 
                       WHEN b.check_in_date <= ? AND b.check_out_date >= ?
                       THEN b.num_rooms ELSE 0 END), 0) as available_rooms
            FROM rooms r
            JOIN hotels h ON r.hotel_id = h.id
            LEFT JOIN bookings b ON r.id = b.room_id
        '''
        params = [check_out, check_in]
    else:
        # No dates provided, show all rooms with their total capacity
        query = '''
            SELECT r.*, h.name as hotel_name, h.location as hotel_location,
                   r.total_rooms as available_rooms
            FROM rooms r
            JOIN hotels h ON r.hotel_id = h.id
        '''
        params = []
    
    if hotel_id:
        if 'WHERE' not in query:
            query += ' WHERE r.hotel_id = ?'
        else:
            query += ' AND r.hotel_id = ?'
        params.append(hotel_id)
    
    if check_in and check_out:
        query += ' GROUP BY r.id HAVING available_rooms > 0'
    
    cursor.execute(query, params)
    rooms = [dict(row) for row in cursor.fetchall()]
    db.close()
    
    return jsonify(rooms)

@app.route('/api/bookings', methods=['POST'])
def create_booking():
    """Create a new booking"""
    data = request.json
    
    required_fields = ['room_id', 'guest_name', 'guest_email', 'check_in_date', 'check_out_date', 'num_rooms']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    db = get_db()
    cursor = db.cursor()
    
    # Check room availability
    cursor.execute('''
        SELECT r.total_rooms - COALESCE(SUM(b.num_rooms), 0) as available_rooms
        FROM rooms r
        LEFT JOIN bookings b ON r.id = b.room_id
            AND b.check_in_date <= ? AND b.check_out_date >= ?
        WHERE r.id = ?
        GROUP BY r.id
    ''', (data['check_out_date'], data['check_in_date'], data['room_id']))
    
    result = cursor.fetchone()
    if not result or result['available_rooms'] < data['num_rooms']:
        db.close()
        return jsonify({'error': 'Not enough rooms available'}), 400
    
    cursor.execute('''
        INSERT INTO bookings (room_id, guest_name, guest_email, check_in_date, check_out_date, num_rooms)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (data['room_id'], data['guest_name'], data['guest_email'], 
          data['check_in_date'], data['check_out_date'], data['num_rooms']))
    
    booking_id = cursor.lastrowid
    db.commit()
    db.close()
    
    return jsonify({'id': booking_id, 'message': 'Booking created successfully'}), 201

@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    """Get all bookings"""
    email = request.args.get('email')
    
    db = get_db()
    cursor = db.cursor()
    
    if email:
        cursor.execute('''
            SELECT b.*, r.room_type, r.price, h.name as hotel_name
            FROM bookings b
            JOIN rooms r ON b.room_id = r.id
            JOIN hotels h ON r.hotel_id = h.id
            WHERE b.guest_email = ?
            ORDER BY b.created_at DESC
        ''', (email,))
    else:
        cursor.execute('''
            SELECT b.*, r.room_type, r.price, h.name as hotel_name
            FROM bookings b
            JOIN rooms r ON b.room_id = r.id
            JOIN hotels h ON r.hotel_id = h.id
            ORDER BY b.created_at DESC
        ''')
    
    bookings = [dict(row) for row in cursor.fetchall()]
    db.close()
    
    return jsonify(bookings)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

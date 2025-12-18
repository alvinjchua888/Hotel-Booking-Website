import React, { useState, useEffect } from 'react'
import axios from 'axios'

function BookingForm({ selectedRoom }) {
  const [bookingData, setBookingData] = useState({
    room_id: '',
    guest_name: '',
    guest_email: '',
    check_in_date: '',
    check_out_date: '',
    num_rooms: 1
  })

  useEffect(() => {
    if (selectedRoom) {
      setBookingData(prev => ({
        ...prev,
        room_id: selectedRoom.id,
        check_in_date: selectedRoom.check_in || '',
        check_out_date: selectedRoom.check_out || ''
      }))
    }
  }, [selectedRoom])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!bookingData.room_id) {
      alert('Please select a room from the search results above')
      return
    }

    try {
      await axios.post('http://localhost:5000/api/bookings', bookingData)
      alert('Booking created successfully! Check "My Bookings" tab to view.')
      setBookingData({
        room_id: '',
        guest_name: '',
        guest_email: '',
        check_in_date: '',
        check_out_date: '',
        num_rooms: 1
      })
    } catch (error) {
      console.error('Error creating booking:', error)
      alert(error.response?.data?.error || 'Failed to create booking')
    }
  }

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0]
  }

  return (
    <div id="booking-form" className="booking-form-section">
      <div className="section">
        <h2>Make a Booking</h2>
        {selectedRoom && (
          <div className="selected-room-info" style={{
            backgroundColor: '#f8f9ff',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            border: '2px solid #667eea'
          }}>
            <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>
              Selected Room: {selectedRoom.room_type}
            </h3>
            <p style={{ margin: '0.25rem 0' }}>
              <strong>Hotel:</strong> {selectedRoom.hotel_name}
            </p>
            <p style={{ margin: '0.25rem 0' }}>
              <strong>Location:</strong> {selectedRoom.hotel_location}
            </p>
            <p style={{ margin: '0.25rem 0' }}>
              <strong>Price:</strong> ${selectedRoom.price}/night
            </p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label>Your Name *</label>
            <input
              type="text"
              value={bookingData.guest_name}
              onChange={(e) => setBookingData({ ...bookingData, guest_name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Your Email *</label>
            <input
              type="email"
              value={bookingData.guest_email}
              onChange={(e) => setBookingData({ ...bookingData, guest_email: e.target.value })}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Check-in Date *</label>
              <input
                type="date"
                value={bookingData.check_in_date}
                onChange={(e) => setBookingData({ ...bookingData, check_in_date: e.target.value })}
                min={getTodayDate()}
                required
              />
            </div>
            <div className="form-group">
              <label>Check-out Date *</label>
              <input
                type="date"
                value={bookingData.check_out_date}
                onChange={(e) => setBookingData({ ...bookingData, check_out_date: e.target.value })}
                min={bookingData.check_in_date || getTodayDate()}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Number of Rooms *</label>
            <input
              type="number"
              value={bookingData.num_rooms}
              onChange={(e) => setBookingData({ ...bookingData, num_rooms: parseInt(e.target.value) })}
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label>Room ID *</label>
            <input
              type="number"
              value={bookingData.room_id}
              onChange={(e) => setBookingData({ ...bookingData, room_id: e.target.value })}
              placeholder="Select a room from search results above"
              required
              disabled={!!selectedRoom}
              style={selectedRoom ? { backgroundColor: '#f0f0f0' } : {}}
            />
            {!selectedRoom && (
              <small style={{ color: '#999', display: 'block', marginTop: '0.5rem' }}>
                Click "Book Now" on a room from the search results above
              </small>
            )}
          </div>
          <button type="submit" className="btn-primary">Confirm Booking</button>
        </form>
      </div>
    </div>
  )
}

export default BookingForm

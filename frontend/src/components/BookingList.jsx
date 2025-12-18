import React, { useState, useEffect } from 'react'
import axios from 'axios'

function BookingList() {
  const [bookings, setBookings] = useState([])
  const [filterEmail, setFilterEmail] = useState('')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async (email = '') => {
    try {
      const url = email 
        ? `http://localhost:5000/api/bookings?email=${email}`
        : 'http://localhost:5000/api/bookings'
      const response = await axios.get(url)
      setBookings(response.data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
      alert('Failed to fetch bookings')
    }
  }

  const handleFilter = (e) => {
    e.preventDefault()
    fetchBookings(filterEmail)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="booking-list">
      <div className="section">
        <h2>Bookings</h2>
        <form onSubmit={handleFilter} className="filter-form">
          <div className="form-group">
            <label>Filter by Email</label>
            <input
              type="email"
              value={filterEmail}
              onChange={(e) => setFilterEmail(e.target.value)}
              placeholder="Enter email to filter"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">Filter</button>
            <button 
              type="button" 
              onClick={() => {
                setFilterEmail('')
                fetchBookings('')
              }} 
              className="btn-secondary"
            >
              Show All
            </button>
          </div>
        </form>
      </div>

      <div className="section">
        {bookings.length === 0 ? (
          <p className="empty-state">No bookings found. Make your first booking in the "Search Rooms" tab!</p>
        ) : (
          <div className="bookings-grid">
            {bookings.map(booking => (
              <div key={booking.id} className="booking-card">
                <h3>{booking.hotel_name}</h3>
                <div className="booking-details">
                  <p><strong>Guest:</strong> {booking.guest_name}</p>
                  <p><strong>Email:</strong> {booking.guest_email}</p>
                  <p><strong>Room Type:</strong> {booking.room_type}</p>
                  <p><strong>Check-in:</strong> {formatDate(booking.check_in_date)}</p>
                  <p><strong>Check-out:</strong> {formatDate(booking.check_out_date)}</p>
                  <p><strong>Number of Rooms:</strong> {booking.num_rooms}</p>
                  <p><strong>Price per Night:</strong> ${booking.price}</p>
                  <p className="total-price">
                    <strong>Total:</strong> ${(booking.price * booking.num_rooms * 
                      Math.ceil((new Date(booking.check_out_date) - new Date(booking.check_in_date)) / (1000 * 60 * 60 * 24))).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingList

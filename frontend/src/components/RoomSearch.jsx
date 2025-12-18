import React, { useState, useEffect } from 'react'
import axios from 'axios'

function RoomSearch({ onRoomSelect }) {
  const [searchParams, setSearchParams] = useState({
    check_in: '',
    check_out: '',
    hotel_id: ''
  })
  const [hotels, setHotels] = useState([])
  const [availableRooms, setAvailableRooms] = useState([])
  const [selectedRoomId, setSelectedRoomId] = useState(null)

  useEffect(() => {
    fetchHotels()
  }, [])

  const fetchHotels = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/hotels')
      setHotels(response.data)
    } catch (error) {
      console.error('Error fetching hotels:', error)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    try {
      const params = new URLSearchParams()
      if (searchParams.check_in) params.append('check_in', searchParams.check_in)
      if (searchParams.check_out) params.append('check_out', searchParams.check_out)
      if (searchParams.hotel_id) params.append('hotel_id', searchParams.hotel_id)

      const response = await axios.get(`http://localhost:5000/api/rooms/available?${params}`)
      setAvailableRooms(response.data)
      setSelectedRoomId(null)
      onRoomSelect(null)
    } catch (error) {
      console.error('Error searching rooms:', error)
      alert('Failed to search rooms')
    }
  }

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0]
  }

  return (
    <div className="room-search">
      <div className="section">
        <h2>Search Available Rooms</h2>
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-row">
            <div className="form-group">
              <label>Check-in Date</label>
              <input
                type="date"
                value={searchParams.check_in}
                onChange={(e) => setSearchParams({ ...searchParams, check_in: e.target.value })}
                min={getTodayDate()}
              />
            </div>
            <div className="form-group">
              <label>Check-out Date</label>
              <input
                type="date"
                value={searchParams.check_out}
                onChange={(e) => setSearchParams({ ...searchParams, check_out: e.target.value })}
                min={searchParams.check_in || getTodayDate()}
              />
            </div>
            <div className="form-group">
              <label>Hotel (Optional)</label>
              <select
                value={searchParams.hotel_id}
                onChange={(e) => setSearchParams({ ...searchParams, hotel_id: e.target.value })}
              >
                <option value="">All Hotels</option>
                {hotels.map(hotel => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name} - {hotel.location}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="btn-primary">Search Rooms</button>
        </form>
      </div>

      {availableRooms.length > 0 && (
        <div className="section">
          <h2>Available Rooms</h2>
          <div className="rooms-grid">
            {availableRooms.map(room => (
              <div 
                key={room.id} 
                className={`room-card ${selectedRoomId === room.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedRoomId(room.id)
                  onRoomSelect({ ...room, ...searchParams })
                }}
              >
                <h3>{room.hotel_name}</h3>
                <p className="location">📍 {room.hotel_location}</p>
                <div className="room-details">
                  <p><strong>Room Type:</strong> {room.room_type}</p>
                  <p><strong>Price:</strong> ${room.price}/night</p>
                  <p><strong>Available Rooms:</strong> {room.available_rooms}</p>
                </div>
                <button 
                  className="btn-primary"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedRoomId(room.id)
                    onRoomSelect({ ...room, ...searchParams })
                    document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {availableRooms.length === 0 && searchParams.check_in && (
        <div className="section">
          <p className="empty-state">No rooms available for the selected dates. Try different dates or hotels.</p>
        </div>
      )}
    </div>
  )
}

export default RoomSearch

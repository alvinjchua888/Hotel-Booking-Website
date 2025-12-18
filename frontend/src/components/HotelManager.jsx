import React, { useState, useEffect } from 'react'
import axios from 'axios'

function HotelManager() {
  const [hotels, setHotels] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    amenities: ''
  })
  const [editingId, setEditingId] = useState(null)
  const [roomForm, setRoomForm] = useState({
    hotel_id: '',
    room_type: '',
    price: '',
    total_rooms: ''
  })
  const [showRoomForm, setShowRoomForm] = useState(false)

  useEffect(() => {
    fetchHotels()
  }, [])

  const fetchHotels = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/hotels')
      setHotels(response.data)
    } catch (error) {
      console.error('Error fetching hotels:', error)
      alert('Failed to fetch hotels')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/hotels/${editingId}`, formData)
        alert('Hotel updated successfully!')
      } else {
        await axios.post('http://localhost:5000/api/hotels', formData)
        alert('Hotel created successfully!')
      }
      setFormData({ name: '', location: '', description: '', amenities: '' })
      setEditingId(null)
      fetchHotels()
    } catch (error) {
      console.error('Error saving hotel:', error)
      alert('Failed to save hotel')
    }
  }

  const handleEdit = (hotel) => {
    setFormData({
      name: hotel.name,
      location: hotel.location,
      description: hotel.description || '',
      amenities: hotel.amenities || ''
    })
    setEditingId(hotel.id)
  }

  const handleCancel = () => {
    setFormData({ name: '', location: '', description: '', amenities: '' })
    setEditingId(null)
  }

  const handleRoomSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:5000/api/rooms', {
        ...roomForm,
        price: parseFloat(roomForm.price),
        total_rooms: parseInt(roomForm.total_rooms)
      })
      alert('Room added successfully!')
      setRoomForm({ hotel_id: '', room_type: '', price: '', total_rooms: '' })
      setShowRoomForm(false)
    } catch (error) {
      console.error('Error adding room:', error)
      alert('Failed to add room')
    }
  }

  return (
    <div className="hotel-manager">
      <div className="section">
        <h2>{editingId ? 'Update Hotel' : 'Register New Hotel'}</h2>
        <form onSubmit={handleSubmit} className="hotel-form">
          <div className="form-group">
            <label>Hotel Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Amenities (comma-separated)</label>
            <input
              type="text"
              value={formData.amenities}
              onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
              placeholder="WiFi, Pool, Gym, Parking"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingId ? 'Update Hotel' : 'Create Hotel'}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancel} className="btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="section">
        <h2>Hotels List</h2>
        <button 
          onClick={() => setShowRoomForm(!showRoomForm)} 
          className="btn-secondary"
          style={{ marginBottom: '1rem' }}
        >
          {showRoomForm ? 'Hide' : 'Add Rooms to Hotel'}
        </button>

        {showRoomForm && (
          <form onSubmit={handleRoomSubmit} className="room-form">
            <h3>Add Room</h3>
            <div className="form-group">
              <label>Select Hotel *</label>
              <select
                value={roomForm.hotel_id}
                onChange={(e) => setRoomForm({ ...roomForm, hotel_id: e.target.value })}
                required
              >
                <option value="">Select a hotel</option>
                {hotels.map(hotel => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name} - {hotel.location}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Room Type *</label>
              <input
                type="text"
                value={roomForm.room_type}
                onChange={(e) => setRoomForm({ ...roomForm, room_type: e.target.value })}
                placeholder="e.g., Deluxe, Standard, Suite"
                required
              />
            </div>
            <div className="form-group">
              <label>Price per Night ($) *</label>
              <input
                type="number"
                value={roomForm.price}
                onChange={(e) => setRoomForm({ ...roomForm, price: e.target.value })}
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label>Total Rooms *</label>
              <input
                type="number"
                value={roomForm.total_rooms}
                onChange={(e) => setRoomForm({ ...roomForm, total_rooms: e.target.value })}
                min="1"
                required
              />
            </div>
            <button type="submit" className="btn-primary">Add Room</button>
          </form>
        )}

        <div className="hotels-list">
          {hotels.length === 0 ? (
            <p className="empty-state">No hotels registered yet. Create your first hotel above!</p>
          ) : (
            hotels.map(hotel => (
              <div key={hotel.id} className="hotel-card">
                <h3>{hotel.name}</h3>
                <p><strong>Location:</strong> {hotel.location}</p>
                {hotel.description && <p><strong>Description:</strong> {hotel.description}</p>}
                {hotel.amenities && <p><strong>Amenities:</strong> {hotel.amenities}</p>}
                <button onClick={() => handleEdit(hotel)} className="btn-secondary">
                  Edit
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default HotelManager

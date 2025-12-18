import React, { useState } from 'react'
import './App.css'
import HotelManager from './components/HotelManager'
import RoomSearch from './components/RoomSearch'
import BookingForm from './components/BookingForm'
import BookingList from './components/BookingList'

function App() {
  const [activeTab, setActiveTab] = useState('search')
  const [selectedRoom, setSelectedRoom] = useState(null)

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏨 Hotel Booking Website</h1>
        <p>Book your perfect stay with ease</p>
      </header>

      <nav className="navigation">
        <button 
          className={activeTab === 'search' ? 'active' : ''}
          onClick={() => setActiveTab('search')}
        >
          Search Rooms
        </button>
        <button 
          className={activeTab === 'manage' ? 'active' : ''}
          onClick={() => setActiveTab('manage')}
        >
          Manage Hotels
        </button>
        <button 
          className={activeTab === 'bookings' ? 'active' : ''}
          onClick={() => setActiveTab('bookings')}
        >
          My Bookings
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'search' && (
          <>
            <RoomSearch onRoomSelect={setSelectedRoom} />
            <BookingForm selectedRoom={selectedRoom} />
          </>
        )}
        {activeTab === 'manage' && <HotelManager />}
        {activeTab === 'bookings' && <BookingList />}
      </main>

      <footer className="App-footer">
        <p>© 2024 Hotel Booking Website. Built with React & Flask.</p>
      </footer>
    </div>
  )
}

export default App

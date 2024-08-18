import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './pages/AuthPage/AuthPage.js';  // Assuming HomePage is in a 'components' folder
import LoginPage from './pages/LoginPage/LoginPage.js';
import './assets/styles/global.css';
import OrdersPage from './pages/OrdersPage/OrdersPage.js';
import BookingPage from './pages/BookingPage/BookingPage.js';
import GoogleMap from './components/specific/GoogleMap/GoogleMap.js'
import Test from  './components/specific/GoogleMap/Test.js'
import Icon from  './components/specific/GoogleMap/Icon.js'
import RoadMapTest from  './components/specific/GoogleMap/RoadMaptest.js'
import AlphaTest from  './components/specific/BookingForm/InfoIcon.js'
import Cal from  './components/specific/GoogleMap/calculatortest.js'

function App() {

  
  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path="/cal" element={<Cal />} />
        <Route path="/hover2" element={<AlphaTest />} />
          <Route path="/roadtest" element={<RoadMapTest />} />
          <Route path="/hover" element={<Icon />} />
          <Route path="/testmap" element={<Test />} />
          <Route path="/googlemap" element={<GoogleMap />} />
          <Route path="/reservation" element={<BookingPage />} />
          <Route path="/reservation/hotel/:hotelSlug" element={<BookingPage />} />  {/* Dynamic route for hotel-specific booking */}
          <Route path="/" element={<AuthPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/login-page" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

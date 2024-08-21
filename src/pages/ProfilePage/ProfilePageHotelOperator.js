// src/pages/ProfilePage/ProfilePage.jsx

import React, { useEffect, useState } from 'react';
import ProfileDetails from '../../components/specific/ProfileDetails/ProfileDetails';
import profileService from '../../services/profileService';
import CircularProgress from '../../components/specific/ProfileDetails/CircularProgress';
import Referral from '../../components/specific/ProfileDetails/Referral';
import ProfitLogsTable from '../../components/specific/ProfileDetails/ProfitLogsTable';
import styles from './ProfilePage.module.css';


const ProfilePageHotelOperator = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    profileService.getProfile()
      .then(data => {
        setUser(data);
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
      });
  }, []);

  const handleSave = (formData) => {
    profileService.updateProfile(formData)
      .then(updatedData => {
        setUser(updatedData);
        alert('Profile updated successfully!');
      })
      .catch(error => {
        console.error('Error updating profile:', error);
        alert('Failed to update profile');
      });
  };

  if (!user) return <div>Loading...</div>;


  const companyName = "My Company Name"; // Your company name
  const commissionRate = parseFloat(user?.commission_rate?.rate) || 0;
  const commissionObligation = user?.commission_obligations?.[0] || {};
  const totalProfit = parseFloat(commissionObligation?.total_profit) || 0;
  const paidAmount = parseFloat(commissionObligation?.paid_amount) || 0;
  const remainingProfit = parseFloat(commissionObligation?.profit) || 0;

  const status = user.hotel.qr_codes[0]?.status ? 'Active' : 'Inactive'; // Add optional chaining to prevent errors if qr_codes or status is undefined

  const profitLogs = user.commission_obligations?.[0]?.profit_logs || []; // Assuming you take the first commission obligation for simplicity
  const bookingUrl = user?.hotel?.location?.qr_booking_url || user?.hotel?.qr_codes?.[0]?.booking_url || "/default-booking-url"; // Fallback to a default if not found

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.hotelName}>{user?.hotel?.location?.name || 'Hotel Name Not Available'}</h1>
      <div className={styles.userProfileContainer}>
        <div className={styles.profileAndReferralContainer}>
          <div className={styles.profileDetailsContainer}>
            <ProfileDetails
              username={user.username}
              firstName={user.first_name}
              lastName={user.last_name}
              email={user.email}
              telephone={user.profile.telephone}
              address={user.profile.address}
              accountType={user.is_admin ? 'Admin' : user.is_hotel_operator ? 'Hotel Operator' : user.is_client ? 'Client' : 'None'}
              onSave={handleSave}
            />
          </div>
          <div className={styles.referralContainer}>
          <Referral bookingUrl={bookingUrl}   status={status}/>
          </div>
        </div>
  
        <div className={styles.circularProgressOverlay}>
            <CircularProgress percentage={commissionRate} description="Commission Rate" />
            <CircularProgress total={totalProfit} value={paidAmount} description="Paid Amount" />
            <CircularProgress total={totalProfit} value={remainingProfit} description="Remaining Profit" />


        </div>
      </div>
      
      <div className={styles.profitLogsContainer}>
        <ProfitLogsTable profitLogs={profitLogs} />
      </div>
    </div>
  );
  
};

export default ProfilePageHotelOperator;

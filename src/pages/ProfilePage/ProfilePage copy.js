// src/pages/ProfilePage/ProfilePage.jsx

import React, { useEffect, useState } from 'react';
import ProfileDetails from '../../components/specific/ProfileDetails/ProfileDetails';
import profileService from '../../services/profileService';
import CircularProgress from '../../components/specific/ProfileDetails/CircularProgress';
import Referral from '../../components/specific/ProfileDetails/Referral';
import ProfitLogsTable from '../../components/specific/ProfileDetails/ProfitLogsTable';
import styles from './ProfilePage.module.css';


const ProfilePage = () => {
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


  const bookingUrl = "/reservation/hotel/regnum-bansko-ski-hotel-spa";
  const companyName = "My Company Name"; // Your company name



  const profitLogs = user.commission_obligations?.[0]?.profit_logs || []; // Assuming you take the first commission obligation for simplicity

  return (
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
          <Referral bookingUrl={bookingUrl} />
        </div>
      </div>

      <div className={styles.circularProgressOverlay}>
        <CircularProgress percentage={75} description="Commission Rate" />
        <CircularProgress total={180} value={80} description="Paid Amount" />
        <CircularProgress total={180} value={100} description="Remaining Profit" />
        
      </div>
      <div></div>
      <ProfitLogsTable profitLogs={profitLogs} />
    </div>
  );
};

export default ProfilePage;

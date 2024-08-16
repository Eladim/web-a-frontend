import React from 'react';
import Profile from '../src/components/Profile';

const ProfilePage = ({ user }) => {
  return (
    <div>
      <h1>Profile Page</h1>
      <Profile user={user} />
    </div>
  );
};

export default ProfilePage;

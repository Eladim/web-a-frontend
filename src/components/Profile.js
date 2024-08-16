import React from 'react';

const Profile = ({ user }) => {
  if (!user) {
    return <div>Please log in.</div>;
  }

  return (
    <div>
      <h2>Profile</h2>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Account Type: {user.is_admin ? 'Admin' : user.is_hotel_operator ? 'Hotel Operator' : 'Client'}</p>
    </div>
  );
};

export default Profile;

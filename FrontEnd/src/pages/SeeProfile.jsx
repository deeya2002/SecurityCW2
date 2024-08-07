
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfileApi } from '../apis/Api';

const SeeProfile = () => {
  const {userId} = useParams ();
     // State to manage user input
     const [firstName, setFirstName] = useState ('');
     const [lastName, setLastName] = useState ('');
     const [email, setEmail] = useState ('');

  // load user data
  useEffect(() => {
    getUserProfileApi(userId)
      .then(res => {
        console.log(res.data);
        setFirstName(res.data.user.firstname ?? '');
        setLastName(res.data.user.lastname ?? '');
        setEmail(res.data.user.email ?? '');
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        // Handle the error as needed
      });
  }, [userId]);

  return (
    <div>
        <div>
          <h2>User Details</h2>
          <p>First Name: {firstName}</p>
          <p>Last Name: {lastName}</p>
          <p>Email: {email}</p>
        </div>
    </div>
  );
};

export default SeeProfile;

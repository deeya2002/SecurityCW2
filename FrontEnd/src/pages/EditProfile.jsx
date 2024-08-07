import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardText,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBRow,
  MDBTypography,
} from 'mdb-react-ui-kit';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getUserProfileApi, updateUserProfileApi } from '../apis/Api';

const EditProfile = () => {
  const {userId} = useParams ();

  // load user data
  useEffect(() => {
    getUserProfileApi(userId)
      .then(res => {
        console.log(res.data);
        setFirstName(res.data.user.firstname ?? '');
        setLastName(res.data.user.lastname ?? '');
        setEmail(res.data.user.email ?? '');
        setNumber(res.data.user.number ?? '');
        setLocation(res.data.user.location ?? '');
        setBio(res.data.user.bio ?? '');
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, [userId]);

  // State to manage user input
  const [firstname, setFirstName] = useState ('');
  const [lastname, setLastName] = useState ('');
  const [email, setEmail] = useState ('');
  const [number, setNumber] = useState ('');
  const [location, setLocation] = useState ('');
  const [bio, setBio] = useState ('');

  // handle submit function
  const navigate = useNavigate ();
  const handleFormSubmit = e => {
    e.preventDefault ();
    const formData = new FormData ();
    formData.append ('firstname', firstname);
    formData.append ('lastname', lastname);
    formData.append ('email', email);
    formData.append ('number', number);
    formData.append ('location', location);

    // make a api call
    updateUserProfileApi (formData)
      .then (res => {
        if (res.data.success === false) {
          toast.error (res.data.message);
        } else {
          toast.success (res.data.message);
          navigate ('/profile');
        }
      })
      .catch (err => {
        console.log (err);
        toast.error ('Internal Server Error!' + err);
      });
  };

  return (
    <section className="vh-100" style={{backgroundColor: '#FF8C8C'}}>
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="6" className="mb-4 mb-lg-0">
            <MDBCard className="mb-3" style={{borderRadius: '.5rem'}}>
              <MDBRow className="g-0">
                <MDBCol
                  md="4"
                  className="gradient-custom text-center text-white"
                  style={{
                    borderTopLeftRadius: '.5rem',
                    borderBottomLeftRadius: '.5rem',
                  }}
                >
                   <MDBCardImage
        src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-2.webp'
        alt="Static Avatar"
        className="my-5"
        style={{ width: '80px' }}
        fluid
      />
                  <MDBTypography tag="h5">Marie Horwitz</MDBTypography>
                  <MDBCardText>User</MDBCardText>
                  <MDBIcon far icon="edit mb-5" />
                </MDBCol>
                <MDBCol md="8">
                  <MDBCardBody className="p-4">
                    <form>
                      <MDBTypography tag="h6">Edit Profile</MDBTypography>
                      <hr className="mt-0 mb-4" />

                      <MDBRow className="pt-1">
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography tag="h6">First Name</MDBTypography>
                          <MDBInput
                            type="text"
                            value={firstname}
                            onChange={e => setFirstName (e.target.value)}
                          />
                        </MDBCol>
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography tag="h6">Last Name</MDBTypography>
                          <MDBInput
                            value={lastname}
                            onChange={e => setLastName (e.target.value)}
                          />
                        </MDBCol>
                      </MDBRow>

                      <MDBRow className="pt-1">
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography tag="h6">Email</MDBTypography>
                          <MDBInput
                            type="email"
                            value={email}
                            onChange={e => setEmail (e.target.value)}
                          />
                        </MDBCol>
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography tag="h6">Contact</MDBTypography>
                          <MDBInput
                            value={number}
                            onChange={e => setNumber (e.target.value)}
                          />
                        </MDBCol>
                      </MDBRow>

                      <MDBRow className="pt-1">
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography tag="h6">Location</MDBTypography>
                          <MDBInput
                            type="text"
                            value={location}
                            onChange={e => setLocation (e.target.value)}
                          />
                        </MDBCol>
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography tag="h6">Bio</MDBTypography>
                          <MDBInput
                            type="text"
                            value={bio}
                            onChange={e => setBio (e.target.value)}
                          />
                        </MDBCol>
                      </MDBRow>
                      <MDBBtn onClick={handleFormSubmit} type="submit" color="primary" rounded>
                        Save Changes
                      </MDBBtn>
                    </form>
                  </MDBCardBody>
                </MDBCol>
              </MDBRow>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
};

export default EditProfile;

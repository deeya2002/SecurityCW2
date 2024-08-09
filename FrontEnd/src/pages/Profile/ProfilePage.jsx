import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCol, MDBContainer, MDBRow, MDBTypography } from 'mdb-react-ui-kit';
import React from 'react';
import { Link } from 'react-router-dom';

const Profile = () => {
  // Get user data from local storage
  const user = JSON.parse(localStorage?.getItem("user")) || null;

  return (
    <div className="vh-100" style={{ backgroundColor: '#eee' }}>
      <MDBContainer>
        <MDBRow className="justify-content-center">
          <MDBCol md="9" lg="7" xl="5" className="mt-5">
            <MDBCard style={{ borderRadius: '15px', backgroundColor: '#FF8C8C' }}>
              <MDBCardBody className="p-4 text-black">
                <div>
                  <MDBTypography tag='h6'>{user.firstName} {user.lastName}'s Profile</MDBTypography>
                </div>
                <div className="d-flex align-items-center mb-4">
                  <div className="flex-shrink-0">
                    <MDBCardImage
                      style={{ width: '70px' }}
                      className="img-fluid rounded-circle border border-dark border-3"
                      src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-2.webp'
                      alt='Generic placeholder image'
                      fluid />
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <div className="d-flex flex-row align-items-center mb-2">
                      <p className="mb-0 me-2">@{user.firstName}</p>
                    </div>
                    <div>
                      {/* Open the form with fetched data on "See profile" click */}
                      <Link to="/editprofile" className="text-decoration-none">
                        <MDBBtn outline color="dark" rounded size="sm" className="mx-1">Edit Profile</MDBBtn>
                      </Link>
                    </div>
                  </div>
                </div>
                <hr />
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default Profile;

import { TextField, FormControlLabel, Checkbox, Button, Box, Alert, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterUserMutation } from '../../services/userAuthApi';
import { storeToken } from '../../services/LocalStorageService';

const Registration = () => {
  const [serverError, setServerError] = useState({});
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    
    // Initialize actualData without location initially
    const actualData = {
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
      password2: data.get('password2'),
      tc: data.get('tc'),
    };
    
    // Get the user's location
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        
        // Add location data to the actualData object
        actualData.latitude = latitude;
        actualData.longitude = longitude;
        
        // Send the registration data with location to the API
        const res = await registerUser(actualData);
        console.log(res);

        if (res.error) {
          setServerError(res.error.data.errors);
          console.log(res.error.data.errors);
        }

        if (res.data) {
          console.log(res.data);
          storeToken(res.data.token);
          navigate('/dashboard');
        }
      },
      (error) => {
        console.error('Error retrieving location:', error);
        setServerError({ location: ['Unable to retrieve your location. Please try again.'] });
      }
    );
  };

  return (
    <main className="" style={{ marginBottom: 100, marginTop: 50 }}>
      <div className="container">
        <section className="">
          <div className="row d-flex justify-content-center">
            <div className="col-xl-5 col-md-8">
              <div className="card rounded-5">
                <div className="card-body p-4">
                  <h3 className="text-center">Register Account</h3>
                  <br />

                  <div className="tab-content">
                    <div className="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="tab-login">
                      <form onSubmit={handleSubmit}>
                        {/* Full Name */}
                        <div className="form-outline mb-4">
                          <label className="form-label" htmlFor="name">Full Name</label>
                          <TextField
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Full Name"
                            required
                            className="form-control"
                            error={!!serverError.name}
                            helperText={serverError.name ? serverError.name[0] : ""}
                          />
                        </div>

                        {/* Email */}
                        <div className="form-outline mb-4">
                          <label className="form-label" htmlFor="email">Email</label>
                          <TextField
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email Address"
                            required
                            className="form-control"
                            error={!!serverError.email}
                            helperText={serverError.email ? serverError.email[0] : ""}
                          />
                        </div>

                        {/* Password */}
                        <div className="form-outline mb-4">
                          <label className="form-label" htmlFor="password">Password</label>
                          <TextField
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            required
                            className="form-control"
                            error={!!serverError.password}
                            helperText={serverError.password ? serverError.password[0] : ""}
                          />
                        </div>

                        {/* Confirm Password */}
                        <div className="form-outline mb-4">
                          <label className="form-label" htmlFor="password2">Confirm Password</label>
                          <TextField
                            type="password"
                            id="password2"
                            name="password2"
                            placeholder="Confirm Password"
                            required
                            className="form-control"
                            error={!!serverError.password2}
                            helperText={serverError.password2 ? serverError.password2[0] : ""}
                          />
                        </div>

                        {/* Terms and Conditions */}
                        <div className="form-outline mb-4">
                          <FormControlLabel
                            control={<Checkbox value={true} color="primary" name="tc" id="tc" />}
                            label="I agree to terms and conditions."
                          />
                          {serverError.tc ? <Typography style={{ color: 'red', fontSize: '12px', paddingLeft: 10 }}>{serverError.tc[0]}</Typography> : "" }
                        </div>

                        {/* Submit Button */}
                        {isLoading === true
                          ? <button disabled className='btn btn-primary w-100' type="submit">
                              <span className="mr-2">Processing</span>
                              <i className="fas fa-spinner fa-spin" />
                            </button>
                          : <button className='btn btn-primary w-100' type="submit">
                              <span className="mr-2">Sign Up</span>
                              <i className="fas fa-user-plus" />
                            </button>
                        }

                        {/* Existing Account Link */}
                        <div className="text-center">
                          <p className='mt-4'>
                            Already have an account? <Link to="/login">Login</Link>
                          </p>
                        </div>

                        {/* Error Alerts */}
                        {serverError.non_field_errors ? <Alert severity="error">{serverError.non_field_errors[0]}</Alert> : "" }
                        {serverError.location ? <Alert severity="error">{serverError.location[0]}</Alert> : "" }
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Registration;




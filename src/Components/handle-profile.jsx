import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import localhost from './env';


function CompleteProfile() {
const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

//   const history = useHistory();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${localhost.url}/complete-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (result.success) {
        // Redirect to home after successful profile completion
        navigate('/profile');
      } else {
        console.error('Error completing profile:', result.message);
      }
    } catch (error) {
      console.error('Error completing profile:', error);
    }
  };

  return (
    <div>
      <h2>Complete Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </div>
        <button type="submit">Submit</button>
      </form>
      <p>Debug: Complete Profile Component Loaded</p> {/* Debug text */}
    </div>
  );
}

export default CompleteProfile;

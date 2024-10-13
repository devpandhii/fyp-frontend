import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import {validateEmail,validateAge,validateCity,validateMobile,validatePassword } from './regex';

function Crud() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    age: '',
    mobile: '',
    city: ''
  });
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios.get(`${window.env.url}/getUsers`)
      .then((result) => {
        console.log(result);
        setUsers(result.data);
      })
      .catch(error => console.log(error));
  }, []);

  const deleteUser = (userId) => {
    axios.delete(`${window.env.url}/deleteUser/${userId}`)
      .then((response) => {
        console.log(response);
        setUsers(users.filter(user => user._id !== userId));
      })
      .catch(error => console.log(error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      axios.put(`${window.env.url}/updateUser/${editingUser._id}`, formData)
        .then((response) => {
          console.log(response);
          setUsers(users.map(user => user._id === editingUser._id ? response.data : user));
          setEditingUser(null);
          setFormData({
            username: '',
            email: '',
            password: '',
            age: '',
            mobile: '',
            city: ''
          });
          setShowModal(false);
        })
        .catch(error => console.log(error));
    } else {
      axios.post(`${window.env.url}/newUser`, formData)
        .then((response) => {
          console.log(response);
          setUsers([...users, response.data]);
          setFormData({
            username: '',
            email: '',
            password: '',
            age: '',
            mobile: '',
            city: ''
          });
          setShowModal(false);
        })
        .catch(error => console.log(error));
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: user.password,
      age: user.age,
      mobile: user.mobile,
      city: user.city
    });
    setShowModal(true);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      age: '',
      mobile: '',
      city: ''
    });
    setShowModal(true);
  };

  return (
    <>
      <Navbar/>
      <div className="d-flex vh-90  justify-content-center align-items-center">
        <div className="flex bg-white rounded p-3">
          <h1>Crud Operations</h1>
          <table className='table'>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Password</th>
                <th>Age</th>
                <th>Mobile</th>
                <th>City</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.password}</td>
                  <td>{user.age}</td>
                  <td>{user.mobile}</td>
                  <td>{user.city}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => handleEdit(user)}>Update</button>
                    <button className="btn btn-danger" onClick={() => deleteUser(user._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-success mb-3" onClick={handleAddUser}>Add User</button>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingUser ? 'Update User' : 'Add User'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Mobile</label>
                    <input
                      type="text"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary mt-3">
                    {editingUser ? 'Update User' : 'Add User'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Crud;

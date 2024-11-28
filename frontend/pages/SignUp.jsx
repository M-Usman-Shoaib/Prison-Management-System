import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Alert from '../src/Components/Alert';

const SignUp = () => {
  const navigate = useNavigate();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      gender: '',
      password: '',
      role: '',  // Added role field
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string()
        .required('Email is required')
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          'Invalid email format. Example: example@domain.com'
        ),   
      gender: Yup.string().required('Gender is required'),
      password: Yup.string().required('Password is required'),
      role: Yup.string().oneOf(['Admin', 'Wardon'], 'Role must be either Admin or Wardon').required('Role is required'), // Validation for role
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch('http://localhost:3000/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          // Handle error response
          const errorData = await response.json();
          console.error('Error:', errorData.err);
          if (response.status === 402) {
            // User with this email already exists
            setAlertMessage('SignUp Failed! A user with this email already exists.');
            setShowErrorAlert(true);
          }
        } else {
          // Registration successful
          const userData = await response.json();
          console.log('SignUp successful:', userData);
          setAlertMessage('SignUp Successful.');
          setShowSuccessAlert(true);
          navigate('/login');
        }
      } catch (error) {
        console.error('Error:', error.message);
        setAlertMessage('SignUp Failed! An error occurred. Please try again.');
        setShowErrorAlert(true);
      }
    },
  });

  return (
    <div>
      {/* Show success alert */}
      {showSuccessAlert && (
        <Alert type="success" message={alertMessage} onClose={() => setShowSuccessAlert(false)} />
      )}

      {/* Show error alert */}
      {showErrorAlert && (
        <Alert type="danger" message={alertMessage} onClose={() => setShowErrorAlert(false)} />
      )}

      <div className="sign-up-container text-center mt-5 pt-5">
        <form className="sign-up-form" onSubmit={formik.handleSubmit}>
          <h4 className="pb-3 brownColor">SignUp</h4>

          <input
            placeholder="Name"
            className={`pt-2 ${formik.touched.name && formik.errors.name ? 'error-input' : ''}`}
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="error mt-1">{formik.errors.name}</div>
          )}

          <input
            placeholder="Email"
            type="email"
            name="email"
            className={`pt-2 mt-2 ${formik.touched.email && formik.errors.email ? 'error-input' : ''}`}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="error mt-1">{formik.errors.email}</div>
          )}

          <select
            name="gender"
            className={`pt-2 mt-2 ${formik.touched.gender && formik.errors.gender ? 'error-input' : ''}`}
            value={formik.values.gender}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="" disabled hidden>
              Gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {formik.touched.gender && formik.errors.gender && (
            <div className="error mt-1">{formik.errors.gender}</div>
          )}

          <input
            placeholder="Password"
            type="password"
            name="password"
            className={`pt-2 mt-2 ${formik.touched.password && formik.errors.password ? 'error-input' : ''}`}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="error mt-1">{formik.errors.password}</div>
          )}

          {/* Role dropdown */}
          <select
            name="role"
            className={`pt-2 mt-2 ${formik.touched.role && formik.errors.role ? 'error-input' : ''}`}
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="" disabled hidden>
              Role
            </option>
            <option value="Admin">Admin</option>
            <option value="Wardon">Wardon</option>
          </select>
          {formik.touched.role && formik.errors.role && (
            <div className="error mt-1">{formik.errors.role}</div>
          )}

          <button className="brownButton mt-2 mb-2" type="submit">
            SignUp
          </button>

          <h6 className="pt-3">Already signed up?
            <NavLink className='ms-1 customLink' to='/login'>
              LogIn here
            </NavLink>
          </h6>
        </form>
      </div>
    </div>
  );
};

export default SignUp;

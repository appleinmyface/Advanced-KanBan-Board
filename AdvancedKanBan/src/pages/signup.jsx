import React, { useState } from 'react';
import { auth } from '../firebase/firebase'; // Adjusted path
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Signup = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user); // Set the user in your app's state
      
      // Success confirmation
      Swal.fire({
        icon: 'success',
        title: 'Account Created!',
        text: `Welcome, ${userCredential.user.email}!`,
      }).then(() => {
        // Redirect to the dashboard after closing the alert
        navigate('/dashboard');
      });

    } catch (err) {
      setError(err.message); // Set error message to display
      console.error("Signup Error:", err);
      // Error alert
      Swal.fire({
        icon: 'error',
        title: 'Sign Up Failed!',
        text: err.message,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form
        onSubmit={handleSignup}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border rounded w-full p-2 mb-4"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border rounded w-full p-2 mb-4"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded w-full p-2 hover:bg-blue-600 transition duration-200"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-4">
        Already have an account? <a href="/login" className="text-blue-500">Log in</a>
      </p>
    </div>
  );
};

export default Signup;

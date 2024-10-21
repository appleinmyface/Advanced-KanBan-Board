import React, { useState } from 'react';
import { auth } from '../firebase/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import Swal from 'sweetalert2';

const Auth = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setUser(userCredential.user);
        // Success Alert
        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: `Welcome back, ${userCredential.user.email}!`
        });
      } catch (error) {
        console.error("Login Error: ", error);
        // Error Alert
        Swal.fire({
          icon: 'error',
          title: 'Login Failed!',
          text: error.message
        });
      }
    } else {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        setUser(userCredential.user);
        // Success Alert
        Swal.fire({
          icon: 'success',
          title: 'Account Created!',
          text: `Welcome, ${userCredential.user.email}!`
        });
      } catch (error) {
        console.error("Signup Error: ", error);
        // Error Alert
        Swal.fire({
          icon: 'error',
          title: 'Sign Up Failed!',
          text: error.message
        });
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    // Logout success alert
    Swal.fire({
      icon: 'success',
      title: 'Logged Out!',
      text: 'You have successfully logged out.'
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out duration-150"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)} // Toggle login/signup
            className="mt-4 text-indigo-600 hover:text-indigo-500"
          >
            {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;

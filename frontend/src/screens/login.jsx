import React,{useState,useContext} from 'react';
import { Link , useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axios';
import { UserContext } from '../context/user.context';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const {setUser} = useContext(UserContext); 

    const navigate = useNavigate();
     
    function submitHandler(e) {
        e.preventDefault();
        axiosInstance.post('/users/login',{
            email,
            password
        }).then((res) => {
            console.log(res.data);

            localStorage.setItem('token',res.data.token);
            setUser(res.data.user);
            navigate('/');
        }).catch((err) => {
            console.log(err);
        });
    }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black px-4">
      <div className="bg-gray-800 p-10 rounded-xl shadow-xl w-full max-w-lg border border-gray-700">
        <h2 className="text-3xl font-extrabold text-white mb-6 text-center">Login</h2>
        <form
        onSubmit={submitHandler}
        >
          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="email">
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-400 mb-2" htmlFor="password">
              Password
            </label>
            <input
                onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        <p className="text-gray-400 mt-6 text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 hover:text-blue-300 hover:underline transition-all">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

import { useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {jwtDecode} from 'jwt-decode';
import { useEffect } from "react";


function AuthorizeUser() {
  const { currentUser } = useSelector((state) => state.subSubUser);
  const user = currentUser?.data;
  const token = localStorage.getItem('subsumtoken');
  const tokenExist = !!token;
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if no token and no user
    if (!tokenExist && !user) {
      toast.error('PLEASE LOGIN');
      navigate('/login');
      return;
    }

    // If token is missing or undefined
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decodedToken = jwtDecode(token);

      // Check if the token is expired
      if (decodedToken.exp * 1000 < Date.now()) {
        toast.error('Session expired, Please login');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      toast.error('Invalid token, Please login');
      navigate('/login');
    }
  }, [currentUser, tokenExist]);

  return tokenExist && user ? <Outlet /> : <Navigate to={'/'} />;
}

/**
 * 
 * @returns 
function AuthorizeAdmin() {
  const { currentUser } = useSelector((state) => state.subSubAdmin);
  const admin = currentUser?.data;

  const token = localStorage.getItem('subsumauthtoken');
  const tokenExist = !!token;
  const navigate = useNavigate()
  
  useEffect(() => {
    if (!tokenExist && !admin) {
      console.log('NO USER');
      toast.error('PLEASE LOGIN');
    } else {
      if(!token){
        navigate('/admin-login')
        return
      }
      const decodedToken = jwtDecode(token);
      
      // Check if the token is expired
      if (decodedToken.exp * 1000 < Date.now()) {
        toast.error('Session expiried, Please login');
        navigate('/admin-login')
      }
    }
  }, [currentUser, tokenExist]); 

  return tokenExist && admin ? <Outlet /> : <Navigate to={'/'} />;
}
 */


function AuthorizeAdmin() {
  const { currentUser } = useSelector((state) => state.subSubAdmin);
  const admin = currentUser?.data;
  const token = localStorage.getItem('subsumauthtoken');
  const tokenExist = !!token;
  const navigate = useNavigate();

  useEffect(() => {
    if (!tokenExist && !admin) {
      toast.error('PLEASE LOGIN');
      navigate('/admin-login');
      return;
    }

    // If token is missing or undefined
    if (!token) {
      navigate('/admin-login');
      return;
    }

    try {
      const decodedToken = jwtDecode(token);

      // Check if the token is expired
      if (decodedToken.exp * 1000 < Date.now()) {
        toast.error('Session expired, Please login');
        navigate('/admin-login');
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      toast.error('Invalid token, Please login');
      navigate('/admin-login');
    }
  }, [currentUser, tokenExist]);

  return tokenExist && admin ? <Outlet /> : <Navigate to={'/'} />;
}


  export {AuthorizeUser, AuthorizeAdmin}
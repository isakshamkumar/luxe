import './App.css';
import React, { useState } from 'react';
import validator from 'validator';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";

function App() {


  const [submitted, setSubmitted] = useState(false);
  const [email, setemail] = useState('')
  const [emailisValid, setemailisValid] = useState(false)
  const [fullName, setfullName] = useState('')
  const[googleSignIn,setgoogleSignIn]=useState(true)
  const nameChangeHandler = (e) => {
    setfullName(e.target.value)
  }
  const emailChangeHandler = (e) => {
    setemail(e.target.value)
    let isValidFormat = validator.isEmail(e.target.value)

    const isValidDomain = isValidFormat && validator.isFQDN(e.target.value.split('@')[1], { require_tld: true });
    setemailisValid(isValidFormat && isValidDomain);
  }
  const postDetailsHandler = async () => {
    let response = await fetch('https://luxe-server.onrender.com/signup', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fullName, email })
    })
    if (!response.ok) {
      toast.error('Email Already Exists!', {
        position: 'top-center',
        autoClose: 3000, // Toast will close after 3 seconds
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      });
    } else {
      setSubmitted(true);
      let data = await response.json();
      console.log(data);
      setgoogleSignIn(false)
    }

  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (emailisValid) {

      postDetailsHandler()


    } else {
      toast.error('Invalid email address', {
        position: 'top-center',
        autoClose: 3000, // Toast will close after 3 seconds
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }

  };
  const googleProviderHandler = (credentialResponse) => {
    const tokenId = credentialResponse;
  
    if (tokenId) {
      try {
        const decoded = jwt_decode(tokenId);
        console.log(decoded.email);
        // console.log(decoded);
        console.log(decoded.given_name);
        setfullName(decoded.given_name)
        setemail(decoded.email)
        setemailisValid(true)
        setTimeout(() => {
          postDetailsHandler()
        }, 2000);
      } catch (error) {
        console.error("Error decoding the token:", error);
      }
    } else {
      console.error("No tokenId found in the credentialResponse");
    }
  };

  return (
    <div className='body'>
      <div className='form'>
        <h2 className='heading'>Join Waitlist !!</h2>
        {submitted ? (
          <>
            <h2 className='sub-heading'>Thanks for joining <span>LUXE</span></h2>
            <h2 className='heading'>You became more fashionable!</h2>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className='Inputcontainer'>
              <input className='input' value={fullName} onChange={nameChangeHandler} type="text" placeholder="Full Name" />
              <input className='input' value={email} onChange={emailChangeHandler} type="text" placeholder="Email" />
            </div>
            <div className='button-contain'>
              <button className='button' type='submit'>JOIN</button>
            </div>
          </form>

        )}
        {googleSignIn &&  <GoogleOAuthProvider clientId="716300864255-p7fh4fk8oh3s6b2smbavd3nai857e1n0.apps.googleusercontent.com"><GoogleLogin
          onSuccess={credentialResponse => {
            googleProviderHandler(credentialResponse.credential)
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        /></GoogleOAuthProvider> }
      
      </div>
    </div>
  );
}

export default App;
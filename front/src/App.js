import './App.css';
import React, {useState} from 'react';
import validator from 'validator';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {

  
  const [submitted, setSubmitted] = useState(false);
  const[email,setemail]=useState('')
  const[emailisValid,setemailisValid]=useState(false)
  const[fullName,setfullName]=useState('')
  const nameChangeHandler=(e)=>{
    setfullName(e.target.value)
  }
  const emailChangeHandler=(e)=>{
    setemail(e.target.value)
    let isValidFormat=validator.isEmail(e.target.value)

    const isValidDomain = isValidFormat && validator.isFQDN(e.target.value.split('@')[1], { require_tld: true });
    setemailisValid(isValidFormat && isValidDomain);
  }
  const postDetailsHandler=async()=>{
    let response=await fetch('http://localhost:3005/signup',{
      method:'POST',
      headers:{
        "Content-Type":"application/json",
        },
        body :JSON.stringify({fullName,email})
    })
    let data=await response.json();
    console.log(data);

  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if(emailisValid){

      postDetailsHandler()
      setSubmitted(true); 

    }else{
      toast.error('Invalid email address', {
        position: 'top-center',
        autoClose: 3000, // Toast will close after 3 seconds
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      });
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
      </div>
    </div>
  );
}

export default App;
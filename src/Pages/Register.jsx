import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {  createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from "../Firebase"
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
    auth.onAuthStateChanged((user)=>{
      if(user){
        navigate('/')
      }
    })
  })


  const registerHendler = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth , email, password)
    .then(() => {
      toast.success(`User registered successfully `) 
      navigate("/")
    })
    .catch((err) => toast.error("Something Went Wrong"));

  }
  return (
    <div className='form'>
      <h1>Register Here</h1>
      <form>
        <div>
          <input type="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)} value={email} />
        </div>
        <div>
          <input type="password" id='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} value={password} />
        </div>

        <div>
          <button type="submit" onClick={registerHendler}>Register Now</button>
        </div>
      </form>
      <p>Already an account <Link to={"/login"}>Login Now</Link></p>

    </div>
  )
}

export default Login
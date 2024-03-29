import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { signInWithEmailAndPassword} from "firebase/auth"
import { auth } from '../Firebase'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        navigate('/')
      }
    })
  })

  const handleSignIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        toast.success("Login Successfully")
        navigate("/")
      })
      .catch(err => toast.error("Wrong Email Or Password"));
  }
  return (
    <div className='form'>
      <h1>Login Here</h1>
      <form>
        <div>
          <label htmlFor='email'>Email</label>
          <input type="email" id='email' onChange={(e) => setEmail(e.target.value)} value={email} />
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input type="password" id='password' onChange={(e) => setPassword(e.target.value)} value={password} />
        </div>
        <div>
          <button type="submit" onClick={handleSignIn}>Login</button>
        </div>
      </form>
      <p>Don't have an account? <Link to={"/register"}>Sign Up</Link></p>

    </div>
  )
}

export default Login
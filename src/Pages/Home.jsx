import React, { useEffect, useState } from 'react'
import List from '../Components/List'
import { signOut } from 'firebase/auth'
import { auth, db } from '../Firebase'
import { useNavigate } from 'react-router-dom'
import { uid } from 'uid'
import toast from 'react-hot-toast'
import { set, ref, onValue } from "firebase/database"
function Home() {
  const [title, setTitle] = useState("")
  const [discription, setDiscription] = useState("")
  const [option, setOption] = useState("none")
  const [Date, setDate] = useState("")
  const navigate = useNavigate()
  const [todos , setTodos] = useState([]);

  

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        toast.success("Signout Successfull")
        navigate('/login')
      })
      .catch(err => console.log(err));
  }
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if(user){
       onValue(ref(db, `${auth.currentUser.uid}`),snapshot =>{
        setTodos([])
        const data = snapshot.val()
        if(data !== null){
          Object.values(data).map(todo => {
            setTodos(todos => [...todos, todo])
          });
        }
       })
      }
      if (!user) {
        navigate('/login')
      }
    })
  },[])

  const handleSubmit = (e) => {
    e.preventDefault()
  const id = uid();
    set(ref(db, `${auth.currentUser.uid}/${id}`),{
      title: title,
      discription: discription,
      option: option,
      date: Date,
      uid : id,
      status : "todo",
    })
    setDate("");
    setTitle("");
    setDiscription("");
    setOption("none");
    toast.success("Todo Added Successfully")

  }
  let value ={todos ,setTitle , setDiscription , setOption , setDate , title, discription , option , Date}

  return (
    <>
    <div className='todo'>
      <div className="input">
        <div className="inputs">
          <input type="text" placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea type="text" placeholder='Discription' value={discription} onChange={(e) => setDiscription(e.target.value)} />
          <div className='section'>
            <input type="date" id='inputDate' value={Date} onChange={(e) => setDate(e.target.value)} />
            <select id='select' onChange={(e) => setOption(e.target.value)} value={option} >
              <option value="none">None</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        <button onClick={handleSubmit}> Add</button>
      </div>


      <div className="signOut">
        <button onClick={handleSignOut}>SignOut</button>
      </div>
    </div>
      <List {...value} />
    </>
  )
}

export default Home
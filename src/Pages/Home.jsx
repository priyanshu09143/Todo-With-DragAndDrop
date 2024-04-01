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
  const [todos, setTodos] = useState([]);
  const [shows, setShows] = useState(false)
  const [listName, setListName] = useState("")
  const [message, setMessage] = useState(false)

  setTimeout(() => {
    setMessage(true)
  }, 2000)

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
      if (user) {
        onValue(ref(db, `${auth.currentUser.uid}`), snapshot => {
          const todosData = [];
          snapshot.forEach((childSnapshot) => {
            const todo = childSnapshot.val();
            todosData.push(todo);
          });
  
          // Order todos by the 'order' field
          const orderedTodos = todosData.sort((a, b) => a.order - b.order);
          setTodos(orderedTodos);
        });
      } else {
        navigate('/login');
      }
    });
  }, []);
  

  const handleSubmit = (e) => {
    e.preventDefault()
    if(title === "" || discription === "" || Date === "" ){
      toast.error("Please fill all fields")
      return
    }
    const id = uid();
    set(ref(db, `${auth.currentUser.uid}/${id}`), {
      title: title,
      discription: discription,
      option: option,
      date: Date,
      uid: id,
      status: "todo",
      listName: listName,
    })
    setDate("");
    setTitle("");
    setDiscription("");
    setOption("none");
    toast.success("Todo Added Successfully")

  }

  let value = { todos , setTodos, setTitle, setDiscription, setOption, setDate, title, discription, option, Date, listName }

  useEffect(() => {
    if (todos.length || listName !=="") setShows(true)
    else setShows(false)
  }, [todos])
  return (
    <>
      {shows ? <>
        <div className='todo'>
          <div className="input">
            <div className="inputs">
              <input type="text" placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} required/>
              <textarea type="text" placeholder='Discription' value={discription} onChange={(e) => setDiscription(e.target.value)}  required/>
              <div className='section'>
                <input type="date" id='inputDate' value={Date} onChange={(e) => setDate(e.target.value)} required />
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
        </div>
        <List {...value} /> </>
        :
        <div className='form createList'>
          {
            message ? <>
              <input type="text" placeholder='Name Of List' value={listName} onChange={(e) => setListName(e.target.value)} />
              <button onClick={() => setShows(true)}>Add List</button></>
              : <p className='big'>Please Wait..!</p>
          }
        </div>
      }
      <div className="signOut">
        <button onClick={handleSignOut}>SignOut</button>
      </div>
    </>
  )
}

export default Home
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
  const [status, setStatus] = useState("")
  const [Updated, setUpdated] = useState(false)
  const [listSelect, setlistSelect] = useState("none")
  const [todoList, settodoList] = useState([])


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
          const orderedTodos = todosData.sort((a, b) => a.order - b.order);
          setTodos(orderedTodos);
        });
      } else {
        navigate('/login');
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault()
   
    if (title === "" || discription === "" || Date === "") {
      toast.error("Please fill all fields")
      return
    }
    if(listSelect === "none"){
      if(todos.length > 0)toast.error("Please select a list")
      else toast.error("Please select a list or Create a new list")
      return
    }
    const id = uid();
    set(ref(db, `${auth.currentUser.uid}/${id}`), {
      title: title,
      discription: discription,
      option: option,
      date: Date,
      uid: id,
      status: listSelect || status,
    })
    setDate("");
    setTitle("");
    setDiscription("");
    setOption("none");
    toast.success("Todo Added Successfully")

  }
  let value = { todos, setTodos, setTitle, setDiscription, setOption, setDate, title, discription, option, Date, setStatus, setUpdated, setlistSelect , settodoList }
  return (
    <>
      {<>
        <div className='todo'>
          <div className="input">
            <div className="inputs">
              <input type="text" placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} required />
              <textarea type="text" placeholder='Discription' value={discription} onChange={(e) => setDiscription(e.target.value)} required />
              <div className='section'>
                <input type="date" id='inputDate' value={Date} onChange={(e) => setDate(e.target.value)} required />
                <select id='select' onChange={(e) => setOption(e.target.value)} value={option} >
                  <option value="none">None</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <select name="" id='select' onChange={(e)=> setlistSelect(e.target.value)}>
                  <option value="none" disabled selected>Select List</option>
                  {
                    todoList !== undefined && todoList.map((list, index) => {
                      return (
                        <option key={index} value={list}>{list.toUpperCase()}</option>
                      )
                    })
                  }
                </select>
              </div>
            </div>
            <button onClick={handleSubmit} disabled={Updated} id='addbtn'>Add</button>
          </div>
        </div>
        <List {...value} />
      </>
      }
      <div className="signOut">
        <button onClick={handleSignOut}>SignOut</button>
      </div>
    </>
  )
}

export default Home
import React, { useEffect, useRef, useState } from 'react'
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { ref, remove, update } from "firebase/database"
import { db, auth } from "../Firebase"
import { MdOutlineDone } from "react-icons/md";
import toast from 'react-hot-toast';
function List({ todos, setTitle, setDiscription, setOption, setDate, title, discription, option, Date, setStatus, setUpdated, setlistSelect }) {
  let value = todos
  const [isEdit, setIsEdit] = useState(false)
  const [tempId, setTempId] = useState("")
  const [newList, setNewList] = useState("")
  const [numberList, setNumberList] = useState([])
  const [totelLists, setTotelLists] = useState([])
  const [updateTrue, setUpdateTrue] = useState(false)
  const [currentSelected, setCurrentSelected] = useState("")
  const [selected, setSelected] = useState(null)
  const [state, setState] = useState("")
  setUpdated(updateTrue)
  setlistSelect(currentSelected)

  value.forEach((val) => {
    if (!totelLists.includes(val.status)) {
      setTotelLists([...totelLists, val.status])
    }
  })

  let data = {};
  value.forEach((todo) => {
    if (!data.hasOwnProperty(todo.status)) data[todo.status] = []
    data[todo.status].push(todo)
  })
  const handleUpdate = (todo) => {
    setUpdateTrue(true)
    setIsEdit(true)
    setTitle(todo.title)
    setDiscription(todo.discription)
    setOption(todo.option)
    setDate(todo.date)
    setTempId(todo.uid)
    setStatus(todo.status)
  }

  const handleUpdateConfirm = () => {
    setUpdateTrue(false)
    update(ref(db, `${auth.currentUser.uid}/${tempId}`), {
      title: title,
      discription: discription,
      option: option,
      date: Date,
      uid: tempId

    })
    setIsEdit(false)
    setTitle("")
    setDiscription("")
    setOption("none")
    setDate("")
    setTempId("")
    toast.success("Updated Successfully")
  }

  const handleDelete = (uid) => {
    remove(ref(db, `${auth.currentUser.uid}/${uid}`))
    toast.success("Deleted Successfully")
  }
  const dragItem = useRef(null)
  const handlePriority =async (state)=>{
    selected.option = state
    await update(ref(db, `${auth.currentUser.uid}/${selected.uid}`), selected);
  }


useEffect(()=>{
  console.log(value.filter((todo)=> todo.status === state))
  value.filter((todo)=> todo.status === state)
  .map((todo , index)=> {
    if(index === 0) todo.order = 0
    else if(index <= 1) todo.order = index

    if(todo.order === 0){
      todo.option = "high"
    }
    else if(todo.order <= 1){
      todo.option = "medium"
    }
    else if(value.length -1){
      todo.option = "low"
    }
    return todo
  })
  setState("")
},[value , state])


  

  const renderData = (state) => {
    if (data[state] === undefined || data[state] === "" || data[state] === null) return
    return data[state].sort((a, b) => a.order - b.order)
      .map((todo, index) => {
        return (
          <li key={index}
          id={todo.option === "high" ? "drak" : todo.option === "medium" ? "normal" : todo.option === "low" ? "lite" : ""}
            draggable
            onDragStart={(e) => handleDragStart(e, todo, index)}
            // onDragEnd={(e) => handleSort(todo, state)}
          >
            <div className='shows'>
              <p className='title'>Title : {todo.title}</p>
              <p className='discription'>Discription : {todo.discription}</p>
              <span id='date'>Date : {todo.date}</span>
              <span>Priority: {todo.option}</span></div>
            <span className='icons'>
              <MdDelete onClick={() => handleDelete(todo.uid)} />
              {
                isEdit ? < MdOutlineDone onClick={() => handleUpdateConfirm()} /> : <MdEdit onClick={() => handleUpdate(todo)} />
              }
            </span>
          </li>
        )
      })

  }

  const handleDragStart = (e, taskId, index) => {
    setSelected(taskId)
    dragItem.current = index;
    setTempId(taskId.uid)
    e.dataTransfer.setData('taskId', taskId.uid);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    update(ref(db, `${auth.currentUser.uid}/${tempId}`), {
      status: status,
    })
  };


  function createList() {
    setNumberList([...numberList, newList])
    toast.success(`List created`);
    setNewList("")
  }
  if (totelLists.includes(numberList[0])) setNumberList([])
  return (
    <div className='allLists'>
      {totelLists.length !== 0 &&
        <div className='form createList position'>
          <>
            <input type="text" placeholder='Name Of List' value={newList} onChange={(e) => setNewList(e.target.value)} />
            <button onClick={() => createList(newList)} disabled={updateTrue} >Add List</button></>
        </div>
      }

      {
        totelLists
          .map((state, index) => {
            return <div className='todoList' key={index}>
              <div className="list"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, state)}
              >
                <div className='heading'>
                  <p className=''>{state}</p>
                  <span>
                    <label htmlFor="" >Select List</label>
                    <input type="radio" name='selList' onChange={(e) => setCurrentSelected(state)} />
                  </span>
                </div>
                <ul>
                  {renderData(state)}
                </ul>
              </div>
            </div>

          })
      }

      {
        numberList.map((item) => (
          <div className='todoList'>
            <div className="list"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, item)}
            >
              <div className='heading'>
                <p className=''>{item}</p>
                <span>
                  <label htmlFor="" >Select List</label>
                  <input type="radio" name='selList' onChange={(e) => setCurrentSelected(item)} />
                </span>
              </div>
              <ul>
                {renderData(item)}
              </ul>
            </div>
          </div>
        ))
      }

      <div className='priority'>
        <div className="priBox" 
        id='drak' 
        value= "high"
        onDragOver={(e)=> e.preventDefault()} 
        onDrop={(e) => handlePriority("high")}>High</div>
        <div className="priBox" 
        id='normal' 
        value ="normal" 
        onDragOver={(e)=> e.preventDefault()}
        onDrop={(e) => handlePriority("medium")}>Medium</div>
        <div className="priBox" 
        id='lite' 
        value ='low' 
        onDragOver={(e)=> e.preventDefault()}
        onDrop={(e) => handlePriority("low")}>Low</div>
      </div>
    </div>
  )
}

export default List





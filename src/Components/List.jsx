import React, { useEffect, useState } from 'react'
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import {  ref, remove, update } from "firebase/database"
import { db, auth } from "../Firebase"
import { MdOutlineDone } from "react-icons/md";
import toast from 'react-hot-toast';
function List({ todos, setTitle, setDiscription, setOption, setDate, title, discription, option, Date, listName }) {
  let value = todos
  const [isEdit, setIsEdit] = useState(false)
  const [tempId, setTempId] = useState("")
  const [todoListName, setTodoListName] = useState("")

useEffect(() =>{
  console.log(value, )
  if(value.length === 0 ) setTodoListName(listName) 
  else setTodoListName(value[0].listName)
},[value])

  const handleUpdate = (todo) => {
    setIsEdit(true)
    setTitle(todo.title)
    setDiscription(todo.discription)
    setOption(todo.option)
    setDate(todo.date)
    setTempId(todo.uid)
  }

  const handleUpdateConfirm = () => {
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

  const renderData = (state)=>{
     return value
     .filter((todo) => {
      return todo.status === state
    })
     .map((todo, index) => {
        return (
          <li key={index}
          draggable
          onDragStart={(e) => handleDragStart(e, todo)}
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

  const handleDragStart = (e, taskId) => {
    setTempId(taskId.uid)
    e.dataTransfer.setData('taskId', taskId.uid);
  };

  const handleDragOver = (e) => {
    console.log('Drag Over')
    e.preventDefault();
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    console.log(auth.currentUser.uid , tempId)
    update(ref(db, `${auth.currentUser.uid}/${tempId}`), {
      status: status,
    })
  };
  return (
    <div className='allLists'>
      <div className='todoList'>
        <div className="list"
         onDragOver={handleDragOver}
         onDrop={(e) => handleDrop(e, 'todo')}
        >
          <p className='heading'>{todoListName}</p>
          <ul>
          {renderData("todo")}
          </ul>
        </div>
      </div>
      <div className='processList'>
        <div className="list" 
         onDragOver={handleDragOver}
         onDrop={(e) => handleDrop(e, 'process')}
        >
          <p className='heading'>process</p>
          <ul>
          {renderData("process")}
          </ul>
        </div>
      </div>

      <div className='Finishedlist'>
        <div className="list"
         onDragOver={handleDragOver}
         onDrop={(e) => handleDrop(e, 'finish')}
        >
          <p className='heading'>Finish</p>
          <ul>
          {renderData("finish")}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default List



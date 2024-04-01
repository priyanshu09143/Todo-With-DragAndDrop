import React, { useEffect, useRef, useState } from 'react'
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import {  onValue, ref, remove, update } from "firebase/database"
import { db, auth } from "../Firebase"
import { MdOutlineDone } from "react-icons/md";
import toast from 'react-hot-toast';
function List({ todos , setTodos, setTitle, setDiscription, setOption, setDate, title, discription, option, Date, listName }) {
  let value = todos
  const [isEdit, setIsEdit] = useState(false)
  const [tempId, setTempId] = useState("")
  const [todoListName, setTodoListName] = useState("")

useEffect(() =>{
  if(value.length === 0 ) setTodoListName(listName) 
  else setTodoListName(value[0].listName)

  for(let i=0;i<value.length;i++){
    if(value[i].listName !== ""){
      setTodoListName(value[i].listName)
      break;
    }
  }
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


  const dragItem = useRef(null)
  const dragOverItem = useRef(null)

  const handleSort =async ()=>{
    let todos = [...value];
    const draggedItemContent = todos.splice(dragItem.current , 1 )[0]
    todos.splice(dragOverItem.current , 0 , draggedItemContent)
    dragItem.current = null;
    dragOverItem.current = null;
    setTodos(todos)

    const updates = {};
    todos.forEach((todo, index) => {
      updates[todo.uid] = { ...todo, order: index };
    });
    await update(ref(db, `${auth.currentUser.uid}`), updates);

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
          onDragStart={(e) => handleDragStart(e, todo , index)}
          onDragEnter={(e)=> dragOverItem.current = index}
          onDragEnd={handleSort}
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

  const handleDragStart = (e, taskId , index) => {
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
  return (
    <div className='allLists'>
      <div className='todoList'>
        <div className="list"
         onDragOver={handleDragOver}
         onDrop={(e) => handleDrop(e, 'todo')}
        >
          <p className='heading'>{todoListName.toUpperCase()}</p>
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
          <p className='heading'>PROCESS</p>
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
          <p className='heading'>FINISH</p>
          <ul>
          {renderData("finish")}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default List



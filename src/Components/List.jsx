import React, { useRef, useState } from 'react'
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { ref, remove, update } from "firebase/database"
import { db, auth } from "../Firebase"
import { MdOutlineDone } from "react-icons/md";
import toast from 'react-hot-toast';
function List({ todos, setTodos, setTitle, setDiscription, setOption, setDate, title, discription, option, Date , setStatus , setUpdated , setlistSelect}) {
  let value = todos
  const [isEdit, setIsEdit] = useState(false)
  const [tempId, setTempId] = useState("")
  const [newList, setNewList] = useState("")
  const [numberList, setNumberList] = useState([])
  const [totelLists, setTotelLists] = useState([])
  const [updateTrue , setUpdateTrue] = useState(false)
  const [ currentSelected , setCurrentSelected] = useState("todo")
  setUpdated(updateTrue)
  setlistSelect(currentSelected)
  value.forEach((val) => {
    if (!totelLists.includes(val.status)) {
      setTotelLists([...totelLists, val.status])
    }
  })
  
  console.log()

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
  const dragOverItem = useRef(null)
  
  const handleSort = async () => {
    let todos = [...value];
    const draggedItemContent = todos.splice(dragItem.current, 1)[0];
    todos.splice(dragOverItem.current, 0, draggedItemContent);
    
    // Update priorities based on new order
    todos.forEach((todo, index) => {
      todo.order = index;
      // Assuming you want to update the priority based on the order
      switch (true) {
        case index === 0:
          todo.option = 'high';
          break;
        case index <= todos.length / 2:
          todo.option = 'medium';
          break;
        default:
          todo.option = 'low';
          break;
      }
    });
    
    dragItem.current = null;
    dragOverItem.current = null;
    setTodos(todos);
  
    const updates = {};
    todos.forEach((todo) => {
      updates[todo.uid] = { ...todo };
    });
    await update(ref(db, `${auth.currentUser.uid}`), updates);
  };



  const renderData = (state) => {
    return value
      .filter((todo) => {
        return todo.status === state
      })
      .map((todo, index) => {
        return (
          <li key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, todo, index)}
            onDragEnter={(e) => dragOverItem.current = index}
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

  const handleDragStart = (e, taskId, index) => {
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
if(totelLists.includes(numberList[0])) setNumberList([])
  return (
    <div className='allLists'>
    {totelLists.length !==0 &&
      <div className='form createList position'>
        <>
          <input type="text" placeholder='Name Of List' value={newList} onChange={(e) => setNewList(e.target.value)} />
          <button onClick={() => createList(newList)} disabled={updateTrue} >Add List</button></>
      </div>
       }   

      {
        totelLists
        .map((state , index) => {
          return <div className='todoList' key={index}>
            <div className="list"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, state)}
            >
              <div className='heading'>
              <p className=''>{state.toUpperCase()}</p>
              <span>
              <label htmlFor="" >Select List</label>
                <input type="radio" name='selList' {...(state === "todo" ? {defaultChecked: true} : "")} onChange={(e)=> setCurrentSelected(state)}/>
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
              <p className=''>{item.toUpperCase()}</p>
              <span>
              <label htmlFor="" >Select List</label>
                <input type="radio" name='selList' {...(item === "todo" ? {defaultChecked: true} : "")} onChange={(e)=> setCurrentSelected(item)}/>
              </span>
              </div>
              <ul>
                {renderData(item)}
              </ul>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default List
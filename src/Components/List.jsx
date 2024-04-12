import React, { useEffect, useRef, useState } from 'react'
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { ref, remove, update } from "firebase/database"
import { db, auth } from "../Firebase"
import { MdOutlineDone } from "react-icons/md";
import toast from 'react-hot-toast';
import { MdDeleteForever } from "react-icons/md";
function List({ todos, setTitle, setDiscription, setOption, setDate, title, discription, option, Date, setStatus, setUpdated, setlistSelect, settodoList }) {
  let value = todos
  const [isEdit, setIsEdit] = useState(false)
  const [tempId, setTempId] = useState("")
  const [newList, setNewList] = useState("")
  const [numberList, setNumberList] = useState([])
  const [totelLists, setTotelLists] = useState([])
  const [updateTrue, setUpdateTrue] = useState(false)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    settodoList([...totelLists, ...numberList])
    setUpdated(updateTrue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totelLists, numberList, updateTrue])

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
  const handlePriority = async (state) => {
    selected.option = state
    await update(ref(db, `${auth.currentUser.uid}/${selected.uid}`), selected);
  }
  const renderData = (state) => {
    if (data[state] === undefined || data[state] === "" || data[state] === null) return
    return data[state].sort((a, b) => a.order - b.order)
      .map((todo, index) => {
        return (
          <li key={index}
            id={todo.option === "high" ? "drak" : todo.option === "medium" ? "normal" : todo.option === "low" ? "lite" : ""}
            draggable
            onDragStart={(e) => handleDragStart(e, todo, index)}
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
    if(newList.trim().length === 0){
      toast.error("Please Enter Valid List Name")
      return
    }
    let allLists = [...totelLists, ...numberList]
    allLists = allLists.map((e)=> e.toLowerCase());
    if (allLists.includes(newList.toLocaleLowerCase())) {
      setNewList("")
      toast.error(`List already exists"${newList}"`)
      return
    }
    setNumberList([...numberList, newList])
    toast.success(`List created`);
    setNewList("")
  }

  function removeList(state) {

    if (numberList.includes(state)) {
      let data = [...numberList]
      data.splice(data.indexOf(state), 1)
      setNumberList(data)
    }
    else {
      let data = [...totelLists, ...numberList]
      let index = (data.indexOf(state))
      data.splice(index, 1)
      // eslint-disable-next-line array-callback-return
      value.filter((e) => e.status === state).map((e) => {
        remove(ref(db, `${auth.currentUser.uid}/${e.uid}`))

      })
      setTotelLists([...data])
    }

    toast.success(`List "${state}" Delete Success`)
  }

  if (totelLists.includes(numberList[0])) setNumberList([])

  return (
    <div className='allLists'>
      {
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
                  <p className=''>{state.toUpperCase()}</p>
                  <span>
                    <MdDeleteForever onClick={() => removeList(state)} />
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
        numberList.map((item, index) => (
          <div className='todoList' key={index}>
            <div className="list"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, item)}
            >
              <div className='heading'>
                <p className=''>{item.toUpperCase()}</p>
                <span>
                  <MdDeleteForever onClick={() => removeList(item)} />
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
          value="high"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handlePriority("high")}>High</div>
        <div className="priBox"
          id='normal'
          value="normal"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handlePriority("medium")}>Medium</div>
        <div className="priBox"
          id='lite'
          value='low'
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handlePriority("low")}>Low</div>
      </div>
    </div>
  )
}

export default List





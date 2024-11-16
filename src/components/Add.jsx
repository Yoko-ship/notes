import React, { useEffect, useState } from 'react'
import './assets/add.css'
import axios from 'axios'

function Add() {
    const [header,setHeader] = useState("")
    const [note,setNotes] = useState("")
    const [data,setData] = useState()
    const [show,setShow] = useState(false)
    const [error,setError] = useState("")
    const [token,setToken] = useState("")

    const getData = () =>{
        const currentDate = new Date()
        const day = currentDate.getDate()
        const month = currentDate.getMonth()
        const year = currentDate.getFullYear()
        const hours = currentDate.getHours()
        const minutes = currentDate.getMinutes()
        const fullData = day + "." +  month + "." + year + " " + hours + ":" + minutes
        setData(fullData)
    }
    
    const clearForm = ()=>{
        setHeader("")
        setNotes("")
        setData("")
    }


    const clickButton = async() =>{    
    axios.post("http://localhost:3000/add",{header,note,data},{
        //* добавить могут только те кто регистрировался
        headers:{
            Authorization: `Bearer ${token}`
        }
    })
    .then(response =>{
        console.log("Данные успешно записаны",response.data)
        setShow(true)
        setError("")
        clearForm()

    })
    .catch(err =>{
        console.log(err.response ? err.response.data: err.message)
        const error_show = err.response ? err.response.data: err.message
        const object = Object.values(error_show)
        setError(object)
        setShow(false)
    })
    }

    useEffect(() =>{
        getData()
    })
    useEffect(() =>{
        const tokens = localStorage.getItem("token")
        setToken(tokens)
    })
  return (
    <>
        <div className='menu'>
        <input type='text' placeholder='Заголовок' onChange={(e) => setHeader(e.target.value)} value={header}/>
        <textarea onChange={(e) => setNotes(e.target.value)} placeholder='Notes' value={note}></textarea>
        <button onClick={clickButton}>Отправить</button>
  </div>
  {show ?(
    <p className='welcome'>Данные успешно записаны</p>
  ):(
    <p></p>
  )} 
  {error ?(
    <p className='error'>{error}</p>
  ):(
    <p></p>
  )}
      </>
  )
}

export default Add
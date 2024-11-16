import React from 'react' 
import { useState } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'


function Register() {
  const [userName,setUserName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const navigate = useNavigate()
  const [error,setError] = useState("")

  const handleRegister = async (event)=>{
    event.preventDefault()
    axios.post("http://localhost:3000/register",{userName,email,password})
    .then(response =>{
      // console.log("Регистрация прошла успешно",response.data)
      clearForm()
      navigate("/logIn")
    })
    .catch((err) =>{
      // console.log("Произошла ошибка при регистрации",err.response ? err.response.data: err.message)
      const errors = err.response ? err.response.data:err.message
      const object = Object.values(errors)
      setError(object)
    })
  }

  const clearForm = ()=>{
    setUserName("")
    setEmail("")
    setPassword("")
  }

  return (
    <>
    <form>
          <label>Имя</label>
          <input type='text' onChange={(e) => setUserName(e.target.value)} value={userName}/>
          <label>Почта</label>
          <input type="email" onChange={(e) => setEmail(e.target.value)} value={email}/>
          <label>Пароль</label>
          <input type='password' autoComplete="on" onChange={(e) => setPassword(e.target.value)} value={password} name='password'/>
          <button onClick={handleRegister} type='submit'>Подтвердить</button>
    </form>

    {error ?(
      <p className='error'>{error}</p>
    ):(
      <p></p>
      )}
    </>
  )
}

export default Register
import React, { useEffect, useState } from 'react'
import "./assets/form.css"
import axios from 'axios'

function LogIn() {

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [tokens,setToken] = useState("")
  
  const loginHandler = async(event)=>{
    event.preventDefault()
    axios.post('http://localhost:3000/logIn',{email,password})
    .then(response =>{
      // console.log("Авторизация произошла успешно",response.data)
      const token = response.data.token
      localStorage.setItem("token",token)
      localStorage.setItem("email",email)
      window.location.reload()

    }).catch(err =>{
      console.log(err.response ? err.response.data: err.message)
    })
  }

  useEffect(() =>{
    const get_token = localStorage.getItem("token")
    setToken(get_token)
  
  },[tokens])


  return (
    <>
    <div className='form'>
        <form>
            <label>Почта</label>
            <input type="email" onChange={(e) => setEmail(e.target.value)}/>
            <label>Пароль</label>
            <input type='password' autoComplete='on'onChange={(e) => setPassword(e.target.value)}/>
            <button onClick={loginHandler}>Подтвердить</button>
            <div className='link'>
                <a href='/#register'>Зарегистрироваться</a>
            </div>
        </form>
    </div>

    {tokens?(
      <p className='welcome'>Вы успешно вошли в свой аккаунт</p>
    ):(
      <p></p>
    )}
    </>

  )
}

export default LogIn
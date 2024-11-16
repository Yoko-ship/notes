import { useEffect, useState } from 'react'
import './App.css'
import {HashRouter as Router,Route,Routes,Link} from "react-router-dom"
import MainPage from './components/MainPage'
import LogIn from './components/LogIn'
import Register from './components/Register'
import Add from './components/Add'
import axios from 'axios'




function App() {


    const [test,setTest] = useState(false)
    const [token,setToken] = useState("")
    const [name,setName] = useState("")


    //? Генерируем квадратные аватарки
    var stringToColor = function stringToColor(str) {
    var hash = 0;
    var color = '#';
    var i;
    var value;
    var strLength;

    if(!str) {
        return color + '333333';
    }

    strLength = str.length;

    for (i = 0; i < strLength; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    for (i = 0; i < 3; i++) {
        value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).slice(-2);
    }

    return color;
};



var letter = name.slice(0, 1);
var backgroundColors = stringToColor(name);

const buttonCheck =()=>{
  setTest(!test)
}
const leaveButton = () =>{
  localStorage.removeItem("token")
  setToken("")
  window.location.reload("")
}

useEffect(() =>{
  const tokens = localStorage.getItem("token")
  setToken(tokens)
},[token])

const get_name = () =>{
  const token = localStorage.getItem("token")
  const userEmail = localStorage.getItem("email")
  if (token){
    axios.post("http://localhost:3000/name",{userEmail})
    .then(response =>{
      // console.log("Успешно получили имя",response.data)
      const objectList = response.data[0]
      const object = Object.values(objectList).toString()
      setName(object)
    })
    .catch(err =>{
      console.log(err.response ? err.response.data: err.message)
    })
  }
}

useEffect(() =>{
  get_name()
},[])



  return(
    <>
    <Router>
    <header>
      <ul>
        <li>
          <Link to='/'>Главное меню</Link>
        </li>
        <li>
          <Link to='/add'>Добавить</Link>
        </li>
        <li>
          <Link to='/logIn'>Авторизация</Link>
        </li>
          {token ?(
                      <div className='user-info'>
                      <div className='user-name'>
                        <div className="user-avatar" style={{backgroundColor:backgroundColors}} onClick={buttonCheck}>{letter}</div>
                        {test?(
                          <div className='user' style={{display:'block'}}>
                          <div className='names'>
                            <p>{name}</p>
                            <a href='/#'><span>Заметки</span></a>
                          </div>
                          <div className='main-button'>
                          <button onClick={leaveButton}>Выйти</button>
                          </div>
                        </div>
                        ):(
                          <div className='user'>
                          <p>Имя</p>
                          <button>Выйти</button>
                        </div>  
                        )}
                      </div>
                    </div>
          ):(
            <p style={{display:"none"}}></p>
          )}
      </ul>
    </header>
    <Routes>
      <Route path='/' element={<MainPage/>}></Route>
      <Route path='/logIn' element={<LogIn/>}></Route>
      <Route path='/register' element={<Register/>}></Route>
      <Route path='/add' element={<Add/>}></Route>
    </Routes>
    </Router>
    </>
  )
}

export default App

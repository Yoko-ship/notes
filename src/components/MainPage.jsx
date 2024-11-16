import { useEffect, useState } from 'react'
import "../App.css"
import axios from 'axios'





function MainPage() {
  const [show,setShow] = useState(false)
  const [elements,setElements] = useState([])
  const [search,setSearch] = useState("")
  const [error,setError] = useState(false)


  // Search(filter)
  const filteredItems = elements.filter((item) =>
  item.content.some((contentItem) =>
    contentItem.value.toString().toLowerCase().includes(search.toLowerCase())
  )
  )

  const showNotes = () =>{
    const token = localStorage.getItem("token")
    if(token){
      setError(false)
      axios.get("http://localhost:3000/",{
      headers:{
        Authorization:`Bearer ${token}`
      },
    })
    .then(response =>{
      // console.log("Данны успешно получены",response.data)
      setShow(true)
      const object = response.data
      const objectList = Object.values(object)
      // Итерируем массив 
      const updatedElements = objectList.map((obj) =>({
        id:obj.id,
        content:[
          {type:"Дата",value:obj.Дата},
          {type:"Заголовок",value:obj.Заголовок},
          {type:"Текст",value:obj.Текст},
          {type:"ID",value:obj.id}
        ]
      }))
      setElements(updatedElements)
      setShow(true)
    }).catch(err =>{
      console.log(err.response ? err.response.data : err.message)
    })
    }
    else{
      setError(true)
    }
  }
  


  useEffect(() =>{
    showNotes()
  },[])


  // Удаляем по id
  const deleteButton = (id) =>{
    axios.delete(`http://localhost:3000/delete/${id}`,{
      method:"DELETE",
    })
    .then(response =>{
      // console.log("Успешно удалены",response.data)
      setElements((prevElements) => prevElements.filter((el) => el.id !== id))
    })
    .catch(err =>{
      console.log(err.response? err.response.data:err.message)
    })
  }

  return (
    <>
    <div className='notes'>
        Notes
    </div>

    <div className='search'>
      <input type='search' value={search} onChange={(e) => setSearch(e.target.value)}/>
    </div>
    
    {error ?(
            <p className='welcome' style={{color:'red'}}>Вам нужно авторизоваться чтобы увидеть заметки</p>
          ):(
            <p></p>
)}

    {show ?(
      <div className='grids'>
        {filteredItems.map((div)=>(
          <div className='grid' key={div.id}>
            {div.content.map((item,index) =>{
              if (item.type === "Заголовок"){
                return <p key={index}>Заголовок:{item.value}</p>
              }
              else if(item.type === "Текст"){
                return <span key={index}>Текст:{item.value}</span>
              } else if(item.type === "Дата"){
                return <p key={index}>Дата: {item.value}</p>
              }
            })}
              <div className='buttons'>
                <button onClick={()=> deleteButton(div.id)} className='delete'>Удалить</button>
              </div>
          </div>
        ))}
      </div>
    ):(
      <p></p>
    )}
    </>
  )
}

export default MainPage

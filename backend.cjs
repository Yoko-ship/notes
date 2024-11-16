const express = require('express')
const pool = require('./data.cjs')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const cors = require("cors")
const dotenv = require("dotenv").config()

const secret_code = process.env.SECRET_CODE
const app = express()
app.use(express.json())
app.use(cors())


pool.query("SELECT NOW()",(err,res) =>{
    if (err){
        console.error("Произошла ошибка",err.stack)
    } else{
        console.log("Успешно подключились к бз",res.rows)
    }

});
const createTable = `
    CREATE TABLE IF NOT EXISTS users(
        ID SERIAL PRIMARY KEY,
        Имя VARCHAR NOT NULL,
        Почта VARCHAR NOT NULL,
        Пароль VARCHAR NOT NULL
    )
`

const createNoteTables = `
        CREATE TABLE IF NOT EXISTS notes(
            ID SERIAL PRIMARY KEY,
            Заголовок VARCHAR NOT NULL,
            Текст VARCHAR NOT NULL,
            Дата VARCHAR NOT NULL,
            user_id SERIAL REFERENCES users(ID)
        )
`

pool.query(createTable,(err) =>{
    if (err){
        console.error("Произошла ошибка при создании таблицы",err.stack)
    } else{
        console.log("Успешно создали базу данных")
    }
})

pool.query(createNoteTables,(err) =>{
    if(err){
        console.log("error",err.message)
    }
})

app.post("/register",async(req,res) =>{
    const {userName,email,password} = req.body
    if (!userName || !email || !password){
        return res.status(404).json({error:"❌ Вы должны заполнить все ячейки"})
    }
    try{
    const hashedPassword = await bcrypt.hash(password,10)
    const checkEmail = `SELECT * FROM users WHERE Почта = $1`
    const emailResult =  await pool.query(checkEmail,[email])
    if (emailResult.rows.length > 0){
        return res.status(409).json({error:"❌ Пользователь с таким эмейлом уже существует"})
    }
    const insertQuery = `INSERT INTO users(Имя,Почта,Пароль) VALUES($1,$2,$3) RETURNING id`
    const result = await pool.query(insertQuery,[userName,email,hashedPassword])
    res.json({id: result.rows[0].id})
    }
    catch(err){
        return res.status(404).json({error:err.message})
    }
})

const authentification = (req,res,next) =>{
    const authHeader = req.headers["authorization"]
    if(!authHeader){
        return res.status(500).json({error:"Заголовок отсутствует"})
    }
    const token = authHeader.split(" ")[1]
    if(!token){
        return res.status(401).json({error:"Токен отсутствует"})
    }
    jwt.verify(token,secret_code,(err,user)=>{
        if(err){
            return res.status(401).json({error:"❌ Нужно войти в аккаунт чтобы добавлять заметки"})
        }
        req.user = user
        next()
    })

}

app.post("/add",authentification,async(req,res) =>{
    const {header,note,data} = req.body
    const userId = req.user.id
    if (!header || !note){
        return res.status(402).json({error:"❌ Вы должны заполнить все ячейки"})
    }
    if (!userId){
        return res.status(401).json({error:"User'a не существует"})
    }
    try{
        const insertQuery = `INSERT INTO notes(Заголовок,Текст,Дата,user_id) VALUES($1,$2,$3,$4) RETURNING id`
        const result = await pool.query(insertQuery,[header,note,data,userId])
        res.json({id: result.rows[0].id})
    }catch(err){
        return res.status(404).json({error:err.message})
    }
})




app.post("/logIn",async(req,res)=>{
    const {email,password} = req.body
    if (!email){
        return res.status(402).json({error:"Почта отсутствует"})
    }
    if (!password){
        return res.status(402).json({error:"Пароль отсутсвует"})
    }

    const querySelect = `SELECT * FROM users WHERE Почта = $1`
    const result =  await pool.query(querySelect,[email])
    if(result.rows.length === 0){
        return res.status(402).json({error:"Пользователь не найден"})
    }
    const user = result.rows[0]
    const passwordCheck = await bcrypt.compare(password,user.Пароль)
    if(!passwordCheck){
        return res.status(402).json({error:"Пароль не совпадает"})
    }
    const token = jwt.sign({id:user.id,email:user.email},secret_code,{
        expiresIn:"1h"
    })
    res.json({token})
    })

app.get("/",authentification,async(req,res) =>{
    const userId = req.user.id
    const querySelect = `SELECT * FROM notes WHERE user_id = $1`
    const result = await pool.query(querySelect,[userId])
    if(result.rows.length === 0){
        return res.status(402).json({error:"Произошла какая то ошибка"})
    }
    res.json(result.rows)
})

app.post("/name",async(req,res)=>{
    try{
        const {userEmail} = req.body
        if (!userEmail){
            return res.status(401).json({error:"Почта отсутствует"})
        }
            const getName = "SELECT Имя FROM users WHERE Почта = $1"
            const result = await pool.query(getName,[userEmail])
            if (result.rows.length === 0){
                return res.status(402).json({error:"Произошла ошибка"})
            }
            res.json(result.rows)
    }
    catch(err){
        return res.status(404).json({error:err.message})
    }
})


app.delete("/delete/:id",async(req,res)=>{
    const {id} = req.params
    const queryInfo = "DELETE FROM notes WHERE id = $1"
    const result = await pool.query(queryInfo,[id])
    res.send(`Таблица с id ${id} успешно удалилась`)
})

const PORT = 3000
app.listen(PORT,() =>{
    console.log(`Сервер работает на порте ${PORT}`)
})
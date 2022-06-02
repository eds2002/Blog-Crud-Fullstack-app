import express from "express";
import bodyparser from "body-parser";
import cors from 'cors'
import mysql from 'mysql'
import userRouter from './routers/user.js'
import blogRouter from './routers/blog.js'
import commentsRouter from './routers/comments.js'
import bookmarksRouter from './routers/bookmarks.js'
import profileRouter from './routers/profile.js'
import cookieParser from "cookie-parser";


const app = express();
const PORT = 4001;
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

app.use(bodyparser.json())
app.use(cookieParser())

app.use('/user',userRouter)
app.use('/blog',blogRouter)
app.use('/comments',commentsRouter)
app.use('/bookmarks',bookmarksRouter)
app.use('/profile', profileRouter)

app.listen(process.env.PORT || PORT,(error)=>{
    if(error){
        console.log("Error in server")
    }else{
        console.log("Success running port!")
    }
})

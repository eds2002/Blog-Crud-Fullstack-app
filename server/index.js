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
const PORT = process.env.PORT || 4001;

app.set('trust proxy', 1)

app.use(cors({credentials: true, origin: 'https://blogappfrontend.vercel.app'}));

// app.use(function(req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', 'https://blogcrud-8h0ja1bcw-eds2002.vercel.app');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// });


app.use(bodyparser.json())
app.use(cookieParser())

app.use('/user',userRouter)
app.use('/blog',blogRouter)
app.use('/comments',commentsRouter)
app.use('/bookmarks',bookmarksRouter)
app.use('/profile', profileRouter)

app.get('/',(req,res)=>{
    res.send('yo')
})

if(process.env.NODE_ENV === 'production'){
    
}

app.listen(process.env.PORT || PORT,(error)=>{
    if(error){
        console.log("Error in server")
    }else{
        console.log("Success running port!")
    }
})

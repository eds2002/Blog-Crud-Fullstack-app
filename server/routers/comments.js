import e from 'express';
import express from 'express'
import {connection} from '../database/connection.js'
const router = express.Router();

router.post('/post',(req,res)=>{
    const {username,date,comment,blogId,userId} = req.body
    const postCommentSQL = "INSERT INTO blog_comments (username,posted_date,content,blog_id,user_id) VALUES (?,?,?,?,?)"
    connection.query(postCommentSQL, [username,date,comment,blogId,userId],(error,result)=>{
        if(error){
            return res.status(400).json({error})
        }else{
            return res.status(200).json({result})
        }
    })
})

router.get('/blog/:id',(req,res)=>{
    const { id } = req.params
    const getCommentsSQL = "SELECT * FROM blog_comments WHERE blog_id = ?"
    connection.query(getCommentsSQL, id, (error,result)=>{
        if(error){
            res.status(400).json({error})
        }else{
            res.status(200).json({result})
        }
    })
})


router.delete('/delete/:id',(req,res)=>{
    const {id} = req.params
    const deleteCommentSQL = "DELETE FROM blog_comments WHERE id = ?"
    connection.query(deleteCommentSQL, id, (error,result)=>{
        if(error){
            res.status(400).json({error})
        }else{
            res.status(200).json({result})
        }
    })
})

export default router
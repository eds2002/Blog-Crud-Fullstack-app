import e from 'express';
import express from 'express'
import {connection} from '../database/connection.js'
const router = express.Router();

router.get('/:id',(req,res)=>{
    const {id} = req.params
    const getBookmarksSQL = 'SELECT * FROM user_bookmarks WHERE user_id = ?'
    connection.query(getBookmarksSQL, id,(error,result)=>{
        if(error) return res.status(400).json({error})
        res.status(200).json({result})
    })
})

router.get('/:id/:userId',(req,res)=>{
    const blogId = req.params.id
    const userId = req.params.userId
    const userBookmarksSQL = "SELECT * FROM user_bookmarks WHERE blog_id = ?"
    connection.query(userBookmarksSQL, blogId, (error,result)=>{
        if(error){
            return res.status(400).json({bookmarked:false})
        }else{
            return res.status(200).json({result})
        }
    })
})

router.post('/add',(req,res)=>{
    const {userId,blogId, time} = req.body
    const addBookmarkSQL = "INSERT INTO user_bookmarks (timestamp,blog_id, user_id) VALUES (?,?,?)"
    connection.query(addBookmarkSQL,[time,blogId,userId],(error,result)=>{
        if(error){
            return res.status(400).json({error})
        }else{
            return res.status(200).json({result})
        }
    })
})

router.delete('/delete/:id/',(req,res)=>{
    const {id} = req.params
    const deleteBookmarkSQL = "DELETE FROM user_bookmarks WHERE id = ?"
    connection.query(deleteBookmarkSQL,id,(error,result)=>{
        if(error){
            return res.status(400).json({error})
        }else{
            return res.status(200).json({result})
        }
            
    })
})

router.delete('/remove/:id',(req,res)=>{
    const {id} = req.params
    const findBookmarkIndexSQL = "SELECT * FROM user_bookmarks WHERE blog_id = ?"
    connection.query(findBookmarkIndexSQL,id,(error,result)=>{
        if(error) return res.status(400).json({error})
        const bookmarkId = result[0]['id']

        const deleteBookmarkId = "DELETE FROM user_bookmarks WHERE id = ?"
        connection.query(deleteBookmarkId, bookmarkId, (error,result)=>{
            if(error) return res.status(400).json({error})
            res.status(200).json({result})
        })
    })
})


export default router 
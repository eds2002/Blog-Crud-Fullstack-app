import express from 'express'
import {connection} from '../database/connection.js'
const router = express.Router();



// Get blogs
router.get('/',(req,res)=>{
    const sql = "SELECT * from blog"
    connection.query(sql,(error,result)=>{
        if(error){
            console.log(error)
        }else{
            res.send(result)
        }
    })
})


// Targeting specific blogs, /blogs/post/20
router.get('/:id',(req,res)=>{
    const { id } = req.params;
    const sql = "SELECT * FROM blog WHERE id = ?"
    connection.query(sql,[id],(error,result)=>{
        if(result.length <= 0){
            return res.status(400).json({error:error})
        }else{
            return res.status(200).json({data:result})
        }
    })
})


// Creating a blog
router.post('/create',(req,res)=>{
    const {userId,text,title,authorNotes,status,dateCreated, author, authorUsername} = req.body
    const createPostSQL = "INSERT INTO blog (title,text,tags,author_notes,date_created,status,user_id, author, author_username) VALUES (?,?,?,?,?,?,?,?,?)"
    connection.query(createPostSQL, [title,text,"",authorNotes,dateCreated,status,userId,author,authorUsername],(error,result)=>{
        if(error){
            return res.status(400).json({message:error})
        }else{
            return res.status(200).json({message:result})
        }
    })
})



// Deleting blog
router.delete('/delete/:id',(req,res)=>{
    const {id} = req.params
    const deletePostSQL = "DELETE FROM blog WHERE id = ?"
    connection.query(deletePostSQL, [id], (error,result)=>{
        if(error){
            return res.status(400)
        }else{
            return res.status(200)
        }
    })
    res.status(200).json({message:"success"})
})

// Get all blogs with certain id
router.get('/getall/:id',(req,res)=>{
    const array = req.params
    const test = JSON.parse(array.id)
    const posArr = []
    // Pushing parsed array into an acceptable format for mysql Ex: [20,19,18]
    test.forEach(res=>{
        posArr.push(res.id)
    })

    // Using IN to query multiple values from posArr
    const getBlogsSQL = 'SELECT * FROM blog WHERE id IN (?) '
    connection.query(getBlogsSQL,[posArr], (error,result)=>{
        if(error){
            res.status(400).json({error})
        }else{
            res.status(200).json({result})
        }
    })
})


// Editing blog
router.patch('/edit/:id',(req,res)=>{
    const {id} = req.params
    const {text,title,authorNotes, status, dateModified} = req.body
    const updateBlogSQL = "UPDATE blog SET title = ?, text = ?, author_notes = ?, status = ?, date_modified = ? WHERE id = ?"
    connection.query(updateBlogSQL, [title,text,authorNotes,status, dateModified,id],(error,result)=>{
        if(error) return res.status(400).json({error})
        console.log(result)
        return res.status(200).json({result})
    })
})

// Getting all blogs from user
router.get('/all/:id',(req,res)=>{
    const {id} = req.params
    const getUserBlogsSQL = "SELECT * FROM blog WHERE user_id = ?"
    connection.query(getUserBlogsSQL, id, (error,result)=>{
        if(error) {
            res.status(400).json({error})
        }else{
            res.status(200).json({result})
        }
    })
})

// update blog status 
router.patch('/status/:id/:status',(req,res)=>{
    const {id, status} = req.params
    const changeStatusSQL = "UPDATE blog SET status = ? WHERE id = ?"
    connection.query(changeStatusSQL, [status,id],(error,result)=>{
        if(error) return res.status(400).json({error})
        return res.status(200).json({result})
    })
})

export default router
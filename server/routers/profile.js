import express from 'express'
import {connection} from '../database/connection.js'
const router = express.Router();


// Get all blogs from specifc user
router.get('/blogs/:id',(req,res)=>{
    const {id} = req.params
    const getBlogsSQL = "SELECT * FROM blog WHERE user_id = ?"
    connection.query(getBlogsSQL, id, (error,result)=>{
        if(error)return res.status(400).json({error})
        return res.status(200).json({result})
    })
})

export default router
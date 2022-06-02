import express from 'express'
import bcrypt from 'bcrypt'
import { connection } from '../database/connection.js';
import { createToken, validateToken } from '../JWT.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
const router = express.Router();
router.use(cookieParser())
// router.use(cors({credentials: true, origin: 'http://localhost:3000'}));

// User Login
router.post('/login', async (req,res)=>{
    const {email, password} = req.body;
    const sqlEmail = 'SELECT email FROM user WHERE email = ?'
    connection.query(sqlEmail,[email],(error,result)=>{
        if(error) return res.status(400).json({error}) //If error, return error message
        if(result.length === 0) return res.status(400).json({message: "Email does not exist."}) //If array length returns is 0 (No sure is in DB), return error

        // Check if password is valid once email is validated
        const sqlPassword = 'SELECT password FROM user WHERE email = ?'
        connection.query(sqlPassword,[email], (error,dbPassword)=>{
            if(error) return res.status(400).json({error})
            bcrypt.compare(password, dbPassword[0].password).then((match)=>{
                if(!match) {
                    return res.status(400).json({message: "Incorrect password, try again."})
                }else{
                    // SQL query to select user, user user information to create their JWT token
                    const getUserSql = "SELECT * FROM user WHERE email = ?"
    
                    // Query, use information to create a cookie
                    connection.query(getUserSql, [email], (error,dbUser)=>{
                        if(error) return res.status(400).json({error: "Error in querying data"})
                        // Clear cookie if any, if user is redirected to login the jwt is modifed/incorrect
                        res.clearCookie("userToken");
                        // Creating cookie, sending information to function
                        const accessToken = createToken(dbUser)
                        return res.status(202).json({message:'success',token: accessToken})
                    })
                }
            })
    
        })
    })


})


// User signup
router.post('/signup',(req,res)=>{
    const {firstName,lastName, username, email, password, darkmode, showUsername, roles} = req.body;
    bcrypt.hash(password, 10).then((hash)=>{
        let sql = "INSERT INTO user (email, password, username,first_name, last_name, darkmode, show_username, roles) VALUES (?,?,?,?,?,?,?,?)"
        connection.query(sql,[email,hash, username, firstName, lastName, darkmode, showUsername,roles],(error,result)=>{
            if(error) return res.status(409).json({error: "Email is already in use, forgot password?"});

            // SQL query to select user
            const getUserSql = "SELECT * FROM user WHERE email = ?"

            // Query, use information to create a cookie
            connection.query(getUserSql, [email], (error,dbUser)=>{
                if(error) return res.status(400).json({error: "Error in querying data"})
                
                // Creating cookie, sending information to function
                const accessToken = createToken(dbUser)
                return res.status(202).json({message:'success',token: accessToken})
            })
        })
    })
})

// User logout
router.post('/logout', (req,res)=>{
    res.status(202).cookie('userToken','', {
        sameSite: 'None',
        path: '/',
        expires: new Date(new Date().getTime() + 1 * 1),
        httpOnly: true,
        secure:true
    }).send("Success")
})


// Selecting a specific user
router.get('/profile/:id', (req,res)=>{
    const {id} = req.params
    const getProfileSQL = 'SELECT * FROM user WHERE id = ?'
    connection.query(getProfileSQL, id, (error,result)=>{
        if(error) return res.status(400).json({error})
        return res.status(200).json({result})
    })
})

router.get('/all',(req,res)=>{
    const getAllUsersSQL = "SELECT * FROM user"
    connection.query(getAllUsersSQL,(error,result)=>{
        if(error) return res.status(400).json({error})
        return res.status(200).json({result})
    })
})

// Check if username already exists in db
router.get('/username/:username',(req,res)=>{
    const {username} = req.params
    const getUserSQL = "SELECT username FROM user WHERE username = ?"
    connection.query(getUserSQL, username, (error,result)=>{
        if(error) return res.status(400).json({error})
        return res.status(200).json({result})
    })
})


// Update the users role (ADMINS ONLY)
router.patch('/role/:id/:role',(req,res)=>{
    const {id, role} = req.params
    const UpdateUserSQL = 'UPDATE user SET roles = ? WHERE id = ?'
    connection.query(UpdateUserSQL,[role,id],(error,result)=>{
        if(error) return res.status(400).json({error})
        return res.status(200).json({result})
    })
})

router.patch('/settings/:firstname/:lastname/:username/:userId',(req,res)=>{
    const {firstname, lastname, username, userId} = req.params
  
    const updateUser = "UPDATE user SET first_name = ?, last_name = ?, username = ? WHERE id = ?"
    connection.query(updateUser, [firstname,lastname,username,userId],(error,result)=>{
        if(error) return res.status(400).json({error})
        return res.status(200).json({result})
    })
})

router.delete('/delete/:id',(req,res)=>{
    const {id} = req.params
    const deleteUserSQL = "DELETE FROM user WHERE id = ?"
    connection.query(deleteUserSQL, id, (error,result)=>{
        if(error) return res.status(400).json({error})
        return res.status(202).cookie('userToken','', {
            sameSite: 'None',
            path: '/',
            expires: new Date(new Date().getTime() + 1 * 1),
            httpOnly: true,
            secure:true
        }).send("Success")
    })
})



export default router
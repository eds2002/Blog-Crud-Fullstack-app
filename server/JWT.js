import sign from "jsonwebtoken";
import verify from 'jsonwebtoken'
import jwt from 'jsonwebtoken'

export const createToken = (user) =>{
    const accessToken = jwt.sign({id:user[0].id, email: user[0].email, firstName: user[0].first_name, lastName: user[0].last_name, role: user[0].roles, username: user[0].username}, process.env.JWT_SECRET);
    return accessToken;
}

export const validateToken = (req,res,next)=>{
    const accessToken = req.cookies["accessToken"]
    if(!accessToken) return res.status(400).json({error: "User not authenticated"})

    try{
        const validToken = jwt.verify(accessToken, process.env.JWT_SECRET)
        if(validToken){
            req.authenticated = true
            return next();
        }
    }catch(err){
        return res.status(400).json({error:err})
    }
}


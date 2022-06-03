import mysql from 'mysql'

const connection = mysql.createPool({
    host: process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    connectionLimit: 10,
    database: process.env.DATABASE,
    multipleStatements: true,
})


connection.on('connection',(con)=>{
    console.log("Success")

    con.on('error',(err)=>{
        console.error(new Date(), 'MySQL error', err.code);
    })
    con.on('close',(err)=>{
        console.error(new Date(), 'MySQL closed', err.code);
    })
})

export {connection} 

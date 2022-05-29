import mysql from 'mysql'

const connection = mysql.createPool({
    host: "localhost",
    user:"root",
    password:"M@ywngtp23",
    connectionLimit: 10,
    database: 'blogApp',
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

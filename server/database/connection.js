import mysql from 'mysql'

const connection = mysql.createPool({
    host: "us-cdbr-east-05.cleardb.net",
    user:"b296e48a620231",
    password:"bdd96b00",
    connectionLimit: 10,
    database: 'heroku_ec847b72efc621c',
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

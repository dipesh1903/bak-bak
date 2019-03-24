var sql = require('./database');

var database = (q,data) => {
    return new promise ((resolve,reject) => {
        sql.query(q,data,(err,res,field) => {
            if(err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}
const createRoom = (room, user) => {
    var id , chat_id;
    sql.query(`select id from users where email = ?`,[user], (err,results,fields) => {
        if(err){
            console.log(err)
            return;
        } else {
            id = results[0].id

            var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
            sql.query(`insert into chatroom(name, date) values (?,?)`,[room,date],(erro, result , field ) => {
                if(erro) {
                    console.log(erro)
                } else {
                    console.log(result)
                    sql.query(`select room_id from chatroom where name=?`,[room],(e,r,f) => {
                        if(err) {
                            console.log(err)
                        } else {

                    chat_id = r[0].room_id;
                    sql.query(`insert into users_chatroom(id, room_id,joined) values(?,?,?)` , [id, chat_id, date], (error, res, fiels) => {
                        if(error) {
                            console.log(erro)
                        } else {
                            console.log(res)
                        }
                    
                    })
                }
                    })
                }
            })
        }
    })
}

var joinRoom = (room,user) => {
    var id , chat_id;
    sql.query(`select id from users where email = ?`,[user], (err,results,fields) => {
        if(err){
            console.log(err)
            return;
        } else {
            id = results[0].id
            console.log(id)
            var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
                    sql.query(`select room_id from chatroom where name=?`,[room],(e,r,f) => {
                        if(err) {
                            console.log(err)
                        } else {

                    chat_id = r[0].room_id;
                    sql.query(`insert into users_chatroom(id, room_id,joined) values(?,?,?)` , [id, chat_id, date], (error, res, fiels) => {
                        if(error) {
                            console.log(erro)
                        } else {
                            console.log(res)
                        }
                    
                    })
                }
                    })
                }
            })
        }
module.exports = {
    createRoom,
    joinRoom
}
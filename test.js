let jwt = require('jsonwebtoken');
var mysql = require('mysql')
const secret='secret'

var connection = mysql.createConnection({
    host: 'database-1.cjlhex7dh9lz.ap-southeast-1.rds.amazonaws.com',
    user: 'admin',
    password: 'admin1234',
    database: 'test_sertis'
})
connection.connect()


let token=create_token('nattawatkit', 'secret')
console.log(token)

// var token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5hdHRhd2F0a2l0IiwiaWF0IjoxNTg4NDk1ODUxLCJleHAiOjE1ODg1ODIyNTF9.19tpGelgf_LkE6ns4AbknKRD52IwHQkszgJhLANxIg0'
// try{
//     var decoded =  verify_token(token, secret)
//     check_user_token(decoded).then(result=>{
//         console.log(result)
//     })

// }catch(err){
//     console.log(err.name)
//     console.log(err.message)
//     console.log(err.expiredAt)
//     return false
// }

// verify check token expire date
// query username for database to compare token

function create_token(username, secret){
    // token exprie date 1 day
    var token = jwt.sign({ username: username }, secret, { expiresIn:  60 * 60 * 24 });
    return token
}
function verify_token(token, secret){
    // try{
        var decoded = jwt.verify(token, secret)
        return decoded
    // }catch(err){
    //     console.log(err.name)
    //     console.log(err.message)
    //     console.log(err.expiredAt)
    //     return false
    // }
}
function check_user_token(decoded){
    return new Promise( function(resolve, reject){
        connection.query(`select * from blog_user where username=?;`,[decoded.username], function (err, rows, fields) {
            if (err) {
                res.status(500).jsonp({ error: 'message' })
                resolve(false)
            }
            if( rows.length>0){
                if(rows[0].token==token){
                    resolve(true)
                }else{
                    resolve(false)
                }
            }
        })
    }).then( function(result) {
        // if(result){
        //     console.log('true')
        // }else{
        //     console.log('false')
        // }
        return result

    })

}
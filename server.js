var express = require('express')
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser')
var mysql = require('mysql')
var app = express()
app.use(express.json());
const port = 3000
const secret='secret'
var connection = mysql.createConnection({
    host: 'database-1.cjlhex7dh9lz.ap-southeast-1.rds.amazonaws.com',
    user: 'admin',
    password: 'admin1234',
    database: 'test_sertis'
})
connection.connect()


function random_string(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function create_token(username, secret){
    // token exprie date 1 day
    var token = jwt.sign({ username: username }, secret, { expiresIn:  60 * 60 * 24 });
    return token
}
function verify_token(token, secret){
    var decoded = jwt.verify(token, secret)
    return decoded
}
function check_user_token(token, decoded){
    return new Promise( function(resolve, reject){

        connection.query(`select * from blog_user where username=?;`,[decoded.username], function (err, rows, fields) {
            if (err) {
                res.status(500).jsonp({ error: 'message' })
                resolve(false)
            }
            if(rows.length>0){
                // compare request token and user token
                if(rows[0].token==token){
                    resolve(true)
                }else{
                    resolve(false)
                }
            }
        })
    }).then( function(result) {
        return result
    })
}

app.post('/new_author',function (req, res) {
    let data = [
        random_string(10),
        req.body.username,
        random_string(10),
    ]

    connection.query(`INSERT INTO blog_user VALUES (?, ?, ? );`, data, function (err, rows, fields) {
        if (err) {
            res.status(500).jsonp({ error: 'message' })
        }
        console.log(rows)
        let response = {
            data: "creste success"
        }
        res.jsonp(response)
    })
})

/** Create */
app.post('/create',function (req, res) {
    try{
        // verify token
        let token = req.headers.authorization
        var decoded =  verify_token(token, secret)
        // check request token with  user token in db
        check_user_token(token, decoded).then(result=>{
            if(!result){
                // token unmatch or user not foudn in db
                res.status(500).jsonp({ error: 'username not found' })
            }else{
                let data = [
                    random_string(10),
                    req.body.blog_owner,
                    req.body.card_name,
                    req.body.card_name,
                    req.body.category,
                    req.body.blog_status
                ]
                console.log(data)
                connection.query(`INSERT INTO mini_blog VALUES (?, ?, ? ,? ,? ,?);`, data, function (err, rows, fields) {
                    if (err) {
                        res.status(500).jsonp({ error: 'message' })
                    }
                    console.log(rows)
                    let response = {

                        data: "creste success"
                    }
                    res.jsonp(response)
                })
            }
        })
    }catch(err){
        res.status(500).jsonp({ error: 'invalid token' })
    }
})

 /** Get */
app.get('/:card_name', function (req, res) {
    console.log(req.params.card_name)
    let token = req.headers.authorization
    try{
        // verify token
        var decoded =  verify_token(token, secret)
        // check request token with  user token in db
        check_user_token(token, decoded).then(result=>{
            if(!result){
                // token unmatch or user not foudn in db
                res.status(500).jsonp({ error: 'username not found' })
            }else{
                connection.query(`select * from mini_blog where card_name=?;`,[req.params.card_name], function (err, rows, fields) {
                    if (err) {
                        res.status(500).jsonp({ error: 'message' })
                    }
                    let response = {
                        token: "",
                        data: ""
                    }
                    response.data= rows
                    res.jsonp(response)
                })
            }
        })
    }catch(err){
        res.status(500).jsonp({ error: 'invalid token' })
    }
})


/** Delete new author */
app.get('/delete/:id', function (req, res) {
    try{
        // verify token
        let token = req.headers.authorization
        var decoded =  verify_token(token, secret)
        // check request token with  user token in db
        check_user_token(token, decoded).then(result=>{
            if(!result){
                // token unmatch or user not foudn in db
                res.status(500).jsonp({ error: 'username not found' })
            }else{
                connection.query(`DELETE FROM mini_blog where id=?;`, [req.params.id],function (err, rows, fields) {
                    if (err) {
                        res.status(500).jsonp({ error: 'message' })
                    }
                    console.log(rows)

                    let response = {
                        token: "",
                        data: "delete success"
                    }
                    res.jsonp(response)
                })
            }
        })
    }catch(err){
        res.status(500).jsonp({ error: 'invalid token' })
    }
})

// /** Update new author */
app.post('/update/', function (req, res) {
    try{
        // verify token
        let token = req.headers.authorization
        var decoded =  verify_token(token, secret)
        // check request token with  user token in db
        check_user_token(token, decoded).then(result=>{
            if(!result){
                // token unmatch or user not foudn in db
                res.status(500).jsonp({ error: 'username not found' })
            }else{
                let data = [
                    req.body.blog_owner,
                    req.body.card_name,
                    req.body.content,
                    req.body.category,
                    req.body.blog_status,
                    req.body.id,
                ]
                connection.query(`UPDATE mini_blog SET blog_owner=?, card_name=?, content=?, category=?, blog_status=? WHERE id=?; `, data, function (err, rows, fields) {
                    if (err) {
                        res.status(500).jsonp({ error: 'message' })
                    }
                    console.log(rows)
                    let response = {
                        data: ""
                    }
                    if(rows.affectedRows==0){
                        response.data="update not found"
                        res.jsonp(response)
                    }else{
                        response.data="update success"
                        res.jsonp(response)
                    }
                })
            }
        })
    }catch(err){
        res.status(500).jsonp({ error: 'invalid token' })
    }

})
app.listen(port)




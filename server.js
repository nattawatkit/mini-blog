var express = require('express')
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser')
var mysql = require('mysql')
const Sequelize = require('sequelize');
var Model=require('./model')
var app = express()
app.use(express.json());
const port = 3000
const secret='secret'
// var connection = mysql.createConnection({
//     host: 'database-1.cjlhex7dh9lz.ap-southeast-1.rds.amazonaws.com',
//     user: 'admin',
//     password: 'admin1234',
//     database: 'test_sertis'
// })
// connection.connect()


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
    console.log(token)
    var decoded = jwt.verify(token, secret)
    console.log(decoded)
    return decoded
}
function check_user_token(token, decoded){

    return new Promise( function(resolve, reject){
        Model.BlogUser.findOne({ where: {username:decoded.username }}).then(project => {
            // username notfound
            if(!project){
                resolve(false)
            }else{
                if(project.get('token')==token){
                    resolve(true)
                }else{
                    resolve(false)
                }
            }
        })
    })
}


app.get('/',function (req, res) {
    Model.MiniBlog.findOne({ where: {id: 'cYqj0NBSpa'}, raw: true }).then(project => {
        res.jsonp(project)
    })
})



app.post('/new_token',function (req, res) {

    token = create_token(req.body.username, secret)
    res.jsonp({token: token})
})

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
                let data = {
                    id: random_string(10),
                    blog_owner: req.body.blog_owner,
                    card_name: req.body.card_name,
                    content: req.body.content,
                    category: req.body.category,
                    blog_status: req.body.blog_status
                }
                console.log(data)
                 Model.MiniBlog.create({ id: data.id, blog_owner: data.blog_owner,  card_name: data.card_name, content: data.content, category: data.category, blog_status: data.blog_status }).then(result=>{
                    if (result instanceof Model.MiniBlog){
                        let response = {
                            data: "creste success"
                        }
                        res.jsonp(response)
                    }
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

        // check request token with  user token in db=
        check_user_token(token, decoded).then(result=>{
            if(!result){
                // token unmatch or user not foudn in db
                res.status(500).jsonp({ error: 'username not found' })
            }else{
                Model.MiniBlog.findOne({ where: {card_name: req.params.card_name}, raw: true }).then(project => {
                    // card not found
                    if(!project){
                        res.status(500).jsonp({ error: req.params.card_name+' not found' })
                    }
                    let response = {
                        token: "",
                        data: ""
                    }
                    response.data= project
                    res.jsonp(project)
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




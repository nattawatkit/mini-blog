var express = require('express')
var jwt = require('jsonwebtoken');
var Model=require('./model')
var app = express()
app.use(express.json());
const port = 3000
const secret='secret'

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
    var token = jwt.sign({ username: username }, secret, { expiresIn:  60*60*24});
    return token
}
function verify_token(token, secret){
    var decoded = jwt.verify(token, secret)
    return decoded
}
function decode_token(token, secret){
    var decoded = jwt.decode(token, secret)
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


/**  refresh token*/
app.post('/refresh_token',function (req, res) {

    let username= req.body.username
    let token = req.headers.authorization
    let decoded =  decode_token(token, secret)
    let response = {
        token:"",
        data: ""
    }
    console.log(username)
    console.log(token)
    if(decoded.username==username){
        let  new_token = create_token(req.body.username, secret)
        console.log(new_token)
        Model.BlogUser.update({ token: new_token},
            {where: {username: username}}).then(result=>{

                console.log(result)
                if(result[0]>0){
                    response.token=new_token
                    response.data= "update success"
                    res.jsonp(response)
                }else{
                    response.data= "nothing update"
                    res.jsonp(response)
                }
        })
    }else{

        response.data="invalid token"
        res.jsonp(response)
    }
    // res.jsonp({token: token})


})

/**  create new user */
app.post('/new_user',function (req, res) {
    let data = {
        id: random_string(10),
        username: req.body.username,
        user_password: random_string(10),
    }
    let token = create_token(req.body.username, secret)
    Model.BlogUser.create({ id: data.id, token: token,  user_password: data.user_password, username: data.username }).then(result=>{
        console.log(result)
        let response = {
            token: token,
            data: "create user success"
        }
        res.jsonp(response)

    })

})

/** Create blog */
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

 /** Get blog */
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


/** Delete  blog*/
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

                Model.MiniBlog.destroy({where: {id: req.params.id}}).then(result=>{
                        let response = {data:""}
                        console.log(result)
                        if(result>0){
                            response.data= "delete success"
                            res.jsonp(response)
                        }else{
                            response.data= "delete fail"
                            res.jsonp(response)
                        }
                })


            }
        })
    }catch(err){
        res.status(500).jsonp({ error: 'invalid token' })
    }
})

/** Update blog */
app.post('/update', function (req, res) {
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
                    blog_owner: req.body.blog_owner,
                    card_name: req.body.card_name,
                    content: req.body.content,
                    category: req.body.category,
                    blog_status: req.body.blog_status,
                    id: req.body.id,
                }

                Model.MiniBlog.update({ blog_owner: data.blog_owner,  card_name: data.card_name, content: data.content, category: data.category, blog_status: data.blog_status },
                    {where: {id: data.id}}).then(result=>{
                        let response = {data:""}
                        if(result[0]>0){
                            response.data= "update success"
                            res.jsonp(response)
                        }else{
                            response.data= "nothing update"
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




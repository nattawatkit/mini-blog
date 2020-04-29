var express = require('express')
var jwt = require('jsonwebtoken');
var app = express()
app.use(express.json())
var mysql = require('mysql')
const port = 3000

var connection = mysql.createConnection({
    host: '',
    user: '',
    password: '',
    database: ''
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

/** Create */
app.post('/create', function (req, res) {
    // gerenrate token
    let token= jwt.sign({
        data: 'foobar'
    }, 'secret', { expiresIn: 60 * 60 });

    let data = {
        id: random_string(10),
        blog_owner: req.body.author,
        card_name: req.body.card_name,
        content: req.body.card_name,
        category: req.body.category,
        blog_status: req.body.blog_status
    }
    connection.query(`INSERT INTO mini_blog VALUES (${id},${blog_owner},${card_name},${content},${category},${blog_status}) `, function (err, rows, fields) {
        if (err) throw err
        console.log(rows)
        res.send('get: '+req.params.author)
        connection.end()
    })
})

 /** Get */
app.get('/update/:card_name', function (req, res) {

    // verify token
    // try {
    //     let verify=jwt.verify(token, 'dddd')
    // } catch(err) {
    //     console.log(err)
    // }
    // response { data: 'foobar', iat: 1588164395, exp: 1588167995 }

    connection.query(`select * from mini_blog where card_name=${req.params.card_name}`, function (err, rows, fields) {
        if (err) throw err
        console.log(rows)
        connection.end()
        res.send('get '+req.params.card_name)
    })

})


/** Delete new author */
app.get('/delete/:author', function (req, res) {

    connection.query(`DELETE FROM mini_blog where card_name=${req.params.card_name}`, function (err, rows, fields) {
        if (err) throw err
        console.log(rows)
        connection.end()
        res.send('delete')
    })
})

// /** Update new author */
app.post('/update/:author', function (req, res) {
    let data = {
        id: random_string(10),
        blog_owner: req.body.author,
        card_name: req.body.card_name,
        content: req.body.card_name,
        category: req.body.category,
        blog_status: req.body.blog_status
    }
    connection.query(`UPDATE mini_blog SET  blog_owner=${blog_owner},card_name=${card_name},content=${content},category=${category},blog_status=${blog_status}) WHERE id=${id} `, function (err, rows, fields) {
        if (err) throw err
        console.log(rows)
        res.send('update: '+req.params.author)
        connection.end()
    })

})
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))




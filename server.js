var express = require('express')
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser')
var mysql = require('mysql')

var app = express()
app.use(express.json());
const port = 3000

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

/** Create */
/**
 *Test Input
 {
    "blog_owner":"kwan",
    "card_name": "new card",
    "content": "test content",
    "category": "ads",
    "blog_status": "active"
}
 */
app.post('/create',function (req, res) {
    // gerenrate token

    let data = [
        random_string(10),
        req.body.blog_owner,
        req.body.card_name,
        req.body.card_name,
        req.body.category,
        req.body.blog_status
    ]


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
})

 /** Get */
app.get('/:card_name', function (req, res) {
    console.log(req.params.card_name)
    connection.query(`select * from mini_blog where card_name=?;`,[req.params.card_name], function (err, rows, fields) {
        if (err) {
            res.status(500).jsonp({ error: 'message' })
        }
        console.log(rows)
        let response = {
            token: "",
            data: rows
        }
        res.jsonp(response)
    })

})


/** Delete new author */
app.get('/delete/:id', function (req, res) {

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
})

// /** Update new author */
app.post('/update/', function (req, res) {
    let data = [
        req.body.blog_owner,
        req.body.card_name,
        req.body.content,
        req.body.category,
        req.body.blog_status,
        req.body.id,
    ]
    // console.log(data)

    console.log(`UPDATE mini_blog SET blog_owner=':blog_owner', card_name=':card_name', content=':content', category=':category', blog_status=':blog_status' WHERE id=':id'; `)

    connection.query(`UPDATE mini_blog SET blog_owner=?, card_name=?, content=?, category=?, blog_status=? WHERE id=?; `, data, function (err, rows, fields) {
        if (err) throw err
        console.log(rows)
        res.send('update success')
    })

})
app.listen(port)




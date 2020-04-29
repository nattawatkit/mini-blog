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

app.post('/post-test', (req, res) => {
    console.log('Got body:', req.body);
    res.sendStatus(200);
});

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

    let data = {
        id: random_string(10),
        blog_owner: req.body.blog_owner,
        card_name: req.body.card_name,
        content: req.body.card_name,
        category: req.body.category,
        blog_status: req.body.blog_status
    }


    connection.query(`INSERT INTO mini_blog VALUES ('${data.id}','${data.blog_owner}','${data.card_name}','${data.content}','${data.category}','${data.blog_status}');`, function (err, rows, fields) {
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
    connection.query(`select * from mini_blog where card_name='${req.params.card_name}';`, function (err, rows, fields) {
        if (err) {
            res.status(500).jsonp({ error: 'message' })
        }
        console.log(rows)
        let response = {
            token: "",
            data: "success"
        }
        res.jsonp(response)
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
app.listen(port)




var resolve = require('path').resolve;

var express = require('express');
var app = express();

app.use(express.logger());

// Get auth0-angular.js from the root directory
app.use('/auth0-angular.js', function (req, res) {
    res.sendfile(resolve(__dirname + '/../../../auth0-angular.js'));
});

app.use('/', express.static(__dirname + '/../client'));

var Auth0 = require('auth0').ManagementClient;
var extend = require('xtend');

var api = new Auth0({
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJmRzNTMVBsOUVXQjA4YnNPdk1KMTlOYkNhSzd0WFBrciIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbImNyZWF0ZSIsInJlYWQiLCJkZWxldGUiXX19LCJpYXQiOjE0NjQ0MzUyMjYsImp0aSI6ImQyNjJlYjY3YmE3MjAzOWEzYTA1MjgwY2U2ZjVhMzVlIn0.XIwEFX1bP9jVzIv7u1PRCbcQWfUA2-wVK7zKRS4eMqg',
    domain: 'tutorials.auth0.com'
});

var CONNECTION = 'Username-Password-Authentication';

app.use(express.bodyParser());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    //res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next();
});

app.use(express.bodyParser());

app.post('/custom-signup', function (req, res) {
    console.log("req.body: ", JSON.stringify(req.body));
    var data = extend(req.body, {connection: CONNECTION, email_verified: false});

    console.log("Data: ", JSON.stringify(data));

    api.createUser(data, function (err) {
        if (err) {
            console.log('Error creating user: ' + err);
            res.send(500, err);
            return;
        }

        res.send(200);

    });
});

app.get('/getUsers', function (req, res) {

   api.getUsers(
       {'per_page':req.query['per_page'],'page': req.query['page']},
       function (err, data) {
       if(err) {
           console.log('Error getting all users: ' + err);
           res.send(500, err);
           return;
       }

       res.send(200, data);
   });
});

app.get('/getUser', function (req, res) {

    api.getUser(
        {'id' : req.query['user_id']},
        function (err, data) {
            if(err) {
                console.log('Error getting user: ' + err);
                res.send(500, err);
                return;
            }

            res.send(200, data);
        });
});

app.get('/deleteUser', function (req, res) {

    api.deleteUser(
        {'id' : req.query['user_id']},
        function (err, data) {
            if(err) {
                console.log('Error getting user: ' + err);
                res.send(500, err);
                return;
            }

            res.send(200, data);
        });
});

app.listen(3001);
console.log('listening on port http://localhost:3001');

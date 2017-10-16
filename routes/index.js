var express = require('express');
var router = express.Router();
var path = require('path');
<<<<<<< HEAD
var sha1 = require('sha1');


=======
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('mongodb://jira:jira@ds115625.mlab.com:15625/jira');
>>>>>>> be0b4a86348f8f758204eaed95fc9a6de18f2408
/* GET home page. */
// router.get('/', function(req, res, next) {
//     // res.sendFile('login.htm', { root: path.join(__dirname, '../public/views/') });

// });



router.post('/login', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var users = db.get('users');
    users.find({ name: username, password: sha1(password) }, {}).then(function(data) {
        if (data.length > 0) {
            req.session.userId = data[0]._id;
            console.log('logg')
            res.json(data[0]._id);

        } else {
            res.json({ text: 'Invalid username or/and password !' })
        }
    })
});
router.post('/register', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var repeatPassword = req.body.repeatPassword;
    var email = req.body.email;
    var users = db.get('users');
    users.find({ $or: [{ name: username }, { email: email }] }).then(function(data) {
        if (data.length == 0) {
            users.insert({ name: username, password: sha1(password), email: email }).then(function(data) {
                res.json({ register: true })
            })
        } else {
            res.json({ text: 'Already taken username or/and email' })
        }
    })




});

router.get('/api/logged', function(req, res) {
    var user = {
        userId: ''
    };

    if (req.session.userId != undefined) {
        user.userId = req.session.userId;
    }

    res.json(JSON.stringify(user));
});

router.get('/logout', function(req, res) {
    // req.logout();
    req.session.destroy(function(err) {
        res.status(200).json({ message: 'Logout succes!' });
        console.log('sesion destroyed')
    });
});

router.post('/dashboard', function(req, res) {
    console.log('body req  ' + JSON.stringify(req.body.id))
    var userId = req.body.id;
    // var db = req.db;
    var projects = db.get('projects');
    projects.find({ users: { $elemMatch: { userId: userId } } }, {}).then(function(data) {
        console.log('data sajkhfkajsf ---' + JSON.stringify(data))
        res.json(data)
    })

});

router.get('/api/project/:projectId', function(req, res) {
    var projectId = req.params.projectId;
    var tasks = db.get('tasks');
    console.log('project id ' + projectId)
    tasks.find({ projectId: projectId }, {}).then(function(data) {
        res.json(data)
    })
});


router.get('/api/task/:taskId', function(req, res) {
    var taskId = req.params.taskId;
    console.log('task id ' + taskId)
    var tasks = db.get('tasks');

    tasks.find({ _id: taskId }, {}).then(function(data) {
        res.json(data)
    })
});
module.exports = router;
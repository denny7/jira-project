var express = require('express');
var router = express.Router();
var path = require('path');
var sha1 = require('sha1');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('mongodb://jira:jira@ds115625.mlab.com:15625/jira');
// --------------------------------------------------
router.post('/login', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var users = db.get('users');
    users.find({ name: username, password: sha1(password) }, {}).then(function(data) {
        if (data.length > 0) {
            req.session.userId = data[0]._id;
            res.json(data);

        } else {
            res.json({ text: 'Invalid username or/and password !' })
        }
    })
});
router.post('/register', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var fullName = req.body.username;
    var role = "Employee";
    var repeatPassword = req.body.repeatPassword;
    var email = req.body.email;
    var users = db.get('users');
    users.find({ $or: [{ name: username }, { email: email }] }).then(function(data) {
        if (data.length == 0) {
            users.insert({ name: username, password: sha1(password), email: email, fullName: fullName, role: role }).then(function(data) {
                res.json({ register: true })
            })
        } else {
            res.json({ text: 'Already taken username or/and email' })
        }
    })
});

router.get('/api/logged', function(req, res) {
    var user;
    if (req.session.userId != undefined) {
        var users = db.get('users');
        users.find({ _id: req.session.userId }, {}).then(function(data) {
            user = data[0];
            res.json(user);
        })
    }
})

router.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
            res.status(200).json({ message: "loged out" })
        })
        // req.session = null
});

router.post('/dashboard', function(req, res) {
    var userId = req.body._id;
    var projects = db.get('projects');
    projects.find({ users: { $elemMatch: { userId: userId } } }, {}).then(function(data) {
        res.json(data)
    })
});

router.get('/api/project/:projectId', function(req, res) {
    var izprati = [];
    var projectId = req.params.projectId;
    var tasks = db.get('tasks');
    var projects = db.get('projects')
    tasks.find({ projectId: projectId }, {}).then(function(data) {
        projects.find({ _id: projectId }, {}).then(function(pr) {
            izprati.push(data, pr);
            res.json(izprati)
        })
    })
});

router.get('/api/task/:taskId', function(req, res) {
    var taskId = req.params.taskId;
    var tasks = db.get('tasks');
    tasks.find({ _id: taskId }, {}).then(function(data) {
        res.json(data)
    })
});

router.post('/api/project/:projectId', function(req, res) {
    var projectId = req.params.projectId;
    var userId = req.body.userId;
    var taskName = req.body.taskName;
    var tasks = db.get('tasks');
    var task = {
        userId: userId,
        projectId: projectId,
        name: taskName,
        createDate: Date.now(),
        updateDate: Date.now(),
        priority: "Middle",
        priorityNumber: "2",
        assignee: "not assigned",
        description: "Click to add description",
        type: "task",
        progress: "To Do"
    }
    tasks.insert(task).then(function(data) {
        res.json({ createdTask: true })
    })
});
router.put('/api/task/:taskId', function(req, res) {
    var taskId = req.params.taskId;
    var tasks = db.get('tasks');
    tasks.update({ _id: taskId }, req.body).then(function(data) {
        res.json(data)
    })
});

router.put('/user/changePass', function(req, res) {
    var sendUser = req.body[0];
    var passwords = req.body[1];
    if (sendUser.password == sha1(passwords.old)) {
        var users = db.get('users');
        users.update({ _id: sendUser._id }, { $set: { password: sha1(passwords.new) } }).then(function(data) {
            res.json({ changedPass: true })
        })
    } else {
        res.json({ text: 'The old password is invalid !' })
    }
})

router.put('/user/changeData', function(req, res) {
    var sendUser = req.body[0];
    var data = req.body[1];
    var users = db.get('users');
    users.update({ _id: sendUser._id }, { $set: { fullName: data.fullName, email: data.email } }).then(function(data) {
        res.json({ changedData: true })
    })
})

router.get('/checkAccess', function(req, res) {

    })
    // router.put('/api/task/assign/:taskId', function(req, res) {
    //     var data = req.body;
    //     var taskId = req.params.taskId;
    //     var users = db.get("users");
    //     var projects = db.get("projects");
    //     // users.find({ fullName: data }, {}).then(function(res) {
    //     //     if (res.length > 0) {
    //     //         console.log("ress" + res)
    //     //         res.json({ message: "success" });
    //     //     } else {
    //     //         console.log("invalid")
    //     //         res.json({ message: "Invalid user" });
    //     //     }
    //     // })
    // })
module.exports = router;
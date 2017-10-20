var express = require('express');
var router = express.Router();
var path = require('path');
var sha1 = require('sha1');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('mongodb://jira:jira@ds115625.mlab.com:15625/jira');
var nodemailer = require('nodemailer');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var smtpTransport = require('nodemailer-smtp-transport');

var mailAccountUser = 'projejct.JIRA@gmail.com'
var mailAccountPassword = 'qg7yWFPq'

var fromEmailAddress = 'project.JIRA@gmail.com'

var transport = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        rejectUnauthorized: false,
        auth: {
            user: mailAccountUser,
            pass: mailAccountPassword
        }
    }))
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
<<<<<<< HEAD
            users.insert({ name: username, password: sha1(password), email: email, fullName: fullName, role: role }).then(function(data) {
=======
            var mail = {
                from: fromEmailAddress,
                to: email,
                subject: "WELCOME to JIRA",
                text: `Hello ${username}, 
                        This is your password - ${password} , please keep it in safe!!`,
            }
            transport.sendMail(mail, function(error, response) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Message sent: " + response.message);
                }
                transport.close();
            });
            users.find({ role: 'Admin' }, {}).then(function(data) {
                data.forEach(admin => {
                    var mailToAdmin = {
                        from: fromEmailAddress,
                        to: admin.email,
                        subject: "New user registration",
                        text: `Hello ${admin.fullName}, 
                               We have a new user in out system - ${username} ,
                                if you know him please add him to some projects !`,
                    }
                    transport.sendMail(mailToAdmin, function(error, response) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log("Message sent: " + response.message);
                        }
                        transport.close();
                    });
                })
            })
            users.insert({ name: username, password: sha1(password), email: email }).then(function(data) {
>>>>>>> fa80a1362f88a95316d01602d595d413a6f7cf09
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
    var user = req.body;
    var projects;
    if (user.role == 'Admin') {
        projects = db.get('projects');
        projects.find({}, {}).then(function(data) {
            res.json(data)
        })
    } else {
        projects = db.get('projects');
        projects.find({ users: { $elemMatch: { userId: user._id } } }, {}).then(function(data) {
            res.json(data)
        })
    }
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
        priorityNumber: 2,
        assignee: "not assigned",
        description: "Click to add description",
        type: "task",
        progress: "To Do",
        comments: []
    }
    tasks.insert(task).then(function(data) {
        res.json({ createdTask: true })
    })
});
router.put('/api/task/:taskId', function(req, res) {
    var taskId = req.params.taskId;
    var task = req.body;
    task.priority == 'Middle' ? task.priorityNumber = 2 : task.priority == 'High' ? task.priorityNumber = 1 : task.priorityNumber = 3;
    var tasks = db.get('tasks');
    tasks.update({ _id: taskId }, task).then(function(data) {
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

router.post('/createProject', function(req, res) {
    var newProject = req.body;
    var projects = db.get('projects');
    projects.insert(newProject).then(function(data) {
        res.json({ text: 'You successfully add new Project!' })
    })
})


router.put('/api/task/assign/:taskId', function(req, res) {
    var data = req.body;
    var taskId = req.params.taskId;
    var users = db.get("users");
    var projects = db.get("projects");
    console.log(data)
    users.find({ fullName: data.fullName }, {}).then(function(userInput) {
        if (userInput.length > 0) {
            var id = String(userInput[0]._id);
            console.log(id)
            projects.find({ users: { $elemMatch: { userId: id } } }, {}).then(function(project) {
                console.log(project)
                if (project.length > 0) {
                    res.json({ success: true })
                } else {
                    res.json({ message: "There is not such user in this project" })
                }
            })

        } else {

            res.json({ message: "Invalid user" });
        }
    })
})
router.get('/api/project/people/:projectId', function(req, res) {
    var projectId = req.params.projectId;
    var projects = db.get('projects');
    projects.find({ _id: projectId }, { users: 1 }).then(function(data) {
        var peopleIds = [];
        data[0].users.map(man => {
            peopleIds.push(man.userId)
        })
        var users = db.get('users')
        users.find({ _id: { $in: peopleIds } }, {}).then(function(data) {
            console.log(data)
            res.json(data)

        })
    })
})
router.put('/api/project/addUser/:projectId', function(req, res) {
    var projectId = req.params.projectId;
    var newUserName = req.body.name;

    var users = db.get('users');
    users.find({ fullName: newUserName }, {}).then(function(userData) {
        if (userData.length > 0) {
            var id = userData[0]._id;
            var id = String(id);
            var projects = db.get('projects');
            projects.update({ _id: projectId }, { $push: { users: { userId: id } } }).then(function(projectData) {
                res.json({ message: 'success' })
            })
        } else {
            res.json({ text: 'User with this name dont exist' })
        }
    })
})

router.put('/api/project/removeUser/:projectId', function(req, res) {
    var projectId = req.params.projectId;
    var projects = db.get('projects');
    projects.update({ _id: projectId }, { $pull: { users: { userId: req.body.id } } }).then(function(data) {

        res.json({ message: 'seccess' })
    })
})

router.put('/api/project/removeTask', function(req, res) {
    var taskId = req.body.id;
    var tasks = db.get('tasks');
    tasks.remove({ _id: taskId }, {}).then(function(data) {
        console.log(data)
        res.json({ message: 'seccess' })
    })
})
router.put('/api/task/comment/:taskId', function(req, res) {
    var taskId = req.params.taskId;
    var tasks = db.get("tasks");
    var info = req.body;
    tasks.update({ _id: taskId }, { $push: { comments: { info } } }).then(function(result) {
        console.log(result)
    })
})
router.put('/api/task/deleteComment/:taskId', function(req, res) {
    var taskId = req.params.taskId;
    var commentToDelete = String(req.body.id)
    console.log(req.body);
    // tasks.update({ _id: taskId }, { $pull: { comments: { info: { date: commentToDelete } } } }).then(function(result) {
    //     console.log(result)
    // })

<<<<<<< HEAD
});
=======
router.put('/api/project/removeProject', function(req, res) {
    var projectId = String(req.body._id);
    var projects = db.get('projects');
    projects.remove({ _id: projectId }, {}).then(function(data) {
        var tasks = db.get('tasks');
        tasks.remove({ projectId: projectId }, {}).then(function(r) {
            res.json({ message: 'seccess' })
        })
    })
})
>>>>>>> fa80a1362f88a95316d01602d595d413a6f7cf09
module.exports = router;
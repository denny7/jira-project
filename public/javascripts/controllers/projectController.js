angular.module('homeApp')
    .controller('ProjectCtrl', ['$scope', '$anchorScroll', '$route', '$rootScope', '$routeParams', '$location', 'Main', 'Project', '$window', 'Users', function($scope, $anchorScroll, $route, $rootScope, $routeParams, $location, Main, Project, $window, Users) {
        //Events
        $(".logoutHolder").on("mouseover", function() {
            $(".logOutText").show();
        })
        $(".logoutHolder").on("mouseleave", function() {
            $(".logOutText").hide();
        })
        $("footer").hide()

        var projectId = $routeParams.projectId;
        $rootScope.projectId = $routeParams.projectId
        $scope.projectSend = true;
        $scope.user = $rootScope.user;
        $scope.user.id = $rootScope.user._id;
        $scope.newUser = {};
        $scope.taskName = "";
        $scope.project;
        $scope.seachTask = '';
        $scope.searchPeople = '';
        $scope.removeUser = function(event) {
            var userId = {};
            userId.id = event.target.id;
            Project.removeUser(projectId, userId).then(function(res) {
                $route.reload();
            })
        }
        $scope.removeProjectFunc = function() {
            if (confirm(`WARNING !!!
                    YOU WILL DELETE THE PROJECT AND ALL ISSUES IN IT !!
                    ARE YOU SURE ?`)) {
                Project.removeProject($scope.project).then(function(res) {
                    $location.path('/dashboard');
                })
            }
        }
        $scope.removeTask = function(event) {
            var taskId = {};
            taskId.id = event.target.id;
            if (confirm('Are you sure that you want to delete this issue?')) {
                Project.removeTask(taskId).then(function(res) {
                    $route.reload();
                })
            }
        }
        $scope.newMailModal = function(email) {
            if ($scope.user.email != email) {
                $scope.newMail = { to: email };
                $('#createeMail').modal();
            }
        }
        $scope.sentNewMailTo = function() {
            if ($scope.newMail.text.length > 0) {
                $scope.newMail.from = $scope.user.email;
                Users.sendMail($scope.newMail).then(function(res) {
                    if (!res.data.message) {
                        $scope.mailTextT = 'The mail was sended !'
                        $('#sendedMailTP').removeClass().addClass('text-success');
                        $scope.mailText = {};
                    } else {
                        $scope.mailTextT = res.data.message;
                        $('#sendedMailTP').removeClass().addClass('text-danger');
                    }
                })
            }
        }
        $scope.peopleFunc = function() {
            Project.getAllUsers(projectId).then(function(res) {
                $scope.people = res.data;
            })
        }
        Project.getTasks(projectId).then(function(res) {
            $scope.projectSend = false;
            $rootScope.projectId = $routeParams.projectId;
            $scope.tasks = res.data[0];
            $scope.project = res.data[1][0]
            $scope.peopleFunc()
            if (document.getElementById("chart")) {
                var toDo = $scope.tasks.filter(task => task.progress == 'To Do');
                var inProgress = $scope.tasks.filter(task => task.progress == 'In Progress');
                var done = $scope.tasks.filter(task => task.progress == 'Done');
                var donutData = [toDo.length, inProgress.length, done.length]
                var tTaks = $scope.tasks.filter(task => task.type == 'task');
                var bug = $scope.tasks.filter(task => task.type == 'bug');
                var epic = $scope.tasks.filter(task => task.type == 'epic');
                var story = $scope.tasks.filter(task => task.type == 'story');
                var barData = [tTaks.length, bug.length, epic.length, story.length];
                var ctx = document.getElementById("chart").getContext("2d");
                var ct = document.getElementById("otherChart").getContext("2d");
                var chart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: ["To Do", "In Progress", "Done"],
                        datasets: [{
                            backgroundColor: ['rgb(248, 110, 81)', 'rgb(146, 192, 31)', 'rgb(69, 180, 226)'],
                            data: donutData,
                        }]
                    },
                    options: {
                        // responsive: false,
                        // maintainAspectRatio: false
                    }
                });
                var otherChart = new Chart(ct, {
                    type: 'bar',
                    data: {
                        labels: ["Task", "Bug", "Epic", "Story"],
                        datasets: [{
                            backgroundColor: ['rgb(146, 192, 31)', 'rgb(248, 110, 81)', 'rgb(69, 180, 226)', 'rgb(252, 176, 64)'],
                            data: barData
                        }]
                    },
                    options: {
                        legend: {
                            display: false,
                        }
                    }
                });
            }
        })
        $scope.createTaskF = function(event) {
            if ($scope.taskName.length >= 3) {

                var projectId = event.target.id;
                var data = {
                    userId: $scope.user.id,
                    userFullName: $scope.user.fullName,
                    taskName: $scope.taskName,
                    description: "<p>Click to add description</p>"
                }
                Project.createTask(projectId, data).then(function(res) {
                    $scope.tasks.push(res.data);
                    $scope.taskName = '';
                    $route.reload();
                })
            }
        }
        $scope.addPeople = function() {
            $('#addPeople').modal();
        }
        $scope.addNewUserF = function() {
            Project.addUser($scope.project._id, $scope.newUser).then(function(res) {
                if (!res.data.text) {
                    $scope.user = res.data;
                    $('#addUserT').removeClass().addClass('text-success')
                    $scope.addUserText = 'You successfully add this user!';
                } else {
                    $('#addUserT').removeClass().addClass('text-danger')
                    $scope.addUserText = res.data.text;
                }
            })
        }
        $scope.sorting = '';
        $scope.sortByName = function() {
            if ($scope.sorting == 'name')
                $scope.sorting = '-name'
            else
                $scope.sorting = 'name'
        }
        $scope.sortByPriority = function() {
            if ($scope.sorting == 'priorityNumber')
                $scope.sorting = '-priorityNumber'
            else
                $scope.sorting = 'priorityNumber'
        }
        $scope.sortByType = function() {
            if ($scope.sorting == 'type')
                $scope.sorting = '-type'
            else
                $scope.sorting = 'type'
        }
        $scope.showMine = function() {
            $scope.seachTask = $rootScope.user.fullName
        }
        $scope.toTopProjectPage = function() {
            $anchorScroll('');
        }
    }])
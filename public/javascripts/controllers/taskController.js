angular.module('homeApp')
    .controller('TaskCtrl', ['$scope', '$http', '$routeParams', '$location', 'Main', 'Task', 'Project', '$route', function($scope, $http, $routeParams, $location, Main, Task, Project, $route) {
        $("footer").hide()
        $(".desctriptionChange").on("mouseover", function() {
            $(".pencilDescription").show()
        })
        $(".desctriptionChange").on("mouseout", function() {
            $(".pencilDescription").hide()
        })
        $(".desctriptionChange").on("click", function() {
            $(".descriptionArea").show()
        })
        $(".descriptionArea").on("focusout", function() {
            $(".descriptionArea").hide();
            $scope.updateTask();
        })
        $(".taskNameP").on("mouseover", function() {
            $(".pencilName").show()
        })
        $(".pencilName").hide()
        $(".taskNameP").on("mouseout", function() {
            $(".pencilName").hide()
        })
        $(".taskNameP").on("click", function() {
            $(".nameEdit").show()
        })
        $(".nameEdit").on("focusout", function() {
            $(".nameEdit").hide();
            $scope.updateTask();
        })
        $(".checkAssign").on("click", function() {
            $scope.assignTo()
        })
        $scope.progressToDo = function() {
            $scope.task.progress = 'To do';
            $scope.updateTask();
        }
        $scope.progressInProgress = function() {
            $scope.task.progress = 'In Progress';
            $scope.updateTask();
        }
        $scope.progressDone = function() {
            $scope.task.progress = 'Done';
            $scope.updateTask();
        }
        $scope.assignToMeF = function() {
            $scope.task.assignee = $scope.user.fullName;
            $scope.updateTask();
        }
        $(".assignToDiv").hide()
        $scope.assignToF = function() {
            $(".assignToDiv").show()
        }

        $scope.inputValue = '';

        $scope.assignTo = function() {
            var objToSend = {
                projectId: $scope.projectId,
                fullName: $scope.inputValue
            }
            Task.assignToUser($scope.taskId, objToSend).then(function(req, res) {
                console.log(req)
                if (!req.data.message) {
                    $scope.task.assignee = $scope.inputValue;
                    $scope.updateTask();
                    $scope.errMsg = "";
                    $(".assignToDiv").hide()
                } else {
                    $scope.errMsg = req.data.message
                }
            })
        }
        $scope.task = "";
        $scope.user = {};
        $scope.taskId = $routeParams.taskId;
        console.log('task id ' + JSON.stringify($scope.taskId))

        Main.getLoggedUserId().then(function(res) {
            $scope.user = res.data;
        })
        Task.getTaskInfo($scope.taskId).then(function(res) {
            $scope.task = res.data[0];
            $scope.dateCr = new Date(Number($scope.task.createDate));
            $scope.minuteCr = $scope.dateCr.getMinutes();
            $scope.hourCr = $scope.dateCr.getHours();
            $scope.dayCr = $scope.dateCr.getDate();
            $scope.monthCr = $scope.dateCr.getMonth() + 1;
            $scope.yearCr = $scope.dateCr.getFullYear();
            $scope.createDate = $scope.dayCr + "." + $scope.monthCr + "." + $scope.yearCr + " " + $scope.hourCr + ":" + $scope.minuteCr
            $scope.dateUp = new Date(Number($scope.task.updateDate));
            $scope.minuteUp = $scope.dateUp.getMinutes();
            $scope.hourUp = $scope.dateUp.getHours();
            $scope.dayUp = $scope.dateUp.getDate();
            $scope.monthUp = $scope.dateUp.getMonth() + 1;
            $scope.yearUp = $scope.dateUp.getFullYear();
            $scope.updateDate = $scope.dayUp + "." + $scope.monthUp + "." + $scope.yearUp + " " + $scope.hourUp + ":" + $scope.minuteUp
        }).catch(function(err) {
            console.log(err.status)
        })
        $scope.updateTask = function() {
            $scope.task.updateDate = Date.now()
            Task.updateTaskInfo($scope.taskId, $scope.task).then(function(res, req) {})
        }
        $scope.commentText = '';
        $scope.addCommentTask = function() {
            var comment = {};
            comment.userFullName = $scope.user.fullName
            comment.date = Date.now();
            comment.commentText = $scope.commentText;
            if (comment.commentText.length > 0) {
                Task.addComment($scope.taskId, comment).then(function(req, res) {});
                $route.reload();
            }
        }
        $scope.deleteComment = function($event) {
            console.log("da vidim id" + $event.currentTarget.id);
            console.log($scope.taskId)
            var commentId = {
                    id: $event.currentTarget.id
                }
                // console.log(commentId)
                //  send object
            Task.deleteComment($scope.taskId, commentId).then(function(req, res) {})
        }

        $scope.createTaskF = function() {
            var data = {
                userId: $scope.user.id,
                taskName: $scope.taskName
            }
            Project.createTask(projectId, data).then(function(res) {
                $scope.tasks.push(res.data);
                console.log(res.data)
                $route.reload();
            })
        }

    }])
angular.module('homeApp')
    .controller('TaskCtrl', ['$scope', '$rootScope', '$anchorScroll', '$routeParams', '$location', 'Main', 'Task', 'Project', '$route', '$timeout', '$window', function($scope, $rootScope, $anchorScroll, $routeParams, $location, Main, Task, Project, $route, $timeout, $window) {

        $(".logoutHolder").on("mouseover", function() {
            $(".logOutText").show();
        })
        $(".logoutHolder").on("mouseleave", function() {
            $(".logOutText").hide();
        })
        $("footer").hide()
        $(".pencilDescription").hide()
        $(".desctriptionChange").on("mouseover", function() {
            $(".pencilDescription").show()
        })
        $(".desctriptionChange").on("mouseout", function() {
            $(".pencilDescription").hide()
        })
        $(".desctriptionChange").on("click", function() {
            $(".descriptionArea").show();
            $(".desctriptionChange").hide()
        })
        $(".descriptionArea").on("focusout", function() {
            $(".descriptionArea").hide();
            $(".desctriptionChange").show()
            $scope.updateTask();
        })
        $(".descriptionArea").on("keydown", function(event) {
            if (event.keyCode == 13) {
                event.preventDefault()
                $(".descriptionArea").hide();
                $(".desctriptionChange").show()
                $scope.updateTask();
            }
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
        $(".addComment").hide();
        $(".addCommentBtn").on("click", function() {
            $(".addComment").show();
            $(".addCommentBtn").hide()
        })
        $(".commentArea").on("keydown", function(event) {
            if (event.keyCode == 13) {
                event.preventDefault();
                $(".addCommentBtn").show();
                $(".commentArea").hide()
                $(".pressCommentBtn").hide()
                $scope.addCommentTask()

            }
        })
        $(".assignToInput").on("keydown", function(event) {
            if (event.keyCode == 13) {
                event.preventDefault();
                $scope.assignTo();
            }
        })

        $scope.progressToDo = function() {
            $scope.task.progress = 'To do';
            $(".progressToDo").addClass("btn-blue")
            $(".progressInProgress").removeClass("btn-blue")
            $(".progressDone").removeClass("btn-blue")
            $scope.updateTask();
        }
        $scope.progressInProgress = function() {
            $scope.task.progress = 'In Progress';
            $(".progressToDo").removeClass("btn-blue")
            $(".progressInProgress").addClass("btn-blue")
            $(".progressDone").removeClass("btn-blue")
            $scope.updateTask();
        }
        $scope.progressDone = function() {
            $scope.task.progress = 'Done';
            $(".progressToDo").removeClass("btn-blue")
            $(".progressInProgress").removeClass("btn-blue")
            $(".progressDone").addClass("btn-blue")
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
        $scope.commentSend = true;
        // console.log("projectIdinTask " + $rootScope.project._id)

        $scope.assignTo = function() {
            var objToSend = {
                projectId: $rootScope.projectId,
                fullName: $scope.inputValue
            }
            console.log(objToSend)
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
        $scope.options = {
            language: 'en',
            allowedContent: true,
            entities: false,

        };
        $scope.task = "";
        $scope.user = $rootScope.user;
        // if (!$rootScope.user) {
        //     $scope.user = JSON.parse($window.localStorage.getItem("current user"))
        //     $rootScope.user = JSON.parse($window.localStorage.getItem("current user"))
        // }
        $scope.user.id = $rootScope.user._id;
        $scope.taskId = $routeParams.taskId;
        console.log('task id ' + JSON.stringify($scope.taskId))

        // Main.getLoggedUserId().then(function(res) {
        //     $scope.user = res.data;
        // })
        Task.getTaskInfo($scope.taskId).then(function(res) {
            $scope.task = res.data[0];
            if ($scope.task.comments.length == 0) {
                $scope.commentSend = false;

            }
            // pagination comments
            Task.getComments($scope.taskId).then(function(res) {
                console.log(res)
                $scope.comments = (res.data).reverse()
                $scope.comments.forEach(function(comment) {
                    var today = new Date()
                    var dateCom = new Date(Number(comment.date));
                    var minuteCom = dateCom.getMinutes();
                    var hourCom = dateCom.getHours();
                    var dayCom = dateCom.getDate();
                    var monthCom = dateCom.getMonth() + 1;
                    var yearCom = dateCom.getFullYear().toString().substring(2, 4)
                    if (dayCom == today.getDate() && today.getMonth() + 1 == monthCom) {
                        if (minuteCom < 10) {
                            minuteCom = "0" + minuteCom;
                        }
                        var differnceTime = today.getHours() - hourCom;
                        var differnceTimeMinutes = today.getMinutes() - minuteCom;
                        if (differnceTime < 2) {
                            if ((today.getMinutes() + 60 - minuteCom) < 60 && differnceTime == 1) {
                                comment.createDateCom = today.getMinutes() + 60 - minuteCom + " minutes ago";

                            } else {
                                if ((today.getMinutes() - minuteCom) < 60 && differnceTime == 0) {
                                    comment.createDateCom = today.getMinutes() - minuteCom + " minutes ago";

                                } else {
                                    comment.createDateCom = hourCom + ":" + minuteCom;
                                }
                            }

                            if (differnceTimeMinutes == 0 && differnceTime == 0) {
                                comment.createDateCom = "Just now";
                            }
                        } else {
                            comment.createDateCom = hourCom + ":" + minuteCom;
                        }
                    } else {
                        if (dayCom < 10) {
                            dayCom = "0" + dayCom;
                        }
                        comment.createDateCom = dayCom + "." + monthCom + "." + yearCom;
                    }
                })

                // pagination comments
                $scope.filteredComments = [], $scope.currentPage = 1, $scope.numPerPage = 5, $scope.maxSize = 5;
                $scope.numPages = function() {
                    return Math.ceil($scope.comments.length / $scope.numPerPage);
                };
                $scope.$watch('currentPage + numPerPage', function() {
                    var begin = (($scope.currentPage - 1) * $scope.numPerPage),
                        end = begin + $scope.numPerPage;

                    $scope.filteredComments = $scope.comments.slice(begin, end);
                });
                $scope.commentSend = false;
                $(".commentPagination > ul").addClass("pagination")

            });
            var dateCr = new Date(Number($scope.task.createDate));
            var minuteCr = dateCr.getMinutes();
            if (minuteCr < 10) {
                minuteCr = "0" + minuteCr;
            }
            var hourCr = dateCr.getHours();
            var dayCr = dateCr.getDate();
            var monthCr = dateCr.getMonth() + 1;
            var yearCr = dateCr.getFullYear();
            $scope.createDate = dayCr + "." + monthCr + "." + yearCr + " " + hourCr + ":" + minuteCr
            var dateUp = new Date(Number($scope.task.updateDate));
            var minuteUp = dateUp.getMinutes();
            if (minuteUp < 10) {
                minuteUp = "0" + minuteUp;
            }
            var hourUp = dateUp.getHours();
            var dayUp = dateUp.getDate();
            var monthUp = dateUp.getMonth() + 1;
            var yearUp = dateUp.getFullYear();
            $scope.updateDate = dayUp + "." + monthUp + "." + yearUp + " " + hourUp + ":" + minuteUp;
            // CKEDITOR.replace('taskArea');
        }).catch(function(err) {
            console.log(err.status)
        })
        $scope.updateTask = function() {
            $scope.task.updateDate = Date.now();
            Task.updateTaskInfo($scope.taskId, $scope.task).then(function(res, req) {
                console.log('updated')
            })
        }
        $scope.commentText = '';
        $scope.addCommentTask = function() {
            var comment = {};
            comment.userId = $scope.user._id;
            comment.date = Date.now();
            comment.commentText = $scope.commentText;
            console.log(comment)
            if (comment.commentText.length > 0) {
                Task.addComment($scope.taskId, comment).then(function(req, res) {});
                $scope.comment = comment;
                $(".addComment").hide();
                $(".addCommentBtn").show();
                $route.reload();
                console.log("reloaded")

            }

        }
        $scope.deleteComment = function($event) {
            var commentId = {}
            commentId.id = $event.currentTarget.id
            Task.deleteComment($scope.taskId, commentId).then(function(res) {
                $route.reload();
            })
        }

        $scope.createTaskF = function() {
                var projectId = event.target.id;
                var data = {
                    userId: $scope.user.id,
                    userFullName: $scope.user.fullName,
                    taskName: $scope.taskName,
                }
                console.log($rootScope.projectId)
                Project.createTask(projectId, data).then(function(res) {
                    $scope.tasks.push(res.data);
                    console.log(res.data)
                    $scope.taskName = '';
                    $route.reload();
                })
            }
            // Project.getTasks($scope.projectId).then(function(res) {
            //     console.log("resss data")
            //     console.log(res.data)
            //     $scope.projectt = res.data[1][0];
            //     $rootScope.project = res.data[1][0];
            // })
        $scope.toTopProjectPage = function() {
            $anchorScroll('');
        }

    }])
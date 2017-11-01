angular.module('homeApp')
    .controller('TaskCtrl', ['$scope', '$rootScope', '$http', '$routeParams', '$location', 'Main', 'Task', 'Project', '$route', '$timeout', '$window', function($scope, $rootScope, $http, $routeParams, $location, Main, Task, Project, $route, $timeout, $window) {
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
        $(".addComment").hide();
        $(".addCommentBtn").on("click", function() {
            $(".addComment").show();
            $(".addCommentBtn").hide()
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
            $scope.comments = res.data[0].comments.reverse()
            console.log(124214)
            console.log($scope.comments)
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

            $scope.dateCr = new Date(Number($scope.task.createDate));
            $scope.minuteCr = $scope.dateCr.getMinutes();
            if ($scope.minuteCr < 10) {
                $scope.minuteCr = "0" + $scope.minuteCr;
            }
            $scope.hourCr = $scope.dateCr.getHours();
            $scope.dayCr = $scope.dateCr.getDate();
            $scope.monthCr = $scope.dateCr.getMonth() + 1;
            $scope.yearCr = $scope.dateCr.getFullYear();
            $scope.createDate = $scope.dayCr + "." + $scope.monthCr + "." + $scope.yearCr + " " + $scope.hourCr + ":" + $scope.minuteCr
            $scope.dateUp = new Date(Number($scope.task.updateDate));
            $scope.minuteUp = $scope.dateUp.getMinutes();
            if ($scope.minuteUp < 10) {
                $scope.minuteUp = "0" + $scope.minuteUp;
            }
            $scope.hourUp = $scope.dateUp.getHours();
            $scope.dayUp = $scope.dateUp.getDate();
            $scope.monthUp = $scope.dateUp.getMonth() + 1;
            $scope.yearUp = $scope.dateUp.getFullYear();
            $scope.updateDate = $scope.dayUp + "." + $scope.monthUp + "." + $scope.yearUp + " " + $scope.hourUp + ":" + $scope.minuteUp
            $timeout(function() {
                $("div.commentPagination  ul").addClass("pagination");
                $scope.commentSend = false;
            })

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
            comment.userId = $scope.user._id;
            comment.date = Date.now();
            comment.commentText = $scope.commentText;
            console.log(comment)
            if (comment.commentText.length > 0) {
                Task.addComment($scope.taskId, comment).then(function(req, res) {});
                $scope.comment = comment;
                $scope.dateCom = new Date(Number($scope.comment.date));
                $scope.minuteCom = $scope.dateCom.getMinutes();
                if ($scope.minuteCom < 10) {
                    $scope.minuteCom = "0" + $scope.minuteCom;
                }
                $scope.hourCom = $scope.dateCom.getHours();
                $scope.dayCom = $scope.dateCom.getDate();
                $scope.monthCom = $scope.dateCom.getMonth() + 1;
                $scope.yearCom = $scope.dateCom.getFullYear();
                $scope.comment.createDateCom = $scope.dayCom + "." + $scope.monthCom + "." + $scope.yearCom + " " + $scope.hourCom + ":" + $scope.minuteCom
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
                taskName: $scope.taskName
            }
            console.log($rootScope.projectId)
            Project.createTask(projectId, data).then(function(res) {
                $scope.tasks.push(res.data);
                console.log(res.data)
                $scope.taskName = '';
                $route.reload();
            })
        }
        console.log("----------" + $scope.taskId)
            // Task.getComments($scope.taskId).then(function(res) {
            //     $scope.commentSend = false;
            //     console.log(res)
            //     $scope.comments = (res.data).reverse()
            //         // pagination comments
            //     $scope.filteredComments = [], $scope.currentPage = 1, $scope.numPerPage = 5, $scope.maxSize = 5;
            //     $scope.numPages = function() {
            //         return Math.ceil($scope.comments.length / $scope.numPerPage);
            //     };
            //     $scope.$watch('currentPage + numPerPage', function() {
            //         var begin = (($scope.currentPage - 1) * $scope.numPerPage),
            //             end = begin + $scope.numPerPage;

        //         $scope.filteredComments = $scope.comments.slice(begin, end);
        //     });
        //     $(".commentPagination > ul").addClass("pagination")

        // });


    }])
// initialisation de l'application avec le module Ngroute
var webApp = angular.module('webApplication', ['ngRoute','mainController']);
// creation d'un service pour partgaer les données utilisateur lorsqu'il est connecté
webApp.factory('userDataFactory',['$location', function($location) {
    var data = {
        id: '',
        surName: '',
        firstName: '',
        userMail: '',
        userPwd: '',
        isAuth: false
    };
    return {
        getUserData: function () {
            return data;
        },
        setAuthUser: function (userObj) {
            data = userObj;
            console.log('logged in !');
            $location.path("/dashboard");
        },
        logUserOut: function (userObj) {
            console.log("logged out !");
            $location.path("/home");
            data.isAuth = false;
        }
    }
}]);
// url de l'api
const baseUrl = 'http://localhost:3000';
//déclaration d'un controller principal
var mainController = angular.module('mainController',[]);
// déclarations de controllers pour le Login, l'inscription, et le dashboard
mainController.controller('loginController', ['$scope','$http','userDataFactory', function ($scope,$http,userDataFactory) {
    $scope.user = {
        userMail:'y@corp.com',
        userPwd:'aA0$101012'
    };
    $scope.msg = "";
    $scope.notAuth = "";
    $scope.auth = function () {
        const req = {
            method: 'POST',
            url: baseUrl+'/auth',
            data: $scope.user,
        };
        $http(req)
            .then(function success(response) {
                console.log('resp', response);
                if(response.status === 200 && response.data.id !== "") {
                    userDataFactory.setAuthUser(response.data);
                    console.log("then",userDataFactory.getUserData());
                } else {
                    $scope.msg = 'Your credentials are incorrect, please try again';
                }
            }, function error(response) {
                console.log('error', response);
            });
    };
}]);

mainController.controller('registerController', ['$scope','$http', function ($scope,$http) {
    $scope.strongPwd = /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%#&_])([-+!*$@%#_\w]{8,})/;
    $scope.user = {};
    $scope.msg = "";
    $scope.invalidPwd = "";
    $scope.registerUser = function () {
        if ($scope.registerForm.pwdInput.$valid){
            $scope.invalidPwd ="";
            const req = {
                method: 'POST',
                url: baseUrl + '/register',
                data: $scope.user,
            };
            $http(req)
                .then(function success(response) {
                    console.log('resp', response);
                    $scope.msg = response.data.msg;
                }, function error(response) {
                    console.log('error', response);
                });
        } else {
            $scope.invalidPwd = "Your password is weak!: it must be at least of size 8 and include upper and lower case letters, numbers and special characters";
        }
    };
}]);

mainController.controller('dashController', ['$http','$scope','userDataFactory',function ($http,$scope,userDataFactory) {
    $scope.errSubmit = "";
    $scope.noMission = true;
    const v = userDataFactory.getUserData();
    $scope.opOptions = [{name:"Credit",id:0},{name:"Fee",id:1}];
    $scope.values = v;
    $scope.op = {
        selectedOpt: "",
        today: new Date(),
        label: "",
        amount: 0
    };
    const mailData = { mail: v.userMail };
    const request = {
        method: 'POST',
        url: baseUrl + '/missions',
        data: mailData,
    };
    $http(request)
        .then(function success(response) {
            console.log('mission = ', response);
            if(response.status === 200 && response.data._id !== "") {
                $scope.noMission = false;
                $scope.mission = response.data;
                $scope.balance = calculateBalance(response.data.budget,$scope.mission.operations)
            } else if (response.status === 204) {
                $scope.noMission = true;
                $scope.noMissionMsg = 'vous navez pas encore de missions !';
            } else {
                $scope.noMission = true;
                $scope.noMissionMsg = 'Could not retrieve data';
            }
        }, function error(response) {
            console.log('error', response);
        });
    $scope.deleteOp = function (index) {
        console.log("suppr",index, $scope.mission.operations[index]);
        const deleteReq = {
            method: 'POST',
            url: baseUrl + '/deleteOps',
            data: $scope.mission.operations[index],
        };
        $http(deleteReq)
            .then(function success(response,index) {
                //$scope.mission.operations.splice(index,1);
                console.log("after delete",response.data.msg.operations);
                $scope.mission = response.data.msg;
                $scope.balance = calculateBalance(response.data.msg.budget,$scope.mission.operations);
            }, function error(response) {
                console.log('error', response);
            });
    };
    $scope.submitNewOp = function () {
        if ($scope.op.selectedOpt.name === "" || $scope.op.label ==="" ||$scope.op.amount === 0) {
            $scope.errSubmit = "please fill all the fields before submiting";
            return
        }
        $scope.errSubmit = "";
        const dataToSend = {
            opType: $scope.op.selectedOpt.name,
            date: $scope.op.today.toLocaleString('fr-FR'),
            label: $scope.op.label,
            amount: $scope.op.amount,
            missionName: $scope.mission.name
        };
        console.log("to send",dataToSend);
        const request = {
            method: 'POST',
            url: baseUrl + '/createOps',
            data: dataToSend,
        };
        $http(request)
            .then(function success(response) {
                console.log("gotback",response.data.msg);
                $scope.mission = response.data.msg;
                $scope.balance = calculateBalance(response.data.msg.budget,$scope.mission.operations);
            }, function error(response) {
                console.log('error', response);
            });
    }
}]);

// Utilisation du module NGRoute pour le routage des urls de l'application
webApp.config(['$routeProvider',function ($routeProvider) {
    $routeProvider
        .when('/', {
            redirectTo:'/home'
        })
        .when('/home', {
            templateUrl: '/pages/login.html',
            controller: 'loginController',
            protected: false
        })
        .when('/register', {
            templateUrl: '/pages/register.html',
            controller: 'registerController',
            protected: false
        })
        .when('/dashboard', {
            templateUrl: '/pages/dashboard.html',
            controller: 'dashController',
            protected: true

        })
        .when('/error', {
            templateUrl: '/pages/notFound.html',
            protected: false
        })
        .otherwise({
        redirectTo:'/error'
        });
    }
]);

webApp.run(['userDataFactory','$rootScope','$location',function (userDataFactory,$rootScope,$location) {
    $rootScope.logged= false;
    $rootScope.logout = function() {
        $rootScope.logged= false;
        userDataFactory.logUserOut();
    };
    $rootScope.$on("$routeChangeStart", function(event, to, from) {
        if (to.protected === true ) {
            if (!userDataFactory.getUserData().isAuth) {
                $rootScope.notAuthMsg = "Please Login to continue";
                $rootScope.logged= false;
                $location.path('/home');
            } else{
                $rootScope.logged= true;
                $rootScope.notAuthMsg = "";
            }
        }
    });
    $rootScope.$on("$routeChangeError", function(evt, to, from, error) {
        if (error) {
            console.log("NO AUTH ! go back");
            $rootScope.notAuthMsg = "Please Login to continue";
            $location.path("/home").search("returnTo", to.originalPath);
        }
    });
}]);

function calculateBalance(balance,opArr) {
    console.log('starting',balance,opArr);
    const reducer = (accumulator, currentValue) => {
        if (currentValue.opType === "Fee") {
           return accumulator - currentValue.amount;
        } else {
           return accumulator + currentValue.amount;
        }
    };
    let diff = opArr.reduce(reducer,balance);
    console.log("diff",diff);
    return diff;
}
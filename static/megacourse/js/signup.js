/**
 * Created by leo on 19/02/18.
 */
/**
 * Created by leo on 18/02/18.
 */

app.controller('signup', function($scope, $http, $location) {
    $scope.username = "";
    $scope.password1 = "";
    $scope.password2 = "";
    $scope.email = "";
    $scope.password1 = "";
    $scope.password2 = "";
    $scope.emailEnvoye = false;
    $scope.erreurPass = false;
    $scope.erreurIdentifiantExistant = false;
    $scope.erreurMailExistant = false;

    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    $scope.checkEmail = function () {
        console.log("change email");
    }
    $scope.validerMotDePass = function () {
        if($scope.password1==$scope.password2){
            $scope.erreurPass = false;
            return true;
        }else {
            $scope.erreurPass = true;
            return false;
        }
    }
    $scope.clickEnregistrer = function () {
        if(($scope.validerMotDePass()==true)&&($scope.signup_form.$valid)){
            console.log("pass egaux");
            $http({
                method: 'POST',
                headers:{"X-CSRFToken": getCookie('csrftoken')},
                data: {
                    "username": $scope.username,
                    "email": $scope.email,
                    "password1": $scope.password1,
                    "password2": $scope.password2
                },
                url: "/rest-auth/registration/"
            }).then(function successCallback(response) {
                window.location.href = "/accounts/confirm-email/";
            }, function errorCallback(response) {
                    if(response.data['email']){
                        $scope.erreurMailExistant = true;
                    }else{
                        $scope.erreurMailExistant = false;
                    }
                    if(response.data['username']){
                        $scope.erreurIdentifiantExistant = true;
                    }else{
                        $scope.erreurIdentifiantExistant = false;
                    }
            });
        }else {
            console.log("pass différent" + $scope.signup_form.$valid);
        }
    }
});

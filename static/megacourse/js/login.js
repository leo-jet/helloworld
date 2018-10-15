/**
 * Created by leo on 18/02/18.
 */
app.controller('login', function($scope, $http, $location) {
    $scope.username = "";
    $scope.password = "";

    console.log("hummmmmm ");
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
    $scope.clickConnecter = function () {

        $http({
            method: 'POST',
            headers:{"X-CSRFToken": getCookie('csrftoken')},
            data: {"username": $scope.username, "password": $scope.password},
            url: "/rest-auth/login/"
        }).then(function successCallback(response) {
            window.location.href = "/";
        }, function errorCallback(response) {
            $("#error").slideDown( "slow" );
        });
    }
});

/**
 * Created by leo on 20/01/18.
 * asNomDeLaVariable
 */

app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});

app.controller('assignment_top', function($scope, $http, $location) {
    var idClasse = $("label[name='classeConfiguration']").attr("id");
    var idChapitre = $("label[name='chapitre']").attr("id");
    console.log(idChapitre);
    console.log(idClasse);
    $scope.classe = null;
    $scope.asProgramme = null;
    $scope.posts = null;
    $scope.commentaire = null;

    $scope.commenter = function (commentaire, post) {
        $http({
            method: 'GET',
            params: {"idPost": post.id, "contenu":commentaire},
            url: "/api/comment/post/"
        }).then(function successCallback(response) {
            $("textarea[name='commentEnter"+post.id+"']").val("");
            post.comments.push(response.data.comment);
            post.nbComments = post.nbComments + 1;
            var d = $(".box-footer box-comments");
            d.scrollTop(d.prop("scrollHeight"));
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    $http({
        method: 'GET',
        params: {"classeID": idClasse},
        url: "/api/assignment/top/information/"
    }).then(function successCallback(response) {
        $scope.asClasse = response.data.classe;
        $scope.asProgramme = response.data.programme;
    }, function errorCallback(response) {
        console.log(response);
    });

    $http({
        method: 'GET',
        params: {"idChapitre": idChapitre},
        url: "/api/chapitre/posts/"
    }).then(function successCallback(response) {
        $scope.posts = response.data.posts;
    }, function errorCallback(response) {
        console.log(response);
    });

    $scope.nouvelleQuestion = function () {
        $("#discussion_form").show();
    };

    $scope.repondre = function (post) {
        $("#post"+post.id).show();
    };

    $scope.collapseTooglePost = function (postID) {
        if($("div[name='post"+postID+"']").hasClass("collapsed-box")){
            $(".box").addClass("collapsed-box");
            $("div[name='post"+postID+"']").removeClass("collapsed-box")
            $("button[name='showButton"+postID+"']").empty();
            $("button[name='showButton"+postID+"']").html("<i class='fa fa-minus'></i>");
        }else{
            $("div[name='post"+postID+"']").addClass("collapsed-box")
            $("button[name='showButton"+postID+"']").empty();
            $("button[name='showButton"+postID+"']").html("<i class='fa fa-plus'></i>");
        };
    };

    $scope.tooglePost = function (postID) {
        $("div[name='post"+postID+"']").removeClass("collapsed-box");
    };


    $scope.fermerPost = function (post) {
        $("#post"+post.id).hide();
    };

    $scope.envoyer = function (post) {
        contenu = $("textarea[name='reponse"+post.id+"']").val();
        $http({
            method: 'GET',
            params: {"idPost": post.id, "contenu":contenu},
            url: "/api/comment/post/"
        }).then(function successCallback(response) {
            $http({
                method: 'GET',
                params: {"idChapitre": idChapitre},
                url: "/api/chapitre/posts/"
            }).then(function successCallback(response) {
                $scope.posts = response.data.posts;
            }, function errorCallback(response) {
                console.log(response);
            });
        }, function errorCallback(response) {
            console.log(response);
        });
    };

});

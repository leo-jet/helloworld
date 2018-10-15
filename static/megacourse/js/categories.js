/**
 * Created by leo on 24/01/18.
 */
app.controller('categories', function($scope, $http, $location) {
    $scope.classes = null;
    $scope.filtres = [];
    $http({
        method: 'GET',
        params: {"classeID": " fgfdfgf"},
        url: "/api/classes/"
    }).then(function successCallback(response) {
        $scope.niveaux = response.data.niveaux;
        $scope.groupes = response.data.groupes;
        $scope.matieres = response.data.matieres;
        $scope.classes = response.data.classes;
    }, function errorCallback(response) {
        console.log(response);
    });

    $scope.clickSurLeCours = function (classe) {
        username = $("label[name='username']").attr("id");
        $http({
            method: 'GET',
            params: {"username": username, "classeID":classe.idClass},
            url: "/api/verifier/visiteur/"
        }).then(function successCallback(response) {
            if(response.data.eleveInscrit){
                window.location.href = "/cours/learn/"+classe.idClass+"/";
            }else if(response.data.prof){
                window.location.href = "/cours/learn/enseignant/"+classe.idClass+"/";
            }else{
                window.location.href = "/cours/intro/"+classe.idClass+"/";
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    $scope.checkInFiltre = function (intitule) {
        trouve = false;
        angular.forEach($scope.filtres, function(filtre, key1){
            if (filtre.intitule == intitule){
                trouve = true;
            }
        });
        return trouve;
    }

    $scope.clickFiltre = function (intitule, type) {
        trouve = false;
        index = -1;
        angular.forEach($scope.filtres, function(filtre, key1){
            if (filtre.intitule == intitule){
                trouve = true;
                index = key1;
            }
        });
        if(trouve==true){
            $scope.filtres.splice(index, 1);
        }else{
            obj = {
                "intitule": intitule,
                "type": type
            };
            $scope.filtres.push(obj);
        }

        matieres = [];
        groupes = [];
        niveaux = [];
        if($scope.filtres.length>0){

        angular.forEach($scope.filtres, function(filtre, key1){
            if (filtre.type == "matiere"){
                matieres.push(filtre.intitule);
            }
            if (filtre.type == "niveau"){
                niveaux.push(filtre.intitule);
            }
            if (filtre.type == "groupe"){
                groupes.push(filtre.intitule);
            }
        });
        }else {
            matieres = ["None"];
            groupes = ["None"];
            niveaux = ["None"];
        }

        $http({
            method: 'GET',
            params: {"matieres": matieres,"niveaux": niveaux,"groupes": groupes},
            url: "/api/classes/search/"
        }).then(function successCallback(response) {
            $scope.classes = response.data.classes;
        }, function errorCallback(response) {
            console.log(response);
        });
    }

});

/**
 * Created by leo on 24/01/18.
 */
app.controller('course-learn', function($scope, $http, $location) {
    idClass = $("label[name='classeID']").attr("id");
    $scope.bilanDevoir = null;
    $scope.bilanChapitre = null;
    $scope.copiesParDevoir = null;
    $scope.annonces = null;

    $http({
        method: 'GET',
        params: {"classeID": idClass},
        url: "/api/copies/eleve/"
    }).then(function successCallback(response) {
        $scope.copiesParDevoir = response.data.copiesParDevoir;
    }, function errorCallback(response) {
        console.log(response);
    });

    $http({
        method: 'GET',
        params: {"classeID": idClass},
        url: "/api/classe/annonces/"
    }).then(function successCallback(response) {
        $scope.annonces = response.data.annonces;
    }, function errorCallback(response) {
        console.log(response);
    });

    $scope.clickAfficherBilanDevoir = function () {
        $scope.bilanDevoir = true;
        $scope.bilanChapitre = false;
    };

    $scope.clickAfficherBilanChapitre = function () {
        $scope.bilanDevoir = false;
        $scope.bilanChapitre = true;
    };

    $scope.AfficherBilanEssaiDevoir = function (devoirIndex) {
        var ctx = "myChart";
        var labels = [0];
        var donnees = [0];
        var n = 1;
        angular.forEach($scope.copiesParDevoir[devoirIndex].copies, function(copie, key1){
            labels.push(n);
            n = n+1;
            var reponses = JSON.parse(copie.reponses);
            donnees.push(reponses["note"])
        });
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: '# of Votes',
                    data: donnees,
                    borderWidth: 3,
                    borderColor: "#1c6eff",
                    lineTension: 0,
                    fill: false,
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true,
                            stepSize: 1
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'points sur 3'
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            beginAtZero:true,
                            stepSize: 1
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'numéro de l\'essai'
                        }
                    }]
                },
                steppedLine: true
            }
        });
    }
});
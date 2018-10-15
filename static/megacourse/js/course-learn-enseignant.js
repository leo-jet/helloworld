/**
 * Created by leo on 24/01/18.
 */
app.controller('course-learn', function($scope, $http, $location) {
    var config_ckeditor = {
        skin: 'kama',
        extraPlugins: 'mathjax,uploadimage,image2',
        mathJaxLib: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS_HTML',
        height: 320,
        // Upload images to a CKFinder connector (note that the response type is set to JSON).
        uploadUrl: '/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files&responseType=json',

        // Configure your file manager integration. This example uses CKFinder 3 for PHP.
        filebrowserBrowseUrl: '/ckeditor/browse/',
        filebrowserImageBrowseUrl: '/ckeditor/browse/',
        filebrowserUploadUrl: '/ckeditor/upload/',
        filebrowserImageUploadUrl: '/ckeditor/upload/',

        // The following options are not necessary and are used here for presentation purposes only.
        // They configure the Styles drop-down list and widgets to use classes.

        stylesSet: [
            { name: 'Narrow image', type: 'widget', widget: 'image', attributes: { 'class': 'image-narrow' } },
            { name: 'Wide image', type: 'widget', widget: 'image', attributes: { 'class': 'image-wide' } }
        ],

        // Load the default contents.css file plus customizations for this sample.
        contentsCss: [ CKEDITOR.basePath + 'contents.css', 'https://sdk.ckeditor.com/samples/assets/css/widgetstyles.css' ],

        // Configure the Enhanced Image plugin to use classes instead of styles and to disable the
        // resizer (because image size is controlled by widget styles or the image takes maximum
        // 100% of the editor width).
        image2_alignClasses: [ 'image-align-left', 'image-align-center', 'image-align-right' ],
        image2_disableResizer: true
    };

    annonce = CKEDITOR.replace( 'annonce', config_ckeditor);

    annonce.on( 'change', function() {
        // getData() returns CKEditor's HTML content.
        $("textarea[name='annonce']").val(annonce.getData());
    });

    idClass = $("label[name='classeID']").attr("id");
    $scope.eleveDeLaClasse = [];
    $scope.chapitres = [];
    $scope.bilanEleves = false;
    $scope.bilanChapitres = false;
    $scope.bilanDevoirs = false;
    $scope.bilanMoyennes = false;
    $scope.bilanCopies = false;
    $scope.copiesParEleve = null;
    $scope.intituleDevoir = null;
    $scope.eleveCourant = null;
    $scope.devoirCourant = null;
    $scope.annonces = null;
    $scope.dernieresNotesEleveDevoir = [];
    $scope.moyenneGeneraleChapitreEleve = null;
    $scope.moyenneGeneraleClasse = null;


    $http({
        method: 'GET',
        params: {"classeID": idClass},
        url: "/api/copies/eleve/classe/"
    }).then(function successCallback(response) {
        $scope.copiesParEleve = response.data.copiesParEleve;
        angular.forEach($scope.copiesParEleve, function(eleve, key1){
            $scope.eleveDeLaClasse.push({
                'index': key1,
                "nom": eleve.eleve.nom + " " + eleve.eleve.prenom
            })
        });
        $scope.intituleDevoir = response.data.devoirsIntitule;
        $scope.chapitres = response.data.chapitres;
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

    $scope.corrigerCopie = function (copie, correction) {
        points = 0;
        total = 0;
        angular.forEach(correction.get_corrections, function(question, key){
            pointsQuestion = 0;
            totalQuestion = 0;
            if((question.type=='ci') || (question.type=='qru') || (question.type=='qcm')){
                angular.forEach(JSON.parse(copie.questions), function(myreponse, key2){
                    if (question.idQuestion==myreponse.idquestion){
                        angular.forEach(question.propositions, function(proposition, key3){
                            angular.forEach(myreponse.propositions, function(prop, key4){
                                if(prop.id==proposition.id){
                                    if((proposition.solution==true)&&(prop.reponse==true)){
                                        pointsQuestion = pointsQuestion + 1
                                    }
                                    if(proposition.solution==true){
                                        totalQuestion = totalQuestion + 1;
                                    }
                                }
                            });
                        });
                    }
                });
            }
            if(question.type=='qcr'){
                angular.forEach(JSON.parse(copie.questions), function(myreponse, key2){
                    if (question.idQuestion==myreponse.idquestion){
                        angular.forEach(question.propositions, function(proposition, key3){
                            angular.forEach(myreponse.propositions, function(prop, key4){
                                if(prop.id==proposition.id){
                                    if(proposition.enonceB==prop.reponse){
                                        pointsQuestion = pointsQuestion + 1;
                                    }
                                }
                            });
                        });
                    }
                });
                totalQuestion = question.propositions.length;
            }
            if(question.type=='schema'){
                angular.forEach(JSON.parse(copie.questions), function(myreponse, key2){
                    if (question.idQuestion==myreponse.idquestion){
                        angular.forEach(question.propositions, function(proposition, key3){
                            angular.forEach(myreponse.propositions, function(prop, key4){
                                if(prop.id==proposition.id){
                                    if(proposition.annotation==prop.reponse){
                                        pointsQuestion = pointsQuestion + 1;
                                    }
                                }
                            });
                        });
                    }
                });
                totalQuestion = question.propositions.length;
            }
            total = total + totalQuestion;
            points = points + pointsQuestion;
        });
        return {
            "points":points,
            "total":total
        }
    };

    $scope.clickAfficherBilanEleves = function () {
        $scope.bilanEleves = true;
        $scope.bilanChapitres = false;
        $scope.bilanDevoirs = false;
        $scope.bilanMoyennes = false;
        $scope.bilanCopies = false;

        $scope.dernieresNotesEleveDevoir = [];

        angular.forEach($scope.copiesParEleve, function(eleve, key1){
            lastNoteEleve = [];
            angular.forEach($scope.intituleDevoir, function(intitule, key2){
                angular.forEach(eleve.copiesParDevoir, function(devoir, key3){
                    if(intitule==devoir.devoirIntitule){
                        var note = null;
                        var dateLast = new Date(0);
                        var lastNote = null;
                        angular.forEach(devoir.copies, function(copie, key4){
                            var date = new Date(copie.date);
                            if(date>dateLast){
                                dateLast = date;
                                console.log(copie.reponses);
                                resultat = $scope.corrigerCopie(JSON.parse(copie.reponses), devoir.correction);
                                quotient = (resultat.points/resultat.total)*100;
                                lastNote = Math.round(quotient) + " %";
                            }
                        });
                        lastNoteEleve.push({
                            "note":lastNote,
                            "indexDevoir":key3,
                            "indexEleve": key1
                        });
                    }
                });
            });
            $scope.dernieresNotesEleveDevoir.push({
                "nom": eleve.eleve.nom + " " + eleve.eleve.prenom,
                "notes": lastNoteEleve,
            })
        });
    };

    $scope.clickAfficherBilanChapitres = function () {
        $scope.bilanEleves = false;
        $scope.bilanChapitres = true;
        $scope.bilanDevoirs = false;
        $scope.bilanMoyennes = false;
        $scope.bilanCopies = false;
        $scope.pointsSucces = [];
        $scope.pointsEchec = [];
        labelsChapitres = [];
        angular.forEach($scope.chapitres, function(titre, key1){
            if(key1<1000){
                countSucces = 0;
                countEchec = 0;
                labelsChapitres.push(titre.substring(0,20)+"...");
                angular.forEach($scope.copiesParEleve, function(eleve, key2){
                    i = 0;
                    while((i<eleve.copiesParDevoir.length) && (titre != eleve.copiesParDevoir[i].chapitre)){
                        i = i + 1;
                    }
                    if(i<eleve.copiesParDevoir.length){
                        angular.forEach(eleve.copiesParDevoir[i].copies, function(copie, key1){
                            resultat = $scope.corrigerCopie(JSON.parse(copie.reponses), eleve.copiesParDevoir[i].correction);
                            quotient = resultat.points / resultat.total;
                            if(quotient<0.5){
                                countEchec = countEchec + 1;
                            }else{
                                countSucces = countSucces + 1;
                            }
                        });
                    }
                });
                pourcentageSuccess = Math.round((countSucces/(countEchec+countSucces))*100);
                pourcentageEchec = 100 - pourcentageSuccess;
                $scope.pointsSucces.push({
                    "x": countEchec+countSucces,
                    "y": pourcentageSuccess,
                    "label": titre,
                });
                $scope.pointsEchec.push({
                    "x": countEchec+countSucces,
                    "y": -pourcentageEchec,
                    "label": titre,
                });
            }
        });

        console.log($scope.pointsEchec);
        console.log($scope.pointsSucces);

        var ctx = document.getElementById("questionBilan").getContext("2d");
        var scatterChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Scatter Dataset',
                    borderColor: "#FF0000",
                    fillColor: "#FF0000",
                    strokeColor: "#FF0000",
                    pointColor: "#FF0000",
                    pointBackgroundColor: "#FF0000",
                    pointHighlightFill: "#FF0000",
                    pointHighlightStroke: "#FF0000",
                    data: $scope.pointsEchec
                },{
                    label: 'Scatter Dataset 2',
                    borderColor: "#37ff65",
                    fillColor: "#37ff65",
                    strokeColor: "#37ff65",
                    pointColor: "#37ff65",
                    pointBackgroundColor: "#37ff65",
                    pointHighlightFill: "#37ff65",
                    pointHighlightStroke: "#37ff65",
                    data: $scope.pointsSucces
                }]
            },
            options: {
                tooltips: {
                    mode: 'point',
                    callbacks: {
                        label: function(tooltipItem, data) {
                            return data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].label + ': (' + tooltipItem.xLabel + ', ' + tooltipItem.yLabel + ')';
                        }
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true,
                            max:100,
                            min:-100
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Pourcentage de réussite (en %)'
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            beginAtZero:true,
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'nombre d\'essai'
                        }
                    }]
                },
            }
        });
    };



    $scope.afficherBilanDunDevoir = function (indexEleve, indexDevoir) {
        console.log(indexEleve);
        console.log(indexDevoir);
        resultat = null;
        resultatDevoir = [];
        $scope.eleveCourant = $scope.copiesParEleve[indexEleve].eleve;
        copies = $scope.copiesParEleve[indexEleve].copiesParDevoir[indexDevoir].copies
        copies = copies.sort(function(copie1, copie2) {
            var date1 = new Date(copie1.date);
            var date2 = new Date(copie2.date);
            return date1 - date2;
        });
        indexCopie = [];
        angular.forEach(copies, function(copie, key1){
            resultat = $scope.corrigerCopie(
                JSON.parse(copie.reponses),
                $scope.copiesParEleve[indexEleve].copiesParDevoir[indexDevoir].correction
            );
            resultatDevoir.push(Math.round((resultat.points/resultat.total)*100));
            indexCopie.push(key1+1);
        });
        $scope.devoirCourant = $scope.copiesParEleve[indexEleve].copiesParDevoir[indexDevoir].devoirIntitule;
        var ctx = document.getElementById("devoirBilan").getContext("2d");
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: indexCopie,
                datasets: [{
                    label: 'pourcentage de réussite',
                    data: resultatDevoir,
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
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Pourcentage de réussite (en %)'
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            beginAtZero:true,
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
        $("#modalBilanDevoir").modal();
    };

    $scope.afficherBilanDevoirsEleve = function (eleve) {
        console.log($scope.copiesParEleve[eleve.index].eleve.nom);
        var labelsDevoirs = [];
        var dataSucces = [];
        var dataEchec = [];
        angular.forEach($scope.intituleDevoir, function(intitule, key1){
            if(key1<1000){
                countSucces = 0;
                countEchec = 0;

                labelsDevoirs.push(intitule.substring(0,20)+"...");

                i = 0;
                while((i<$scope.copiesParEleve[eleve.index].copiesParDevoir.length) && (intitule != $scope.copiesParEleve[eleve.index].copiesParDevoir[i].devoirIntitule)){
                    i = i + 1;
                }
                if(i<$scope.copiesParEleve[eleve.index].copiesParDevoir.length){
                    angular.forEach($scope.copiesParEleve[eleve.index].copiesParDevoir[i].copies, function(copie, key1){
                        resultat = $scope.corrigerCopie(JSON.parse(copie.reponses), $scope.copiesParEleve[eleve.index].copiesParDevoir[i].correction);
                        quotient = resultat.points / resultat.total;
                        if(quotient<0.5){
                            countEchec = countEchec + 1;
                        }else{
                            countSucces = countSucces + 1;
                        }
                    });
                }
                pourcentageSuccess = Math.round((countSucces/(countEchec+countSucces))*100);
                pourcentageEchec = 100 - pourcentageSuccess;
                dataSucces.push(pourcentageSuccess);
                dataEchec.push(pourcentageEchec);
            }
        });

        console.log(dataEchec);
        console.log(dataSucces);

        var barChartData = {
            labels: labelsDevoirs,
            responsive: true,
            datasets: [{
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgb(75, 192, 192)',
                label: 'Taux de reussite',
                borderWidth: 1,
                data: dataSucces
            }, {
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                label: 'Taux d\'échec',
                borderWidth: 1,
                data: dataEchec
            }]
        };
        $("#containerDevoir").empty();
        $("#containerDevoir").append("<canvas id='devoirs'></canvas>");
        var ctx = document.getElementById("devoirs").getContext("2d");

        myBar = new Chart(ctx, {
            type: 'horizontalBar',
            data: barChartData,
            options: {
                legend: {
                    position: 'top',
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        },
                        scaleLabel : {
                            display: true,
                            labelString : "nom du devoir"
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            beginAtZero:true
                        },
                        scaleLabel : {
                            display: true,
                            labelString : "nombre de tentatives"
                        }
                    }]
                }
            }
        });
    };

    $scope.clickAfficherBilanDevoirs = function () {
        $scope.bilanEleves = false;
        $scope.bilanChapitres = false;
        $scope.bilanDevoirs = true;
        $scope.bilanMoyennes = false;
        $scope.bilanCopies = false;




        var labelsDevoirs = [];
        var dataSucces = [];
        var dataEchec = [];
        angular.forEach($scope.intituleDevoir, function(intitule, key1){
            if(key1<7){
                countSucces = 0;
                countEchec = 0;

                labelsDevoirs.push(intitule.substring(0,20)+"...");
                angular.forEach($scope.copiesParEleve, function(eleve, key11){
                    i = 0;
                    while((i<eleve.copiesParDevoir.length) && (intitule != eleve.copiesParDevoir[i].devoirIntitule)){
                        i = i + 1;
                    }
                    if(i<eleve.copiesParDevoir.length){
                        angular.forEach(eleve.copiesParDevoir[i].copies, function(copie, key1){
                            resultat = $scope.corrigerCopie(JSON.parse(copie.reponses), eleve.copiesParDevoir[i].correction);
                            quotient = resultat.points / resultat.total;
                            if(quotient<0.5){
                                countEchec = countEchec + 1;
                            }else{
                                countSucces = countSucces + 1;
                            }
                        });
                    }
                });
                pourcentageSuccess = Math.round((countSucces/(countEchec+countSucces))*100);
                pourcentageEchec = 100 - pourcentageSuccess;
                dataSucces.push(pourcentageSuccess);
                dataEchec.push(pourcentageEchec);
            }
        });

        var barChartData = {
            labels: labelsDevoirs,
            responsive: true,
            datasets: [{
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgb(75, 192, 192)',
                label: 'Taux de reussite',
                borderWidth: 1,
                data: dataSucces
            }, {
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                label: 'Taux d\'échec',
                borderWidth: 1,
                data: dataEchec
            }]
        };

        $("#containerDevoir").empty();
        $("#containerDevoir").append("<canvas id='devoirs'></canvas>");
        var ctx = document.getElementById("devoirs").getContext("2d");

        myBar = new Chart(ctx, {
            type: 'horizontalBar',
            data: barChartData,
            options: {
                legend: {
                    position: 'top',
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        },
                        scaleLabel : {
                            display: true,
                            labelString : "nom du devoir"
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            beginAtZero:true
                        },
                        scaleLabel : {
                            display: true,
                            labelString : "nombre de tentatives"
                        }
                    }]
                }
            }
        });
    };

    $scope.clickAfficherBilanMoyennes = function () {
        $scope.bilanEleves = false;
        $scope.bilanChapitres = false;
        $scope.bilanDevoirs = false;
        $scope.bilanMoyennes = true;
        $scope.bilanCopies = false;

        labelsChapitres = [];
        moyenneGeneraleChapitre = [];
        moyenneGeneraleChapitreEleve = [];
        angular.forEach($scope.chapitres, function(titre, key1){
            somme = 0
            n = 0
            if(key1<1000){
                countSucces = 0;
                countEchec = 0;
                labelsChapitres.push(titre.substring(0,20)+"...");
                angular.forEach($scope.copiesParEleve, function(eleve, key2){
                    i = 0;
                    while((i<eleve.copiesParDevoir.length) && (titre != eleve.copiesParDevoir[i].chapitre)){
                        i = i + 1;
                    }
                    nEleve = 0
                    sommeEleve = 0
                    if(i<eleve.copiesParDevoir.length){
                        angular.forEach(eleve.copiesParDevoir[i].copies, function(copie, key3){
                            resultat = $scope.corrigerCopie(JSON.parse(copie.reponses), eleve.copiesParDevoir[i].correction);
                            quotient = resultat.points / resultat.total;
                            somme = somme + quotient;
                            sommeEleve = sommeEleve + quotient;
                            n = n + 1;
                            nEleve = nEleve + 1;
                            if(quotient<0.5){
                                countEchec = countEchec + 1;
                            }else{
                                countSucces = countSucces + 1;
                            }
                        });
                    }
                    if(nEleve>0){
                        moyenneEleve = (sommeEleve/nEleve)*100;
                    }else{
                        moyenneEleve = 0
                    }
                    moyenneGeneraleChapitreEleve.push({
                        "moyenneGenerale":Math.round(moyenneEleve),
                        "chapitre":titre,
                        "eleveIndex": key2
                    })
                });
                if(n>0){
                    moyenne = (somme/n)*100;
                }else{
                    moyenne = 0
                }
                moyenneGeneraleChapitre.push(Math.round(moyenne));
            }
        });
        $scope.moyenneGeneraleChapitreEleve = moyenneGeneraleChapitreEleve;
        $scope.moyenneGeneraleClasse = moyenneGeneraleChapitre;
    };



    $scope.afficherMoyenneEleve = function (indexEleve, nomEleve) {

        dataMoyenne = [];
        angular.forEach($scope.chapitres, function(titre, key1){
            angular.forEach($scope.moyenneGeneraleChapitreEleve, function(moyenne, key1){
                if((titre==moyenne.chapitre)&&(indexEleve==moyenne.eleveIndex)){
                    dataMoyenne.push(moyenne.moyenneGenerale);
                }
            });
        });

        var config = {
            type: 'radar',
            data: {
                labels: labelsChapitres,
                datasets: [{
                    label: nomEleve,
                    backgroundColor: "rgba(90,222,85,0.2)",
                    borderColor: "rgba(0,150,0,1)",
                    pointBackgroundColor: "rgba(0,150,0,1)",
                    data: dataMoyenne
                }, {
                    label: "Moyenne générale de la classe",
                    backgroundColor: "rgba(247,239,124,0.2)",
                    borderColor: "rgba(255,239,0,1)",
                    pointBackgroundColor: "rgba(255,239,0,1)",
                    data: $scope.moyenneGeneraleClasse
                }]
            },
            options: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Moyenne générale dans tous les chapitres'
                },
                scale: {
                    ticks: {
                        beginAtZero: true,
                        max:100
                    }
                }
            }
        };


        $("#containerMoyenne").empty();
        $("#containerMoyenne").append("<canvas id='moyennes'></canvas>");

        var ctx = document.getElementById("moyennes").getContext("2d");

        myBar = new Chart(ctx, config);
    };

    $scope.clickAfficherBilanCopies = function () {
        $scope.bilanEleves = false;
        $scope.bilanChapitres = false;
        $scope.bilanDevoirs = false;
        $scope.bilanMoyennes = false;
        $scope.bilanCopies = true;
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

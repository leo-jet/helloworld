/**
 * Created by leo on 20/01/18.
 */

app.service("getQuestionService", function ($http, $q) {

    var deferred = $q.defer();
    var config = {
        async:false
    };

    this.getQuestions = function (idQuizz) {
        return $http.get("/api/quizz/detail/"+idQuizz+"/", config)
            .then(function (response) {
                // promise is fulfilled
                deferred.resolve(response.data);
                // promise is returned
                return deferred.promise;
            }, function (response) {
                // the following line rejects the promise
                deferred.reject(response);
                // promise is returned
                return deferred.promise;
            })
        ;
    };
});

app.controller('quizz', function($scope, $http, $location, $q, getQuestionService, $timeout) {
    $scope.fin = false;
    $scope.compteur = 1;
    $scope.questions = null;
    $scope.propositionRelationlleSelectionnee = null;
    $scope.propositionAnnotationSelectionnee = null;
    $scope.corriger = false;
    $scope.points = 0;
    $scope.total = 0;
    var idQuizz = $("label[name='idQuizz']").attr("id");
    var devoirID = $("label[name='devoirID']").attr("id");
    var correction = $("label[name='correction']").attr("id");
    var duree = $("label[name='duree']").attr("id");
    var limite = $("label[name='limite']").attr("id");

    hm = duree.split(":");
    var duree = (+hm[0]) * 60 * 60 + (+hm[1]) * 60 ;
    console.log(duree);


    function parseJson (json) {
        return JSON.parse(json);
    }

    getQuestionService.getQuestions(idQuizz).then(
        function (response) {
            $scope.questions = response.quizz.get_questions.sort(function(questionA, questionB){return questionA.partie > questionB.partie});
            $scope.name = response.quizz.intitule;

            var parties = [];
            $.each(response.quizz.get_questions, function (index, question) {
                parties.push(question.partie);
            });
            var partiesSet = Array.from(new Set(parties));
            var questionList = [];
            angular.forEach(partiesSet, function(value, key){
                var questionsPartie = [];
                angular.forEach($scope.questions, function(question1, key1){
                    if(question1.partie==value){
                        questionsPartie.push(question1);
                    }
                });
                questionList.push({"partie":value,"questions":questionsPartie});
            });
            $scope.questionsParties = questionList;
            $scope.question = $scope.questions[0];
            angular.forEach($scope.questions, function(value, key){
                value.propositions = parseJson(value.propositions).sort(function(a, b){return 0.5 - Math.random()});
            });
            console.log($scope.questions);

        },
        function (error) {
            // handle errors here
            console.log(error.statusText);
        }
    );


    /***
     *
     * Corriger
     *
     * ***/
    $scope.corrigerLeDevoir = function () {
        $scope.corriger = true;
        $http({
            method: 'GET',
            url: "/api/quizz/detail/correction/"+idQuizz+"/"
        }).then(function successCallback(response) {
            $scope.questionsCorrigees = response.data.quizz.get_corrections;
            angular.forEach($scope.questions, function(question, key){
                angular.forEach($scope.questionsCorrigees, function(questionCorrigee, keyCorrige){
                    if(question.idQuestion==questionCorrigee.idQuestion){
                        angular.forEach(question.propositions, function(proposition, keyProposition){
                            angular.forEach(questionCorrigee.propositions, function(propositionCorrigee, keyPropositionCorrigee){
                                if(proposition.id==propositionCorrigee.id){
                                    angular.forEach(propositionCorrigee, function(v, k){
                                        if(k!="id"){
                                            proposition[k]=v;

                                        }
                                    });
                                }
                            });
                        });
                    }
                });
            });

            angular.forEach($scope.questions, function(question, key){
                points = 0;
                total = 0;
                if((question.type=='ci') || (question.type=='qru') || (question.type=='qcm')){
                    angular.forEach(question.propositions, function(proposition, key2){
                        if((proposition.checked==true)&&(proposition.solution==true)){
                            points = points +1;
                        }
                        if(proposition.solution==true){
                            total = total + 1;
                        }
                    });
                }
                if(question.type=='qcr'){
                    angular.forEach(question.propositions, function(proposition, key2){
                        if(proposition.reponse==proposition.enonceB){
                            points = points + 1;
                        }
                    });
                    total = question.propositions.length;
                }
                if(question.type=='schema'){
                    angular.forEach(question.propositions, function(proposition, key2){
                        if(proposition.reponse==proposition.annotation){
                            points = points + 1;
                        }
                    });
                    total = question.propositions.length;
                }
                question["total"] = total;
                question["points"] = points;
            });
        }, function errorCallback(response) {
            alert(response.responseText);
        });
    };



    /***
     *
     * Nombre d'essais limites atteint ou/et date limite dépasser
     *
     * ***/
    $timeout( function(){
            if(limite=="True"){
        console.log("limite=True");
        $scope.fin = true;
        var data = {
            "devoirID": devoirID
        };
        $http({
            method: 'GET',
            params: data,
            url: "/api/copie/eleve/"
        }).then(function successCallback(response) {
            reponses = JSON.parse(JSON.parse(response.data.reponses).questions);
            console.log(reponses);
            angular.forEach($scope.questions, function(question, key1){
                if((question.type=='ci') || (question.type=='qru') || (question.type=='qcm')){
                    angular.forEach(reponses, function(reponse, key2){
                        if (question.idQuestion==reponse.idquestion){
                            angular.forEach(question.propositions, function(proposition, key3){
                                angular.forEach(reponse.propositions, function(prop, key4){
                                    if(prop.id==proposition.id){
                                        proposition.checked=prop.reponse;
                                        console.log("hello");
                                    }
                                });
                            });
                        }
                    });
                }
                if(question.type=='qcr'){
                    angular.forEach(reponses, function(reponse, key2){
                        if (question.idQuestion==reponse.idquestion){
                            angular.forEach(question.propositions, function(proposition, key3){
                                angular.forEach(reponse.propositions, function(prop, key4){
                                    if(prop.id==proposition.id){
                                        proposition.reponse=prop.reponse;
                                        console.log("hello");
                                    }
                                });
                            });
                        }
                    });
                }
                if(question.type=='schema'){
                    angular.forEach(reponses, function(reponse, key2){
                        if (question.idQuestion==reponse.idquestion){
                            angular.forEach(question.propositions, function(proposition, key3){
                                angular.forEach(reponse.propositions, function(prop, key4){
                                    if(prop.id==proposition.id){
                                        proposition.reponse=prop.reponse;
                                        console.log("hello");
                                    }
                                });
                            });
                        }
                    });
                }
            });
        }, function errorCallback(response) {
            alert(response.responseText);
        });

        if(correction=="True"){
            $scope.corrigerLeDevoir();
        }
        console.log($scope.corriger);
    }else{
        var timer = new Timer();
        timer.start({countdown: true, startValues: {seconds: parseInt(duree) }});
        $('#countdownExample .values').html(timer.getTimeValues().toString());
        timer.addEventListener('secondsUpdated', function (e) {
            $('#countdownExample .values').html(timer.getTimeValues().toString());
        });
        timer.addEventListener('targetAchieved', function (e) {
            $scope.fin = true;
            if(correction=="True"){
                $scope.corrigerLeDevoir();
            }
        });
    }

    }, 5000 );

    $scope.changerQuestion = function (cleActuel) {
        var index = 0;
        angular.forEach($scope.questions, function(question1, key1){
            if(question1.idQuestion==cleActuel){
                index = key1;
            }
        });
        $scope.question = $scope.questions[index];
    };

    $scope.selectionnerProposition = function (enonceB) {
        $scope.propositionRelationlleSelectionnee = enonceB;
    };

    $scope.selectionnerAnnotation = function (annotation) {
        $scope.propositionAnnotationSelectionnee = annotation;
    };

    $scope.clickChoisirPropositionRelationnelle = function (proposition) {
        if($scope.propositionRelationlleSelectionnee){
            if ($scope.question.type == "qcr"){
                var index = null;
                angular.forEach($scope.question.enonceBListe, function(enonce, key1){
                    if(enonce==$scope.propositionRelationlleSelectionnee){
                        index = key1;
                    }
                });
                $scope.question.enonceBListe.splice(index,1);
            }
            proposition.reponse = $scope.propositionRelationlleSelectionnee;
            $scope.propositionRelationlleSelectionnee = null;
        }else {
            alert("veuillez selectionner un element jaune")
        }
    };

    $scope.clickChoisirAnnotation = function (proposition) {
        if($scope.propositionAnnotationSelectionnee){
            if ($scope.question.type == "schema"){
                var index = null;
                angular.forEach($scope.question.annotationListe, function(annotation, key1){
                    if(annotation==$scope.propositionAnnotationSelectionnee){
                        index = key1;
                    }
                });
                $scope.question.annotationListe.splice(index,1);
            }
            proposition.reponse = $scope.propositionAnnotationSelectionnee;
            $scope.propositionAnnotationSelectionnee = null;
        }else {
            alert("veuillez selectionner un element jaune")
        }
    };

    $scope.clickDeselectionnerPropositionRelationnelle = function (proposition) {
        if ($scope.question.type == "qcr"){
            $scope.question.enonceBListe.push(proposition.reponse);
            proposition.reponse = "-";
        }
    };

    $scope.clickDeselectionnerAnnotation = function (proposition) {
        if ($scope.question.type == "schema"){
            $scope.question.annotationListe.push(proposition.reponse);
            proposition.reponse = "-";
        }
    };

    $scope.clickButtonRadio = function (proposition) {
        angular.forEach($scope.question.propositions, function(p, key1){
            if(p!=proposition){
                p.checked = false;
            }else{
                p.checked = true;
            }
        });
    };

    $scope.compterPoints = function (partie) {
        points = 0;
        total = 0
        angular.forEach(partie.questions, function(question, key1){
            points = points + question.points;
            total = total + question.total;
        });
        partie["points"] = points;
        partie["total"] = total;
    };

    $scope.calculerScore = function () {
        points = 0;
        total = 0;
        angular.forEach($scope.questionsParties, function(partie, key1){
            points = points + partie.points;
            total = total + partie.total;
        });
        return points+"/"+total;
    };

    $scope.questionFait = function (question) {
        solution = false;
        angular.forEach(question.propositions, function(proposition, key1){
            if(proposition.checked){
                solution = true;
            }
        });
        return solution;
    };


    $scope.clickArreter = function () {
        if(confirm("Voulez-vous vraiment arrêter le quiz ?")==true){
            $scope.fin = true;
            var idFeuilleEleve = $("label[name='idFeuilleEleve']").attr("id");
            questions = [];
            note = 0;
            total = 0;
            angular.forEach($scope.questions, function(question, key1){
                solution = true;
                propositions = [];
                if((question.type=='ci') || (question.type=='qru') || (question.type=='qcm')){
                    angular.forEach(question.propositions, function(proposition, key2){
                        propositions.push({
                            "id": proposition.id,
                            "reponse": proposition.checked
                        });
                    });
                }
                if(question.type=='qcr'){
                    angular.forEach(question.propositions, function(proposition, key2){
                        propositions.push({
                            "id": proposition.id,
                            "reponse": proposition.reponse
                        });
                    });
                }
                if(question.type=='schema'){
                    angular.forEach(question.propositions, function(proposition, key2){
                        propositions.push({
                            "id": proposition.id,
                            "reponse": proposition.reponse
                        });
                    });
                }
                questions.push({
                    "idquestion": question.idQuestion,
                    "propositions": propositions,
                });
            });

            var data = {
                "idFeuilleEleve": idFeuilleEleve,
                "questions": JSON.stringify(questions),
            };
            $.ajax({
                url: "/api/devoir/soumettre/",
                type: "GET",
                dataType: 'json',
                data: data,
                success: function(result){
                    alert("succès");
                },
                error: function (result) {
                    alert(result.responseText);
                }
            });
        };
    };

    $scope.clickValider = function (question) {
        question.fait = true;
    };
});

app.directive('mathJaxBind', function() {
    var refresh = function(element) {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, element]);
    };
    return {
        link: function(scope, element, attrs) {
            scope.$watch(attrs.mathJaxBind, function(newValue, oldValue) {
                element.text(newValue);
                refresh(element[0]);
            });
        }
    };
});
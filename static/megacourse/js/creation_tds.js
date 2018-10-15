/**
 * Created by leo on 22/02/18.
 */
app.directive('mathjax',function(){
	return {
		restrict: 'EA',
		link: function(scope, element, attrs) {
			scope.$watch(attrs.ngModel, function () {
				MathJax.Hub.Queue(['Typeset',MathJax.Hub,element.get(0)]);
            });
		}
	};
});

app.controller('creation-devoir', function($scope, $http, $location) {

    idClass = $("label[name='classeID']").attr("id");
    groupeID = $("label[name='groupeID']").attr("id");
    debut = $("label[name='debut']").attr("id");
    fin = $("label[name='fin']").attr("id");

    $scope.devoirs = [];

    $http({
        method: 'GET',
        url: "/api/classe/devoirs/"+idClass+"/"
    }).then(function successCallback(response) {
        $scope.devoirs = response.data.devoirs;
    }, function errorCallback(response) {
        console.log(response);
    });

    $('input[type="date"]').prop('min', function(){
        return new Date(debut).toJSON().split('T')[0];
    });

    $('input[type="date"]').prop('max', function(){
        return new Date(fin).toJSON().split('T')[0];
    });
    function range1(i){
        return i?range1(i-1).concat(i):[]
    }



    var configurationCKEditor = {
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

    // prepare Options Object
    var options = {
        target:     '#divToUpdate',
        url: "/api/question/create/configuration/",
        beforeSend: function(xhr, settings) {
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
            xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
            console.log(getCookie('csrftoken'));
        },
        success: function(response, status, err) {
            console.log('Thanks for your comment!');
        },
        error: function (response, status, err) {
            console.log(response);
            $("#myModal").modal('hide');
        },
        complete: function (response, status, err) {
            if(response.status==200){
                form = response.responseText;
                $("#panel_question").hide();
                $("#proposition_body_form").append(form);
                $("#panel_propositions").show();

            }
        }
    };

    var optionsDevoir = {
        method: 'POST',
        url: "/api/devoir/save/"+idClass+"/",
        beforeSend: function(xhr, settings) {
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
            xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
            console.log(getCookie('csrftoken'));
        },
        success: function(response, status, err) {
            $("div[name='alert-success-devoir']").slideDown(1000).delay(15000).slideUp(800);
            $("#nouveauDevoirDiv").hide();
            document.getElementById("new_td").reset();
            $http({
                method: 'GET',
                url: "/api/classe/devoirs/"+idClass+"/"
            }).then(function successCallback(response) {
                $scope.devoirs = response.data.devoirs;
            }, function errorCallback(response) {
                console.log(response);
            });
        },
        error: function (response, status, err) {
            console.log(response);
            console.log("hummmmmmmmmmmmmmmmmmmmmmm");

        }
    };

    var optionsProposition = {
        target: '#divToUpdate',
        method: "POST",
        url: "/api/proposition/create/",
        beforeSend: function(xhr, settings) {
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
            xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
        },
        success: function(response, status, err) {
            console.log('Thanks for your comment!');
        },
        error: function (response, status, err) {
            console.log(response);
            $("#myModal").modal('hide');
        },
        complete: function (response, status, err) {
            $(".form-group").removeClass("has-error");
            $(".help-block").remove();
            if(response.responseJSON.success){
                propositions = JSON.parse(response.responseJSON.propositions);
                $("#my_propositions_liste").empty();
                divProposition = null;
                if(response.responseJSON.type=="qcm"||response.responseJSON.type=="ci"||response.responseJSON.type=="qru"){
                    $.each(propositions, function( index, proposition ) {
                        if(proposition.fields.solution==true){
                            divProposition = $("div[name='proposition_reponse']").clone();
                        }else {
                            divProposition = $("div[name='proposition_faux']").clone();
                        }
                        divProposition.attr("id", "proposition"+proposition.pk);
                        divProposition.find("div[name='texte']").append(proposition.fields.enonce);
                        divProposition.removeClass("hidden");
                        divProposition.removeAttr("name");
                        divProposition.find("a[name='supprimer_proposition']").attr("id", proposition.pk);
                        divProposition.find("a[name='supprimer_proposition']").attr("type-question", response.responseJSON.type);
                        $("#my_propositions_liste").append(divProposition);
                    });
                }
                if(response.responseJSON.type=="qcr"){
                    $.each(propositions, function( index, proposition ) {
                        divProposition = $("div[name='proposition_relationnelle']").clone();
                        divProposition.attr("id", "proposition"+proposition.pk);
                        divProposition.find("span[name='enonceA']").append(proposition.fields.enonceA);
                        divProposition.find("span[name='enonceB']").append(proposition.fields.enonceB);
                        divProposition.removeClass("hidden");
                        divProposition.removeAttr("name");
                        divProposition.find("a[name='supprimer_proposition']").attr("id", proposition.pk);
                        divProposition.find("a[name='supprimer_proposition']").attr("type-question", response.responseJSON.type);
                        $("#my_propositions_liste").append(divProposition);
                    });
                }
                if(response.responseJSON.type=="schema"){
                    $.each(propositions, function( index, proposition ) {
                        divProposition = $("div[name='proposition_relationnelle']").clone();
                        divProposition.attr("id", "proposition"+proposition.pk);
                        divProposition.find("span[name='enonceA']").append(proposition.fields.numero);
                        divProposition.find("span[name='enonceB']").append(proposition.fields.annotation);
                        divProposition.removeClass("hidden");
                        divProposition.removeAttr("name");
                        divProposition.find("a[name='supprimer_proposition']").attr("id", proposition.pk);
                        divProposition.find("a[name='supprimer_proposition']").attr("type-question", response.responseJSON.type);
                        $("#my_propositions_liste").append(divProposition);
                    });
                }
            }else {
                messages = response.responseJSON.message;
                for(var key in messages){
                    $("input[name='"+key+"']").parents(".form-group").addClass("has-error");
                    console.log($("input[name='"+key+"']").parents(".form-group"));
                    $("input[name='"+key+"']").parent().append("<span class='help-block'>"
                        + messages[key][0].message
                        + "</span>"
                    )
                }
            }
        }
    };

    $(document).on("click", "a[name='supprimer_proposition']", function() {
        //   console.log("inside";   <-- here it is
        idProposition = $(this).attr("id")
        typeQuestion = $(this).attr("type-question");
        if(confirm("Voulez-vous vraiment supprimer cette proposition ?")){
            $.ajax({
                url : "/api/proposition/supprimer/",
                type : 'GET',
                data : {"idProposition": idProposition, "type": typeQuestion},
                dataType : 'json',
                success : function(code_html, statut){ // success est toujours en place, bien sûr !
                    $("#proposition"+idProposition).remove();
                },
                error : function(resultat, statut, erreur){
                    console.log(resultat);
                }
            });
        }
    });

    $(document).on("click", "input[name='terminer']", function () {
        $("#myModal").modal('hide');
        $("div[name='alert-success']").slideDown(1000).delay(15000).slideUp(800);
    });

    $('#question').ajaxForm(options);
    $('#proposition').ajaxForm(optionsProposition);

    function gotoCreationExamens() {
        window.location.href = "";
    }

    consignes = CKEDITOR.replace( 'consignes', configurationCKEditor);

    consignes.on( 'change', function() {
        $("#id_consignes").val(consignes.getData());
    });

    enonce = CKEDITOR.replace( 'enonce', configurationCKEditor);

    enonce.on( 'change', function() {
        $("#id_enonce").val(enonce.getData());
    });

    explication = CKEDITOR.replace( 'explication', configurationCKEditor);

    explication.on( 'change', function() {
        $("#id_explication").val(explication.getData());
    });

    function creerTD() {
        $("#new_td").submit();
    }
    $scope.listeChapitres = null;
    $scope.coursActuel = null;
    $scope.classes = null;
    $scope.chapitres = null;
    $scope.chapitreActuel = null;
    $scope.questions = null;
    $scope.paginationTotal = null;
    $scope.pageActual = null;

    $scope.getChapitres = function (classe) {
        $http({
            method: 'GET',
            params : {"classeID":classe.idClass},
            url: "/api/classe/chapitres/"
        }).then(function successCallback(response) {
            $scope.chapitres = response.data.chapitres;
        });
    }

    $scope.getQuestionsOfChapitre = function (chapitre) {
        if(typeof chapitre !== "undefined"){
            $http({
                method: 'GET',
                params : {"id":chapitre.id},
                url: "/api/chapitre/questions/"
            }).then(function successCallback(response) {
                $scope.questions = response.data.reponses.questions;
                n = response.data.reponses.count % 2;
                j = Math.floor(response.data.reponses.count/2);
                if(n != 0) {
                    j = j + 1;
                }
                $scope.chapitreActuel = chapitre;
                $scope.paginationTotal = range1(j);
                $scope.pageActual = response.data.reponses.actual;
            });
        }
    }

    $scope.parseJson = function (json) {
        return JSON.parse(json);
    }

    $http({
        method: 'GET',
        params : {"groupeID": groupeID},
        url: "/api/groupe/classes/"
    }).then(function successCallback(response) {
        $scope.classes = response.data.classes;
        $scope.coursActuel = $scope.classes[0];
    });

    $scope.clickPagination = function (number) {
        $http({
            method: 'GET',
            params : {"id":$scope.chapitreActuel.id, "page":number},
            url: "/api/chapitre/questions/"
        }).then(function successCallback(response) {
            $scope.questions = response.data.reponses.questions;
            n = response.data.reponses.count % 2;
            j = Math.floor(response.data.reponses.count/2);
            if(n != 0) {
                j = j + 1;
            }
            $scope.paginationTotal = range1(j);
            $scope.pageActual = response.data.reponses.actual;
        });
    }

    $scope.clickCours = function(cours){
        $scope.coursActuel = cours;
        $scope.getChapitres(cours);
        if($scope.chapitres){
            $scope.chapitreActuel = $scope.chapitres[0];
        }
    }

    $scope.clickChapitre = function (chapitre) {
        $scope.getQuestionsOfChapitre(chapitre);
        console.log($scope.questions);
    }

    $scope.clickSupprimerQuestion = function(idQuestion){
        if(confirm("Voulez vous vraiment supprimer la question "+idQuestion+" ?")){
            $http({
                method: 'GET',
                params : {"idQuestion": idQuestion},
                url: "/api/questions/supprimer/"
            }).then(function successCallback(response) {
                $("#question"+idQuestion).remove();
            });
        }
    }



    $scope.clickAjouterQuestion = function (idQuestion) {
        text = $("textarea[name='numeroDesQuestions']").val();
        text = text + idQuestion + ";"
        $("textarea[name='numeroDesQuestions']").val(text);
        console.log(idQuestion);
        $("button[name='"+idQuestion+"']").addClass("hidden");
        $("button[name='supprimer"+idQuestion+"']").removeClass("hidden");
    };

    $scope.clickSupprimerQuestion = function (idQuestion) {
        text = $("textarea[name='numeroDesQuestions']").val();
        stext = text.replace(idQuestion+";", '');
        console.log(idQuestion);
        $("textarea[name='numeroDesQuestions']").val(stext);
        $("button[name='"+idQuestion+"']").removeClass("hidden");
        $("button[name='supprimer"+idQuestion+"']").addClass("hidden");
    };

    $scope.clickNouveauDevoir = function () {
        document.getElementById("new_td").reset();
        $("#nouveauDevoirDiv").show();
    };

    $scope.clickNouvelleQuestion = function () {
        document.getElementById("question").reset();
        explication.setData("Explication reponse");
        $("#id_explication").val("");
        $("#panel_propositions").hide();
        $("#panel_question").show();
        $("#proposition_body_form").empty();
        $("#my_propositions_liste").empty();
        enonce.setData("Enoncé de la question");
        $("#id_enonce").val("");
        $("#myModal").modal();
    };

    $scope.clickFermerNouveauDevoir = function () {
        $("#nouveauDevoirDiv").hide();
        document.getElementById("new_td").reset();
    };

    $("input[name='titre']").on('change', function () {
       text = $(this).val();
       if((text.length>50)||(text.length<10)){
           $("span[name='titreTaille']").show();
           $(this).addClass('error')
       }else{
           $("span[name='titreTaille']").hide();
           $(this).removeClass('error');
       }
    });

    $("input[name='dateDebut']").on('change', function () {
        debut = $(this).val();
        fin = $("input[name='dateFin']").val();
        /**
         * Date de fin vide
         */
        if(fin.length<=0){
            console.log(debut);
            console.log(fin);
        }else {
            if (new Date(debut)>new Date(fin)){
                $("span[name='dateFin']").show();
                $("input[name='dateFin']").addClass("error");
            }else {
                $("span[name='dateFin']").hide();
                $("input[name='dateFin']").removeClass("error");
            }
        }
    });

    $("input[name='dateFin']").on('change', function () {
        fin = $(this).val();
        debut = $("input[name='dateDebut']").val();
        /**
         * Date de fin vide
         */
        if(fin.length<=0){
            console.log(debut);
            console.log(fin);
        }else {
            if (new Date(debut)>new Date(fin)){
                $("span[name='dateFin']").show();
                $("input[name='dateFin']").addClass("error");
            }else {
                $("span[name='dateFin']").hide();
                $("input[name='dateFin']").removeClass("error");
            }
        }
    });

    $scope.allerCreationDevoir = function () {
        numeros = [];
        numerosManquants = [];
        angular.forEach($scope.chapitres, function(chapitre, key1){
            numeros.push(chapitre.numero);
        });
        var maxValue = numeros.reduce(function(a, b) { return Math.max(a, b); });
        var minValue = numeros.reduce(function(a, b) { return Math.min(a, b); });
        n=1;
        while(n<=maxValue){
            if(numeros.indexOf(n)==-1){
                numerosManquants.push(n);
            }
            n = n + 1;
        }
        if(numerosManquants.length==0){
            window.location.href = "/creation_tds/"+idClass+"/";
        }else {
            $("label[name='chapitres']").empty();
            angular.forEach(numerosManquants, function(num, key1){
                $("label[name='chapitres']").append(num + " ;");
            });
        }
    };

    $scope.modifierChapitre = function (chapitre) {
        $http({
            method: 'GET',
            params: {"chapitreID": chapitre.id},
            url: "/api/chapitre/all/info/"
        }).then(function successCallback(response) {
            angular.forEach(response.data.chapitre, function(value, key){
                if((key != "id")&&(key != "description")&&(key != "contenu")){
                    $("input[name='"+key+"']").val(value);
                }else {
                    if(key == "description"){
                        description.setData(value);
                    }
                    if(key == "contenu"){
                        $("textarea[name='contenu']").val(value);
                    }
                }
            });
            $("#myModal").modal();
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    $scope.clickSupprimerDevoir = function (devoirID) {
        $http({
            method: 'GET',
            url: "/api/devoir/supprimer/"+devoirID+"/"+idClass+"/"
        }).then(function successCallback(response) {
            $scope.devoirs = response.data.devoirs;
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    $scope.clickVoirDemoDevoir = function (devoirID) {
        window.open(
            "/quizz/demo/"+devoirID+"/",
            '_blank' // <- This is what makes it open in a new window.
        );
    };

    $scope.checkForm = function () {
        valide = true;
        titre = $("input[name='titre']").val();
        numeroDesQuestions = $("textarea[name='numeroDesQuestions']").val();
        debut = $("input[name='dateDebut']").val();
        fin = $("input[name='dateFin']").val();


        if(numeroDesQuestions.length==0){
            $("span[name='numeroDesQuestionsVide']").show();
            $("input[name='numeroDesQuestions']").addClass('error');
            valide = false;
        }else{
            $("span[name='numeroDesQuestionsVide']").hide();
            $("input[name='numeroDesQuestions']").removeClass('error');
        }

        if(titre.length==0){
            $("span[name='titreVide']").show();
            $("input[name='titre']").addClass('error');
            valide = false;
        }else{
            $("span[name='titreVide']").hide();
            $("input[name='titre']").removeClass('error');
        }

        if(consignes.getData().length==0){
            $("span[name='consignesVide']").show();
            $("input[name='consignes']").addClass('error');
            valide = false;
        }else {
            $("span[name='consignesVide']").hide();
            $("input[name='consignes']").removeClass('error');
        }

        if(fin.length==0){
            $("span[name='dateFinVide']").show();
            $("input[name='dateFinCours']").addClass('error');
            valide = false;
        }else{
            $("span[name='dateFinVide']").hide();
            $("input[name='dateFinCours']").removeClass('error');
            if (new Date(debut)>new Date(fin)){
                $("span[name='dateFin']").show();
                $("input[name='dateFinCours']").addClass("error");
                valide = false;
            }else {
                $("span[name='dateFin']").hide();
                $("input[name='dateFinCours']").removeClass("error");
            }
        }

        if(debut.length==0){
            $("span[name='dateDebutVide']").show();
            $("input[name='dateDebut']").addClass('error');
            valide = false;
        }else{
            $("span[name='dateDebutVide']").hide();
            $("input[name='dateDebut']").removeClass('error');
            if (new Date(debut)>new Date(fin)){
                $("span[name='dateFin']").show();
                $("input[name='dateFin']").addClass("error");
                valide = false;
            }else {
                $("span[name='dateFin']").hide();
                $("input[name='dateFin']").removeClass("error");
            }
        }

        if(valide==true){
            $('#new_td').ajaxSubmit(optionsDevoir);
        }else {
            console.log("il y a des erreur");
        }

    };
});
/**
 * Created by leo on 30/01/18.
 */
app.controller('creation-chapitre', function($scope, $http, $location) {
    idClass = $("label[name='classeID']").attr("id");

    $scope.chapitres = [];

    $http({
        method: 'GET',
        params: {"classeID": idClass},
        url: "/api/classe/chapitres/more/"
    }).then(function successCallback(response) {
        $scope.chapitres = response.data.chapitres;
        $scope.chapitres = $scope.chapitres.sort(function(chapitre1, chapitre2) {
            return chapitre1.numero - chapitre2.numero;
        });
    }, function errorCallback(response) {
        console.log(response);
    });

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

    var sprintf = function(str) {
        var args = arguments,
            flag = true,
            i = 1;

        str = str.replace(/%s/g, function() {
            var arg = args[i++];

            if (typeof arg === 'undefined') {
                flag = false;
                return '';
            }
            return arg;
        });
        return flag ? str : '';
    };

    var options = {
        target:     '#divToUpdate',
        url: "/api/classe/chapitre/save/",
        data : {"classeID": idClass},
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
            console.log(response);
        },
        error: function (response, status, err) {
            console.log(response);
        },
        complete: function (response, status, err) {
            if(status=="success"){
                $("div[name='alert-success-devoir']").slideDown(1000).delay(15000).slideUp(800);
                $http({
                    method: 'GET',
                    params: {"classeID": idClass},
                    url: "/api/classe/chapitres/more/"
                }).then(function successCallback(response) {
                    $scope.chapitres = response.data.chapitres;
                    $scope.chapitres = $scope.chapitres.sort(function(chapitre1, chapitre2) {
                        return chapitre1.numero - chapitre2.numero;
                    });
                }, function errorCallback(response) {
                    console.log(response);
                });
                $("#myModal").modal('hide');

            }
        }
    };

    debut = $("label[name='debut']").attr("id");
    fin = $("label[name='fin']").attr("id");

    $('input[type="date"]').prop('min', function(){
        return new Date(debut).toJSON().split('T')[0];
    });

    $('input[type="date"]').prop('max', function(){
        return new Date(fin).toJSON().split('T')[0];
    });

    $("#ajouter_chapitre").on('click', function () {
        document.getElementById("new_chapitre").reset();
        $("#myModal").modal();
    });

    description = CKEDITOR.replace( 'description', config_ckeditor);

    description.on( 'change', function() {
        // getData() returns CKEditor's HTML content.
        $("#id_description").val(description.getData());
    });

    if ( CKEDITOR.env.ie && CKEDITOR.env.version == 8 ) {
        document.getElementById( 'ie8-warning' ).className = 'tip alert';
    }


    $("input[name='titre']").on('change', function () {
       text = $(this).val();
       if((text.length>50)||(text.length<10)){
           $("span[name='titre']").show();
           $(this).addClass('error')
       }else{
           $("span[name='titre']").hide();
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
                $("input[name='dateFinCours']").addClass("error");
            }else {
                $("span[name='dateFin']").hide();
                $("input[name='dateFinCours']").removeClass("error");
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
                $("input[name='dateFinCours']").addClass("error");
            }else {
                $("span[name='dateFin']").hide();
                $("input[name='dateFinCours']").removeClass("error");
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

    $scope.checkForm = function () {
        valide = true;
        titre = $("input[name='titre']").val();
        contenu = $("textarea[name='contenu']").val();
        debut = $("input[name='dateDebut']").val();
        fin = $("input[name='dateFin']").val();
        numero = $("input[name='numero']").val();


        if(contenu.length==0){
            $("span[name='contenuVide']").show();
            $("input[name='contenu']").addClass('error');
            valide = false;
        }else{
            $("span[name='contenuVide']").hide();
            $("input[name='contenu']").removeClass('error');
        }

        angular.forEach($scope.chapitres, function(chapitre, key1){
            if(chapitre.numero==numero){
                $("span[name='numero']").show();
                $("input[name='numero']").addClass('error');
            }else {
                $("span[name='numero']").hide();
                $("input[name='numero']").removeClass('error');
            }
        });

        if(description.getData().length==0){
            $("span[name='descriptionVide']").show();
            $("input[name='description']").addClass('error');
            valide = false;
        }else {
            $("span[name='descriptionVide']").hide();
            $("input[name='description']").removeClass('error');
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
            $("span[name='dateOuvertureVide']").show();
            $("input[name='dateOuverture']").addClass('error');
            valide = false;
        }else{
            $("span[name='dateOuvertureVide']").hide();
            $("input[name='dateOuverture']").removeClass('error');
            if (new Date(debut)>new Date(fin)){
                $("span[name='dateFin']").show();
                $("input[name='dateFinCours']").addClass("error");
                valide = false;
            }else {
                $("span[name='dateFin']").hide();
                $("input[name='dateFinCours']").removeClass("error");
            }
        }

        if(valide==true){
            $('#new_chapitre').ajaxSubmit(options);
        }else {
            console.log("il y a des erreur");
        }

    }
});
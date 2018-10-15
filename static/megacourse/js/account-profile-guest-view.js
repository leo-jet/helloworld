
app.controller('guest', function($scope, $http, $location) {
    var options = {
        target:     '#divToUpdate',
        url: "/api/profile/save/",
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
        },
        complete: function (response, status, err) {
            if(status=="success"){
                window.location.reload(true);
            }
        }
    };

    $scope.clickNiveau = function () {
        console.log($scope.niveau);
        if($scope.niveau=="Terminale"){
            $("fieldset").removeClass("hidden");
            console.log($scope.niveau);
        }else{
            $("fieldset").addClass("hidden");
        }
    };

    $scope.formCheck = function () {
        valide = true;

        $("input[name='nom']").removeClass("error");
        $("input[name='prenom']").removeClass("error");
        $("input[name='dateNaissance']").removeClass("error");
        $("input[name='lieuNaissance']").removeClass("error");
        $("input[name='sexe']").removeClass("error");
        $("input[name='lieuEtablissement']").removeClass("error");
        $("input[name='telephone']").removeClass("error");
        $("input[name='etablissement']").removeClass("error");
        $("input[name='niveau']").removeClass("error");
        $("input[name='choix1']").removeClass("error");
        $("input[name='choix2']").removeClass("error");
        $("input[name='choix3']").removeClass("error");

        $("span[name='nom']").hide();
        $("span[name='prenom']").hide();
        $("span[name='dateNaissance']").hide();
        $("span[name='lieuNaissance']").hide();
        $("span[name='sexe']").hide();
        $("span[name='lieuEtablissement']").hide();
        $("span[name='telephone']").hide();
        $("span[name='etablissement']").hide();
        $("span[name='niveau']").hide();
        $("span[name='choix1']").hide();
        $("span[name='choix2']").hide();
        $("span[name='choix3']").hide();



        //Check if nom valid
        if($scope.nom){
            if($scope.nom.length == 0){
                valide = false;
                console.log("vide");
            }
        }else{
            valide = false;
            $("span[name='nom']").show();
            $("input[name='nom']").addClass("error");
            console.log("nom");
        }

        //Check if prenom valid
        if($scope.prenom){
            if($scope.prenom.length == 0){
                valide = false;
                console.log("prenom");
            }
        }else{
            valide = false;
            $("span[name='prenom']").show();
            $("input[name='prenom']").addClass("error");
            console.log("prenom");
        }

        //Check if dateNaissance valid
        if($scope.dateNaissance){
            if($scope.dateNaissance.length == 0){
                valide = false;
                console.log("vide");
            }
        }else{
            valide = false;
            $("span[name='dateNaissance']").show();
            $("input[name='dateNaissance']").addClass("error");
            console.log("dateNaissance");
        }

        //Check if lieuNaissance valid
        if($scope.lieuNaissance){
            if($scope.lieuNaissance.length == 0){
                valide = false;
                console.log("vide");
            }
        }else{
            valide = false;
            console.log("lieuNaissance");
            $("span[name='lieuNaissance']").show();
            $("input[name='lieuNaissance']").addClass("error");
        }

        //Check if sexe valid
        if($scope.sexe){
            if($scope.sexe.length == 0){
                valide = false;
                console.log("vide");
            }
        }else{
            valide = false;
            $("span[name='sexe']").show();
            $("select[name='sexe']").addClass("error");
            console.log("sexe");
        }

        //Check if lieuEtablissement valid
        if($scope.lieuEtablissement){
            if($scope.lieuEtablissement.length == 0){
                valide = false;
                console.log("vide");
            }
        }else{
            valide = false;
            $("span[name='lieuEtablissement']").show();
            $("input[name='lieuEtablissement']").addClass("error");
            console.log("lieuEtablissement");
        }

        //Check if telephone valid
        if($scope.telephone){
            console.log($scope.telephone);
            if($scope.telephone.length == 0){
                valide = false;
                console.log("vide");
            }
        }else{
            valide = false;
            $("span[name='telephone']").show();
            $("input[name='telephone']").addClass("error");
            console.log("telephone");
        }

        //Check if etablissement valid
        if($scope.etablissement){
            if($scope.etablissement.length == 0){
                valide = false;
                console.log("vide");
            }
        }else{
            valide = false;
            $("span[name='etablissement']").show();
            $("input[name='etablissement']").addClass("error");
            console.log("etablissement");
        }

        if($scope.niveau=="Terminale") {

            //Check if choix1 valid
            if ($scope.choix1) {
                if ($scope.choix1.length == 0) {
                    valide = false;
                    console.log("vide");
                }
            } else {
                valide = false;
                $("span[name='choix1']").show();
                $("select[name='choix1']").addClass("error");
                console.log("choix1");
            }

            //Check if choix2 valid
            if ($scope.choix2) {
                if ($scope.choix2.length == 0) {
                    valide = false;
                    console.log("vide");
                }
            } else {
                valide = false;
                $("span[name='choix2']").show();
                $("select[name='choix2']").addClass("error");
                console.log("choix2");
            }

            //Check if choix3 valid
            if ($scope.choix3) {
                if ($scope.choix3.length == 0) {
                    valide = false;
                    console.log("vide");
                }
            } else {
                valide = false;
                $("span[name='choix3']").show();
                $("select[name='choix3']").addClass("error");
                console.log("choix3");
            }

            if(($scope.choix1==$scope.choix2)||($scope.choix1==$scope.choix3)||($scope.choix2==$scope.choix3)){
                alert("Les souhaits de formation doivent être différents");
                valide = false;
            }

        }

        //Check if niveau valid
        if($scope.niveau){
            if($scope.niveau.length == 0){
                valide = false;
                console.log("vide");
            }
        }else{
            valide = false;
            console.log("niveau");
            $("span[name='niveau']").show();
            $("select[name='niveau']").addClass("error");
        }

        if(valide==true){
            $("form[name='editProfile']").ajaxSubmit(options);
        }

    }
});
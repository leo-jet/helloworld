/**
 * Created by leo on 21/02/18.
 */

app.controller('create_basic_information', function($scope, $http, $location) {

    $("input[name='submit']").on('click', function () {
        $("form[name='envoyer']").submit();
    });

    console.log("sdfsdfdf");

    ckeditor_config =  {
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

    description = CKEDITOR.replace( 'description',ckeditor_config);

    description.on( 'change', function() {
        // getData() returns CKEditor's HTML content.
        $("#id_description").val(description.getData());
    });

    if ( CKEDITOR.env.ie && CKEDITOR.env.version == 8 ) {
        document.getElementById( 'ie8-warning' ).className = 'tip alert';
    }

     $('input[type="date"]').prop('min', function(){
        return new Date().toJSON().split('T')[0];
    });

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

    $("input[name='dateOuverture']").on('change', function () {
        debut = $(this).val();
        fin = $("input[name='dateFinCours']").val();
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

    $("input[name='dateFinCours']").on('change', function () {
        fin = $(this).val();
        debut = $("input[name='dateOuverture']").val();
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

    $("input[name='dateFinInscription']").on('change', function () {
        finInscription = $(this).val();
        debut = $("input[name='dateOuverture']").val();
        fin = $("input[name='dateFinCours']").val();
        /**
         * Date de fin vide
         */
        if(finInscription.length<=0){
            console.log(debut);
            console.log(fin);
        }else {
            if((new Date(debut)>new Date(finInscription)) || (new Date(fin)<new Date(finInscription))){
                $("span[name='dateFinInscription']").show();
                $(this).addClass("error");
            }else {
                $("span[name='dateFinInscription']").hide();
                $(this).removeClass("error");
            }
        }
    });

    $scope.checkForm = function () {
        valide = true;
        titre = $("input[name='titre']").val();
        montant = $("input[name='montant']").val();
        finInscription = $("input[name='dateFinInscription']").val();
        debut = $("input[name='dateOuverture']").val();
        fin = $("input[name='dateFinCours']").val();

        if($("input[name='logo']").get(0).files.length == 0){
            $("span[name='logoVide']").show();
            $("input[name='logo']").addClass('error');
            valide = false;
        }else{
            $("span[name='logoVide']").hide();
            $("input[name='logo']").removeClass('error');
        }

        if(montant < 0){
            $("span[name='montant']").show();
            $("input[name='montant']").addClass('error');
            valide = false;
        }else{
            $("span[name='montant']").hide();
            $("input[name='montant']").removeClass('error');
        }

        if(titre.length==0){
            $("span[name='titreVide']").show();
            $("input[name='titre']").addClass('error');
            valide = false;
        }else{
            $("span[name='titreVide']").hide();
            $("input[name='titre']").removeClass('error');
            if((titre.length>50)||(titre.length<10)){
                $("span[name='titre']").show();
                $("input[name='titre']").addClass('error');
                valide = false;
            }else{
                $("span[name='titre']").hide();
                $("input[name='titre']").removeClass('error');
            }
        }

        if(description.getData().length==0){
            $("span[name='descriptionVide']").show();
            $("input[name='description']").addClass('error');
            valide = false;
        }else {
            $("span[name='descriptionVide']").hide();
            $("input[name='description']").removeClass('error');
        }

        if(finInscription.length==0){
            $("span[name='dateFinInscriptionVide']").show();
            $("input[name='dateFinInscription']").addClass('error');
            valide = false;
        }else{
            $("span[name='dateFinInscriptionVide']").hide();
            $("input[name='dateFinInscription']").removeClass('error');
            if((new Date(debut)>new Date(finInscription)) || (new Date(fin)<new Date(finInscription))){
                $("span[name='dateFinInscription']").show();
                $(this).addClass("error");
                valide = false;
            }else {
                $("span[name='dateFinInscription']").hide();
                $(this).removeClass("error");
            }
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
            $("form[name='form_basic']").submit();
        }else {
            console.log("il y a des erreur");
        }

    }
});
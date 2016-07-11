
angular.module('starter.controllers', [])
.controller('LoginCtrl', function($scope,$state,$q, UserService, $ionicLoading,$ionicModal,$ionicPopup) {


    $ionicModal.fromTemplateUrl('templates/signup.html', {
        id: 'signup',
        scope: $scope,
        animation: 'slide-in-up', //slide-in-up',
        focusFirstInput: true

    }).then(function(modal) {
        $scope.modalsignup = modal;
    });

    $scope.openSignUp = function (){
        $scope.modalsignup.show();
    };
    $scope.closeSignUp = function (){
        $scope.modalsignup.hide();
    };

    $scope.loginData = {
        "email": '',
        "password": ''
    };
    $scope.signUpData = {
        'name': '',
        'surname': '',
        "email": '',
        "password": '',
        "username":''
    };

    $scope.check={"password":''};
    $scope.showAlert = function(title,text) {

            var alertPopup = $ionicPopup.alert({
                title: title,
                template: text
            });

            alertPopup.then(function(res) {
                $scope.check.password='';
                $scope.loginData.password='';
            });
        };

    $scope.signUp = function(){
        if($scope.signUpData.name==''||
           $scope.signUpData.surname==''||
           $scope.signUpData.username==''||
           $scope.signUpData.email==''||
           $scope.signUpData.password==''||
           $scope.check.password==''
          )
            $scope.showAlert("Inserisci valori validi");
        else{

            if($scope.signUpData.password != $scope.check.password){
               $scope.showAlert("Password must be the same");
               // e.preventDefault();
            }else{
                if($scope.signUpData.password.length<6){
                    $scope.showAlert("Password too short");
                }else{
                        console.log("dentro register");
                        console.log("Campi registrazione pieni");
                        myUrl=  "http://rentme.altervista.org/registration.php?" +
                                "name="        +  $scope.signUpData.name    +
                                "&surname="     +   $scope.signUpData.surname    +
                                "&email="       +   $scope.signUpData.email     +
                                "&loginType="   +   'rentMe'                                    +
                                "&password="    +  $scope.signUpData.password   ;
                        console.log("ciaaaaaooo!!11!!");

                        xhttp = new XMLHttpRequest;
                        xhttp.open("GET", myUrl, false);
                        xhttp.send();
                        jUser=xhttp.response;
                        if(JSON.parse(jUser).uRentMe!=null){
                            localStorage.setItem("userData",jUser);
                            $scope.closeSignUp();
                        }else{
                            console.log("ERROR");
                            console.log(jUser);
                            $scope.showAlert("Email già esistente");
                            //navigator.notification.alert(JSON.parse(jUser).message, reload, JSON.parse(jUser).title);
                        }
                }
            }
        }
    };

    $scope.login = function(){
       /* var authProvider = 'basic';
        var authSettings = { 'remember': true };
        var authSuccess = function(userRes) {
             $scope.user = Ionic.User.current();
            console.log("login");
            console.log(Ionic.User.current());

            $scope.startApp();

          // user was authenticated, you can get the authenticated user
          // with Ionic.User.current();
        };
        var authFailure = function(errors) {
            $scope.showAlert("Wrong e-mail or password");
          for (var err in errors) {
             console.log(err);
            // check the error and provide an appropriate message
            // for your application
          }
        };*/
        //Ionic.Auth.login(authProvider, authSettings, $scope.loginData).then(authSuccess, authFailure);
        console.log("tutto ok");

        myUrl=  "http://rentme.altervista.org/login.php?" +
                "email="       +   $scope.loginData.email      +
                "&loginType="   +   'rentMe'                                    +
                "&password="    +   $scope.loginData.password  ;

        xhttp = new XMLHttpRequest;
        xhttp.open("GET", myUrl, false);
        xhttp.send();
        jUser=xhttp.response;
        if(JSON.parse(jUser).uRentMe!=null){
            $scope.user = jUser;
            console.log("dentro");
            localStorage.setItem("userData",jUser);
            $scope.startApp();
             $scope.loginData.email = "";
            $scope.loginData.password="";
        }else{
            $scope.showAlert("Dati non corretti");
            //navigator.notification.alert(JSON.parse(jUser).message, reload, JSON.parse(jUser).title);
        }
    };

     $scope.startApp = function(){
        $state.go('tab.search');
    };
})

.controller('AppCtrl', function($scope,$state,UserService,$ionicModal,$ionicPopup, $cordovaCamera, ModificaPasswordController, RentPubblicatiList, BozzeList, FavouriteList,ContactsList) {
    $scope.$on('$ionicView.enter', function () {
    console.log("abc");
    $scope.user = JSON.parse(localStorage.getItem("userData"));
  });

    var myUserId = JSON.parse(localStorage.getItem("userData")).idRENTME;

    RentPubblicatiList.call(myUserId);
    BozzeList.call(myUserId);
    FavouriteList.call(myUserId);

    $scope.logout = function(){
        console.log("logout");

        $scope.user={};
        localStorage.clear();
        $state.go('login');


    };

    $scope.platform = ionic.Platform.platform();
    $scope.showLoading = function() {
    //options default to values in $ionicLoadingConfig
    $ionicLoading.show().then(function(){
       console.log("The loading indicator is now displayed");
    });
  };



    $ionicModal.fromTemplateUrl('templates/contacts.html', {
        id: 'edit',
        scope: $scope,
        animation: 'null', //slide-in-up',
        focusFirstInput: true

    }).then(function(modal) {
        $scope.modalContacts = modal;
    });
    $scope.openContacts = function (){
        console.log("dentro");
        $scope.user = JSON.parse(localStorage.getItem("userData"));
        console.log($scope.user.idRENTME);
        ContactsList.call($scope.user.idRENTME);
        $scope.contatti = ContactsList.getConArray();
        $scope.modalContacts.show();
    };
    $scope.closeContacts = function (){
        $scope.modalContacts.hide();
        ContactsList.clear();
    };

    $ionicModal.fromTemplateUrl('templates/editData.html', {
        id: 'editData',
        scope: $scope,
        animation: 'slide-in-up', //slide-in-up',
        focusFirstInput: true

    }).then(function(modal) {
        $scope.modalEditData = modal;
    });


    $scope.openEditData = function (){
        console.log("Open");
        $scope.modalEditData.show();
        $scope.confermaDisabilitata = true;
        $scope.pwDiverse = false;
    };
    $scope.closeEditData = function (){
        $scope.resetSettings();
        $scope.modalEditData.hide();

    };

    $scope.showAlert = function(string) {

            var alertPopup = $ionicPopup.alert({
                title: 'ERROR',
                template: string
            });

            alertPopup.then(function(res) {
                $scope.check.password='';
                $scope.edit.password='';
            });
        };


    $scope.edit={
        "image":'',
        "password":'',
        "check": ''
    };
  /*  $scope.confirmPw = function(){

            if($scope.edit.check==$scope.edit.password){
                if($scope.edit.password.length>5){
                   myUrl=  "http://rentme.altervista.org/changePassword.php?" +
                            "id="       +   $scope.user.idRENTME      +
                            "&loginType="   +   'rentMe'                                    +
                            "&password="    +   $scope.edit.password  ;
                    xhttp = new XMLHttpRequest;
                    xhttp.open("GET", myUrl, false);
                    xhttp.send();
                    jUser=xhttp.response;

                    $scope.closeContacts();
                }else{
                    $scope.showAlert("Password too short");
                }
            }else{
                $scope.showAlert("Password must be the same");
            }

    };*/

    $scope.takeProfileImage = function(){
        var options = {
            quality: 80,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 250,
            targetHeight: 250,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.user.picture = "data:image/jpeg;base64," + imageData;

             myUrl=  "http://rentme.altervista.org/IONIC/changeProfilePicture.php?" +
                            "id_user="+   $scope.user.idRENTME+
                            "&new_picture="+   $scope.user.picture;
                            ;
            xhttp = new XMLHttpRequest;
            xhttp.open("GET", myUrl, false);
            xhttp.send();
            jResponse=xhttp.response;

        }, function(err) {
            // error
        });
    }

    $scope.pwList= ModificaPasswordController.getPwArray();


    $scope.focusOutPw1 = function(){
        console.log($scope.pwList.pw1);
        console.log($scope.pwList.pw2);

        if($scope.pwList.pw1 != ""){
            $scope.needRepeatPassword = true;
        }
        else{
            $scope.resetSettings();
        }

        if($scope.pwList.pw1 == $scope.pwList.pw2 && $scope.pwList.pw1 != ""){
            $scope.confermaDisabilitata = false;
            $scope.pwDiverse = false;
        }
        else if($scope.pwList.pw2 != null && $scope.pwList.pw2 != ""){
            $scope.pwDiverse = !$scope.pwDiverse;
            $scope.confermaDisabilitata = true;
        }
    }

    $scope.focusOutPw2 = function(){
        console.log($scope.pwList.pw2);
        if($scope.pwList.pw1 == $scope.pwList.pw2 && $scope.pwList.pw1 != ""){
            $scope.confermaDisabilitata = false;
            $scope.pwDiverse = false;
        }
        else{
            $scope.pwDiverse = true;
            $scope.confermaDisabilitata = true;
        }
    }

    $scope.confirmData = function(){
        console.log("Modifica dati");

        myUrl=  "http://rentme.altervista.org/changePassword.php?" +
                            "id="       +   $scope.user.idRENTME      +
                            "&loginType="   +   'rentMe'                                    +
                            "&password="    +   $scope.pwList.pw1  ;
        xhttp = new XMLHttpRequest;
        xhttp.open("GET", myUrl, false);
        xhttp.send();
        jResponse=xhttp.response;

        $scope.closeEditData();
    }

    $scope.resetSettings = function(){
        $scope.pwList.pw1 = "";
        $scope.pwList.pw2 = "";

        $scope.needRepeatPassword = false;
        $scope.confermaDisabilitata = true;
        $scope.pwDiverse = false;
    }


})

.controller('ContactsCtrl', function($scope,$state,$ionicModal,ContactsList) {


    $scope.inviaEmail = function(mail){
        var url = "mailto:"+mail;

        window.location.href =url;



    };
})

// TAB-SEARCH Controller
.controller('SearchCtrl', function($scope,$state, $ionicModal, $timeout, $ionicPopup,ResultList) {


    $scope.modalData = {"choice" : '-1',
                        "dist": 0,
                        "curPos" : 'Posizione Attuale',
                        "zone" : '  Seleziona una zona',
                        "address" : '',
                        "place" : 'Seleziona',
                        "type" : 'Seleziona',
                        "priceStart" : 'Da',
                       "priceEnd": 'A'};

    // Create the modal that we will use later
    $ionicModal.fromTemplateUrl('templates/search/modalPlace.html', {
        id: 'place',
        scope: $scope,
        animation: 'null', //slide-in-up',
        focusFirstInput: true

    }).then(function(modal) {
        $scope.modalPlace = modal;
    });
    $ionicModal.fromTemplateUrl('templates/search/modalType.html', {
        id: 'type',
        scope: $scope,
        animation: 'null', //slide-in-up',
        focusFirstInput: true

    }).then(function(modal) {
        $scope.modalType = modal;
    });
    $ionicModal.fromTemplateUrl('templates/search/modalPrice.html', {
        id: 'price',
        scope: $scope,
        animation: 'null', //slide-in-up',
        focusFirstInput: true
    }).then(function(modal) {
        $scope.modalPrice = modal;
    });
    // Triggered in the modal to close it
    $scope.closeModal = function($string) {
        switch($string){
            case 'place':
                $scope.modalPlace.hide();
                break;
            case 'type':
                $scope.modalType.hide();
                break;
            case 'price':
                $scope.modalPrice.hide();
                break;
        }

    };
    // Open the modal
    $scope.openModal = function($string) {
        switch($string){
            case 'place':
                $scope.modalData.zone="Scegli una zona";
                $scope.modalData.address="";
                $scope.modalPlace.show();
                break;
             case 'type':
                $scope.modalType.show();
                break;
            case 'price':
                $scope.modalPrice.show();
                break;
        }
    };
    // Perform the login action when the user submits the login form

     $scope.checkSearchField = function(e){
        $scope.showAlert = function() {
            var alertPopup = $ionicPopup.alert({
                template: 'Scegli un luogo'
            });

            alertPopup.then(function(res) {});
        };
        if($scope.modalData.place == 'Seleziona'){
           $scope.showAlert();
           // e.preventDefault();
        }else{
           ResultList.call($scope.modalData.zone,$scope.modalData.address,$scope.modalData.type,$scope.modalData.priceStart,$scope.modalData.priceEnd);
            ResultList.near($scope.modalData.dist);
            setTimeout(function(){
                $state.go('tab.result');
            }, 1500);


        }
    };






})

.controller('ResultCtrl', function($scope,ResultList) {


    $scope.elencoRes = ResultList.getResArray();

    $scope.removeRes = function(ss){
            ResultList.rimuovi(ss);
        }

})


.controller('ResultDetailCtrl', function($scope, $stateParams, ResultList, FavouriteList) {

    $scope.f = ResultList.getAnnuncio($stateParams.resId);
    $scope.addContact = function(mail){
        $scope.user = JSON.parse(localStorage.getItem("userData"));
         var myUrl=  "http://rentme.altervista.org/IONIC/addContact.php?" +
                "idRENTME="       +  $scope.user.idRENTME     +
                "&mail="   +  mail;
            ;

        console.log("Aggiungo contatto..");
        xhttp = new XMLHttpRequest;
        xhttp.open("GET", myUrl, false);
        xhttp.send();
        var resultCall=xhttp.response;
    };
    $scope.inviaEmail = function(){
        $scope.addContact($scope.f.email);
        var url = "mailto:"+$scope.f.email+"?subject="+$scope.f.titolo+"&body=Ciao,%0D%0Asono interessato al tuo annuncio:%0D%0A%0D%0ATITOLO:"+$scope.f.titolo+
                "%0D%0A%0D%0ADescrizione:"+$scope.f.descrizione+
                "%0D%0AIndirizzo:"+$scope.f.indirizzo+
                "%0D%0AZona:"+$scope.f.zona+
                "%0D%0ATipo:"+$scope.f.tipo+
                "%0D%0APiano:"+$scope.f.piano+
                "%0D%0ANumero Locali:"+$scope.f.num_locali+
                "%0D%0APrezzo:"+$scope.f.prezzo +
                "%0D%0A%0D%0AAspetto tue notizie ed un eventuale incontro.%0D%0ASaluti";

        window.location.href =url;



    };

    $scope.getClass = function(){
        $scope.isPreferito = FavouriteList.getFavourite($stateParams.resId)!=null?true:false;
        console.log($scope.isPreferito);
        if($scope.isPreferito){
            return "preferitiColor";
        }
        else{
            return "nonPreferitiColor";
        }
    }

    $scope.addToPreferiti = function(){

        if($scope.isPreferito){
            console.log("Sto rimuovendo");
            FavouriteList.rimuoviPreferito($stateParams.resId);

            myUrl=  "http://rentme.altervista.org/IONIC/rimuovi_preferito.php?" +
                        "id_preferito=" +   $scope.f.preferitoID
                    ;
                xhttp = new XMLHttpRequest;
                xhttp.open("GET", myUrl, false);
                xhttp.send();
                jResponse=xhttp.response;
                return true;
        }
        else{
            FavouriteList.aggiungi($scope.f);

             myUrl=  "http://rentme.altervista.org/IONIC/salva_preferito.php?" +
                        "id_annuncio="       +   $scope.f.id_annuncio      +
                        "&id_utente="   +   $scope.f.id_utente
                    ;
                xhttp = new XMLHttpRequest;
                xhttp.open("GET", myUrl, false);
                xhttp.send();
                jResponse=xhttp.response;
                return true;
            }
    }

})

.controller('modalPlaceCtrl', function($scope, $ionicModal) {
  $scope.zones = ["Centro",
                  "Citta Studi",
                  "Corso Buenos Aires",
                  "Porta Garibaldi",
                  "Fiera - San Siro",
                  "Navigli",
                  "Porta Romana",
                  "Porta Vittoria"
                 ];
  
  $ionicModal.fromTemplateUrl('templates/search/modalZone.html', {
    scope: $scope,
    animation: 'null', //slide-in-up',
    focusFirstInput: true
  }).then(function(modal) {
    $scope.modalZone = modal;
  });
  
  $scope.openModalZone = function() {
    $scope.modalData.choice = 2;
    $scope.modalZone.show();
  };
    
  $scope.hideModalZone = function() {
        $scope.modalZone.hide();
  };
  
  $scope.doSomething = function(item,n) {
      switch(n){
          case 1:
              $scope.modalData.choice = 1;
              $scope.modalData.zone = 'Scegli una zona';
              $scope.modalData.address = '';
              $scope.modalData.place = $scope.modalData.curPos;
              $scope.modalData.dist = item;
              $scope.submit('place',1);
              break;
          case 2:
              $scope.modalData.choice = 2;
              $scope.modalData.zone = item;
              $scope.modalData.address = '';
              $scope.modalData.place = $scope.modalData.zone;
               $scope.modalData.dist = 0;
              $scope.modalZone.hide();
              $scope.submit('place',2);
              break;
          case 3:
                 $scope.modalData.dist = 0;
              $scope.modalData.zone = 'Scegli una zona';
              break;
      }

  };

  $scope.submit = function($string,n) {
    $scope.modalData.choice=n;
        switch($scope.modalData.choice){
            case 1:
                $scope.modalData.place = $scope.modalData.dist +"Km Vicino a te";
                break;
            case 2:
                $scope.modalData.place = $scope.modalData.zone;
                break;
            case 3:
                $scope.modalData.choice = 3;
                $scope.modalData.place = $scope.modalData.address;
                break;
        }
        //$scope.modalPlace = $string;
        //$scope.modalData.zone = 'Select';
        //$scope.modalData.place = $scope.modalData.address;
        $scope.closeModal($string);
    };
})
.controller('modalTypeCtrl', function($scope, $ionicModal) {
    $scope.types = ['Seleziona','Appartamento','Stanza Condivisa','Stanza Singola'];
     $scope.doSomething = function(item) {
        // console.log(item);
         $scope.modalData.type = item;
          $scope.closeModal('type');
     }
})
.controller('modalPriceCtrl', function($scope, $ionicModal, $ionicPopup) {
    $scope.pricesS = [0,100,200,300,400,500,600,700,800,900,1000];
    $scope.pricesE = [0,100,200,300,400,500,600,700,800,900,1000];
    //$scope.priceStart = '0';
   // $scope.priceEnd = '0';
    $scope.doSomething = function(item,n) {
        console.log(item);
        switch(n){
            case 1:
                $scope.modalData.priceStart = item;
                break;
            case 2:
                $scope.modalData.priceEnd = item;
                break;
        }
     };
    $scope.check = function (){
        if($scope.modalData.priceStart >= $scope.modalData.priceEnd)
           $scope.showAlert();
        else
            $scope.closeModal('price');
    };
    $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
             template: 'Intervallo errato'
        });

        alertPopup.then(function(res) {
            $scope.modalData.priceEnd = $scope.modalData.priceStart + 100;
            console.log($scope.modalData.priceEnd);
        });
    };
})

.controller('ResultMapCtrl', function($scope, $ionicLoading, $compile, ResultList) {

    console.log("RISULTATI MAPPA CTRL");
    function initialize() {
        var geocoder = new google.maps.Geocoder();
        var myLatlng = new google.maps.LatLng(45.4642200,9.1905600);


        var mapOptions = {
            center: myLatlng,
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true
        };

        var map = new google.maps.Map(document.getElementById("searchMap"), mapOptions);
        $scope.searchMap=map;
        var address, title, imgSrc, zone, idAnnuncio, price;
        ResultList.getResArray().forEach(function(elem){

            address= elem.indirizzo;
            title=elem.titolo;
            imgSrc= elem.imgPreview;
            zone= elem.zona;
            idAnnuncio= elem.id_annuncio;
            price= elem.prezzo

            var contentString =
                '<a href="#/tab/search/result/'+idAnnuncio+'" style="text-decoration:none">'+
                    '<div style="text-align:center">'+
                        '<img src="'+imgSrc+'" style="display:block; margin-left:auto; margin-right:auto;width:9em;height:7em;"/>'+
                        '<h5>'+title+'</h5>'+
                        '<h5>'+zone+' - '+price+'€ </h5>'+
                    '</div>'+
                '</a>'
                       ;
            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            geocoder.geocode( { 'address': address}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location,
                        title: elem.via
                    });

                    google.maps.event.addListener(marker, 'click', function() {
                        console.log("Inforview clicked");
                        infowindow.close();
                        infowindow.open(map,marker);
                    });
                }
                else {
                    console.log("Geocode was not successful for the following reason: " + status);
                }
            });

        });
    }

    ionic.Platform.ready(initialize);

    $scope.centerResultOnMe = function() {
        console.log("Finding you.. ");
        if(!$scope.searchMap) {
          return;
        }

        navigator.geolocation.getCurrentPosition(function(pos) {
            $scope.searchMap.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));

            var userLatlng = new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
            var marker = new google.maps.Marker({
                        map: $scope.searchMap,
                        position: userLatlng,
                        title: "Te"
                    });

        }, function(error) {
            alert('Unable to get location: ' + error.message);
        });
    };

    $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
    };

})


// TAB-AFFITTA Controller
.controller('RentCtrl', function($scope,ManageRentTabs) {
    //console.log("Rent Controller");
    /*if(ManageRentTabs.getBackFromBozze()){
        console.log("Da bozze");
        $scope.selectedtab = 'boz';
        ManageRentTabs.getBackFromBozze(false);
    }
    else{
        $scope.selectedTab = 'pub';
        console.log("Altro!");
    }*/

    $scope.selectedTab = 'pub';//ManageRentTabs.get();
    $scope.set = function(str){
        ManageRentTabs.set(str);
        $scope.selectedTab = ManageRentTabs.get();

    };
    var myEl = angular.element( document.querySelector( '#divID' ) );
    myEl.removeClass('red');
})
.controller('RentPubblicatiCtrl', function($scope, RentPubblicatiList,ManageRentTabs) {

    //console.log("Pubblicati Controller");
     $scope.selectedTab = ManageRentTabs.get();
    $scope.elencoPubblicati = RentPubblicatiList.getPubblicatiArray();

    $scope.removePubblicato = function(ss){
        RentPubblicatiList.rimuoviPubblicato(ss);
    };

})

.controller('RentBozzeCtrl', function($scope, BozzeList,ManageRentTabs){
    //console.log("Bozze Controller");
      $scope.selectedTab = ManageRentTabs.get();
    $scope.elencoBozze = BozzeList.getBozzeArray();

    $scope.removeBozza = function(ss){
        BozzeList.rimuoviBozza(ss);
    };
})

.controller('RentDetailCtrl', function($scope,$state, $stateParams, RentPubblicatiList,ManageRentTabs) {

    $scope.e = RentPubblicatiList.getPubblicato($stateParams.rentID);
     $scope.myGoBack = function(){
        //ManageRentTabs.set('pub');
        $state.go('tab.rent.pubblicati');
       // $ionicHistory.goBack();
    }
})

.controller('BozzeDetailCtrl', function($scope,$state, $stateParams, BozzeList, $ionicActionSheet, $timeout, $ionicHistory, RentPubblicatiList, $cordovaCamera,ManageRentTabs) {

    $scope.e = BozzeList.getBozza($stateParams.bozzaID);
    $scope.myGoBack = function(){

        //ManageRentTabs.set('boz');
        $state.go('tab.rent.bozze');
       // $ionicHistory.goBack();
    }


    $scope.checkField = function(){
        console.log("Checking.. ");

        if($scope.e.titolo!=""){
            $scope.prezzoClass="";

            if($scope.e.prezzo!=""){
                $scope.prezzoClass="";

                if($scope.e.tipo!=""){
                    if($scope.e.zona!=""){
                        if($scope.e.indirizzo!=""){
                            if($scope.e.piano!=""){
                                if($scope.e.num_locali!=""){
                                    if($scope.e.superficie!=""){
                                        if($scope.e.posti_letto_tot!=""){
                                            if($scope.e.metro!=""){
                                                if($scope.e.autobus!=""){
                                                    if($scope.e.tram!=""){
                                                        if($scope.e.treno!=""){
                                                            if($scope.e.descrizione!=""){
                                                                $scope.showBozzeSheet();
                                                            }
                                                            else{
                                                                console.log("Errore descrizione");
                                                            }
                                                        }
                                                        else{
                                                            console.log("Error treno");
                                                        }
                                                    }
                                                    else{
                                                        console.log("Error tram");
                                                    }
                                                }
                                                else{
                                                    console.log("Error autobus");
                                                }
                                            }
                                            else{
                                                console.log("Error metro");
                                            }
                                        }
                                        else{
                                            console.log("Error posti letto totali");
                                        }
                                    }
                                    else{
                                        console.log("Error superficie");
                                    }
                                }
                                else{
                                    console.log("Error locali");
                                }
                            }
                            else{
                                console.log("Error piano");
                            }
                        }
                        else{
                            console.log("Error indirizzo");
                        }
                    }
                    else{
                        console.log("Error zona");
                    }
                }
                else{
                    console.log("Error tipo");
                }
            }
            else{
                console.log("Error prezzo");
                $scope.prezzoClass="bozzaError";
            }
        }
        else{
            console.log("Errore titolo");
            $scope.titoloClass="bozzaError";
        }
    }

    $scope.showBozzeSheet = function() {

   // Show the action sheet
   var hideSheet = $ionicActionSheet.show({
     buttons: [
       { text: 'Crea Annuncio' }
     ],
     titleText: 'Vuoi creare l\'annuncio?' ,
     cancelText: 'Annulla',
     cancel: function() {
          // add cancel code..
        },
     buttonClicked: function(index) {
         console.log("Annuncio-Bozza inviare al DB");
         RentPubblicatiList.AddNewElement($scope.e);

         console.log("ID_ANNUNCIO: ")
         console.log($scope.e.id_annuncio)
         console.log("ID_UTENTE: ")
         console.log($scope.e.id_utente)
         console.log("LAt - Long: ")
         console.log($scope.e.lat)
         console.log($scope.e.long)

         var myUrl=  "http://rentme.altervista.org/IONIC/salva_nuovoAnnuncio.php?" +
                "id_annuncio="       +   $scope.e.id_annuncio      +
                "&id_utente="   +   $scope.e.id_utente       +
                "&descrizione="    +   $scope.e.descrizione  +
                "&autobus="    +   $scope.e.autobus  +
                "&metro="    +   $scope.e.metro  +
                "&tram="    +   $scope.e.tram  +
                "&treno="    +   $scope.e.treno  +
                "&indirizzo"    +   $scope.e.indirizzo  +
                "&zona"    +   $scope.e.zona  +
                "&titolo="    +   $scope.e.titolo  +
                "&imgPreview="    +   $scope.e.imgPreview  +
                "&img1="    +   $scope.e.img1  +
                "&img2="    +   $scope.e.img2  +
                "&img3="    +   $scope.e.img3  +
                "&img4="    +   $scope.e.img4  +
                "&img5="    +   $scope.e.img5  +
                "&img6="    +   $scope.e.img6  +
                "&num_locali="    +   $scope.e.num_locali  +
                "&piano="    +   $scope.e.piano  +
                "&tipo="    +   $scope.e.tipo  +
                "&superficie="    +   $scope.e.superficie  +
                "&prezzo="    +   $scope.e.prezzo  +
                "&posti_letto="    +   $scope.e.posti_letto  +
                "&posti_letto_tot="    +   $scope.e.posti_letto_tot  +
                "&lat="    +   $scope.e.lat  +
                "&lng="    +   $scope.e.long
            ;

        console.log("Sto inviando al DB..");
        xhttp = new XMLHttpRequest;
        xhttp.open("GET", myUrl, false);
        xhttp.send();
        var resultCall=xhttp.response;

        console.log(resultCall);
        //console.log(JSON.parse(resultCall));

         BozzeList.rimuoviBozza($scope.e);

         $ionicHistory.goBack();
       return true;
     }
   });

   // For example's sake, hide the sheet after two seconds
   $timeout(function() {
     hideSheet();
   }, 8000);

 }

    $scope.takeImage = function() {
        var options = {
            quality: 80,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 250,
            targetHeight: 250,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.e.imgPreview = "data:image/jpeg;base64," + imageData;

        }, function(err) {
            // error
        });
    }

    $scope.takeMultipleImage = function(imageIndex){
         var options = {
            quality: 80,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 250,
            targetHeight: 250,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        if(imageIndex==1){
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.e.img1 = "data:image/jpeg;base64," + imageData;

            }, function(err) {
                // error
            });
        }
        else if(imageIndex==2){
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.e.img2 = "data:image/jpeg;base64," + imageData;

            }, function(err) {
                // error
            });
        }
        else if(imageIndex==3){
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.e.img3 = "data:image/jpeg;base64," + imageData;

            }, function(err) {
                // error
            });
        }
        else if(imageIndex==4){
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.e.img4 = "data:image/jpeg;base64," + imageData;

            }, function(err) {
                // error
            });
        }
        else if(imageIndex==5){
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.e.img5 = "data:image/jpeg;base64," + imageData;

            }, function(err) {
                // error
            });
        }
        else if(imageIndex==6){
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.e.img6 = "data:image/jpeg;base64," + imageData;

            }, function(err) {
                // error
            });
        }
    }
})

.controller('NuovoAnnuncioCtrl', function($scope, $ionicModal, $ionicActionSheet, $timeout, NuovoAnnuncioService, BozzeList, $cordovaCamera) {

    $ionicModal.fromTemplateUrl('templates/rent/nuovoAnnuncio.html', {
        scope: $scope,
        //animation: 'slide-in-up'
        animation: 'slide-in-right'
    })
    .then(function(modal) {
        $scope.modal_uno = modal;
    });

    $scope.nuovoAnnuncioModal = function() {
        console.log("Open modal");
        $scope.modal_uno.show();
    };

    $scope.closeModal = function() {
        console.log("Close Modal");

        $scope.showNuovoAnnuncioSheet();
    };

    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal_uno.remove();
    });

    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        // Execute action
    });

    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });

    $scope.n = NuovoAnnuncioService.getNuovoAnnuncioArray();

    $scope.showNuovoAnnuncioSheet = function() {

   // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: 'Salva bozza' }
            ],
            destructiveText: 'Elimina',
            titleText: 'Annuncio incompleto' ,
            cancelText: 'Annulla',
            cancel: function() {
                // add cancel code..
            },
            destructiveButtonClicked: function(){
                console.log("Elimina");

                $scope.modal_uno.hide();

                return true;
            },

            buttonClicked: function(index) {
                console.log("Salvare bozza e inviare DB");
                console.log($scope.n.id_annuncio);

                var nuovo=NuovoAnnuncioService.createNewArray();
                console.log($scope.n.id_annuncio);

                nuovo.id_annuncio=$scope.n.id_annuncio;
                nuovo.id_utente=$scope.n.id_utente;
                nuovo.titolo=$scope.n.titolo;
                nuovo.prezzo=$scope.n.prezzo;
                nuovo.tipo=$scope.n.tipo;
                nuovo.descrizione=$scope.n.descrizione;
                nuovo.zona=$scope.n.zona;
                nuovo.indirizzo=$scope.n.indirizzo;
                nuovo.num_locali=$scope.n.num_locali;
                nuovo.superficie=$scope.n.superficie;
                nuovo.piano=$scope.n.piano;
                nuovo.posti_letto=$scope.n.posti_letto;
                nuovo.posti_letto_tot=$scope.n.posti_letto_tot;
                nuovo.autobus=$scope.n.autobus;
                nuovo.metro=$scope.n.metro;
                nuovo.treno=$scope.n.treno;
                nuovo.tram=$scope.n.tram;
                nuovo.prezzo=$scope.n.prezzo;
                nuovo.imgPreview=$scope.n.imgPreview;
                nuovo.img1=$scope.n.img1;
                nuovo.img2=$scope.n.img2;
                nuovo.img3=$scope.n.img3;
                nuovo.img4=$scope.n.img4;
                nuovo.img5=$scope.n.img5;
                nuovo.img6=$scope.n.img6;
                nuovo.lat=$scope.n.lat;
                nuovo.long=$scope.n.long;

                console.log(nuovo.id_annuncio);
                BozzeList.aggiungiBozza(nuovo);

                $scope.modal_uno.hide();
                NuovoAnnuncioService.clearArray();


                myUrl=  "http://rentme.altervista.org/IONIC/salva_bozza.php?" +
                        "id_annuncio="       +   nuovo.id_annuncio      +
                        "&id_utente="   +   nuovo.id_utente       +
                        "&descrizione="    +   nuovo.descrizione  +
                        "&autobus="    +   nuovo.autobus  +
                        "&metro="    +   nuovo.metro  +
                        "&tram="    +   nuovo.tram  +
                        "&treno="    +   nuovo.treno  +
                        "&indirizzo="    +   nuovo.indirizzo  +
                        "&zona="    +   nuovo.zona  +
                        "&titolo="    +   nuovo.titolo  +
                        "&imgPreview="    +   nuovo.imgPreview  +
                        "&img1="    +   nuovo.img1  +
                        "&img2="    +   nuovo.img2  +
                        "&img3="    +   nuovo.img3  +
                        "&img4="    +   nuovo.img4  +
                        "&img5="    +   nuovo.img5  +
                        "&img6="    +   nuovo.img6  +
                        "&num_locali="    +   nuovo.num_locali  +
                        "&piano="    +   nuovo.piano  +
                        "&tipo="    +   nuovo.tipo  +
                        "&superficie="    +   nuovo.superficie  +
                        "&prezzo="    +   nuovo.prezzo  +
                        "&posti_letto="    +   nuovo.posti_letto  +
                        "&posti_letto_tot="    +   nuovo.posti_letto_tot  +
                        "&lat="    +   nuovo.lat  +
                        "&lng="    +   nuovo.long
                    ;
                xhttp = new XMLHttpRequest;
                xhttp.open("GET", myUrl, false);
                xhttp.send();
                jResponse=xhttp.response;
                return true;
            }
        });

       // For example's sake, hide the sheet after two seconds
       $timeout(function() {
         hideSheet();
       }, 8000);

    };

    $scope.takeImage = function() {
        var options = {
            quality: 80,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 250,
            targetHeight: 250,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.n.imgPreview = "data:image/jpeg;base64," + imageData;

        }, function(err) {
            // error
        });
    }

    $scope.takeMultipleImage = function(imageIndex){
         var options = {
            quality: 80,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 250,
            targetHeight: 250,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        if(imageIndex==1){
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.n.img1 = "data:image/jpeg;base64," + imageData;

            }, function(err) {
                // error
            });
        }
        else if(imageIndex==2){
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.n.img2 = "data:image/jpeg;base64," + imageData;

            }, function(err) {
                // error
            });
        }
        else if(imageIndex==3){
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.n.img3 = "data:image/jpeg;base64," + imageData;

            }, function(err) {
                // error
            });
        }
        else if(imageIndex==4){
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.n.img4 = "data:image/jpeg;base64," + imageData;

            }, function(err) {
                // error
            });
        }
        else if(imageIndex==5){
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.n.img5 = "data:image/jpeg;base64," + imageData;

            }, function(err) {
                // error
            });
        }
        else if(imageIndex==6){
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.n.img6 = "data:image/jpeg;base64," + imageData;

            }, function(err) {
                // error
            });
        }
    }

    $scope.updateLatLong = function(){
        var geocoder = new google.maps.Geocoder();

        geocoder.geocode( { 'address': $scope.n.indirizzo}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    $scope.n.lat = results[0].geometry.location.lat();
                    $scope.n.long = results[0].geometry.location.lng();

                    console.log($scope.n.lat);
                    console.log($scope.n.long);

                }
                else {
                    console.log("Geocode was not successful for the following reason: " + status);
                }
            });
    }
})


// TAB-MESSAGGI Controller
.controller('ChatsCtrl', function($scope, Chats) {

    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
    Chats.remove(chat);
  };

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);

})


// TAB_FAVORITI Controller

.controller('MapCtrl', function($scope, $ionicLoading, $compile, FavouriteList) {

    function initialize() {
        var geocoder = new google.maps.Geocoder();
        var myLatlng = new google.maps.LatLng(45.4642200,9.1905600);


        var mapOptions = {
            center: myLatlng,
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        $scope.map=map;
        var address, title, imgSrc, zone, idAnnuncio, price;
        FavouriteList.getFavArray().forEach(function(elem){

            address= elem.indirizzo;
            title=elem.titolo;
            imgSrc= elem.imgPreview;
            zone= elem.zona;
            idAnnuncio= elem.id_annuncio;
            price= elem.prezzo

            var contentString =
                '<a href="#/tab/favourites/'+idAnnuncio+'" style="text-decoration:none">'+
                    '<div style="text-align:center">'+
                        '<img src="'+imgSrc+'" style="display:block; margin-left:auto; margin-right:auto;width:9em;height:7em;"/>'+
                        '<h5>'+title+'</h5>'+
                        '<h5>'+zone+' - '+price+'€ </h5>'+
                    '</div>'+
                '</a>'
                       ;
            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            geocoder.geocode( { 'address': address}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location,
                        title: elem.via
                    });

                    google.maps.event.addListener(marker, 'click', function() {
                        console.log("Inforview clicked");
                        infowindow.close();
                        infowindow.open(map,marker);
                    });
                }
                else {
                    console.log("Geocode was not successful for the following reason: " + status);
                }
            });

        });
    }

    ionic.Platform.ready(initialize);

    $scope.centerOnMe = function() {
        console.log("Finding you.. ");
        if(!$scope.map) {
          return;
        }

        navigator.geolocation.getCurrentPosition(function(pos) {
            $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));

            var userLatlng = new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
            var marker = new google.maps.Marker({
                        map: $scope.map,
                        position: userLatlng,
                        title: "Te"
                    });

        }, function(error) {
            alert('Unable to get location: ' + error.message);
        });
    };

    $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
    };

})

.controller('FavouriteListCtrl', function($scope, FavouriteList) {
    $scope.elencoFav = FavouriteList.getFavArray();

    $scope.removeFav = function(ss){
            FavouriteList.rimuovi(ss);
        }
})
.controller('FavouriteDetailCtrl', function($scope, $stateParams, FavouriteList ) {

    $scope.f = FavouriteList.getFavourite($stateParams.favId);

    $scope.addContact = function(mail){
        $scope.user = JSON.parse(localStorage.getItem("userData"));
         var myUrl=  "http://rentme.altervista.org/IONIC/addContact.php?" +
                "idRENTME="       +  $scope.user.idRENTME     +
                "&mail="   +  mail;
            ;

        console.log("Aggiungo contatto..");
        console.log(myUrl);
        xhttp = new XMLHttpRequest;
        xhttp.open("GET", myUrl, false);
        xhttp.send();
        var resultCall=xhttp.response;
    };
    $scope.inviaEmail = function(){
        $scope.addContact($scope.f.email);
        var url = "mailto:"+$scope.f.email+"?subject="+$scope.f.titolo+"&body=Ciao,%0D%0Asono interessato al tuo annuncio:%0D%0A%0D%0ATITOLO:"+$scope.f.titolo+
                "%0D%0A%0D%0ADescrizione:"+$scope.f.descrizione+
                "%0D%0AIndirizzo:"+$scope.f.indirizzo+
                "%0D%0AZona:"+$scope.f.zona+
                "%0D%0ATipo:"+$scope.f.tipo+
                "%0D%0APiano:"+$scope.f.piano+
                "%0D%0ANumero Locali:"+$scope.f.num_locali+
                "%0D%0APrezzo:"+$scope.f.prezzo +
                "%0D%0A%0D%0AAspetto tue notizie ed un eventuale incontro.%0D%0ASaluti";

        window.location.href =url;


    };


});


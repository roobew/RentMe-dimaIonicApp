
angular.module('starter.controllers', [])
.controller('LoginCtrl', function($scope,$state,$q, UserService, $ionicLoading,$ionicModal,$ionicPopup) {


    $ionicModal.fromTemplateUrl('templates/signup.html', {
        id: 'signup',
        scope: $scope,
        animation: 'null', //slide-in-up',
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
            $scope.showAlert("Empty Fields");
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
                            $scope.showAlert(JSON.parse(jUser).title,JSON.parse(jUser).message);
                            //navigator.notification.alert(JSON.parse(jUser).message, reload, JSON.parse(jUser).title);
                        }
                }
            }
        }
    };

    $scope.login = function(){
        var authProvider = 'basic';
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
        };
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
        }else{
            $scope.showAlert(JSON.parse(jUser).title,JSON.parse(jUser).message);
            //navigator.notification.alert(JSON.parse(jUser).message, reload, JSON.parse(jUser).title);
        }
    };

     $scope.startApp = function(){
        $state.go('tab.home');
    };
})

.controller('AppCtrl', function($scope,$state,UserService,$ionicModal,$ionicPopup) {
    $scope.$on('$ionicView.enter', function () {
    console.log("abc");
    $scope.user = JSON.parse(localStorage.getItem("userData"));
  });

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



    $ionicModal.fromTemplateUrl('templates/editPw.html', {
        id: 'edit',
        scope: $scope,
        animation: 'null', //slide-in-up',
        focusFirstInput: true

    }).then(function(modal) {
        $scope.modalEditPw = modal;
    });
    $scope.openEditPw = function (){
        $scope.modalEditPw.show();
    };
    $scope.closeEditPw = function (){
        $scope.modalEditPw.hide();
    };

    $ionicModal.fromTemplateUrl('templates/editData.html', {
        id: 'editData',
        scope: $scope,
        animation: 'null', //slide-in-up',
        focusFirstInput: true

    }).then(function(modal) {
        $scope.modalEditData = modal;
    });
    $scope.openEditData = function (){
        $scope.modalEditData.show();
    };
    $scope.closeEditData = function (){
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
    $scope.confirmPw = function(){

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

                    $scope.closeEditPw();
                }else{
                    $scope.showAlert("Password too short");
                }
            }else{
                $scope.showAlert("Password must be the same");
            }

    };


})

// TAB-SEARCH Controller
.controller('SearchCtrl', function($scope,$state, $ionicModal, $timeout, $ionicPopup,ResultList,$http) {


    $scope.modalData = {"choice" : '-1',
<<<<<<< HEAD
                        "curPos" : 'Posizione Attuale',
                        "zone" : 'Seleziona una zona',
                        "address" : '',
                        "place" : 'Seleziona',
                        "type" : 'Seleziona',
                        "priceStart" : 'Da',
                       "priceEnd": 'A'};
=======
                        "curPos" : 'Posizione attuale',
                        "zone" : 'Seleziona una zona',
                        "address" : '',
                        "place" : 'Scegli',
                        "type" : 'Scegli',
                        "priceStart" : 'Scegli',
                       "priceEnd": 'Scegli'};
>>>>>>> origin/master
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
                title: 'ERROR',
                template: 'choice a location'
            });

            alertPopup.then(function(res) {});
        };
        if($scope.modalData.place == 'Select'){
           $scope.showAlert();
           // e.preventDefault();
        }else{
            var myUrl = "http://rentme.altervista.org/IONIC/get_annunci.php?" +
                "tipo='"       +  $scope.modalData.type   +
                "'&min="   +       $scope.modalData.priceStart                            +
                "&max="    +     $scope.modalData  .priceEnd;
    console.log(myUrl);
        xhttp = new XMLHttpRequest;
        xhttp.open("GET", myUrl, false);
        xhttp.send();
        jAnnunci=xhttp.response;
        if(JSON.parse(jAnnunci)[0].id_annuncio!=null){
            ResultList.setResArray(jAnnunci);
            //localStorage.setItem("annunci",jAnnunci);
           $state.go('tab.result');
        }else{
            $scope.showAlert(JSON.parse(jAnnunci).title,JSON.parse(jAnnunci).message);
            //navigator.notification.alert(JSON.parse(jUser).message, reload, JSON.parse(jUser).title);
        }

        }
    };






})

.controller('ResultCtrl', function($scope, $http,ResultList) {
    $scope.map=false;
    $scope.switchView = function(){
        $scope.map = !$scope.map;
    }
     $scope.elencoRes = /*JSON.parse(localStorage.getItem("annunci"));//*/ResultList.getResArray();



})
<<<<<<< HEAD
.controller('ResultDetailCtrl', function($scope, $stateParams, ResultList) {
    console.log($stateParams.resId);
    $scope.f = JSON.parse(localStorage.getItem("annunci"))[$stateParams.resId];//ResultList.getResult($stateParams.resId);
=======
.controller('ResultDetailCtrl', function($scope, $stateParams, ResultList, FavouriteList) {

    $scope.f = ResultList.getResult($stateParams.resId);


    $scope.getClass = function(){
        $scope.isPreferito = FavouriteList.getFavourite($stateParams.resId)!= null?true:false;
        $scope.class = $scope.isPreferito? 'preferitiColor':'nonPreferitiColor';
        return $scope.class;
    }

    $scope.addToPreferiti = function(){

        if(!$scope.isPreferito){
            FavouriteList.aggiungi($scope.f);
        }
        else{
            FavouriteList.rimuoviPreferito($scope.f.id_annuncio);
        }

        $scope.isPreferito = !$scope.isPreferito;

    }

>>>>>>> origin/master
})

.controller('modalPlaceCtrl', function($scope, $ionicModal) {
  $scope.zones = ["Centro",
                  "Citta' Studi",
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
              $scope.submit('place',1);
              break;
          case 2:
              $scope.modalData.choice = 2;
              $scope.modalData.zone = item;
              $scope.modalData.address = '';
              $scope.modalData.place = $scope.modalData.zone;
              $scope.modalZone.hide();
              $scope.submit('place',2);
              break;
          case 3:

              $scope.modalData.zone = 'Scegli una zona';
              break;
      }

  };

  $scope.submit = function($string,n) {
    $scope.modalData.choice=n;
        switch($scope.modalData.choice){
            case 1:
                $scope.modalData.place = $scope.modalData.curPos;
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
    $scope.types = ['Appartamento','Stanza Condivisa','Stanza Privata'];
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
            title: 'Wrong price range',
             template: 'End value must be greater then the start value'
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
                '<a href="#/tab/search/result/'+idAnnuncio+'">'+
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


// TAB-HOME Controller
.controller('HomeCtrl', function($scope, RentPubblicatiList, BozzeList, FavouriteList) {
    RentPubblicatiList.call();
    BozzeList.call();
    FavouriteList.call();

})




// TAB-AFFITTA Controller
.controller('RentCtrl', function($scope) {
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

    $scope.selectedTab = 'pub';

    var myEl = angular.element( document.querySelector( '#divID' ) );
    myEl.removeClass('red');
})
.controller('RentPubblicatiCtrl', function($scope, RentPubblicatiList) {

    //console.log("Pubblicati Controller");

    $scope.elencoPubblicati = RentPubblicatiList.getPubblicatiArray();

    $scope.removePubblicato = function(ss){
        RentPubblicatiList.rimuoviPubblicato(ss);
    };

})

.controller('RentBozzeCtrl', function($scope, BozzeList){
    //console.log("Bozze Controller");
    $scope.elencoBozze = BozzeList.getBozzeArray();

    $scope.removeBozza = function(ss){
        BozzeList.rimuoviBozza(ss);
    };
})

.controller('RentDetailCtrl', function($scope, $stateParams, RentPubblicatiList) {

    $scope.e = RentPubblicatiList.getPubblicato($stateParams.rentID);
})

.controller('BozzeDetailCtrl', function($scope, $stateParams, BozzeList, $ionicActionSheet, $timeout, $ionicHistory, RentPubblicatiList) {

    $scope.e = BozzeList.getBozza($stateParams.bozzaID);
    $scope.bc = BozzeList.getBozzaChanged($stateParams.bozzaID);

    //ManageRentTabs.setBackFromBozze(true);

    $scope.updateModel = function(x){

        console.log(BozzeList.getBozzeChangedArray());
    }

    $scope.myGoBack = function(){

        if($scope.bc.changed==true){
            console.log("Changed: Update DB");
            $scope.bc.changed=false;
            //console.log($scope.bc.id);
            //console.log($scope.bc.changed);
        }
        else{
            console.log("Nothing changed");
           // console.log($scope.bc.id);
           // console.log($scope.bc.changed);
        }

        $ionicHistory.goBack();
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
         console.log("Da inviare al DB");
         RentPubblicatiList.AddNewElement($scope.e);
         BozzeList.rimuoviBozza($scope.e);
         $ionicHistory.goBack();
       return true;
     }
   });

   // For example's sake, hide the sheet after two seconds
   $timeout(function() {
     hideSheet();
   }, 8000);

 };
})

.controller('NuovoAnnuncioCtrl', function($scope, $ionicModal, $ionicActionSheet, $timeout, NuovoAnnuncioService, BozzeList) {
  console.log("Modal CTRL");

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
        NuovoAnnuncioService.clearArray();
        $scope.modal_uno.show();
    };

    $scope.closeModal = function() {
        console.log("Close Modal");
        console.log(NuovoAnnuncioService.getNuovoAnnuncioArray());

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

    $scope.new = NuovoAnnuncioService.getNuovoAnnuncioArray();

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

                NuovoAnnuncioService.setCreated();
                BozzeList.aggiungiBozza($scope.new);
                //console.log(BozzaList.getBozzeArray());
                $scope.modal_uno.hide();
                return true;
            }
        });

       // For example's sake, hide the sheet after two seconds
       $timeout(function() {
         hideSheet();
       }, 8000);

    };
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
                '<a href="#/tab/favourites/'+idAnnuncio+'">'+
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
.controller('FavouriteDetailCtrl', function($scope, $stateParams, FavouriteList) {

    $scope.f = FavouriteList.getFavourite($stateParams.favId);
});


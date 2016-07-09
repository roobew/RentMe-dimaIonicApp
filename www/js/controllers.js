
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
        "email": '',
        "password": '',
        "username":''
    };
    $scope.signUpData.custom = {
      'name': '',
      'surname': ''
    };
    $scope.check={"password":''};
    $scope.showAlert = function(string) {

            var alertPopup = $ionicPopup.alert({
                title: 'ERROR',
                template: string
            });

            alertPopup.then(function(res) {
                $scope.check.password='';
                $scope.loginData.password='';
            });
        };

    $scope.signUp = function(){
        if($scope.signUpData.custom.name==''||
           $scope.signUpData.custom.surname==''||
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
                    Ionic.Auth.signup($scope.signUpData).
                    then(function(){
                        $scope.closeSignUp();
                        $scope.signUpData = '';
                        $scope.check='';
                    }, function(){
                         $scope.showAlert("Something Wrong!");
                    });
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
        Ionic.Auth.login(authProvider, authSettings, $scope.loginData).then(authSuccess, authFailure);
    };
    $scope.facebookLogin = function() {

             //window.open("http://google.com");
        var authSuccess = function(user) {
            console.log(user.details);
            $scope.starrtApp();
          // user was authenticated, you can get the authenticated user
          // with Ionic.User.current();
        };
        var authFailure = function(errors) {

              alert(errors);
            console.log(errors);
            // check the error and provide an appropriate message
            // for your application

        };
       Ionic.Auth.login('facebook', {'remember': true}).then(authSuccess, authFailure);
    };

     $scope.startApp = function(){
        $state.go('tab.home');
    };
})

.controller('AppCtrl', function($scope,$state,UserService,$ionicModal,$ionicPopup) {
    $scope.user = Ionic.User.current();
    $scope.logout = function(){
        console.log("logout");
        console.log(Ionic.User.current());
        Ionic.Auth.logout();
        $scope.user='';
        console.log(Ionic.User.current());
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

    $scope.check={"password":''};
    $scope.edit={
        "image":'',
        "password":''
    };
    $scope.confirmPw = function(){
        console.log($scope.user.details.password);
        console.log($scope.check.oldpassword);
        console.log($scope.edit.password);
        console.log($scope.check.password);
            if($scope.check.password==$scope.edit.password){
                if($scope.edit.password.length>5){
                    $scope.user.details.password=$scope.edit.password;
                    $scope.user.save();
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
.controller('SearchCtrl', function($scope,$state, $ionicModal, $timeout, $ionicPopup) {


    $scope.modalData = {"choice" : '-1',
                        "curPos" : 'Current Position',
                        "zone" : 'Select a Zone',
                        "address" : '',
                        "place" : 'Select',
                        "type" : 'Select',
                        "priceStart" : 'Select',
                       "priceEnd": 'Select'};
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
                $scope.modalData.zone="Select a Zone";
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
        }else
            $state.go('tab.result');
    };

})

.controller('ResultCtrl', function($scope, $http,ResultList) {
    $scope.map=false;
    $scope.switchView = function(){
        $scope.map = !$scope.map;
    }

    $http({
        //method : "POST",
        method : "GET",
        url : 'http://rentme.altervista.org/IONIC/get_annunci.php',
        /*headers: {
            //'Content-Type': undefined
            "Access-Control-Allow-Origin" : "*"

        },
        data: { id_user: '23' }*/
    }).then(function mySucces(response) {

        ResultList.setResArray(response.data);
        $scope.elencoRes =ResultList.getResArray();
        console.log("Get_Result: ");
        console.log(response.data);

    }, function myError(response) {
        console.log(response.statusText);
    });


})
.controller('ResultDetailCtrl', function($scope, $stateParams, ResultList) {

    $scope.f = ResultList.getResult($stateParams.resId);
})

.controller('modalPlaceCtrl', function($scope, $ionicModal) {
  $scope.zones = ['Zone 1','Zone 2','Zone 3','Zone 4'];
  
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
              $scope.modalData.zone = 'Select a Zone';
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

              $scope.modalData.zone = 'Select a Zone';
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
    $scope.types = ['Appartamento','Stanza Singola','Stanza Privata'];
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

.controller('NuovoAnnuncioCtrl', function($scope, $ionicModal, NuovoAnnuncioService) {
  $ionicModal.fromTemplateUrl('templates/rent/nuovoAnnuncio.html', {
    scope: $scope,
    //animation: 'slide-in-up'
    animation: 'slide-in-right'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
      console.log("Open modal");
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

    $scope.item = NuovoAnnuncioService.all();
})

// TAB-HOME Controller
.controller('HomeCtrl', function($scope) {})




// TAB-AFFITTA Controller
.controller('RentCtrl', function($scope, $http) {

    $http({
        //method : "POST",
        method : "GET",
        url : 'http://rentme.altervista.org/IONIC/get_annuncio.php',
        /*headers: {
            //'Content-Type': undefined
            "Access-Control-Allow-Origin" : "*"

        },
        data: { id_user: '23' }*/
    }).then(function mySucces(response) {

        //FavouriteList.setFavArray(response.data);
        //$scope.elencoFav = FavouriteList.getFavArray();
        console.log("Get_Annuncio: ");
        console.log(response.data);


    }, function myError(response) {
        console.log(response.statusText);
    });

        //$scope.removeFav = function(ss){
        //    FavouriteList.rimuovi(ss);
       // }




    $scope.selectedTab = 'pub';
    var myEl = angular.element( document.querySelector( '#divID' ) );
    myEl.removeClass('red');
})
.controller('RentPubblicatiCtrl', function($scope, RentPubblicatiList) {

    $scope.elencoPubblicati = RentPubblicatiList.all();

    $scope.removePubblicato = function(ss){
        RentPubblicatiList.rimuoviPubblicato(ss);
    };
})

.controller('RentDetailCtrl', function($scope, $stateParams, RentPubblicatiList) {
  $scope.e = RentPubblicatiList.getPubblicato($stateParams.rentID);
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

.controller('MapCtrl', function($scope, $ionicLoading, $compile, FavouriteList){

    $scope.init = function() {
        var geocoder = new google.maps.Geocoder();
        var myLatlng = new google.maps.LatLng(45.4642200,9.1905600);

        var mapOptions = {
          center: myLatlng,
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);

        var address, title;
        FavouriteList.getFavArray().forEach(function(elem){
            console.log("Elem vale: "+elem);

            address= elem.indirizzo;
            title=elem.titolo;
            console.log("Ehi ehi "+address);

            var contentString = "<div><a ng-click='clickTest()'>"+title+"</a></div>";
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

        $scope.map = map;
    };

    $scope.centerOnMe = function() {
        if(!$scope.map) {
            return;
        }

        $scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function(pos) {
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          $scope.loading.hide();
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
    };
})
/*
    $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
    };
*/

.controller('FavouriteSwitchCtrl', function($scope) {

    $scope.mapFavoriti=false;
    $scope.switchPreferitiView = function(){
        $scope.mapFavoriti = !$scope.mapFavoriti;
    }
})
.controller('FavouriteListCtrl', function($scope, $http, FavouriteList) {

    $http({
        //method : "POST",
        method : "GET",
        url : 'http://rentme.altervista.org/IONIC/get_preferiti.php',
        /*headers: {
            //'Content-Type': undefined
            "Access-Control-Allow-Origin" : "*"

        },
        data: { id_user: '23' }*/
    }).then(function mySucces(response) {

        FavouriteList.setFavArray(response.data);
        $scope.elencoFav = FavouriteList.getFavArray();
        console.log("Get_Preferiti: ");
        console.log(response.data);

    }, function myError(response) {
        console.log(response.statusText);
    });

        $scope.removeFav = function(ss){
            FavouriteList.rimuovi(ss);
        }

})
.controller('FavouriteDetailCtrl', function($scope, $stateParams, FavouriteList) {

    $scope.f = FavouriteList.getFavourite($stateParams.favId);
});


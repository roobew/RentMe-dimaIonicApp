angular.module('starter.controllers', [])
.controller('AppCtrl', function($scope) {
    $scope.platform = ionic.Platform.platform();
})

.controller('SearchCtrl', function($scope, $ionicModal, $timeout) {
    $scope.modalData = {"choice" : '-1',
                        "curPos" : 'Current Position',
                        "zone" : 'Select a Zone',
                        "address" : '',
                        "place" : 'Select',
                        "type" : 'Select',
                        "price" : 'Select'};
    // Create the modal that we will use later
    $ionicModal.fromTemplateUrl('templates/search/modalPlace.html', {
        id: 'place',
        scope: $scope,
        animation: 'null', //slide-in-up',
        focusFirstInput: true

    }).then(function(modal) {
        $scope.modalPlace = modal;
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
            case 'price':
                $scope.modalPrice.show();
                break;
        }
    };
    // Perform the login action when the user submits the login form

})

.controller('ResultCtrl', function($scope) {
    $scope.map=false;
    $scope.switchView = function(){
        $scope.map = !$scope.map;
    }

})

.controller('modalPlaceCtrl', function($scope, $ionicModal) {
  $scope.months = ['Zone 1','Zone 2','Zone 3','Zone 4'];
  
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


.controller('HomeCtrl', function($scope) {})

.controller('RentPubblicatiCtrl', function($scope, RentPubblicatiList) {

    $scope.elencoPubblicati = RentPubblicatiList.all();

    $scope.removePubblicato = function(ss){
        RentPubblicatiList.rimuoviPubblicato(ss);
    }
})

.controller('RentDetailCtrl', function($scope, $stateParams, RentPubblicatiList) {
  $scope.e = RentPubblicatiList.getPubblicato($stateParams.rentID);
})

.controller('ChatsCtrl', function($scope, Chats) {

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})
/*
.controller('FavouriteListCtrl', function($scope, Favourites) {

    $scope.favouriteArray=Favourites.all();
    $scope.remove = function(f) {
        Favourites.remove(f);
    };
})
*/

.controller('FavouriteListCtrl', function($scope, FavouriteList) {

    $scope.elencoFav = FavouriteList.favArray;

    $scope.removeFav = function(ss){
        FavouriteList.rimuovi(ss);
    }
})


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
        FavouriteList.favArray.forEach(function(elem){
            address= elem.via;
            title=elem.title;
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
/*
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
*/
    $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
    };

})

.controller('FavouriteDetailCtrl', function($scope, $stateParams, FavouriteList) {
  $scope.f = FavouriteList.getFavourite($stateParams.favId);
});


var url1= "http://www.alrocol.com/img/ospitalita/appartamento01-big.jpg",
    url2= "http://www.bikedolomite.com/img/appartamento.jpg",
    url3= "http://www.alrocol.com/img/ospitalita/appartamento01-big.jpg",
    url4= "http://www.bikedolomite.com/img/appartamento.jpg";

angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
         console.log("ELIMINO "+chat);
          console.log("indexOf: "+chats.indexOf(chat));
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.service('FavouriteList', function($http){
    this.favArray = [
        {id:0, title:"Casa diroccata", zone:"Centro", previewImg:url1, via:"Piazza duomo Milano"},
        {id:1, title:"Casa Zio Samir", zone:"Baghdad", previewImg:url2, via:"Città studi Milano"},
        {id:2, title:"Villa esplosiva", zone:"Quarto Oggiaro", previewImg:url3, via:"San Babila Milano"},
        {id:3, title:"Catapecchia Abusiva", zone:"Catania Alta", previewImg:url4, via:"Stadio Meazza milano"}
    ];

    this.provaRequest = function (){
        $http.get("http://rentme.altervista.org/IONIC/http_prova.php", { params: { "v1": "value1", "v2": "value2" } })
            .success(function(data) {
                //$scope.firstname = data.firstname;
                //$scope.lastname = data.lastname;
            console.log(data);
            })
            .error(function(data) {
                alert("ERROR");
            });
    }

    this.aggiungi = function (newElement){
        this.favArray.push(newElement);
    }

    this.rimuovi = function (i){
        this.favArray.splice(this.favArray.indexOf(i), 1);
    }

    this.getFavourite = function(xx){
       for (var i = 0; i < this.favArray.length; i++) {
            if (this.favArray[i].id === parseInt(xx)) {
              return this.favArray[i];
            }
          }
          return null;
        }

})

;

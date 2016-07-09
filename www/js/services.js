var url1= "http://www.alrocol.com/img/ospitalita/appartamento01-big.jpg",
    url2= "http://www.bikedolomite.com/img/appartamento.jpg",
    url3= "http://www.alrocol.com/img/ospitalita/appartamento01-big.jpg",
    url4= "http://www.bikedolomite.com/img/appartamento.jpg";

angular.module('starter.services', [])

.factory('ManageRentTabs', function(){
    var backFromBozze = false ;

    return {
        setBackFromBozze : function(value){
            backFromBozze = value;
        },
        getBackFromBozze : function(){
            return backFromBozze;
        }
    };
})

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

.factory('FavouriteList', function($http){

    var favArray = [];

    function callAjax(){
        $http({
            method : "GET",
            url : 'http://rentme.altervista.org/IONIC/get_preferiti.php',

        }).then(function mySucces(response) {
            console.log("Get_Favourite: ");

            for(var i=0; i<response.data.length; i++){
                //console.log(response.data[i]);
                favArray.push(response.data[i]);
            }

            console.log(favArray);
        }, function myError(response) {
            console.log(response.statusText);
        });
    }


    return{
        call : function(){
            callAjax();
            return;
        },

        getFavArray : function(){
            return favArray;
        },

        rimuovi : function (i){
            console.log(favArray);
            favArray.splice(favArray.indexOf(i), 1);
            console.log(favArray);
        },

        aggiungi : function (newElement){
            favArray.push(newElement);
        },

        getFavourite : function(xx){
            for (var i = 0; i < favArray.length; i++) {
                if (favArray[i].id_annuncio == parseInt(xx)) {
                    //console.log("Trovato");
                    return favArray[i];
                }
            }
            //console.log("Non trovato");
            return null;
        },

        //setFavArray : function(myArray){
        //    favArray = myArray;
       // },

    };

})

.factory('RentPubblicatiList', function($http){

    var pubblicatiArray = [];
    function callAjax(){
        $http({
            method : "GET",
            url : 'http://rentme.altervista.org/IONIC/get_annuncio.php',

        }).then(function mySucces(response) {
            console.log("Get_Annuncio: ");

            for(var i=0; i<response.data.length; i++){
                //console.log(response.data[i]);
                pubblicatiArray.push(response.data[i]);
            }

            console.log(pubblicatiArray);
        }, function myError(response) {
            console.log(response.statusText);
        });
    }

    return {
        call : function(){
            callAjax();
            return;
        },

        getPubblicatiArray : function(){
           //console.log(pubblicatiArray);
            return pubblicatiArray;
        },

        rimuoviPubblicato : function (i){
            //console.log("Ricevo "+i);
            pubblicatiArray.splice(pubblicatiArray.indexOf(i), 1);
            //console.log(pubblicatiArray);
        },

        getPubblicato : function(xx){
            for (var i = 0; i < pubblicatiArray.length; i++) {
                if (pubblicatiArray[i].id_annuncio == parseInt(xx)) {
                    //console.log("Trovato");
                    return pubblicatiArray[i];
                }
            }
            //console.log("Non trovato");
            return null;
        },
        AddNewElement : function(elem){
            pubblicatiArray.push(elem);
        }

    };

})

.factory('BozzeList', function($http){
    var bozzeArray = [];
    var bozzeChanged = [];
    var t = '[';
     function callAjax(){
        $http({
            method : "GET",
            url : 'http://rentme.altervista.org/IONIC/get_bozze.php',

        }).then(function mySucces(response) {
            console.log("Get_Bozze: ");

            for(var i=0; i<response.data.length; i++){
                bozzeArray.push(response.data[i]);
                if(i!=0){t+=',';}
                t+='{"id":"'+response.data[i].id_annuncio+'","changed":"false"}';
            }

            t+=']';
            bozzeChanged=JSON.parse(t);
            //console.log(bozzeChanged);
            console.log(bozzeArray);
        }, function myError(response) {
            console.log(response.statusText);
        });
    }

    return {
        call : function(){
            callAjax();
            return;
        },

        getBozzeArray : function(){
           //console.log(bozzeArray);
            return bozzeArray;
        },

        getBozzeChangedArray : function(){
            return bozzeChanged;
        },

        rimuoviBozza : function (oldBozza){
            //console.log("Ricevo "+i);
            bozzeArray.splice(bozzeArray.indexOf(oldBozza), 1);
            console.log(bozzeArray);
        },

        getBozza : function(xx){
            for (var i = 0; i < bozzeArray.length; i++) {
                if (bozzeArray[i].id_annuncio == parseInt(xx)) {
                    //console.log("Trovato");
                    return bozzeArray[i];
                }
            }
            //console.log("Non trovato");
            return null;
        },

        aggiungiBozza : function(nuovaBozza){

            console.log(nuovaBozza.id_annuncio);
            var t= '[{"id":"'+nuovaBozza.id_annuncio+'","changed":"false"}]'
            //console.log(t);
            //console.log(JSON.parse(t)[0]);
            bozzeArray.push(nuovaBozza);


            bozzeChanged.push(JSON.parse(t)[0]);
            console.log(bozzeArray)
            console.log(bozzeChanged)
        },

        getBozzaChanged : function(xx){
            for (var i = 0; i < bozzeChanged.length; i++) {
                if (bozzeChanged[i].id == parseInt(xx)) {
                    //console.log("Trovato");
                    return bozzeChanged[i];
                }
            }
            //console.log("Non trovato");
            return null;
        }
    }
})

.factory('NuovoAnnuncioService', function(){
    var startingID= 500,
        created=false;

    var nuovoAnnuncioArray = [{
        "id_annuncio":startingID,
        "id_utente":"",
        "titolo":"Inserisci titolo",
        "tipo":"-",
        descrizione:"-",
        zona:"-",
        indirizzo:"-",
        locali:"-",
        superficie:"-",
        piano:"-",
        posti_letto:"-",
        posti_letto_tot:"-",
        autobus:"-",
        metro:"-",
        treno:"-",
        tram:"-",
        prezzo:"-",
        imgPreview:"-"
    }];
    return {
        getNuovoAnnuncioArray : function(){
            //console.log("all!");
            return nuovoAnnuncioArray[0];
        },
        setCreated : function(){
            created=true;
        },

        clearArray : function(){
            console.log("Clear NuovoAnnuncioArray");
            if(created){
                var temp_ID= startingID+1;
                created=false;
            }
            else{
                var temp_ID= startingID;
            }

            nuovoAnnuncioArray[0].id_annuncio = 543;
            //nuovoAnnuncioArray[0].id_annuncio = temp_ID;
            nuovoAnnuncioArray[0].id_utente = "";
            nuovoAnnuncioArray[0].titolo = "-";
            nuovoAnnuncioArray[0].tipo = "-";
            nuovoAnnuncioArray[0].descrizione = "-";
            nuovoAnnuncioArray[0].zona = "-";
            nuovoAnnuncioArray[0].indirizzo = "-";
            nuovoAnnuncioArray[0].locali = "-";
            nuovoAnnuncioArray[0].superficie = "-";
            nuovoAnnuncioArray[0].piano = "-";
            nuovoAnnuncioArray[0].posti_letto = "-";
            nuovoAnnuncioArray[0].posti_letto_tot = "-";
            nuovoAnnuncioArray[0].autobus = "-";
            nuovoAnnuncioArray[0].metro = "-";
            nuovoAnnuncioArray[0].treno = "-";
            nuovoAnnuncioArray[0].tram = "-";
            nuovoAnnuncioArray[0].prezzo = "-";
            nuovoAnnuncioArray[0].imgPreview = "-";
        },

    };

})

.factory('MapService', function(){
    return {
       initialize : function(){

       }
    };
})

.factory('ResultList', function(){

    var resArray = [];
    return{
        getResArray : function(){
            return favArray;
        },

        rimuovi : function (i){
            favArray.splice(favArray.indexOf(i), 1);
        },

        aggiungi : function (newElement){
            favArray.push(newElement);
        },

        getResult : function(xx){
            for (var i = 0; i < favArray.length; i++) {
                if (favArray[i].id_annuncio == parseInt(xx)) {
                    console.log("Trovato");
                    return favArray[i];
                }
            }
            console.log("Non trovato");
            return null;
        },

        setResArray : function(myArray){
            favArray = myArray;
        },

        printArray : function(){
            console.log("Printing");
            for(var i=0; i<favArray.length; i++){
                console.log("Elemento "+i);
            }
            console.log("End Printing");
        }
    };

})

.service('UserService', function() {
  // For the purpose of this example I will store user data on ionic local storage but you should save it on a database
  var setUser = function(user_data) {
    window.localStorage.starter_facebook_user = JSON.stringify(user_data);
  };

  var getUser = function(){
    return JSON.parse(window.localStorage.starter_facebook_user || '{}');
  };

  return {
    getUser: getUser,
    setUser: setUser
  };
});
;



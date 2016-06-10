
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

  // Each tab has its own nav history stack:

  .state('tab.search', {
    url: '/search',
    views: {
      'tab-search': {
        templateUrl: 'templates/search/tab-search.html',
        controller: 'SearchCtrl'
      }
    }
  })
  .state('tab.result', {
    url: '/search/result',
    views: {
      'tab-cerca': {
        templateUrl: 'templates/search/result.html',
        controller: "ResultCtrl"
      }
    }
  })

  
  .state('tab.home', {
      url: '/home',
        views: {
            'tab-home': {
            templateUrl: 'templates/home/tab-home.html',
            controller: 'HomeCtrl'
            }
        }
    })

  
  .state('tab.rent', {
      url: '/rent',
        views: {
            'tab-rent': {
            templateUrl: 'templates/rent/tab-rent.html',
            controller: 'RentCtrl'
            }
        }
    })
  .state('tab.rent.bozze', {
        url: '/rent/bozze',
        views: {
            'rent-bozze': {
            templateUrl: 'templates/rent/bozze.html'
            }
        }
    })

  .state('tab.rent.pubblicati', {
        url: '/rent/pubblicati',
        views: {
            'rent-pubblicati': {
            templateUrl: 'templates/rent/pubblicati.html'
            }
        }
    })

  
  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
  .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  
  .state('tab.favourite', {
    url: '/favourites',
    views: {
      'tab-favourite': {
        templateUrl: 'templates/favourite/tab-favourite.html'
        //controller: 'FavouriteCtrl'
      }
    }
  })
  .state('tab.favourite-detail', {
      url: '/favourites/:favId',
      views: {
        'tab-favourite': {
          templateUrl: 'templates/favourite/favourite-detail.html',
          controller: 'FavouriteDetailCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

})

.config(['$ionicConfigProvider', function($ionicConfigProvider) {

    $ionicConfigProvider.tabs.position('bottom'); // other values: top

}]);

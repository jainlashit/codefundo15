angular.module('starter.services', [])

.factory('GameData2', function() {
  var gameData = {
    "type": 2,
    "name": "Jeromde",
    "lat": 109.4444,
    "lon": -122.326897,
    "id": 1
  };

  return {
    get: function(){
      return gameData
    },

    set: function(data){
      gameData = data;
    }
  }
})

.factory('GameData3', function() {
  var gameData = {
    "id": 2,
    "gid": 1,
    "currentGPS": {
      "lat": 3.1094,
      "lon": -21.32801
    },
    "end": 0,
    "img": 0,
    "response": -1,
    "type": 3
  };

  return {
    get: function(){
      return gameData
    },

    set: function(data){
      gameData = data;
    }
  }
})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Lashit Jain',
    lastText: 'Working on Google Maps',
    face: 'https://avatars3.githubusercontent.com/udhy'
  }, {
    id: 1,
    name: 'Aditya Kumar',
    lastText: 'Setting up the server',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Vishal Gupta',
    lastText: 'Working on image recognization',
    face: 'https://avatars3.githubusercontent.com/gvishal'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
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
});

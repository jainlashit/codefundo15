angular.module('starter.services', [])

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

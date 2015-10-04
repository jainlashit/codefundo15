var http = require('http'),
	fs = require('fs'),
	mkdirp = require('mkdirp'),
	rmrf = require('rmrf');
function registerName(name, callback) {
	fs.readFile("ids.json", function(err, file) {
		var data = JSON.parse(file.toString()),
			len = data.ids.length;
		data.ids.push({id: len, name: name});
		fs.writeFile("ids.json", JSON.stringify(data, null, 4), function() {
			callback(len);
		});
	});
}
function dist(lat1, lon1, lat2, lon2) {
  var p = 0.017453292519943295;
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 +
          c(lat1 * p) * c(lat2 * p) *
          (1 - c((lon2 - lon1) * p))/2;

  return 12742000 * Math.asin(Math.sqrt(a));
}
function makeGame(p1, p2, callback) {
	fs.readdir("games", function(err, files) {
		files.sort(function(a, b) {return a-b;});
		for(var i = 0; ; ++i) {
			if(files[i] != i)
				break;
		}
		mkdirp("games/" + i, function(err) {
			var gameObj = new Object(),
				p1Obj = new Object(),
				p2Obj = new Object();
			gameObj.p1 = p1.id;
			gameObj.p2 = p2.id;
			p1Obj.timestamp = p1.timestamp;
			p2Obj.timestamp = p1.timestamp;
			p1Obj.opp_gps = {lat: p2.lat, lon: p2.lon};
			p2Obj.opp_gps = {lat: p1.lat, lon: p1.lon};
			p1Obj.name = p2.name;
			p2Obj.name = p1.name;
			p1Obj.timeToGPS = 5*60*1000;
			p2Obj.timeToGPS = 5*60*1000;
			p1Obj.gameState = 0;
			p2Obj.gameState = 0;
			p1Obj.img = 0;
			p2Obj.img = 0;
			p1Obj.ammo = 3;
			p2Obj.ammo = 3;
			p1Obj.timeToReload = 0;
			p2Obj.timeToReload = 0;
			p1Obj.lives = 5;
			p2Obj.lives = 5;
			p1Obj.imState = 0;
			p2Obj.imState = 0;
			fs.writeFile("games/" + i + "/data.json", JSON.stringify(gameObj, null, 4), function(err) {
				fs.writeFile("games/" + i + "/p1.json", JSON.stringify(p1Obj, null, 4), function(error) {
					fs.writeFile("games/" + i + "/p2.json", JSON.stringify(p2Obj, null, 4), function(er) {
					    callback(i);	
					});
				});
			});
		});
	});
}
function addRoom(data, dT, tT, callback) {
	fs.readFile("room.json", function(err, file) {
		var roomData = JSON.parse(file.toString()),
			i,
			newRoom = new Object(),
			curr = Date.now(),
			flag = 1,
			opp;
		newRoom.rooms = new Array();
		for(i = 0; i < roomData.rooms.length; ++i) {
			if(data.id != roomData.rooms[i].id)
				continue;
			if(roomData.rooms[i].gid == -1)
				break;
			callback(roomData.rooms[i].gid);
			return;
		}
		for(i = 0; i < roomData.rooms.length; ++i) {
			var pr = roomData.rooms[i];
			if(data.id != pr.id && curr - pr.timestamp < tT) {
				if(flag && dist(data.lat, data.lon, pr.lat, pr.lon) < dT) {
					flag = 0;
					opp = {
						id: pr.id,
						name: pr.name,
						lat: pr.lat,
						lon: pr.lon,
						timestamp: pr.timestamp,
						gid: pr.gid
					};
				} else newRoom.rooms.push(pr);
			}
		}
		var p1 = {
				id: data.id,
				name: data.name,
				lat: data.lat,
				lon: data.lon,
				timestamp: curr,
				gid: -1
			};
		if(flag)
			newRoom.rooms.push(p1);
		else makeGame(p1, opp, function(gid) {
			opp.gid = gid;
			newRoom.rooms.push(opp);
			fs.writeFile("room.json", JSON.stringify(newRoom, null, 4), function() {
				callback(gid);
				return;
			});
		});
		fs.writeFile("room.json", JSON.stringify(newRoom, null, 4), function() {
			callback(-1);
			return;
		});
	});
}
function receive(data, callback) {
	var curr = Date.now();
	fs.readFile("games/" + data.gid + "/data.json", function(err1, file1) {
		fs.readFile("games/" + data.gid + "/p1.json", function(err2, file2) {
			fs.readFile("games/" + data.gid + "/p1.json", function(err2, file2) {
				var gameObj = JSON.parse(file.toString());
				if(data.id == gameObj.p1) {
					var my = JSON.parse(file2.toString());
					var opp = JSON.parse(file3.toString());
				} else {
					var opp = JSON.parse(file2.toString());
					var my = JSON.parse(file3.toString());
				}
				if(my.ammo == 0) {
					if(curr - my.timestamp >= my.timeToReload) {
						my.ammo = 3;
						my.timeToReload = 0;
					}
					else my.timeToReload -= curr - my.timestamp;
				}
				if(curr - opp.timestamp >= opp.timeToGPS) {
					opp.oppGPS = data.currentGPS;
					opp.timeToGPS = 5*60*1000;
				} else opp.timeToGPS -= curr - opp.timestamp;
				if(data.end) {
					my.gameState = -1;
					opp.gameState = -1;
				}
				if(data.img != 0) {
					my.imState = 1;
					my.ammo--;
					if(my.ammo == 0)
						my.timeToReload = 2*60*1000;
					opp.img = data.img;
				} 					
				if(data.response != -1) {
					if(data.response == 1) {
						my.gameState = 2;
						opp.gameState = 1;
						opp.imState = 0;
					} else if(data.response == 0) {
						opp.imState = 0;
					}
				}
				my.timestamp = curr;
				opp.timestamp = curr;
				var p1Obj, p2Obj;
				if(my.id == gameObj.p1) {
					p1Obj = my;
					p2Obj = opp;
				} else {
					p1Obj = opp;
					p2Obj = my;
				}
				if(my.gameState != 0) {
					rmrf("games/" + data.gid);
				}
				fs.writeFile("games/" + data.gid + "/p1.json", JSON.stringify(p1Obj, null, 4), function() {
					fs.writeFile("games/" + data.gid + "/p2.json", JSON.stringify(p2Obj, null, 4), function() {
						callback(my);
					});
				});
			});
		});
	});
}
function handle(post, res) {
	res.writeHead(200, {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"});
	console.log(post);
	var data = JSON.parse(post);
	switch(data.type) {
		case 1:
			registerName(data.name, function(newId) {
				var body = '{' +
				'\n    "id": ' + newId +
				'\n}\n';
				res.write(body);
				res.end();
			});
			break;
		case 2:
			addRoom(data, 1000, 100000000, function(gid) {
				var body = '{' +
				'\n    "id": ' + gid + 
				'\n}\n'; 
				res.write(body);
				res.end();
			});
			break;
		case 3:
			receive(data, function(result) {
				res.write(JSON.stringify(result, null, 4));
				res.end();
			});
			break;
	}
}
function urldecode(str) {
   return decodeURIComponent((str+'').replace(/\+/g, '%20'));
}
function onReq(req, res) {
    var post = "";
    req.addListener("data", function(data) {
        post += data;
    });
    req.addListener("end", function() {
    	console.log("Data received on port 8000");
        var fin = post;//urldecode(post);
        console.log(fin);
        handle(fin.split("data=")[1], res);
    });
}
http.createServer(onReq).listen(8000);

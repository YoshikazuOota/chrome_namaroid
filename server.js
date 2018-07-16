/*global exports, Ti */
/*jslint plusplus: true, vars: true */
/*global require, exports, Ti  */
/**
 * Created with IntelliJ IDEA.
 * User: yoshikazuoota
 * Date: 2018/07/15
 * Time: 20:40
 * To change this template use File | Settings | File Templates.
 */

var fs = require('fs');
var express = require('express');
var ncp = require("copy-paste");
var os = require('os');

var app = express();
app.use(express.static(__dirname));
var server = require('http').createServer(app).listen(3000);

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {

  socket.on('get_word', function (data) {
      // クライアントから受け取ったデータを出力する
      console.log(data);
      if(os.type().toString().match('Windows')){
          var exec = require('child_process').exec;
          exec('echo ' + data.word  +  ' | clip', {encoding: 'Shift_JIS' }, function(err, stdout, stderr){
              if (err) { console.log(err); }
          });
      } else {
          ncp.copy(data.word);
      }
  });
});
console.log('start server');
console.log(os.type().toString());

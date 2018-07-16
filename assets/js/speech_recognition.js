/*global exports, Ti */
/*jslint plusplus: true, vars: true */
/*global require, exports, Ti  */
/**
 * Created with IntelliJ IDEA.
 * User: yoshikazuoota
 * Date: 2018/07/15
 * Time: 10:17
 * To change this template use File | Settings | File Templates.
 */


var speech = new webkitSpeechRecognition(); //音声認識APIの使用
speech.lang = "ja"; //言語を日本語に設定
var keep_stanby = false;
var socket;

function update_result(text, send_flg) {
    $("#content").text(text);
    console.log(text);

    if( send_flg != undefined ){
        socket.emit('get_word', { word: text });
    }
};
function update_prosess(text) {
    $("#prosess").text(text);
    console.log(text);
}

function update_status(text) {
    $("#status").html(text);
    console.log(text);
};

$(function () {
    socket = io.connect();

    $("#start_btn").on('click', function () {
        update_status('<span class="text-success">『音声認識スタンバイ』</span>');
        keep_stanby = true;
        speech.start();
    });
    $("#end_btn").on('click', function () {
        update_status('<span class="text-danger">『停止中』</span>');
        update_prosess('[音声認識停止中]');
        keep_stanby = false;
        speech.stop();
    });

    speech.onspeechstart = function() {
        update_prosess('[音声取得開始]')
    };

    speech.onspeechend = function(){
        update_prosess('[解析開始]')
    }

    speech.onend = function(){
        // 継続実行処理
        if(keep_stanby){
            speech.start();
        } else {
            speech.stop();
        }
    }
    speech.addEventListener('result', function (e) {
        console.log(e);
        update_result(e.results[0][0].transcript, true);
        update_prosess('[結果表示]');
    });

    speech.addEventListener('error', function (e) {
//        update_result("> [エラー]");
    });

    speech.addEventListener('nomatch', function (e) {
        update_prosess("> [マッチングなし]");
    });

    //初期
    $("#end_btn").trigger('click');
});



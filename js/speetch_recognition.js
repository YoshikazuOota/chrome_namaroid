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
                            

//document.execCommand('copy') で現在選択している部分をコピーできます。

function copyTextToClipboard(textVal){
  // テキストエリアを用意する
  var copyFrom = document.createElement("textarea");
  // テキストエリアへ値をセット
  copyFrom.textContent = textVal;

  // bodyタグの要素を取得
  var bodyElm = document.getElementsByTagName("body")[0];
  // 子要素にテキストエリアを配置
  bodyElm.appendChild(copyFrom);

  // テキストエリアの値を選択
  copyFrom.select();
  // コピーコマンド発行
  var retVal = document.execCommand('copy');
  // 追加テキストエリアを削除
  bodyElm.removeChild(copyFrom);
  // 処理結果を返却
  return retVal;
}

function update_result(text, copy_flg) {
    $("#content").text(text);
    console.log(text);

    if( copy_flg != undefined ){
        console.log(copyTextToClipboard(text));
    }
};

function update_status(text) {
    $("#status").html(text);
    console.log(text);
};


var speech = new webkitSpeechRecognition(); //音声認識APIの使用
speech.lang = "ja"; //言語を日本語に設定

var keep_stanby = false;

$(function () {

    $("#start_btn").on('click', function () {
        update_status('<span class="text-success">『音声認識スタンバイ』</span>');
        keep_stanby = true;
        speech.start();
    });
    $("#end_btn").on('click', function () {
        update_status('<span class="text-danger">『停止中』</span>');
        keep_stanby = false;
        speech.stop();
    });

    speech.onspeechstart = function() {
        update_result('[音声取得開始]')
    };

    speech.onspeechend = function(){
        update_result('[解析開始]')
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
        if(e != null){
            console.log(e);
            update_result(e.results[0][0].transcript, true);
        }
    });

    speech.addEventListener('error', function (e) {
//        update_result("> [エラー]");
    });

    speech.addEventListener('nomatch', function (e) {
        update_result("> [マッチングなし]");
    });

    //初期
    $("#end_btn").trigger('click');

});



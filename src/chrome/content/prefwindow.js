function set_test_status(msg){
  document.getElementById('test_status').value = msg;
}

function set_login_status(msg){
  document.getElementById('login_status').value = msg;
}

function test(){
  try {
    set_test_status('Giris yapiliyor...');
    Garanti.login();
    set_test_status('Giris Basarili.Bakiye aliniyor..');
    set_test_status(['Test Tamamlandi.Bakiye: ',Garanti.account.balance].join('')+' TL');
    Garanti.account.is_logged_in = true;
  } catch(e) {
    set_test_status('Hata Olustu.');
    throw Error(e.message);
  }
}

window.Garanti = window.opener.document.getElementById('garanti-panel').garanti;
window.Garanti.pref_window = window;

window.addEventListener('unload',function(){
  window.Garanti.pref_window = null;
},false)

function set_test_status(msg){
  document.getElementById('test_log').value = msg;
}

function encrypt(){
  var
    cid_el = document.getElementById('cid'),
    pwd_el = document.getElementById('password'),
    pin_el = document.getElementById('pin'),
    login_inf_el = window.opener.document.getElementById('login_inf'),
    cid = cid_el.value,
    password = pwd_el.value,
    pin = pin_el.value
  ;

  login_inf_el.value = [cid,password,pin].join('|');
}

function test(){
  var
    login_inf = window.opener.document.getElementById('login_inf').value.split('|'),
    cid = login_inf[0],
    pwd = login_inf[1],
    pin = login_inf[2]
  ;

  set_test_status('Test baslatiliyor..');
  try {
    var account = new Account();
    account.password = pwd;
    account.cid = cid;
    account.pin = pin;
    set_test_status('Giris yapiliyor...');
    account.login();
    set_test_status('Giris Basarili.Bakiye aliniyor..');
    set_test_status(['Test Tamamlandi.Bakiye: ',account.balance].join('')+' TL');
  } catch(exception){
    set_test_status('Hata olustu');
    if(config.DEBUG)
      alert(
        [
          'File: '+exception.fileName,
          'Line Number: '+ exception.lineNumber,
          'Message: '+ exception.message
        ].join('\n\n')
      );
  }

}
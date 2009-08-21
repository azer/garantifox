var Garanti = {
  'account':null,
  'prefs':null,
  'pref_window':null,
  'balance_watcher':null,
  init:function(){

    document.getElementById('garanti-panel').garanti = this;

    this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
      .getService(Components.interfaces.nsIPrefService)
      .getBranch("garanti.");
    this.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
    this.prefs.addObserver("", this, false);

    this.account = new Account();
    this.key = this.set_rsa_key_512();

  },
  'terminate':function(){
    this.prefs.removeObserver("", this);
  },
  observe: function(subject, topic, data){
    log('prefevent: ',subject,topic,data);
    if (topic != "nsPref:changed")
      return;
  },
  rsa_key_512:"9F2EEA4AA03D55B33172E9A86CFF6156AC1628C67983193A337B98995151F9B0F41562290DB98697280E805803E4B18914519CEB55CEA5D03A927C28C36A4BC7",
  key:null,
  get cid(){
    return this.prefs.getCharPref("cid");
  },
  set_rsa_key_512:function(){
    setMaxDigits(67);
    return (new RSAKeyPair("10001"," ",this.rsa_key_512) );
  },
  encrypt_login:function(cid,pwd,code,salt){
    return encryptedString(this.key,reverseStr(basicEncoder(cid + "_" + pwd + "_" + code + "_" + salt)));
  },
  encrypt_pin:function(pin,salt){
    return encryptedString(this.key,reverseStr(basicEncoder(pin + "_" + salt)));
  },
  'login':function(){
    log('Trying to login');
    if(this.account.is_logged_in){
      this.set_login_status('Oturum acik gorunuyor.Tekrar giris yapmak icin once cikis yapin.');
      return false;
    }
    this.set_login_status('Bekleyin..');
    this.account.cid = this.pref_window.document.getElementById('cid').value;
    this.account.password = this.pref_window.document.getElementById('password').value;
    this.account.pin = this.pref_window.document.getElementById('pin').value;
    try {
      this.set_login_status('Baglati Kuruluyor..');
      this.account.login();
      this.set_login_status('Giris Basarili.');
    } catch(e){
      this.set_login_status('Giris Basarisiz.Lutfen emin olmadan 3 kez deneMEyin.');
      throw Error(e);
    }

    log('Starting balance watcher');
    this.balance_watcher.refresh_information();

  },
  'logout':function(){
    this.set_login_status('Cikis yapiliyor');
    try{
      this.account.logout();
      Garanti.balance_watcher.stop_timer();
      this.set_login_status('Cikis Yapildi.');
    } catch(e){
      this.set_login_status('Cikis Yapilirken Bir Hata Olustu');
      throw Error(e.message);
    }
  },
  'set_login_status':function(msg){
    if(this.pref_window){
      this.pref_window.set_login_status(msg);
    }
  }
};

addEventListener('load',function(){
  if(config.DEBUG)
    debug( Curry(Garanti.init,Garanti) );
  else
    Garanti.init()
},false);

window.addEventListener("unload", function(eventargs) { Garanti.terminate(); }, false);

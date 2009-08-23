var Garanti = {
  'account':null,
  'prefs':null,
  'pref_window':null,
  'balance_watcher':null,
  'pages':{},
  rsa_key_512:"9F2EEA4AA03D55B33172E9A86CFF6156AC1628C67983193A337B98995151F9B0F41562290DB98697280E805803E4B18914519CEB55CEA5D03A927C28C36A4BC7",
  key:null,
  get cid(){
    return this.prefs.getCharPref("cid");
  },
  init:function(){

    document.getElementById('garanti-panel').garanti = this;

    this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
      .getService(Components.interfaces.nsIPrefService)
      .getBranch("garanti.");
    this.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
    this.prefs.addObserver("", this, false);

    this.account = new Account();
    this.key = this.set_rsa_key_512();

    this.refresh_menu();
  },
  'terminate':function(){
    this.prefs.removeObserver("", this);
  },
  observe: function(subject, topic, data){
    log('prefevent: ',subject,topic,data);
    if (topic != "nsPref:changed")
      return;
    switch(data){
      case 'display_balance':
        this.balance_watcher.update_label();
        this.refresh_menu();
        break;
    }
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
    this.refresh_menu();
  },
  'logout':function(){
    this.set_login_status('Cikis yapiliyor');
    try{
      this.account.logout();
      Garanti.balance_watcher.stop_timer();
      Garanti.balance_watcher.value = '';
      this.set_login_status('Cikis Yapildi.');
    } catch(e){
      this.set_login_status('Cikis Yapilirken Bir Hata Olustu');
      throw Error(e.message);
    }
  },
  'open_page':function(page_name){
    var
      page = this.pages[page_name],
      tab = gBrowser.addTab(
        page.url,
        page.referrer,
        'UTF-8',
        page.postdata
        );

    gBrowser.selectedTab = tab;
  },
  'open_dashboard':function(){
    var tab;
    if(this.account.is_logged_in)
      tab = gBrowser.addTab('chrome://garanti/content/dashboard.xul#'+this.account.dashboard_url_key);
    else {
      tab = gBrowser.addTab('https://sube.garanti.com.tr/isube/login');
    }
    gBrowser.selectedTab = tab;
  },
  'refresh_menu':function(){
    var
      is_bal_visible = this.balance_watcher.display_balance,
      hide_el = document.getElementById('garanti-menu-hide-button'),
      show_el = document.getElementById('garanti-menu-show-button')
    ;

    hide_el.collapsed = !this.account.is_logged_in||!is_bal_visible;
    show_el.collapsed = !this.account.is_logged_in||is_bal_visible;
  },
  'set_login_status':function(msg){
    if(this.pref_window){
      this.pref_window.set_login_status(msg);
    }
  },
  set_rsa_key_512:function(){
    setMaxDigits(67);
    return (new RSAKeyPair("10001"," ",this.rsa_key_512) );
  }
};


addEventListener('load',function(){
  if(config.DEBUG)
    debug( Curry(Garanti.init,Garanti) );
  else
    Garanti.init()
},false);

window.addEventListener("unload", function(eventargs) { Garanti.terminate(); }, false);



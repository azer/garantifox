Garanti.balance_watcher = {
  timer:null,
  label:null,
  get display_balance(){
    return Garanti.prefs.getBoolPref("display_balance");
  },
  set display_balance(val){
    Garanti.prefs.setBoolPref("display_balance",val);
  },
  get delay(){
    return Number(Garanti.prefs.getCharPref("delay"))*1000;
  },
  '_value':'',
  get value(){
    return this._value;
  },
  set value(value){
    this._value = value;
    this.update_label();
  },
  'init':function(){
    log('Initializing Balance Watcher');
    this.label = document.getElementById('garanti-balance');
    this.refresh_information();
  },
  'refresh_information':function(){
    log('Refreshing balance information..');
    try {
      this.value = Garanti.account.balance;
      Garanti.account.is_logged_in = true;
    } catch(e){
        log(format_exception(e));

      Garanti.account.is_logged_in = false;
      return;
    }
    this.timer = window.setTimeout(Curry(this.refresh_information,this), this.delay);
  },
  'stop_timer':function(){
    log('Cleaning timout object of balance watcher.');
    try {
      clearTimeout(this.timer);
    } catch(e){}
  },
  'update_label':function(){
    this.label.value = this.display_balance?this.value:'';
  }
};

addEventListener('load',function(){
  if(config.DEBUG)
    debug( Curry(Garanti.balance_watcher.init,Garanti.balance_watcher) );
  else
    Garanti.balance_watcher.init()
},false);

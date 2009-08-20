var balance_watcher = {
  'prefs':null,
  get account_id(){
    return this.prefs.getCharPref("account_id");
  },
  get display_balance(){
    return this.prefs.getBoolPref("display_balance");
  },
  get delay(){
    return Number(this.prefs.getCharPref("delay"))*1000;
  },
  'init':function(){
    log('Initializing Balance Watcher');
    this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
      .getService(Components.interfaces.nsIPrefService)
      .getBranch("garanti.");
    this.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
    this.prefs.addObserver("", this, false);

    this.refresh_information();
  },
  'terminate':function(){
    this.prefs.removeObserver("", this);    
  },
  observe: function(subject, topic, data){
    log('prefevent: ',subject,topic,data);
    if (topic != "nsPref:changed")
      return;
  },
  'refresh_information':function(){
    log('Updating balance watcher bar'); 
    window.setTimeout(Curry(this.refresh_information,this), this.delay);
  },
  'show':function(){
    
  }
};

window.addEventListener("load", function(eventargs) { balance_watcher.init(); }, false);
window.addEventListener("unload", function(eventargs) { balance_watcher.terminate(); }, false);

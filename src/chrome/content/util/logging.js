const aConsoleService = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);

window.log = function(){
  if(!config.DEBUG)return false;
  aConsoleService.logStringMessage(Array.prototype.join.call(arguments,', '));
}

window.log.dir = function(obj){
  if(!config.DEBUG)return false;
  var ltext=('=============')
  ltext+=('\n   D I R   ')
  ltext+='\n'+(obj);
  ltext+=('\n');
  ltext+='\n';
  for(var key in obj){
    ltext+=('\n= '+key+': '+obj[key])
  }
  ltext+=('\n=============');
  log(ltext);
}

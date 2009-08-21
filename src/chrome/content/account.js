function Account(){
  this.pages = {};
}

Account.prototype = {
  'cid':0,
  'password':'',
  'pin':'',
  'login_enc':'',
  'login_salt':'30',
  'pin_enc':'',
  'pin_salt':'',
  'url_key_enc':'',
  'cookie':'',
  'pages':null,
  'is_logged_in':false,
  get balance(){
    var
      data = {
        'hiddenAPPV':'5',
        'hiddenDate':'20.08.2009',
        'hiddenGMT':'Thu, 20 Aug 2009 08:55:14 GMT',
        'hiddenTime':'11.54.00',
        'hiddenUSR':'1280x800',
        'sid':'0'
      }
      ;
    var req = this.open_page('/varliklar/varliklarim',data,{ "Referer":"https://sube.garanti.com.tr/isube/menu" });
    this.pages['my-assets-page'] = req.responseText;
    var search = this.pages['my-assets-page'].match(/Toplam Bakiye  : \r\n([\w,]+)/);
    if(!search||search.length!=2){
      this.is_logged_in = false;
      throw Error(['Could not match balance pattern',this.pages['my-assets-page']].join('\n\n'));
    }
    return search[1];
  },
  get login_salt(){
    var
      req = this.open_page('/loginform'),
      search = req.responseText.match(/\"(\d+)\"\)\)\)\;/)
    ;
    if(!search||search.length!=2)
      throw Error(['Could not find login salt',req.responseText].join('\n\n'));
    return search[1];
  },
  get pin_salt(){
    var
      data = {
        loginType:"LT_SIFRE",
        "sid":130,
        "x":0,
        "y":0
      },
      req = this.open_page(['/encurl/',this.url_key_enc].join(''),data,{ 'Referer':'https://sube.garanti.com.tr/isube/lgng' }),
      search = req.responseText.match(/var datetime \= \"(\w+)\"/)
    ;
    if(!search||search.length!=2)
      throw Error(['Could not find PIN salt',req.responseText].join('\n\n'));
    return search[1];
  },
  'get_my_assets_page':function(){
  },
  'login':function(){

    function step1(){

      var
        salt = this.login_salt,
        data = {
        "LANG":"TR",
        "PAROLA":"",
        "hiddenAPPV":"5",
        "hiddenENCFIELDS":Garanti.encrypt_login(this.cid,this.password,'',salt),
        "hiddenPASSFIELD":"H",
        "sid":"1",
        "textMARS":""
      };

      var req = this.open_page('/login',data);
      this.cookie = req.getResponseHeader('Set-Cookie');
      this.pages['security-image-page'] = req.responseText;

      var search =  this.pages['security-image-page'].match(/\/encurl\/(\w+)/);

      if(!search){
        throw Error(['Could not login','(Step1)','cid:'+this.cid,'pwd:'+this.password,'salt: '+salt].join('\n'));
      }

      this.url_key_enc = search[1];

    };

    function step2(){
      var
        salt = this.pin_salt,
        data = {
          'KANAL':'G',
          'LANG':'TR',
          'sid':'0',
          'hiddenENCFIELDS':Garanti.encrypt_pin(this.pin,salt)
        }
      ;

      var req = this.open_page(['/encurl/',this.url_key_enc].join(''),data);
      this.pages['dashboard-redir-page'] = req.responseText;

      var search =  this.pages['dashboard-redir-page'].match(/\/encurl\/(\w+)/);

      if(!search){
        throw Error(['Could not login','(Step2)',data['hiddenENCFIELDS'],'salt: '+salt,'cookie:'+this.cookie].join('\n'));
      }
    };

    step1.call(this);
    step2.call(this);
    this.is_logged_in = true;
  },
  'logout':function(){
    this.open_page('/cikis');
    this.is_logged_in = false;
  },
  'open_page':function(path,data,headers){

    var req = new XMLHttpRequest(), body='';
    req.open(data&&'POST'||'GET', 'https://sube.garanti.com.tr/isube'+path, false);

    if(data){
      body = '';
      for(var key in data){
        body+=key+'='+data[key]+'&';
      }
      req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      req.setRequestHeader("Content-length", body.length);
    }

    if(headers){
      for(var header in headers)
        req.setRequestHeader(header,headers[header]);
    }

    req.send(body);
    
    if(req.status == 200)
      return req;
    throw Error('Connection Error');
  }
}



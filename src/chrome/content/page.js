function Page(url, args,ref_url) {
  this.url = 'https://sube.garanti.com.tr/isube'+url;
  this.args = args;
  this.ref_url = ref_url||null;
}
Page.prototype = {
  'url':'',
  'args':null,
  'ref_url':null,
  get referrer(){
    const REF_URI = Components.Constructor("@mozilla.org/network/standard-url;1", "nsIURI");
    var ref = new REF_URI;
    ref.spec = this.ref_url;
    return ref;
  },
  get postdata(){
    var body = '';
    for(var key in this.args){
      body+=key+'='+this.args[key]+'&';
    }

    var stringStream = Components.classes["@mozilla.org/io/string-input-stream;1"].createInstance(Components.interfaces.nsIStringInputStream);
    stringStream.data = body;

    var postData = Components.classes["@mozilla.org/network/mime-input-stream;1"].createInstance(Components.interfaces.nsIMIMEInputStream);
    postData.addHeader("Content-Type", "application/x-www-form-urlencoded");
    postData.addContentLength = true;
    postData.setData(stringStream);

    return postData;
  }
}

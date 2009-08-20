var Garanti = {
  init:function(){
    this.key = this.set_rsa_key_512();
  },
  rsa_key_512:"9F2EEA4AA03D55B33172E9A86CFF6156AC1628C67983193A337B98995151F9B0F41562290DB98697280E805803E4B18914519CEB55CEA5D03A927C28C36A4BC7",
  key:null,
  set_rsa_key_512:function(){
    setMaxDigits(67);
    return (new RSAKeyPair("10001"," ",this.rsa_key_512) );
  },
  encrypt_login:function(cid,pwd,code,salt){
    return encryptedString(this.key,reverseStr(basicEncoder(cid + "_" + pwd + "_" + code + "_" + salt)));
  },
  encrypt_pin:function(pin,salt){
    return encryptedString(this.key,reverseStr(basicEncoder(pin + "_" + salt)));
  }
};

addEventListener('load',function(){ Garanti.init() },false);
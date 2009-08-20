import urllib,urllib2,logging,re

URL = 'https://sube.garanti.com.tr/isube'

logging.basicConfig(
  level = logging.DEBUG,
  format = "%(asctime)s %(levelname)s %(message)s",
  filename = 'log',
  filemode = 'w'
)

class Account():
  def __init__(self):
    logging.info('Initializing new garanti account')
    self.login_enc = None
    self.pin_enc = None
    self.url_key_enc = None
    self.cookie = None
    self.pages = {}

  def login(self):
    def step1():
      data = {
        "LANG":"TR",
        "PAROLA":"",
        "hiddenAPPV":"5",
        "hiddenENCFIELDS":self.login_enc,
        "hiddenPASSFIELD":"H",
        "sid":"1",
        "textMARS":"",
      }

      res = self.open_page('/login',data)
      self.cookie = res.headers.getheader('Set-Cookie')
      self.pages['security_image_page'] = res.read()
      if not re.search('\/encurl\/\w+',self.pages['security_image_page']):
        raise CouldNotValidateLogin,'Step 1'
      self.url_key_enc = re.search('encurl\/(\w+)',self.pages["security_image_page"]).groups()[0]

    def step2():
      data = {
        'KANAL':'G',
        'LANG':'TR',
        'sid':'0',
        'hiddenENCFIELDS':self.pin_enc
      }
      res = self.open_page('/encurl/%s'%self.url_key_enc,data,{ 'Cookie':self.cookie })
      self.pages['dashboard_redir_page'] = res.read()
      if not re.search('\/encurl\/\w+',self.pages['dashboard_redir_page']):
        raise CouldNotValidateLogin,'Step 2'

    step1()
    step2()

  @property
  def balance(self):
    logging.info('Getting total balance from my assets page.')
    logging.info('Cookie: '+self.cookie)
    data = {
      'hiddenAPPV':'5',
      'hiddenDate':'18.08.2009',
      'hiddenGMT':'Tue, 18 Aug 2009 14:15:00 GMT',
      'hiddenTime':'17.15.00',
      'hiddenUSR':'1280x800',
      'sid':'0'
    }
    headers = {
      'Cookie':self.cookie,
      'Referer':"https://sube.garanti.com.tr/isube/menu"
    }
    res = self.open_page('/varliklar/varliklarim',data,headers)
    self.pages['my_assets_page'] = res.read()

    return re.search('Toplam Bakiye  : \r\n([\w,]+)',self.pages['my_assets_page']).groups()[0]


  def open_page(self,path,data,headers={}):
    opener = urllib2.build_opener()
    req = urllib2.Request('%s%s'%(URL,path),urllib.urlencode(data),headers)
    return urllib2.urlopen(req)


class CouldNotValidateLogin(Exception): pass

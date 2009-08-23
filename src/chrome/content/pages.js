var
  defargs = {
  'hiddenAPPV':'5',
  'hiddenDate':'01.01.1970',
  'hiddenGMT':'Thu, 20 Jan 1970 00:00:00 GMT',
  'hiddenTime':'00.00.00',
  'hiddenUSR':'0x0',
  'sid':'0'
},
  menu_url = "https://sube.garanti.com.tr/isube/menu"
;

Garanti.pages.varliklarim = new Page('/varliklar/varliklarim',defargs,menu_url);
Garanti.pages.nakitakisi = new Page('/nakitakisi/hesapmenu',defargs,menu_url);
Garanti.pages.fatura = new Page('/fatura/parametrikfaturamenu',defargs,menu_url);
Garanti.pages.vadelihesap = new Page('/vadelihesapislemleri/vadelihesapislemlerimenu',defargs,menu_url);
Garanti.pages.kredikartlari = new Page('/kartislemleri/menu',defargs,menu_url);
Garanti.pages.sanalkartlar = new Page('/kartislemleri/sanalkartislemleri',defargs,menu_url);
Garanti.pages.ibanbilgileri = new Page('/hesaplar/ibanhesaplar',defargs,menu_url);
Garanti.pages.islemlistesi = new Page('/menuall',defargs,menu_url);

import unittest,garanti

acc = garanti.Account()
acc.login_enc = ''
acc.pin_enc = ''

class AccountTest(unittest.TestCase):
  def test1Login(self):
    acc.login()

  def test2Balance(self):
    self.assertEqual(acc.balance,'0')

if __name__ == '__main__':
  unittest.main()
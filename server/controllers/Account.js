const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => {console.log("render login page"); res.render('login')};

const accountPage = (req, res) => {res.render('account')};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/teamMaker' });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash, premium: false });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/teamMaker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username is already taken!' });
    }
    return res.status(500).json({ error: 'An error occured!' });
  }
};

const changePassword = async (req, res) => {
  const username = `${req.body.username}`;
  const oldPassword = `${req.body.oldPassword}`;
  const newPassword = `${req.body.newPassword}`;
  const newPassword2 = `${req.body.newPassword2}`;

  console.log("user: " + username);
  console.log("pw: " + oldPassword);

  if (!oldPassword || !newPassword || !newPassword2 || !username) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (newPassword !== newPassword2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  Account.authenticate(username, oldPassword, async (err, account) => {
    if (err || !account) {
      console.log("user wrong");
      return res.status(401).json({ error: 'Wrong username or password!' });
    }
    const newHash = await Account.generateHash(newPassword);
    account.password = newHash;
    account.save();
    return res.json({ redirect: '/accountPage' });
  });
}

const getPremium = async (req, res) => {
  Account.updatePremium(req.session.account.username, true, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Account not found' });
    }
    req.session.account.premium = true;
    return res.json({ redirect: '/accountPage' })
  })
}

const cancelPremium = async (req, res) => {
  Account.updatePremium(req.session.account.username, false, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Account not found' });
    }
    req.session.account.premium = false;
    return res.json({ redirect: '/accountPage' })
  })
}

const checkPremium = async (req, res) => {
  if (req.session.account.premium)
    return res.json({ premium: true });
  else
    return res.json({ premium: false });
}

module.exports = {
  loginPage,
  accountPage,
  logout,
  login,
  signup,
  changePassword,
  getPremium,
  cancelPremium,
  checkPremium
};

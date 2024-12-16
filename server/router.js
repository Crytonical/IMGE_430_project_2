const controllers = require('./controllers');
const middleware = require('./middleware');

const router = (app) => {
  app.get('/getChampionData', middleware.requiresLogin, controllers.Api.getChampionData);

  app.get('/getTeams', middleware.requiresLogin, controllers.Team.getTeams);

  app.get('/login', middleware.requiresSecure, middleware.requiresLogout, controllers.Account.loginPage);
  app.post('/login', middleware.requiresSecure, middleware.requiresLogout, controllers.Account.login);

  app.post('/signup', middleware.requiresSecure, middleware.requiresLogout, controllers.Account.signup);

  app.get('/logout', middleware.requiresLogin, controllers.Account.logout);

  app.get('/teamMaker', middleware.requiresLogin, controllers.Team.teamMakerPage);
  app.post('/makeTeam', middleware.requiresLogin, controllers.Team.makeTeam);

  app.get('/', middleware.requiresSecure, middleware.requiresLogout, controllers.Account.loginPage);

  app.get('/accountPage', middleware.requiresSecure, middleware.requiresLogin, controllers.Account.accountPage);
  app.get('/checkPremium', middleware.requiresSecure, middleware.requiresLogin, controllers.Account.checkPremium);
  app.put('/getPremium', middleware.requiresSecure, middleware.requiresLogin, controllers.Account.getPremium);
  app.put('/cancelPremium', middleware.requiresSecure, middleware.requiresLogin, controllers.Account.cancelPremium);
  app.put('/changePassword', middleware.requiresSecure, middleware.requiresLogin, controllers.Account.changePassword);

  app.delete('/deleteTeam', middleware.requiresLogin, controllers.Team.deleteTeam);
};

module.exports = router;

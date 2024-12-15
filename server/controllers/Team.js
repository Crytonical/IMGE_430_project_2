const models = require('../models');

const { Team } = models;

const teamMakerPage = async (req, res) => {
  res.render('app');
};

const makeTeam = async (req, res) => {
  if (!req.body.name || 
    !req.body.top || 
    !req.body.jungle || 
    !req.body.mid || 
    !req.body.bot || 
    !req.body.support) {
    console.log('make team error');
    return res.status(400).json({ error: 'All fields are required!' });
  }

  const teamData = {
    name: req.body.name,
    top: req.body.top,
    jungle: req.body.jungle,
    mid: req.body.mid,
    bot: req.body.bot,
    support: req.body.support,
    owner: req.session.account._id
  };

  try {
    const newTeam = new Team(teamData);
    await newTeam.save();
    return res.status(201).json({
      name: newTeam.name,
      top: newTeam.top,
      jungle: newTeam.jungle,
      mid: newTeam.mid,
      bot: newTeam.bot,
      support: newTeam.support,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Team already exists!' });
    }
    return res.status(500).json({ error: `An error occured making team!${err.message}` });
  }
};

const getTeams = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Team.find(query).select('name top jungle mid bot support').lean().exec();
    return res.json({ teams: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving teams!' });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Team.findOneAndDelete(query);

    return res.json({ teams: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error deleteing domos!' });
  }
};

module.exports = {
  teamMakerPage,
  makeTeam,
  getTeams,
  deleteTeam,
};

const models = require('../models');

const { Team } = models;

const teamMakerPage = async (req, res) => 
  {
    res.setHeader('Content-Security-Policy', `connect-src 'self' https://ddragon.leagueoflegends.com`);
    res.render('app');
  }

const makeTeam = async (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  const teamData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id
  };

  try {
    const newTeam = new Team(teamData);
    await newTeam.save();
    return res.status(201).json({
      name: newTeam.name,
      age: newTeam.age
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Team already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making domo!' });
  }
};

const getTeams = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Team.find(query).select('name age').lean().exec();

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

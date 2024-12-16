const champData = require('./champion.json');

const getChampionData = async (req, res) => res.status(200).json(champData.data);

module.exports = {
  getChampionData,
};
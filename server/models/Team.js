const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();
// const setArchetype = (archetype) => _.escape(archetype).trim();

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  top: {
    type: String,
    required: true,
    trim: true,
  },
  jungle: {
    type: String,
    required: true,
    trim: true,
  },
  mid: {
    type: String,
    required: true,
    trim: true,
  },
  bot: {
    type: String,
    required: true,
    trim: true,
  },
  support: {
    type: String,
    required: true,
    trim: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
});

TeamSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  top: doc.top,
  jungle: doc.jungle,
  mid: doc.mid,
  bot: doc.bot,
  support: doc.support,
});

const TeamModel = mongoose.model('Team', TeamSchema);
module.exports = TeamModel;

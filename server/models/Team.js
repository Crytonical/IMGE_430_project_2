const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();
//const setArchetype = (archetype) => _.escape(archetype).trim();

const TeamSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
      set: setName,
    },
    age: {
      type: Number,
      min: 0,
      required: true,
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'Account',
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
    // archetype: {
    //   type: String,
    //   required: true,
    //   trim: true,
    //   set: setArchetype,
    // },
  });

TeamSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age
  //archetype: doc.archetype,
});

const TeamModel = mongoose.model('Team', TeamSchema);
module.exports = TeamModel;
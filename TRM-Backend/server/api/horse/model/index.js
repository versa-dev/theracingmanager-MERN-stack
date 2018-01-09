const mongoose = require('mongoose')
const {Schema} = mongoose
const {applyAlgolia} = require('utils/algolia')
const {removeFilesOnUpdate} = require('utils/mongoose')
const {dehyphenize} = require('utils/transforms')

const horseSearchSettings = require('./searchSettings')

const horseDefinition = require('./definition')
const horsePerformance = require('./performance')
const horseRace = require('./race')
const horseEntry = require('./entry')

const HorseSchema = new Schema(horseDefinition)

const PerformanceSchema = new Schema(horsePerformance)
const RaceSchema = new Schema(horseRace)
const EntrySchema = new Schema(horseEntry)

HorseSchema.plugin(removeFilesOnUpdate)

let horseHelper
if (!global.isTest) {
  horseHelper = applyAlgolia(HorseSchema, horseSearchSettings)
}

HorseSchema.pre('findOne', function () {
  if (this._conditions.name) {
    this._conditions.name = dehyphenize(this._conditions.name)
  }
})

const HorseModel = mongoose.model('Horse', HorseSchema)
const HorsePerformanceModel = mongoose.model('Performance', PerformanceSchema)
const HorseRaceModel = mongoose.model('Race', RaceSchema)
const HorseEntryModel = mongoose.model('Entry', EntrySchema)

module.exports = {
  horseDefinition,
  horseSearchSettings,
  horseHelper,
  HorseModel,
  HorsePerformanceModel,
  HorseRaceModel,
  HorseEntryModel
}

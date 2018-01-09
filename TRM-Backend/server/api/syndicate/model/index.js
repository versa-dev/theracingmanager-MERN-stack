const mongoose = require('mongoose')
const {Schema} = mongoose
const {removeFilesOnUpdate} = require('utils/mongoose')
require('api/horse/model')
const {dehyphenize} = require('utils/transforms')

const syndicateDefinition = require('./definition')

const SyndicateSchema = new Schema(syndicateDefinition)

SyndicateSchema.plugin(removeFilesOnUpdate)

SyndicateSchema.pre('findOne', function () {
  if (this._conditions.name) {
    this._conditions.name = dehyphenize(this._conditions.name)
  }
})

const SyndicateModel = mongoose.model('Syndicate', SyndicateSchema)

Object.assign(SyndicateModel, {
  syndicateDefinition,
  SyndicateSchema
})

module.exports = SyndicateModel

module.exports = Collection

var EventEmitter = require('events').EventEmitter
  , clone = require('lodash.clonedeep')

function Collection(serviceLocator, models) {
  EventEmitter.apply(this)
  this.serviceLocator = serviceLocator
  this.models = models || []
}

// Inherit from event emitter
Collection.prototype = Object.create(EventEmitter.prototype)

Collection.prototype.add = function (model) {
  // Don't allow duplicated cids or ids
  if (this.get(model.cid)) return null
  if (model.id && this.get(model.id)) return null
  this.models.push(model)
  this.emit('add', model)
  return true
}

Collection.prototype.remove = function (id) {
  if (!id) return null
  var toDelete, index
  this.models.some(function (model, i) {
    if (model.id === id || model.cid === id) {
      toDelete = model
      index = i
      return true
    }
  })
  if (!toDelete) return null
  this.models.splice(index, 1)
  this.emit('remove', toDelete)
  return toDelete
}

Collection.prototype.reset = function (models) {
  if (!models) models = []
  this.models = models
  this.emit('reset', models)
}

Collection.prototype.get = function (id) {
  if (!id) return null
  var model
  this.models.some(function (m) {
    if (m.id === id || m.cid === id) {
      model = m
      return true
    }
  })
  if (!model) return null
  return model
}

Collection.prototype.toJSON = function () {
  return this.models.map(function (model) {
    return typeof model.toJSON === 'function' ? model.toJSON() : clone(model)
  })
}

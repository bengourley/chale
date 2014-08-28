module.exports = Collection

var EventEmitter = require('events').EventEmitter

function Collection(serviceLocator, models) {
  EventEmitter.apply(this)
  this.serviceLocator = serviceLocator
  this.models = models || []
}

// Inherit from event emitter
Collection.prototype = Object.create(EventEmitter.prototype)

Collection.prototype.add = function (model) {
  // Don't add duplicate models by id, cid but
  // allow duplicate models if the model.id is null
  if (this.get(model.cid) || model.id !== null && this.get(model.id)) return
  this.models.push(model)
  this.emit('add', model)
}

Collection.prototype.remove = function (id) {
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
  toDelete.emit('remove')
  return toDelete
}

Collection.prototype.reset = function (models) {
  if (!models) models = []
  this.models = models
  this.emit('reset', models)
}

Collection.prototype.get = function (id) {
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
    return typeof model.toJSON === 'function' ? model.toJSON() : model
  })
}

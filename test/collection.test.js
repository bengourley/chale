var Collection = require('../')
  , assert = require('assert')
  , Emitter = require('events').EventEmitter

describe('model', function () {

  describe('new Collection()', function () {

    it('should create a new collection', function () {
      var c = new Collection()
      assert(c instanceof Collection)
    })

    it('should default models to empty array', function () {
      var c = new Collection({})
      assert.deepEqual(c.models, [])
    })

    it('should be an event emitter', function () {
      var m = new Collection({})
      assert(m instanceof Emitter)
    })

  })

  describe('add()', function () {

    it('should add an item to the array of models', function () {

      var c = new Collection({})
        , model = { id: '1' }
      c.add(model)
      assert.equal(1, c.models.length)
      assert.equal(model, c.get('1'))

    })

    it('should emit an add event with the model just added', function (done) {

      var c = new Collection({})
        , model = { id: '1' }

      c.on('add', function (m) {
        assert.equal(model, m)
        done()
      })

      c.add(model)

    })

    it('should not add a duplicate item', function () {

      var c = new Collection({})
      assert.equal(0, c.models.length)
      c.add({ id: '1' })
      assert.equal(1, c.models.length)
      c.add({ id: '1' })
      assert.equal(1, c.models.length)
      c.add({ cid: '1' })
      assert.equal(1, c.models.length)
      c.add({ cid: 'c1' })
      assert.equal(2, c.models.length)
      c.add({ cid: 'c1' })
      assert.equal(2, c.models.length)
      c.add({ id: 'c1' })
      assert.equal(2, c.models.length)

    })

    it('should return true if an item was added', function () {
      var c = new Collection({})
      assert.equal(true, c.add({ id: '1' }))
    })

    it('should return true if an item was added', function () {
      var c = new Collection({})
      c.add({ id: '1' })
      assert.equal(null, c.add({ id: '1' }))
    })

  })

  describe('remove()', function () {

    it('should remove an item with matching id/cid and return it', function () {
      var c = new Collection({})
      c.add({ id: '1' })
      assert.deepEqual({ id: '1' }, c.remove('1'))
      assert.equal(0, c.models.length)
    })

    it('should return null if no id was given', function () {
      var c = new Collection({})
      assert.equal(null, c.remove())
    })

    it('should return null if it can’t match the id/cid', function () {
      var c = new Collection({})
      c.add({ id: '1' })
      assert.equal(null, c.remove('a'))
    })

    it('should emit a remove event with the model just removed', function (done) {
      var c = new Collection({})
        , model = { id: '1' }
      c.on('remove', function (m) {
        assert.equal(model, m)
        done()
      })
      c.add(model)
      c.remove('1')
    })

  })

  describe('get()', function () {

    it('should find an item with matching id/cid and return it', function () {
      var c = new Collection({})
      c.add({ id: '1' })
      assert.deepEqual({ id: '1' }, c.get('1'))
    })

    it('should return null if no id was given', function () {
      var c = new Collection({})
      assert.equal(null, c.get())
    })

    it('should return null if it can’t match the id/cid', function () {
      var c = new Collection({})
      c.add({ id: '1' })
      assert.equal(null, c.get('a'))
    })

  })

  describe('reset()', function () {

    it('should default to an empty array', function () {
      var c = new Collection({})
      c.add({ id: '1' })
      c.reset()
      assert.deepEqual([], c.models)
    })

    it('should emit a reset event with the new set of models', function (done) {
      var c = new Collection({})
        , models = [ { id: '1' }, { id: '2' } ]
      c.on('reset', function (ms) {
        assert.equal(models, ms)
        assert.equal(c.models, ms)
        done()
      })
      c.reset(models)
    })

  })

  describe('toJSON()', function () {

    it('should clone items or call their toJSON() method', function () {
      var c = new Collection({})
      c.add({ id: '1', a: 10, b: 20 })
      c.add({ id: '2', toJSON: function () { return 'json!' } })
      var json = c.toJSON()
      assert.deepEqual([ { id: '1', a: 10, b: 20 }, 'json!' ], json)
      // Ensure the data was cloned by updating the 'json'
      // and checking it didn't affect the models
      json[0].a += 10
      assert.equal(10, c.models[0].a)
    })

  })

})

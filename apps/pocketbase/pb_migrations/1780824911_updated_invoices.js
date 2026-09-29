/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_711030668")
  if (!collection) {
    return
  }

  const field = collection.fields.getById("number3262847721")
  if (field) {
    field.required = false
  }

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_711030668")
  if (!collection) {
    return
  }

  const field = collection.fields.getById("number3262847721")
  if (field) {
    field.required = true
  }

  return app.save(collection)
})

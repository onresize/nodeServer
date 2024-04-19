const router = require('koa-router')()
const localRoutesModel = require('../models/localRoutes')

router.get('/routerList', async (ctx) => {
  let data = await localRoutesModel.find()
  ctx.body = {
    code: '200',
    data,
  }
})

module.exports =  router
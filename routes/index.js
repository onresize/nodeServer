const Router = require('koa-router')
const localRoutes = require('./localRoutes')
const login = require('./login')
const user = require('./user')
const router = new Router()

router.prefix('/koa-api') // 路由前缀

router.use('', localRoutes.routes(), localRoutes.allowedMethods())
router.use('', login.routes(), login.allowedMethods())
router.use('', user.routes(), user.allowedMethods())

module.exports = router

module.exports = async (ctx, next) => {
  if (ctx.session.userInfo) {
    await next()
  } else {
    ctx.body = {
      code: '401',
      msg: '未授权',
    }
  }
}

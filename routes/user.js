const router = require('koa-router')()
const userModel = require('../models/user')

// 添加用户
router.post('/addUser', async (ctx) => {
  let userData = ctx.request.body
  let res = await userModel.create(userData)
  if (res?._id) {
    ctx.body = {
      code: '200',
      msg: '添加成功',
    }
  }
})

// 删除用户
router.delete('/delUserById/:delId', async (ctx) => {
  let { delId } = ctx.params
  let res = await userModel.deleteOne({ _id: delId })
  if (res?.deletedCount) {
    ctx.body = {
      code: '200',
      msg: '删除成功',
    }
  }
})

// 更新用户
router.put('/updateUserById', async (ctx) => {
  let { id } = ctx.query
  let res = await userModel.updateOne({ _id: id }, { name: 'yzw_class' })
  if (res?.acknowledged) {
    ctx.body = {
      code: '200',
      msg: '修改成功',
    }
  }
})

// 查询用户
router.get('/getUser', async (ctx) => {
  const logic = ctx.query?.logic
  const name = ctx.query?.name
  const age = ctx.query?.age
  const current = Number(ctx.query?.current)
  const pageSize = Number(ctx.query?.pageSize)
  let searchQuery = null

  // 关键字查询
  if (name && age) {
    searchQuery = { name, age }
  } else if (age) {
    searchQuery = { age }
  } else if (name) {
    searchQuery = { name }
  }

  // 逻辑查询
  if (logic) {
    // 查询年龄小于35岁 并且是 正式员工
    // searchQuery = { $and: [{ is_full_time: true }, { age: { $lte: 35 } }] }

    // 查询年龄小于35岁 或者是 正式员工
    // searchQuery = { $or: [{ is_full_time: true }, { age: { $lte: 35 } }] }

    // 查询不符合条件的数据
    // searchQuery = { $nor: [{ is_full_time: true }, { age: { $lte: 35 } }] }

    // ($gt：大于、$gte：大于等于、$lt：小于、$lte：小于等于、 $not：取反)
    // 查询年龄小于等于19岁的员工、如果数据没有age、也会返回该条数据
    // searchQuery = { age: { $not: { $gt: 19 } } }

    // 查询年龄小于19岁
    // searchQuery = { age: { $lt: 19 } }

    // 查询年龄大于19岁
    // searchQuery = { age: { $gt: 19 } }

    // 查询年龄大于等于19岁
    // searchQuery = { age: { $gte: 19 } }

    // 查询年龄在大于等于20、小于等于35之间的员工
    // searchQuery = { age: { $gte: 20, $lte: 35 } }

    // 查询名字包含洋的数据
    let nameStr = '洋'
    searchQuery = { name: new RegExp(nameStr) }
  }

  // { name: true, age: true } boolean为true值表示数据需要显示的字段

  let data = await userModel
    .find(searchQuery, { name: true, age: true, is_full_time: true })
    .skip((current - 1) * current || 1)
    .limit(pageSize || 10) // 分页
    .sort({ age: 1 }) // 根据age升序查找
  let total = await userModel.find().count()

  ctx.body = {
    code: '200',
    total,
    data,
  }
})

module.exports = router

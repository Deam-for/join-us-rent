var router = require('koa-router')();
const usersControllers=require('../controller/userController')
router.prefix('/users');

router.get('/a',usersControllers.a);
router.post('/wxlogin',usersControllers.wxlogin);
router.post('/collection',usersControllers.collection);  //获取用户收藏列表
router.post('/publish',usersControllers.my_publish);//获取用户发布的房源
router.post('/remove',usersControllers.remove)
router.post('/shenhefail',usersControllers.shenhefail)
router.post('/users_info',usersControllers.users_info);//存储用户个人信息
router.post('/gain_userinfo',usersControllers.gain_userinfo)//获取用户个人信息
router.post('/publish_comment',usersControllers.publish_comment)
router.post('/remove_house',usersControllers.remove_house)
router.post('/my_cicle',usersControllers.my_cicle)
router.post('/shangjia',usersControllers.shangjia);
module.exports = router;

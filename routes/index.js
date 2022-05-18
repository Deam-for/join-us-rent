var router = require('koa-router')();
const indexCtroller=require('../controller/indexCtroller')


router.get('/', function *(next) {
  yield this.render('index', {
    title: 'Hello World Koa!'
  });
});

router.post('/house_info',indexCtroller.house_info);  //获取发布信息

router.post('/house_detail',indexCtroller.house_detail) //获取用户点击的房屋信息

module.exports = router;

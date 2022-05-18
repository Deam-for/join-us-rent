var router = require('koa-router')();
let landlord=require('../controller/landlord');

router.prefix('/landlord');          

router.post('/houseinfo_detail',landlord.houseinfo_detail);//获取房东上传房子的具体信息
router.post('/houseinfo_update',landlord.houseinfo_update);//房子发布信息的修改
router.post('/schedule',landlord.schedule)

module.exports = router;
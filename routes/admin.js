var router = require('koa-router')();
let adminCtroller=require('../controller/adminCtroller');

router.prefix('/admin'); 
router.post('/addcity',adminCtroller.addcity);
router.get('/city_list',adminCtroller.city_list);
router.post('/add_cityArea',adminCtroller.add_cityArea)
router.post('/city_area',adminCtroller.city_area);
router.post('/update_cityArea',adminCtroller.update_cityArea);
router.post('/delete_area',adminCtroller.delete_area)

router.post('/login',adminCtroller.login);
router.post('/register',adminCtroller.register);
router.post('/admin_num',adminCtroller.admin_num)
router.get('/users_info',adminCtroller.users_info)
router.post('/search_users',adminCtroller.search_users)
router.post('/users_freeze',adminCtroller.users_freeze)
router.post('/users_unfreeze',adminCtroller.users_unfreeze)

// house
router.post('/house_info',adminCtroller.house_info)
router.get('/house_check',adminCtroller.house_check)
router.post('/house_search',adminCtroller.house_search)
router.post('/house_detail',adminCtroller.house_detail)
router.post('/house_cancel',adminCtroller.house_cancel)
router.post('/check_result',adminCtroller.check_result)
router.post('/house_users',adminCtroller.house_users)
//banner
router.get('/banner',adminCtroller.banner)
router.get('/banner_filtrate',adminCtroller.filtrate)
router.post('/save_banner',adminCtroller.save_banner)
router.post('/banner_update',adminCtroller.update_banner)
router.post('/banner_updated',adminCtroller.banner_updated)
router.post('/banner_delete',adminCtroller.banner_delete)
// report
router.get('/report',adminCtroller.report)
router.post('/report_detail',adminCtroller.report_detail)
router.post('/report_result',adminCtroller.report_result)
module.exports = router;
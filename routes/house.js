var router = require('koa-router')();
let houseCtroller=require('../controller/houseCtrooler');

router.prefix('/house');            
router.post('/collection',houseCtroller.collection)
router.post('/classify',houseCtroller.classify);
router.post('/schedule',houseCtroller.schedule);
router.post('/cicle',houseCtroller.cicle)
router.post('/ciclecomment',houseCtroller.ciclecomment);
router.post('/cicle_join',houseCtroller.cicle_join)
router.post('/cicle_quit',houseCtroller.cicle_quit)
router.post('/dianzan',houseCtroller.dianzan)
router.post('/delete_dianzan',houseCtroller.delete_dianzan)
router.post('/comment_detail',houseCtroller.comment_detail)
router.post('/house_search',houseCtroller.house_search)
router.post('/reply_comment',houseCtroller.reply_comment)
module.exports = router;
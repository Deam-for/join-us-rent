var router = require('koa-router')();
const query=require('../lib/sql_query');
const publish_rent=require('../controller/publish_rentController');

const multer=require('koa-multer');
let data='';
let pic=''
let times=0;
let openid=';'
var storage = multer.diskStorage({
    //文件保存路径
    destination: function(req, file, cb) {
        cb(null,'./public/uploads/' );
    },
    //修改文件名称
    filename: function(req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        pic=Date.now() + "." + fileFormat[fileFormat.length - 1]
        cb(null, pic);
        data=req.body;
    }
})
//加载配置
  var upload = multer({
 storage: storage
});

router.prefix('/publish_rent');

router.post('/publish',upload.single('img'),async (ctx)=>{
    function file(){
        return new Promise((resovle,rejects)=>{
                resovle({fil:2})
        })
    }
    console.log(data.type);
    let  sql=`select openid from users where sign='${data.session}'`;
    openid=await query(sql);
    times=Date.now()
    let sql1=`INSERT INTO  house_info VALUES(null,'${openid[0].openid}','${data.title}',${data.money},'${data.location}','${data.restrict}','${data.decrible}','${pic}',${times},'${data.type}','待审核','${data.city}','${data.province}','${data.district}','null','null')`
    console.log(sql1);
    await query(sql1);
    await file();
    ctx.body="200"
});
router.post('/pic',upload.single('img'),async (ctx)=>{
    function file(){
        return new Promise((resovle,rejects)=>{
                resovle({fil:2})
        })
    }
    let old_pic=await query(`select * from house_info where openid='${openid[0].openid}' and create_time=${times}`);
    let new_pic=old_pic[0].pic+','+pic;
    let a=await query(`update house_info set pic='${new_pic}' where id=${old_pic[0].id}`);
    ctx.body='200'

});
router.post('/pic_check',upload.single('img'),async(ctx)=>{
    function file(){
        return new Promise((resovle,rejects)=>{
                resovle({fil:2})
        })
    }
    let old_pic=await query(`select * from house_info where openid='${openid[0].openid}' and create_time=${times}`);
    let new_pic='';
    if(old_pic[0].check=='null'){
        new_pic=old_pic[0].pic+','+pic;
    }else{
        new_pic=pic
    }
    await query(`update house_info set checks='${new_pic}' where id=${old_pic[0].id}`);
    ctx.body='200'
});
router.post('/lanlord_update',upload.single('img'),async(ctx)=>{
    console.log(data.id);
    function file(){
        return new Promise((resovle,rejects)=>{
                resovle({fil:2})
        })
    }
    pic=pic+','+data.pic;
    let sql=`update house_info set title='${data.title}',money=${data.money},location='${data.location}',restricts='${data.restricts}',decrible='${data.decrible}',pic='${pic}' where id=${data.id}`;
    console.log(sql)
    await query(sql);
    ctx.body=200
});
router.post('/cicle_publish',upload.single('img'),async (ctx)=>{
    function file(){
        return new Promise((resovle,rejects)=>{
                resovle({fil:2})
        })
    }
    let  sql=`select openid from users where sign='${data.openid}'`;
    openid=await query(sql);
    times=Date.now()
    let sql1=`INSERT INTO  cicle_comment VALUES(null,'${openid[0].openid}','${data.message}','${times}','${data.location}','${data.cicle}','${pic}')`
    
    console.log(sql1);
    await query(sql1);
    await file();
    ctx.body="200"
});
router.post('/cicle_pic',upload.single('img'),async (ctx)=>{
    function file(){
        return new Promise((resovle,rejects)=>{
                resovle({fil:2})
        })
    }
    let old_pic=await query(`select * from cicle_comment where openid='${openid[0].openid}' and create_time=${times}`);
    let new_pic=old_pic[0].pic+','+pic;
    let a=await query(`update cicle_comment set pic='${new_pic}' where id=${old_pic[0].id}`);
    ctx.body='200'

});
router.post('/report',upload.single('img'),async (ctx)=>{
    function file(){
        return new Promise((resovle,rejects)=>{
                resovle({fil:2})
        })
    }
    openid=await query(`select openid from users where sign='${data.openid}'`);
    times=Date.now()
    let sql1=`INSERT INTO  report VALUES(null,'${openid[0].openid}',${data.id},'${data.cause}','${data.content}','${pic}',${times})`
    console.log(sql1);
    await query(sql1);
    await file();
    ctx.body="200"
});
router.post('/report_pic',upload.single('img'),async (ctx)=>{
    function file(){
        return new Promise((resovle,rejects)=>{
                resovle({fil:2})
        })
    }
    let old_pic=await query(`select * from report where openid='${openid[0].openid}' and create_time=${times}`);
    let new_pic=old_pic[0].pic+','+pic;
    let a=await query(`update report set pic='${new_pic}' where id=${old_pic[0].id}`);
    ctx.body='200'

});
router.post('/banner',upload.array('avatar',5),async(ctx)=>{
    const files=ctx.req.files;
    let pic=''
    pic='http://127.0.0.1:3000/uploads/'+files[0].filename;
    let data=ctx.query;
    await query(`insert into banner values(null,'${data.title}','${pic}',${data.sort},${data.house_id},'启用')`);
    ctx.body=200
});
router.post('/banner_update',upload.array('avatar',5),async(ctx)=>{
    const files=ctx.req.files;
    let pic=''
    pic='http://127.0.0.1:3000/uploads/'+files[0].filename;
    let data=ctx.query;
    await query(`update banner set title='${data.title}',sort=${data.sort},house_id=${data.house_id},img_url='${pic}' where id=${data.id}`);
    ctx.body=200
});
router.post('/banner_add',upload.single('img'),async(ctx)=>{
    console.log(data.house_id);
    let img='http://127.0.0.1:3000/uploads/'+pic
    await query(`insert into banner values(null,'${data.title}','${img}',0,${data.house_id},'禁用')`)
    ctx.body=200
})
module.exports = router;
const db=require("../config/db")
const  koa2Req = require('koa2-request');
const query=require('../lib/sql_query')

module.exports={
    a:async(ctx,next)=>{
        let sql='select * from users';
        
        let result=await query(sql);
        console.log(result)
        ctx.body=result;
    },
    wxlogin:async(ctx,next)=>{
        const {userinfo,APPID,SECRET,JSCODE} = ctx.request.body;
        let url = 'https://api.weixin.qq.com/sns/jscode2session?appid='+APPID+'&secret='+SECRET+'&js_code='+JSCODE+'&grant_type=authorization_code';
        let res = await koa2Req(url);
        const {session_key,openid} = JSON.parse(res.body);
        let a=`${Date.now()}+${Math.random()}`+session_key+openid;
        let sql1=`select * from users where openid='${openid}'`;
        let data=await query(sql1);
        if(data[0].status=='冻结中'){
            ctx.body={msg:'该用户已冻结'}
        }
        else if(data.length>0){
            await query(`update users set sign='${a}' where openid='${openid}'`);
            ctx.body={msg:200,a};
        }
        else{
            await query(`insert  into users(openid,nickname,gender,avatar_url,sign) values('${openid}','${userinfo.nickName}',${userinfo.gender},'${userinfo.avatarUrl}','${a}')`);
            ctx.body={msg:200,a}
        }
        
    },
    collection:async(ctx,next)=>{
        let id=ctx.request.body.id;
        let openid=await query(`select openid from users where sign='${id}'`);
        ctx.body=await query(`select b.type,b.id,b.pic,b.title,b.location,b.money,b.district from thumbs_list a,house_info b  where a.house_id=b.id and a.user_openid='${openid[0].openid}'`)
    },
    my_publish:async(ctx,next)=>{
        console.log(ctx.request.body);
        let id=ctx.request.body.id;
        let openid=await query(`select openid from users where sign='${id}'`);
        ctx.body=await query(`select * from  house_info where  openid='${openid[0].openid}' and status='上架中' or status='待审核'`)
    },
    users_info:async(ctx,next)=>{
        let data=ctx.request.body.data;
        let id=ctx.request.body.id;
        await  query(`update users set age='${data[1]}',work='${data[2]}',constellatory='${data[3]}',weixin='${data[4]}',phone=${data[5]}  where sign='${id}'`);
        ctx.body=200
    },
    gain_userinfo:async(ctx,next)=>{
        let id=ctx.request.body.id;
        let  data=await query(`select * from users where sign='${id}'`)
        ctx.body=data;
    },
    publish_comment:async(ctx,next)=>{
        console.log(ctx.request.body.data.data);
        let {type,id,to_id,textarea,sign}=ctx.request.body.data;
        let from_id=(await query(`select openid from users where sign='${sign}'` ))[0].openid;
        await query(`insert into comment values(null,'${type}','${to_id}','${from_id}','${textarea}',${id})`)
        ctx.body=200
    },
    remove_house:async(ctx,next)=>{
        let {id,sign}=ctx.request.body
        await query(`update house_info set status='已下架' where id=${id}`);
        ctx.body=200
    },
    shenhefail:async(ctx,next)=>{
        let id=ctx.request.body.id;
        let openid=await query(`select openid from users where sign='${id}'`);
        ctx.body=await query(`select * from house_info where openid='${openid[0].openid}'and status='审核不通过'`)
    },
    remove:async(ctx,next)=>{
        let id=ctx.request.body.id;
        let openid=await query(`select openid from users where sign='${id}'`);
        ctx.body=await query(`select * from  house_info where  openid='${openid[0].openid}' and status='已下架'`)
    },
    my_cicle:async(ctx,next)=>{
        let  sign=ctx.request.body.sign;
        let openid=(await query(`select openid from users where sign='${sign}'`))[0].openid;
        let cicle=await query(`select b.id,b.area from cicle_number a,city_area b where a.city_area=b.id and a.openid='${openid}'`)
        let comment=await query(`select b.nickname,b.avatar_url,a.create_time,a.content,a.location,a.city_area,a.pic,a.id from cicle_comment a,users b where a.openid=b.openid and a.openid='${openid}'`)
        for (let index = 0; index < comment.length; index++) {
            const item = comment[index];
            let a=await query(`select  count(*) num from dianzan where openid='${openid}'and  comment_id=${item.id}`);
                if(a[0].num){
                    item.dianzan=true
                }else{
                    item.dianzan=false
                }
        }
        ctx.body={cicle,comment}
    },
    shangjia:async(ctx,next)=>{
        let {id}=ctx.request.body;
        console.log(ctx.request.body);
        await query(`update house_info set status='待审核' where id=${id}`)
        ctx.body=200
    }

}
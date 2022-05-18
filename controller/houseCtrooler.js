const query=require('../lib/sql_query');

module.exports={
    collection:async(ctx,next)=>{
        let data=ctx.request.body;
        let id=await query(`select openid from users where sign='${data.user_id}'`);
        if(data.type=='add'){
            await query(`insert into thumbs_list(user_openid,house_id) values('${id[0].openid}',${data.id})`);
        }else{
            await query(`delete from thumbs_list where user_openid='${id[0].openid}' and house_id=${data.id}`)
        }
        ctx.body=200
    },
    classify:async(ctx,next)=>{
        let data=ctx.request.body.type;
        if(data=='find_roommate'){
            ctx.body=await query(`select * from house_info where type='找室友' and status='上架中'`);
        }else if(data=='attorn'){
            ctx.body=await query(`select * from house_info where type='转租'and status='上架中'`)
        }else if(data=="landlord"){
            ctx.body=await query(`select * from house_info where type='房东直租' and status='上架中'`)
        }
    },
    schedule:async(ctx,next)=>{
        let data=ctx.request.body.data
        let  user_info=await query(`select openid from users where sign='${data.openid}'`);
        let landlord_info=await query(`select openid from house_info where id='${data.id}'`);
        await query(`update house_info set status='已交押金' where id=${data.id}`)
        await query(`INSERT  into schedule values(null,${data.id},'${landlord_info[0].openid}','${user_info[0].openid}',200)`);
        ctx.body=200
    },
    cicle:async(ctx,next)=>{
        let location=ctx.request.body.location;
        ctx.body=await query(`select * from city_area where city_id=(select id from city_list where city_name ='${location}')`)
    },
    ciclecomment:async(ctx,next)=>{
        await query(`update city_area set view_num=view_num+1 where id=${ctx.request.body.id}`)
        let data=await query(`select b.nickname,b.avatar_url,a.create_time,a.content,a.location,a.city_area,a.pic,a.id from cicle_comment a,users b where a.openid=b.openid and a.city_area=(select area from city_area where id=${ctx.request.body.id})`)
        let openid=await query(`select openid from users where sign='${ctx.request.body.sign}'`);
        let thumbs=await query(`select * from cicle_number where openid='${openid[0].openid}' and city_area=${ctx.request.body.id}`);
        let city_area=await query(`select * from city_area where id=${ctx.request.body.id}`)
        for (let index = 0; index < data.length; index++) {
            const item = data[index];
            let a=await query(`select  count(*) num from dianzan where openid='${openid[0].openid}'and  comment_id=${item.id}`);
            console.log(a[0].num)
                if(a[0].num){
                    item.dianzan=true
                }else{
                    item.dianzan=false
                }
        }
        let sign=true
        if(!data.length){data=await query(`select * from city_area where id=${ctx.request.body.id}`);
        data[0].city_area=data[0].area;
        sign=false
        }
        console.log(thumbs.length);
        if(thumbs.length>0){thumbs=true}else{thumbs=false}
        ctx.body={content:data,thumbs:thumbs,sign,city_area}
    },
    cicle_join:async(ctx,next)=>{
        console.log(ctx.request.body);
        let data=ctx.request.body;
        let openid=await query(`select openid from users where sign='${data.sign}'`);
        await query(`insert into cicle_number values(null,'${openid[0].openid}',${data.city_area},'${data.location}')`)
        await query(`update city_area set join_num=join_num+1 where id=${data.city_area}`)
        ctx.body=200
    },
    cicle_quit:async(ctx,next)=>{
        console.log(ctx.request.body);
        let{sign,city_area,location}=ctx.request.body;
        let openid=(await query(`select openid from users where sign='${sign}'`))[0].openid;
        await query(`delete from cicle_number where openid='${openid}' and city_area=${city_area} and city='${location}'`)
        await query(`update city_area set join_num=join_num-1 where id=${city_area}`)
        ctx.body=200
    },
    dianzan:async(ctx,next)=>{
        console.log(ctx.request.body);
        let data=ctx.request.body;
        let openid=await query(`select openid from users where sign='${data.sign}'`);
        await  query(`insert into dianzan values(null,'${openid[0].openid}',${data.id})`);
        ctx.body=200
    },
    delete_dianzan:async(ctx,next)=>{
        console.log(ctx.request.body);
        let data=ctx.request.body.data;
        let openid=await query(`select openid from users where sign='${data.sign}'`);
        await  query(`delete from dianzan where openid='${openid[0].openid}' and comment_id=${data.id}`);
        ctx.body=200
    },
    comment_detail:async(ctx,next)=>{
        let data=await query(`select b.nickname,b.avatar_url,a.openid,a.create_time,a.content,a.location,a.city_area,a.pic,a.id from cicle_comment a,users b where a.openid=b.openid and id=${ctx.request.body.id}`)
        let comment=await query(`select a.id,a.content,b.nickname,b.avatar_url from comment a,users b where a.from_id=b.openid and type='cicle' and type_id=${ctx.request.body.id}`)
        let reply=await query(`select * from reply_comment where comment_id=${ctx.request.body.id}`)
        console.log(reply);
        ctx.body={data,comment,reply}
    },
    house_search:async(ctx,next)=>{
        console.log(ctx.request.body.city);
        let district=await query(`select * from house_info where district='${ctx.request.body.location}'and status='上架中'`);
        let city=await query(`select * from house_info where city='${ctx.request.body.city}' and status='上架中'`);
        let data=district.concat(city);
        console.log(data);
        ctx.body=data
    },
    reply_comment:async(ctx,next)=>{
        console.log(ctx.request.body);
        let data=ctx.request.body.data
        let users_info=(await query(`select * from users where sign='${data.openid}'`))[0];
        console.log(users_info);
        let time=Date.now()
        await query(`insert into reply_comment values(null,'${users_info.nickname}','${users_info.avatar_url}','${data.comment}','${time}',${data.cid},'${data.reply_name}',${data.comment_id})`)
        ctx.body=200
    }
}
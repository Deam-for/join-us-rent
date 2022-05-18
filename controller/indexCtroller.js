const query=require('../lib/sql_query');


module.exports={
    house_info:async(ctx,next)=>{
      console.log(ctx.request.body);
        let info=await query(`select * from house_info,users where house_info.openid=users.openid and house_info.status='上架中' and house_info.city='${ctx.request.body.location}'`);
        let banner=await query(`select * from banner where status='启用'`)
        for (let index = 1; index < banner.length; index++) {
            for (let item = 0; item < banner.length-index; item++) {
              if(banner[item].sort>banner[item+1].sort){
                [banner[item],banner[item+1]]= [banner[item+1],banner[item]]
              }
            }
          }
        ctx.body={info,banner}
    },
    house_detail:async(ctx,next)=>{
        console.log(ctx.request.body.data);
        let id=ctx.request.body.id;
        let openid=await query(`select openid from users where sign='${ctx.request.body.openid}'`);
        let sign=await query(`select * from thumbs_list where house_id=${id} and user_openid='${openid[0].openid}'`)
        let data=await  query(`select * from house_info,users  where house_info.id=${id} and house_info.openid=users.openid`)
        let comment=await query(`select a.id,a.content,b.nickname,b.avatar_url from comment a,users b where a.from_id=b.openid and type='house' and type_id=${data[0].id}`)
        ctx.body={data:data,sign,comment}
    }
}
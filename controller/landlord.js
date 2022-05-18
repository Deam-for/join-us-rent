const query=require('../lib/sql_query');

module.exports={
    houseinfo_detail:async(ctx,next)=>{
        let id=ctx.request.body.id;
        ctx.body=await query(`select * from house_info where id=${id}`);
    },
    houseinfo_update:async(ctx,next)=>{
        let data=ctx.request.body.data;
        console.log(data)
        let sql=`update house_info set title='${data.title}',money=${data.money},location='${data.location}',city='${data.city}',province='${data.province}',district='${data.district}',restricts='${data.restricts}',decrible='${data.decrible}',pic='${data.pic}' where id=${data.id}`;
        await query(sql)
        ctx.body=200
    },
    schedule:async(ctx,next)=>{
        let openid=await  query(`select openid from users where sign='${ctx.request.body.data}'`);
        let data=await query(`select * from schedule where house_landlord_openid='${openid[0].openid}'`);
        console.log(data)
    }
}
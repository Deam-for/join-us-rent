const query=require('../lib/sql_query');
const md5=require('../lib/encryption');

module.exports={
    addcity:async(ctx,next)=>{
        await query(`insert into city_list values(null,'${ctx.request.body.city}')`)
        ctx.body=await query(`select * from city_list`)
    },
    city_list:async(ctx,next)=>{
        ctx.body=await query(`select * from city_list`)
    },
    add_cityArea:async(ctx,next)=>{
        console.log(ctx.request.body);
        let  data=ctx.request.body;
        await query(`insert into city_area values(null,'${data.area}','${data.type}',${data.city_id})`)
        ctx.body=await query(`select * from city_area where city_id=${data.city_id}`)
    },
    city_area:async(ctx,next)=>{
        ctx.body=await query(`select * from city_area where city_id=(select id from  city_list where city_name='${ctx.request.body.city}')`)
    },
    update_cityArea:async(ctx,next)=>{
       console.log(ctx.request.body)
       let date=ctx.request.body;
       await query(`update city_area set area='${date.area}',type='${date.type}' where id=${date.id}`)
       ctx.body=await query(`select * from city_area where city_id=${date.city_id}`)
    },
    delete_area:async(ctx,next)=>{
        await query(`delete from city_area where id=${ctx.request.body.id}`)
        ctx.body=await query(`select * from city_area where city_id=${ctx.request.body.city_id}`);
    },
    login:async(ctx,next)=>{
        let {users,password}=ctx.request.body
        let data=(await query(`select * from admin where users='${users}'`))[0];
        console.log(data)
        if(data){
            password=await md5.MD5(password,data.solt);
            console.log(password);
            if(password==data.password){
                ctx.body={msg:'登陆成功',name:data.name}
            }else{
                ctx.body='密码错误'
            }
        }else{
            ctx.body='账号不存在'
        }
    },
    register:async(ctx,next)=>{
        let {name,users,password,province,city}=ctx.request.body;
        let solt=md5.getUuid().v4();
        let num=await query(`select count(*) num from admin where users='${users}'`)
        if(num[0].num>0){
            ctx.body={msg:'该账号已存在',status:404}
        }else{
            password=await md5.MD5(password,solt);
            await query(`insert into admin values(null,'${name}','${users}','${password}','${solt}','${province}','${city}','启用')`)
            ctx.body={msg:'添加成功',status:200}
        }
    },
    admin_num:async(ctx,next)=>{
        let {pageIndex,pageSize}=ctx.request.body;
        let pos=(pageIndex-1)*pageSize;
        let content=await query('select * from admin');
        let num=content.length;
        content=content.splice(pos,pageSize);
        ctx.body={content,num}
    },
    users_info:async(ctx,next)=>{
    console.log('as');
        ctx.body=await query(`select * from users`);
    },
    search_users:async(ctx,next)=>{
        let {type,data}=ctx.request.body;
        console.log(`select * from users where ${type}='%${data}%'`);
        ctx.body=await query(`select * from users where ${type} like '%${data}%'`)
    },
    users_freeze:async(ctx,next)=>{
        let {openid}=ctx.request.body;
        await query(`update  users set status='冻结中' where openid='${openid}'`)
        ctx.body=await query(`select * from users`);
    },
    users_unfreeze:async(ctx,next)=>{
        let {openid}=ctx.request.body;
        await query(`update  users set status='未冻结' where openid='${openid}'`)
        ctx.body=await query(`select * from users`);
    },

    // 房源信息
    house_info:async(ctx,next)=>{
        let {pageIndex,pageSize,status}=ctx.request.body;
        let pos=(pageIndex-1)*pageSize;
        let content=await query(`select a.id,a.title,b.nickname,b.openid,a.status,a.province,a.city,a.district,a.location,a.money from house_info a,users b where a.openid=b.openid and  a.status='${status}'`)
        let num=content.length;
        content=content.splice(pos,pageSize);
        ctx.body={content,num}
    },
    house_check:async(ctx,next)=>{
        ctx.body=await query(`select a.id,a.title,b.nickname,b.phone,a.province,a.city,a.district,a.location,a.money from house_info a,users b where a.openid=b.openid and a.status='待审核'`)
    },
    house_search:async(ctx,next)=>{
        let {type,data}=ctx.request.body;
        ctx.body=await query(`select a.id,a.title,b.nickname,b.phone,a.province,a.city,a.district,a.location,a.money from house_info a,users b where a.openid=b.openid and ${type} like '%${data}%'`)
    },
    house_detail:async(ctx,next)=>{
        let {id}=ctx.request.body;
        ctx.body=await query(`select * from house_info a,users b where a.openid=b.openid and a.id=${id}`);
    },
    house_cancel:async(Ctx,next)=>{
        let {id}=Ctx.request.body;
        await query(`update house_info set status='已下架' where id=${id}`)
        let data=await query(`select a.id,a.title,b.nickname,b.phone,a.province,a.city,a.district,a.location,a.money from house_info a,users b where a.openid=b.openid and  a.status='上架中'`)
        Ctx.body={msg:200,data}
    },
    check_result:async(ctx,next)=>{
        let {id,msg,textarea}=ctx.request.body
        if(msg=='审核不通过'){
            await query(`update house_info set status='${msg}',remark='${textarea}' where id=${id}`)
        }else{
            await query(`update house_info set status='${msg}' where id=${id}`)
        }
        ctx.body=200
    },
    house_users:async(ctx,next)=>{
        let {pageIndex,pageSize,openid}=ctx.request.body;
        let pos=(pageIndex-1)*pageSize;
        let content=await query(`select a.id,a.title,b.nickname,a.status,a.province,a.city,a.district,a.location,a.money from house_info a,users b where a.openid=b.openid and  a.openid='${openid}'`);
        let num=content.length;
        content=content.splice(pos,pageSize);
        ctx.body={content,num}
    },

    // 轮播图
    banner:async(ctx,next)=>{
        ctx.body=await query(`select * from banner where status='启用'  or status='禁用'`)
    },
    save_banner:async(ctx,next)=>{
        let data=ctx.request.body.data;
        data.forEach(async(item) => {
            await query(`update banner set sort=${item.sort} where id=${item.id}`);
        });
        ctx.body=200
    },
    update_banner:async(ctx,next)=>{
        let id=ctx.request.body.id;
        ctx.body=await query(`select * from banner where id=${id}`);
    },
    banner_updated:async(ctx,next)=>{
        let {data,id}=ctx.request.body;
        await query(`update banner set title='${data.title}',sort=${data.sort},house_id=${data.house_id} where id=${id}`)
        ctx.body=200
    },
    banner_delete:async(ctx,next)=>{
        let {id,type}=ctx.request.body;
        if(type=='delete'){
            await query(`delete from banner where id=${id}`);
        }else {
            await query(`update banner set status='${type}' where id=${id}`)
        }
        let data=await query(`select * from banner where status ='启用' or status='禁用'`)
        ctx.body={msg:200,data:data}
    },
    filtrate:async(ctx,next)=>{
        ctx.body=await query(`select * from banner where status='待筛选'`)
    },

    // report
    report:async(ctx,next)=>{
        ctx.body=await query(`select * from report`)
    },
    report_detail:async(ctx,next)=>{
        let id=ctx.request.body.id;
        ctx.body=await query(`select * from report a,users b where a.openid=b.openid and a.id=${id}`);
    },
    report_result:async(ctx,next)=>{
        let {house_id,id,type}=ctx.request.body;
        if(type=='success'){
            await query(`update house_info set status='已下架' where id=${house_id}`)
            await query(`update report set result='违规下架' where id=${id}`)
        }else{
            await query(`update report set result='举报不实' where id=${id}`)
        }
        ctx.body=await query(`select * from report`)
    }
}
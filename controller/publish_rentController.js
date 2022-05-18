const query=require('../lib/sql_query');
const multer=require('koa-multer');


module.exports={
    publish:async(ctx,next)=>{
       upload(req,res,function(err){
           if(err) throw error;
           else{
               console.log(ctx.req.file)
           }
       })
    }
}
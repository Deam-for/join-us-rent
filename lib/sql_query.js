const db=require('../config/db');

let backdata=function(sql){
    return new Promise((resolve,reject)=>{
        db.allSqlAction(sql,function(err,result){
            if(err){reject(error);}
            else{
                resolve(result)}
        });
    })
}
module.exports=backdata
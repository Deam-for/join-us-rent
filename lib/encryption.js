const md5=require('md5')
const uuid=require('node-uuid')

let MD5=async function(val,salt){
    let passSalt=md5(md5(val)+salt);
    return passSalt
}
let getUuid=function(){
    return uuid.v4
}

module.exports={
    MD5,getUuid
}
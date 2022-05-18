const mysql = require("mysql")
const DBConfig = require("./mysql_config")


/*建立连接池*/
let pool = mysql.createPool(DBConfig)

/*连接数据库*/
// let allSqlAction = (sql, value) => {
//     return new Promise((resolve, reject) => {
//         pool.getConnection(function (err, connection) {
//             if (err) {
//                 console.log(err)
//                 reject(err)
//             }
//             else {
//                 console.log("数据库连接成功")
//                 connection.query(sql, value, (err, row) => {
//                     if (err) reject(err)
//                     else{
//                         resolve(row)
//                     } 
//                     connection.release()
//                 })
//             }
//         })
//     })
// }

let allSqlAction = (sql, callback) => {
    //执行sql语句这里 需要一个callback，因为里面执行sql语句后的result没办法返回
    pool.getConnection(function (err, connection) { ////从连接池中获取一个连接
        if(err){
            //throw err;
            console.log("数据库服务器连接出错："+err)
            return;
        }
        connection.query(sql, function (err, result) {
            if(err){
                console.log("数据库查询出错："+err)
                return;
            }
            callback(err, result);  //事件驱动回调
            connection.release();
        });
    });
}

module.exports = {
    allSqlAction
}
const koa=require('koa');
const app = new koa();
const logger = require('koa-logger')
const json = require('koa-json')
const views = require('koa-views')
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const cors=require('koa2-cors')

var index = require('./routes/index');
var users = require('./routes/users');
var publish_rent=require('./routes/publish_rent')
var house=require('./routes/house')
var landlord=require('./routes/landlord')
var admin=require('./routes/admin')

// error handler
onerror(app);

app.use(cors({
  origin: function (ctx) {
      return 'http://172.17.192.88:8080'; // 这样就能只允许 http://localhost:8080 这个域名的请求了
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PUT'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))
// global middlewares
app.use(views('views', {
  root: __dirname + '/views',
  default: 'ejs'
}));
app.use(bodyparser());
app.use(json());
app.use(logger());

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(require('koa-static')(__dirname + '/public'));

// routes definition
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(publish_rent.routes(),publish_rent.allowedMethods());
app.use(house.routes(), house.allowedMethods());
app.use(landlord.routes(), landlord.allowedMethods());
app.use(admin.routes(), admin.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app;

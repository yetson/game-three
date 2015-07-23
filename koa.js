var koa = require("koa");
var jade = require("koa-jade");
var serve = require("koa-static");
var router = require("koa-router")();
var bodyParser = require("koa-bodyparser");
var control = require("./control");

var app = koa();

app.use(function *(next){
    var start = new Date;
    yield next;
    var ms = new Date - start;
    this.set('X-Response-Time', ms + 'ms');
    console.log("%s %s - %s", this.method, this.url, ms);
});

app.use(serve(__dirname, {
    index: "index.html",
    hidden: false,
    maxage: 10000,
    defer: false
}));

app.use(bodyParser());


app.use(jade.middleware({
	debug: false,
	pretty: false,
    noCache: process.env === 'development',
    viewPath: __dirname + '/views',
    baseDir: __dirname
}));

app.use(router.routes());
app.use(router.allowedMethods());
router
    .post('/rank', control.rankHandle)
    .get('/list/:id', control.listHandle);


app.listen(3000);
console.log("koa listening on port 3000...");

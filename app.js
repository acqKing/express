var express = require('express');
var app = express();

// 制定程序端口的方式
app.set('port',process.env.PORT || 3000);

// 设置handlebars视图引擎
// 创建handlebars实例时，指名了默认布局为 ‘main’
// 视图引擎默认返回text/html的内容类型 和状态码 200
var handlebars = require('express3-handlebars')
				.create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine','handlebars');

// static 相当于给所有 静态 资源创建了一个路由，渲染文件并发送给客户端
// static 会返回public这个文件，public相当于客户端是隐形的。
app.use(express.static(__dirname + '/public'));

// 测试
app.use(function(req,res,next){
	res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
	next();
});

// get 是添加路由的方法  
// app.VERB VERB 代表http动词 接受两个参数 一个路径 和一个函数
// 忽略大小写 和 反斜杠 进行匹配时不考虑查询字符串
app.get('/',function(req,res){
	res.render('home');
});

app.get('/about',function(req,res){
	res.render('about');
});

app.get('/headers',function(req,res){
	res.set('Content-Type','text/plain');
	var s = '';
	for(var name in req.headers) s += name + ':' + req.headers[name] + '\n';
	res.send(s);
});

// app.use是添加中间件的一种方法
// 中间件和路由的顺序至关重要
// use可以看成 处理 所有没有路由匹配路径 的 处理器
// 404
app.use(function(req,res){
	res.status(404);
	res.render('404')
});

// 500
app.use(function(err,req,res,next){
	console.error(err.stack)
	res.status(500);
	res.render('500');
});


app.listen(app.get('port'),function(){
	console.log('Express started on http://localhost:' + 
		app.get('port') + 'press ctrl + c to terminate');
});
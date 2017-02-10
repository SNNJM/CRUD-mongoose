var express = require('express');
var app = express(); //1.allows to route & start server
var bodyParser = require('body-parser');//2.allows to grab elements from front end & params within url
var mongoose = require('mongoose');
var Book=require('./book.model'); //9.specify location , for a file in same location witn app js(diff with from node_module)
var port = 8081;//3.nav to this localhost
var db = 'mongodb://localhost/test'; //10. specify which db to use (created in mongo shell)

mongoose.connect(db); //11. open up connection & connect to db named test

//18.explicitly state how i wanna use body parser
app.use(bodyParser.json())//19.allow to parse json elements
app.use(bodyParser.urlencoded({ //20.allow parse using url = can be edited in postman
	extended: true
}));
								//12.navi to / will get below msj
app.get('/',function(req,res){ //this is routing to home pg(espress), specify location& callback
	res.send('this is mongoose'); //res= what we give to user, req=what we get back from user
});
//13.get all books from database & display in json format
 app.get('/books',function(req,res){

	console.log('getting all books');
	Book.find({}) //14.use get method then find books,after find books,execute ({})=get everything
	.exec(function(err,books){ //14.get back list of books, if no err retutn the elements of books
if(err){

	res.send('error has occured')
}else{
	console.log(books);
	res.json(books);
	}
   });
}); 

 app.get('/books/:id',function(req,res)
 {
 	console.log('getting one book');
 	Book.findOne( //15.enable to retrieve one book in particular, findOne=mongoose query
 	{
 		_id:req.params.id //16.this is body parser (parse in id from elements in db)
 	})
 	.exec(function(err,book) //17. implements callback fn = indicate error/retun elements
 	{
 		if(err)
 		{
 			res.send('error occured');
 		}else
 		{
 			console.log(book);
 			res.json(book);
 		}

 		
 	})
})
 
//21.pass data and save
app.post('/book',function(req,res){
	var newBook = new Book(); //22.this links to schema
//23.this is the key that will be parse in when we save new book...postman
	newBook.title = req.body.title;
	newBook.author = req.body.author;
	newBook.category = req.body.category;

	newBook.save(function(err,book){
		if(err){
			res.send('error saving book');
		}else {
			console.log(book);
			res.send(book);
		}
	});
});

//24.another post route should work the same as above
app.post('/book2',function(req,res){
	Book.create(req.body, function(err,book){
		if(err){
			res.send('error saving book');
		}
		else{console.log(book);
			res.send(book);
		}
	});
});

//25. finnd one book & update
app.put('/book/:id', function(req,res){
	Book.findOneAndUpdate({
		_id:req.params.id //this is query
	},
	{$set: {title:req.body.title}}, //what gonna be set
		{ upsert: true}, //insert title or other if not yey avail
		function(err, newBook){
			if(err){
				console.log('error occured');
			}else {
				console.log(newBook);
				res.send(newBook);
			}
		})
})

//26. find & delete
app.delete('/book/:id', function(req,res){
	Book.findOneAndRemove({
		_id:req.params.id}, function(err,book){
			if(err){
				res.send('error deleting');
			}else {
				console.log(book);
				res.status(204);
			}
		})
})

 app.listen(port, function() //4. check server + tun on what port
 {
 	console.log('app listening on port ' +port);
 });

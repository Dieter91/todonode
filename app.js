const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Todo = require('./models/todo');
const app = express();

//DB CONFIG
const db = require('./config/keys').MongoURI;

//connect to monog
mongoose
  .connect(db)
  .then(() => console.log('DB CONNECTED'))
  .catch((err) => console.log(err));

// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('X-HTTP-Method-Override'))
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

//views template
app.set('view engine', 'ejs');
app.set('views');

//parse the body
app.use(express.urlencoded({ extended: false }));

//show index
app.get('/', async(req, res) => {
    const todos = await Todo.find({});
    res.render('index', { todos });
})

//post new todo
app.post('/', async(req, res) => {
    const todo = new Todo(req.body);
    await todo.save();
    res.redirect('/')
})

//delete a todo
app.delete('/delete/:id', async(req, res)=> {
    
    await Todo.findByIdAndDelete(req.params.id);
    res.redirect('/');
})


//server
const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`listening on ${PORT}`));
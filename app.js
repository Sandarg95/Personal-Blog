const express = require('express');
const morgan = require('morgan');
const mongoose= require('mongoose');
const Blog = require ('./models/blog');

// connect to mongoDBH
const dbURI= 'mongodb+srv://dsantana15:kezQJOjLKcCjJ0Mf@nodetest.pciif.mongodb.net/?retryWrites=true&w=majority&appName=NodeTest'
mongoose.connect(dbURI, {useNewUrlParser:true, useUnifiedTopology:true})
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// express app
const app = express();

//register view engine
app.set('view engine', 'ejs');
// app.set('views', 'myviews');


//middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));

// // mongoose and mongo sandbox routes 
// app.get('/add-blog', (req, res) => {
//   const blog=new Blog({
//     title:'new blog 2',
//     snippet: 'about my new blog',
//     body: 'more about my new blog',
//   });

//   blog.save()
//   .then((result)=>{
//     res.send(result)
//   })
//   .catch((err)=> {
//     console.log(err);
//   });
// });

// app.get('/all-blogs', (req, res) => {
//   Blog.find()
//   .then((result) => {
//     res.send(result);
//   })
//   .catch((err) =>{
//     console.log(err)
//   });
// });

// app.get('/single-blog', (req, res) => {
//   Blog.findById('66f8c6126d9a0cbc02390efe')
//   .then((result) => {
//     res.send(result);
//   })
//   .catch((err) =>{
//     console.log(err)
//   });
// });



// app.use((req, res, next) => {
//     console.log('new request made:');
//     console.log('host:', req.hostname);
//     console.log('path:', req.path);
//     console.log('method:', req.method);
//     next();
// });

//routes 
app.get('/',(req,res)=>{
    // const blogs= [
    //     {title:'Yoshi finds eggs', snippet:'Lorem ipsum dolor sit amet consectetur'},
    //     {title:'Mario finds stars', snippet:'Lorem ipsum dolor sit amet consectetur'},
    //     {title:'How to defeat bowser', snippet:'Lorem ipsum dolor sit amet consectetur'},
    // ];
    // res.render('index', {title: 'Home', blogs});
    res.redirect('/blogs');
});

app.get('/', (req, res) => {
  // res.send('<p>home page</p>');
  res.render('index', {title: 'Home'});
});
// app.use((req, res, next) => {
//     console.log('In the next');
//     next();
// });

app.get('/about', (req, res) => {
  // res.send('<p>about page</p>');
  res.render('about',{title: 'About'});
});

//blog routes
app.get('/blogs', (req, res) =>{
  Blog.find().sort({createdAt: -1})
    .then((result) => {
      res.render('index', {title: 'All blogs', blogs:result})
    })
    .catch((err) =>{
      console.log(err);
    });
});

app.post('/blogs', (req, res) =>{
  const blog = new Blog(req.body);

  blog.save()
  .then((result)=>{
    res.redirect('/blogs');
    })
  .catch((err)=> {
    console.log(err);
  });

});

app.get('/blogs/:id', (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
  .then((result)=>{
    res.render('details', {blog: result, title:'Blog Details'});
    })
  .catch((err)=> {
    console.log(err);
  });
  
});


app.delete('/blogs/:id', (req, res) => {
  const id = req.params.id;
  
  Blog.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/blogs' });
    })
    .catch(err => {
      console.log(err);
    });
});
// // redirects
app.get('/create', (req, res) => {
   res.render('create', {title: 'Create a new Blog'});
 });

// 404 page
app.use((req, res) => {
  res.status(404).render('404',{title: '404'});
});
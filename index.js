'use strict';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const postRoutes = require('./routes/post-routes')
const http=require("http")
const app = express();
const Post = require('./models/post');
const { response } = require('express');

app.set('view engine', 'ejs');

app.use('/api', postRoutes.routes);

app.get('/',(req,res)=>{
    var body = ''
    const url = "http://localhost:8080/api/posts"
    http.get(url,response=>{
          response.on('data', function (chunk) {
          body += chunk;
          });
          response.on('end', function() {
            let parsed = JSON.parse(body)
            const postsArray = [];
            parsed.forEach(doc => {
              const post = new Post(
                  doc.id,
                  doc.title,
                  doc.author,
                  doc.tag,
                  doc.content
              );
              postsArray.push(post);
          });
          res.render('index', { 
            posts: postsArray
          });
          });
    });
});

app.get('/:id',(req,res)=>{
  var body = ''
  const url = "http://localhost:8080/api/post/"+req.params.id
  http.get(url,response=>{
        response.on('data', function (chunk) {
        body += chunk;
        });
        response.on('end', function() {
          let doc = JSON.parse(body)
          const post = new Post(
            doc.id,
            doc.title,
            doc.author,
            doc.tag,
            doc.content
        );
           res.render('post', { 
          post: post
        });
        });
       
        });
  });

app.listen(config.port, () => console.log('App is listening on url http://localhost:' + config.port));

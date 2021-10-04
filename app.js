const express = require("express")
const mongoose = require("mongoose")
const _ = require("lodash")

app = express();
app.set("view engine", "ejs")
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

//------------------------//
//       Mongoose         //
//------------------------//

mongoose.connect("mongodb://localhost:27017/wikiDB")

const articleSchema = new mongoose.Schema({
    title: "String",
    content: "String",
    tags: ["String"]
});

const Article = new mongoose.model("Article", articleSchema)

const createArticle = () => {

    Article.create({title: "BitRise", content: "Bitrise is a Continuous Integration and Delivery (CI/CD) Platform as a Service (PaaS) with a main focus on mobile app development (iOS, Android, React Native, Flutter, and so on). It is a collection of tools and services to help you with the development and automation of your software projects."})
    
}

// createArticle();

/*
 * Index - GET - /articles  - Presentational - respond with all articles
 * New - GET - /articles/new  - Presentational Form - a page with a form to create a new article
 * Show - GET - /articles/:id  - Presentational - respond with specific article by id
 * Create - Post - /articles  - Functional - recieve data from new route to create a article
 * Edit - GET - /articles/:id/edit  - Presentational Form - respond with a form prefilled with article data
 * Update - PUT - /articles/:id  - Functional - recieve data from edit to update a specific article
 * Delete - DELETE - /articles/:id  - Functional - Deletes article by id from request
 */

//------------------------//
//    URL Chain Routes    //
//------------------------//

app.route("/articles")
    .get((req, res) => {
        Article.find({}, (err, foundArticles) => {
            if(err) console.log(err);
            res.send(foundArticles)
            // console.log(foundArticles);
        });
    })
    .post( async (req, res) => {
        await Article.create({title: req.body.title, content: req.body.content, tags: req.body.tags}, (err, createdArticle) => {
            if (err) console.log(err);
            console.log(`${createdArticle.title} was created in the database`);
            res.send("Successfully added the new article")
        });
    })
    .delete((req, res) => {
        Article.deleteMany((err, deletedArticles) => {
            if(err) console.log(err);
            console.log(`${deletedArticles} have been deleted`);
            res.send("Articles have been deleted")
        });
    });

//---------------------------------//
//  Specific Article Chain Routes  //
//---------------------------------//

app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.findOne({title: req.params.articleTitle}, (err, foundArticle) => {
            if(foundArticle) {
                res.send(foundArticle);
            } else {
               res.send("No articles matching that title");
            }
        })
    })
    .put((req, res) => {
        Article.findOneAndUpdate(
            {title: req.params.articleTitle}, 
            {title: req.body.title, content: req.body.content, tags: req.body.tags}, 
            {overwrite: true}, 
            (err, updatedArticle) => {
            if(err) console.log(err, "Article has NOT been updated");

            res.send("Article has been updated");
        })
    })
    .patch((req, res) => {

        console.log(req.body);

        Article.findOneAndUpdate(
            {title: req.params.articleTitle}, 
            {
                $set:req.body    
            }, 
            (err, updatedArticle) => {
            if(err) console.log(err, "Article has NOT been updated");

            res.redirect("/articles");
        })
    })
    .delete((req, res) => {
        Article.findOneAndDelete({title: req.params.articleTitle}, (err, deletedArticle) => {

            if(err) console.log(err, "Did NOT delete article");

            console.log("Successfully deleted article", deletedArticle);

            res.redirect("/articles")
        })
    })


app.listen(5000, () => {
    console.log("Server is running on port 5000");
})
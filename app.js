var bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express();
    
// mongoose.connect("mongodb://localhost/restful_blog_app", {useNewUrlParser: true});
mongoose.connect("mongodb://admin:qwerty123@ds139775.mlab.com:39775/restful_blog_app", {useNewUrlParser: true});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
// Method override allows to classify other methods other than GET/POST in forms
app.use(methodOverride("_method"));
// Sanitize content in blog so that it doesn't accepts script code but only HTML
// Dependent with body-parser
app.use(expressSanitizer());

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

/*Blog.create(
    {
        title: "Test Blog",
        image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg",
        body: "Lorem ipsum this is a sample blog post."
    },
    function(err, blog) {
        if(err) {
            console.log("ERROR OCCURED: " + err);
        } else {
            console.log("TEST BLOG APP OK");
        }
    });*/

// ROOT route
app.get("/", function(req, res) {
    res.redirect("/blogs");
});

// INDEX route    
app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if(err) {
            res.send(err);    
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

// NEW route
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

// SHOW route
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if(err) {
            res.send(err);    
        } else {
            res.render("show", {blog: blog});
        }
    });
});

// EDIT route
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if(err) {
            res.send(err);    
        } else {
            res.render("edit", {blog: blog});
        }
    });
});

// CREATE route
app.post("/blogs", function(req, res) {
    console.log("Before: " + req.body.blog.body);
    
    req.body.blog.body = req.sanitize(req.body.blog.body);
    
    console.log("====");
    console.log("After: " + req.body.blog.body);
    
    Blog.create(req.body.blog, function(err, newBlog) {
        if(err) {
            res.send(err)
        } else {
            res.redirect("/blogs");
        }
    })
});

// UPDATE route
app.put("/blogs/:id", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
        if(err) {
            res.send(err);    
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DELETE route
app.delete("/blogs/:id", function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err, updatedBlog) {
        if(err) {
            res.send(err);    
        } else {
            res.redirect("/blogs");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("SERVER IS RUNNING...");
});
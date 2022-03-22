const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-Asif:786Asif@cluster0.2napo.mongodb.net/todolistDB")

var itemSchema = {
  name: String
};

var Item = mongoose.model("Item", itemSchema);



const item1 = new Item({
  name: "Welcome to your todo list"
});

const item2 = new Item({
  name: "Hit the + button to add a new item"
});

const item3 = new Item({
  name: "<-- hit to delete the item"
});

const defaultitems =[item1, item2, item3];




app.get("/", function(req, res) {

const day = date.getDate();

  Item.find({},function(err, foundItems){

    if(foundItems.length === 0){
      Item.insertMany(defaultitems, function(err){
        if(err){
          console.log(err)
        }else{
          console.log("items updated");
        }
      });
      res.redirect("/");
    }else{
      res.render("list", {listTitle: day, newListItems: foundItems});
    }
  })
  
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName,
  })

  item.save();
  res.redirect("/");

});


app.post("/delete", function(req, res){

  const checkeditemId = req.body.checkbox;

  Item.findByIdAndRemove(checkeditemId, function(err){
    if(!err) {
      console.log("successfully deleted item")
      res.redirect("/");
    }
  });

});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});



app.listen(process.env.PORT, function(err){
  if (err) {
    console.log(err);
  }else {
    console.log("listening on port " + port);
  }
});

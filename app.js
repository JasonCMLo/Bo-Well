const { default: mongoose } = require("mongoose");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb+srv://Jason:jasonMDB@cluster0.tstbsbq.mongodb.net/boWell")

const MealSchema = {
    name: [String],
    source: String,
    ingredients: [String],
}

const bmSchema = {
    rating: Number,
}

const Meal = mongoose.model("meal", MealSchema);

const BM = mongoose.model("bm", bmSchema);

const DaySchema = {
    day: Date,
    meals: [MealSchema],
    bms: [bmSchema]
}

const Log = mongoose.model("Log", DaySchema);

app.get("/", function(req, res) {
    res.render("main");
})

app.post("/meal", function(req, res) {
    const input = req.body;

    let newMeal = new Meal({
        name: input.name.split(),
        source: input.source,
        ingredients: input.ingredients.split(),
    })
    
    newMeal.save();

    console.log(newMeal);

    res.redirect("/");
})

app.post("/bm", function(req, res) {
    const input = req.body;

    let newBM = new BM({
        rating: input.bmRating
    })

    newBM.save();

    res.redirect("/");
})

app.listen(3000, function() {
    console.log("Server running on port 3000");
})
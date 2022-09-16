const { default: mongoose } = require("mongoose");

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const mongoKey = process.env.MongoAPI;
const mongoID = process.env;

mongoose.connect(
  "mongodb+srv://Jason_Desktop:" +
    mongoKey +
    "@cluster0.tstbsbq.mongodb.net/boWell"
);

const MealSchema = {
  name: String,
  source: String,
  ingredients: [String],
};

const bmSchema = {
  rating: Number,
};

const Meal = mongoose.model("meal", MealSchema);

const BM = mongoose.model("bm", bmSchema);

const DaySchema = {
  day: { type: Date, required: true },
  meals: [MealSchema],
  bms: [bmSchema],
  user: { type: String, required: true },
};

const Log = mongoose.model("Log", DaySchema);

app.get("/", function (req, res) {
  res.render("main");
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/history", function (req, res) {
  const today = new Date();
  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };

  const currDate = today.toLocaleDateString("en-US", options);

  const currLog = Log.findOne({ day: currDate }, function (err, results) {
    const currMeals = results.meals;

    res.render("history", { meals: currMeals });
  });
});

app.post("/:postType", function (req, res) {
  const input = req.body;
  const today = new Date();
  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };

  const yesterday = new Date(2022, 8, 13);

  const currDate = today.toLocaleDateString("en-US", options);
  //const currDate = yesterday.toLocaleDateString("en-US", options);
  const postType = req.params.postType;

  Log.findOne({ day: currDate }, function (err, results) {
    if (postType === "meal") {
      var newMeal = new Meal({
        name: input.name,
        source: input.source,
        ingredients: input.ingredients.split(","),
      });
    } else if (postType === "bm") {
      var newBM = new BM({
        rating: input.bmRating,
      });
    }

    if (!results) {
      const mdb_date = new Log({
        day: currDate,
        user: input.user,
      });
      if (postType === "meal") {
        mdb_date.meals.push(newMeal);
      } else if (postType === "bm") {
        mdb_date.meals.push(newBM);
      }

      console.log(mdb_date);

      mdb_date.save();
    } else {
      if (postType === "meal") {
        results.meals.push(newMeal);
      } else if (postType === "bm") {
        results.bms.push(newBM);
      }
      results.save();
    }
  });

  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server running on port 3000");
});

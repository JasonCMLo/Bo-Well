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
  day: Date,
  meals: [MealSchema],
  bms: [bmSchema],
  user: { type: String, required: true },
};

const Log = mongoose.model("Log", DaySchema);

app.get("/", function (req, res) {
  res.render("main");
});

app.post("/:postType", function (req, res) {
  const input = req.body;

  console.log(input);

  const today = new Date();

  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };

  const currDate = today.toLocaleDateString("en-US", options);

  const postType = req.params.postType;

  Log.findOne({ day: currDate }, function (err, results) {
    if (!results) {
      const mdb_date = new Log({
        day: currDate,
        user: input.user,
      });
      mdb_date.save();
    }

    if (postType === "meal") {
      let newMeal = new Meal({
        name: input.name,
        source: input.source,
        ingredients: input.ingredients.split(),
      });
      console.log(newMeal);

      results.meals.push(newMeal);
      results.save();

      res.redirect("/");
    }

    if (postType === "bm") {
      let newBM = new BM({
        rating: input.bmRating,
      });

      results.bms.push(newBM);
      results.save();

      res.redirect("/");
    }
  });
});

app.listen(3000, function () {
  console.log("Server running on port 3000");
});

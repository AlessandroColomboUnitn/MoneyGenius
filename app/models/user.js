var mongoose = require("mongoose");
var Schema = mongoose.Schema;

module.exports = mongoose.model('user', new Schema({
    email: String,
    password: String,
    name: String,
    budget_left: Number,
    budget_spent: Number,
    categories: [{name: String, budget: Number}],
    expenses: [{name: String, category: String, amount: Number}]
}))
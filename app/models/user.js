var mongoose = require("mongoose");
var Schema = mongoose.Schema;

module.exports = mongoose.model('user', new Schema({
    email: String,
    password: String,
    name: String,
    budget: Number,
    budget_spent: {type: Number, default: 0},
    allocated_budget: {type: Number, default: 0},
    categories: [{name: String, color: String, budget: Number, cat_spent: Number}],
    expenses: [{name: String, categoryId: String, amount: Number, date: Date}]
}));
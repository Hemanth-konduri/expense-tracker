const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 2
    },
    amount:{
        type: Number,
        required: true,
        min: 0.01
    },
    category: {
        type: String,
        enum: ['food', 'travel', 'shopping', 'bills', 'other'],
        default: 'food'
    },
    date:{
        type: Date,
        required: true,
        default: Date.now
    },
    
},{
        timestamps: true
    }
)


module.exports = mongoose.model('Expense', expenseSchema);
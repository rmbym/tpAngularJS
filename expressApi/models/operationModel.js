const mongoose = require('mongoose');
const OperationSchema = new mongoose.Schema({
    opType: {type: String, enum: ['Credit', 'Fee']},
    date: String,
    label: String,
    amount: Number,
    missionName: String
});
const Operation = mongoose.model('Operation', OperationSchema);
module.exports = Operation;
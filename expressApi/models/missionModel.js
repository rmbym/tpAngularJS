const mongoose = require('mongoose');
const MissionSchema = new mongoose.Schema({
    name: {type: String, unique: true, required: true},
    employeesMail: [String],
    budget: Number,
    operations: [{type: mongoose.Schema.Types.ObjectID, unique: true, ref: 'Operation'}]
});
const Mission = mongoose.model('Mission', MissionSchema);
module.exports = Mission;
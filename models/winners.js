const mongoose = require('mongoose');

const SelectedUserSchema = new mongoose.Schema({
    chitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chitty',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    month: {
        type: String,
        required: true
    }
});

const SelectedUser = mongoose.model('SelectedUser', SelectedUserSchema);

module.exports = SelectedUser;

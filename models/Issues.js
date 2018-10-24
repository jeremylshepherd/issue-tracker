const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IssueSchema = new Schema({
    issue_title: {
        type: String,
        required: true
    },
    issue_text: {
        type: String,
        required: true
    },
    created_by: {
        type: String,
        required: true
    },
    open: {
        type: Boolean,
        default: true
    },
    status_text: {
        type: String,
        default: ''
    },
    created_on: {
        type: Date,
        default: Date.now
    },
    updated_on: {
        type: Date,
        default: ''
    },
    assigned_to: {
        type: String,
        default: ''
    },
    project: { type: Schema.Types.ObjectId, ref: 'Project' }
});

module.exports = mongoose.model('Issue', IssueSchema);

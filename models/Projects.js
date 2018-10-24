const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    project_name: {
        type: String,
        required: true
    },
    issues: [{ type: Schema.Types.ObjectId, ref: 'Issue' }]
});

module.exports = mongoose.model('Project', ProjectSchema);

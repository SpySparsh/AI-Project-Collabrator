import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    },

    users:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
    ,
    fileTree:{
        type: Object,
        default: {}
    },
});

const project = new mongoose.model('Project', projectSchema);

export default project;
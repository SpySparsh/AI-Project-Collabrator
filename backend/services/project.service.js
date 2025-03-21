import projectModel from '../models/project.model.js';

import mongoose from'mongoose';

export const createProject = async (name, userId, fileTree = {}) => {
    if (!name || !userId) {
        throw new Error('Name and User ID required');
    }

    console.log("📂 Creating Project with fileTree:", fileTree); // 🔥 Debug log

    const project = new projectModel({
        name,
        users: [userId],
        fileTree // ✅ Ensure fileTree is included
    });

    await project.save();
    console.log("✅ Project saved successfully:", project); // 🔥 Confirm save

    return project;
};


export const getAllProjectByUserId = async ({userId}) => {
    if (!userId) {
        throw new Error('User ID required');
    }
    const allUserProjects = await projectModel.find({ users: userId });

    return allUserProjects
}

export const addUsersToProject = async ({projectId, users,userId}) => {
    if (!projectId || !Array.isArray(users)) {
        throw new Error('Project ID and Users array required');
    }
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error('Invalid Project ID');
    }

    users.forEach(user => {
        if (!mongoose.Types.ObjectId.isValid(user)) {
            throw new Error(`Invalid User ID: ${user}`);
        }
    });

    const project=await projectModel.findOne({
        _id:projectId,
        users: userId 
    })

    if(!project){
        throw new Error('Project not found or not authorized to add users');
    }   

    const updatedProject = await projectModel.findOneAndUpdate({
        _id: projectId
    },{
        $addToSet: { users: { $each: users } }
    },{
        new: true
    })
    return updatedProject;
};
   
export const getProjectById = async ({projectId}) => {
    if (!projectId) {
        throw new Error('Project ID required');
    }
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error('Invalid Project ID');
    }
    const project = await projectModel.findOne({ _id: projectId }).populate('users');
    return project;
}

export const updateFileTree = async ({ projectId, fileTree }) => {
    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid Project ID");
    }

    console.log("🔍 Finding Project with ID:", projectId);
    
    const project = await projectModel.findOneAndUpdate(
        { _id: projectId },
        { fileTree },  // ✅ This updates the fileTree
        { new: true }
    );

    if (!project) {
        console.error("❌ Project not found in DB!");
    }

    return project;
};



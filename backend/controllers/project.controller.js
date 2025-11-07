import projectModel from '../models/project.model.js';
import * as projectService from '../services/project.service.js';
import userModel from '../models/user.model.js';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

export const createProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { name, fileTree } = req.body; // 🔥 Log incoming data
        console.log("📩 Received Request:", { name, fileTree });

        const loggedInUser = await userModel.findOne({ email: req.user.email });
        const userId = loggedInUser._id;

        const newProject = await projectService.createProject(name, userId, fileTree || {}); // ✅ Pass fileTree
        console.log("🚀 Project Created:", newProject);

        res.status(201).json(newProject);
    } catch (error) {
        console.error("❌ Error creating project:", error);
        res.status(500).send(error.message);
    }
};


export const getAllProject = async (req, res) => {
    try {
        const loggedInUser = await userModel.findOne({ email: req.user.email });
        const allUserProjects = await projectService.getAllProjectByUserId({ userId: loggedInUser._id });

        console.log("userId before passing to service:", loggedInUser._id);

        return res.status(200).json({ projects: allUserProjects });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
};

export const addUserProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { projectId, users } = req.body;
        const loggedInUser = await userModel.findOne({ email: req.user.email });

        const project = await projectService.addUsersToProject({ projectId, users, userId: loggedInUser._id });

        return res.status(200).json({ project });
    } catch (error) {
        res.status(400).send(error.message);
    }
};

export const getProjectById = async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await projectService.getProjectById({ projectId });

        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        if (!project.fileTree) {
            console.warn("⚠️ fileTree is missing from the project! Adding default...");
            project.fileTree = {}; // ✅ Ensure fileTree is always an object
        }
        return res.status(200).json({ project });
    } catch (error) {
        console.error("❌ Error fetching project:", error);
        res.status(400).json({ error: error.message });
    }
};


export const updateFileTree = async (req, res) => {
    try {
        console.log("📩 Received Request Body:", req.body); // Debugging Log

        const { projectId, fileTree } = req.body;

        if (!projectId || !fileTree || typeof fileTree !== "object") {
            return res.status(400).json({ error: "Invalid projectId or fileTree format" });
        }

        console.log("🔄 Updating fileTree for Project ID:", projectId);

        const project = await projectService.updateFileTree({
            projectId,
            fileTree,
        });

        if (!project) {
            console.error("❌ Project not found!");
            return res.status(404).json({ error: "Project not found" });
        }

        console.log("✅ FileTree Updated Successfully:", project);
        return res.status(200).json({ project });
    } catch (err) {
        console.error("❌ Internal Server Error:", err);
        res.status(500).json({ error: err.message });
    }
};




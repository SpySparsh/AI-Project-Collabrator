# AI Project Collaborator

AI Project Collaborator is a **real-time collaborative coding and chat platform** built with the **MERN stack**, **Redis**, **Socket.IO**, and **Google Gemini AI**. It enables users to **communicate**, **collaborate on projects**, **use AI to generate code**, and **execute server code in a WebContainer**.

## 🚀 Features

- **🔹 Real-time Chat** – Users can chat within a project using WebSockets.
- **🤖 AI-Powered Code Assistance** – Google Gemini helps generate and structure project code.
- **📂 File Tree & Code Editor** – Users can view, edit, and manage files in a structured format.
- **🖥️ WebContainer Integration** – Run and test code directly in the browser using an iframe.
- **👥 Project-Based Collaboration** – Users create/join projects and work with team members.
- **🔐 Authentication & Authorization** – Secure user login with JWT-based authentication.
- **⚡ Optimized Performance** – Redis caching ensures fast and efficient backend performance.

## 🛠 Tech Stack

### Frontend:
- **React.js** – For the UI and state management.
- **React Router** – To manage different pages for login and project selection.
- **Socket.IO** – For real-time chat and project collaboration.
- **Tailwind CSS** – For styling.

### Backend:
- **Node.js + Express.js** – REST API for handling authentication, projects, and AI interactions.
- **MongoDB + Mongoose** – Database for storing user and project data.
- **Redis** – For caching and optimizing performance.
- **Socket.IO** – For real-time WebSocket-based communication.
- **Google Gemini AI API** – To generate project structures and assist in coding.
- **WebContainer API** – To execute server code within the browser.

## 📥 Installation & Setup

### 1️⃣ Clone the Repository
```sh
 git clone https://github.com/SpySparsh/AI-Project-Collabrator.git
 cd AI-Project-Collabrator
```

### 2️⃣ Backend Setup
```sh
 cd backend
 npm install
 npm start
```

### 3️⃣ Frontend Setup
```sh
 cd frontend
 npm install
 npm start
```

### 4️⃣ Environment Variables
Create a **.env** file in the **backend/** directory and configure:
```sh
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
REDIS_URL=your_redis_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
```

## 📸 Screenshots

1️⃣ Login Page (Screenshot 1 - login.png)
![Screenshot (266)](https://github.com/user-attachments/assets/b69f9acf-c3b0-489a-ae40-9de7db7c34c2)

2️⃣ Register Page (Screenshot 2 - register.png)
![Screenshot (267)](https://github.com/user-attachments/assets/041f996d-3fa5-4194-bb15-b8f4bc3a430e)

3️⃣ Create Project (Screenshot 3 - create_project.png)
![Screenshot (268)](https://github.com/user-attachments/assets/7f20a1e3-d159-4539-83c5-aa7710f3cb16)

4️⃣ Add Collaborators (Screenshot 4 - add_collaborator.png)
![Screenshot (271)](https://github.com/user-attachments/assets/93174ca0-3b50-439f-87c9-717b51471e38)

5️⃣ Main Project UI (Chat + AI + Code Editor + Execution) (Screenshot 5 - project_page.png)
![Screenshot (265)](https://github.com/user-attachments/assets/e8e653b9-5e97-49aa-8d20-fe7a0b2b6c10)

## 🏗 Architecture Overview

1. **User Authentication**: Users must log in before accessing projects.
2. **Project Selection**: Users select or create a project.
3. **Chat & AI Assistance**: Users chat, get AI-generated code, and modify project files.
4. **Code Execution**: WebContainer runs the server inside an iframe.
5. **Real-time Updates**: Socket.IO ensures changes are reflected instantly for all users.

## 📖 Usage Guide

1️⃣ **Sign up / Log in** – Authenticate to access the platform.
2️⃣ **Create or Join a Project** – Start a new project or collaborate with others.
3️⃣ **Chat & Collaborate** – Discuss and assign tasks via real-time chat.
4️⃣ **AI-Assisted Coding** – Ask AI to generate server files and project structures.
5️⃣ **Edit & Run Code** – Modify project files and run the server in an embedded iframe.

## 🤝 Contribution Guidelines

We welcome contributions! If you’d like to improve this project:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m "Added new feature"`).
4. Push to your fork (`git push origin feature-branch`).
5. Open a Pull Request.

---

💡 *Built with ❤️ by Sparsh Sharma

🚀 **Happy Coding!**


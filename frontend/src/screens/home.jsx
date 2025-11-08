import React, { useContext, useState ,useEffect } from 'react';
import { UserContext } from '../context/user.context';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const[project,setproject] = useState([]);

  const navigate = useNavigate();

  function createProject(e) {
    e.preventDefault();
    console.log('🛠️ Creating project:', projectName);

    const projectData = {
        name: projectName,
        fileTree: {} // ✅ Explicitly send fileTree
    };

    console.log("📤 Sending API Request:", projectData); // ✅ Debugging log

    axios.post("/project/create", projectData)
    .then((res) => {
        console.log("✅ Project Created Successfully:", res.data);
        
        // ✅ Auto-update project list after creation
        setproject((prevProjects) => [...prevProjects, res.data]);

        setIsModalOpen(false); // ✅ Close modal after success
        setProjectName(""); // ✅ Reset input field
    })
    .catch((err) => {
        console.error("❌ Error creating project:", err.response?.data || err);
    });
}


  useEffect(() => {
    axios.get('/project/all').then((res) => {
      setproject(res.data.projects);
    }).catch((err) => {
      console.log(err);
    });
  }, []);
  return (
    <main className="p-4">
      <div className="projects flex flex-wrap gap-6 p-6">
  {/* New Project Button */}
  <button
    className="p-4 bg-gray-800 text-white rounded-lg shadow-md border border-gray-700 hover:bg-gray-700 transition-all flex items-center gap-2"
    onClick={() => setIsModalOpen(true)}
  >
    New Project
    <i className="ri-add-circle-line text-blue-400"></i>
  </button>

  {/* Projects List */}
  {project.map((project) => (
    <div 
      key={project._id} 
      onClick={()=>{navigate(`/project   `,{
        state: {project}
      }) }}
      className="project bg-gray-800 p-5 rounded-lg shadow-md border border-gray-700 cursor-pointer hover:bg-gray-700 transition-all flex flex-col gap-2"
    >
      <h2 className="text-white text-lg font-semibold">{project.name}</h2>
      <div className="text-gray-400 text-sm">{project.users.length} <i className="ri-user-fill"></i></div>
    </div>
  ))}
</div>


      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 backdrop-blur">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Create Project</h2>
            <form
              onSubmit={createProject}
            >
              <div className="mb-4">
                <label className="block text-gray-400 mb-2" htmlFor="projectName">
                  Project Name
                </label>
                <input
                  type="text"
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project name"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 p-3 rounded bg-gray-600 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="p-3 rounded bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
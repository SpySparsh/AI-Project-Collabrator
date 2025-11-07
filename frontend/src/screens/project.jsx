import React, { useState, useEffect, useContext , useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../config/axios";
import { initiateSocket, receivemessage, sendMessage } from "../config/socket";
import { UserContext } from "../context/user.context";
import Markdown from "markdown-to-jsx";
import hljs from 'highlight.js';
import "highlight.js/styles/atom-one-dark.css";
import { getWebContainerInstance } from "../config/webContainer";


const Project = () => {
  const location = useLocation();
  const [isSidePanelOpen, setisSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState([]);
  const [project, setProject] = useState(location.state.project);
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]); // Example users, replace with actual data
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatContainerRef = useRef(null);
  const [fileTree,setfileTree]=useState({});
  const[currentFile,setCurrentFile]=useState(null);
  const[webContainer,setwebContainer]=useState(null);
  const [iframeUrl, setIframeUrl] = useState(null);
  const [runProcess, setRunProcess ] = useState(null);

  const handleUserClick = (userId) => {
    const newSelectedUserId = selectedUserId.includes(userId)
      ? selectedUserId.filter((_id) => _id !== userId) // Remove if already selected
      : [...selectedUserId, userId]; // Add if not selected

    setSelectedUserId(newSelectedUserId);
    console.log(newSelectedUserId);
  };
  const[openFile,setOpenFile]=useState([]);

  function SyntaxHighlightedCode(props) {
    const ref = useRef(null)

    React.useEffect(() => {
        if (ref.current && props.className?.includes('lang-') && window.hljs) {
            window.hljs.highlightElement(ref.current)

            // hljs won't reprocess the element unless this attribute is removed
            ref.current.removeAttribute('data-highlighted')
        }
    }, [ props.className, props.children ])

    return <code {...props} ref={ref} />
}


  function addCollabrators() {
    axios
      .put("/project/add-user", {
        projectId: location.state.project._id,
        users: selectedUserId,
      })
      .then((res) => {
        console.log(res.data);
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function send() {
    if (!message.trim()) return;

    const newMessage = {
      message,
      sender: user,
    };
    setMessages((prev) => [...prev, newMessage]);
    sendMessage("project-message", newMessage);
    setMessage("");
  }

  function WriteAiMessage(message) {
    const messageObject = JSON.parse(message)
    return(  
                  <div >
                  <Markdown
                  children={messageObject.text}
              options={{
                       overrides: {
                        code: SyntaxHighlightedCode,
                        },
                     }}
                      />

                  </div>
    )
  }  

  useEffect(() => {
    initiateSocket(project._id); // Initialize socket for the current project
  
    async function setupWebContainer() {
      console.log("🔄 Booting WebContainer...");
      const container = await getWebContainerInstance();
      setwebContainer(container);
      console.log("✅ WebContainer instance set in state");
    }
  
    setupWebContainer(); // Boot WebContainer FIRST
  
  }, []); // Runs only once on mount
  
  // ✅ Separate useEffect to handle messages AFTER WebContainer is ready
  useEffect(() => {
    if (!webContainer) {
      console.warn("⏳ Waiting for WebContainer...");
      return;
    }
  
    console.log("✅ WebContainer Ready! Listening for messages...");
  
    receivemessage(async (newMessage) => {
      console.log("📩 Received message:", newMessage);
  
      try {
          const message = JSON.parse(newMessage.message);
          console.log("🔄 Mounting files in WebContainer...", message.fileTree);
  
          await webContainer.mount(message.fileTree); // 🛠️ Mount the updated files
  
          // ✅ Log files after mounting
          const mountedFiles = await webContainer.fs.readdir("/");
          console.log("📂 Mounted Files:", mountedFiles);
  
          console.log("✅ Files successfully mounted!");
          setfileTree(message.fileTree);
          setOpenFile([]);
          setCurrentFile(null);
      } catch (error) {
          console.error("⚠️ JSON Parse Error:", error);
      }
  
      appendIncomingMessage(newMessage);
  });
  
  
  }, [webContainer]); // Runs only when WebContainer is set
   // Runs only when WebContainer is set
  
  

  useEffect(() => {
    if (chatContainerRef.current) {
      
      setTimeout(() => {
        chatContainerRef.current.style.scrollBehavior = "smooth"; // 🔥 Add smooth scrolling
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }, 100);
    }
  }, [messages]);

  useEffect(() => {
    axios.get(`/project/get-project/${location.state.project._id}`)
        .then((res) => {
            console.log("📂 Project Data Received:", res.data);
            
            if (!res.data.project.fileTree) {
                console.warn("⚠️ fileTree is missing from API response! Setting default...");
                res.data.project.fileTree = {}; // ✅ Ensure fileTree is an object
            }

            setProject(res.data.project);
            setfileTree(res.data.project.fileTree); // ✅ Set fileTree properly
        })
        .catch((err) => {
            console.error("❌ Error fetching project:", err.response?.data || err);
        });

    axios.get("/users/all")
        .then((res) => {
            console.log("👥 Users Data:", res.data);
            setUsers(res.data.users);
        })
        .catch((err) => {
            console.error("❌ Error fetching users:", err);
        });
}, []);

function refreshProjectData() {
  axios.get(`/project/get-project/${project._id}`)
    .then((res) => {
      console.log("🔄 Project data re-fetched:", res.data);
      setProject(res.data.project);
      setfileTree(res.data.project.fileTree);
    })
    .catch((err) => {
      console.error("❌ Error fetching project:", err.response?.data || err);
    });
}

  

function saveFileTree(ft) {
  if (!ft || typeof ft !== "object") {
    console.error("❌ Invalid fileTree:", ft);
    return;
  }

  console.log("📤 Sending updated fileTree to backend:", ft);

  axios.put('/project/update-file-tree', {
    projectId: project._id,
    fileTree: ft
  })
  .then(res => {
    console.log("✅ FileTree saved successfully in MongoDB:", res.data);

    // ✅ Call this after saving to refresh frontend state
    refreshProjectData();
  })
  .catch(err => {
    console.error("❌ Error saving FileTree:", err.response?.data || err);
  });
}




  function appendIncomingMessage(messageObject) {
    setMessages((prevMessages) => [...prevMessages, messageObject]);
  }

  return (
    <main className="min-h-screen flex bg-gray-100 flex-col md:flex-row">

<section className="left w-full md:w-[500px] bg-gray-900 rounded-lg shadow-lg flex flex-col border border-cyan-400/50 h-screen md:relative">

  {/* Header */}
  <header className="p-4 bg-gray-800 flex justify-between items-center shadow-md border-b border-cyan-400/50">
    <button
      onClick={() => setIsModalOpen(true)}
      className="p-2 bg-gray-700 text-cyan-400 ring-2 ring-cyan-400/50 rounded-lg hover:bg-gray-600 transition-all"
    >
      <i className="ri-add-fill mr-1"></i>
      Add Collaborator
    </button>
    <button
      onClick={() => setisSidePanelOpen(!isSidePanelOpen)}
      className="p-2 bg-gray-700 text-cyan-400 ring-2 ring-cyan-400/50 rounded-lg hover:bg-gray-600 transition-all"
    >
      <i className="ri-user-fill text-xl"></i>
    </button>
  </header>

  {/* Chat Messages */}
  <div ref={chatContainerRef} className="conversation-area flex-1 p-4 space-y-3 overflow-auto min-w-110">
    {messages.map((messageObject, index) => (
      <div
        key={index}
        className={`message ${
          messageObject.sender.email === user.email ? "text-right" : "text-left"
        }`}
      >
        <p className="text-gray-400 text-sm">{messageObject.sender.email}</p>
        <div
          className={`p-3 rounded-lg shadow-md mt-1 max-w-86 w-fit break-words ${
            messageObject.sender.email === user.email
              ? "bg-gray-800 text-white ml-auto border border-cyan-400/50"
              : "bg-gray-800 text-white border border-cyan-400/50"
          }${
            messageObject.sender.email === "AI"
              ? "!text-green-400 !drop-shadow-[0_0_5px_#50fa7b] !border-green-400/100"
              : ""
          }`}
        >
          {messageObject.sender.email === "AI"
            ? WriteAiMessage(messageObject.message)
            : messageObject.message}
        </div>
      </div>
    ))}
  </div>

  {/* Side Panel */}
  <div
    className={`sidePanel absolute top-0 right-0 h-full bg-gray-800 transition-all duration-300 border-l border-cyan-400/50 ${
      isSidePanelOpen ? "w-full" : "w-0"
    }`}
  >
    {isSidePanelOpen && (
      <>
        <header className="p-4 bg-gray-900 flex justify-end items-center shadow-md border-b border-cyan-400/50">
          <button
            onClick={() => setisSidePanelOpen(!isSidePanelOpen)}
            className="p-2 bg-gray-700 text-cyan-400 ring-2 ring-cyan-400/50 rounded-lg hover:bg-gray-600 transition-all"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </header>

        {project.users &&
          project.users.map((user) => {
            return (
              <div
                key={user.id}
                className="user cursor-pointer hover:bg-gray-700 p-2 flex gap-2 items-center transition-all"
              >
                <div className="aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-gray-600 ring-2 ring-cyan-400/50">
                  <i className="ri-user-fill absolute"></i>
                </div>
                <h1 className="font-semibold text-lg text-cyan-300">{user.email}</h1>
              </div>
            );
          })}
      </>
    )}
  </div>

  {/* Input Box */}
  <div className="p-3 bg-gray-800 flex items-center shadow-md border-t border-cyan-400/50">
    <input
      value={message}
      type="text"
      onChange={(e) => setMessage(e.target.value)}
      className="flex-1 p-2 rounded-lg bg-gray-700 text-cyan-300 focus:outline-none ring-2 ring-cyan-400/50"
      placeholder="Enter message"
    />
    <button
      onClick={send}
      className="ml-2 text-xl bg-cyan-500 p-2 rounded-full hover:bg-cyan-400 transition-all text-white"
    >
      ➤
    </button>
  </div>
</section>


<section className="right flex-grow bg-[#9DB7AD] flex flex-col md:flex-row">

  {/* File Explorer */}
  <div className="explorer w-full md:max-w-64 md:min-w-52 flex flex-wrap md:flex-col justify-start items-center bg-[#001e1e] py-2 border-b md:border-b-0 md:border-r border-[#6272a4]">

    <div className="file-tree w-full flex flex-col gap-2 p-2">
      {Object.keys(fileTree).map((file, index) => (
        <button
          key={index}
          className="tree-element cursor-pointer p-2 px-4 bg-[#00312f] text-[#f8f8f2] hover:bg-[#016764] hover:text-black transition-all rounded-md"
          onClick={() => {
            setCurrentFile(file);
            setOpenFile((prevFiles) =>
              prevFiles.includes(file) ? prevFiles : [...prevFiles, file]
            );
          }}
        >
          <p className="text-sm font-semibold">{file}</p>
        </button>
      ))}
    </div>
  </div>

  {/* Code Editor */}
  <div className="code-editor w-full h-auto bg-[#1e1f29] p-4 border-b md:border-b-0 md:border-l border-[#6272a4]">

    {/* Opened File Tabs */}
    <div className="top flex gap-2 justify-between w-full">
      <div className="files flex">
        {openFile.map((file, index) => (
          <button
            key={index}
            onClick={() => setCurrentFile(file)}
            className={`file-button ${
              currentFile === file ? "border-b-2 border-[#50fa7b]" : "border-none"
            } p-2 px-4 text-[#f8f8f2] font-semibold text-sm hover:bg-[#44475a] transition-all rounded-md`}
          >
            <p className="font-semibold">{file}</p>
          </button>
        ))}
      </div>
      <div className="actions flex gap-2">
        <button
          className="bg-[#50fa7b] text-black p-2 px-4 rounded-md hover:bg-[#69ff94] transition-all"
          onClick={async () => {
            if (!webContainer) {
              console.error("❌ WebContainer not initialized! Booting now...");
              const container = await getWebContainerInstance();
              setwebContainer(container);
              console.log("✅ WebContainer instance set in state");
            }
          
            console.log("📤 Saving latest FileTree to MongoDB...");
            
            // 🔥 Ensure the latest FileTree is saved BEFORE running
            await saveFileTree(fileTree);
          
            console.log("✅ FileTree saved successfully in MongoDB!");
          
            console.log("🚀 Checking and mounting latest fileTree...");
            
            // 🔥 Ensure we're mounting the latest FileTree state
            await webContainer.mount({ ...fileTree });
          
            console.log("📂 Files mounted:", await webContainer.fs.readdir("/"));
          
            if (runProcess) {
              console.log("🛑 Stopping previous server...");
              runProcess.kill();
            }
          
            console.log("🏃 Installing dependencies...");
            const installProcess = await webContainer.spawn("npm", ["install", "--silent"]);
            installProcess.output.pipeTo(
              new WritableStream({
                write(chunk) {
                  console.log(chunk);
                },
              })
            );
            await installProcess.exit;
          
            console.log("🔄 Starting new server...");
            const tempRunProcess = await webContainer.spawn("npm", ["start"]);
            tempRunProcess.output.pipeTo(
              new WritableStream({
                write(chunk) {
                  console.log(chunk);
                },
              })
            );
            setRunProcess(tempRunProcess);
          
            webContainer.on("server-ready", (port, url) => {
              console.log("✅ Server running at:", url);
              setIframeUrl(url);
            });
          }}
          
        >
          Run
        </button>
      </div>
    </div>

    {/* File Content Editor */}
    <div className="bottom flex h-full">
      {fileTree[currentFile] && (
        <pre className="w-full h-full p-2 border border-[#6272a4] rounded-md bg-[#282a36] text-[#f8f8f2] overflow-auto">
          <code
            ref={(el) => {
              if (el) {
                hljs.highlightElement(el);
              }
            }}
            contentEditable
            suppressContentEditableWarning
            className="language-javascript block outline-none focus:ring-2 focus:ring-[#50fa7b] w-full max-w-120"
            onInput={(e) => {
              const selection = window.getSelection();
              const range = selection.getRangeAt(0);
              const startOffset = range.startOffset;

              const updatedContent = e.target.innerText;

              setfileTree((prevTree) => {
                const newTree = {
                  ...prevTree,
                  [currentFile]: {
                    file: { contents: updatedContent },
                  },
                };

                saveFileTree(newTree);

                return newTree;
              });

              setTimeout(() => {
                const newRange = document.createRange();
                newRange.setStart(e.target.firstChild || e.target, startOffset);
                newRange.collapse(true);
                selection.removeAllRanges();
                selection.addRange(newRange);
              }, 0);
            }}
          >
            {fileTree[currentFile]?.file?.contents || ""}
          </code>
        </pre>
      )}
    </div>
  </div>

  {/* Browser Preview */}
  {iframeUrl && webContainer && 
    <div className="web w-full h-auto flex flex-col md:border-l border-[#6272a4]">

      <div className="address-bar">
      <input type="text"
       onChange={(e) => setIframeUrl(e.target.value)}
       value={iframeUrl} className="w-full p-2 px-4 bg-slate-200" />
      </div>

       <iframe src={iframeUrl} className="w-full h-full shrink">
       </iframe>
      
    </div>

    }
</section>


      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Select User</h2>
            <ul className="space-y-2">
              {users.map((user) => (
                <li
                  key={user._id}
                  className={`p-2 ${
                    selectedUserId.includes(user._id.toString())
                      ? "bg-gray-600"
                      : "bg-gray-700"
                  } text-white rounded-lg cursor-pointer hover:bg-gray-600`}
                  onClick={() => handleUserClick(user._id.toString())} // Convert to string to match selectedUserId
                >
                  <div className="aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-gray-600">
                    <i className="ri-user-fill absolute"></i>
                  </div>
                  <h1 className="font-semibold text-lg">{user.email}</h1>
                </li>
              ))}
            </ul>
            <div className="flex justify-between mt-4 ml-2 mr-2">
              <button
                className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                onClick={addCollabrators}
              >
                Add Collaborator
              </button>

              <button
                className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Project;
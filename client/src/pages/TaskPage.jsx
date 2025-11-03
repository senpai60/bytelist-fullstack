import React, { useEffect, useState } from "react";
import TaskCard from "../components/task/TaskCard";
import axios from 'axios'
// Example tasks data
// const tasks = [
//   {
//     title: "Learn React",
//     description: "Build a simple React app.",
//     image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb", // Example
//     expireAt: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
//     duration: 30,
//     progress: ["Step 1", "Step 2"],
//     isCompleted: false,
//     experienceLevel: "beginner",
//     attemptsUsed: 1,
//     attemptsAllowed: 2,
//     sources: ["React Docs", "FreeCodeCamp", "YouTube"],
//   },
//   {
//     title: "Write Express API",
//     description: "Create CRUD endpoints for users.",
//     image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca", // Example
//     expireAt: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
//     duration: 45,
//     progress: ["Router setup"],
//     isCompleted: false,
//     experienceLevel: "intermediate",
//     attemptsUsed: 1,
//     attemptsAllowed: 3,
//     sources: ["Express Docs", "Official GitHub"],
//   },
//   // ...add more
// ];
const SERVER_URI = import.meta.env.VITE_SERVER_URI || "http://localhost:3000";


export const TaskPage = ({user}) => {
  const [tasks, setTasks] = useState([])

  useEffect(()=>{
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${SERVER_URI}/tasks/all`,{
          
          headers:{
            Authorization:"Bearer token"
          },
          withCredentials:true
        })
        console.log(response.data);
        if (response.data?.tasks) {
          
          
          setTasks(response.data?.tasks || [])
        }
      } catch (err) {
        console.error(err)
      }
    }
    if (user) {
     fetchTasks()
    }
  },[])
  return (
    <div className="max-w-full h-[85vh] mx-auto py-8 px-5 overflow-x-hidden overflow-y-scroll text-white">
      <h1 className="text-3xl font-bold mb-8">My Tasks</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {tasks.map((task, idx) => (
          task?.isRemovedFromTask !== true && <TaskCard key={idx} task={task} />
        ))}
      </div>
    </div>
  );
};

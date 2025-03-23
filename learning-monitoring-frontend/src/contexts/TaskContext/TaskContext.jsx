import React,{ createContext, useState } from "react";

export const TaskContext = createContext()

const TaskContextProvider = ({ children }) => {
    const [task, setTask] = useState(undefined);
    return <>
        <TaskContext.Provider value={{ task, setTask }}>
            {children}
        </TaskContext.Provider>
    </>
}

export default TaskContextProvider

import React,{ createContext, useState } from "react";

export const TaskNotesContext = createContext()

const TaskNotesContextProvider = ({ children }) => {
    const [taskNotes, setTaskNotes] = useState(undefined);
    return <>
        <TaskNotesContext.Provider value={{ taskNotes, setTaskNotes }}>
            {children}
        </TaskNotesContext.Provider>
    </>
}

export default TaskNotesContextProvider
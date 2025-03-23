import React,{ createContext, useState } from "react";

export const AttachmentsContext = createContext()

const AttachmentsContextProvider = ({ children }) => {
    const [attachments, setAttachments] = useState(undefined);
    return <>
        <AttachmentsContext.Provider value={{ attachments, setAttachments }}>
            {children}
        </AttachmentsContext.Provider>
    </>
}

export default AttachmentsContextProvider
import React, { useEffect, useState } from 'react'
import TextEditor from './TextEditor'

const HeadingTextEditor = ({ heading, getTextEditorValue, editorDefaultData,mandate=false }) => {
    const [textEditorValue, setTextEditorValue] = useState()
    // const updateDataAndNotifyParent = () => {
    //     getTextEditorValue(textEditorValue);
    // };

    useEffect(()=>{
        getTextEditorValue(textEditorValue);
    },[textEditorValue]);
    return (
        <>
            <label for="" className="mb-2 inline-block text-gray-600"> {heading} {mandate && <span className="text-red-500 ml-1">*</span> } </label>
            <TextEditor
                title=""
                editorDefaultData={editorDefaultData}
                onEditorChange={(data) => {
                   
                    setTextEditorValue(data);
                    // updateDataAndNotifyParent();
                }}
            />
        </>
    )
}

export default HeadingTextEditor
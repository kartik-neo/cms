import React, { useEffect, useState } from "react";
import QuillEditor from "react-quill";
import "react-quill/dist/quill.snow.css";

const TextEditor = ({
  title = "",
  mandate = false,
  editorDefaultData,
  onEditorChange,
}) => {
  const [editorData, setEditorData] = useState("");
  const maxCharacter = 20000;
  const [remainingChars, setRemainingChars] = useState(maxCharacter);
  const [errorMessage, setErrorMessage] = useState("");

  // useEffect(() => {
  //   if (editorDefaultData) {
  //     setEditorData(editorDefaultData)
  //   }
  // }, [editorDefaultData])

  useEffect(() => {
    if (editorDefaultData) {
      setEditorData(editorDefaultData);
      const charCount = stripHtmlTags(editorDefaultData).length;
      const remaining = maxCharacter - charCount;
      setRemainingChars(remaining);
    }
  }, [editorDefaultData]);

  const stripHtmlTags = (html) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;
    return tempElement.textContent || tempElement.innerText || "";
  };

  const handleEditorChange = (value) => {
    const charCount = stripHtmlTags(value).length;
    const remaining = maxCharacter - charCount;

    if (remaining >= 0) {
      setEditorData(value);
      setRemainingChars(remaining);
      onEditorChange(value);
      setErrorMessage("");
    }
  };

  const handleKeyDown = (event) => {
    if (
      remainingChars <= 0 &&
      event.key !== "Backspace" &&
      event.key !== "Delete"
    ) {
      event.preventDefault();
    }
  };

  const handlePaste = (event) => {
    const pastedData = event.clipboardData.getData("text/plain");
    const charCount = stripHtmlTags(editorData).length + pastedData.length;
    const remaining = maxCharacter - charCount;
    if (charCount > maxCharacter) {
      event.preventDefault();
      const copiedCharLength = pastedData.length;
      const errorMessage = `You have exceeded the character limit by ${Math.abs(
        remaining
      )} characters. You have copied ${copiedCharLength} characters.`;
      setErrorMessage(errorMessage);
    } else {
      setRemainingChars(remaining);
      setErrorMessage("");
    }
  };

  const modules = {
    toolbar: [
      [{ size: [] }],
      ["bold", "italic", "underline"],
      ["link"],
      [{ list: "ordered" }, { list: "bullet" }],
    ],
  };

  return (
    <>
      <div className="form-field">
        {title && (
          <label for="" className="mb-2 inline-block text-gray-600">
            {" "}
            {title} {mandate && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        {/* <CKEditor
          disabled={disabled}
          editor={ClassicEditor}
          data={editorData}
          onChange={handleEditorChange}
          
        //   config={ {
        //     toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote' ],
        // } }
        /> */}
        <div onPaste={handlePaste}>
          <QuillEditor
            value={editorData}
            onChange={(value) => handleEditorChange(value)}
            onKeyDown={handleKeyDown}
            modules={modules}
          />
        </div>
        {errorMessage && <p className="text-red-600 mt-1">{errorMessage}</p>}
        <p className="text-sm text-gray-400 mt-1">
          {/* {remainingChars} characters remaining  */}
          {remainingChars == 0
            ? "Maximum limit reached"
            : ` ${remainingChars} characters remaining`}
        </p>
      </div>
    </>
  );
};

export default TextEditor;

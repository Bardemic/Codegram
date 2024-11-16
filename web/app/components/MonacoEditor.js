"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

const Editor = ({
  height = "90vh",
  defaultLanguage = "javascript",
  defaultValue = "console.log(23);",
}) => {
  const [value, setValue] = useState(defaultValue);

  const handleEditorChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <MonacoEditor
      height={height}
      defaultLanguage={defaultLanguage}
      defaultValue={defaultValue}
      theme="vs-dark"
      onChange={handleEditorChange}
    />
  );
};

export default Editor;

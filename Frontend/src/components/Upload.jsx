import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const Upload = ({
  onUpload,
  maxSize = 5242880,
  acceptedFileTypes = { "image/*": [".jpeg", ".jpg", ".png", ".gif"] },
  multiple = false,
  customStyles = {},
}) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      onUpload(acceptedFiles);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: acceptedFileTypes,
      maxSize: maxSize,
      multiple: multiple,
    });

  const dropzoneStyles = {
    border: "2px dashed #cccccc",
    borderRadius: "4px",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
    ...customStyles,
  };

  return (
    <div>
      <div {...getRootProps()} style={dropzoneStyles}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the file(s) here ...</p>
        ) : (
          <p>Drag 'n' drop file(s) here, or click to select files</p>
        )}
      </div>
      {fileRejections.length > 0 && (
        <div>
          <h4>Rejected files</h4>
          <ul>
            {fileRejections.map(({ file, errors }) => (
              <li key={file.path}>
                {file.path} - {errors.map((e) => e.message).join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Upload;

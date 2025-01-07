'use client';
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import axios from "axios";

interface StudentInfo {
  usn: string;
  name: string;
}

export default function ExcelUploader() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (!event.target?.result) {
        setError("Failed to read file.");
        return;
      }

      try {
        const arrayBuffer = event.target.result as ArrayBuffer;
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: StudentInfo[] = XLSX.utils.sheet_to_json(worksheet);

        // API Call with JSON Data
        const syncData = async () => {
          try {
            const response = await axios.post('/api/v2/studentdata', jsonData, {
              headers: { 'Content-Type': 'application/json' },
            });
            console.log(response.data["message"]);
            setMessage(response.data["message"]);
            setError('');
          } catch (err) {
            console.error("Error syncing data:", err);
            setError('Error syncing data. Please try again.');
            setMessage('');
          }
        };

        syncData();
      } catch (err) {
        console.error("Error during file processing:", err);
        setError('Failed to process file.');
      }
    };

    reader.readAsArrayBuffer(file); // Reading file as array buffer
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    }
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-96">
        <div
          {...getRootProps()}
          className={`h-48 p-6 border-2 border-dashed rounded-md 
            ${isDragActive ? "border-blue-500 bg-blue-100" : "border-gray-400"}`}
        >
          <input {...getInputProps()} />
          <div className="text-center text-gray-600">
            {isDragActive ? (
              <p>Drop the Excel file here...</p>
            ) : (
              <p>Drag & drop an Excel file here, or click to select one</p>
            )}
          </div>
        </div>

        {message && <p className="mt-4 text-green-600">{message}</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>
    </div>
  );
}

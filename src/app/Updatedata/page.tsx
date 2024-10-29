'use client';
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import axios from "axios";

export default function ExcelUploader() {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const binaryStr = event.target.result;
            const workbook = XLSX.read(binaryStr, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            console.log(jsonData); // Log to confirm data structure

            // Send parsed data to the server
            const syncData = async () => {
                try {
                    const response = await axios.post('/api/v2/studentdata', jsonData);
                    console.log(response.data); // Log the response from the server
                    setMessage('Data synced successfully!'); // Set success message
                    setError(''); // Clear any previous error message
                } catch (error) {
                    console.error("Error syncing data:", error);
                    setError('Error syncing data. Please try again.'); // Set error message
                    setMessage(''); // Clear any previous success message
                }
            };
            
            syncData(); // Call the function to send data
        };

        reader.readAsBinaryString(file);
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

                {/* Display success or error messages */}
                {message && <p className="mt-4 text-green-600">{message}</p>}
                {error && <p className="mt-4 text-red-600">{error}</p>}
            </div>
        </div>
    );
}

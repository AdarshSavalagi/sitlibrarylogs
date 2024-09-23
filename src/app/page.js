'use client';
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function HomePage() {
    const [barcode, setBarcode] = useState("");
    const [timeoutId, setTimeoutId] = useState(null);
    const [entries, setEntries] = useState([]); // To store last 10 entries

    const handleScan = (event) => {
        const scannedValue = event.target.value.trim();

        // Clear any existing timeout to reset it
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // Update the barcode state
        setBarcode(scannedValue);

        // Set a timeout to detect when the input has stopped
        const newTimeoutId = setTimeout(() => {
            if (scannedValue) {
                // Make the backend call
                const postData = async () => {
                    try {
                        console.log(scannedValue);
                        const response = await axios.post('/api/v1/save', { usn: scannedValue });
                        console.log("Response:", response.data);
                        toast.success(response.data.message);

                        // Update entries, keeping only the last 10
                        setEntries(prevEntries => {
                            const updatedEntries = [{ usn: scannedValue, message: response.data.message }, ...prevEntries];
                            return updatedEntries.slice(0, 10); // Keep only the last 10
                        });
                    } catch (error) {
                        console.error("Error scanning barcode:", error);
                    }
                };

                postData();
                // Clear the input field for the next scan
                event.target.value = '';
            }
        }, 100); // Adjust the timeout duration if necessary

        // Update the timeout ID in the state
        setTimeoutId(newTimeoutId);
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-xl font-bold mb-4">Barcode Scanner</h1>
            <input
                type="text"
                onChange={handleScan}
                placeholder="Scan barcode here..."
                className="border border-gray-300 rounded-md p-2 w-full"
                autoFocus
            />
            {barcode && <p className="mt-2">Last Scanned Barcode: {barcode}</p>}

            <h2 className="text-lg font-semibold mt-6">Last 10 Entries</h2>
            <div className="overflow-x-auto mt-2">
                <table className="min-w-full bg-white border border-gray-200 shadow-md">
                    <thead>
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            USN
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Response Message
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {entries.length > 0 ? (
                        entries.map((entry, index) => (
                            <tr
                                key={index}
                                className="border-b border-gray-200 hover:bg-gray-50"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {entry.usn}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {entry.message}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="2"
                                className="px-6 py-4 text-center text-sm text-gray-500"
                            >
                                No entries found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

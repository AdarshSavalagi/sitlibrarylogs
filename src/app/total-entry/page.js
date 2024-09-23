'use client';
import { useState, useEffect } from "react";
import axios from "axios";

export default function Page() {
        const [entries, setEntries] = useState([]);
        const [totalInside, setTotalInside] = useState(0);
        const [selectedDate, setSelectedDate] = useState(""); // State for date filter
        const [showInsideOnly, setShowInsideOnly] = useState(false); // State for inside filter
        const [originalEntries, setOriginalEntries] = useState([]); // Store original entries

        useEffect(() => {
                const fetchData = async () => {
                        const response = await axios.get('/api/v1/total-entry');

                        setEntries(response.data);
                        setOriginalEntries(response.data); // Save original entries for filtering
                        setTotalInside(response.data.length);
                };

                fetchData();
        }, []);

        const handleDateChange = (e) => {
                const date = e.target.value;
                setSelectedDate(date);

                // Filter entries based on the selected date
                let filteredEntries = originalEntries;
                if (date) {
                        filteredEntries = originalEntries.filter(entry => {
                                const entryDate = new Date(entry.entry).toISOString().split('T')[0]; // Format entry date
                                return entryDate === date; // Compare with selected date
                        });
                }

                // Apply inside filter if it's checked
                if (showInsideOnly) {
                        filteredEntries = filteredEntries.filter(entry => entry.isInside);
                }

                setEntries(filteredEntries);
                setTotalInside(filteredEntries.length);
        };

        const handleShowInsideOnlyChange = (e) => {
                const checked = e.target.checked;
                setShowInsideOnly(checked);

                // Apply inside filter and date filter together
                let filteredEntries = originalEntries;
                if (selectedDate) {
                        filteredEntries = originalEntries.filter(entry => {
                                const entryDate = new Date(entry.entry).toISOString().split('T')[0]; // Format entry date
                                return entryDate === selectedDate; // Compare with selected date
                        });
                }

                // Apply inside filter
                if (checked) {
                        filteredEntries = filteredEntries.filter(entry => entry.isInside);
                }

                setEntries(filteredEntries);
                setTotalInside(filteredEntries.length);
        };

        return (
            <>
                    <div className="container mx-auto px-4 py-6">
                            {/* Date Filter Section */}
                            <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Select Date:
                                    </label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        className="border border-gray-300 rounded-md p-2"
                                    />
                            </div>

                            {/* Checkbox for showing only those who are inside */}
                            <div className="mb-4">
                                    <label className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={showInsideOnly}
                                                onChange={handleShowInsideOnlyChange}
                                                className="form-checkbox"
                                            />
                                            <span className="ml-2 text-gray-700">Show Only Students Inside</span>
                                    </label>
                            </div>

                            {/* Table Section */}
                            <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white border border-gray-200 shadow-md">
                                            <thead>
                                            <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            USN
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Entry Time
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Exit Time
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Is Inside
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
                                                                    {new Date(entry.entry).toLocaleString()}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                    {entry.exit ? new Date(entry.exit).toLocaleString() : "Still Inside"}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                    {entry.isInside ? "Yes" : "No"}
                                                            </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                        <td
                                                            colSpan="4"
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
            </>
        );
}

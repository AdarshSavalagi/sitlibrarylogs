'use client';
import { useState, useEffect } from "react";
import axios from "axios";

export default function Page() {
    const [entries, setEntries] = useState([]);
    const [totalInside, setTotalInside] = useState(0);

    useEffect(() => {

        const fetchData = async () => {
            const response = await axios.get('/api/v1/in-students');
            const insideEntries = response.data.filter(entry => entry.isInside);
            setEntries(insideEntries);
            setTotalInside(insideEntries.length);
        }

        fetchData();
    }, []);

    return (
        <>
            <div className="container mx-auto px-4 py-6">
                {/* Top Info Section */}
                <div className="bg-blue-100 rounded-lg p-4 mb-6 shadow-md">
                    <h2 className="text-xl font-bold text-blue-800">Student Entry Summary</h2>
                    <p className="text-blue-700 text-lg">
                        Total Students Inside: <span className="font-semibold">{totalInside}</span>
                    </p>
                </div>

                {/* Responsive Table */}
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                USN
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Entry Time
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
        </>
    );
}

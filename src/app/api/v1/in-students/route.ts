import { connect } from '../../../../utils/database';
import { NextResponse } from "next/server";
import StudentEntry from "../../../../models/student.models";
import StudentName from "../../../../models/StudentName";

connect();
export const revalidate = 1;

export const GET = async () => {
    try {
        // Get the start and end of the current day
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        
        // Fetch the latest entries from StudentEntry
        const latestEntries = await StudentEntry.find({
            entry: {
                $gte: startOfDay,
                $lte: endOfDay
            },
            exit: null
        }).sort({ entry: -1 }).exec();

        console.log('latestEntries1',latestEntries);

        // Extract USNs from latestEntries
        const usns = latestEntries.map(entry => entry.usn);


        console.log('usns1',usns);

        // Fetch names from StudentName where USNs match
        const studentNames = await StudentName.find({ usn: { $in: usns } });

        console.log('studentNames1',studentNames);

        // Create a map for quick name lookup
        const nameMap = studentNames.reduce((acc, student) => {
            acc[student.usn] = student.name;
            console.log('acc',acc); // Assuming the StudentName model has fields 'usn' and 'name'
            return acc;
        }, {});

        console.log('nameMap1',nameMap);

        // Combine latestEntries with names
        const enrichedEntries = latestEntries.map(entry => ({
            ...entry.toObject(), // Convert mongoose document to plain object
            name: nameMap[entry.usn] || 'No Data' // Get the name from the map, or null if not found
        }));


        console.log('enrichedEntries',enrichedEntries);


        // Return the combined data
        return NextResponse.json(enrichedEntries);
    } catch (err) {
        return NextResponse.json({ status: err.status, message: err.message }, { status: 500, statusText: 'Internal Server Error' });
    }
}

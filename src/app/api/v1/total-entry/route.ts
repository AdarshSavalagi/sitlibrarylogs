
import {NextResponse} from "next/server";
import StudentEntry from "../../../../models/student.models";
import {connect} from "../../../../utils/database";
import StudentName from "../../../../models/StudentName";

connect();

export const revalidate = 1;
export const GET=async()=>{
    try {
        const userList = await StudentEntry.find({});
        const usns = userList.map(entry => entry.usn);


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
        const enrichedEntries = userList.map(entry => ({
            ...entry.toObject(), // Convert mongoose document to plain object
            name: nameMap[entry.usn] || 'No Data' // Get the name from the map, or null if not found
        }));


        console.log('enrichedEntries',enrichedEntries);


        return NextResponse.json(enrichedEntries);
    } catch (e){
        return NextResponse.json(
            {
                status: "error",
                message: e.message,
            },{
                status:500
            }
        );
    }
}
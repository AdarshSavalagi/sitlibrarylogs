import { NextResponse } from "next/server";
// import protobuf from "protobufjs";
import StudentEntry from "../../../../models/StudentName";
import { connect } from "../../../../utils/database";
// import studentProto from "../../../../proto/student.proto"; 

connect();

export async function POST(req) {
    try {
        // const buffer = await req.arrayBuffer(); // Receive raw binary data
        // // const root = await protobuf.load(studentProto);
        // const StudentData = root.lookupType("StudentData");

        // // Decode Protobuf data
        // const decodedData = StudentData.decode(new Uint8Array(buffer));
        // const students = decodedData.students;
        await connect();
        const students = await req.json();
        console.log("Received student data:", students);

      

        const bulkOps = students.map(({ usn, name }) => {
            if (!usn || !name) {
                throw new Error("Missing USN or Name"); // Throw error for validation
            }
        
            const lowerUsn = usn.toLowerCase();
        
            return {
                updateOne: {
                    filter: { usn: lowerUsn }, // Check if the student already exists
                    update: { $set: { name } }, // Update or set the name
                    upsert: true, // Insert a new document if no match is found
                }
            };
        });
        
        try {
            const result = await StudentEntry.bulkWrite(bulkOps);
            return NextResponse.json({
                status: "success",
                message: `${result.upsertedCount} new students added, ${result.modifiedCount} updated.`,
            });
        } catch (error) {
            console.error("Error during bulkWrite:", error);
            return NextResponse.json({
                status: "error",
                message: "Failed to process student data.",
                error: error.message
            }, { status: 500 });
        }
        

       
    } catch (error) {
        console.error("Error saving data:", error);
        return NextResponse.json({ message: "Error saving data", error }, { status: 500 });
    }
}

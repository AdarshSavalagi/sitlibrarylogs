import { NextResponse } from "next/server";
import StudentEntry from "../../../../models/StudentName";
import { connect } from "../../../../utils/database";


connect();

export async function POST(req) {
    try {
        const studentArray = await req.json(); 

        
        console.log("Received student data:", studentArray);


        let dataSaved = false;

      
        for (const studentData of studentArray) {
            const { usn, name } = studentData; 
            const lowerUsn = usn.toLowerCase(); 


            if (!lowerUsn) {
                return NextResponse.json({
                    status: "error",
                    message: "USN is null"
                }, { status: 400 });
            }

            if (!name) {
                return NextResponse.json({
                    status: "error",
                    message: "Name is null"
                }, { status: 400 });
            }

            const student = await StudentEntry.findOne({ usn: lowerUsn });
            if (!student) {
                const newStudent = new StudentEntry({
                    usn: lowerUsn,
                    name: name 
                });
                await newStudent.save();
                dataSaved = true; 
            }
        }

        if (dataSaved) {
            return NextResponse.json({ message: "Data saved successfully!" });
        } else {
            return NextResponse.json({ message: "Data already saved" });
        }
    } catch (error) {
        console.error("Error saving data:", error);
        return NextResponse.json({ message: "Error saving data", error }, { status: 500 });
    }
}

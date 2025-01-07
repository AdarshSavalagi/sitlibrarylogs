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

        let dataSaved = false;

        for (const studentData of students) {
            const { usn, name } = studentData;

            if (!usn || !name) {
                return NextResponse.json(
                    { status: "error", message: "Missing USN or Name" },
                    { status: 400 }
                );
            }

            const lowerUsn = usn.toLowerCase();
            const student = await StudentEntry.findOne({ usn: lowerUsn });

            if (!student) {
                const newStudent = new StudentEntry({ usn: lowerUsn, name });
                await newStudent.save();
                dataSaved = true;
            }else{
                student.name = name;
                await student.save();

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

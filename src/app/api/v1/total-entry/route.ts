
import {NextResponse} from "next/server";
import StudentEntry from "../../../../models/student.models";
import {connect} from "../../../../utils/database";

connect();

export const revalidate = 1;
export const GET=async()=>{
    try {
        const userList = await StudentEntry.find({});
        return NextResponse.json(userList);
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
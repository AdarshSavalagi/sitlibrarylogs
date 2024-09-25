import {connect} from '../../../../utils/database'
import {NextResponse} from "next/server";
import StudentEntry from "../../../../models/student.models";

connect();
export const revalidate = 1;

export const GET= async ()=>{
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const latestEntries = await StudentEntry.find({
            entry: {
                $gte: startOfDay,
                $lte: endOfDay
            },
            exit: null
        }).sort({ entry: -1 }).exec();
        return NextResponse.json(latestEntries);
    }catch(err){
        return NextResponse.json({status:err.status,message:err.message},{status:500,statusText:'Internal Server Error'});
    }
}
import { NextRequest, NextResponse } from "next/server";
import StudentEntry from "../../../../models/student.models";
import { connect } from "../../../../utils/database";

connect();

export async function POST(req: NextRequest) {
    try {
        const { usn } = await req.json();

        if (!usn) {
            return NextResponse.json({
                status: "error",
                message: "USN is null"
            }, { status: 400 });
        }

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const latestEntry = await StudentEntry.findOne({
            usn: usn,
            entry: {
                $gte: startOfDay,
                $lte: endOfDay
            },
            exit: null
        }).sort({ entry: -1 }).exec();
        if (latestEntry) {
            latestEntry.exit = new Date();
            latestEntry.isInside = false;
            await latestEntry.save();
            return NextResponse.json({
                status: "success",
                message: `${latestEntry.usn} exited successfully.`
            }, { status: 200 });
        }
        const newEntry = await StudentEntry.create({
            usn: usn,
            entry: new Date(),
            isInside: true
        });

        return NextResponse.json({
            status: "success",
            message: `${newEntry.usn} entered successfully.`
        }, { status: 200 });

    } catch (e) {
        return NextResponse.json({
            status: "error",
            message: e.message,
        }, { status: 500 });
    }
}

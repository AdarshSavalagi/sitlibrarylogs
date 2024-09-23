import mongoose, {Schema} from "mongoose";


const StudentEntrySchema = new Schema({
    usn: {
        type: String,
        required: true,
    },
    entry:{
        type:Date,
        default:Date.now()
    },
    exit:{
        type:Date,
    },
    isInside:{
        type:Boolean,
        default:true
    },
},{
    timestamps: true,
});


const StudentEntry = mongoose.models.studententry || mongoose.model("studententry", StudentEntrySchema);


export default StudentEntry;
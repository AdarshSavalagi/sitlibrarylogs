import mongoose, {Schema} from "mongoose";


const studentNameSchema = new Schema({
    usn: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },

},{
    timestamps: true,
});


const studentName = mongoose.models.studentName || mongoose.model("studentName", studentNameSchema);


export default studentName;
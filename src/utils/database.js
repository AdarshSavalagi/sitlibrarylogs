import mongoose from 'mongoose';

export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URI||'mongodb+srv://admin:admin@cluster0.uqxqc4p.mongodb.net/sit_library?retryWrites=true&w=majority&appName=ServerlessInstance0',{
            serverSelectionTimeoutMS: 30000, 
            socketTimeoutMS: 30000,   
        });
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        })

        connection.on('error', (err) => {
            console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
            process.exit();
        })

    } catch (error) {
        console.log('Something goes wrong!');
        console.log(error);

    }
}

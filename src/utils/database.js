import mongoose from 'mongoose';

export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URI||'mongodb+srv://alumni:vBw8r6VyZZKWOtYb@serverlessinstance0.rrix0lr.mongodb.net/librarylogs?retryWrites=true&w=majority&appName=ServerlessInstance0',{
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
import mongoose from 'mongoose';

const connectToDatabase = async () => {
    try {
        const conn = await mongoose.connect('mongodb://127.0.0.1:27017/pipe-racer' );
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

export default connectToDatabase;
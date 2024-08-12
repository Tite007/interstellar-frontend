import mongoose from 'mongoose';


export default async function ConnectMongoDB() {
  console.log('Connecting to MongoDB...');
  try {
    await mongoose.connect('mongodb+srv://interstellar-store:gb16C7VTKy0JIotzd@cluster0.got81jq.mongodb.net/cluster0?retryWrites=true&w=majority');
  } catch (error) {
    handleError(error);
  } finally {
    console.log('Connected to MongoDB');
  }
} 

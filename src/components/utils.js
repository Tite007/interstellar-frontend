import React from "react";
import mongoose from "mongoose"; 


export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


export default async function ConnectMongoDB() {
  const connection = {}

  try {
    if(connection.isConnected) return;
    const db = await mongoose.connect('process.env.MONGODB');
    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.error(error);
    throw new Error('Error connecting to MongoDB');
  }
};
  
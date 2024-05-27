import mongoose from "mongoose"

type ConnectionObject = {
    isConnected?:number
}

const connection :ConnectionObject={}

export const ConnectDb =async()=>{
    if (connection.isConnected) {
        console.log("DataBase already connected")
        return
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI! || "")
        connection.isConnected = db.connections[0].readyState;
        console.log("DataBase connected")
        // console.log(db)
    } catch (error:any) {
        console.log("error while conecting DB ::>",error)
        process.exit(1)
    }
}
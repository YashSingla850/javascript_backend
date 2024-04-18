// require('dotenv').config(path : './env')
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
})

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`server is running at: ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log("Mongo connection failed")
    })




// (async () => {
//     try {
//       await  mongoose.connect(`process.env.MONGODB_URI/${DB_NAME}`)
//     } catch (err) {
//         console.log(err);
//         throw err 
//     }
// })()
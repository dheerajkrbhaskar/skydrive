import dotenv from 'dotenv'
import { app } from './app.js'
import { connectDB } from './db/index.js'
dotenv.config({ path: 'src/.env' })

const PORT = process.env.PORT || 3001

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Listening to PORT : ${PORT}`)
        })
    })
    .catch((err) => {
        console.log("MongoDB Connection error: ", err)
    })


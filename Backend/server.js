import app from "./app.js"
import connectDB from "./config/DBConnection.js"

const PORT = 3000;

const startServer = async () => {
    try {

        await connectDB()

        app.listen(PORT, () => {

            console.log(`Server is running sucessfully at PORT : ${PORT}`)

        })

    } catch (error) {

        console.log("Can't run the server", error)

        process.exit(1);
    }
}

startServer()
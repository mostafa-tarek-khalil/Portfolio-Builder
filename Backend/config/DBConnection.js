import mongoose from "mongoose"

const connection = async () => {

    await mongoose.connect("mongodb://localhost:27017/FreelancePlatformDB")

        .then(() => {

            console.log("DB is Connected Successfully")

        })
        .catch((err) => {

            console.log("DB can't connect", err)

            throw err
        })
}

export default connection
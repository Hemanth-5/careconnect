import express from "express";
import mongoose from "mongoose";
// import router from "./routes.js";

const app = express();
const PORT = 5001;
const MONGO_URL =
  "mongodb+srv://careconnect:careconnect001@cluster0.ecmumff.mongodb.net/MockDatabase";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use("/", router);

mongoose
  .connect(MONGO_URL, { bufferCommands: false })
  .then(async () => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });

    // Run once to add data to mongoDB
    // const mockUsers = Array.from({ length: 200 }, generateUser);
    // try {
    //   const Users = UserModel.insertMany(mockUsers);
    // } catch (error) {
    //   console.log(error, "Failed to insert users");
    // }

    // To create reference for doctors and users
    // const Users = await UserModel.find();
    // const doctorIds = Users.filter((user) => user.type === "doctor").map(
    //   (doctor) => doctor._id
    // );
    // const mockDoctors = doctorIds.map((id) => ({
    //   userId: id,
    //   ...generateDoctor(),
    // }));
    // console.log("Mock Doctors", mockDoctors);

    // Run once to add data to mongoDB
    // try {
    //   const Doctors = DoctorModel.insertMany(mockDoctors);
    // } catch (error) {
    //   console.log(error, "Failed to insert doctors");
    // }
  })
  .catch((error) => console.log(error, "MongoDB failed to connect"));

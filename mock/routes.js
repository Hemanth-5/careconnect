import { Router } from "express";
import { UserModel, DoctorModel } from "./userMock.js";

const router = Router();

router.post("/users", async (req, res) => {
  try {
    const user = await UserModel.create(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to get users" });
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to get user" });
  }
});

router.post("/doctors", async (req, res) => {
  try {
    const doctor = await DoctorModel.create(req.body);
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ error: "Failed to create doctor" });
  }
});

router.get("/doctors", async (req, res) => {
  try {
    const doctors = await DoctorModel.find();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: "Failed to get doctors" });
  }
});

router.get("/doctors/:id", async (req, res) => {
  try {
    const doctor = await DoctorModel.findById(req.params.id);
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ error: "Failed to get doctor" });
  }
});

export default router;

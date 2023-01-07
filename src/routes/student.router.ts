import * as express from "express";
import CreateStudent from "../controllers/student/student.controller";

const router = express.Router();

router.post("/create", async (req, res) => {
  let body = req.body;
  let createStudent = new CreateStudent();
  const register = await createStudent.createStudent(body);
  return res.json(register);
});

export default router;

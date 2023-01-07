import * as express from 'express';
import CreateUniversity from '../controllers/university/university.controller';

const router = express.Router();

router.post('/create', async (req, res) => {
  let body = req.body;
  let createStudent = new CreateUniversity();
  const register = await createStudent.createUni(body);
  return res.json(register);
});

export default router;

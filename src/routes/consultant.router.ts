import * as express from "express";
import UserSignUp from "../controllers/consultants/register.controller";
import UserLogin from "../controllers/consultants/login.controller";

const router = express.Router();

router.post("/register", async (req, res) => {
  let {email, password} = req.body;
  let consultantSignUp = new UserSignUp(email, password);
  const register = await consultantSignUp.register();
  return res.json(register);
});

router.post("/login", async (req, res) => {
  let {email, password} = req.body;
  let consultantLogin = new UserLogin(email, password);
  const login = await consultantLogin.login();
  return res.json(login);
});

export default router;

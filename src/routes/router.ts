import * as express from "express";
import UserSignUp from "../core/consultant/register";
import UserLogin from "../core/consultant/login";

const router = express.Router();

router.get("/", (req, res) => {
  return res.send("Application is running!");
});
/**
 * define your routes over here
 * router.get('/universities', universitiesController);
 */
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

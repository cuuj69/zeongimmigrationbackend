import * as express from 'express';
import UserSignUp from '../controllers/consultants/register.controller';
import UserLogin from '../controllers/consultants/login.controller';
import UniCourses from '../controllers/consultants/uni-courses.controller';

const router = express.Router();

router.post('/register', async (req, res) => {
  let {email, password} = req.body;
  let consultantSignUp = new UserSignUp(email, password);
  const register = await consultantSignUp.register();
  return res.json(register);
});

router.post('/login', async (req, res) => {
  let {email, password} = req.body;
  let consultantLogin = new UserLogin(email, password);
  const login = await consultantLogin.login();
  return res.json(login);
});

router.post('/search', async (req, res) => {
  let {searchQuery} = req.body;
  let uniCourses = new UniCourses();
  const search = await uniCourses.searchUniCourses(searchQuery);
  const inner_hits = search.hits;
  return res.json(inner_hits);
});

export default router;

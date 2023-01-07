import * as express from 'express';
import consultantRouter from './consultant.router';
import studentRouter from './student.router';
import universityRouter from './university.router';

const router = express.Router();

router.get('/', (req, res) => {
  return res.send('Application is running!');
});
/**
 * define your routes over here
 * router.get('/universities', universitiesController);
 */
router.use('/consultant', consultantRouter);
router.use('/student', studentRouter);
router.use('/university', universityRouter);

export default router;

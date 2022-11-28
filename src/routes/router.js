import * as express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  return res.send('Application is running!');
});
/**
 * define your routes over here
 * router.get('/universities', universitiesController);
 */

 export default router;

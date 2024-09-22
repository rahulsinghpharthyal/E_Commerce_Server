import { Router } from 'express';
import logDetails from '../../models/log.js';
 
const router = Router();


router.get('/logs', async (req, res) => {
    const logs = await logDetails.find();
    // console.log('this is logs', logs);
   return res.status(200).json({success: true, Data: logs});
});


export default router;



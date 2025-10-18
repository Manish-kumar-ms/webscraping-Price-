import express from 'express';
import { AddUrl, getPrices, scrapeNow } from '../controller/AddUrl.controller.js';


const router = express.Router();

router.post('/target', AddUrl);
router.post('/scrape-now', scrapeNow);
router.get('/prices', getPrices);

export default router;
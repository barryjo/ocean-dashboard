/**
 * router to handle all brizo related routes
 */
import express from 'express';
import { Sheets } from '../api';

require('dotenv').config()
const router = express.Router();
const api = new Sheets(process.env.SHEET_ID, process.env.CLIENT_EMAIL, process.env.PRIV_KEY);

router.get('/',
  async (req, res, next) => {
    try {
      let apps = await api.getAllOapps();
      console.log(apps)
      res.status(200).json({ apps });

    }
    catch (error) {
      next(new Error(error));
    }
  });


export default router;

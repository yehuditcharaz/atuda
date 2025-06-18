import express from 'express';
import path from 'path';
import fs from 'fs';
import { APP, Paths } from './config.js'; 
import { createFeedbackReportFromRows } from'./create_feedback.js';

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', APP.ACCESS_URL);
    next();
});

app.get(Paths.ROUTE, async (req, res) => {
    let result = await createFeedbackReportFromRows(Paths.EXCEL_FILE);
    if (result === Paths.FEEDBACK_NOT_FOUND) {
        return res.status(APP.ERROR).json({ error: Paths.FEEDBACK_NOT_FOUND }); 
    }
    
    const filePath = path.join(Paths.DIRECTORY, Paths.EXCEL_FILE);
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(APP.ERROR).send(Paths.NOT_FOUND+filePath);
    }
});

app.listen(APP.PORT, APP.HOST, () => {
    console.log(`Server running at http://${APP.HOST}:${APP.PORT}/`);
});

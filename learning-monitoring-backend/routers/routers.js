const express = require('express');
const login = require('./auth');
const attachmentRouter = require('./attachment');
const configRouter = require('./config');
const attendanceRouter = require('./attendance-report');
const codeReviewRouter = require('./code-review');
const userRouter = require('./users');
const progressRouter = require('./progress-tracking');
const statusRouter = require('./status');
const taskRouter = require('./task');
const feedbackRouter = require('./feedback');
const taskNotesRouter = require('./task-notes');
const graphsRouter = require('./graphs');
const generalInformationRouter=require('./general-information');
const notificationsRouter=require('./notifications');
const evaluationsRouter=require('./evaluations');
const tasksFeedback = require('./tasks-feedback');
const auth = require('../auth/auth-middleware');

const router = express.Router();


router.use('/auth', login);
router.use('',auth);
router.use('/attachment', attachmentRouter);
router.use('/config', configRouter);
router.use('/attendance', attendanceRouter);
router.use('/codeReview', codeReviewRouter);
router.use('/user', userRouter);
router.use('/progress_trackings', progressRouter);
router.use('/status', statusRouter);
router.use('/task', taskRouter);
router.use('/feedback', feedbackRouter);
router.use('/taskNotes', taskNotesRouter);
router.use('/graphs', graphsRouter);
router.use('/generalInformation',generalInformationRouter);
router.use('/notifications',notificationsRouter);
router.use('/evaluations',evaluationsRouter);
router.use('/tasks_feedback', tasksFeedback);

module.exports = router;
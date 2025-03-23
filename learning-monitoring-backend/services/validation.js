const config = require('../config/config');

function validateRequired(tableName, obj) {

    let required = {};
    const tableConfig = config.find(table => table.table_name === tableName);

    tableConfig['columns'].forEach(column => (
        column.type.includes('NOT NULL') ? (obj[column['name']] && obj[column['name']] !== null && obj[column['name']] !== '') ? '' : required[column.name] = `${column.name} is required` : ''
    ));
    return required;
}

function validateStrongPassword(password) {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@#$!%?&]{8,}$/;
    return passwordRegex.test(password) ? '' : 'A password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character. '
}

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) ? '' : 'Invalid email address '
}

function validatePhoneNumber(phone) {
    const phoneRegex = /^\+?(\d{1,4}[\s-]?)?\(?\d{1,4}\)?[\s-]?\d{1,4}[\s-]?\d{1,9}$/;
    return phoneRegex.test(phone) ? '' : 'Invalid phone number format ';
}

function validateIntegerNumber(number) {
    const regex = /^\d+$/;
    return regex.test(number) ? '' : 'Invalid number '
}


function validateDate(date) {
    const pattern = /^\d{4}-\d{2}-\d{2}$/;
    return pattern.test(date) ? '' : 'Date must be in YYYY-MM-DD format '
}

function validateTime(time) {
    const regexPattern = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    return regexPattern.test(time) ? '' : 'Time should be in HH:MM format ';
}

function validateRating(number) {
    const regex = /^[1-6]$/;
    return regex.test(number) ? '' : 'Number does not match '
}

function validateBoolean(value) {
    return ((typeof value === 'boolean') ||
        (value === 'true' || value === 'false' || value === 1 || value === 0)) ? '' : false;
}

function validateUsersTable(obj, mode) {
    let required;
    if (mode === "create") required = validateRequired('users', obj)
    else required = {}
    if (Object.keys(required).length === 0) {
        let validate = {
            password: obj.password ? validateStrongPassword(obj.password) : '',
            email: obj.email ? validateEmail(obj.email) : '',
            phone: obj.phone ? validatePhoneNumber(obj.phone) : '',
            role: obj.role ? ['מנהל', 'מנטור', 'מוכשרת'].includes(obj.role) ? '' : 'Incorrect role ' : ''
        };
        if (obj.role === 'מוכשרת') {
            validate.mentor_id = obj.mentor_id ? validateIntegerNumber(obj.mentor_id) : '';
            validate.start_date = obj.start_date ? validateDate(obj.start_date) : '';
            validate.profile = obj.profile ? ['פרופיל א', 'פרופיל ב', 'לא פעילה'].includes(obj.profile) ? '' : 'Invalid profile ' : '';
        }
        return validate;
    }
    else return required;
}

function validateTasksTable(obj, mode) {
    let required;
    if (mode === "create") required = validateRequired('tasks', obj)
    else required = {}
    if (Object.keys(required).length === 0) {
        const validate = {
            duration_days: obj.duration_days ? validateIntegerNumber(obj.duration_days) : ''
        };
        return validate;
    }
    else return required;
}


function validateProgressTrackingsTable(obj, mode) {
    let required;
    if (mode === "create") required = validateRequired('progress_trackings', obj)
    else required = {}
    if (Object.keys(required).length === 0) {
        const validate = {
            trainig_student_id: obj.trainig_student_id ? validateIntegerNumber(obj.trainig_student_id) : '',
            mentor_id: obj.mentor_id ? validateIntegerNumber(obj.mentor_id) : '',
            task_id: obj.task_id ? validateIntegerNumber(obj.task_id) : '',
            start_date: obj.start_date ? validateDate(obj.start_date) : '',
            end_date: obj.end_date ? validateDate(obj.end_date) : '',
            execution_level: obj.execution_level ? validateRating(obj.execution_level) : '',
            comprehension_rate: obj.comprehension_rate ? validateRating(obj.comprehension_rate) : '',
            communication_frequency: obj.communication_frequency ? validateRating(obj.communication_frequency) : '',
            response_to_code_review: obj.response_to_code_review ? validateRating(obj.response_to_code_review) : '',
            serving_speed: obj.serving_speed ? validateRating(obj.serving_speed) : '',
            drawing_conclusions: obj.drawing_conclusions ? validateRating(obj.drawing_conclusions) : '',
            done: obj.done ? validateBoolean(obj.done) : ''
        };
        return validate;
    }
    else return required;
}


function validateCodeReviewsTable(obj, mode) {
    let required;
    if (mode === "create") required = validateRequired('code_reviews', obj)
    else required = {}
    if (Object.keys(required).length === 0) {
        const validate = {
            task_id: obj.task_id ? validateIntegerNumber(obj.task_id) : '',
            mentor_id: obj.mentor_id ? validateIntegerNumber(obj.mentor_id) : '',
            tag: obj.tag ? ['נפוץ', 'חובה', 'בונוס', 'חשוב'].includes(obj.tag) ? '' : 'Invalid tag ' : '',
            date: obj.date ? validateDate(obj.date) : ''
        };
        return validate;
    }
    else return required;

}

function validateAttachmentsTable(obj, mode) {
    let required;
    if (mode === "create") required = validateRequired('attachments', obj)
    else required = {}
    if (Object.keys(required).length === 0) {
        const validate = {
            task_id: obj.task_id ? validateIntegerNumber(obj.task_id) : ''
        };

        return validate;
    }
    else return required;
}
function validateStatusesTable(obj, mode) {
    let required;
    if (mode === "create") required = validateRequired('statuses', obj)
    else required = {}
    if (Object.keys(required).length === 0) {
        const validate = {
            trainig_student_id: obj.trainig_student_id ? validateIntegerNumber(obj.trainig_student_id) : '',
            date: obj.date ? validateDate(obj.date) : ''
        };

        return validate;
    }
    else return required;
}


function validateAttendanceReportsTable(obj, mode) {
    let required;
    if (mode === "create") required = validateRequired('attendance_reports', obj)
    else required = {}
    if (Object.keys(required).length === 0) {
        const validate = {
            trainig_student_id: obj.trainig_student_id ? validateIntegerNumber(obj.trainig_student_id) : '',
            date: obj.date ? validateDate(obj.date) : '',
            entry1: obj.entry1 ? validateTime(obj.entry1) : '',
            exit1: obj.exit1 ? validateTime(obj.exit1) : '',
            entry2: obj.entry2 ? validateTime(obj.entry2) : '',
            exit2: obj.exit2 ? validateTime(obj.exit2) : '',
            entry3: obj.entry3 ? validateTime(obj.entry3) : '',
            exit3: obj.exit3 ? validateTime(obj.exit3) : '',
            training_hour: obj.training_hour ? validateTime(obj.training_hour) : '',
            team_hour: obj.team_hour ? validateTime(obj.team_hour) : ''
        };

        return validate;
    }
    else return required;
}


function validateFeedbacksTable(obj, mode) {
    let required;
    if (mode === "create") required = validateRequired('feedbacks', obj)
    else required = {}
    if (Object.keys(required).length === 0) {
        const validate = {
            trainig_student_id: obj.trainig_student_id ? validateIntegerNumber(obj.trainig_student_id) : '',
            writer_id: obj.writer_id ? validateIntegerNumber(obj.writer_id) : ''
        };
        return validate;
    }
    else return required;
}


function validateTaskNotesTable(obj, mode) {
    let required;
    if (mode === "create") required = validateRequired('task_notes', obj)
    else required = {}
    if (Object.keys(required).length === 0) {
        const validate = {
            task_id: obj.task_id ? validateIntegerNumber(obj.task_id) : '',
            written_id: obj.written_id ? validateIntegerNumber(obj.written_id) : ''
        };

        return validate;
    }
    else return required;
}


function validateEvaluationsTable(obj, mode) {
    let required;
    if (mode === "create") required = validateRequired('evaluations', obj)
    else required = {}
    if (Object.keys(required).length === 0) {
        const validate = {
            trainig_student_id: obj.trainig_student_id ? validateIntegerNumber(obj.trainig_student_id) : '',
            writer_id: obj.writer_id ? validateIntegerNumber(obj.writer_id) : '',
            date: obj.date ? validateDate(obj.date) : '',
            professionalism: obj.professionalism ? validateRating(obj.professionalism) : '',
            conduct: obj.conduct ? validateRating(obj.conduct) : '',
            independence: obj.independence ? validateRating(obj.independence) : '',
            knowledge_sharing: obj.knowledge_sharing ? validateRating(obj.knowledge_sharing) : '',
            pace: obj.pace ? validateRating(obj.pace) : '',
            speed_of_integration: obj.speed_of_integration ? validateRating(obj.speed_of_integration) : '',
            quality_of_integration: obj.quality_of_integration ? validateRating(obj.quality_of_integration) : ''
        };
        return validate;
    }
    else return required;
}

function validateGraphsTable(obj, mode) {
    let required;
    if (mode === "create") required = validateRequired('graphs', obj)
    else required = {}
    if (Object.keys(required).length === 0) {
        const validate = {
            date: obj.date ? validateDate(obj.date) : '',
            owner_id: obj.owner_id ? validateIntegerNumber(obj.owner_id) : '',
            training_student_id: obj.training_student_id ? validateIntegerNumber(obj.training_student_id) : '',
            display_for_training_student: obj.display_for_training_student ? validateBoolean(obj.display_for_training_student) : ''
        };
        return validate;
    }
    else return required;

}

function validateGeneralInformationTable(obj, mode) {
    let required;
    if (mode === "create") required = validateRequired('general_informations', obj)
    else required = {}
    if (Object.keys(required).length === 0) {
        const validate = {
            task_id: obj.task_id ? validateIntegerNumber(obj.task_id) : '',
            information_for: obj.information_for ? ['מנטור', 'מוכשרת'].includes(obj.information_for) ? '' : 'Incorrect role ' : '',
        };
        return validate;
    }
    else return required;
}


module.exports = {
    validateUsersTable,
    validateTasksTable,
    validateProgressTrackingsTable,
    validateCodeReviewsTable,
    validateAttachmentsTable,
    validateStatusesTable,
    validateAttendanceReportsTable,
    validateFeedbacksTable,
    validateTaskNotesTable,
    validateGeneralInformationTable,
    validateEvaluationsTable,
    validateGraphsTable
}
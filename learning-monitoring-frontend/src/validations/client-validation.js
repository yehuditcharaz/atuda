import validator from 'validator';
import { getData } from '../services/axios';

export function validateEmptyString(string) {
  return (['', undefined, null].includes(string) ? 'מחרוזת ריקה' : '')
}

function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) ? '' : 'כתובת מייל לא חוקית'
}

function validatePhoneNumber(phone) {
  const phoneRegex = /^\+?(\d{1,4}[\s-]?)?\(?\d{1,4}\)?[\s-]?\d{1,4}[\s-]?\d{1,9}$/;
  return phoneRegex.test(phone) ? '' : 'פורמט מספר טלפון לא חוקי';
}

function validateString(string) {
  return string.includes("'") ? "מחרוזת לא יכולה לכלול את התו '" : '';
}

function validateDate(date) {
  return !isNaN(Date.parse(date)) ? '' : 'פורמט תאריך לא חוקי';
}

export function validateUrl(url) {
  return url === null ? 'מחרוזת ריקה' : validator.isURL(url) ? '' : 'לא חוקי URL פורמט';
}

function isStrongPassword(password) {
  if (typeof password != 'string' || password.trim() === '') {
    return 'סיסמה חייבת להיות מחרוזת ולא ריקה'
  }
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= 8;

  return (hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar && isLongEnough) ? '' : 'סיסמה חייבת להיות באורך 8 תווים לפחות, לכלול אות גדולה, אות קטנה, מספר ותו מיוחד ';
}

export async function validateUser(data, mode) {
  const response = await getData('user/read');
  if (mode === 'reset-password') {
    const ans = {
      password: isStrongPassword(data.password) + (response.data.map(value => value.password === data.password).some(element => element === true) ? 'סיסמה חייבת להיות ייחודית' : '')
    }
    return ans;
  }
  const ans = {
    phone: validatePhoneNumber(data.phone),
    email: validateEmail(data.email) + (mode === 'create' ? response.data.map(value => value.email === data.email).some(element => element === true) ? 'כתובת מייל חייבת להיות ייחודית' : '' : ''),
    role: mode === 'create' ? (['מנהל', 'מנטור', 'מוכשרת'].includes(data.role)) ? '' : 'תפקיד לא תקין' : '',
    password: mode === 'create' ? response.data.map(value => value.password === data.password).some(element => element === true) ? 'סיסמה חייבת להיות ייחודית' : '' + isStrongPassword(data.password) : ''
  }

  if (data.role === 'מוכשרת') {
    ans.mentor_id = data.mentor_id == undefined ? 'שם מנטורית לא תקין' : '';
    ans.profile = (['פרופיל א', 'פרופיל ב', 'לא פעילה'].includes(data.profile)) ? '' : 'פרופיל לא תקין';
  }
  return ans;
}

export async function validateTask(data) {
  const response = await getData('task/read');
  const ans = {
    label: response.data.map(value => value.label === data.label).some(element => element === true) ? 'שם חייב להיות ייחודי' : '',
  }
  if (data.github_link != undefined) {
    ans.githubLink = validateUrl(data.github_link);
  }
  return ans;
}

export async function validateProgressTracking(data) {
  const ans = {
    start_date: validateDate(data.start_date)
  }
  if (data.end_date != null) {
    ans.end_date = validateDate(data.end_date);
  }
  return ans
}

export async function validateCodeReview(data) {
  const ans = {
    sentence: validateString(data.sentence)
  }
  return ans;
}
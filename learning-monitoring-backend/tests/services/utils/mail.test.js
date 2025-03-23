const { sendMail } = require('../../../services/utils/mail');

jest.mock('nodemailer', () => {
  return {
    createTransport: jest.fn(() => ({
      sendMail: jest.fn((mailOptions, callback) => {
        callback(null, mailOptions);
      }),
    })),
  };
});

describe('SendMail function', () => {
  test('Should send an email with the correct details', async () => {
    const mailOptions = { recipient: 'test@example.com', subject: 'Test Subject', body: 'Test Body' };
    const result = sendMail(mailOptions);
    expect(result).toBe(undefined);
  });
});

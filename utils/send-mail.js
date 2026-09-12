import { emailTemplates } from './email-template.js';
import dayjs from 'dayjs';
import { transporter, accountEmail } from '../config/nodeMailer.js';

export const sendReminderEmail = async ({ to, type, subscription }) => {
  if (!to || !type) {
    throw new Error('Missing required parameters');
  }

  const template = emailTemplates.find((t) => t.label === type);

  if (!template) {
    throw new Error(`Invalid email type: ${type}`);
  }

  const mailInfo = {
    userName: subscription.user.name,
    subscriptionName: subscription.name,
    renewalDate: dayjs(subscription.renewalDate).format('MMM D, YYYY'),
    planName: subscription.name,
    price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
    paymentMethod: subscription.paymentMethod,
  };

  const message = template.generateBody(mailInfo);
  const subject = template.generateSubject(mailInfo);

  const mailOptions = {
    from: accountEmail,
    to,
    subject,
    html: message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent:', info.messageId);
    console.log('Response:', info.response);

    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
    };
  } catch (error) {
    console.error('Error sending email:', error);

    throw error;
  }
};
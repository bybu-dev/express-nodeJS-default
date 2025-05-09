/** @jest-environment node */

import EmailRepository from '@/repositories/notification';
import { IEmailTem } from '@/repositories/notification/template';
import nodemailer from 'nodemailer';

// jest.mock('nodemailer');
const createTransportMock = jest.fn();
(nodemailer as any).createTransport = createTransportMock;

describe('EmailRepository', () => {
  const sendMailMock = jest.fn();

  beforeEach(() => {
    sendMailMock.mockReset();
    createTransportMock.mockReturnValue({
      sendMail: sendMailMock,
    });
  });

  it('should send an email with correct details', async () => {
    const emailRepo = new EmailRepository();

    const mockTemplate: IEmailTem = {
      subject: 'Test Subject',
      html: '<p>Test HTML content</p>',
    };

    const recipientEmail = 'recipient@example.com';

    await emailRepo.sendEmail(recipientEmail, mockTemplate);

    expect(sendMailMock).toHaveBeenCalledWith(
      {
        from: '',
        to: recipientEmail,
        subject: mockTemplate.subject,
        html: mockTemplate.html,
      },
      expect.any(Function)
    );
  });
});

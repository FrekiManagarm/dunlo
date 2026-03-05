interface EmailTemplateData {
  customerName: string;
  amount: string;
  currency: string;
  updatePaymentUrl?: string;
}

interface EmailTemplate {
  subject: string;
  html: string;
}

const FAILURE_TEMPLATES: Record<
  string,
  Record<number, (data: EmailTemplateData) => EmailTemplate>
> = {
  card_expired: {
    1: (data) => ({
      subject: `Your card has expired — update it to keep your subscription`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">Hi ${data.customerName},</p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">We tried to process your payment of <strong>${data.amount}</strong>, but your card on file has expired.</p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">To avoid any interruption, please update your payment method:</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${data.updatePaymentUrl}" style="background-color: #0f172a; color: #ffffff; padding: 12px 32px; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 0;">Update payment method</a>
          </div>
          <p style="color: #6b7280; font-size: 13px; line-height: 1.6;">If you've already updated your card, you can safely ignore this email.</p>
        </div>
      `,
    }),
    2: (data) => ({
      subject: `Reminder: your card needs to be updated`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">Hi ${data.customerName},</p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">Just a quick follow-up — your payment of <strong>${data.amount}</strong> is still pending because your card has expired.</p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">It only takes a minute to update:</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${data.updatePaymentUrl}" style="background-color: #0f172a; color: #ffffff; padding: 12px 32px; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 0;">Update your card</a>
          </div>
          <p style="color: #6b7280; font-size: 13px; line-height: 1.6;">We want to make sure you don't lose access to your account.</p>
        </div>
      `,
    }),
    3: (data) => ({
      subject: `Final notice: update your card to keep your subscription`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">Hi ${data.customerName},</p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">This is our last reminder about your pending payment of <strong>${data.amount}</strong>.</p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">Your card on file has expired and we haven't been able to process the charge. Without an update, your subscription may be canceled.</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${data.updatePaymentUrl}" style="background-color: #dc2626; color: #ffffff; padding: 12px 32px; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 0;">Update payment method now</a>
          </div>
          <p style="color: #6b7280; font-size: 13px; line-height: 1.6;">Need help? Just reply to this email.</p>
        </div>
      `,
    }),
  },

  insufficient_funds: {
    1: (data) => ({
      subject: `Your recent payment couldn't be processed`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">Hi ${data.customerName},</p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">We attempted to charge <strong>${data.amount}</strong> to your card, but the payment was declined.</p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">This sometimes happens when a card has a temporary hold or low balance. We'll retry automatically, but you can also update your payment method:</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${data.updatePaymentUrl}" style="background-color: #0f172a; color: #ffffff; padding: 12px 32px; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 0;">Update payment method</a>
          </div>
        </div>
      `,
    }),
    2: (data) => ({
      subject: `Your payment is still pending — action needed`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">Hi ${data.customerName},</p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">We still haven't been able to process your payment of <strong>${data.amount}</strong>.</p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">Please update your payment method or ensure sufficient funds are available:</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${data.updatePaymentUrl}" style="background-color: #0f172a; color: #ffffff; padding: 12px 32px; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 0;">Fix payment</a>
          </div>
        </div>
      `,
    }),
    3: (data) => ({
      subject: `Last chance to update your payment`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">Hi ${data.customerName},</p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">Your payment of <strong>${data.amount}</strong> has failed multiple times. Without an update, your subscription may be canceled soon.</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${data.updatePaymentUrl}" style="background-color: #dc2626; color: #ffffff; padding: 12px 32px; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 0;">Update payment now</a>
          </div>
          <p style="color: #6b7280; font-size: 13px; line-height: 1.6;">If you're having trouble, reply to this email and we'll help.</p>
        </div>
      `,
    }),
  },

  authentication_required: {
    1: (data) => ({
      subject: `Action required: authenticate your payment`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">Hi ${data.customerName},</p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">Your bank requires additional authentication to process your payment of <strong>${data.amount}</strong>.</p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">Please complete the authentication to keep your subscription active:</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${data.updatePaymentUrl}" style="background-color: #0f172a; color: #ffffff; padding: 12px 32px; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 0;">Authenticate payment</a>
          </div>
        </div>
      `,
    }),
    2: (data) => ({
      subject: `Reminder: your payment needs authentication`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">Hi ${data.customerName},</p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">Your payment of <strong>${data.amount}</strong> still requires authentication from your bank (3D Secure).</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${data.updatePaymentUrl}" style="background-color: #0f172a; color: #ffffff; padding: 12px 32px; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 0;">Complete authentication</a>
          </div>
        </div>
      `,
    }),
    3: (data) => ({
      subject: `Final notice: authenticate your payment to avoid cancellation`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">Hi ${data.customerName},</p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">This is our final reminder. Your payment of <strong>${data.amount}</strong> requires 3D Secure authentication.</p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">Without completing authentication, your subscription will be canceled.</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${data.updatePaymentUrl}" style="background-color: #dc2626; color: #ffffff; padding: 12px 32px; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 0;">Authenticate now</a>
          </div>
        </div>
      `,
    }),
  },
};

/**
 * Fallback template for unknown failure codes
 */
const DEFAULT_TEMPLATES: Record<number, (data: EmailTemplateData) => EmailTemplate> = {
  1: (data) => ({
    subject: `Your recent payment failed — action needed`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <p style="color: #374151; font-size: 15px; line-height: 1.6;">Hi ${data.customerName},</p>
        <p style="color: #374151; font-size: 15px; line-height: 1.6;">We were unable to process your payment of <strong>${data.amount}</strong>. Please update your payment method to continue:</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${data.updatePaymentUrl}" style="background-color: #0f172a; color: #ffffff; padding: 12px 32px; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 0;">Update payment method</a>
        </div>
      </div>
    `,
  }),
  2: (data) => ({
    subject: `Reminder: your payment is still pending`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <p style="color: #374151; font-size: 15px; line-height: 1.6;">Hi ${data.customerName},</p>
        <p style="color: #374151; font-size: 15px; line-height: 1.6;">Your payment of <strong>${data.amount}</strong> is still pending. Please update your payment method:</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${data.updatePaymentUrl}" style="background-color: #0f172a; color: #ffffff; padding: 12px 32px; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 0;">Fix payment</a>
        </div>
      </div>
    `,
  }),
  3: (data) => ({
    subject: `Final notice: update your payment to avoid cancellation`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <p style="color: #374151; font-size: 15px; line-height: 1.6;">Hi ${data.customerName},</p>
        <p style="color: #374151; font-size: 15px; line-height: 1.6;">This is our last attempt to reach you about your pending payment of <strong>${data.amount}</strong>. Your subscription may be canceled if the payment isn't resolved.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${data.updatePaymentUrl}" style="background-color: #dc2626; color: #ffffff; padding: 12px 32px; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 0;">Update payment now</a>
        </div>
      </div>
    `,
  }),
};

export function getEmailTemplate(
  failureReason: string,
  step: number,
  data: EmailTemplateData,
): EmailTemplate {
  const reasonTemplates = FAILURE_TEMPLATES[failureReason];
  const templateFn = reasonTemplates?.[step] ?? DEFAULT_TEMPLATES[step];

  if (!templateFn) {
    return DEFAULT_TEMPLATES[1]!(data);
  }

  return templateFn(data);
}

/**
 * Build the escalation alert email for the founder
 */
export function getEscalationAlertTemplate(data: {
  customerName: string;
  customerEmail: string;
  amount: string;
  failureReason: string;
  daysSinceDetection: number;
  emailsSent: number;
}): EmailTemplate {
  return {
    subject: `🚨 Escalation: ${data.customerName} (${data.amount}/mo) needs your attention`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 16px 20px; margin-bottom: 24px;">
          <p style="color: #991b1b; font-size: 14px; font-weight: 600; margin: 0;">High-value account needs manual intervention</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #374151;">
          <tr><td style="padding: 8px 0; font-weight: 600;">Customer</td><td style="padding: 8px 0;">${data.customerName} (${data.customerEmail})</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600;">Amount</td><td style="padding: 8px 0;">${data.amount}/mo</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600;">Failure reason</td><td style="padding: 8px 0;">${data.failureReason}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600;">Days since detection</td><td style="padding: 8px 0;">${data.daysSinceDetection} days</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600;">Emails sent</td><td style="padding: 8px 0;">${data.emailsSent} (all 3 steps completed)</td></tr>
        </table>

        <p style="color: #6b7280; font-size: 13px; margin-top: 24px; line-height: 1.6;">
          The automated recovery sequence is complete. This account requires direct outreach from you.
        </p>
      </div>
    `,
  };
}

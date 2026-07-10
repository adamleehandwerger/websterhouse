import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { unit, startDate, endDate, phone } = await req.json();

  const unitLabel = unit === 'upper' ? 'Upper Unit' : 'Lower Unit';
  const dateRange = startDate
    ? `${startDate}${endDate ? ` to ${endDate}` : ' (start only)'}`
    : 'dates not specified';

  const body =
    `New Webster House inquiry!\n` +
    `Unit: ${unitLabel}\n` +
    `Dates: ${dateRange}\n` +
    `Guest phone: ${phone}`;

  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  const to = process.env.OWNER_PHONE ?? '+15039449019';

  if (sid && token && from) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const twilio = require('twilio');
      const client = twilio(sid, token);
      await client.messages.create({ body, from, to });
    } catch (err) {
      console.error('[Twilio] SMS failed:', err);
      // Still return success so the guest sees the thank-you page
    }
  } else {
    // Dev mode — log to console instead of sending SMS
    console.log('\n--- SMS notification (dev mode) ---');
    console.log(body);
    console.log('To:', to);
    console.log('-----------------------------------\n');
  }

  return NextResponse.json({ ok: true });
}

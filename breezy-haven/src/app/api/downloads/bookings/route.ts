import { Auth } from '@/features/auth';
import { staffBookingService } from '@/services';
import { NextResponse, type NextRequest } from 'next/server';
import { EOL } from 'os';
import { Readable } from 'stream';

export async function GET(request: NextRequest) {
  await Auth.staff.ensureStaffIsAuthenticatedFromRequestAsync(request);
  const { data: bookings, errors } = await staffBookingService.getAll();

  if (errors) return NextResponse.json({}, { status: 400 });

  const result = [
    'id,created_at,startDate,endDate,numNights,numGuests,cabinPrice,extrasPrice,totalPrice,status,hasBreakfast,isPaid,observations,cabinId,guestId' +
      EOL,
  ];

  bookings.forEach(booking => {
    const item =
      [
        escapeCSV(booking.id),
        escapeCSV(booking.created_at),
        escapeCSV(booking.startDate),
        escapeCSV(booking.endDate),
        escapeCSV(booking.numNights),
        escapeCSV(booking.numGuests),
        escapeCSV(booking.cabinPrice),
        escapeCSV(booking.extrasPrice),
        escapeCSV(booking.totalPrice),
        escapeCSV(booking.status),
        escapeCSV(booking.hasBreakfast),
        escapeCSV(booking.isPaid),
        escapeCSV(booking.observations),
        escapeCSV(booking.cabinId),
        escapeCSV(booking.guestId),
      ].join(',') + EOL;
    result.push(item);
  });

  const resultStream = Readable.toWeb(Readable.from(result)) as ReadableStream;

  return new NextResponse(resultStream, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="bookings.csv"',
    },
  });
}

function escapeCSV(value: unknown): string {
  if (value == null) return '';
  const str = String(value);
  if (/[",\r\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

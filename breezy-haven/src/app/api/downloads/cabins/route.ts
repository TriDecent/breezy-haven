import { Auth } from '@/features/auth';
import { staffCabinService } from '@/services';
import { NextResponse, type NextRequest } from 'next/server';
import { EOL } from 'os';
import { Readable } from 'stream';

export async function GET(request: NextRequest) {
  await Auth.staff.ensureStaffIsAuthenticatedFromRequestAsync(request);
  const { data: cabins, errors } = await staffCabinService.getAll();

  if (errors) return NextResponse.json({}, { status: 400 });

  const result = [
    'id,created_at,name,description,discount,image,maxCapacity,regularPrice' +
      EOL,
  ];

  cabins.forEach(cabin => {
    const item =
      [
        escapeCSV(cabin.id),
        escapeCSV(cabin.created_at),
        escapeCSV(cabin.name),
        escapeCSV(cabin.description),
        escapeCSV(cabin.discount),
        escapeCSV(cabin.image),
        escapeCSV(cabin.maxCapacity),
        escapeCSV(cabin.regularPrice),
      ].join(',') + EOL;
    result.push(item);
  });

  const resultStream = Readable.toWeb(Readable.from(result)) as ReadableStream;

  return new NextResponse(resultStream, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="cabins.csv"',
    },
  });
}

function escapeCSV(value: unknown): string {
  if (value == null) return '';
  const str = String(value);
  if (/[",\r\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

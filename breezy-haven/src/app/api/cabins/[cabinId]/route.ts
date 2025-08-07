import { bookingService, cabinService } from '@/services';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cabinId: string }> }
): Promise<Response> {
  const { cabinId } = await params;

  try {
    const cabinIdNumber = Number(cabinId);
    if (Number.isNaN(cabinIdNumber)) throw new Error('id is not valid');

    const promises = [
      cabinService.getById(cabinIdNumber),
      bookingService.getBookedDatesByCabinId(cabinIdNumber),
    ];

    const [cabinResult, bookingResult] = await Promise.all(promises);

    return cabinResult.error || bookingResult.error
      ? Response.json({ cabinResult, bookingResult }, { status: 404 })
      : Response.json({ cabinResult, bookingResult });
  } catch (e) {
    if (e instanceof Error) {
      return Response.json({ message: e.message }, { status: 400 });
    }
    return Response.json(
      { message: 'An unknown error occurred.' },
      { status: 400 }
    );
  }
}

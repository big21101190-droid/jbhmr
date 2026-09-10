import { revalidatePath } from 'next/cache';
import { requireAdminApi } from '@/lib/auth';
import type { LandingInput } from '@/lib/domain';
import { LandingValidationError } from '@/lib/landing-validation';
import { listLandings, saveLanding } from '@/lib/landing-store';

export const dynamic = 'force-dynamic';

function errorResponse(error: unknown) {
  if (error instanceof Response) return error;
  if (error instanceof LandingValidationError) {
    return Response.json(
      {
        error: error.message,
        field: error.field,
        existing: error.existing
          ? {
              id: error.existing.id,
              title: error.existing.title,
              slug: error.existing.slug,
            }
          : null,
      },
      { status: error.existing ? 409 : 400 },
    );
  }
  console.error(error);
  return Response.json(
    { error: '요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.' },
    { status: 500 },
  );
}

export async function GET() {
  try {
    await requireAdminApi();
    return Response.json({
      landings: await listLandings({ includeArchived: true }),
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminApi();
    const input = (await request.json()) as LandingInput;
    const landing = await saveLanding(input);
    revalidatePath('/sitemap.xml');
    revalidatePath(`/delivery/${landing.slug}`);
    return Response.json({ landing }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

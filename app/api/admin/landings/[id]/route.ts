import { revalidatePath } from 'next/cache';
import { requireAdminApi } from '@/lib/auth';
import type { LandingInput } from '@/lib/domain';
import { LandingValidationError } from '@/lib/landing-validation';
import { getLandingById, saveLanding } from '@/lib/landing-store';

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
    { error: '저장 중 오류가 발생했습니다.' },
    { status: 500 },
  );
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminApi();
    const landing = await getLandingById((await params).id);
    if (!landing)
      return Response.json(
        { error: '랜딩페이지를 찾을 수 없습니다.' },
        { status: 404 },
      );
    return Response.json({ landing });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminApi();
    const id = (await params).id;
    const previous = await getLandingById(id);
    if (!previous)
      return Response.json(
        { error: '랜딩페이지를 찾을 수 없습니다.' },
        { status: 404 },
      );
    const patch = (await request.json()) as Partial<LandingInput>;
    const landing = await saveLanding({ ...previous, ...patch, id });
    revalidatePath('/sitemap.xml');
    revalidatePath(`/delivery/${previous.slug}`);
    revalidatePath(`/delivery/${landing.slug}`);
    return Response.json({ landing });
  } catch (error) {
    return errorResponse(error);
  }
}

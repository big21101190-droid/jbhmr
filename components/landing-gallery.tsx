import type { LandingImage } from '@/lib/domain';

export function LandingGallery({
  images,
  keyword,
}: {
  images: LandingImage[];
  keyword: string;
}) {
  if (!images.length) return null;
  return (
    <section
      className="bg-white px-5 pt-14 sm:pt-20"
      aria-label="본문 상단 이미지"
    >
      <div
        className={`mx-auto grid gap-4 ${images.length === 1 ? 'max-w-[760px]' : 'max-w-[1040px] sm:grid-cols-2'} ${images.length === 3 ? 'lg:grid-cols-3' : ''}`}
      >
        {images.map((image, index) => (
          <figure key={`${image.url}-${index}`} className="min-w-0">
            <img
              src={image.url}
              alt={image.alt || `${keyword} 이미지 ${index + 1}`}
              className="aspect-[4/3] w-full rounded-2xl bg-[#edf3fb] object-contain shadow-[0_12px_35px_rgba(16,36,62,.10)]"
            />
            {image.caption ? (
              <figcaption className="mt-2 text-sm text-[#667085]">
                {image.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    </section>
  );
}

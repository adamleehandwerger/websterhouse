import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function folderFor(unit: string) {
  return `websterhouse/${unit}`;
}

// ── Upload ──────────────────────────────────────────────────────────────────

export async function uploadPhoto(unit: string, file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: folderFor(unit),
    resource_type: 'image',
  });
  return result.secure_url;
}

export async function uploadReview(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:image/png;base64,${buffer.toString('base64')}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: 'websterhouse/reviews',
    resource_type: 'image',
  });
  return result.secure_url;
}

// ── List ────────────────────────────────────────────────────────────────────

export async function getPhotos(unit: string): Promise<{ url: string; publicId: string }[]> {
  try {
    const [result, order] = await Promise.all([
      cloudinary.api.resources({
        type: 'upload',
        prefix: folderFor(unit),
        max_results: 100,
        resource_type: 'image',
      }),
      getPhotoOrder(unit),
    ]);
    const photos = result.resources.map((r: { secure_url: string; public_id: string }) => ({
      url: r.secure_url,
      publicId: r.public_id,
    }));
    if (!order.length) return photos;
    const ordered = order
      .map((id: string) => photos.find((p: { url: string; publicId: string }) => p.publicId === id))
      .filter(Boolean) as { url: string; publicId: string }[];
    const remaining = photos.filter((p: { url: string; publicId: string }) => !order.includes(p.publicId));
    return [...ordered, ...remaining];
  } catch { return []; }
}

async function getPhotoOrder(unit: string): Promise<string[]> {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: `websterhouse/data/order_${unit}`,
      resource_type: 'raw',
      max_results: 1,
    });
    if (!result.resources.length) return [];
    const res = await fetch(result.resources[0].secure_url, { cache: 'no-store' });
    return await res.json();
  } catch { return []; }
}

export async function savePhotoOrder(unit: string, publicIds: string[]): Promise<void> {
  const dataUri = `data:application/json;base64,${Buffer.from(JSON.stringify(publicIds)).toString('base64')}`;
  await cloudinary.uploader.upload(dataUri, {
    public_id: `websterhouse/data/order_${unit}`,
    resource_type: 'raw',
    overwrite: true,
    invalidate: true,
  });
}

export async function getFirstPhoto(unit: string): Promise<string | null> {
  const photos = await getPhotos(unit);
  return photos[0]?.url ?? null;
}

export async function getReviews(): Promise<{ url: string; publicId: string }[]> {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'websterhouse/reviews',
      max_results: 100,
      resource_type: 'image',
    });
    return result.resources.map((r: { secure_url: string; public_id: string }) => ({
      url: r.secure_url,
      publicId: r.public_id,
    }));
  } catch { return []; }
}

// ── Delete ──────────────────────────────────────────────────────────────────

export async function deleteAsset(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

// ── Blocked dates (still stored as a Cloudinary raw file) ───────────────────

export async function getBlockedDates(): Promise<{ upper: string[]; lower: string[] }> {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'websterhouse/data/blocked_dates',
      resource_type: 'raw',
      max_results: 1,
    });
    if (!result.resources.length) return { upper: [], lower: [] };
    const res = await fetch(result.resources[0].secure_url, { cache: 'no-store' });
    return await res.json();
  } catch { return { upper: [], lower: [] }; }
}

export async function saveBlockedDates(data: { upper: string[]; lower: string[] }): Promise<void> {
  const json = JSON.stringify(data);
  const dataUri = `data:application/json;base64,${Buffer.from(json).toString('base64')}`;
  // Overwrite by using the same public_id each time
  await cloudinary.uploader.upload(dataUri, {
    public_id: 'websterhouse/data/blocked_dates',
    resource_type: 'raw',
    overwrite: true,
    invalidate: true,
  });
}

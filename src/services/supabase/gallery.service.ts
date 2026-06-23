import { createClient } from '@/lib/supabase/client';
import type { GalleryEntry } from '@/types';

const BUCKET = 'gallery';

export const galleryService = {
  async list(babyId: string): Promise<GalleryEntry[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('baby_gallery')
      .select('id, baby_id, month, image_url')
      .eq('baby_id', babyId)
      .order('month', { ascending: true });
    if (error) throw error;
    return (data ?? []).map((row) => ({
      id: row.id,
      babyId: row.baby_id,
      month: row.month,
      imageUrl: row.image_url,
    }));
  },

  async upload(
    userId: string,
    babyId: string,
    month: number,
    file: Blob,
  ): Promise<string> {
    const supabase = createClient();
    const path = `${userId}/${babyId}/month-${month}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: 'image/jpeg', upsert: true });
    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(path);

    const { error: rpcError } = await supabase.rpc('upsert_baby_gallery', {
      p_baby_id: babyId,
      p_month: month,
      p_image_url: publicUrl,
    });
    if (rpcError) throw rpcError;
    return publicUrl;
  },

  async delete(babyId: string, month: number, userId?: string): Promise<void> {
    const supabase = createClient();
    if (userId) {
      const path = `${userId}/${babyId}/month-${month}.jpg`;
      const { error } = await supabase.storage.from(BUCKET).remove([path]);
      if (error) {
        const notFound =
          error.message?.toLowerCase().includes('not found') ||
          (error as { error?: string })?.error === 'Object not found';
        if (!notFound) throw error;
      }
    }
    const { error } = await supabase
      .from('baby_gallery')
      .delete()
      .eq('baby_id', babyId)
      .eq('month', month);
    if (error) throw error;
  },
};

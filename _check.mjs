import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const { data: tours } = await supabase.from('tours').select('id, slug, category, title_es');
console.log('TOURS:', JSON.stringify(tours, null, 2));
const { data: images } = await supabase.from('tour_images').select('id, tour_id, storage_path, is_cover');
console.log('IMAGES:', JSON.stringify(images, null, 2));

-- Seed con datos reales de los 3 tours
insert into public.tours (
  slug, category,
  title_es, title_en,
  description_es, description_en,
  duration_minutes, difficulty, min_age, max_people,
  price_usd, child_price_pct, child_price_usd,
  languages,
  includes, excludes,
  itinerary,
  is_active, display_order
)
values
  (
    'safari-manuel-antonio', 'day_park',
    'Safari terrestre · Parque Nacional Manuel Antonio',
    'Ground safari · Manuel Antonio National Park',
    'Sumérgete en el hermoso bosque tropical húmedo del Parque Nacional Manuel Antonio acompañado de un guía naturalista certificado que te explicará la historia natural y te ayudará a encontrar la increíble fauna del Parque. Te mostrará con detalle cada especie a través de un telescopio profesional, con el cual es posible hacer fotos de muy alta calidad. Después del avistamiento de animales tendrás la oportunidad de relajarte y disfrutar una de las mejores playas de Costa Rica: Playa Manuel Antonio.',
    'Immerse yourself in the beautiful tropical rainforest of Manuel Antonio National Park accompanied by a certified naturalist guide who will explain the natural history and help you find the incredible wildlife of the Park. They will show you every species in detail through a professional telescope, with which you can take high-quality photos. After the wildlife spotting you will have the opportunity to relax and enjoy one of the best beaches in Costa Rica: Manuel Antonio Beach.',
    150, 'moderate', 0, 8,
    65.00, 50, 40.00,
    '{"Español","English"}',
    '{"Guía naturalista certificado ICT","Transporte ida y vuelta","Boleto de ingreso al Parque Nacional Manuel Antonio","Refrigerio","Telescopio profesional"}',
    '{"Alimentación y bebidas","Propinas"}',
    '[{"time":"8:00","title":"Inicio del tour","description":"El pickup se coordina según tu ubicación de hospedaje y te confirmamos la hora al reservar."}]'::jsonb,
    true, 1
  ),
  (
    'caminata-manglar-damas', 'mangrove',
    'Caminata en manglar - Isla Damas',
    'Mangrove walk - Damas Island',
    'La caminata por los senderos de Isla Damas te lleva al corazón del ecosistema de manglar. Caminarás entre raíces aéreas mientras garzas, monos carablanca, cocodrilos y una gran variedad de aves aparecen a tu alrededor. Es una experiencia silenciosa y respetuosa con el entorno ideal para quienes buscan conectar con la naturaleza sin el ruido de la ciudad.',
    'Walking the trails of Damas Island takes you into the heart of the mangrove ecosystem. You will walk among aerial roots while herons, white-faced monkeys, crocodiles and a wide variety of birds appear around you. It is a quiet, nature-honoring experience ideal for those seeking to connect with nature away from the city noise.',
    150, 'easy', 4, 6,
    null, 50, null,
    '{"Español","English"}',
    '{"Guía naturalista certificado ICT","Telescopio profesional","Entrada a Isla Damas","Seguro de responsabilidad civil"}',
    '{"Transporte al punto de encuentro","Alimentación y bebidas","Repelente (traer propio, biodegradable recomendado)","Propinas"}',
    '[{"time":"6:00","title":"Salida desde Quepos","description":"Encuentro en el punto de encuentro. Instrucciones de seguridad y breve introducción al ecosistema del manglar."},{"time":"6:30","title":"Ingreso al sendero del manglar","description":"Caminata por los senderos de Isla Damas. Avistamiento de aves acuáticas, monos y cocodrilos."},{"time":"8:00","title":"Zona de avistamiento intensivo","description":"Recorrido guiado por los senderos entre la vegetación. Observación de fauna con telescopio profesional."},{"time":"9:30","title":"Regreso y cierre","description":"Retorno a Quepos. Café o fresco natural incluido."}]'::jsonb,
    true, 2
  ),
  (
    'caminata-nocturna', 'night_walk',
    'Caminata nocturna',
    'Night jungle walk',
    'Cuando cae la noche, la selva se transforma. Con linternas de luz roja para no alterar la fauna, recorrerás senderos donde ranas de cristal, serpientes, insectos bioluminiscentes y mamíferos nocturnos cobran protagonismo. Tu guía te mostrará un mundo que la mayoría de los visitantes nunca llega a ver.',
    'When night falls, the jungle transforms. Using red-light flashlights to avoid disturbing the wildlife, you will walk trails where glass frogs, snakes, bioluminescent insects and nocturnal mammals take center stage. Your guide will show you a world that most visitors never get to see.',
    120, 'easy', 6, 8,
    null, 50, null,
    '{"Español","English"}',
    '{"Guía naturalista certificado ICT","Linterna frontal y de mano","Seguro de responsabilidad civil"}',
    '{"Transporte al punto de encuentro","Alimentación y bebidas","Repelente (traer propio, biodegradable recomendado)","Propinas"}',
    '[{"time":"17:45","title":"Encuentro en la oficina","description":"Preparación del equipo: linternas frontal y de mano. Briefing de seguridad."},{"time":"18:00","title":"Inicio del recorrido nocturno","description":"Ingreso al sendero. La transición día-noche revela el cambio de guardia entre especies."},{"time":"19:00","title":"Zona de avistamiento intensivo","description":"Búsqueda de anfibios, insectos, serpientes y mamíferos nocturnos. Uso de luz roja para no alterar la fauna."},{"time":"20:00","title":"Cierre y reflexión","description":"Último tramo del sendero. Conversación sobre conservación y el rol de la fauna nocturna."}]'::jsonb,
    true, 3
  )
on conflict (slug) do update set
  category = excluded.category,
  title_es = excluded.title_es,
  title_en = excluded.title_en,
  description_es = excluded.description_es,
  description_en = excluded.description_en,
  duration_minutes = excluded.duration_minutes,
  difficulty = excluded.difficulty,
  min_age = excluded.min_age,
  max_people = excluded.max_people,
  price_usd = excluded.price_usd,
  child_price_pct = excluded.child_price_pct,
  child_price_usd = excluded.child_price_usd,
  languages = excluded.languages,
  includes = excluded.includes,
  excludes = excluded.excludes,
  itinerary = excluded.itinerary,
  is_active = excluded.is_active,
  display_order = excluded.display_order;

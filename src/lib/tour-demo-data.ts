export type ItineraryStop = {
  time: string;
  title: string;
  description: string;
};

export type TourDemoData = {
  difficulty: "easy" | "moderate" | "challenging";
  maxPeople: number;
  languages: string[];
  itinerary: ItineraryStop[];
  includes: string[];
  excludes: string[];
  childPricePct: number;
  childPriceUsd?: number;
  fullDescription: string;
};

const es: Record<string, TourDemoData> = {
  day_park: {
    difficulty: "moderate",
    maxPeople: 8,
    languages: ["Español", "English"],
    childPricePct: 50,
    childPriceUsd: 40,
    fullDescription:
      "Durante este recorrido caminarás por senderos rodeados de bosque tropical donde es común avistar monos carablanca, perezosos de dos dedos, tucanes, ranas de colores brillantes y una gran diversidad de aves. Tu guía naturalista te ayudará a detectar fauna camuflada y te explicará el comportamiento de cada especie. La luz de la mañana es el mejor momento para la observación.",
    itinerary: [
      {
        time: "7:00",
        title: "Encuentro en la oficina",
        description:
          "Check-in rápido, presentación con tu guía y ajuste de equipo. Café de bienvenida.",
      },
      {
        time: "7:30",
        title: "Ingreso al Parque Nacional",
        description:
          "Caminata por el sendero principal. El dosel se abre y la luz de la mañana revela monos, perezosos y tucanes.",
      },
      {
        time: "9:00",
        title: "Playa Espadilla",
        description:
          "Parada en la playa para descansar, fotos y avistamiento de fauna costera.",
      },
      {
        time: "10:30",
        title: "Sendero La Catarata",
        description:
          "Tramo de bosque secundario con alta concentración de fauna. Ideal para spotting de serpientes y ranas.",
      },
      {
        time: "12:30",
        title: "Regreso y cierre",
        description:
          "Salida del parque, fotos grupales y recomendaciones para el resto del día.",
      },
    ],
    includes: [
      "Guía naturalista certificado ICT",
      "Entrada al Parque Nacional Manuel Antonio",
      "Binoculares compartidos",
      "Seguro de responsabilidad civil",
    ],
    excludes: [
      "Transporte al punto de encuentro",
      "Alimentación y bebidas",
      "Propinas",
    ],
  },
  mangrove: {
    difficulty: "easy",
    maxPeople: 6,
    languages: ["Español", "English"],
    childPricePct: 50,
    fullDescription:
      "El kayak por los canales de Isla Damas te lleva al corazón del ecosistema de manglar. Remarás entre raíces aéreas mientras garzas, monos carablanca y cocodrilos aparecen a tu alrededor. Es una experiencia silenciosa y respetuosa con el entorno ideal para quienes buscan conectar con la naturaleza sin el ruido de la ciudad.",
    itinerary: [
      {
        time: "6:00",
        title: "Salida desde Quepos",
        description:
          "Encuentro en el muelle. Instrucciones de seguridad y breve introducción al ecosistema del manglar.",
      },
      {
        time: "6:30",
        title: "Navegación hacia Isla Damas",
        description:
          "Recorrido en bote por el estero. Avistamiento de aves acuáticas, monos y cocodrilos.",
      },
      {
        time: "7:30",
        title: "Kayak en canales del manglar",
        description:
          "Remo guiado por los canales estrechos entre raíces. El agua calmada refleja el dosel.",
      },
      {
        time: "9:30",
        title: "Regreso y cierre",
        description:
          "Retorno en bote a Quepos. Café o fresco natural incluido.",
      },
    ],
    includes: [
      "Guía naturalista certificado ICT",
      "Kayak doble, chaleco salvavidas y remo",
      "Bote de traslado a Isla Damas",
      "Seguro de responsabilidad civil",
    ],
    excludes: [
      "Transporte al punto de encuentro",
      "Alimentación y bebidas",
      "Ropa impermeable (traer propia)",
      "Propinas",
    ],
  },
  night_walk: {
    difficulty: "easy",
    maxPeople: 8,
    languages: ["Español", "English"],
    childPricePct: 50,
    fullDescription:
      "Cuando cae la noche, la selva se transforma. Con linternas de luz roja para no alterar la fauna, recorrerás senderos donde ranas de cristal, serpientes, insectos bioluminiscentes y mamíferos nocturnos cobran protagonismo. Tu guía te mostrará un mundo que la mayoría de los visitantes nunca llega a ver.",
    itinerary: [
      {
        time: "17:45",
        title: "Encuentro en la oficina",
        description:
          "Preparación del equipo: linternas frontal y de mano. Briefing de seguridad.",
      },
      {
        time: "18:00",
        title: "Inicio del recorrido nocturno",
        description:
          "Ingreso al sendero. La transición día-noche revela el cambio de guardia entre especies.",
      },
      {
        time: "19:00",
        title: "Zona de avistamiento intensivo",
        description:
          "Búsqueda de anfibios, insectos, serpientes y mamíferos nocturnos. Uso de luz roja para no alterar la fauna.",
      },
      {
        time: "20:00",
        title: "Cierre y reflexión",
        description:
          "Último tramo del sendero. Conversación sobre conservación y el rol de la fauna nocturna.",
      },
    ],
    includes: [
      "Guía naturalista certificado ICT",
      "Linterna frontal y de mano",
      "Seguro de responsabilidad civil",
    ],
    excludes: [
      "Transporte al punto de encuentro",
      "Alimentación y bebidas",
      "Repelente (traer propio, biodegradable recomendado)",
      "Propinas",
    ],
  },
};

const en: Record<string, TourDemoData> = {
  day_park: {
    difficulty: "moderate",
    maxPeople: 8,
    languages: ["Español", "English"],
    childPricePct: 50,
    childPriceUsd: 40,
    fullDescription:
      "During this walk you'll hike through trails surrounded by tropical rainforest where it's common to spot white-faced monkeys, two-toed sloths, toucans, brightly colored frogs, and a wide variety of birds. Your naturalist guide will help you spot camouflaged wildlife and explain each species' behavior. Morning light is the best time for observation.",
    itinerary: [
      {
        time: "7:00",
        title: "Meeting at the office",
        description:
          "Quick check-in, meet your guide and get your gear ready. Welcome coffee.",
      },
      {
        time: "7:30",
        title: "Entering the National Park",
        description:
          "Hike along the main trail. The canopy opens and the morning light reveals monkeys, sloths and toucans.",
      },
      {
        time: "9:00",
        title: "Espadilla Beach",
        description:
          "Stop at the beach to rest, take photos and spot coastal wildlife.",
      },
      {
        time: "10:30",
        title: "La Catarata Trail",
        description:
          "Secondary forest section with high wildlife concentration. Ideal for spotting snakes and frogs.",
      },
      {
        time: "12:30",
        title: "Return and wrap-up",
        description:
          "Exit the park, group photos and recommendations for the rest of the day.",
      },
    ],
    includes: [
      "ICT-certified naturalist guide",
      "Manuel Antonio National Park entrance fee",
      "Shared binoculars",
      "Liability insurance",
    ],
    excludes: [
      "Transportation to meeting point",
      "Food and drinks",
      "Tips",
    ],
  },
  mangrove: {
    difficulty: "easy",
    maxPeople: 6,
    languages: ["Español", "English"],
    childPricePct: 50,
    fullDescription:
      "The kayak through the Damas Island channels takes you into the heart of the mangrove ecosystem. You'll paddle among aerial roots while herons, white-faced monkeys and crocodiles appear around you. It's a quiet, environmentally respectful experience ideal for those seeking to connect with nature away from the city noise.",
    itinerary: [
      {
        time: "6:00",
        title: "Departure from Quepos",
        description:
          "Meeting at the dock. Safety instructions and a brief introduction to the mangrove ecosystem.",
      },
      {
        time: "6:30",
        title: "Navigation to Damas Island",
        description:
          "Boat ride through the estuary. Spotting water birds, monkeys and crocodiles.",
      },
      {
        time: "7:30",
        title: "Kayaking through mangrove channels",
        description:
          "Guided paddle through narrow channels among the roots. Calm waters reflect the canopy.",
      },
      {
        time: "9:30",
        title: "Return and wrap-up",
        description:
          "Boat ride back to Quepos. Coffee or fresh natural drink included.",
      },
    ],
    includes: [
      "ICT-certified naturalist guide",
      "Double kayak, life jacket and paddle",
      "Transfer boat to Damas Island",
      "Liability insurance",
    ],
    excludes: [
      "Transportation to meeting point",
      "Food and drinks",
      "Waterproof clothing (bring your own)",
      "Tips",
    ],
  },
  night_walk: {
    difficulty: "easy",
    maxPeople: 8,
    languages: ["Español", "English"],
    childPricePct: 50,
    fullDescription:
      "When night falls, the jungle transforms. Using red-light flashlights to avoid disturbing the wildlife, you'll walk trails where glass frogs, snakes, bioluminescent insects and nocturnal mammals take center stage. Your guide will show you a world that most visitors never get to see.",
    itinerary: [
      {
        time: "17:45",
        title: "Meeting at the office",
        description:
          "Gear preparation: headlamp and handheld flashlight. Safety briefing.",
      },
      {
        time: "18:00",
        title: "Starting the night walk",
        description:
          "Enter the trail. The day-to-night transition reveals the changing of the guard between species.",
      },
      {
        time: "19:00",
        title: "Intensive spotting zone",
        description:
          "Search for amphibians, insects, snakes and nocturnal mammals. Red light used to avoid disturbing wildlife.",
      },
      {
        time: "20:00",
        title: "Wrap-up and reflection",
        description:
          "Final stretch of the trail. Conversation about conservation and the role of nocturnal wildlife.",
      },
    ],
    includes: [
      "ICT-certified naturalist guide",
      "Headlamp and handheld flashlight",
      "Liability insurance",
    ],
    excludes: [
      "Transportation to meeting point",
      "Food and drinks",
      "Insect repellent (bring your own, biodegradable recommended)",
      "Tips",
    ],
  },
};

export function getTourDemoData(category: string, locale: string): TourDemoData {
  const dict = locale === "es" ? es : en;
  return dict[category] ?? dict.day_park;
}

export const difficultyLabels: Record<string, Record<string, string>> = {
  es: { easy: "Fácil", moderate: "Moderada", challenging: "Exigente" },
  en: { easy: "Easy", moderate: "Moderate", challenging: "Challenging" },
};

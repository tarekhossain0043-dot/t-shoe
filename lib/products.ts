export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  label?: string;
  description: string;
};

export const productsSeed: Product[] = [
  { id: 1, name: "Travis Scott x AJ1 Low Reverse Mocha", category: "Jordan / Cactus Jack", price: 7200, image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=700&q=85", label: "RARE DROP", description: "A collector favorite with premium materials and a distinctive reverse Swoosh." },
  { id: 2, name: "Nike Air AlphaFly 3 Proto", category: "Nike Running", price: 12500, image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=700&q=85", label: "PRO RACE", description: "Responsive cushioning and a lightweight build for your fastest runs." },
  { id: 3, name: "Adizero Prime X3 Strong", category: "Adidas Athletics", price: 11000, image: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=700&q=85", label: "50MM STACK", description: "High energy return and a bold profile built for long-distance training." },
  { id: 4, name: "Air Jordan 4 Retro White Cement", category: "Jordan Retro", price: 8200, image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=700&q=85", label: "LEGEND RETRO", description: "A timeless retro silhouette, hand-checked for authenticity." },
  { id: 5, name: "Air Jordan 1 Low Fragment Blue", category: "Jordan / Fragment", price: 7500, image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=700&q=85", label: "HYPE GRAIL", description: "Classic court design with crisp blue accents and a premium finish." },
  { id: 6, name: "New Balance 9060 Black Grey", category: "New Balance", price: 6900, image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=700&q=85", label: "TRENDING Y2K", description: "Chunky retro running style with modern all-day comfort." },
  { id: 7, name: "Nike Air Force 1 Low Venom", category: "Nike Sportswear", price: 5500, image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=700&q=85", label: "-24% OFF", description: "Black-on-black style with everyday versatility." },
  { id: 8, name: "Cloudboom Max Flurry Blue", category: "On Running", price: 8500, image: "https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=700&q=85", label: "SWISS TECH", description: "Lightweight engineered performance for race day." },
  { id: 9, name: "Asics Novablast 5 Indigo", category: "Asics Running", price: 6800, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85", label: "BOUNCY RIDE", description: "Responsive cushioning makes every daily run feel effortless." },
  { id: 10, name: "Air Jordan 1 Mid Mystic Green", category: "Jordan", price: 6400, image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=700&q=85", label: "POPULAR", description: "A fresh green colorway in a familiar streetwear shape." },
  { id: 11, name: "AF1 Low x The North Face", category: "Nike x TNF", price: 4800, image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=700&q=85", label: "COLLAB", description: "An everyday classic reworked with outdoors-inspired detailing." },
  { id: 12, name: "Adizero Evo SL Lightstrike", category: "Adidas Performance", price: 6200, image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=700&q=85", label: "NEW ARRIVAL", description: "A featherlight daily trainer with energetic cushioning." },
  { id: 13, name: "Nike Air Max 97 Platinum", category: "Nike Running", price: 7900, image: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=700&q=85", label: "CLASSIC", description: "A streamlined icon with cushioned comfort." },
  { id: 14, name: "New Balance 990v6 Grey", category: "New Balance", price: 9200, image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=700&q=85", label: "MADE TO MOVE", description: "Premium materials meet dependable everyday cushioning." },
  { id: 15, name: "Asics Gel-Kayano 30", category: "Asics Running", price: 7200, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85", label: "STABILITY", description: "Comfortable support for daily miles and long sessions." },
  { id: 16, name: "Jordan Retro High OG", category: "Jordan Retro", price: 8800, image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=700&q=85", label: "LIMITED", description: "A high-top classic with iconic court-inspired details." },
  { id: 17, name: "Puma Deviate Nitro Elite", category: "Puma Running", price: 7600, image: "https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=700&q=85", label: "RACE READY", description: "A smooth, energetic ride for training and race day." },
];

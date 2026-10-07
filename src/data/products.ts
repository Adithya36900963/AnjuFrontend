import { Product, Category } from '../types';

export const HERO_IMAGE = '/src/assets/images/lune_hero_fashion_model_1791343794793.jpg';
export const EDITORIAL_PORTRAIT_IMAGE = '/src/assets/images/lune_editorial_portrait_1791343808418.jpg';
export const TEAL_HANDBAG_IMAGE = '/src/assets/images/lune_luxury_teal_handbag_1791343819914.jpg';
export const DESIGNER_SUNGLASSES_IMAGE = '/src/assets/images/lune_designer_sunglasses_1791343831525.jpg';
export const MINIMAL_WATCH_IMAGE = '/src/assets/images/lune_gold_minimal_watch_1791343841983.jpg';

// High-fidelity fallback / product imagery
export const SCRUNCHIE_IMAGE = 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&w=600&q=80';
export const GOLD_JEWELLERY_IMAGE = 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80';
export const HAT_CAP_IMAGE = 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80';
export const NECKLACE_IMAGE = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80';
export const TECH_CASE_IMAGE = 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=600&q=80';

export const CATEGORIES: Category[] = [
  { id: 'sunglasses', name: 'Sunglasses', image: DESIGNER_SUNGLASSES_IMAGE, itemCount: 24 },
  { id: 'bags', name: 'Bags', image: TEAL_HANDBAG_IMAGE, itemCount: 18 },
  { id: 'jewellery', name: 'Jewellery', image: GOLD_JEWELLERY_IMAGE, itemCount: 32 },
  { id: 'watches', name: 'Watches', image: MINIMAL_WATCH_IMAGE, itemCount: 12 },
  { id: 'hair', name: 'Hair Accessories', image: SCRUNCHIE_IMAGE, itemCount: 28 },
  { id: 'hats', name: 'Hats & Caps', image: HAT_CAP_IMAGE, itemCount: 15 },
  { id: 'necklaces', name: 'Necklaces', image: NECKLACE_IMAGE, itemCount: 22 },
  { id: 'tech', name: 'Tech Accessories', image: TECH_CASE_IMAGE, itemCount: 14 },
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Silk Scrunchie Set',
    category: 'hair',
    categoryLabel: 'Hair Accessories',
    price: 14.99,
    rating: 5.0,
    reviewsCount: 112,
    image: SCRUNCHIE_IMAGE,
    colors: ['#FCA5A5', '#0284C7', '#1E293B'],
    description: '100% pure mulberry silk scrunchies that glide over hair, preventing creasing, breakage, and frizz throughout the day.',
    details: ['100% Grade 6A Mulberry Silk', 'Pack of 3 coordinating colors', 'Zero damage elastic core', 'Hypoallergenic and gentle on all hair types']
  },
  {
    id: 'prod-2',
    name: 'Minimal Watch',
    category: 'watches',
    categoryLabel: 'Watches',
    price: 49.99,
    rating: 5.0,
    reviewsCount: 76,
    image: MINIMAL_WATCH_IMAGE,
    colors: ['#0369A1', '#0F172A', '#D97706'],
    description: 'Clean architectural lines meet precision Japanese quartz movement. Features an ultra-slim gold bezel with a rich cyan-teal leather band.',
    details: ['38mm 18k Champagne Gold plated case', 'Scratch-resistant sapphire crystal lens', 'Genuine Italian calf leather band', '3ATM Water resistant']
  },
  {
    id: 'prod-3',
    name: 'Everyday Handbag',
    category: 'bags',
    categoryLabel: 'Bags',
    price: 79.99,
    originalPrice: 99.99,
    badge: '-20%',
    rating: 5.0,
    reviewsCount: 94,
    image: TEAL_HANDBAG_IMAGE,
    colors: ['#0891B2', '#0F172A', '#E2E8F0'],
    description: 'Structured silhouette crafted from supple grained vegan leather with gleaming gold hardware and versatile double carrying handles.',
    details: ['Premium scratch-resistant vegan pebble leather', 'Gold-plated custom alloy hardware', 'Detachable adjustable crossbody strap', 'Protective bottom metal studs']
  },
  {
    id: 'prod-4',
    name: 'Classic Frame Sunglasses',
    category: 'sunglasses',
    categoryLabel: 'Sunglasses',
    price: 29.99,
    badge: 'Best Seller',
    isBestSeller: true,
    rating: 5.0,
    reviewsCount: 128,
    image: DESIGNER_SUNGLASSES_IMAGE,
    colors: ['#F8FAFC', '#0F172A', '#78350F'],
    description: 'Iconic oversized ivory frames with polarized UV400 gradient lenses. Effortlessly elevate any casual or formal ensemble.',
    details: ['Handcrafted lightweight Italian acetate frame', '100% UVA/UVB Category 3 Polarized lenses', 'Reinforced 5-barrel German hinges', 'Includes structured velvet hardcase & cleaning cloth']
  },
  {
    id: 'prod-5',
    name: 'Chunky Twisted Gold Hoops',
    category: 'jewellery',
    categoryLabel: 'Jewellery',
    price: 34.50,
    rating: 4.9,
    reviewsCount: 88,
    image: GOLD_JEWELLERY_IMAGE,
    colors: ['#EAB308', '#CBD5E1'],
    description: 'Sculptural twisted hoop earrings dipped in 18k gold vermeil. Feather-light for all-day comfort without pulling the earlobe.',
    details: ['18k Gold Vermeil over 925 Sterling Silver', 'Hollow lightweight build (3.2g per earring)', 'Hypoallergenic titanium post', 'Secure click-top closure']
  },
  {
    id: 'prod-6',
    name: 'Pendant Link Necklace',
    category: 'necklaces',
    categoryLabel: 'Necklaces',
    price: 42.00,
    originalPrice: 55.00,
    badge: 'Trending',
    rating: 4.8,
    reviewsCount: 63,
    image: NECKLACE_IMAGE,
    colors: ['#EAB308'],
    description: 'Refined paperclip link chain adorned with a luminous malachite-inspired green stone pendant in an ornate gold bezel.',
    details: ['18-inch adjustable paperclip link chain with 2-inch extender', 'Natural stone cabochon bezel set', 'Water-resistant protective coating', 'Lobster claw clasp']
  },
  {
    id: 'prod-7',
    name: 'Minimalist Cerulean Cap',
    category: 'hats',
    categoryLabel: 'Hats & Caps',
    price: 26.00,
    rating: 4.7,
    reviewsCount: 45,
    image: HAT_CAP_IMAGE,
    colors: ['#0284C7', '#334155'],
    description: 'Classic 6-panel unstructured dad cap crafted from washed organic cotton twill with tonal Luné cursive monogram embroidery.',
    details: ['100% Washed organic cotton twill', 'Brass buckle slide closure', 'Embroidered ventilation eyelets', 'Curved sun-shielding brim']
  },
  {
    id: 'prod-8',
    name: 'MagSafe Leatherette Case',
    category: 'tech',
    categoryLabel: 'Tech Accessories',
    price: 24.99,
    rating: 4.9,
    reviewsCount: 91,
    image: TECH_CASE_IMAGE,
    colors: ['#0E7490', '#1E293B', '#F1F5F9'],
    description: 'Sleek luxury phone case finished with soft-touch pebble leatherette, tactile aluminum camera ring, and integrated MagSafe magnets.',
    details: ['Built-in strong N52 neodymium magnetic ring', 'Soft micro-suede interior lining', 'Machined aluminum camera bezel protection', 'Drop tested from 6 feet']
  }
];

export const TRUST_BADGES = [
  {
    icon: 'Truck',
    title: 'Free Shipping',
    desc: 'On all orders over $99',
  },
  {
    icon: 'ShieldCheck',
    title: 'Secure Payments',
    desc: '100% safe & trusted',
  },
  {
    icon: 'RotateCcw',
    title: 'Easy Returns',
    desc: 'Hassle-free shopping',
  },
  {
    icon: 'Headphones',
    title: '24/7 Support',
    desc: "We're here for you",
  },
];

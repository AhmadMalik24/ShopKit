// src/scripts/seedTemplates.js
import models from '../database/models/index.js';

const { Template } = models;

const templates = [
  {
    name: 'Modern Cafe',
    slug: 'modern-cafe',
    description: 'Warm, inviting layout for cafes and coffee shops.',
    category: 'food',
    preview_image_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
    display_order: 1,
    blocks: [
      {
        type: 'hero',
        position: 0,
        config: {
          headline: 'Fresh Food, Made With Love',
          subheadline: 'Order now and get it delivered fast',
          button_text: 'View Menu',
          button_link: '#products',
          text_alignment: 'center',
        },
        styles: {
          background_color: '#FFF8E7',
          text_color: '#1F2937',
          padding_top: '100px',
          padding_bottom: '100px',
        },
        animation: { type: 'fadeUp', duration: 800, delay: 0 },
      },
      {
        type: 'products',
        position: 1,
        config: { title: 'Our Menu', show_prices: true, columns: 3 },
        styles: { background_color: '#FFFFFF', padding_top: '80px', padding_bottom: '80px' },
        animation: { type: 'fadeIn', duration: 600, delay: 100 },
      },
      {
        type: 'about',
        position: 2,
        config: {
          heading: 'Our Story',
          paragraph: 'We serve fresh, honest food made daily with local ingredients.',
          layout: 'left',
        },
        styles: { background_color: '#FFF8E7', text_color: '#1F2937', padding_top: '80px', padding_bottom: '80px' },
        animation: { type: 'fadeUp', duration: 600, delay: 0 },
      },
      {
        type: 'contact',
        position: 3,
        config: { phone: '', address: '', email: '', whatsapp: '' },
        styles: { background_color: '#FFFFFF', padding_top: '70px', padding_bottom: '70px' },
        animation: { type: 'fadeIn', duration: 600, delay: 0 },
      },
      {
        type: 'footer',
        position: 4,
        config: { copyright_text: '© 2026 Modern Cafe', social_links: [] },
        styles: { background_color: '#0F172A', text_color: '#94A3B8', padding_top: '50px', padding_bottom: '50px' },
        animation: { type: 'none' },
      },
    ],
  },
  {
    name: 'Elegant Boutique',
    slug: 'elegant-boutique',
    description: 'Refined layout for fashion and boutique stores.',
    category: 'boutique',
    preview_image_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
    display_order: 2,
    blocks: [
      {
        type: 'hero',
        position: 0,
        config: {
          headline: 'Timeless Pieces for Every Woman',
          subheadline: 'Discover our curated collection',
          button_text: 'Shop Collection',
          button_link: '#products',
          text_alignment: 'center',
        },
        styles: { background_color: '#F5F3FF', text_color: '#4C1D95', padding_top: '110px', padding_bottom: '110px' },
        animation: { type: 'fadeUp', duration: 850, delay: 0 },
      },
      {
        type: 'gallery',
        position: 1,
        config: { title: 'Lookbook', grid_style: 'masonry', images: [] },
        styles: { background_color: '#FAFAF9', padding_top: '80px', padding_bottom: '80px' },
        animation: { type: 'fadeIn', duration: 700, delay: 100 },
      },
      {
        type: 'products',
        position: 2,
        config: { title: 'Latest Arrivals', show_prices: true, columns: 4 },
        styles: { background_color: '#FFFFFF', padding_top: '80px', padding_bottom: '80px' },
        animation: { type: 'fadeIn', duration: 600, delay: 100 },
      },
      {
        type: 'about',
        position: 3,
        config: {
          heading: 'Our Brand',
          paragraph: 'Crafted with care, designed for everyday elegance.',
          layout: 'right',
        },
        styles: { background_color: '#F5F5F4', padding_top: '80px', padding_bottom: '80px' },
        animation: { type: 'fadeUp', duration: 700, delay: 150 },
      },
      {
        type: 'footer',
        position: 4,
        config: { copyright_text: '© 2026 Elegant Boutique', social_links: [] },
        styles: { background_color: '#0C0A09', text_color: '#FFFFFF', padding_top: '50px', padding_bottom: '50px' },
        animation: { type: 'none' },
      },
    ],
  },
  {
    name: 'Fresh Grocery',
    slug: 'fresh-grocery',
    description: 'Bold, clean layout for grocery stores.',
    category: 'grocery',
    preview_image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
    display_order: 3,
    blocks: [
      {
        type: 'hero',
        position: 0,
        config: {
          headline: 'Fresh From the Farm',
          subheadline: 'Daily essentials delivered to your door',
          button_text: 'Order Now',
          button_link: '#products',
          text_alignment: 'center',
        },
        styles: { background_color: '#064E3B', text_color: '#FFFFFF', padding_top: '90px', padding_bottom: '90px' },
        animation: { type: 'fadeUp', duration: 800, delay: 0 },
      },
      {
        type: 'products',
        position: 1,
        config: { title: 'Daily Essentials', show_prices: true, columns: 4 },
        styles: { background_color: '#F0FDF4', padding_top: '80px', padding_bottom: '80px' },
        animation: { type: 'fadeIn', duration: 600, delay: 100 },
      },
      {
        type: 'about',
        position: 2,
        config: { heading: 'Why Choose Us', paragraph: 'Farm-fresh quality, delivered fast.', layout: 'left' },
        styles: { background_color: '#FFFFFF', padding_top: '80px', padding_bottom: '80px' },
        animation: { type: 'fadeUp', duration: 700, delay: 100 },
      },
      {
        type: 'footer',
        position: 3,
        config: { copyright_text: '© 2026 Fresh Grocery', social_links: [] },
        styles: { background_color: '#064E3B', text_color: '#FFFFFF', padding_top: '50px', padding_bottom: '50px' },
        animation: { type: 'none' },
      },
    ],
  },
  {
    name: 'Creative Studio',
    slug: 'creative-studio',
    description: 'Bold layout for agencies and studios.',
    category: 'services',
    preview_image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    display_order: 4,
    blocks: [
      {
        type: 'hero',
        position: 0,
        config: {
          headline: 'We Build Beautiful Things',
          subheadline: 'Design, development, and strategy',
          button_text: 'Get in Touch',
          button_link: '#contact',
          text_alignment: 'center',
        },
        styles: { background_color: '#0F172A', text_color: '#FFFFFF', padding_top: '120px', padding_bottom: '120px' },
        animation: { type: 'fadeUp', duration: 900, delay: 0 },
      },
      {
        type: 'about',
        position: 1,
        config: { heading: 'What We Do', paragraph: 'A full-service creative studio.', layout: 'right' },
        styles: { background_color: '#1E293B', text_color: '#F1F5F9', padding_top: '85px', padding_bottom: '85px' },
        animation: { type: 'fadeIn', duration: 700, delay: 100 },
      },
      {
        type: 'gallery',
        position: 2,
        config: { title: 'Our Work', grid_style: 'grid', images: [] },
        styles: { background_color: '#0F172A', text_color: '#FFFFFF', padding_top: '80px', padding_bottom: '80px' },
        animation: { type: 'fadeUp', duration: 700, delay: 150 },
      },
      {
        type: 'contact',
        position: 3,
        config: { phone: '', address: '', email: '', whatsapp: '' },
        styles: { background_color: '#1E293B', text_color: '#F1F5F9', padding_top: '75px', padding_bottom: '75px' },
        animation: { type: 'fadeIn', duration: 600, delay: 100 },
      },
      {
        type: 'footer',
        position: 4,
        config: { copyright_text: '© 2026 Creative Studio', social_links: [] },
        styles: { background_color: '#0F172A', text_color: '#94A3B8', padding_top: '50px', padding_bottom: '50px' },
        animation: { type: 'none' },
      },
    ],
  },
  {
    name: 'Classic Restaurant',
    slug: 'classic-restaurant',
    description: 'Elegant layout for fine dining.',
    category: 'food',
    preview_image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    display_order: 5,
    blocks: [
      {
        type: 'hero',
        position: 0,
        config: {
          headline: 'A Taste of Tradition',
          subheadline: 'Authentic flavors, crafted daily',
          button_text: 'View Menu',
          button_link: '#products',
          text_alignment: 'center',
        },
        styles: { background_color: '#111827', text_color: '#FDE68A', padding_top: '110px', padding_bottom: '110px' },
        animation: { type: 'fadeUp', duration: 800, delay: 0 },
      },
      {
        type: 'products',
        position: 1,
        config: { title: 'Our Menu', show_prices: true, columns: 2 },
        styles: { background_color: '#111827', padding_top: '80px', padding_bottom: '80px' },
        animation: { type: 'fadeIn', duration: 600, delay: 100 },
      },
      {
        type: 'about',
        position: 2,
        config: { heading: 'Our Chef', paragraph: 'Recipes passed down for generations.', layout: 'left' },
        styles: { background_color: '#1F2937', text_color: '#F9FAFB', padding_top: '80px', padding_bottom: '80px' },
        animation: { type: 'fadeIn', duration: 700, delay: 100 },
      },
      {
        type: 'contact',
        position: 3,
        config: { phone: '', address: '', email: '', whatsapp: '' },
        styles: { background_color: '#111827', text_color: '#F9FAFB', padding_top: '75px', padding_bottom: '75px' },
        animation: { type: 'fadeIn', duration: 600, delay: 100 },
      },
      {
        type: 'footer',
        position: 4,
        config: { copyright_text: '© 2026 Classic Restaurant', social_links: [] },
        styles: { background_color: '#030712', text_color: '#9CA3AF', padding_top: '50px', padding_bottom: '50px' },
        animation: { type: 'none' },
      },
    ],
  },
  {
    name: 'Minimal Shop',
    slug: 'minimal-shop',
    description: 'Clean, minimal layout for any product store.',
    category: 'general',
    preview_image_url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800',
    display_order: 6,
    blocks: [
      {
        type: 'hero',
        position: 0,
        config: {
          headline: 'Simple. Clean. Yours.',
          subheadline: 'Quality products, no clutter',
          button_text: 'Shop Now',
          button_link: '#products',
          text_alignment: 'center',
        },
        styles: { background_color: '#F8FAFC', text_color: '#0F172A', padding_top: '90px', padding_bottom: '90px' },
        animation: { type: 'fadeUp', duration: 700, delay: 0 },
      },
      {
        type: 'products',
        position: 1,
        config: { title: 'Catalog', show_prices: true, columns: 3 },
        styles: { background_color: '#FFFFFF', padding_top: '80px', padding_bottom: '80px' },
        animation: { type: 'fadeIn', duration: 600, delay: 100 },
      },
      {
        type: 'about',
        position: 2,
        config: { heading: 'Less, But Better.', paragraph: 'We curate durable, useful products.', layout: 'center' },
        styles: { background_color: '#F8FAFC', text_color: '#334155', padding_top: '70px', padding_bottom: '70px' },
        animation: { type: 'fadeIn', duration: 600, delay: 100 },
      },
      {
        type: 'footer',
        position: 3,
        config: { copyright_text: '© 2026 Minimal Shop', social_links: [] },
        styles: { background_color: '#0F172A', text_color: '#94A3B8', padding_top: '50px', padding_bottom: '50px' },
        animation: { type: 'none' },
      },
    ],
  },
];

async function seed() {
  try {
    for (const t of templates) {
      await Template.upsert(t, { conflictFields: ['slug'] });
    }
    console.log(`✅ Seeded ${templates.length} templates`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
import heroConstruction from '../../images/hero/frames-for-your-heart-_KP6mk2Iz8k-unsplash.jpg';
import heroInteriors from '../../images/hero/aalo-lens-UlIj_qKpgCw-unsplash.jpg';
import heroKitchens from '../../images/hero/brian-zajac-n8wF-38dASg-unsplash.jpg';
import heroElectrical from '../../images/hero/pexels-ranamatloob567-35189704.jpg';
import heroWaterSystems from '../../images/hero/shoham-avisrur-Kskxj4M8jmI-unsplash.jpg';

// Shared with index.astro, which preloads slides[0] in <head> — kept in one place so the
// widths/format/quality used for the preload's getImage() call can never drift from what
// <Image> actually renders (a mismatch would generate a second, wasted asset variant).
export const HERO_IMAGE_OPTS = {
    widths: [480, 768, 1280, 1920] as number[],
    format: 'webp' as const,
    quality: 75,
};

export const heroSlides = [
    {
        src: heroConstruction,
        alt: 'Luxury modern villa exterior with palm trees, completed by Earth Cone Contracting',
    },
    {
        src: heroInteriors,
        alt: 'High-end marble and dark wood interior fit-out with gold accents, Dubai villa',
    },
    {
        src: heroKitchens,
        alt: 'Custom white and gold luxury kitchen with marble island, designed and installed by Earth Cone',
    },
    {
        src: heroElectrical,
        alt: 'Premium kitchen featuring designer ring LED chandelier and luxury electrical fit-out, UAE',
    },
    {
        src: heroWaterSystems,
        alt: 'Modern kitchen with integrated plumbing fixtures and sleek cabinetry, Earth Cone water systems',
    },
];

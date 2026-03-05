
import { Product, Category, Brand } from '../types/index.js';

export const MOCK_CATEGORIES: Category[] = [
    { id: '1', name: 'Decking', slug: 'decking', count: 120 },
    { id: '2', name: 'Siding & Panels', slug: 'siding', count: 85 },
    { id: '3', name: 'Lumber', slug: 'lumber', count: 450 },
    { id: '4', name: 'Plywoods & Panels', slug: 'plywoods', count: 210 },
    { id: '5', name: 'Moulding & Trim', slug: 'moulding', count: 320 },
    { id: '6', name: 'Roofing Products', slug: 'roofing', count: 95 },
];

export const MOCK_BRANDS: Brand[] = [
    { id: '1', name: 'Trex', slug: 'trex', count: 45 },
    { id: '2', name: 'James Hardie', slug: 'james-hardie', count: 68 },
    { id: '3', name: 'Weyerhaeuser', slug: 'weyerhaeuser', count: 112 },
    { id: '4', name: 'Simpson Strong-Tie', slug: 'simpson', count: 150 },
    { id: '5', name: 'Empire Signature', slug: 'empire', count: 24 },
];

export const MOCK_PRODUCTS: Product[] = [
    {
        id: 'EMP-101',
        name: 'Trex Enhance Naturals Fascia Coastal Bluff',
        description: 'High-quality fascia board for Trex Enhance decking. Coastal Bluff color offers a natural, weathered look without the maintenance of wood.',
        price: 84.50,
        image: '/images/products/trex-fascia-coastal.png',
        category: 'decking',
        brand: 'Trex',
        rating: 4.8,
        reviews: 42,
        inStock: true,
        sku: 'TREXENFCB1212',
        minOrderQuantity: 10,
        unitOfMeasure: 'Piece'
    },
    {
        id: 'EMP-201',
        name: 'Cedarmill Primed HardiePlank Lap Siding',
        description: 'Fiber cement lap siding with a natural cedar texture. Primed and ready for paint. Durable, non-combustible, and resistant to rot.',
        price: 12.95,
        image: '/images/products/hardie-cedarmill.png',
        category: 'siding',
        brand: 'James Hardie',
        rating: 4.9,
        reviews: 156,
        inStock: true,
        sku: 'JH12PCM',
        minOrderQuantity: 100,
        unitOfMeasure: 'Linear Foot'
    },
    {
        id: 'EMP-202',
        name: 'Aged Pewter Staggered Edge Shingle',
        description: 'Decorative staggered edge shingle siding in pre-finished Aged Pewter. HardieieShingle siding has the same warm, authentic look as cedar shingles, yet it resists rotting, cracking, and splitting.',
        price: 24.50,
        image: '/images/products/hardie-shingle-pewter.png',
        category: 'siding',
        brand: 'James Hardie',
        rating: 4.7,
        reviews: 89,
        inStock: true,
        sku: 'JHAPSTG',
        minOrderQuantity: 50,
        unitOfMeasure: 'Piece'
    },
    {
        id: 'EMP-301',
        name: '2X10-08 #2 & BTR HEM FIR KD',
        description: 'Kiln-dried Hemlock/Fir lumber, graded #2 and better for structural use. Ideal for framing and general construction where strength is paramount.',
        price: 18.75,
        image: '/images/products/hem-fir-2x10.png',
        category: 'lumber',
        brand: 'Weyerhaeuser',
        rating: 4.5,
        reviews: 34,
        inStock: true,
        sku: '21008H',
        minOrderQuantity: 50,
        unitOfMeasure: 'Board'
    },
    {
        id: 'EMP-302',
        name: 'Douglas Fir CVG Pattern Stock',
        description: 'Clear Vertical Grain Doug Fir. Exceptional stability and beauty for high-end trim, siding, or paneling applications.',
        price: 145.00,
        image: '/images/products/doug-fir-cvg.png',
        category: 'lumber',
        brand: 'Empire Signature',
        rating: 5.0,
        reviews: 12,
        inStock: true,
        sku: 'DF-CVG-PAT',
        minOrderQuantity: 250,
        unitOfMeasure: 'Board Feet'
    },
    {
        id: 'EMP-401',
        name: '3/4" CDX Structural Plywood',
        description: 'Standard structural plywood for roof and wall sheathing. Provides strength and durability for various construction needs.',
        price: 45.20,
        image: '/images/products/plywood-34.png',
        category: 'plywoods',
        brand: 'Weyerhaeuser',
        rating: 4.6,
        reviews: 110,
        inStock: true,
        sku: 'CDX-34-48',
        minOrderQuantity: 44,
        unitOfMeasure: 'Sheet'
    }
];

export const MOCK_REVIEWS = [
    { id: 1, user: 'Bozeman Builders', rating: 5, comment: 'Empire always has the inventory we need for our Trex projects.', date: '2 days ago' },
    { id: 2, user: 'Missoula Home Centers', rating: 4, comment: 'Great service on the last Hardie shipment.', date: '1 week ago' },
];

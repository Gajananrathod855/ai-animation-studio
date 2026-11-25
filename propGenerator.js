/**
 * Procedural Object and Prop Generator
 * Creates customizable 3D props with variations, materials, and styles
 */

import { SceneAssetManager } from './app.js';

// ========================================
// Prop Categories and Base Definitions
// ========================================

export const PROP_CATEGORIES = {
    furniture: {
        name: 'फर्नीचर',
        icon: '🪑',
        baseProps: ['chair', 'table', 'sofa', 'bed', 'desk', 'bookshelf', 'cabinet', 'stool', 'bench', 'wardrobe']
    },
    vehicles: {
        name: 'वाहन',
        icon: '🚗',
        baseProps: ['car', 'truck', 'motorcycle', 'bicycle', 'bus', 'van', 'scooter', 'tractor', 'train', 'plane']
    },
    nature: {
        name: 'प्रकृति',
        icon: '🌳',
        baseProps: ['tree', 'pineTree', 'palmTree', 'bush', 'flower', 'rock', 'grass', 'fern', 'mushroom', 'cactus']
    },
    food: {
        name: 'भोजन',
        icon: '🍎',
        baseProps: ['apple', 'bread', 'cake', 'pizza', 'burger', 'sandwich', 'fruit', 'vegetable', 'drink', 'plate']
    },
    tools: {
        name: 'उपकरण',
        icon: '🔨',
        baseProps: ['hammer', 'screwdriver', 'wrench', 'saw', 'drill', 'pliers', 'tape', 'level', 'chisel', 'axe']
    },
    school: {
        name: 'स्कूल',
        icon: '📚',
        baseProps: ['book', 'pencil', 'notebook', 'backpack', 'desk', 'chair', 'blackboard', 'globe', 'ruler', 'calculator']
    },
    medical: {
        name: 'चिकित्सा',
        icon: '🏥',
        baseProps: ['stethoscope', 'syringe', 'pill', 'bandage', 'thermometer', 'wheelchair', 'crutches', 'firstAid', 'mask', 'gloves']
    },
    outdoor: {
        name: 'आउटडोर',
        icon: '🏕️',
        baseProps: ['tent', 'campfire', 'backpack', 'lantern', 'compass', 'map', 'waterBottle', 'sleepingBag', 'cooler', 'hikingBoots']
    },
    animals: {
        name: 'जानवर',
        icon: '🐕',
        baseProps: ['dog', 'cat', 'bird', 'fish', 'rabbit', 'horse', 'cow', 'sheep', 'pig', 'chicken']
    },
    buildings: {
        name: 'भवन',
        icon: '🏢',
        baseProps: ['house', 'skyscraper', 'cottage', 'barn', 'factory', 'church', 'school', 'hospital', 'shop', 'warehouse']
    },
    props: {
        name: 'प्रॉप्स',
        icon: '📦',
        baseProps: ['box', 'crate', 'barrel', 'bag', 'suitcase', 'basket', 'jar', 'bottle', 'can', 'package']
    },
    household: {
        name: 'घरेलू',
        icon: '🏠',
        baseProps: ['lamp', 'clock', 'vase', 'picture', 'mirror', 'rug', 'curtain', 'pillow', 'blanket', 'candle']
    }
};

// ========================================
// Prop Variations / Styles
// ========================================

export const PROP_VARIATIONS = {
    chair: {
        variations: ['modern', 'wooden', 'plastic', 'office', 'dining', 'armchair', 'folding', 'rocking', 'stool', 'beanbag'],
        customizable: ['color', 'material', 'size', 'cushionColor', 'legStyle']
    },
    table: {
        variations: ['dining', 'coffee', 'desk', 'side', 'console', 'folding', 'picnic', 'workbench', 'vanity', 'bedside'],
        customizable: ['color', 'material', 'size', 'shape', 'legStyle', 'topMaterial']
    },
    sofa: {
        variations: ['sectional', 'loveseat', 'chesterfield', 'modern', 'traditional', 'futon', 'recliner', 'modular', 'daybed', 'chaise'],
        customizable: ['color', 'material', 'size', 'cushionCount', 'legStyle', 'armStyle']
    },
    bed: {
        variations: ['single', 'double', 'queen', 'king', 'bunk', 'loft', 'platform', 'canopy', 'fourPoster', 'daybed'],
        customizable: ['color', 'material', 'size', 'headboardStyle', 'footboard', 'beddingColor']
    },
    car: {
        variations: ['sedan', 'suv', 'hatchback', 'coupe', 'convertible', 'wagon', 'pickup', 'van', 'sports', 'electric'],
        customizable: ['color', 'rimStyle', 'windowTint', 'roofRack', 'spoiler', 'bodyKit']
    },
    tree: {
        variations: ['oak', 'maple', 'birch', 'willow', 'elm', 'ash', 'poplar', 'beech', 'chestnut', 'sycamore'],
        customizable: ['leafColor', 'trunkColor', 'size', 'leafDensity', 'season', 'age']
    },
    book: {
        variations: ['hardcover', 'paperback', 'textbook', 'novel', 'journal', 'sketchbook', 'dictionary', 'encyclopedia', 'comic', 'magazine'],
        customizable: ['coverColor', 'spineColor', 'size', 'thickness', 'title', 'worn']
    },
    lamp: {
        variations: ['table', 'floor', 'desk', 'wall', 'ceiling', 'lava', 'fairy', 'oil', 'lantern', 'smart'],
        customizable: ['color', 'material', 'size', 'shadeColor', 'bulbType', 'brightness']
    },
    box: {
        variations: ['cardboard', 'wooden', 'metal', 'plastic', 'gift', 'storage', 'shipping', 'jewelry', 'toolbox', 'cooler'],
        customizable: ['color', 'material', 'size', 'pattern', 'lidStyle', 'condition']
    }
    // More variations can be added for other props
};

// ========================================
// Material Presets
// ========================================

export const MATERIAL_PRESETS = {
    wood: { color: 0x8b4513, roughness: 0.8, metalness: 0.1, name: 'लकड़ी' },
    woodDark: { color: 0x4a2c1a, roughness: 0.8, metalness: 0.1, name: 'गहरी लकड़ी' },
    woodLight: { color: 0xdeb887, roughness: 0.8, metalness: 0.1, name: 'हल्की लकड़ी' },
    metal: { color: 0x888888, roughness: 0.3, metalness: 0.8, name: 'धातु' },
    metalPolished: { color: 0xcccccc, roughness: 0.1, metalness: 0.9, name: 'पॉलिश धातु' },
    metalRusted: { color: 0x8b4513, roughness: 0.9, metalness: 0.7, name: 'जंग लगी धातु' },
    plastic: { color: 0xffffff, roughness: 0.5, metalness: 0, name: 'प्लास्टिक' },
    plasticGlossy: { color: 0xffffff, roughness: 0.2, metalness: 0, name: 'चमकदार प्लास्टिक' },
    plasticMatte: { color: 0xdddddd, roughness: 0.8, metalness: 0, name: 'मैट प्लास्टिक' },
    fabric: { color: 0x666666, roughness: 0.9, metalness: 0, name: 'कपड़ा' },
    fabricVelvet: { color: 0x444444, roughness: 0.95, metalness: 0, name: 'मखमल' },
    fabricCanvas: { color: 0xcccccc, roughness: 0.9, metalness: 0, name: 'कैनवास' },
    leather: { color: 0x4a2c1a, roughness: 0.7, metalness: 0, name: 'चमड़ा' },
    leatherWorn: { color: 0x5d3a1a, roughness: 0.8, metalness: 0, name: 'पुराना चमड़ा' },
    glass: { color: 0x88ccff, roughness: 0, metalness: 0, transmission: 0.9, transparent: true, opacity: 0.3, name: 'कांच' },
    glassFrosted: { color: 0xeeeeee, roughness: 0.5, metalness: 0, transmission: 0.5, transparent: true, opacity: 0.5, name: 'फ्रॉस्टेड ग्लास' },
    stone: { color: 0x808080, roughness: 0.9, metalness: 0, name: 'पत्थर' },
    stoneMarble: { color: 0xf5f5f5, roughness: 0.2, metalness: 0, name: 'संगमरमर' },
    stoneBrick: { color: 0x8b4513, roughness: 0.9, metalness: 0, name: 'ईंट' },
    concrete: { color: 0x999999, roughness: 0.9, metalness: 0, name: 'कंक्रीट' },
    ceramic: { color: 0xffffff, roughness: 0.1, metalness: 0, name: 'सिरेमिक' },
    rubber: { color: 0x333333, roughness: 0.9, metalness: 0, name: 'रबर' },
    paper: { color: 0xf5f5dc, roughness: 0.9, metalness: 0, name: 'कागज' },
    cardboard: { color: 0xb8860b, roughness: 0.9, metalness: 0, name: 'कार्डबोर्ड' }
};

// ========================================
// Prop Generator Class
// ========================================

export class PropGenerator {
    constructor(three) {
        this.three = three;
        this.THREE = three.THREE;
        this.generatedProps = new Map();
    }

    // Generate a prop with variations
    generateProp(propType, options = {}) {
        const variation = options.variation || 'default';
        const customization = options.customization || {};
        const seed = options.seed || Math.random();

        // Create deterministic random from seed
        const rand = this.seededRandom(seed);

        const prop = this.createBaseProp(propType, variation, customization, rand);
        
        if (prop) {
            // Apply customizations
            this.applyCustomizations(prop, propType, customization, rand);
            
            // Add variation-specific details
            this.addVariationDetails(prop, propType, variation, rand);
        }

        return prop;
    }

    // Seeded random for reproducibility
    seededRandom(seed) {
        let s = seed;
        return () => {
            s = Math.sin(s) * 10000;
            return s - Math.floor(s);
        };
    }

    // Create base prop geometry
    createBaseProp(propType, variation, customization, rand) {
        const THREE = this.THREE;
        const group = new THREE.Group();
        group.userData = { propType, variation, customization };

        const size = customization.size || 1;

        switch (propType) {
            case 'chair':
                return this.createChair(group, variation, size, rand);
            case 'table':
                return this.createTable(group, variation, size, rand);
            case 'sofa':
                return this.createSofa(group, variation, size, rand);
            case 'bed':
                return this.createBed(group, variation, size, rand);
            case 'car':
                return this.createCar(group, variation, size, rand);
            case 'tree':
                return this.createTree(group, variation, size, rand);
            case 'book':
                return this.createBook(group, variation, size, rand);
            case 'lamp':
                return this.createLamp(group, variation, size, rand);
            case 'box':
                return this.createBox(group, variation, size, rand);
            // Add more prop types
            default:
                return this.createGenericProp(group, propType, size, rand);
        }
    }

    // Chair variations
    createChair(group, variation, size, rand) {
        const THREE = this.THREE;
        const seatH = 0.45 * size;
        const backH = 0.8 * size;

        let seatGeo, backGeo, legGeo;
        let legCount = 4;

        switch (variation) {
            case 'office':
                seatGeo = new THREE.CylinderGeometry(0.25 * size, 0.25 * size, 0.1 * size, 16);
                backGeo = new THREE.BoxGeometry(0.4 * size, 0.5 * size, 0.05 * size);
                legGeo = new THREE.CylinderGeometry(0.05 * size, 0.05 * size, seatH, 8);
                break;
            case 'wooden':
            case 'dining':
                seatGeo = new THREE.BoxGeometry(0.4 * size, 0.05 * size, 0.4 * size);
                backGeo = new THREE.BoxGeometry(0.4 * size, 0.4 * size, 0.05 * size);
                legGeo = new THREE.BoxGeometry(0.04 * size, seatH, 0.04 * size);
                break;
            case 'armchair':
                seatGeo = new THREE.BoxGeometry(0.5 * size, 0.1 * size, 0.5 * size);
                backGeo = new THREE.BoxGeometry(0.5 * size, 0.6 * size, 0.1 * size);
                legGeo = new THREE.BoxGeometry(0.05 * size, seatH, 0.05 * size);
                // Add arms
                const armGeo = new THREE.BoxGeometry(0.05 * size, 0.25 * size, 0.5 * size);
                const armMat = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.8 });
                const leftArm = new THREE.Mesh(armGeo, armMat);
                leftArm.position.set(-0.275 * size, seatH + 0.175 * size, 0);
                group.add(leftArm);
                const rightArm = leftArm.clone();
                rightArm.position.x = 0.275 * size;
                group.add(rightArm);
                break;
            case 'folding':
                seatGeo = new THREE.BoxGeometry(0.35 * size, 0.03 * size, 0.35 * size);
                backGeo = new THREE.BoxGeometry(0.35 * size, 0.4 * size, 0.03 * size);
                legGeo = new THREE.CylinderGeometry(0.02 * size, 0.02 * size, seatH, 6);
                break;
            case 'rocking':
                seatGeo = new THREE.BoxGeometry(0.4 * size, 0.05 * size, 0.4 * size);
                backGeo = new THREE.BoxGeometry(0.4 * size, 0.4 * size, 0.05 * size);
                // Rockers instead of legs
                const rockerGeo = new THREE.TorusGeometry(0.3 * size, 0.03 * size, 8, 16, Math.PI);
                const rockerMat = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.8 });
                const rocker1 = new THREE.Mesh(rockerGeo, rockerMat);
                rocker1.rotation.x = Math.PI / 2;
                rocker1.position.set(0, 0.05 * size, -0.2 * size);
                group.add(rocker1);
                const rocker2 = rocker1.clone();
                rocker2.position.z = 0.2 * size;
                group.add(rocker2);
                legCount = 0;
                break;
            default:
                seatGeo = new THREE.BoxGeometry(0.4 * size, 0.05 * size, 0.4 * size);
                backGeo = new THREE.BoxGeometry(0.4 * size, 0.4 * size, 0.05 * size);
                legGeo = new THREE.CylinderGeometry(0.04 * size, 0.04 * size, seatH, 8);
        }

        const materials = this.getMaterialsForProp('chair', variation);

        const seat = new THREE.Mesh(seatGeo, materials.seat);
        seat.position.y = seatH;
        seat.castShadow = true;
        group.add(seat);

        const back = new THREE.Mesh(backGeo, materials.back);
        back.position.set(0, seatH + backH / 2, -0.2 * size);
        back.castShadow = true;
        group.add(back);

        if (legCount > 0) {
            for (const [x, z] of [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]]) {
                const leg = new THREE.Mesh(legGeo, materials.legs);
                leg.position.set(x * size, seatH / 2, z * size);
                leg.castShadow = true;
                group.add(leg);
            }
        }

        return group;
    }

    // Table variations
    createTable(group, variation, size, rand) {
        const THREE = this.THREE;
        const tableH = 0.75 * size;

        let topGeo, legGeo;
        let legCount = 4;

        switch (variation) {
            case 'coffee':
                topGeo = new THREE.CylinderGeometry(0.5 * size, 0.5 * size, 0.05 * size, 16);
                legGeo = new THREE.CylinderGeometry(0.04 * size, 0.04 * size, 0.4 * size, 8);
                break;
            case 'desk':
                topGeo = new THREE.BoxGeometry(1.2 * size, 0.05 * size, 0.6 * size);
                legGeo = new THREE.BoxGeometry(0.05 * size, tableH, 0.05 * size);
                // Add drawer
                const drawerGeo = new THREE.BoxGeometry(0.3 * size, 0.15 * size, 0.4 * size);
                const drawerMat = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.8 });
                const drawer = new THREE.Mesh(drawerGeo, drawerMat);
                drawer.position.set(0.35 * size, tableH / 2 - 0.1 * size, 0);
                group.add(drawer);
                break;
            case 'picnic':
                topGeo = new THREE.BoxGeometry(1.5 * size, 0.05 * size, 1 * size);
                legGeo = new THREE.BoxGeometry(0.08 * size, 0.7 * size, 0.08 * size);
                // Add benches
                for (const z of [-0.6, 0.6]) {
                    const bench = new THREE.Mesh(
                        new THREE.BoxGeometry(1.3 * size, 0.05 * size, 0.3 * size),
                        new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.8 })
                    );
                    bench.position.set(0, 0.35 * size, z * size);
                    bench.castShadow = true;
                    group.add(bench);
                }
                break;
            case 'round':
                topGeo = new THREE.CylinderGeometry(0.6 * size, 0.6 * size, 0.05 * size, 16);
                legGeo = new THREE.CylinderGeometry(0.06 * size, 0.06 * size, tableH, 8);
                legCount = 1; // Pedestal
                break;
            default: // dining
                topGeo = new THREE.BoxGeometry(1.2 * size, 0.05 * size, 0.8 * size);
                legGeo = new THREE.BoxGeometry(0.05 * size, tableH, 0.05 * size);
        }

        const materials = this.getMaterialsForProp('table', variation);

        const top = new THREE.Mesh(topGeo, materials.top);
        top.position.y = tableH;
        top.castShadow = true;
        top.receiveShadow = true;
        group.add(top);

        if (legCount === 1) {
            const leg = new THREE.Mesh(legGeo, materials.legs);
            leg.position.set(0, tableH / 2, 0);
            leg.castShadow = true;
            group.add(leg);
        } else {
            const halfW = topGeo.parameters.width ? topGeo.parameters.width / 2 - 0.05 * size : 0.55 * size;
            const halfD = topGeo.parameters.depth ? topGeo.parameters.depth / 2 - 0.05 * size : 0.35 * size;
            for (const [x, z] of [[-halfW, -halfD], [halfW, -halfD], [-halfW, halfD], [halfW, halfD]]) {
                const leg = new THREE.Mesh(legGeo, materials.legs);
                leg.position.set(x, tableH / 2, z);
                leg.castShadow = true;
                group.add(leg);
            }
        }

        return group;
    }

    // Sofa variations
    createSofa(group, variation, size, rand) {
        const THREE = this.THREE;
        const seatH = 0.4 * size;
        const backH = 0.5 * size;

        let width, depth, cushionCount;

        switch (variation) {
            case 'sectional':
                width = 2.5 * size;
                depth = 1 * size;
                cushionCount = 3;
                break;
            case 'loveseat':
                width = 1.2 * size;
                depth = 0.9 * size;
                cushionCount = 2;
                break;
            case 'chesterfield':
                width = 1.8 * size;
                depth = 0.9 * size;
                cushionCount = 3;
                break;
            case 'futon':
                width = 1.5 * size;
                depth = 0.8 * size;
                cushionCount = 1;
                break;
            default: // modern
                width = 1.8 * size;
                depth = 0.9 * size;
                cushionCount = 3;
        }

        const materials = this.getMaterialsForProp('sofa', variation);

        // Base
        const baseGeo = new THREE.BoxGeometry(width, 0.1 * size, depth);
        const base = new THREE.Mesh(baseGeo, materials.frame);
        base.position.y = 0.05 * size;
        base.castShadow = true;
        group.add(base);

        // Seat cushions
        const cushionW = width / cushionCount;
        for (let i = 0; i < cushionCount; i++) {
            const cushion = new THREE.Mesh(
                new THREE.BoxGeometry(cushionW * 0.95, 0.15 * size, depth * 0.9),
                materials.cushion
            );
            cushion.position.set(
                -width / 2 + cushionW / 2 + i * cushionW,
                seatH,
                0
            );
            cushion.castShadow = true;
            group.add(cushion);
        }

        // Back cushions
        for (let i = 0; i < cushionCount; i++) {
            const backCushion = new THREE.Mesh(
                new THREE.BoxGeometry(cushionW * 0.95, backH, 0.15 * size),
                materials.cushion
            );
            backCushion.position.set(
                -width / 2 + cushionW / 2 + i * cushionW,
                seatH + backH / 2,
                -depth / 2 + 0.1 * size
            );
            backCushion.castShadow = true;
            group.add(backCushion);
        }

        // Arms
        const armGeo = new THREE.BoxGeometry(0.1 * size, seatH + backH * 0.5, depth * 0.8);
        for (const x of [-width / 2, width / 2]) {
            const arm = new THREE.Mesh(armGeo, materials.cushion);
            arm.position.set(x, seatH + backH * 0.25, 0);
            arm.castShadow = true;
            group.add(arm);
        }

        // Legs
        const legGeo = new THREE.CylinderGeometry(0.04 * size, 0.04 * size, seatH, 8);
        for (const [x, z] of [[-width/2+0.1, -depth/2+0.1], [width/2-0.1, -depth/2+0.1], [-width/2+0.1, depth/2-0.1], [width/2-0.1, depth/2-0.1]]) {
            const leg = new THREE.Mesh(legGeo, materials.legs);
            leg.position.set(x, seatH / 2, z);
            leg.castShadow = true;
            group.add(leg);
        }

        return group;
    }

    // Bed variations
    createBed(group, variation, size, rand) {
        const THREE = this.THREE;
        const bedH = 0.5 * size;

        let width, length, hasHeadboard, hasFootboard;

        switch (variation) {
            case 'single':
                width = 1 * size; length = 2 * size; hasHeadboard = true; hasFootboard = false;
                break;
            case 'bunk':
                width = 1 * size; length = 2 * size; hasHeadboard = true; hasFootboard = true;
                break;
            case 'canopy':
                width = 1.5 * size; length = 2.2 * size; hasHeadboard = true; hasFootboard = true;
                break;
            case 'fourPoster':
                width = 1.5 * size; length = 2.2 * size; hasHeadboard = true; hasFootboard = true;
                break;
            default: // double/queen/king
                width = 1.5 * size; length = 2.2 * size; hasHeadboard = true; hasFootboard = false;
        }

        const materials = this.getMaterialsForProp('bed', variation);

        // Frame
        const frameGeo = new THREE.BoxGeometry(width, 0.2 * size, length);
        const frame = new THREE.Mesh(frameGeo, materials.frame);
        frame.position.y = 0.1 * size;
        frame.castShadow = true;
        frame.receiveShadow = true;
        group.add(frame);

        // Mattress
        const mattressGeo = new THREE.BoxGeometry(width * 0.95, 0.15 * size, length * 0.95);
        const mattress = new THREE.Mesh(mattressGeo, materials.mattress);
        mattress.position.y = bedH;
        mattress.castShadow = true;
        group.add(mattress);

        // Headboard
        if (hasHeadboard) {
            const hbGeo = new THREE.BoxGeometry(width, 0.8 * size, 0.1 * size);
            const hb = new THREE.Mesh(hbGeo, materials.headboard);
            hb.position.set(0, bedH + 0.4 * size, -length / 2);
            hb.castShadow = true;
            group.add(hb);

            // Canopy posts
            if (variation === 'canopy' || variation === 'fourPoster') {
                const postGeo = new THREE.CylinderGeometry(0.05 * size, 0.05 * size, 1.8 * size, 8);
                for (const [x, z] of [[-width/2, -length/2], [width/2, -length/2], [-width/2, length/2], [width/2, length/2]]) {
                    const post = new THREE.Mesh(postGeo, materials.posts);
                    post.position.set(x, bedH + 0.9 * size, z);
                    post.castShadow = true;
                    group.add(post);
                }
                if (variation === 'canopy') {
                    // Canopy top
                    const canopyGeo = new THREE.BoxGeometry(width * 1.1, 0.05 * size, length * 1.1);
                    const canopy = new THREE.Mesh(canopyGeo, materials.canopy);
                    canopy.position.set(0, bedH + 1.8 * size, 0);
                    group.add(canopy);
                }
            }
        }

        // Footboard
        if (hasFootboard) {
            const fbGeo = new THREE.BoxGeometry(width, 0.5 * size, 0.1 * size);
            const fb = new THREE.Mesh(fbGeo, materials.footboard);
            fb.position.set(0, bedH + 0.25 * size, length / 2);
            fb.castShadow = true;
            group.add(fb);
        }

        // Legs
        const legGeo = new THREE.CylinderGeometry(0.05 * size, 0.05 * size, 0.3 * size, 8);
        for (const [x, z] of [[-width/2+0.1, -length/2+0.1], [width/2-0.1, -length/2+0.1], [-width/2+0.1, length/2-0.1], [width/2-0.1, length/2-0.1]]) {
            const leg = new THREE.Mesh(legGeo, materials.legs);
            leg.position.set(x, 0.15 * size, z);
            leg.castShadow = true;
            group.add(leg);
        }

        return group;
    }

    // Car variations
    createCar(group, variation, size, rand) {
        const THREE = this.THREE;

        let bodyW, bodyL, bodyH, roofH;

        switch (variation) {
            case 'suv':
                bodyW = 1.8 * size; bodyL = 4.2 * size; bodyH = 0.8 * size; roofH = 0.5 * size;
                break;
            case 'hatchback':
                bodyW = 1.7 * size; bodyL = 3.8 * size; bodyH = 0.5 * size; roofH = 0.4 * size;
                break;
            case 'coupe':
                bodyW = 1.8 * size; bodyL = 4.2 * size; bodyH = 0.45 * size; roofH = 0.35 * size;
                break;
            case 'convertible':
                bodyW = 1.8 * size; bodyL = 4.2 * size; bodyH = 0.45 * size; roofH = 0; // No roof
                break;
            case 'truck':
                bodyW = 2 * size; bodyL = 5 * size; bodyH = 0.7 * size; roofH = 0.5 * size;
                break;
            default: // sedan
                bodyW = 1.8 * size; bodyL = 4.5 * size; bodyH = 0.5 * size; roofH = 0.4 * size;
        }

        const materials = this.getMaterialsForProp('car', variation);

        // Body
        const bodyGeo = new THREE.BoxGeometry(bodyW, bodyH, bodyL);
        const body = new THREE.Mesh(bodyGeo, materials.body);
        body.position.y = bodyH / 2 + 0.3 * size;
        body.castShadow = true;
        group.add(body);

        // Roof
        if (roofH > 0) {
            const roofGeo = new THREE.BoxGeometry(bodyW * 0.85, roofH, bodyL * 0.6);
            const roof = new THREE.Mesh(roofGeo, materials.roof);
            roof.position.set(0, bodyH + roofH / 2 + 0.3 * size, -bodyL * 0.05);
            roof.castShadow = true;
            group.add(roof);
        }

        // Wheels
        const wheelR = 0.35 * size;
        const wheelGeo = new THREE.CylinderGeometry(wheelR, wheelR, 0.15 * size, 16);
        const wheelMat = materials.wheels;
        const wheelOffsetX = bodyW / 2 - 0.1 * size;
        const wheelOffsetZ = bodyL / 2 - 0.4 * size;
        
        for (const [x, z] of [[-wheelOffsetX, -wheelOffsetZ], [wheelOffsetX, -wheelOffsetZ], [-wheelOffsetX, wheelOffsetZ], [wheelOffsetX, wheelOffsetZ]]) {
            const wheel = new THREE.Mesh(wheelGeo, wheelMat);
            wheel.position.set(x, wheelR, z);
            wheel.rotation.z = Math.PI / 2;
            wheel.castShadow = true;
            group.add(wheel);
        }

        // Windows
        const windowMat = materials.windows;
        const windowGeo = new THREE.BoxGeometry(bodyW * 0.8, bodyH * 0.6, 0.02 * size);
        const frontWindow = new THREE.Mesh(windowGeo, windowMat);
        frontWindow.position.set(0, bodyH * 0.8 + 0.3 * size, -bodyL / 2 + 0.01 * size);
        group.add(frontWindow);

        const rearWindow = frontWindow.clone();
        rearWindow.position.z = bodyL / 2 - 0.01 * size;
        group.add(rearWindow);

        // Side windows
        const sideWindowGeo = new THREE.BoxGeometry(0.02 * size, bodyH * 0.6, bodyL * 0.5);
        for (const x of [-bodyW/2 + 0.01, bodyW/2 - 0.01]) {
            const sideWindow = new THREE.Mesh(sideWindowGeo, windowMat);
            sideWindow.position.set(x, bodyH * 0.8 + 0.3 * size, -bodyL * 0.05);
            group.add(sideWindow);
        }

        return group;
    }

    // Tree variations
    createTree(group, variation, size, rand) {
        const THREE = this.THREE;

        let trunkH, trunkR, leafLayers, leafR, leafH;

        switch (variation) {
            case 'pine':
                trunkH = 4 * size; trunkR = 0.2 * size;
                leafLayers = 5; leafR = 1.2 * size; leafH = 1.5 * size;
                break;
            case 'willow':
                trunkH = 3 * size; trunkR = 0.3 * size;
                leafLayers = 8; leafR = 1.5 * size; leafH = 0.3 * size;
                break;
            case 'palm':
                trunkH = 5 * size; trunkR = 0.25 * size;
                leafLayers = 6; leafR = 1.8 * size; leafH = 0.2 * size;
                break;
            case 'birch':
                trunkH = 3.5 * size; trunkR = 0.15 * size;
                leafLayers = 4; leafR = 1 * size; leafH = 1.2 * size;
                break;
            default: // oak
                trunkH = 3 * size; trunkR = 0.3 * size;
                leafLayers = 4; leafR = 1.3 * size; leafH = 1.3 * size;
        }

        const materials = this.getMaterialsForProp('tree', variation);

        // Trunk
        const trunkGeo = new THREE.CylinderGeometry(trunkR * 0.7, trunkR, trunkH, 8);
        const trunk = new THREE.Mesh(trunkGeo, materials.trunk);
        trunk.position.y = trunkH / 2;
        trunk.castShadow = true;
        group.add(trunk);

        // Leaves
        if (variation === 'pine') {
            for (let i = 0; i < leafLayers; i++) {
                const leaves = new THREE.Mesh(
                    new THREE.ConeGeometry(leafR - i * 0.15 * size, leafH, 8),
                    materials.leaves
                );
                leaves.position.y = trunkH + i * leafH * 0.7;
                leaves.castShadow = true;
                group.add(leaves);
            }
        } else if (variation === 'palm') {
            for (let i = 0; i < leafLayers; i++) {
                const leaf = new THREE.Mesh(
                    new THREE.BoxGeometry(leafR * 2, 0.02 * size, leafR * 0.5),
                    materials.leaves
                );
                leaf.position.set(
                    Math.cos(i * Math.PI / 3) * leafR * 0.5,
                    trunkH + i * 0.3 * size,
                    Math.sin(i * Math.PI / 3) * leafR * 0.5
                );
                leaf.rotation.y = i * Math.PI / 3;
                leaf.castShadow = true;
                group.add(leaf);
            }
        } else if (variation === 'willow') {
            for (let i = 0; i < leafLayers; i++) {
                const leaves = new THREE.Mesh(
                    new THREE.SphereGeometry(leafR - i * 0.1 * size, 8, 8),
                    materials.leaves
                );
                leaves.position.y = trunkH - i * leafH;
                leaves.scale.set(1, 0.3, 1);
                leaves.castShadow = true;
                group.add(leaves);
            }
        } else {
            for (let i = 0; i < leafLayers; i++) {
                const leaves = new THREE.Mesh(
                    new THREE.SphereGeometry(leafR - i * 0.15 * size, 8, 8),
                    materials.leaves
                );
                leaves.position.y = trunkH + i * leafH * 0.6;
                leaves.scale.set(1, 0.7, 1);
                leaves.castShadow = true;
                group.add(leaves);
            }
        }

        return group;
    }

    // Book variations
    createBook(group, variation, size, rand) {
        const THREE = this.THREE;

        let w, h, d;

        switch (variation) {
            case 'textbook':
                w = 0.18 * size; h = 0.25 * size; d = 0.04 * size;
                break;
            case 'novel':
                w = 0.13 * size; h = 0.2 * size; d = 0.025 * size;
                break;
            case 'sketchbook':
                w = 0.22 * size; h = 0.3 * size; d = 0.02 * size;
                break;
            case 'dictionary':
                w = 0.2 * size; h = 0.28 * size; d = 0.06 * size;
                break;
            default: // hardcover
                w = 0.15 * size; h = 0.22 * size; d = 0.03 * size;
        }

        const materials = this.getMaterialsForProp('book', variation);

        const bookGeo = new THREE.BoxGeometry(w, h, d);
        const book = new THREE.Mesh(bookGeo, materials.cover);
        book.castShadow = true;
        group.add(book);

        // Pages
        const pagesGeo = new THREE.BoxGeometry(w * 0.98, h * 0.98, d * 0.6);
        const pages = new THREE.Mesh(pagesGeo, materials.pages);
        pages.position.z = d * 0.2;
        group.add(pages);

        // Spine detail
        const spineGeo = new THREE.BoxGeometry(w, h, 0.005 * size);
        const spine = new THREE.Mesh(spineGeo, materials.spine);
        spine.position.z = d / 2 + 0.0025 * size;
        group.add(spine);

        return group;
    }

    // Lamp variations
    createLamp(group, variation, size, rand) {
        const THREE = this.THREE;

        let baseH, shadeH, shadeR;

        switch (variation) {
            case 'floor':
                baseH = 1.5 * size; shadeH = 0.3 * size; shadeR = 0.25 * size;
                break;
            case 'desk':
                baseH = 0.5 * size; shadeH = 0.2 * size; shadeR = 0.15 * size;
                break;
            case 'wall':
                baseH = 0.3 * size; shadeH = 0.2 * size; shadeR = 0.15 * size;
                break;
            case 'fairy':
                baseH = 0.1 * size; shadeH = 0.05 * size; shadeR = 0.03 * size;
                break;
            default: // table
                baseH = 0.5 * size; shadeH = 0.25 * size; shadeR = 0.18 * size;
        }

        const materials = this.getMaterialsForProp('lamp', variation);

        // Base
        const baseGeo = new THREE.CylinderGeometry(0.08 * size, 0.12 * size, baseH, 8);
        const base = new THREE.Mesh(baseGeo, materials.base);
        base.position.y = baseH / 2;
        base.castShadow = true;
        group.add(base);

        // Shade
        const shadeGeo = new THREE.CylinderGeometry(shadeR * 0.7, shadeR, shadeH, 8);
        const shade = new THREE.Mesh(shadeGeo, materials.shade);
        shade.position.y = baseH + shadeH / 2;
        shade.castShadow = true;
        group.add(shade);

        // Light bulb (emissive)
        const bulbGeo = new THREE.SphereGeometry(0.03 * size, 8, 8);
        const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffffcc });
        const bulb = new THREE.Mesh(bulbGeo, bulbMat);
        bulb.position.y = baseH + shadeH * 0.3;
        group.add(bulb);

        // Light source
        const light = new THREE.PointLight(0xffffcc, 1, 5 * size);
        light.position.y = baseH + shadeH * 0.3;
        group.add(light);

        return group;
    }

    // Box variations
    createBox(group, variation, size, rand) {
        const THREE = this.THREE;

        let w, h, d, hasLid;

        switch (variation) {
            case 'crate':
                w = 0.6 * size; h = 0.4 * size; d = 0.5 * size; hasLid = false;
                break;
            case 'gift':
                w = 0.3 * size; h = 0.3 * size; d = 0.3 * size; hasLid = true;
                break;
            case 'shipping':
                w = 0.5 * size; h = 0.4 * size; d = 0.7 * size; hasLid = true;
                break;
            case 'jewelry':
                w = 0.1 * size; h = 0.06 * size; d = 0.15 * size; hasLid = true;
                break;
            case 'toolbox':
                w = 0.4 * size; h = 0.2 * size; d = 0.2 * size; hasLid = true;
                break;
            default: // cardboard
                w = 0.4 * size; h = 0.3 * size; d = 0.4 * size; hasLid = false;
        }

        const materials = this.getMaterialsForProp('box', variation);

        // Main box
        const boxGeo = new THREE.BoxGeometry(w, h, d);
        const box = new THREE.Mesh(boxGeo, materials.box);
        box.position.y = h / 2;
        box.castShadow = true;
        box.receiveShadow = true;
        group.add(box);

        // Lid
        if (hasLid) {
            const lidGeo = new THREE.BoxGeometry(w * 1.02, h * 0.15, d * 1.02);
            const lid = new THREE.Mesh(lidGeo, materials.lid);
            lid.position.y = h + h * 0.075;
            lid.castShadow = true;
            group.add(lid);
        }

        // Straps for shipping box
        if (variation === 'shipping') {
            const strapMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 });
            for (const x of [-w/3, w/3]) {
                const strap = new THREE.Mesh(
                    new THREE.BoxGeometry(0.02 * size, h + 0.02 * size, 0.02 * size),
                    strapMat
                );
                strap.position.set(x, h / 2, 0);
                group.add(strap);
            }
        }

        // Bow for gift
        if (variation === 'gift') {
            const bowGeo = new THREE.BoxGeometry(0.08 * size, 0.03 * size, 0.08 * size);
            const bowMat = new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.5 });
            const bow = new THREE.Mesh(bowGeo, bowMat);
            bow.position.y = h + 0.05 * size;
            group.add(bow);
        }

        return group;
    }

    // Generic prop fallback
    createGenericProp(group, propType, size, rand) {
        const THREE = this.THREE;
        const geo = new THREE.BoxGeometry(1 * size, 1 * size, 1 * size);
        const mat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        group.add(mesh);
        return group;
    }

    // Get materials for prop type and variation
    getMaterialsForProp(propType, variation) {
        const presets = MATERIAL_PRESETS;
        
        // Base material selections per prop type
        const materialMap = {
            chair: {
                seat: presets.wood,
                back: presets.wood,
                legs: presets.wood
            },
            table: {
                top: presets.wood,
                legs: presets.wood
            },
            sofa: {
                frame: presets.wood,
                cushion: presets.fabric,
                legs: presets.wood
            },
            bed: {
                frame: presets.wood,
                mattress: presets.fabric,
                headboard: presets.wood,
                footboard: presets.wood,
                posts: presets.wood,
                canopy: presets.fabric,
                legs: presets.wood
            },
            car: {
                body: presets.metalPolished,
                roof: presets.metalPolished,
                wheels: presets.rubber,
                windows: { ...presets.glass, opacity: 0.3 }
            },
            tree: {
                trunk: presets.woodDark,
                leaves: presets.fabric
            },
            book: {
                cover: presets.leather,
                pages: presets.paper,
                spine: presets.leather
            },
            lamp: {
                base: presets.metal,
                shade: presets.fabricCanvas
            },
            box: {
                box: presets.cardboard,
                lid: presets.cardboard
            }
        };

        const baseMaterials = materialMap[propType] || { 
            default: presets.plastic 
        };

        // Convert to THREE materials
        const materials = {};
        for (const [key, preset] of Object.entries(baseMaterials)) {
            materials[key] = this.createMaterial(preset);
        }

        return materials;
    }

    // Create THREE material from preset
    createMaterial(preset) {
        const THREE = this.THREE;
        const { color, roughness, metalness, transmission, transparent, opacity, ...rest } = preset;
        
        const params = { color, roughness, metalness, ...rest };
        
        if (transparent) {
            params.transparent = true;
            params.opacity = opacity || 1;
        }
        if (transmission) {
            params.transmission = transmission;
        }

        return new THREE.MeshStandardMaterial(params);
    }

    // Apply customizations
    applyCustomizations(prop, propType, customization, rand) {
        const THREE = this.THREE;

        // Color customization
        if (customization.color) {
            const color = typeof customization.color === 'string' 
                ? parseInt(customization.color.replace('#', '0x')) 
                : customization.color;
            prop.traverse(child => {
                if (child.isMesh && child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(m => m.color.setHex(color));
                    } else {
                        child.material.color.setHex(color);
                    }
                }
            });
        }

        // Size already handled in base creation

        // Material customization
        if (customization.material && MATERIAL_PRESETS[customization.material]) {
            const newMat = this.createMaterial(MATERIAL_PRESETS[customization.material]);
            prop.traverse(child => {
                if (child.isMesh && child.material) {
                    child.material.dispose();
                    child.material = newMat.clone();
                }
            });
        }
    }

    // Add variation-specific details
    addVariationDetails(prop, propType, variation, rand) {
        // Add unique details based on variation
        prop.userData.variationDetails = { propType, variation };
    }

    // Generate multiple props with variations
    generatePropSet(propType, count, options = {}) {
        const props = [];
        for (let i = 0; i < count; i++) {
            const seed = options.seed ? options.seed + i : Math.random();
            const variation = options.variations 
                ? options.variations[i % options.variations.length] 
                : (PROP_VARIATIONS[propType]?.variations?.[i % (PROP_VARIATIONS[propType]?.variations?.length || 1)] || 'default');
            
            const prop = this.generateProp(propType, {
                ...options,
                variation,
                seed
            });
            props.push(prop);
        }
        return props;
    }

    // Add prop to scene via SceneAssetManager
    addPropToScene(propType, sceneIndex, options = {}) {
        const prop = this.generateProp(propType, options);
        if (prop && this.three.assetManager) {
            const instanceId = this.three.assetManager.addAsset(propType, {
                position: options.position || new THREE.Vector3(0, -4.5, -10),
                rotation: options.rotation || new THREE.Euler(0, 0, 0),
                scale: options.scale || new THREE.Vector3(1, 1, 1),
                customization: options.customization || {},
                variation: options.variation || 'default'
            });
            return instanceId;
        }
        return null;
    }
}

// ========================================
// Prop Customization UI Data
// ========================================

export const PROP_CUSTOMIZATION_OPTIONS = {
    color: {
        type: 'color',
        label: 'रंग',
        default: '#8b4513'
    },
    material: {
        type: 'select',
        label: 'सामग्री',
        options: Object.entries(MATERIAL_PRESETS).map(([key, val]) => ({ value: key, label: val.name })),
        default: 'wood'
    },
    size: {
        type: 'range',
        label: 'आकार',
        min: 0.5,
        max: 2,
        step: 0.1,
        default: 1
    },
    variation: {
        type: 'select',
        label: 'वेरिएशन',
        options: [], // Filled dynamically based on prop type
        default: 'default'
    }
};

// ========================================
// Export
// ========================================

// All exports are already declared with 'export' keyword above
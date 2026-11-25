/**
 * 3D Asset Library System
 * Procedural 3D assets for paper-cutout animation studio
 * Uses only Three.js primitives - no external models needed
 */

import * as THREE from 'three';

// ========================================
// Asset Categories and Definitions
// ========================================

export const ASSET_CATEGORIES = [
    { id: 'furniture', name: 'फर्नीचर', icon: '🪑', color: '#8B4513' },
    { id: 'household', name: 'घरेलू सामान', icon: '🏠', color: '#DEB887' },
    { id: 'vehicles', name: 'वाहन', icon: '🚗', color: '#4682B4' },
    { id: 'nature', name: 'प्रकृति', icon: '🌳', color: '#228B22' },
    { id: 'food', name: 'भोजन', icon: '🍎', color: '#FF6347' },
    { id: 'tools', name: 'उपकरण', icon: '🔧', color: '#708090' },
    { id: 'school', name: 'स्कूल', icon: '🏫', color: '#FFD700' },
    { id: 'medical', name: 'चिकित्सा', icon: '🏥', color: '#DC143C' },
    { id: 'outdoor', name: 'आउटडोर', icon: '🏞️', color: '#32CD32' },
    { id: 'animals', name: 'जानवर', icon: '🐕', color: '#8B7355' },
    { id: 'buildings', name: 'इमारतें', icon: '🏢', color: '#A9A9A9' },
    { id: 'props', name: 'प्रॉप्स', icon: '📦', color: '#DDA0DD' }
];

// Paper material for assets
const createPaperMaterial = (color, options = {}) => new THREE.MeshStandardMaterial({
    color,
    roughness: 0.95,
    metalness: 0.0,
    flatShading: true,
    ...options
});

// ========================================
// Asset Builders
// ========================================

const AssetBuilders = {
    // FURNITURE
    chair: () => {
        const group = new THREE.Group();
        const mat = createPaperMaterial(0x8B4513);
        // Seat
        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 0.8), mat);
        seat.position.y = 0.45;
        seat.castShadow = true;
        group.add(seat);
        // Back
        const back = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.1), mat);
        back.position.set(0, 0.85, -0.35);
        back.castShadow = true;
        group.add(back);
        // Legs
        for (const [x, z] of [[-0.35, -0.35], [0.35, -0.35], [-0.35, 0.35], [0.35, 0.35]]) {
            const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.08), mat);
            leg.position.set(x, 0.225, z);
            leg.castShadow = true;
            group.add(leg);
        }
        group.userData = { name: 'कुर्सी', category: 'furniture', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    table: () => {
        const group = new THREE.Group();
        const mat = createPaperMaterial(0xA0522D);
        // Top
        const top = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.08, 1), mat);
        top.position.y = 0.75;
        top.castShadow = true;
        top.receiveShadow = true;
        group.add(top);
        // Legs
        for (const [x, z] of [[-0.65, -0.4], [0.65, -0.4], [-0.65, 0.4], [0.65, 0.4]]) {
            const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.75, 0.08), mat);
            leg.position.set(x, 0.375, z);
            leg.castShadow = true;
            group.add(leg);
        }
        group.userData = { name: 'टेबल', category: 'furniture', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    bed: () => {
        const group = new THREE.Group();
        const frameMat = createPaperMaterial(0x8B4513);
        const mattressMat = createPaperMaterial(0xFFFFFF);
        // Frame base
        const base = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 2), frameMat);
        base.position.y = 0.15;
        base.castShadow = true;
        base.receiveShadow = true;
        group.add(base);
        // Mattress
        const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.2, 1.9), mattressMat);
        mattress.position.y = 0.45;
        mattress.castShadow = true;
        group.add(mattress);
        // Headboard
        const headboard = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.1), frameMat);
        headboard.position.set(0, 0.55, -1);
        headboard.castShadow = true;
        group.add(headboard);
        group.userData = { name: 'बिस्तर', category: 'furniture', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    sofa: () => {
        const group = new THREE.Group();
        const mat = createPaperMaterial(0x654321);
        const cushionMat = createPaperMaterial(0x8B4513);
        // Base
        const base = new THREE.Mesh(new THREE.BoxGeometry(2, 0.4, 0.9), mat);
        base.position.y = 0.2;
        base.castShadow = true;
        base.receiveShadow = true;
        group.add(base);
        // Seat cushion
        const seat = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.15, 0.85), cushionMat);
        seat.position.y = 0.475;
        seat.castShadow = true;
        group.add(seat);
        // Back cushion
        const back = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.5, 0.15), cushionMat);
        back.position.set(0, 0.725, -0.325);
        back.castShadow = true;
        group.add(back);
        // Armrests
        for (const x of [-0.95, 0.95]) {
            const arm = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.4, 0.9), mat);
            arm.position.set(x, 0.4, 0);
            arm.castShadow = true;
            group.add(arm);
        }
        group.userData = { name: 'सोफा', category: 'furniture', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    bookshelf: () => {
        const group = new THREE.Group();
        const mat = createPaperMaterial(0x8B4513);
        // Frame
        const frame = new THREE.Mesh(new THREE.BoxGeometry(1, 1.8, 0.35), mat);
        frame.position.y = 0.9;
        frame.castShadow = true;
        group.add(frame);
        // Shelves
        for (let i = 0; i < 4; i++) {
            const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.03, 0.3), mat);
            shelf.position.set(0, 0.15 + i * 0.4, 0);
            shelf.castShadow = true;
            shelf.receiveShadow = true;
            group.add(shelf);
        }
        // Books on shelves
        const bookMat = createPaperMaterial(0x8B0000);
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 3; j++) {
                const book = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.25, 0.03), bookMat);
                book.position.set(-0.3 + j * 0.3, 0.28 + i * 0.4, -0.1);
                book.rotation.y = Math.random() * 0.2 - 0.1;
                group.add(book);
            }
        }
        group.userData = { name: 'बुकशेल्फ', category: 'furniture', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    desk: () => {
        const group = new THREE.Group();
        const mat = createPaperMaterial(0x8B4513);
        // Top
        const top = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.7), mat);
        top.position.y = 0.72;
        top.castShadow = true;
        top.receiveShadow = true;
        group.add(top);
        // Legs
        for (const [x, z] of [[-0.55, -0.3], [0.55, -0.3], [-0.55, 0.3], [0.55, 0.3]]) {
            const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.72, 0.06), mat);
            leg.position.set(x, 0.36, z);
            leg.castShadow = true;
            group.add(leg);
        }
        // Drawer
        const drawer = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.5), mat);
        drawer.position.set(-0.35, 0.52, 0);
        drawer.castShadow = true;
        group.add(drawer);
        group.userData = { name: 'डेस्क', category: 'furniture', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    wardrobe: () => {
        const group = new THREE.Group();
        const mat = createPaperMaterial(0x8B4513);
        // Main body
        const body = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 0.55), mat);
        body.position.y = 1;
        body.castShadow = true;
        group.add(body);
        // Doors
        for (const x of [-0.3, 0.3]) {
            const door = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.9, 0.06), mat);
            door.position.set(x, 1, 0.255);
            door.castShadow = true;
            group.add(door);
        }
        group.userData = { name: 'अलमारी', category: 'furniture', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    // HOUSEHOLD
    lamp: () => {
        const group = new THREE.Group();
        const baseMat = createPaperMaterial(0x8B4513);
        const shadeMat = createPaperMaterial(0xFFF8DC);
        // Base
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 0.4, 8), baseMat);
        base.position.y = 0.2;
        base.castShadow = true;
        group.add(base);
        // Stem
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8), baseMat);
        stem.position.y = 0.6;
        stem.castShadow = true;
        group.add(stem);
        // Shade
        const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.15, 0.3, 8), shadeMat);
        shade.position.y = 1.05;
        shade.castShadow = true;
        group.add(shade);
        group.userData = { name: 'लैंप', category: 'household', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    tv: () => {
        const group = new THREE.Group();
        const mat = createPaperMaterial(0x1a1a1a);
        const screenMat = createPaperMaterial(0x001122);
        // Stand
        const stand = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 0.2), mat);
        stand.position.y = 0.025;
        stand.castShadow = true;
        group.add(stand);
        // Screen
        const screen = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.55, 0.05), screenMat);
        screen.position.y = 0.325;
        screen.castShadow = true;
        group.add(screen);
        // Bezel
        const bezel = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.6, 0.06), mat);
        bezel.position.y = 0.325;
        bezel.castShadow = true;
        group.add(bezel);
        group.userData = { name: 'टीवी', category: 'household', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    fridge: () => {
        const group = new THREE.Group();
        const mat = createPaperMaterial(0xE0E0E0);
        // Body
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.8, 0.7), mat);
        body.position.y = 0.9;
        body.castShadow = true;
        group.add(body);
        // Handle
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8), createPaperMaterial(0x888888));
        handle.position.set(0.36, 1, 0);
        handle.rotation.z = Math.PI / 2;
        group.add(handle);
        group.userData = { name: 'फ्रिज', category: 'household', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    stove: () => {
        const group = new THREE.Group();
        const mat = createPaperMaterial(0x333333);
        const burnerMat = createPaperMaterial(0x111111);
        const knobMat = createPaperMaterial(0x888888);
        // Body
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.85, 0.55), mat);
        body.position.y = 0.425;
        body.castShadow = true;
        group.add(body);
        // Burners
        for (const [x, z] of [[-0.18, -0.12], [0.18, -0.12], [-0.18, 0.12], [0.18, 0.12]]) {
            const burner = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.02, 12), burnerMat);
            burner.position.set(x, 0.86, z);
            group.add(burner);
        }
        // Knobs
        for (const x of [-0.25, 0.25]) {
            const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.04, 8), knobMat);
            knob.position.set(x, 0.87, 0.28);
            knob.rotation.x = Math.PI / 2;
            group.add(knob);
        }
        group.userData = { name: 'स्टोव', category: 'household', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    sink: () => {
        const group = new THREE.Group();
        const counterMat = createPaperMaterial(0xCCCCCC);
        const basinMat = createPaperMaterial(0xE8F0FE);
        const faucetMat = createPaperMaterial(0xAAAAAA);
        // Counter
        const counter = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.05, 0.5), counterMat);
        counter.position.y = 0.825;
        counter.castShadow = true;
        counter.receiveShadow = true;
        group.add(counter);
        // Basin
        const basin = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.2, 0.35), basinMat);
        basin.position.set(0, 0.7, 0);
        group.add(basin);
        // Faucet
        const faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.15, 8), faucetMat);
        faucet.position.set(0, 0.95, 0.1);
        group.add(faucet);
        const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.1, 8), faucetMat);
        spout.position.set(0, 0.85, 0.18);
        spout.rotation.x = -Math.PI / 3;
        group.add(spout);
        group.userData = { name: 'सिंक', category: 'household', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    washingMachine: () => {
        const group = new THREE.Group();
        const mat = createPaperMaterial(0xFFFFFF);
        const doorMat = createPaperMaterial(0x87CEEB);
        // Body
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.85, 0.55), mat);
        body.position.y = 0.425;
        body.castShadow = true;
        group.add(body);
        // Door
        const door = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.04, 24, 1, true, 0, Math.PI), doorMat);
        door.position.set(0, 0.425, 0.295);
        door.rotation.x = Math.PI / 2;
        group.add(door);
        // Control panel
        const panel = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.15, 0.03), createPaperMaterial(0x333333));
        panel.position.set(0, 0.75, 0.29);
        group.add(panel);
        group.userData = { name: 'वॉशिंग मशीन', category: 'household', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    // VEHICLES
    car: () => {
        const group = new THREE.Group();
        const bodyMat = createPaperMaterial(0xFF0000);
        const windowMat = createPaperMaterial(0x87CEEB, { transparent: true, opacity: 0.5 });
        const wheelMat = createPaperMaterial(0x111111);
        // Body
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.5, 0.9), bodyMat);
        body.position.y = 0.35;
        body.castShadow = true;
        group.add(body);
        // Roof
        const roof = new THREE.Mesh(new THREE.BoxGeometry(1, 0.4, 0.8), bodyMat);
        roof.position.set(-0.1, 0.7, 0);
        roof.castShadow = true;
        group.add(roof);
        // Windows
        const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.35, 0.02), windowMat);
        windshield.position.set(0.15, 0.725, 0.41);
        windshield.rotation.x = -0.3;
        group.add(windshield);
        // Wheels
        for (const [x, z] of [[-0.7, -0.5], [0.7, -0.5], [-0.7, 0.5], [0.7, 0.5]]) {
            const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.1, 12), wheelMat);
            wheel.position.set(x, 0.25, z);
            wheel.rotation.z = Math.PI / 2;
            wheel.castShadow = true;
            group.add(wheel);
        }
        group.userData = { name: 'कार', category: 'vehicles', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    bicycle: () => {
        const group = new THREE.Group();
        const frameMat = createPaperMaterial(0x333333);
        const wheelMat = createPaperMaterial(0x111111);
        const seatMat = createPaperMaterial(0x222222);
        // Frame
        const frame = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.2, 8), frameMat);
        frame.position.set(0, 0.5, 0);
        group.add(frame);
        // Wheels
        for (const x of [-0.6, 0.6]) {
            const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.04, 16), wheelMat);
            wheel.position.set(x, 0.35, 0);
            wheel.rotation.z = Math.PI / 2;
            wheel.castShadow = true;
            group.add(wheel);
            // Spokes
            for (let i = 0; i < 8; i++) {
                const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.3, 4), frameMat);
                spoke.position.set(x, 0.35, 0);
                spoke.rotation.z = Math.PI / 2 + (i * Math.PI / 4);
                group.add(spoke);
            }
        }
        // Seat
        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.03, 0.15), seatMat);
        seat.position.set(-0.1, 0.8, 0);
        group.add(seat);
        // Handlebars
        const handlebar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8), frameMat);
        handlebar.position.set(0.55, 0.85, 0);
        handlebar.rotation.z = Math.PI / 2;
        group.add(handlebar);
        group.userData = { name: 'साइकिल', category: 'vehicles', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    motorcycle: () => {
        const group = new THREE.Group();
        const bodyMat = createPaperMaterial(0xFF0000);
        const wheelMat = createPaperMaterial(0x111111);
        const engineMat = createPaperMaterial(0x333333);
        // Body
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 0.3), bodyMat);
        body.position.y = 0.5;
        body.castShadow = true;
        group.add(body);
        // Seat
        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.05, 0.25), createPaperMaterial(0x111111));
        seat.position.set(-0.2, 0.7, 0);
        group.add(seat);
        // Engine
        const engine = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), engineMat);
        engine.position.set(0.2, 0.35, 0);
        group.add(engine);
        // Wheels
        for (const x of [-0.55, 0.55]) {
            const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.08, 12), wheelMat);
            wheel.position.set(x, 0.25, 0);
            wheel.rotation.z = Math.PI / 2;
            wheel.castShadow = true;
            group.add(wheel);
        }
        // Handlebars
        const handlebar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8), engineMat);
        handlebar.position.set(0.5, 0.8, 0);
        handlebar.rotation.z = Math.PI / 2;
        group.add(handlebar);
        group.userData = { name: 'मोटरसाइकिल', category: 'vehicles', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    bus: () => {
        const group = new THREE.Group();
        const bodyMat = createPaperMaterial(0xFFFF00);
        const windowMat = createPaperMaterial(0x87CEEB, { transparent: true, opacity: 0.5 });
        const wheelMat = createPaperMaterial(0x111111);
        // Body
        const body = new THREE.Mesh(new THREE.BoxGeometry(3, 1.2, 1), bodyMat);
        body.position.y = 0.7;
        body.castShadow = true;
        group.add(body);
        // Windows
        for (let i = 0; i < 6; i++) {
            const window = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.6, 0.02), windowMat);
            window.position.set(-1.2 + i * 0.5, 0.7, 0.51);
            group.add(window);
        }
        // Windshield
        const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 0.02), windowMat);
        windshield.position.set(1.3, 0.7, 0);
        windshield.rotation.y = -0.3;
        group.add(windshield);
        // Wheels
        for (const [x, z] of [[-1.1, -0.5], [1.1, -0.5], [-1.1, 0.5], [1.1, 0.5]]) {
            const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.1, 12), wheelMat);
            wheel.position.set(x, 0.35, z);
            wheel.rotation.z = Math.PI / 2;
            wheel.castShadow = true;
            group.add(wheel);
        }
        group.userData = { name: 'बस', category: 'vehicles', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    truck: () => {
        const group = new THREE.Group();
        const cabMat = createPaperMaterial(0xFF0000);
        const bedMat = createPaperMaterial(0x8B4513);
        const wheelMat = createPaperMaterial(0x111111);
        // Cab
        const cab = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), cabMat);
        cab.position.set(1.8, 0.6, 0);
        cab.castShadow = true;
        group.add(cab);
        // Windshield
        const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.6, 0.8), createPaperMaterial(0x87CEEB, { transparent: true, opacity: 0.5 }));
        windshield.position.set(2.3, 0.6, 0);
        group.add(windshield);
        // Bed
        const bed = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.5, 1), bedMat);
        bed.position.set(-0.25, 0.65, 0);
        bed.castShadow = true;
        group.add(bed);
        // Wheels
        for (const [x, z] of [[1.8, -0.5], [1.8, 0.5], [-0.7, -0.5], [-0.7, 0.5], [0.5, -0.5], [0.5, 0.5]]) {
            const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.1, 12), wheelMat);
            wheel.position.set(x, 0.3, z);
            wheel.rotation.z = Math.PI / 2;
            wheel.castShadow = true;
            group.add(wheel);
        }
        group.userData = { name: 'ट्रक', category: 'vehicles', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    autoRickshaw: () => {
        const group = new THREE.Group();
        const bodyMat = createPaperMaterial(0x00AA00);
        const wheelMat = createPaperMaterial(0x111111);
        const roofMat = createPaperMaterial(0x008800);
        // Body
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 0.9), bodyMat);
        body.position.y = 0.4;
        body.castShadow = true;
        group.add(body);
        // Seat
        const seat = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.1, 0.8), createPaperMaterial(0x222222));
        seat.position.y = 0.65;
        group.add(seat);
        // Roof
        const roof = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 0.9), roofMat);
        roof.position.y = 0.95;
        roof.castShadow = true;
        group.add(roof);
        // Wheels
        for (const [x, z] of [[-0.5, -0.45], [0.5, -0.45], [0, 0.45]]) {
            const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 12), wheelMat);
            wheel.position.set(x, 0.2, z);
            wheel.rotation.z = Math.PI / 2;
            wheel.castShadow = true;
            group.add(wheel);
        }
        // Handlebar
        const handlebar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8), createPaperMaterial(0x333333));
        handlebar.position.set(-0.5, 0.7, 0);
        handlebar.rotation.z = Math.PI / 2;
        group.add(handlebar);
        group.userData = { name: 'ऑटो रिक्शा', category: 'vehicles', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    // NATURE
    tree: () => {
        const group = new THREE.Group();
        const trunkMat = createPaperMaterial(0x8B4513);
        const leafMat = createPaperMaterial(0x228B22);
        // Trunk
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 1, 8), trunkMat);
        trunk.position.y = 0.5;
        trunk.castShadow = true;
        group.add(trunk);
        // Leaves (multiple layers)
        for (let i = 0; i < 3; i++) {
            const leaves = new THREE.Mesh(new THREE.ConeGeometry(0.6 - i * 0.1, 0.8, 8), leafMat);
            leaves.position.y = 1.3 + i * 0.5;
            leaves.castShadow = true;
            group.add(leaves);
        }
        group.userData = { name: 'पेड़', category: 'nature', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    pineTree: () => {
        const group = new THREE.Group();
        const trunkMat = createPaperMaterial(0x8B4513);
        const leafMat = createPaperMaterial(0x006400);
        // Trunk
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.15, 1.2, 8), trunkMat);
        trunk.position.y = 0.6;
        trunk.castShadow = true;
        group.add(trunk);
        // Pine layers
        for (let i = 0; i < 4; i++) {
            const leaves = new THREE.Mesh(new THREE.ConeGeometry(0.7 - i * 0.12, 0.7, 8), leafMat);
            leaves.position.y = 1.2 + i * 0.5;
            leaves.castShadow = true;
            group.add(leaves);
        }
        group.userData = { name: 'पाइन ट्री', category: 'nature', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    flower: () => {
        const group = new THREE.Group();
        const stemMat = createPaperMaterial(0x228B22);
        const petalMat = createPaperMaterial(0xFF69B4);
        const centerMat = createPaperMaterial(0xFFD700);
        // Stem
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8), stemMat);
        stem.position.y = 0.2;
        group.add(stem);
        // Leaves
        for (const [x, z, rot] of [[0.08, 0, 0], [-0.08, 0, Math.PI], [0, 0.08, Math.PI/2], [0, -0.08, -Math.PI/2]]) {
            const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.01, 0.04), stemMat);
            leaf.position.set(x, 0.15, z);
            leaf.rotation.y = rot;
            group.add(leaf);
        }
        // Petals
        for (let i = 0; i < 6; i++) {
            const petal = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.15, 4), petalMat);
            petal.position.set(0, 0.45, 0);
            petal.rotation.y = i * Math.PI / 3;
            petal.rotation.x = -Math.PI / 4;
            group.add(petal);
        }
        // Center
        const center = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), centerMat);
        center.position.y = 0.45;
        group.add(center);
        group.userData = { name: 'फूल', category: 'nature', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    grass: () => {
        const group = new THREE.Group();
        const mat = createPaperMaterial(0x228B22);
        // Multiple grass blades
        for (let i = 0; i < 20; i++) {
            const blade = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.15 + Math.random() * 0.1, 0.01), mat);
            blade.position.set(
                (Math.random() - 0.5) * 0.5,
                0.075 + Math.random() * 0.05,
                (Math.random() - 0.5) * 0.5
            );
            blade.rotation.y = Math.random() * Math.PI;
            blade.castShadow = true;
            group.add(blade);
        }
        group.userData = { name: 'घास', category: 'nature', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    bush: () => {
        const group = new THREE.Group();
        const mat = createPaperMaterial(0x228B22);
        // Multiple spheres for bush shape
        for (let i = 0; i < 8; i++) {
            const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), mat);
            sphere.position.set(
                (Math.random() - 0.5) * 0.6,
                0.15 + Math.random() * 0.2,
                (Math.random() - 0.5) * 0.6
            );
            sphere.scale.set(1, 0.6, 1);
            sphere.castShadow = true;
            group.add(sphere);
        }
        group.userData = { name: 'झाड़ी', category: 'nature', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    rock: () => {
        const group = new THREE.Group();
        const mat = createPaperMaterial(0x808080);
        // Irregular rock shape using multiple boxes
        for (let i = 0; i < 6; i++) {
            const rock = new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.3 + Math.random() * 0.3,
                    0.15 + Math.random() * 0.2,
                    0.3 + Math.random() * 0.3
                ),
                mat
            );
            rock.position.set(
                (Math.random() - 0.5) * 0.3,
                0.075 + Math.random() * 0.1,
                (Math.random() - 0.5) * 0.3
            );
            rock.rotation.set(Math.random() * 0.5, Math.random() * Math.PI, Math.random() * 0.5);
            rock.castShadow = true;
            group.add(rock);
        }
        group.userData = { name: 'पत्थर', category: 'nature', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    // FOOD
    apple: () => {
        const group = new THREE.Group();
        const fruitMat = createPaperMaterial(0xFF0000);
        const stemMat = createPaperMaterial(0x8B4513);
        const leafMat = createPaperMaterial(0x228B22);
        // Apple body
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), fruitMat);
        body.position.y = 0.15;
        body.scale.set(1, 0.9, 1);
        body.castShadow = true;
        group.add(body);
        // Stem
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.05, 8), stemMat);
        stem.position.y = 0.3;
        group.add(stem);
        // Leaf
        const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.005, 0.03), leafMat);
        leaf.position.set(0.02, 0.3, 0);
        leaf.rotation.z = -0.3;
        group.add(leaf);
        group.userData = { name: 'सेब', category: 'food', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    banana: () => {
        const group = new THREE.Group();
        const mat = createPaperMaterial(0xFFFF00);
        // Curved banana using multiple segments
        for (let i = 0; i < 5; i++) {
            const segment = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.12, 8), mat);
            segment.position.set(Math.sin(i * 0.4) * 0.1, 0.1 + i * 0.1, 0);
            segment.rotation.z = -i * 0.2;
            segment.castShadow = true;
            group.add(segment);
        }
        group.userData = { name: 'केला', category: 'food', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    bread: () => {
        const group = new THREE.Group();
        const mat = createPaperMaterial(0xD2B48C);
        const crustMat = createPaperMaterial(0x8B4513);
        // Loaf
        const loaf = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.3, 0.25), mat);
        loaf.position.y = 0.15;
        loaf.castShadow = true;
        group.add(loaf);
        // Crust top
        const crust = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.03, 0.27), crustMat);
        crust.position.y = 0.315;
        group.add(crust);
        // Slices lines
        for (let i = 1; i < 4; i++) {
            const line = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.01, 0.25), crustMat);
            line.position.set(0, 0.15 + i * 0.07, 0);
            group.add(line);
        }
        group.userData = { name: 'रोटी', category: 'food', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    pizza: () => {
        const group = new THREE.Group();
        const doughMat = createPaperMaterial(0xDEB887);
        const sauceMat = createPaperMaterial(0xCC0000);
        const cheeseMat = createPaperMaterial(0xFFF8DC);
        const toppingMat = createPaperMaterial(0x8B0000);
        // Dough
        const dough = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.03, 24), doughMat);
        dough.position.y = 0.015;
        dough.castShadow = true;
        dough.receiveShadow = true;
        group.add(dough);
        // Sauce
        const sauce = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.01, 24), sauceMat);
        sauce.position.y = 0.035;
        group.add(sauce);
        // Cheese
        const cheese = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.01, 24), cheeseMat);
        cheese.position.y = 0.045;
        group.add(cheese);
        // Toppings
        for (let i = 0; i < 8; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 0.15;
            const topping = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.015, 8), toppingMat);
            topping.position.set(Math.cos(angle) * radius, 0.055, Math.sin(angle) * radius);
            group.add(topping);
        }
        group.userData = { name: 'पिज्जा', category: 'food', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    iceCream: () => {
        const group = new THREE.Group();
        const coneMat = createPaperMaterial(0xD2691E);
        const iceMat = createPaperMaterial(0xFFB6C1);
        // Cone
        const cone = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.2, 8), coneMat);
        cone.position.y = 0.1;
        cone.castShadow = true;
        group.add(cone);
        // Ice cream scoops
        for (let i = 0; i < 2; i++) {
            const scoop = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), iceMat);
            scoop.position.y = 0.25 + i * 0.15;
            scoop.scale.set(1, 0.8, 1);
            scoop.castShadow = true;
            group.add(scoop);
        }
        group.userData = { name: 'आइसक्रीम', category: 'food', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    // TOOLS
    hammer: () => {
        const group = new THREE.Group();
        const headMat = createPaperMaterial(0x808080);
        const handleMat = createPaperMaterial(0x8B4513);
        // Head
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.08), headMat);
        head.position.set(0.1, 0, 0);
        head.castShadow = true;
        group.add(head);
        // Handle
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.3, 8), handleMat);
        handle.position.set(-0.15, 0, 0);
        handle.rotation.z = Math.PI / 2;
        group.add(handle);
        group.userData = { name: 'हथौड़ा', category: 'tools', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    wrench: () => {
        const group = new THREE.Group();
        const mat = createPaperMaterial(0x808080);
        // Handle
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8), mat);
        handle.rotation.z = Math.PI / 2;
        group.add(handle);
        // Jaw
        const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.05, 0.03), mat);
        jaw.position.set(0.15, 0, 0);
        jaw.castShadow = true;
        group.add(jaw);
        // Adjustment wheel
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.02, 12), mat);
        wheel.position.set(0.1, 0, 0);
        wheel.rotation.x = Math.PI / 2;
        group.add(wheel);
        group.userData = { name: 'रिंच', category: 'tools', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    saw: () => {
        const group = new THREE.Group();
        const bladeMat = createPaperMaterial(0x808080);
        const handleMat = createPaperMaterial(0x8B4513);
        // Blade
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.01), bladeMat);
        blade.position.y = 0.05;
        blade.castShadow = true;
        group.add(blade);
        // Teeth
        for (let i = 0; i < 10; i++) {
            const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.03, 0.01), bladeMat);
            tooth.position.set(-0.14 + i * 0.03, 0.115, 0);
            group.add(tooth);
        }
        // Handle
        const handle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.03), handleMat);
        handle.position.set(-0.18, -0.05, 0);
        group.add(handle);
        group.userData = { name: 'आरी', category: 'tools', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    screwdriver: () => {
        const group = new THREE.Group();
        const shaftMat = createPaperMaterial(0x808080);
        const handleMat = createPaperMaterial(0xFF0000);
        // Shaft
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.2, 8), shaftMat);
        shaft.position.y = 0.1;
        group.add(shaft);
        // Handle
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.1, 8), handleMat);
        handle.position.y = -0.05;
        group.add(handle);
        // Tip
        const tip = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.005, 0.01), shaftMat);
        tip.position.y = 0.21;
        group.add(tip);
        group.userData = { name: 'स्क्रूड्राइवर', category: 'tools', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    paintbrush: () => {
        const group = new THREE.Group();
        const handleMat = createPaperMaterial(0x8B4513);
        const ferruleMat = createPaperMaterial(0x808080);
        const bristleMat = createPaperMaterial(0xFFFFFF);
        // Handle
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.25, 8), handleMat);
        handle.position.y = 0.125;
        group.add(handle);
        // Ferrule
        const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.02, 8), ferruleMat);
        ferrule.position.y = 0.26;
        group.add(ferrule);
        // Bristles
        for (let i = 0; i < 20; i++) {
            const bristle = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.002, 0.04, 4), bristleMat);
            bristle.position.set(
                (Math.random() - 0.5) * 0.02,
                0.29,
                (Math.random() - 0.5) * 0.02
            );
            group.add(bristle);
        }
        group.userData = { name: 'पेंटब्रश', category: 'tools', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    // SCHOOL
    book: () => {
        const group = new THREE.Group();
        const coverMat = createPaperMaterial(0x8B0000);
        const pageMat = createPaperMaterial(0xF5F5DC);
        // Cover
        const cover = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.22, 0.02), coverMat);
        cover.position.y = 0.11;
        cover.castShadow = true;
        group.add(cover);
        // Pages
        for (let i = 0; i < 5; i++) {
            const page = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.2, 0.005), pageMat);
            page.position.set(0, 0.1, -0.01 + i * 0.003);
            group.add(page);
        }
        // Spine
        const spine = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.22, 0.01), coverMat);
        spine.position.z = -0.01;
        group.add(spine);
        group.userData = { name: 'किताब', category: 'school', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    pencil: () => {
        const group = new THREE.Group();
        const bodyMat = createPaperMaterial(0xFFD700);
        const tipMat = createPaperMaterial(0x8B4513);
        const leadMat = createPaperMaterial(0x000000);
        const eraserMat = createPaperMaterial(0xFF69B4);
        // Body
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.18, 8), bodyMat);
        body.position.y = 0.09;
        group.add(body);
        // Tip
        const tip = new THREE.Mesh(new THREE.ConeGeometry(0.015, 0.03, 8), tipMat);
        tip.position.y = 0.005;
        group.add(tip);
        // Lead
        const lead = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.01, 8), leadMat);
        lead.position.y = -0.025;
        group.add(lead);
        // Eraser
        const eraser = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.015, 8), eraserMat);
        eraser.position.y = 0.19;
        group.add(eraser);
        group.userData = { name: 'पेंसिल', category: 'school', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    backpack: () => {
        const group = new THREE.Group();
        const mat = createPaperMaterial(0x000080);
        const strapMat = createPaperMaterial(0x000060);
        // Main body
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.45, 0.15), mat);
        body.position.y = 0.225;
        body.castShadow = true;
        group.add(body);
        // Pocket
        const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.15, 0.03), mat);
        pocket.position.set(0, 0.05, 0.09);
        group.add(pocket);
        // Straps
        for (const x of [-0.12, 0.12]) {
            const strap = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.4, 0.02), strapMat);
            strap.position.set(x, 0.2, 0.08);
            group.add(strap);
        }
        group.userData = { name: 'बैगपैक', category: 'school', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    globe: () => {
        const group = new THREE.Group();
        const sphereMat = createPaperMaterial(0x87CEEB);
        const landMat = createPaperMaterial(0x228B22);
        const standMat = createPaperMaterial(0x8B4513);
        // Sphere
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), sphereMat);
        sphere.position.y = 0.25;
        sphere.castShadow = true;
        group.add(sphere);
        // Land masses (simplified)
        for (let i = 0; i < 5; i++) {
            const land = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), landMat);
            land.position.set(
                Math.cos(i * 1.5) * 0.12,
                0.25 + Math.sin(i * 1.2) * 0.1,
                Math.sin(i * 1.5) * 0.12
            );
            land.scale.set(1, 0.5, 1);
            group.add(land);
        }
        // Stand
        const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.15, 8), standMat);
        stand.position.y = 0.075;
        group.add(stand);
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.1, 8), standMat);
        arm.position.set(0, 0.175, 0);
        arm.rotation.x = Math.PI / 2;
        group.add(arm);
        group.userData = { name: 'ग्लोब', category: 'school', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    chalkboard: () => {
        const group = new THREE.Group();
        const frameMat = createPaperMaterial(0x8B4513);
        const boardMat = createPaperMaterial(0x1B4D3E);
        // Frame
        const frame = new THREE.Mesh(new THREE.BoxGeometry(1, 0.7, 0.04), frameMat);
        frame.position.y = 0.35;
        frame.castShadow = true;
        group.add(frame);
        // Board
        const board = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.65, 0.02), boardMat);
        board.position.set(0, 0.35, 0.03);
        group.add(board);
        // Chalk tray
        const tray = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.03, 0.05), frameMat);
        tray.position.set(0, 0, 0.045);
        tray.castShadow = true;
        tray.receiveShadow = true;
        group.add(tray);
        group.userData = { name: 'चॉकबोर्ड', category: 'school', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    // MEDICAL
    stethoscope: () => {
        const group = new THREE.Group();
        const tubeMat = createPaperMaterial(0x333333);
        const metalMat = createPaperMaterial(0xC0C0C0);
        // Tubes
        for (const x of [-0.08, 0.08]) {
            const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.2, 8), tubeMat);
            tube.position.set(x, 0.1, 0);
            group.add(tube);
        }
        // Y-piece
        const yPiece = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.03, 8), metalMat);
        yPiece.position.y = 0.215;
        group.add(yPiece);
        // Chest piece
        const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.02, 12), metalMat);
        chest.position.y = 0.24;
        group.add(chest);
        // Ear pieces
        for (const x of [-0.08, 0.08]) {
            const ear = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.04, 8), metalMat);
            ear.position.set(x, -0.1, 0);
            ear.rotation.x = Math.PI / 2;
            group.add(ear);
        }
        group.userData = { name: 'स्टेथोस्कोप', category: 'medical', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    syringe: () => {
        const group = new THREE.Group();
        const barrelMat = createPaperMaterial(0xE8F0FE, { transparent: true, opacity: 0.7 });
        const plungerMat = createPaperMaterial(0x333333);
        const needleMat = createPaperMaterial(0xC0C0C0);
        // Barrel
        const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.12, 12), barrelMat);
        barrel.position.y = 0.06;
        group.add(barrel);
        // Plunger
        const plunger = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.15, 12), plungerMat);
        plunger.position.y = 0.135;
        group.add(plunger);
        // Needle
        const needle = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.06, 8), needleMat);
        needle.position.y = -0.03;
        group.add(needle);
        group.userData = { name: 'सिरिंज', category: 'medical', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    pillBottle: () => {
        const group = new THREE.Group();
        const bottleMat = createPaperMaterial(0xFFFFFF);
        const capMat = createPaperMaterial(0xFF0000);
        const labelMat = createPaperMaterial(0xFFFF00);
        // Bottle
        const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.12, 12), bottleMat);
        bottle.position.y = 0.06;
        bottle.castShadow = true;
        group.add(bottle);
        // Cap
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.025, 12), capMat);
        cap.position.y = 0.1325;
        group.add(cap);
        // Label
        const label = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.005), labelMat);
        label.position.set(0, 0.06, 0.0625);
        group.add(label);
        group.userData = { name: 'दवा की बोतल', category: 'medical', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    bandage: () => {
        const group = new THREE.Group();
        const mat = createPaperMaterial(0xF5F5DC);
        // Rolled bandage
        for (let i = 0; i < 4; i++) {
            const layer = new THREE.Mesh(new THREE.TorusGeometry(0.08 - i * 0.01, 0.03, 8, 16), mat);
            layer.position.y = 0.03;
            layer.rotation.x = Math.PI / 2;
            group.add(layer);
        }
        group.userData = { name: 'बैंडेज', category: 'medical', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    thermometer: () => {
        const group = new THREE.Group();
        const bodyMat = createPaperMaterial(0xE8F0FE, { transparent: true, opacity: 0.7 });
        const mercuryMat = createPaperMaterial(0xFF0000);
        const tipMat = createPaperMaterial(0xC0C0C0);
        // Body
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.15, 12), bodyMat);
        body.position.y = 0.075;
        group.add(body);
        // Mercury
        const mercury = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.08, 8), mercuryMat);
        mercury.position.y = 0.04;
        group.add(mercury);
        // Tip
        const tip = new THREE.Mesh(new THREE.ConeGeometry(0.015, 0.02, 8), tipMat);
        tip.position.y = -0.02;
        group.add(tip);
        group.userData = { name: 'थर्मामीटर', category: 'medical', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    // OUTDOOR
    bench: () => {
        const group = new THREE.Group();
        const mat = createPaperMaterial(0x8B4513);
        // Seat
        const seat = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.08, 0.4), mat);
        seat.position.y = 0.45;
        seat.castShadow = true;
        seat.receiveShadow = true;
        group.add(seat);
        // Back
        const back = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 0.08), mat);
        back.position.set(0, 0.7, -0.16);
        back.castShadow = true;
        group.add(back);
        // Legs
        for (const [x, z] of [[-0.65, -0.16], [0.65, -0.16], [-0.65, 0.16], [0.65, 0.16]]) {
            const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.45, 0.06), mat);
            leg.position.set(x, 0.225, z);
            leg.castShadow = true;
            group.add(leg);
        }
        group.userData = { name: 'बेंच', category: 'outdoor', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    streetlight: () => {
        const group = new THREE.Group();
        const poleMat = createPaperMaterial(0x808080);
        const lightMat = createPaperMaterial(0xFFFF00, { emissive: 0xFFFF00, emissiveIntensity: 0.5 });
        // Pole
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 3, 8), poleMat);
        pole.position.y = 1.5;
        pole.castShadow = true;
        group.add(pole);
        // Arm
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8), poleMat);
        arm.position.set(0.3, 2.8, 0);
        arm.rotation.z = Math.PI / 2;
        group.add(arm);
        // Light fixture
        const fixture = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.15), poleMat);
        fixture.position.set(0.6, 2.8, 0);
        group.add(fixture);
        // Light bulb
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), lightMat);
        bulb.position.set(0.6, 2.72, 0);
        group.add(bulb);
        group.userData = { name: 'स्ट्रीटलाइट', category: 'outdoor', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    mailbox: () => {
        const group = new THREE.Group();
        const boxMat = createPaperMaterial(0x0000FF);
        const postMat = createPaperMaterial(0x808080);
        const flagMat = createPaperMaterial(0xFF0000);
        // Post
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1, 8), postMat);
        post.position.y = 0.5;
        post.castShadow = true;
        group.add(post);
        // Box
        const box = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.15, 0.3), boxMat);
        box.position.set(0, 0.85, 0);
        box.castShadow = true;
        group.add(box);
        // Flag
        const flag = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.08, 0.12), flagMat);
        flag.position.set(0.11, 0.8, 0);
        group.add(flag);
        group.userData = { name: 'मेलबॉक्स', category: 'outdoor', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    fireHydrant: () => {
        const group = new THREE.Group();
        const bodyMat = createPaperMaterial(0xFF0000);
        const capMat = createPaperMaterial(0x808080);
        // Body
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.6, 12), bodyMat);
        body.position.y = 0.3;
        body.castShadow = true;
        group.add(body);
        // Top cap
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.08, 12), capMat);
        cap.position.y = 0.64;
        group.add(cap);
        // Side outlets
        for (let i = 0; i < 2; i++) {
            const outlet = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.1, 12), capMat);
            outlet.position.set(Math.cos(i * Math.PI) * 0.1, 0.35, Math.sin(i * Math.PI) * 0.1);
            outlet.rotation.z = Math.PI / 2;
            group.add(outlet);
        }
        group.userData = { name: 'फायर हाइड्रेंट', category: 'outdoor', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    trafficLight: () => {
        const group = new THREE.Group();
        const poleMat = createPaperMaterial(0x808080);
        const boxMat = createPaperMaterial(0x111111);
        const redMat = createPaperMaterial(0xFF0000, { emissive: 0xFF0000, emissiveIntensity: 0.5 });
        const yellowMat = createPaperMaterial(0xFFFF00, { emissive: 0xFFFF00, emissiveIntensity: 0.5 });
        const greenMat = createPaperMaterial(0x00FF00, { emissive: 0x00FF00, emissiveIntensity: 0.5 });
        // Pole
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.5, 8), poleMat);
        pole.position.y = 1.25;
        pole.castShadow = true;
        group.add(pole);
        // Light box
        const box = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.7, 0.1), boxMat);
        box.position.set(0, 1.8, 0.15);
        box.castShadow = true;
        group.add(box);
        // Lights
        const lights = [
            { color: redMat, y: 2.05 },
            { color: yellowMat, y: 1.8 },
            { color: greenMat, y: 1.55 }
        ];
        lights.forEach(light => {
            const bulb = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 12), light.color);
            bulb.position.set(0, light.y, 0.2);
            group.add(bulb);
        });
        group.userData = { name: 'ट्रैफिक लाइट', category: 'outdoor', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    // ANIMALS
    dog: () => {
        const group = new THREE.Group();
        const bodyMat = createPaperMaterial(0x8B4513);
        const noseMat = createPaperMaterial(0x000000);
        // Body
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.3, 0.35), bodyMat);
        body.position.y = 0.25;
        body.castShadow = true;
        group.add(body);
        // Head
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.2, 0.2), bodyMat);
        head.position.set(0.35, 0.35, 0);
        head.castShadow = true;
        group.add(head);
        // Nose
        const nose = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05), noseMat);
        nose.position.set(0.48, 0.35, 0);
        group.add(nose);
        // Ears
        for (const z of [-0.08, 0.08]) {
            const ear = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.1, 0.02), bodyMat);
            ear.position.set(0.35, 0.45, z);
            group.add(ear);
        }
        // Legs
        for (const [x, z] of [[-0.2, -0.12], [0.1, -0.12], [-0.2, 0.12], [0.1, 0.12]]) {
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.25, 8), bodyMat);
            leg.position.set(x, 0.125, z);
            leg.castShadow = true;
            group.add(leg);
        }
        // Tail
        const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.01, 0.15, 8), bodyMat);
        tail.position.set(-0.3, 0.3, 0);
        tail.rotation.z = -Math.PI / 4;
        group.add(tail);
        group.userData = { name: 'कुत्ता', category: 'animals', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    cat: () => {
        const group = new THREE.Group();
        const bodyMat = createPaperMaterial(0x808080);
        const noseMat = createPaperMaterial(0xFF69B4);
        // Body
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.25, 0.3), bodyMat);
        body.position.y = 0.2;
        body.castShadow = true;
        group.add(body);
        // Head
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.18, 0.18), bodyMat);
        head.position.set(0.3, 0.3, 0);
        head.castShadow = true;
        group.add(head);
        // Ears
        for (const z of [-0.06, 0.06]) {
            const ear = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.08, 4), bodyMat);
            ear.position.set(0.32, 0.4, z);
            group.add(ear);
        }
        // Legs
        for (const [x, z] of [[-0.15, -0.1], [0.05, -0.1], [-0.15, 0.1], [0.05, 0.1]]) {
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.2, 8), bodyMat);
            leg.position.set(x, 0.1, z);
            leg.castShadow = true;
            group.add(leg);
        }
        // Tail
        const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.01, 0.2, 8), bodyMat);
        tail.position.set(-0.25, 0.25, 0);
        tail.rotation.z = -Math.PI / 3;
        group.add(tail);
        group.userData = { name: 'बिल्ली', category: 'animals', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    bird: () => {
        const group = new THREE.Group();
        const bodyMat = createPaperMaterial(0x0000FF);
        const beakMat = createPaperMaterial(0xFFA500);
        // Body
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), bodyMat);
        body.position.y = 0.2;
        body.scale.set(1.2, 1, 1);
        body.castShadow = true;
        group.add(body);
        // Head
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), bodyMat);
        head.position.set(0.12, 0.25, 0);
        group.add(head);
        // Beak
        const beak = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.04, 4), beakMat);
        beak.position.set(0.18, 0.25, 0);
        beak.rotation.z = -Math.PI / 2;
        group.add(beak);
        // Wings
        for (const z of [-0.08, 0.08]) {
            const wing = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.01, 0.1), bodyMat);
            wing.position.set(0.02, 0.22, z);
            wing.rotation.x = Math.PI / 6;
            group.add(wing);
        }
        // Tail
        const tail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.01, 0.06), bodyMat);
        tail.position.set(-0.1, 0.18, 0);
        group.add(tail);
        // Legs
        for (const x of [-0.03, 0.03]) {
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.08, 8), beakMat);
            leg.position.set(x, 0.12, 0);
            group.add(leg);
        }
        group.userData = { name: 'पक्षी', category: 'animals', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    cow: () => {
        const group = new THREE.Group();
        const bodyMat = createPaperMaterial(0xFFFFFF);
        const spotMat = createPaperMaterial(0x000000);
        const noseMat = createPaperMaterial(0xFF69B4);
        // Body
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.5), bodyMat);
        body.position.y = 0.35;
        body.castShadow = true;
        group.add(body);
        // Spots
        for (let i = 0; i < 5; i++) {
            const spot = new THREE.Mesh(new THREE.BoxGeometry(0.1 + Math.random() * 0.1, 0.1 + Math.random() * 0.1, 0.05), spotMat);
            spot.position.set(
                (Math.random() - 0.5) * 0.6,
                0.35 + (Math.random() - 0.5) * 0.3,
                (Math.random() - 0.5) * 0.4 + 0.275
            );
            group.add(spot);
        }
        // Head
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.25, 0.3), bodyMat);
        head.position.set(0.5, 0.4, 0);
        head.castShadow = true;
        group.add(head);
        // Legs
        for (const [x, z] of [[-0.25, -0.18], [0.15, -0.18], [-0.25, 0.18], [0.15, 0.18]]) {
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.35, 8), bodyMat);
            leg.position.set(x, 0.175, z);
            leg.castShadow = true;
            group.add(leg);
        }
        // Tail
        const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.01, 0.15, 8), bodyMat);
        tail.position.set(-0.4, 0.35, 0);
        group.add(tail);
        group.userData = { name: 'गाय', category: 'animals', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    // BUILDINGS
    house: () => {
        const group = new THREE.Group();
        const wallMat = createPaperMaterial(0xDEB887);
        const roofMat = createPaperMaterial(0x8B0000);
        const doorMat = createPaperMaterial(0x8B4513);
        const windowMat = createPaperMaterial(0x87CEEB, { transparent: true, opacity: 0.5 });
        // Walls
        const walls = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1, 1.2), wallMat);
        walls.position.y = 0.5;
        walls.castShadow = true;
        group.add(walls);
        // Roof
        const roof = new THREE.Mesh(new THREE.ConeGeometry(1.1, 0.6, 4), roofMat);
        roof.position.y = 1.3;
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        group.add(roof);
        // Door
        const door = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.5, 0.05), doorMat);
        door.position.set(0, 0.25, 0.625);
        group.add(door);
        // Windows
        for (const [x, z] of [[-0.5, 0.625], [0.5, 0.625], [0, -0.625]]) {
            const window = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 0.03), windowMat);
            window.position.set(x, 0.5, z);
            group.add(window);
        }
        group.userData = { name: 'घर', category: 'buildings', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    school_building: () => {
        const group = new THREE.Group();
        const wallMat = createPaperMaterial(0xE0E0E0);
        const roofMat = createPaperMaterial(0x8B0000);
        const windowMat = createPaperMaterial(0x87CEEB, { transparent: true, opacity: 0.5 });
        const doorMat = createPaperMaterial(0x8B4513);
        // Main building
        const building = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.5, 1.2), wallMat);
        building.position.y = 0.75;
        building.castShadow = true;
        group.add(building);
        // Roof
        const roof = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.2, 1.4), roofMat);
        roof.position.y = 1.6;
        roof.castShadow = true;
        group.add(roof);
        // Windows (grid)
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 5; col++) {
                const window = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.03), windowMat);
                window.position.set(-1 + col * 0.6, 0.75 + row * 0.5, 0.615);
                group.add(window);
            }
        }
        // Door
        const door = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1, 0.05), doorMat);
        door.position.set(0, 0.5, 0.625);
        group.add(door);
        group.userData = { name: 'स्कूल बिल्डिंग', category: 'buildings', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    hospital: () => {
        const group = new THREE.Group();
        const wallMat = createPaperMaterial(0xFFFFFF);
        const roofMat = createPaperMaterial(0x8B0000);
        const windowMat = createPaperMaterial(0x87CEEB, { transparent: true, opacity: 0.5 });
        const crossMat = createPaperMaterial(0xFF0000);
        // Main building
        const building = new THREE.Mesh(new THREE.BoxGeometry(2, 1.5, 1), wallMat);
        building.position.y = 0.75;
        building.castShadow = true;
        group.add(building);
        // Roof
        const roof = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.2, 1.2), roofMat);
        roof.position.y = 1.6;
        roof.castShadow = true;
        group.add(roof);
        // Cross
        const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.05), crossMat);
        crossV.position.set(0, 1.85, 0);
        group.add(crossV);
        const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.05), crossMat);
        crossH.position.set(0, 1.85, 0);
        group.add(crossH);
        // Windows
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 2; j++) {
                const window = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.3, 0.03), windowMat);
                window.position.set(-0.75 + i * 0.5, 0.6 + j * 0.6, 0.515);
                group.add(window);
            }
        }
        group.userData = { name: 'हॉस्पिटल', category: 'buildings', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    shop: () => {
        const group = new THREE.Group();
        const wallMat = createPaperMaterial(0xF5DEB3);
        const roofMat = createPaperMaterial(0x8B0000);
        const windowMat = createPaperMaterial(0x87CEEB, { transparent: true, opacity: 0.5 });
        const doorMat = createPaperMaterial(0x8B4513);
        const signMat = createPaperMaterial(0xFFD700);
        // Building
        const building = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.2, 1), wallMat);
        building.position.y = 0.6;
        building.castShadow = true;
        group.add(building);
        // Roof
        const roof = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.2, 1.2), roofMat);
        roof.position.y = 1.3;
        roof.castShadow = true;
        group.add(roof);
        // Large shop window
        const window = new THREE.Mesh(new THREE.BoxGeometry(1, 0.8, 0.03), windowMat);
        window.position.set(0, 0.7, 0.515);
        group.add(window);
        // Door
        const door = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1, 0.05), doorMat);
        door.position.set(-0.6, 0.5, 0.525);
        group.add(door);
        // Sign
        const sign = new THREE.Mesh(new THREE.BoxGeometry(1, 0.3, 0.05), signMat);
        sign.position.set(0, 1.1, 0.525);
        group.add(sign);
        group.userData = { name: 'दुकान', category: 'buildings', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    // PROPS
    ball: () => {
        const group = new THREE.Group();
        const mat = createPaperMaterial(0xFF0000);
        const ball = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), mat);
        ball.position.y = 0.1;
        ball.castShadow = true;
        group.add(ball);
        group.userData = { name: 'गेंद', category: 'props', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    balloon: () => {
        const group = new THREE.Group();
        const balloonMat = createPaperMaterial(0xFF0000);
        const stringMat = createPaperMaterial(0xFFFFFF);
        // Balloon
        const balloon = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), balloonMat);
        balloon.position.y = 0.15;
        balloon.scale.set(1, 1.3, 1);
        balloon.castShadow = true;
        group.add(balloon);
        // String
        const string = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.002, 0.2, 4), stringMat);
        string.position.y = 0.03;
        group.add(string);
        // Knot
        const knot = new THREE.Mesh(new THREE.SphereGeometry(0.01, 6, 6), balloonMat);
        knot.position.y = 0.02;
        group.add(knot);
        group.userData = { name: 'बैलून', category: 'props', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    gift: () => {
        const group = new THREE.Group();
        const boxMat = createPaperMaterial(0xFF0000);
        const ribbonMat = createPaperMaterial(0xFFD700);
        // Box
        const box = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.15), boxMat);
        box.position.y = 0.075;
        box.castShadow = true;
        group.add(box);
        // Ribbon vertical
        const ribbonV = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.15, 0.02), ribbonMat);
        ribbonV.position.set(0, 0.075, 0);
        group.add(ribbonV);
        // Ribbon horizontal
        const ribbonH = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.02, 0.02), ribbonMat);
        ribbonH.position.set(0, 0.075, 0);
        group.add(ribbonH);
        // Bow
        const bow = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 0.02), ribbonMat);
        bow.position.set(0, 0.16, 0);
        group.add(bow);
        group.userData = { name: 'गिफ्ट', category: 'props', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    flag: () => {
        const group = new THREE.Group();
        const poleMat = createPaperMaterial(0x8B4513);
        const flagMat = createPaperMaterial(0xFF0000);
        // Pole
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.5, 8), poleMat);
        pole.position.y = 0.25;
        pole.castShadow = true;
        group.add(pole);
        // Flag
        const flag = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.01), flagMat);
        flag.position.set(0.1, 0.4, 0);
        group.add(flag);
        group.userData = { name: 'झंडा', category: 'props', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    trophy: () => {
        const group = new THREE.Group();
        const cupMat = createPaperMaterial(0xFFD700);
        const baseMat = createPaperMaterial(0x8B4513);
        // Base
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.05, 12), baseMat);
        base.position.y = 0.025;
        base.castShadow = true;
        group.add(base);
        // Cup
        const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, 0.15, 12), cupMat);
        cup.position.y = 0.125;
        group.add(cup);
        // Handles
        for (const x of [-0.06, 0.06]) {
            const handle = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.01, 8, 16), cupMat);
            handle.position.set(x, 0.125, 0);
            handle.rotation.x = Math.PI / 2;
            group.add(handle);
        }
        group.userData = { name: 'ट्रॉफी', category: 'props', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    camera: () => {
        const group = new THREE.Group();
        const bodyMat = createPaperMaterial(0x111111);
        const lensMat = createPaperMaterial(0x87CEEB, { transparent: true, opacity: 0.5 });
        const buttonMat = createPaperMaterial(0xFF0000);
        // Body
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.08), bodyMat);
        body.position.y = 0.05;
        body.castShadow = true;
        group.add(body);
        // Lens
        const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.02, 16), lensMat);
        lens.position.set(0.1, 0.05, 0);
        lens.rotation.z = Math.PI / 2;
        group.add(lens);
        // Viewfinder
        const vf = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 0.02), bodyMat);
        vf.position.set(-0.05, 0.08, 0);
        group.add(vf);
        // Shutter button
        const button = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.01, 12), buttonMat);
        button.position.set(-0.07, 0.08, 0.045);
        group.add(button);
        group.userData = { name: 'कैमरा', category: 'props', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    },

    phone: () => {
        const group = new THREE.Group();
        const bodyMat = createPaperMaterial(0x111111);
        const screenMat = createPaperMaterial(0x001122);
        // Body
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.15, 0.01), bodyMat);
        body.position.y = 0.075;
        body.castShadow = true;
        group.add(body);
        // Screen
        const screen = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.13, 0.002), screenMat);
        screen.position.set(0, 0.075, 0.006);
        group.add(screen);
        group.userData = { name: 'फोन', category: 'props', bounds: new THREE.Box3().setFromObject(group) };
        return group;
    }
};

// ========================================
// Asset Registry
// ========================================

export const ASSET_REGISTRY = {};

// Build registry from builders
Object.entries(AssetBuilders).forEach(([id, builder]) => {
    const asset = builder();
    const category = asset.userData.category;
    if (!ASSET_REGISTRY[category]) ASSET_REGISTRY[category] = {};
    ASSET_REGISTRY[category][id] = {
        id,
        name: asset.userData.name,
        category,
        builder,
        bounds: asset.userData.bounds,
        preview: asset // For thumbnail generation
    };
});

// Flattened list for searching
export const ALL_ASSETS = Object.values(ASSET_REGISTRY).flatMap(cat => Object.values(cat));

// ========================================
// Asset Library Class
// ========================================

export class AssetLibrary {
    constructor() {
        this.assets = new Map();
        this.loadedAssets = new Map(); // Cached built assets
    }

    // Get all categories
    getCategories() {
        return ASSET_CATEGORIES;
    }

    // Get assets by category
    getAssetsByCategory(categoryId) {
        return ASSET_REGISTRY[categoryId] || {};
    }

    // Get all assets
    getAllAssets() {
        return ALL_ASSETS;
    }

    // Search assets
    search(query) {
        const lowerQuery = query.toLowerCase();
        return ALL_ASSETS.filter(asset => 
            asset.name.toLowerCase().includes(lowerQuery) ||
            asset.id.toLowerCase().includes(lowerQuery) ||
            asset.category.toLowerCase().includes(lowerQuery)
        );
    }

    // Get asset by ID
    getAsset(id) {
        for (const cat of Object.values(ASSET_REGISTRY)) {
            if (cat[id]) return cat[id];
        }
        return null;
    }

    // Build asset instance (returns cloned group)
    buildAsset(id, options = {}) {
        const assetDef = this.getAsset(id);
        if (!assetDef) {
            console.warn(`Asset not found: ${id}`);
            return null;
        }

        // Build fresh instance
        const assetGroup = assetDef.builder();
        
        // Apply options
        if (options.position) assetGroup.position.copy(options.position);
        if (options.rotation) assetGroup.rotation.copy(options.rotation);
        if (options.scale) assetGroup.scale.copy(options.scale);
        if (options.color) {
            assetGroup.traverse(child => {
                if (child.isMesh && child.material) {
                    child.material.color.set(options.color);
                }
            });
        }
        
        // Add metadata
        assetGroup.userData.assetId = id;
        assetGroup.userData.assetName = assetDef.name;
        assetGroup.userData.assetCategory = assetDef.category;
        
        return assetGroup;
    }

    // Add custom asset
    addCustomAsset(id, name, category, builder) {
        if (!ASSET_REGISTRY[category]) ASSET_REGISTRY[category] = {};
        ASSET_REGISTRY[category][id] = { id, name, category, builder };
    }

    // Remove custom asset
    removeCustomAsset(id) {
        for (const cat of Object.values(ASSET_REGISTRY)) {
            if (cat[id]) {
                delete cat[id];
                return true;
            }
        }
        return false;
    }
}

// Singleton instance
export const assetLibrary = new AssetLibrary();

// ========================================
// Scene Asset Manager
// ========================================

export class SceneAssetManager {
    constructor(scene) {
        this.scene = scene;
        this.assets = new Map(); // assetInstanceId -> { asset, assetId, transform }
        this.nextInstanceId = 0;
    }

    // Add asset to scene
    addAsset(assetId, options = {}) {
        const assetGroup = assetLibrary.buildAsset(assetId, options);
        if (!assetGroup) return null;

        const instanceId = `asset_${this.nextInstanceId++}`;
        this.assets.set(instanceId, {
            asset: assetGroup,
            assetId,
            transform: {
                position: assetGroup.position.clone(),
                rotation: assetGroup.rotation.clone(),
                scale: assetGroup.scale.clone()
            }
        });

        this.scene.add(assetGroup);
        return instanceId;
    }

    // Remove asset from scene
    removeAsset(instanceId) {
        const data = this.assets.get(instanceId);
        if (data) {
            this.scene.remove(data.asset);
            // Dispose geometries and materials
            data.asset.traverse(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(m => m.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
            this.assets.delete(instanceId);
            return true;
        }
        return false;
    }

    // Update asset transform
    updateAsset(instanceId, transform) {
        const data = this.assets.get(instanceId);
        if (data) {
            if (transform.position) data.asset.position.copy(transform.position);
            if (transform.rotation) data.asset.rotation.copy(transform.rotation);
            if (transform.scale) data.asset.scale.copy(transform.scale);
            data.transform = { ...data.transform, ...transform };
        }
    }

    // Get asset data
    getAsset(instanceId) {
        return this.assets.get(instanceId);
    }

    // Get all assets
    getAllAssets() {
        return Array.from(this.assets.entries()).map(([id, data]) => ({
            instanceId: id,
            ...data
        }));
    }

    // Clear all assets
    clear() {
        for (const [id] of this.assets) {
            this.removeAsset(id);
        }
    }

    // Serialize for saving
    toJSON() {
        return Array.from(this.assets.entries()).map(([instanceId, data]) => ({
            instanceId,
            assetId: data.assetId,
            position: data.asset.position.toArray(),
            rotation: data.asset.rotation.toArray(),
            scale: data.asset.scale.toArray()
        }));
    }

    // Load from JSON
    fromJSON(json) {
        this.clear();
        for (const item of json) {
            const instanceId = this.addAsset(item.assetId, {
                position: new THREE.Vector3(...item.position),
                rotation: new THREE.Euler(...item.rotation),
                scale: new THREE.Vector3(...item.scale)
            });
            if (instanceId) {
                // Override the generated instanceId with saved one
                const data = this.assets.get(instanceId);
                this.assets.delete(instanceId);
                this.assets.set(item.instanceId, data);
            }
        }
        this.nextInstanceId = Math.max(this.nextInstanceId, ...Array.from(this.assets.keys()).map(k => parseInt(k.split('_')[1]) || 0)) + 1;
    }
}
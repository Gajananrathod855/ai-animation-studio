/**
 * 3D Human Character System
 * Procedural 3D human characters with customization and animations
 * Uses only Three.js - no external dependencies
 */

// Character presets for quick selection
const CHARACTER_PRESETS = {
    child: {
        bodyScale: { height: 1.3, width: 0.7, depth: 0.5 },
        headScale: 1.1,
        limbLength: 0.8,
        proportions: 'child'
    },
    teen: {
        bodyScale: { height: 1.6, width: 0.8, depth: 0.6 },
        headScale: 1.0,
        limbLength: 0.95,
        proportions: 'teen'
    },
    adult: {
        bodyScale: { height: 1.8, width: 0.9, depth: 0.65 },
        headScale: 1.0,
        limbLength: 1.0,
        proportions: 'adult'
    },
    elderly: {
        bodyScale: { height: 1.65, width: 0.85, depth: 0.6 },
        headScale: 1.05,
        limbLength: 0.9,
        proportions: 'elderly'
    }
};

// Skin tone presets
const SKIN_TONES = [
    { name: 'Fair', color: 0xF5D0C0, shade: 0xE8B8A0 },
    { name: 'Light', color: 0xE8C0A0, shade: 0xD8A890 },
    { name: 'Medium', color: 0xD4A574, shade: 0xC49464 },
    { name: 'Olive', color: 0xC8A078, shade: 0xB89068 },
    { name: 'Brown', color: 0xA07850, shade: 0x906840 },
    { name: 'Dark', color: 0x785438, shade: 0x684428 },
    { name: 'Deep', color: 0x5C3A28, shade: 0x4C2A18 }
];

// Hair style presets
const HAIR_STYLES = {
    short: { type: 'short', geometry: 'cap', segments: 16 },
    medium: { type: 'medium', geometry: 'layered', segments: 20 },
    long: { type: 'long', geometry: 'flowing', segments: 24 },
    curly: { type: 'curly', geometry: 'curly', segments: 32 },
    bald: { type: 'bald', geometry: 'none', segments: 0 },
    ponytail: { type: 'ponytail', geometry: 'ponytail', segments: 18 },
    bun: { type: 'bun', geometry: 'bun', segments: 16 },
    dreadlocks: { type: 'dreadlocks', geometry: 'dreadlocks', segments: 24 }
};

// Hair colors
const HAIR_COLORS = [
    { name: 'Black', color: 0x1a1a1a, highlight: 0x2a2a2a },
    { name: 'Dark Brown', color: 0x3d2b1f, highlight: 0x4d3b2f },
    { name: 'Brown', color: 0x5d4037, highlight: 0x6d5047 },
    { name: 'Light Brown', color: 0x8d6e63, highlight: 0x9d7e73 },
    { name: 'Blonde', color: 0xd4a574, highlight: 0xe4b584 },
    { name: 'Platinum', color: 0xf5f0e1, highlight: 0xfffff0 },
    { name: 'Red', color: 0x8b2d2d, highlight: 0x9b3d3d },
    { name: 'Auburn', color: 0x7d452d, highlight: 0x8d553d },
    { name: 'Gray', color: 0x9e9e9e, highlight: 0xaeaeae },
    { name: 'White', color: 0xf5f5f5, highlight: 0xffffff },
    { name: 'Blue', color: 0x1e3a8a, highlight: 0x2e4ab8 },
    { name: 'Pink', color: 0xec407a, highlight: 0xfc508a },
    { name: 'Purple', color: 0x7b1fa2, highlight: 0x8b2fb2 }
];

// Eye colors
const EYE_COLORS = [
    { name: 'Brown', iris: 0x3d2b1f, sclera: 0xffffff },
    { name: 'Blue', iris: 0x1e88e5, sclera: 0xffffff },
    { name: 'Green', iris: 0x2e7d32, sclera: 0xffffff },
    { name: 'Hazel', iris: 0x6d4c1e, sclera: 0xffffff },
    { name: 'Gray', iris: 0x78909c, sclera: 0xffffff },
    { name: 'Amber', iris: 0xff6f00, sclera: 0xffffff }
];

// Clothing presets
const CLOTHING_PRESETS = {
    casual: {
        shirt: { type: 'tshirt', color: 0x42a5f5, sleeve: 'short' },
        pants: { type: 'jeans', color: 0x1565c0, length: 'long' },
        shoes: { type: 'sneakers', color: 0xffffff }
    },
    formal: {
        shirt: { type: 'shirt', color: 0xffffff, sleeve: 'long' },
        pants: { type: 'trousers', color: 0x1a1a1a, length: 'long' },
        shoes: { type: 'oxfords', color: 0x1a1a1a },
        jacket: { type: 'blazer', color: 0x1a1a1a }
    },
    traditional: {
        shirt: { type: 'kurta', color: 0xffeb3b, sleeve: 'long' },
        pants: { type: 'pajama', color: 0xffffff, length: 'long' },
        shoes: { type: 'mojari', color: 0x8d6e63 }
    },
    school: {
        shirt: { type: 'shirt', color: 0xffffff, sleeve: 'short' },
        pants: { type: 'shorts', color: 0x1a237e, length: 'knee' },
        shoes: { type: 'sneakers', color: 0xffffff }
    },
    sports: {
        shirt: { type: 'jersey', color: 0xe53935, sleeve: 'short' },
        pants: { type: 'shorts', color: 0x1a1a1a, length: 'mid' },
        shoes: { type: 'running', color: 0xffeb3b }
    },
    winter: {
        shirt: { type: 'sweater', color: 0x6d4c41, sleeve: 'long' },
        pants: { type: 'jeans', color: 0x283593, length: 'long' },
        shoes: { type: 'boots', color: 0x3e2723 },
        jacket: { type: 'coat', color: 0x4e342e }
    }
};

// Animation definitions
const ANIMATION_CLIPS = {
    idle: {
        name: 'Idle',
        duration: 4,
        loop: true,
        keyframes: [
            { time: 0, pose: 'idle' },
            { time: 1, pose: 'breath_in' },
            { time: 2, pose: 'idle' },
            { time: 3, pose: 'breath_out' },
            { time: 4, pose: 'idle' }
        ]
    },
    walk: {
        name: 'Walk',
        duration: 1,
        loop: true,
        speed: 2.5,
        keyframes: [
            { time: 0, pose: 'walk_0' },
            { time: 0.25, pose: 'walk_1' },
            { time: 0.5, pose: 'walk_2' },
            { time: 0.75, pose: 'walk_3' },
            { time: 1, pose: 'walk_0' }
        ]
    },
    run: {
        name: 'Run',
        duration: 0.6,
        loop: true,
        speed: 6.0,
        keyframes: [
            { time: 0, pose: 'run_0' },
            { time: 0.15, pose: 'run_1' },
            { time: 0.3, pose: 'run_2' },
            { time: 0.45, pose: 'run_3' },
            { time: 0.6, pose: 'run_0' }
        ]
    },
    talk: {
        name: 'Talk',
        duration: 3,
        loop: true,
        keyframes: [
            { time: 0, pose: 'talk_neutral' },
            { time: 0.5, pose: 'talk_a' },
            { time: 1, pose: 'talk_e' },
            { time: 1.5, pose: 'talk_o' },
            { time: 2, pose: 'talk_neutral' },
            { time: 2.5, pose: 'talk_m' },
            { time: 3, pose: 'talk_neutral' }
        ]
    },
    sit: {
        name: 'Sit',
        duration: 2,
        loop: false,
        keyframes: [
            { time: 0, pose: 'stand' },
            { time: 0.5, pose: 'sit_down_1' },
            { time: 1, pose: 'sit_down_2' },
            { time: 1.5, pose: 'sit_idle_1' },
            { time: 2, pose: 'sit_idle' }
        ]
    },
    wave: {
        name: 'Wave',
        duration: 2,
        loop: false,
        keyframes: [
            { time: 0, pose: 'idle' },
            { time: 0.3, pose: 'wave_up' },
            { time: 0.8, pose: 'wave_left' },
            { time: 1.3, pose: 'wave_right' },
            { time: 1.8, pose: 'wave_down' },
            { time: 2, pose: 'idle' }
        ]
    },
    point: {
        name: 'Point',
        duration: 1.5,
        loop: false,
        keyframes: [
            { time: 0, pose: 'idle' },
            { time: 0.3, pose: 'point_up' },
            { time: 0.8, pose: 'point_hold' },
            { time: 1.5, pose: 'idle' }
        ]
    },
    nod: {
        name: 'Nod',
        duration: 1,
        loop: false,
        keyframes: [
            { time: 0, pose: 'idle' },
            { time: 0.3, pose: 'nod_down' },
            { time: 0.6, pose: 'nod_up' },
            { time: 1, pose: 'idle' }
        ]
    },
    shake_head: {
        name: 'Shake Head',
        duration: 1.5,
        loop: false,
        keyframes: [
            { time: 0, pose: 'idle' },
            { time: 0.3, pose: 'shake_left' },
            { time: 0.6, pose: 'shake_right' },
            { time: 0.9, pose: 'shake_left' },
            { time: 1.2, pose: 'shake_right' },
            { time: 1.5, pose: 'idle' }
        ]
    },
    jump: {
        name: 'Jump',
        duration: 1.2,
        loop: false,
        keyframes: [
            { time: 0, pose: 'stand' },
            { time: 0.2, pose: 'crouch' },
            { time: 0.4, pose: 'jump_up' },
            { time: 0.6, pose: 'air' },
            { time: 0.8, pose: 'land' },
            { time: 1, pose: 'crouch' },
            { time: 1.2, pose: 'stand' }
        ]
    }
};

// Facial expressions
const FACIAL_EXPRESSIONS = {
    neutral: { name: 'Neutral', blendshapes: {} },
    happy: { name: 'Happy', blendshapes: { smile: 1.0, cheekRaise: 0.8, eyeSquint: 0.3 } },
    sad: { name: 'Sad', blendshapes: { browInnerUp: 0.8, browOuterUp: 0.4, mouthFrown: 0.7, eyeSquint: 0.2 } },
    angry: { name: 'Angry', blendshapes: { browDown: 1.0, browInnerDown: 0.8, eyeSquint: 0.7, mouthPress: 0.6 } },
    surprised: { name: 'Surprised', blendshapes: { browOuterUp: 1.0, eyeWide: 1.0, jawOpen: 0.6 } },
    fear: { name: 'Fear', blendshapes: { browInnerUp: 1.0, browOuterUp: 0.8, eyeWide: 0.9, mouthStretch: 0.5 } },
    disgusted: { name: 'Disgusted', blendshapes: { noseWrinkle: 0.8, upperLipRaise: 0.7, cheekRaise: 0.4 } },
    confused: { name: 'Confused', blendshapes: { browInnerUp: 0.7, browOuterDown: 0.3, eyeSquint: 0.3, mouthTwist: 0.4 } },
    thinking: { name: 'Thinking', blendshapes: { browInnerUp: 0.5, browOuterDown: 0.2, eyeSquint: 0.4, mouthPress: 0.3 } },
    sleepy: { name: 'Sleepy', blendshapes: { eyeSquint: 0.9, browOuterDown: 0.3, mouthRelax: 0.2 } },
    wink: { name: 'Wink', blendshapes: { eyeClosedLeft: 1.0, cheekRaise: 0.3 } }
};

// Export for use in main app
export { 
    CHARACTER_PRESETS, 
    SKIN_TONES, 
    HAIR_STYLES, 
    HAIR_COLORS, 
    EYE_COLORS,
    CLOTHING_PRESETS,
    ANIMATION_CLIPS,
    FACIAL_EXPRESSIONS
};
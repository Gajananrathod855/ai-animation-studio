/**
 * Automatic Character Direction System
 * Interprets scene instructions and assigns character actions, positions, animations, expressions
 */

import { CHARACTER_PRESETS, ANIMATION_CLIPS, FACIAL_EXPRESSIONS } from './characters.js';

// ========================================
// Direction Keywords and Patterns
// ========================================

const DIRECTION_PATTERNS = {
    // Movement actions
    movement: {
        walk: ['चल', 'घूम', 'टहल', 'जा', 'आ', 'पहुंच', 'walk', 'move', 'go', 'approach'],
        run: ['दौड़', 'भाग', 'तेज', 'run', 'sprint', 'hurry', 'rush'],
        sit: ['बैठ', 'sit', 'seat', 'rest'],
        stand: ['खड़', 'उठ', 'stand', 'rise', 'get up'],
        turn: ['मुड़', 'घुम', 'turn', 'face', 'rotate'],
        stop: ['रुक', 'ठहर', 'stop', 'halt', 'pause'],
        jump: ['कूद', 'उछल', 'jump', 'leap', 'hop'],
        dance: ['नाच', 'डांस', 'dance'],
    },
    
    // Interaction actions
    interaction: {
        wave: ['हाथ हिल', 'waves', 'हाथ उठ', 'wave', 'greet', 'hello', 'bye'],
        talk: ['बोल', 'बात', 'कह', 'सुन', 'talk', 'speak', 'say', 'tell', 'conversation', 'dialogue'],
        point: ['इशार', 'उंगली', 'point', 'indicate', 'show'],
        give: ['दे', 'हाथ में', 'give', 'hand', 'pass', 'offer'],
        take: ['ले', 'पकड़', 'take', 'grab', 'hold', 'receive'],
        hug: ['गले लग', 'हग', 'hug', 'embrace'],
        highfive: ['हाई फाइव', 'ताली', 'high five', 'highfive'],
        shake_hand: ['हाथ मिल', 'shake hand', 'handshake'],
        nod: ['सिर हिल', 'coordinate', 'निक', 'nod', 'agree'],
        shake_head: ['नहीं', 'न', 'no', 'disagree', 'refuse', 'head shake'],
        look_at: ['देख', 'नजर', 'look', 'watch', 'stare', 'gaze', 'observe'],
    },
    
    // Expressions
    expression: {
        happy: ['खुश', 'मुस्कुर', 'हंस', 'प्रसन्न', 'happy', 'smile', 'laugh', 'joy', 'glad'],
        sad: ['उदास', 'रो', 'दुख', 'sad', 'cry', 'tear', 'unhappy', 'sorrow', 'weep'],
        angry: ['गुस्सा', 'क्रोध', 'नाराज', 'angry', 'mad', 'furious', 'rage', 'annoyed'],
        surprised: ['आश्चर्य', 'हैरान', 'चौंक', 'surprise', 'shock', 'amaze', 'astonish', 'wow'],
        scared: ['डर', 'भय', 'डर', 'scared', 'fear', 'afraid', 'frighten', 'terrify'],
        confused: ['उलझन', 'समझ नहीं', 'confuse', 'puzzle', 'bewilder', 'perplex'],
        thinking: ['सोच', 'विचार', 'think', 'ponder', 'consider', 'wonder'],
        sleepy: ['नींद', 'उबास', 'sleepy', 'tired', 'yawn', 'drowsy'],
        wink: ['आंख मार', 'wink'],
        neutral: ['सामान्य', 'साधारण', 'normal', 'neutral', 'calm'],
    },
    
    // Spatial relationships
    spatial: {
        near: ['पास', 'करीब', 'निकट', 'near', 'close', 'beside', 'next to'],
        far: ['दूर', 'far', 'away', 'distant'],
        in_front: ['सामने', 'front', 'ahead', 'before'],
        behind: ['पीछे', 'behind', 'back'],
        left: ['बाएं', 'left'],
        right: ['दाएं', 'right'],
        between: ['बीच', 'between', 'among'],
        around: ['चारों ओर', 'around', 'surround'],
        inside: ['अंदर', 'inside', 'in', 'within'],
        outside: ['बाहर', 'outside', 'out'],
        above: ['ऊपर', 'above', 'over', 'on top'],
        below: ['नीचे', 'below', 'under', 'beneath'],
    },
    
    // Objects and props
    objects: {
        ball: ['गेंद', 'ball'],
        book: ['किताब', 'पुस्तक', 'book'],
        phone: ['फोन', 'मोबाइल', 'phone', 'mobile'],
        gift: ['उपहार', 'गिफ्ट', 'gift', 'present'],
        flower: ['फूल', 'flower'],
        food: ['खाना', 'भोजन', 'food', 'eat', 'meal'],
        water: ['पानी', 'water', 'drink'],
        bag: ['बैग', 'थैला', 'bag'],
        hat: ['टोपी', 'hat', 'cap'],
    },
    
    // Camera directions
    camera: {
        closeup: ['क्लोजअप', 'चेहरा', 'closeup', 'close up', 'face', 'detail'],
        wide: ['वाइड', 'पूरा', 'wide', 'establishing', 'full'],
        medium: ['मीडियम', 'कमर', 'medium', 'waist'],
        over_shoulder: ['कंधे के पीछे', 'over shoulder', 'shoulder'],
        two_shot: ['दोनों', 'दो पात्र', 'two shot', 'both'],
        pan: ['पैन', 'पैनिंग', 'pan'],
        tilt: ['टिल्ट', 'झुकाव', 'tilt'],
        zoom: ['ज़ूम', 'zoom'],
        dolly: ['डॉली', 'dolly'],
        track: ['ट्रैक', 'फॉलो', 'track', 'follow'],
    },
    
    // Lighting moods
    lighting: {
        bright: ['उज्ज्वल', 'रोशनी', 'bright', 'light', 'sunny', 'day'],
        dark: ['अंधेरा', 'रात', 'dark', 'night', 'dim', 'shadow'],
        warm: ['गर्म', 'सुनहरा', 'warm', 'golden', 'sunset', 'orange'],
        cool: ['ठंडा', 'नीला', 'cool', 'blue', 'moonlight', 'cold'],
        dramatic: ['नाटकीय', 'dramatic', 'contrast', 'chiaroscuro'],
        soft: ['मुलायम', 'soft', 'diffused', 'gentle'],
    }
};

// ========================================
// Direction Parser
// ========================================

export class DirectionParser {
    constructor() {
        this.actions = [];
    }
    
    parseScene(sceneDescription, characters = []) {
        const directions = {
            characters: {},
            camera: {},
            lighting: {},
            timeline: []
        };
        
        const text = sceneDescription.toLowerCase();
        const sentences = text.split(/[।.!?]+/).map(s => s.trim()).filter(Boolean);
        
        // Initialize character directions
        characters.forEach((char, index) => {
            directions.characters[char] = {
                name: char,
                index,
                position: null,
                rotation: null,
                animation: 'idle',
                expression: 'neutral',
                lookAt: null,
                interactions: [],
                movementPath: []
            };
        });
        
        // Parse each sentence
        sentences.forEach((sentence, sentIndex) => {
            const timeOffset = sentIndex * 2; // Rough timing
            
            // Check for character-specific actions
            characters.forEach(char => {
                if (sentence.includes(char.toLowerCase()) || sentence.includes('वह') || sentence.includes('वह')) {
                    this.parseCharacterAction(char, sentence, directions, timeOffset);
                }
            });
            
            // Check for general scene directions
            this.parseCameraDirection(sentence, directions, timeOffset);
            this.parseLightingDirection(sentence, directions);
            this.parseSpatialRelations(sentence, directions, characters);
            this.parseObjectInteractions(sentence, directions, characters);
        });
        
        return directions;
    }
    
    parseCharacterAction(charName, sentence, directions, timeOffset) {
        const charDir = directions.characters[charName];
        if (!charDir) return;
        
        // Movement
        for (const [action, keywords] of Object.entries(DIRECTION_PATTERNS.movement)) {
            if (keywords.some(kw => sentence.includes(kw))) {
                charDir.animation = action;
                charDir.timeline = charDir.timeline || [];
                charDir.timeline.push({ time: timeOffset, action, type: 'movement' });
                break; // Take first match
            }
        }
        
        // Interactions
        for (const [action, keywords] of Object.entries(DIRECTION_PATTERNS.interaction)) {
            if (keywords.some(kw => sentence.includes(kw))) {
                charDir.interactions = charDir.interactions || [];
                charDir.interactions.push({ action, time: timeOffset, target: this.extractTarget(sentence, charName) });
                
                // Set appropriate animation
                const animMap = {
                    'wave': 'wave', 'talk': 'talk', 'point': 'point',
                    'give': 'point', 'take': 'point', 'hug': 'wave',
                    'highfive': 'point', 'nod': 'nod', 'shake_head': 'shakeHead',
                    'look_at': 'idle'
                };
                if (animMap[action]) charDir.animation = animMap[action];
                break;
            }
        }
        
        // Expressions
        for (const [expr, keywords] of Object.entries(DIRECTION_PATTERNS.expression)) {
            if (keywords.some(kw => sentence.includes(kw))) {
                charDir.expression = expr;
                break;
            }
        }
    }
    
    extractTarget(sentence, excludeChar) {
        // Try to find target character or object
        const words = sentence.split(' ');
        for (let i = 0; i < words.length; i++) {
            if (words[i] === 'को' || words[i] === 'से' || words[i] === 'की' || words[i] === 'के') {
                if (i + 1 < words.length) {
                    return words[i + 1].replace(/[।.!?,]/g, '');
                }
            }
        }
        return null;
    }
    
    parseCameraDirection(sentence, directions, timeOffset) {
        for (const [shot, keywords] of Object.entries(DIRECTION_PATTERNS.camera)) {
            if (keywords.some(kw => sentence.includes(kw))) {
                directions.camera[timeOffset] = directions.camera[timeOffset] || {};
                directions.camera[timeOffset].shot = shot;
            }
        }
    }
    
    parseLightingDirection(sentence, directions) {
        for (const [mood, keywords] of Object.entries(DIRECTION_PATTERNS.lighting)) {
            if (keywords.some(kw => sentence.includes(kw))) {
                directions.lighting.mood = mood;
            }
        }
    }
    
    parseSpatialRelations(sentence, directions, characters) {
        characters.forEach(char => {
            const charDir = directions.characters[char];
            if (!charDir) return;
            
            for (const [relation, keywords] of Object.entries(DIRECTION_PATTERNS.spatial)) {
                if (keywords.some(kw => sentence.includes(kw))) {
                    // This is a relative position - would need another character reference
                    charDir.spatialRelation = charDir.spatialRelation || {};
                    charDir.spatialRelation[relation] = true;
                }
            }
        });
    }
    
    parseObjectInteractions(sentence, directions, characters) {
        for (const [obj, keywords] of Object.entries(DIRECTION_PATTERNS.objects)) {
            if (keywords.some(kw => sentence.includes(kw))) {
                directions.objects = directions.objects || {};
                directions.objects[obj] = directions.objects[obj] || [];
                directions.objects[obj].push({ mentionedIn: sentence });
            }
        }
    }
}

// ========================================
// Character Director
// ========================================

export class CharacterDirector {
    constructor(scene, characters3d, assetManager) {
        this.scene = scene;
        this.characters3d = characters3d; // Array of { character3d, sceneIndex, charIndex }
        this.assetManager = assetManager;
        this.parser = new DirectionParser();
    }
    
    // Apply directions to scene
    applyDirections(directions) {
        // Apply character directions
        Object.entries(directions.characters).forEach(([charName, charDir]) => {
            this.applyCharacterDirection(charName, charDir);
        });
        
        // Apply camera directions
        if (directions.camera) {
            this.applyCameraDirections(directions.camera);
        }
        
        // Apply lighting
        if (directions.lighting) {
            this.applyLightingDirections(directions.lighting);
        }
        
        // Spawn objects
        if (directions.objects) {
            this.spawnObjects(directions.objects);
        }
    }
    
    applyCharacterDirection(charName, charDir) {
        // Find character in scene
        const charData = this.characters3d.find(c => 
            c.character3d && c.character3d.name === charName
        );
        
        if (!charData) return;
        
        const character3d = charData.character3d;
        
        // Set animation
        if (charDir.animation) {
            character3d.playAnimation(charDir.animation);
        }
        
        // Set expression
        if (charDir.expression) {
            character3d.setExpression(charDir.expression, 1.0);
        }
        
        // Set look-at target
        if (charDir.lookAt) {
            character3d.lookAt(charDir.lookAt);
        }
        
        // Apply position if specified
        if (charDir.position) {
            character3d.group.position.copy(charDir.position);
        }
        
        // Apply rotation if specified
        if (charDir.rotation) {
            character3d.group.rotation.copy(charDir.rotation);
        }
        
        // Schedule timeline actions
        if (charDir.timeline) {
            this.scheduleTimelineActions(character3d, charDir.timeline);
        }
        
        // Schedule interactions
        if (charDir.interactions) {
            this.scheduleInteractions(character3d, charDir.interactions, charName);
        }
    }
    
    scheduleTimelineActions(character3d, timeline) {
        timeline.forEach(action => {
            setTimeout(() => {
                if (action.type === 'movement') {
                    character3d.playAnimation(action.action);
                }
            }, action.time * 1000);
        });
    }
    
    scheduleInteractions(character3d, interactions, charName) {
        interactions.forEach(interaction => {
            setTimeout(() => {
                const targetName = interaction.target;
                if (targetName) {
                    const targetChar = this.characters3d.find(c => 
                        c.character3d && c.character3d.name === targetName
                    )?.character3d;
                    
                    if (targetChar) {
                        character3d.interactWith(targetChar, interaction.action);
                    }
                }
            }, interaction.time * 1000);
        });
    }
    
    applyCameraDirections(cameraDirections) {
        // This would integrate with the camera control system
        Object.entries(cameraDirections).forEach(([time, dir]) => {
            setTimeout(() => {
                if (dir.shot) {
                    this.applyCameraShot(dir.shot);
                }
            }, time * 1000);
        });
    }
    
    applyCameraShot(shot) {
        const cameraControls = AppState?.three?.cameraControls;
        if (!cameraControls) return;
        
        const shots = {
            closeup: { distance: 5, height: 1.6, fov: 30 },
            medium: { distance: 10, height: 1.2, fov: 45 },
            wide: { distance: 20, height: 3, fov: 60 },
            over_shoulder: { distance: 8, height: 1.5, fov: 40 },
            two_shot: { distance: 12, height: 1.2, fov: 50 }
        };
        
        if (shots[shot]) {
            Object.assign(cameraControls, shots[shot]);
        }
    }
    
    applyLightingDirections(lighting) {
        if (!lighting.mood) return;
        
        const moods = {
            bright: { ambientIntensity: 1.0, keyIntensity: 1.5, exposure: 1.5 },
            dark: { ambientIntensity: 0.2, keyIntensity: 0.5, exposure: 0.8 },
            warm: { ambientColor: 0xffcc88, keyColor: 0xffaa44, rimColor: 0xff8800 },
            cool: { ambientColor: 0x88aacc, keyColor: 0x4488ff, rimColor: 0x0044aa },
            dramatic: { keyIntensity: 2.0, fillIntensity: 0.1, rimIntensity: 0.5, exposure: 1.3 },
            soft: { ambientIntensity: 0.8, keyIntensity: 0.8, fillIntensity: 0.6, shadowQuality: 'high' }
        };
        
        if (moods[lighting.mood] && AppState?.three?.lighting) {
            Object.assign(AppState.three.lighting, moods[lighting.mood]);
        }
    }
    
    spawnObjects(objects) {
        if (!this.assetManager) return;
        
        Object.entries(objects).forEach(([objType, instances]) => {
            instances.forEach((instance, index) => {
                // Try to find matching asset
                const assetId = this.findMatchingAsset(objType);
                if (assetId) {
                    // Position randomly in scene
                    const position = new THREE.Vector3(
                        (Math.random() - 0.5) * 10,
                        0,
                        (Math.random() - 0.5) * 10
                    );
                    
                    this.assetManager.addAsset(assetId, { position });
                }
            });
        });
    }
    
    findMatchingAsset(objType) {
        const assetMap = {
            ball: 'ball',
            book: 'book',
            phone: 'phone',
            gift: 'gift',
            flower: 'flower',
            food: 'apple',
            water: 'bottle', // Would need a bottle asset
            bag: 'backpack',
            hat: 'hat' // Would need a hat asset
        };
        return assetMap[objType] || null;
    }
}

// ========================================
// Scene Auto-Direction
// ========================================

export function autoDirectScene(sceneIndex) {
    const scene = AppState.scenes[sceneIndex];
    if (!scene) return;
    
    // Parse scene description
    const directions = new DirectionParser().parseScene(
        scene.description,
        scene.characters
    );
    
    // Apply directions
    const director = new CharacterDirector(
        AppState.three.scene,
        AppState.three.characters3d.filter(c => c.sceneIndex === sceneIndex),
        AppState.three.assetManager
    );
    
    director.applyDirections(directions);
    
    // Store directions in scene for later use
    scene.autoDirections = directions;
    
    return directions;
}

export function getDirectionSuggestions(sceneDescription, characters) {
    const directions = new DirectionParser().parseScene(sceneDescription, characters);
    
    // Convert to user-friendly suggestions
    const suggestions = [];
    
    Object.entries(directions.characters).forEach(([charName, charDir]) => {
        if (charDir.animation !== 'idle') {
            suggestions.push({
                type: 'animation',
                character: charName,
                action: charDir.animation,
                reason: `Detected "${charDir.animation}" in description`
            });
        }
        
        if (charDir.expression !== 'neutral') {
            suggestions.push({
                type: 'expression',
                character: charName,
                expression: charDir.expression,
                reason: `Detected "${charDir.expression}" emotion`
            });
        }
        
        charDir.interactions?.forEach(interaction => {
            suggestions.push({
                type: 'interaction',
                character: charName,
                action: interaction.action,
                target: interaction.target,
                reason: `Detected interaction "${interaction.action}"`
            });
        });
    });
    
    if (directions.camera) {
        Object.entries(directions.camera).forEach(([time, cam]) => {
            if (cam.shot) {
                suggestions.push({
                    type: 'camera',
                    shot: cam.shot,
                    time: parseFloat(time),
                    reason: `Detected "${cam.shot}" camera direction`
                });
            }
        });
    }
    
    if (directions.lighting?.mood) {
        suggestions.push({
            type: 'lighting',
            mood: directions.lighting.mood,
            reason: `Detected "${directions.lighting.mood}" lighting mood`
        });
    }
    
    return suggestions;
}

// Export for use in app.js
export { DIRECTION_PATTERNS };
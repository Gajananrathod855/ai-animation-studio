/**
 * AI Visual Director
 * Smart shot composition, pacing, and cinematic rules for professional video creation
 */

import { CHARACTER_DATABASE } from './app.js';

// ========================================
// Cinematic Rules & Shot Types
// ========================================

export const SHOT_TYPES = {
    extreme_wide: {
        name: 'एक्सट्रीम वाइड शॉट',
        shortName: 'EWS',
        description: 'विषय बहुत छोटा, वातावरण प्रमुख',
        cameraDistance: 40,
        cameraHeight: 15,
        fov: 60,
        duration: { min: 4, max: 8 },
        bestFor: ['establishing', 'location_intro', 'epic_scale']
    },
    wide: {
        name: 'वाइड शॉट',
        shortName: 'WS',
        description: 'पूरा शरीर + वातावरण',
        cameraDistance: 20,
        cameraHeight: 5,
        fov: 50,
        duration: { min: 3, max: 6 },
        bestFor: ['full_body_action', 'group_shots', 'movement']
    },
    full: {
        name: 'फुल शॉट',
        shortName: 'FS',
        description: 'सिर से पैर तक',
        cameraDistance: 12,
        cameraHeight: 2,
        fov: 45,
        duration: { min: 3, max: 5 },
        bestFor: ['character_intro', 'walking', 'dancing']
    },
    medium_wide: {
        name: 'मीडियम वाइड शॉट',
        shortName: 'MWS',
        description: 'घुटनों से ऊपर',
        cameraDistance: 9,
        cameraHeight: 1.5,
        fov: 40,
        duration: { min: 2.5, max: 4 },
        bestFor: ['dialogue_two_people', 'upper_body_action']
    },
    medium: {
        name: 'मीडियम शॉट',
        shortName: 'MS',
        description: 'कमर से ऊपर',
        cameraDistance: 7,
        cameraHeight: 1,
        fov: 35,
        duration: { min: 2, max: 4 },
        bestFor: ['dialogue', 'gestures', 'reactions']
    },
    medium_closeup: {
        name: 'मीडियम क्लोज़-अप',
        shortName: 'MCU',
        description: 'छाती से ऊपर',
        cameraDistance: 5,
        cameraHeight: 0.8,
        fov: 30,
        duration: { min: 1.5, max: 3 },
        bestFor: ['emotional_dialogue', 'important_reactions']
    },
    closeup: {
        name: 'क्लोज़-अप',
        shortName: 'CU',
        description: 'चेहरा/वस्तु फ्रेम भरता है',
        cameraDistance: 3,
        cameraHeight: 0.5,
        fov: 25,
        duration: { min: 1, max: 2.5 },
        bestFor: ['emotions', 'details', 'eyes', 'mouth']
    },
    extreme_closeup: {
        name: 'एक्सट्रीम क्लोज़-अप',
        shortName: 'ECU',
        description: 'विवरण (आंख, होंठ, हाथ)',
        cameraDistance: 1.5,
        cameraHeight: 0.3,
        fov: 20,
        duration: { min: 0.5, max: 1.5 },
        bestFor: ['intense_emotion', 'detail_reveal', 'symbolic']
    },
    over_shoulder: {
        name: 'ओवर शोल्डर',
        shortName: 'OTS',
        description: 'एक पात्र के कंधे से दूसरे को देखना',
        cameraDistance: 4,
        cameraHeight: 1.2,
        fov: 30,
        duration: { min: 2, max: 4 },
        bestFor: ['conversation', 'perspective', 'dialogue']
    },
    point_of_view: {
        name: 'POV (पॉइंट ऑफ व्यू)',
        shortName: 'POV',
        description: 'पात्र की नजर से',
        cameraDistance: 0,
        cameraHeight: 1.6,
        fov: 40,
        duration: { min: 1, max: 3 },
        bestFor: ['subjective', 'immersion', 'reveal']
    },
    two_shot: {
        name: 'टू शॉट',
        shortName: '2S',
        description: 'दो पात्र फ्रेम में',
        cameraDistance: 10,
        cameraHeight: 1,
        fov: 40,
        duration: { min: 3, max: 5 },
        bestFor: ['dialogue', 'relationship', 'interaction']
    },
    three_shot: {
        name: 'थ्री शॉट',
        shortName: '3S',
        description: 'तीन पात्र फ्रेम में',
        cameraDistance: 15,
        cameraHeight: 2,
        fov: 45,
        duration: { min: 3, max: 6 },
        bestFor: ['group_dialogue', 'team_dynamics']
    },
    dutch_angle: {
        name: 'डच एंगल',
        shortName: 'DA',
        description: 'झुका हुआ कैमरा (तनाव/अस्थिरता)',
        cameraDistance: 8,
        cameraHeight: 1,
        fov: 35,
        duration: { min: 1, max: 2 },
        bestFor: ['tension', 'disorientation', 'drunk', 'chaos']
    },
    low_angle: {
        name: 'लो एंगल',
        shortName: 'LA',
        description: 'नीचे से ऊपर देखना (शक्ति/भय)',
        cameraDistance: 8,
        cameraHeight: -1,
        fov: 40,
        duration: { min: 1.5, max: 3 },
        bestFor: ['power', 'heroic', 'intimidation', 'child_pov']
    },
    high_angle: {
        name: 'हाई एंगल',
        shortName: 'HA',
        description: 'ऊपर से नीचे देखना (कमजोरी/छोटापन)',
        cameraDistance: 10,
        cameraHeight: 5,
        fov: 40,
        duration: { min: 1.5, max: 3 },
        bestFor: ['vulnerability', 'smallness', 'overview', 'god_pov']
    },
    aerial: {
        name: 'एरियल/ड्रोन शॉट',
        shortName: 'AERIAL',
        description: 'ऊंचाई से बड़ा दृश्य',
        cameraDistance: 50,
        cameraHeight: 30,
        fov: 60,
        duration: { min: 4, max: 8 },
        bestFor: ['establishing', 'travel', 'scale', 'transition']
    },
    tracking: {
        name: 'ट्रैकिंग शॉट',
        shortName: 'TRACK',
        description: 'पात्र के साथ चलता कैमरा',
        cameraDistance: 6,
        cameraHeight: 1,
        fov: 35,
        duration: { min: 3, max: 6 },
        bestFor: ['movement', 'following', 'journey']
    }
};

// ========================================
// Camera Movements
// ========================================

export const CAMERA_MOVEMENTS = {
    static: { name: 'स्थिर', description: 'कैमरा नहीं हिलता', bestFor: ['dialogue', 'still_moments', 'tension'] },
    pan_left: { name: 'पैन लेफ्ट', description: 'बाएं घूमना', bestFor: ['reveal', 'scan', 'transition'] },
    pan_right: { name: 'पैन राइट', description: 'दाएं घूमना', bestFor: ['reveal', 'scan', 'transition'] },
    tilt_up: { name: 'टिल्ट अप', description: 'ऊपर देखना', bestFor: ['reveal_height', 'aspiration', 'hope'] },
    tilt_down: { name: 'टिल्ट डाउन', description: 'नीचे देखना', bestFor: ['reveal_detail', 'defeat', 'ground'] },
    dolly_in: { name: 'डॉली इन', description: 'विषय की ओर बढ़ना', bestFor: ['intimacy', 'focus', 'importance'] },
    dolly_out: { name: 'डॉली आउट', description: 'विषय से दूर जाना', bestFor: ['isolation', 'context', 'ending'] },
    truck_left: { name: 'ट्रक लेफ्ट', description: 'बाएं साइडवेज', bestFor: ['parallel_action', 'reveal'] },
    truck_right: { name: 'ट्रक राइट', description: 'दाएं साइडवेज', bestFor: ['parallel_action', 'reveal'] },
    pedestal_up: { name: 'पेडेस्टल अप', description: 'ऊपर उठना', bestFor: ['rising_action', 'power'] },
    pedestal_down: { name: 'पेडेस्टल डाउन', description: 'नीचे उतरना', bestFor: ['falling', 'defeat'] },
    zoom_in: { name: 'ज़ूम इन', description: 'ऑप्टिकल ज़ूम', bestFor: ['detail', 'shock', 'focus'] },
    zoom_out: { name: 'ज़ूम आउट', description: 'ऑप्टिकल ज़ूम आउट', bestFor: ['context', 'reveal', 'scale'] },
    orbit: { name: 'ऑर्बिट', description: 'विषय के चारों ओर घूमना', bestFor: ['showcase', '3d_reveal', 'dynamic'] },
    handheld: { name: 'हैंडहेल्ड', description: 'हिलता हुआ (यथार्थवाद/तनाव)', bestFor: ['realism', 'tension', 'urgency', 'documentary'] },
    whip_pan: { name: 'व्हिप पैन', description: 'तेज पैन (ट्रांजिशन)', bestFor: ['fast_transition', 'energy', 'comedy'] },
    crash_zoom: { name: 'क्रैश ज़ूम', description: 'तेज़ ज़ूम (नाटकीय)', bestFor: ['shock', 'comedy', 'dramatic_reveal'] }
};

// ========================================
// Scene Type to Shot Mapping
// ========================================

export const SCENE_SHOT_RULES = {
    introduction: {
        openingShots: ['extreme_wide', 'wide', 'aerial'],
        characterIntro: ['wide', 'full', 'medium'],
        pacing: 'slow',
        shotDuration: { min: 4, max: 8 },
        cameraMovements: ['static', 'slow_pan', 'dolly_in'],
        mood: 'calm'
    },
    inciting_incident: {
        openingShots: ['medium', 'closeup', 'medium_closeup'],
        characterIntro: ['closeup', 'extreme_closeup'],
        pacing: 'medium',
        shotDuration: { min: 2, max: 4 },
        cameraMovements: ['static', 'crash_zoom', 'whip_pan'],
        mood: 'surprise'
    },
    rising_action: {
        openingShots: ['medium', 'two_shot', 'tracking'],
        characterIntro: ['medium', 'medium_closeup', 'over_shoulder'],
        pacing: 'medium_fast',
        shotDuration: { min: 2, max: 4 },
        cameraMovements: ['tracking', 'dolly_in', 'orbit'],
        mood: 'building'
    },
    climax: {
        openingShots: ['closeup', 'extreme_closeup', 'dutch_angle', 'low_angle'],
        characterIntro: ['extreme_closeup', 'closeup', 'point_of_view'],
        pacing: 'fast',
        shotDuration: { min: 0.5, max: 2 },
        cameraMovements: ['handheld', 'crash_zoom', 'whip_pan', 'dolly_in'],
        mood: 'intense'
    },
    falling_action: {
        openingShots: ['medium', 'wide', 'two_shot'],
        characterIntro: ['medium', 'medium_closeup'],
        pacing: 'medium_slow',
        shotDuration: { min: 2, max: 5 },
        cameraMovements: ['static', 'dolly_out', 'tilt_down'],
        mood: 'relief'
    },
    resolution: {
        openingShots: ['wide', 'extreme_wide', 'aerial'],
        characterIntro: ['full', 'medium', 'wide'],
        pacing: 'slow',
        shotDuration: { min: 4, max: 8 },
        cameraMovements: ['static', 'slow_pan', 'dolly_out', 'aerial'],
        mood: 'peaceful'
    },
    dialogue: {
        openingShots: ['two_shot', 'over_shoulder', 'medium'],
        characterIntro: ['medium', 'medium_closeup', 'closeup'],
        pacing: 'medium',
        shotDuration: { min: 3, max: 5 },
        cameraMovements: ['static', 'pan_left', 'pan_right', 'over_shoulder'],
        mood: 'conversational'
    },
    action: {
        openingShots: ['wide', 'full', 'tracking'],
        characterIntro: ['medium', 'full', 'closeup'],
        pacing: 'fast',
        shotDuration: { min: 1, max: 3 },
        cameraMovements: ['tracking', 'handheld', 'orbit', 'dolly_in'],
        mood: 'dynamic'
    },
    emotional: {
        openingShots: ['closeup', 'medium_closeup', 'extreme_closeup'],
        characterIntro: ['extreme_closeup', 'closeup', 'medium_closeup'],
        pacing: 'slow',
        shotDuration: { min: 3, max: 6 },
        cameraMovements: ['static', 'dolly_in', 'slow_pan'],
        mood: 'intimate'
    },
    comedy: {
        openingShots: ['medium', 'wide', 'two_shot'],
        characterIntro: ['medium', 'closeup', 'extreme_closeup'],
        pacing: 'medium_fast',
        shotDuration: { min: 1.5, max: 3 },
        cameraMovements: ['static', 'crash_zoom', 'whip_pan', 'dutch_angle'],
        mood: 'playful'
    },
    horror: {
        openingShots: ['wide', 'extreme_wide', 'high_angle'],
        characterIntro: ['closeup', 'extreme_closeup', 'point_of_view', 'dutch_angle'],
        pacing: 'slow_then_fast',
        shotDuration: { min: 2, max: 5 },
        cameraMovements: ['static', 'slow_pan', 'handheld', 'crash_zoom'],
        mood: 'tense'
    }
};

// ========================================
// Composition Rules (Rule of Thirds, Leading Lines, etc.)
// ========================================

export const COMPOSITION_RULES = {
    rule_of_thirds: {
        name: 'थर्ड्स का नियम',
        description: 'मुख्य विषय को ग्रिड इंटरसेक्शन पर रखें',
        weight: 1.0
    },
    leading_lines: {
        name: 'लीडिंग लाइन्स',
        description: 'रेखाओं से नजर को विषय की ओर ले जाएं',
        weight: 0.8
    },
    framing: {
        name: 'फ्रेमिंग',
        description: 'प्राकृतिक फ्रेम (दरवाजे, खिड़कियां) का उपयोग',
        weight: 0.7
    },
    symmetry: {
        name: 'समरूपता',
        description: 'संतुलित संरचना (औपचारिक/शक्ति)',
        weight: 0.6
    },
    asymmetry: {
        name: 'असमरूपता',
        description: 'गतिशील असंतुलन (रुचि/तनाव)',
        weight: 0.7
    },
    depth_layers: {
        name: 'गहराई की परतें',
        description: 'अग्रभूमि, मध्यभूमि, पृष्ठभूमि',
        weight: 0.9
    },
    negative_space: {
        name: 'नेगेटिव स्पेस',
        description: 'खाली स्थान से विषय को उभारें',
        weight: 0.5
    },
    golden_ratio: {
        name: 'स्वर्ण अनुपात',
        description: 'फिबोनैचि सर्पिल संरचना',
        weight: 0.6
    },
    center_framing: {
        name: 'केंद्रीय फ्रेमिंग',
        description: 'विषय को केंद्र में (महत्व/अकेलापन)',
        weight: 0.5
    },
    eye_level: {
        name: 'आई लेवल',
        description: 'आंखों की ऊंचाई (तटस्थ/संबंध)',
        weight: 0.8
    }
};

// ========================================
// Transition Types
// ========================================

export const TRANSITION_TYPES = {
    cut: { name: 'कट', duration: 0, description: 'तत्काल परिवर्तन' },
    fade: { name: 'फेड', duration: 1, description: 'काले/सफेद से फेड' },
    dissolve: { name: 'डिसॉल्व', duration: 1.5, description: 'एक शॉट दूसरे में घुलता है' },
    wipe_left: { name: 'वाइप लेफ्ट', duration: 1, description: 'बाएं से वाइप' },
    wipe_right: { name: 'वाइप राइट', duration: 1, description: 'दाएं से वाइप' },
    wipe_up: { name: 'वाइप अप', duration: 1, description: 'नीचे से ऊपर वाइप' },
    wipe_down: { name: 'वाइप डाउन', duration: 1, description: 'ऊपर से नीचे वाइप' },
    slide_left: { name: 'स्लाइड लेफ्ट', duration: 0.8, description: 'बाएं स्लाइड' },
    slide_right: { name: 'स्लाइड राइट', duration: 0.8, description: 'दाएं स्लाइड' },
    zoom_transition: { name: 'ज़ूम ट्रांजिशन', duration: 1, description: 'ज़ूम के माध्यम से ट्रांजिशन' },
    whip_transition: { name: 'व्हिप ट्रांजिशन', duration: 0.5, description: 'तेज व्हिप पैन ट्रांजिशन' },
    match_cut: { name: 'मैच कट', duration: 0, description: 'आकार/क्रिया मिलान' },
    jump_cut: { name: 'जंप कट', duration: 0, description: 'समय में कूद' },
    l_cut: { name: 'एल कट', duration: 0, description: 'ऑडियो पहले बदलता है' },
    j_cut: { name: 'जे कट', duration: 0, description: 'ऑडियो बाद में बदलता है' }
};

// ========================================
// Visual Director Class
// ========================================

export class VisualDirector {
    constructor(scenes, characters, three) {
        this.scenes = scenes;
        this.characters = characters;
        this.three = three;
        this.shotPlan = [];
        this.currentSceneIndex = 0;
    }

    // Generate complete shot plan for all scenes
    generateShotPlan() {
        this.shotPlan = [];
        
        this.scenes.forEach((scene, sceneIndex) => {
            const sceneShots = this.generateSceneShots(scene, sceneIndex);
            this.shotPlan.push(...sceneShots);
        });

        // Add transitions between shots
        this.addTransitions();
        
        // Optimize pacing
        this.optimizePacing();
        
        return this.shotPlan;
    }

    // Generate shots for a single scene
    generateSceneShots(scene, sceneIndex) {
        const sceneType = scene.sceneType || 'introduction';
        const rules = SCENE_SHOT_RULES[sceneType] || SCENE_SHOT_RULES.introduction;
        const charactersInScene = scene.characters || [];
        const shots = [];

        // Determine number of shots based on scene duration and pacing
        const sceneDuration = scene.duration || 8;
        const avgShotDuration = (rules.shotDuration.min + rules.shotDuration.max) / 2;
        const targetShots = Math.max(1, Math.round(sceneDuration / avgShotDuration));
        const maxShots = Math.min(targetShots, charactersInScene.length + 3);

        // Opening/Establishing shot
        if (sceneIndex === 0 || scene.background !== this.scenes[sceneIndex - 1]?.background) {
            const establishingShot = this.createShot({
                sceneIndex,
                shotIndex: shots.length,
                type: rules.openingShots[0],
                characters: [],
                duration: this.getShotDuration(rules, 'establishing'),
                purpose: 'establishing',
                cameraMovement: this.selectCameraMovement(rules.cameraMovements, 'establishing'),
                composition: this.selectComposition('establishing')
            });
            shots.push(establishingShot);
        }

        // Character introduction shots
        charactersInScene.forEach((charName, charIndex) => {
            const charShots = this.generateCharacterShots(scene, sceneIndex, charName, charIndex, rules, shots.length);
            shots.push(...charShots);
        });

        // Interaction shots (if multiple characters)
        if (charactersInScene.length >= 2) {
            const interactionShots = this.generateInteractionShots(scene, sceneIndex, charactersInScene, rules, shots.length);
            shots.push(...interactionShots);
        }

        // Action/Event shots based on scene content
        if (scene.actions && scene.actions.length > 0) {
            const actionShots = this.generateActionShots(scene, sceneIndex, scene.actions, rules, shots.length);
            shots.push(...actionShots);
        }

        // Closing shot
        const closingShot = this.createShot({
            sceneIndex,
            shotIndex: shots.length,
            type: this.selectClosingShotType(rules),
            characters: charactersInScene,
            duration: this.getShotDuration(rules, 'closing'),
            purpose: 'closing',
            cameraMovement: this.selectCameraMovement(rules.cameraMovements, 'closing'),
            composition: this.selectComposition('closing')
        });
        shots.push(closingShot);

        // Limit shots to maxShots
        return this.balanceShots(shots, maxShots, sceneDuration);
    }

    // Generate character-specific shots
    generateCharacterShots(scene, sceneIndex, charName, charIndex, rules, startIndex) {
        const shots = [];
        const charData = scene.characterDetails?.[charIndex];
        const isMainCharacter = charIndex === 0;
        
        // Introduction shot for character
        const introShotType = isMainCharacter ? rules.characterIntro[0] : 
            (rules.characterIntro[1] || rules.characterIntro[0]);
        
        shots.push(this.createShot({
            sceneIndex,
            shotIndex: startIndex + shots.length,
            type: introShotType,
            characters: [charName],
            duration: this.getShotDuration(rules, 'character'),
            purpose: 'character_intro',
            cameraMovement: 'static',
            composition: this.selectComposition('character', charIndex)
        }));

        // Emotional/Reaction shot if emotional scene
        if (scene.mood && ['emotional', 'sad', 'happy', 'angry', 'scared', 'surprised'].includes(scene.mood)) {
            shots.push(this.createShot({
                sceneIndex,
                shotIndex: startIndex + shots.length,
                type: 'closeup',
                characters: [charName],
                duration: this.getShotDuration(rules, 'emotion'),
                purpose: 'emotion',
                cameraMovement: 'dolly_in',
                composition: { rule: 'rule_of_thirds', focus: 'eyes' }
            }));
        }

        // POV shot for main character in key moments
        if (isMainCharacter && (scene.sceneType === 'climax' || scene.sceneType === 'inciting_incident')) {
            shots.push(this.createShot({
                sceneIndex,
                shotIndex: startIndex + shots.length,
                type: 'point_of_view',
                characters: [charName],
                duration: this.getShotDuration(rules, 'pov'),
                purpose: 'pov',
                cameraMovement: 'static',
                composition: { rule: 'center_framing', focus: 'subject' }
            }));
        }

        return shots;
    }

    // Generate interaction shots between characters
    generateInteractionShots(scene, sceneIndex, characters, rules, startIndex) {
        const shots = [];
        
        // Two-shot for dialogue
        if (scene.dialogues && scene.dialogues.length > 0) {
            shots.push(this.createShot({
                sceneIndex,
                shotIndex: startIndex + shots.length,
                type: 'two_shot',
                characters: characters.slice(0, 2),
                duration: this.getShotDuration(rules, 'dialogue'),
                purpose: 'dialogue',
                cameraMovement: 'static',
                composition: { rule: 'rule_of_thirds', focus: 'both' }
            }));

            // Over-shoulder shots for each speaker
            scene.dialogues.forEach((dialogue, dIndex) => {
                if (dIndex < 3) { // Limit OTS shots
                    shots.push(this.createShot({
                        sceneIndex,
                        shotIndex: startIndex + shots.length,
                        type: 'over_shoulder',
                        characters: [dialogue.character, characters.find(c => c !== dialogue.character)].filter(Boolean),
                        duration: this.getShotDuration(rules, 'dialogue') * 0.8,
                        purpose: 'dialogue_reaction',
                        cameraMovement: 'static',
                        composition: { rule: 'framing', focus: 'listener' }
                    }));
                }
            });
        } else {
            // General interaction shot
            shots.push(this.createShot({
                sceneIndex,
                shotIndex: startIndex + shots.length,
                type: characters.length > 2 ? 'three_shot' : 'two_shot',
                characters: characters.slice(0, 3),
                duration: this.getShotDuration(rules, 'interaction'),
                purpose: 'interaction',
                cameraMovement: 'orbit',
                composition: { rule: 'depth_layers', focus: 'group' }
            }));
        }

        return shots;
    }

    // Generate action shots
    generateActionShots(scene, sceneIndex, actions, rules, startIndex) {
        const shots = [];
        
        actions.forEach((action, aIndex) => {
            if (aIndex >= 2) return; // Limit action shots
            
            let shotType, movement;
            
            if (action.type === 'movement' || action.type === 'walk' || action.type === 'run') {
                shotType = 'tracking';
                movement = 'tracking';
            } else if (action.type === 'gesture' || action.type === 'point') {
                shotType = 'medium_closeup';
                movement = 'static';
            } else if (action.type === 'interaction') {
                shotType = 'medium';
                movement = 'orbit';
            } else {
                shotType = 'medium';
                movement = 'static';
            }

            shots.push(this.createShot({
                sceneIndex,
                shotIndex: startIndex + shots.length,
                type: shotType,
                characters: action.characters || [],
                duration: this.getShotDuration(rules, 'action'),
                purpose: 'action',
                cameraMovement: movement,
                composition: this.selectComposition('action')
            }));
        });

        return shots;
    }

    // Create a shot object
    createShot(config) {
        const shotType = SHOT_TYPES[config.type] || SHOT_TYPES.medium;
        
        return {
            id: `shot_${config.sceneIndex}_${config.shotIndex}`,
            sceneIndex: config.sceneIndex,
            shotIndex: config.shotIndex,
            type: config.type,
            typeInfo: shotType,
            characters: config.characters,
            duration: config.duration,
            purpose: config.purpose,
            cameraMovement: config.cameraMovement,
            movementInfo: CAMERA_MOVEMENTS[config.cameraMovement] || CAMERA_MOVEMENTS.static,
            composition: config.composition,
            // Camera parameters
            cameraDistance: shotType.cameraDistance,
            cameraHeight: shotType.cameraHeight,
            cameraFOV: shotType.fov,
            // Timing
            startTime: 0, // Will be calculated
            endTime: 0,
            // Visual properties
            lookAtTarget: config.characters[0] || null,
            depthOfField: this.calculateDOF(config.type, config.purpose),
            // Lighting suggestion
            lightingMood: this.getLightingForMood(config.purpose, this.scenes[config.sceneIndex]?.mood)
        };
    }

    // Balance shots to fit scene duration
    balanceShots(shots, maxShots, sceneDuration) {
        if (shots.length <= maxShots) return shots;

        // Prioritize: establishing > character_intro > dialogue > action > emotion > closing
        const priority = {
            establishing: 10,
            character_intro: 9,
            dialogue: 8,
            dialogue_reaction: 7,
            interaction: 6,
            action: 5,
            emotion: 5,
            pov: 4,
            closing: 3
        };

        shots.sort((a, b) => (priority[b.purpose] || 0) - (priority[a.purpose] || 0));
        const selected = shots.slice(0, maxShots);
        
        // Redistribute duration
        const totalDuration = selected.reduce((sum, s) => sum + s.duration, 0);
        const scale = sceneDuration / totalDuration;
        
        selected.forEach(s => s.duration *= scale);
        
        // Re-sort by original shot index
        selected.sort((a, b) => a.shotIndex - b.shotIndex);
        
        return selected;
    }

    // Add transitions between shots
    addTransitions() {
        for (let i = 1; i < this.shotPlan.length; i++) {
            const prevShot = this.shotPlan[i - 1];
            const currShot = this.shotPlan[i];
            
            // Determine transition type
            let transitionType = 'cut';
            
            if (prevShot.sceneIndex !== currShot.sceneIndex) {
                // Scene transition
                transitionType = this.selectSceneTransition(prevShot, currShot);
            } else if (prevShot.type !== currShot.type) {
                // Shot type change within scene
                transitionType = this.selectShotTransition(prevShot, currShot);
            }
            
            currShot.transition = {
                type: transitionType,
                duration: TRANSITION_TYPES[transitionType]?.duration || 0,
                info: TRANSITION_TYPES[transitionType]
            };
        }
    }

    // Select transition between scenes
    selectSceneTransition(prevShot, currShot) {
        const prevMood = this.scenes[prevShot.sceneIndex]?.mood || 'neutral';
        const currMood = this.scenes[currShot.sceneIndex]?.mood || 'neutral';
        
        if (prevMood === 'tense' && currMood === 'peaceful') return 'fade';
        if (prevMood === 'peaceful' && currMood === 'tense') return 'crash_zoom';
        if (currShot.purpose === 'establishing') return 'dissolve';
        if (currMood === 'dream' || currMood === 'memory') return 'dissolve';
        return 'cut';
    }

    // Select transition between shots in same scene
    selectShotTransition(prevShot, currShot) {
        // Match cut if similar composition
        if (prevShot.composition?.rule === currShot.composition?.rule) return 'match_cut';
        
        // J-cut for dialogue
        if (prevShot.purpose === 'dialogue' && currShot.purpose === 'dialogue_reaction') return 'j_cut';
        if (prevShot.purpose === 'dialogue_reaction' && currShot.purpose === 'dialogue') return 'l_cut';
        
        // Fast transitions for action
        if (prevShot.purpose === 'action' || currShot.purpose === 'action') return 'whip_transition';
        
        // Emotional moments
        if (prevShot.purpose === 'emotion' || currShot.purpose === 'emotion') return 'dissolve';
        
        return 'cut';
    }

    // Optimize overall pacing
    optimizePacing() {
        // Ensure minimum shot duration
        this.shotPlan.forEach(shot => {
            shot.duration = Math.max(shot.duration, 0.5);
        });

        // Adjust for 180-degree rule (maintain screen direction)
        this.enforce180DegreeRule();

        // Calculate start/end times
        let currentTime = 0;
        this.shotPlan.forEach(shot => {
            shot.startTime = currentTime;
            currentTime += shot.duration + (shot.transition?.duration || 0);
            shot.endTime = currentTime;
        });
    }

    // Enforce 180-degree rule for dialogue scenes
    enforce180DegreeRule() {
        const dialogueShots = this.shotPlan.filter(s => s.purpose === 'dialogue' || s.purpose === 'dialogue_reaction');
        
        if (dialogueShots.length < 2) return;
        
        // Establish line of action from first dialogue shot
        const firstDialogue = dialogueShots[0];
        if (firstDialogue.characters.length < 2) return;
        
        const charA = firstDialogue.characters[0];
        const charB = firstDialogue.characters[1];
        
        // Ensure subsequent OTS shots maintain screen direction
        dialogueShots.forEach((shot, i) => {
            if (i > 0 && shot.purpose === 'dialogue_reaction') {
                // Check if characters are flipped
                if (shot.characters[0] === charB && shot.characters[1] === charA) {
                    // Flip camera to maintain 180-degree rule
                    shot.cameraDistance = Math.abs(shot.cameraDistance);
                }
            }
        });
    }

    // Helper methods
    getShotDuration(rules, purpose) {
        const baseMin = rules.shotDuration.min;
        const baseMax = rules.shotDuration.max;
        
        const multipliers = {
            establishing: 1.5,
            character: 1.0,
            emotion: 1.2,
            pov: 0.8,
            dialogue: 1.0,
            interaction: 1.0,
            action: 0.7,
            closing: 1.3
        };
        
        const mult = multipliers[purpose] || 1.0;
        return baseMin * mult + Math.random() * (baseMax - baseMin) * mult;
    }

    selectCameraMovement(movements, purpose) {
        const purposeMovements = {
            establishing: ['static', 'pan_left', 'pan_right', 'aerial', 'slow_pan'],
            character: ['static', 'dolly_in'],
            emotion: ['static', 'dolly_in', 'slow_pan'],
            pov: ['static', 'handheld'],
            dialogue: ['static', 'pan_left', 'pan_right'],
            interaction: ['static', 'orbit'],
            action: ['tracking', 'handheld', 'orbit', 'dolly_in'],
            closing: ['static', 'dolly_out', 'slow_pan', 'aerial']
        };
        
        const allowed = purposeMovements[purpose] || ['static'];
        const available = movements.filter(m => allowed.some(a => m.includes(a)));
        return available.length > 0 ? available[Math.floor(Math.random() * available.length)] : 'static';
    }

    selectComposition(purpose, charIndex = 0) {
        const purposeCompositions = {
            establishing: ['depth_layers', 'rule_of_thirds', 'leading_lines', 'golden_ratio'],
            character: ['rule_of_thirds', 'eye_level', 'depth_layers'],
            emotion: ['rule_of_thirds', 'center_framing', 'negative_space'],
            pov: ['center_framing', 'eye_level'],
            dialogue: ['rule_of_thirds', 'over_shoulder', 'eye_level'],
            interaction: ['rule_of_thirds', 'depth_layers', 'framing'],
            action: ['rule_of_thirds', 'leading_lines', 'depth_layers'],
            closing: ['rule_of_thirds', 'symmetry', 'aerial', 'depth_layers']
        };
        
        const allowed = purposeCompositions[purpose] || ['rule_of_thirds'];
        const rule = allowed[Math.floor(Math.random() * allowed.length)];
        
        return { rule, focus: this.getFocusForPurpose(purpose) };
    }

    getFocusForPurpose(purpose) {
        const focuses = {
            establishing: 'environment',
            character: 'face_body',
            emotion: 'eyes',
            pov: 'subject',
            dialogue: 'speaker',
            interaction: 'group',
            action: 'movement',
            closing: 'environment'
        };
        return focuses[purpose] || 'subject';
    }

    selectClosingShotType(rules) {
        const closingTypes = ['wide', 'extreme_wide', 'aerial', 'full'];
        return closingTypes[Math.floor(Math.random() * closingTypes.length)];
    }

    calculateDOF(shotType, purpose) {
        if (purpose === 'emotion' || shotType === 'closeup' || shotType === 'extreme_closeup') {
            return 'shallow'; // Blur background
        }
        if (purpose === 'establishing' || shotType === 'wide' || shotType === 'extreme_wide') {
            return 'deep'; // Everything in focus
        }
        return 'medium';
    }

    getLightingForMood(purpose, mood) {
        const moodLighting = {
            calm: 'soft_natural',
            surprise: 'dramatic_contrast',
            building: 'motivated',
            intense: 'high_contrast',
            relief: 'warm_soft',
            peaceful: 'golden_hour',
            conversational: 'three_point',
            dynamic: 'motivated',
            intimate: 'soft_warm',
            playful: 'bright_even',
            tense: 'low_key'
        };
        return moodLighting[mood] || 'standard';
    }

    // Apply shot plan to 3D scene
    applyShotPlan(shotPlan) {
        // This would be called during animation playback
        // to update camera, lighting, and composition per shot
        return shotPlan;
    }

    // Get shot plan for UI display
    getShotPlanSummary() {
        return this.shotPlan.map(shot => ({
            id: shot.id,
            scene: shot.sceneIndex + 1,
            shot: shot.shotIndex + 1,
            type: shot.typeInfo.shortName,
            typeName: shot.typeInfo.name,
            duration: shot.duration.toFixed(1) + 's',
            purpose: shot.purpose,
            movement: shot.movementInfo.name,
            composition: shot.composition?.rule,
            characters: shot.characters.join(', ')
        }));
    }
}

// ========================================
// Auto-Direct with Visual Director
// ========================================

export function autoDirectWithVisualDirector(scenes, characters, three) {
    const director = new VisualDirector(scenes, characters, three);
    const shotPlan = director.generateShotPlan();
    
    // Apply to scene data
    scenes.forEach((scene, sceneIndex) => {
        const sceneShots = shotPlan.filter(s => s.sceneIndex === sceneIndex);
        scene.shotPlan = sceneShots;
        scene.visualDirectorApplied = true;
    });
    
    return {
        shotPlan,
        summary: director.getShotPlanSummary(),
        totalShots: shotPlan.length,
        totalDuration: shotPlan.reduce((sum, s) => sum + s.duration, 0)
    };
}

// ========================================
// Shot Suggestion for Manual Control
// ========================================

export function getShotSuggestions(scene, currentShot = null) {
    const sceneType = scene.sceneType || 'introduction';
    const rules = SCENE_SHOT_RULES[sceneType] || SCENE_SHOT_RULES.introduction;
    const characters = scene.characters || [];
    
    const suggestions = [];
    
    // Suggest based on what's missing
    const existingTypes = scene.shotPlan?.map(s => s.type) || [];
    
    // Establishing shot
    if (!existingTypes.some(t => ['extreme_wide', 'wide', 'aerial'].includes(t))) {
        suggestions.push({
            type: rules.openingShots[0],
            reason: 'स्थापना शॉट की आवश्यकता है',
            priority: 'high'
        });
    }
    
    // Character shots
    characters.forEach((char, i) => {
        if (!existingTypes.some(t => ['full', 'medium', 'closeup', 'medium_closeup'].includes(t))) {
            suggestions.push({
                type: rules.characterIntro[i] || rules.characterIntro[0],
                reason: `${char} का परिचय शॉट`,
                priority: 'high'
            });
        }
    });
    
    // Dialogue shots
    if (scene.dialogues && scene.dialogues.length > 0) {
        if (!existingTypes.includes('two_shot') && characters.length >= 2) {
            suggestions.push({
                type: 'two_shot',
                reason: 'संवाद के लिए टू-शॉट',
                priority: 'medium'
            });
        }
        if (!existingTypes.includes('over_shoulder') && characters.length >= 2) {
            suggestions.push({
                type: 'over_shoulder',
                reason: 'प्रतिक्रिया शॉट (ओवर शोल्डर)',
                priority: 'medium'
            });
        }
    }
    
    // Emotional closeup
    if (scene.mood && ['emotional', 'sad', 'happy', 'angry', 'scared'].includes(scene.mood)) {
        if (!existingTypes.some(t => ['closeup', 'extreme_closeup'].includes(t))) {
            suggestions.push({
                type: 'closeup',
                reason: 'भावनात्मक क्लोज़-अप',
                priority: 'high'
            });
        }
    }
    
    // Action shots
    if (scene.actions && scene.actions.length > 0) {
        if (!existingTypes.includes('tracking') && !existingTypes.includes('full')) {
            suggestions.push({
                type: 'tracking',
                reason: 'क्रिया ट्रैकिंग शॉट',
                priority: 'medium'
            });
        }
    }
    
    return suggestions.sort((a, b) => {
        const priority = { high: 3, medium: 2, low: 1 };
        return priority[b.priority] - priority[a.priority];
    });
}

// ========================================
// Export
// ========================================

export { SHOT_TYPES, CAMERA_MOVEMENTS, SCENE_SHOT_RULES, COMPOSITION_RULES, TRANSITION_TYPES };
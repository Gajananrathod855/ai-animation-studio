/**
 * Character and Scene Continuity Validation System
 * Validates consistency across scenes, checks for continuity errors
 */

import { CHARACTER_DATABASE } from './app.js';

// ========================================
// Continuity Types
// ========================================

export const CONTINUITY_CHECKS = {
    character_appearance: {
        name: 'पात्र उपस्थिति',
        description: 'पात्रों की शारीरिक विशेषताएं सुसंगत हैं',
        severity: 'error'
    },
    character_position: {
        name: 'पात्र स्थिति',
        description: 'सीन के बीच पात्रों की स्थिति तार्किक है',
        severity: 'warning'
    },
    character_animation: {
        name: 'पात्र एनिमेशन',
        description: 'एनिमेशन सीन कंटेक्स्ट से मेल खाते हैं',
        severity: 'info'
    },
    prop_consistency: {
        name: 'प्रॉप निरंतरता',
        description: 'वस्तुएं सीन में बनी रहती हैं या तार्किक रूप से प्रकट/गायब होती हैं',
        severity: 'warning'
    },
    lighting_consistency: {
        name: 'लाइटिंग निरंतरता',
        description: 'लाइटिंग मूड सीन के बीच सुसंगत है',
        severity: 'info'
    },
    time_continuity: {
        name: 'समय निरंतरता',
        description: 'दिन का समय तार्किक रूप से आगे बढ़ता है',
        severity: 'warning'
    },
    location_continuity: {
        name: 'स्थान निरंतरता',
        description: 'स्थान परिवर्तन तार्किक हैं',
        severity: 'warning'
    },
    character_count: {
        name: 'पात्र संख्या',
        description: 'पात्र बिना स्पष्टीकरण के प्रकट/गायब नहीं होते',
        severity: 'error'
    },
    emotion_continuity: {
        name: 'भावना निरंतरता',
        description: 'भावनात्मक स्थिति सीन के बीच सुसंगत है',
        severity: 'info'
    }
};

// ========================================
// Continuity Validator
// ========================================

export class ContinuityValidator {
    constructor(scenes) {
        this.scenes = scenes;
        this.issues = [];
        this.warnings = [];
        this.info = [];
    }

    // Run all continuity checks
    validate() {
        this.issues = [];
        this.warnings = [];
        this.info = [];

        this.checkCharacterAppearance();
        this.checkCharacterPosition();
        this.checkCharacterAnimation();
        this.checkPropConsistency();
        this.checkLightingConsistency();
        this.checkTimeContinuity();
        this.checkLocationContinuity();
        this.checkCharacterCount();
        this.checkEmotionContinuity();

        return {
            issues: this.issues,
            warnings: this.warnings,
            info: this.info,
            summary: this.getSummary()
        };
    }

    // Check character appearance consistency
    checkCharacterAppearance() {
        const characterAppearances = new Map();

        this.scenes.forEach((scene, sceneIndex) => {
            if (!scene.characters3d) return;

            scene.characters3d.forEach((char, charIndex) => {
                const charName = scene.characters[charIndex];
                const key = `${charName}_${charIndex}`;

                if (!characterAppearances.has(key)) {
                    characterAppearances.set(key, {
                        name: charName,
                        firstScene: sceneIndex,
                        appearances: []
                    });
                }

                const data = characterAppearances.get(key);
                data.appearances.push({
                    sceneIndex,
                    bodyType: char.bodyType,
                    skinTone: char.skinTone,
                    hairStyle: char.hairStyle,
                    hairColor: char.hairColor,
                    eyeColor: char.eyeColor,
                    clothing: char.clothing,
                    shirtColor: char.shirtColor,
                    pantsColor: char.pantsColor,
                    shoesColor: char.shoesColor,
                    bodyScale: char.bodyScale,
                    headScale: char.headScale,
                    limbLength: char.limbLength
                });
            });
        });

        // Compare appearances across scenes
        characterAppearances.forEach((data, key) => {
            if (data.appearances.length < 2) return;

            const first = data.appearances[0];
            data.appearances.slice(1).forEach((appearance, index) => {
                const sceneIndex = appearance.sceneIndex;
                const changes = [];

                Object.keys(first).forEach(prop => {
                    if (prop === 'sceneIndex') return;
                    if (first[prop] !== appearance[prop]) {
                        changes.push({
                            property: prop,
                            from: first[prop],
                            to: appearance[prop]
                        });
                    }
                });

                if (changes.length > 0) {
                    this.issues.push({
                        type: 'character_appearance',
                        severity: 'error',
                        sceneIndex,
                        character: data.name,
                        message: `${data.name} की उपस्थिति सीन ${sceneIndex + 1} में बदल गई`,
                        details: changes,
                        suggestion: 'पात्र की उपस्थिति सभी सीन में समान रखें या बदलाव के लिए स्पष्टीकरण जोड़ें'
                    });
                }
            });
        });
    }

    // Check character position continuity
    checkCharacterPosition() {
        this.scenes.forEach((scene, sceneIndex) => {
            if (sceneIndex === 0) return;
            if (!scene.characters3d || !this.scenes[sceneIndex - 1].characters3d) return;

            const prevScene = this.scenes[sceneIndex - 1];

            scene.characters3d.forEach((char, charIndex) => {
                const charName = scene.characters[charIndex];
                const prevChar = prevScene.characters3d.find((c, i) => 
                    prevScene.characters[i] === charName
                );

                if (prevChar && char.position && prevChar.position) {
                    const distance = Math.sqrt(
                        Math.pow(char.position.x - prevChar.position.x, 2) +
                        Math.pow(char.position.z - prevChar.position.z, 2)
                    );

                    // If character moved more than 20 units without walking animation
                    if (distance > 20 && char.animation !== 'walk' && char.animation !== 'run') {
                        this.warnings.push({
                            type: 'character_position',
                            severity: 'warning',
                            sceneIndex,
                            character: charName,
                            message: `${charName} सीन ${sceneIndex} और ${sceneIndex + 1} के बीच ${distance.toFixed(1)} यूनिट चला गया`,
                            details: { distance, prevPos: prevChar.position, currPos: char.position },
                            suggestion: 'चलने की एनिमेशन जोड़ें या स्थिति परिवर्तन को छोटा करें'
                        });
                    }
                }
            });
        });
    }

    // Check animation appropriateness
    checkCharacterAnimation() {
        const sceneTypeAnimations = {
            introduction: ['idle', 'wave', 'talk'],
            inciting_incident: ['surprised', 'talk', 'point', 'walk'],
            rising_action: ['walk', 'run', 'point', 'talk', 'wave'],
            climax: ['point', 'run', 'angry', 'surprised', 'jump'],
            falling_action: ['happy', 'wave', 'idle', 'talk'],
            resolution: ['wave', 'happy', 'idle', 'nod']
        };

        this.scenes.forEach((scene, sceneIndex) => {
            const sceneType = scene.sceneType || 'introduction';
            const appropriateAnims = sceneTypeAnimations[sceneType] || ['idle'];

            if (!scene.characters3d) return;

            scene.characters3d.forEach((char, charIndex) => {
                const charName = scene.characters[charIndex];
                const anim = char.animation || 'idle';

                if (!appropriateAnims.includes(anim)) {
                    this.info.push({
                        type: 'character_animation',
                        severity: 'info',
                        sceneIndex,
                        character: charName,
                        message: `${charName} "${anim}" एनिमेशन का उपयोग कर रहा है जो "${sceneType}" सीन के लिए असामान्य है`,
                        details: { animation: anim, sceneType, appropriate: appropriateAnims },
                        suggestion: `विचार करें: ${appropriateAnims.join(', ')}`
                    });
                }
            });
        });
    }

    // Check prop consistency
    checkPropConsistency() {
        const sceneProps = new Map();

        this.scenes.forEach((scene, sceneIndex) => {
            if (!scene.assets) return;

            scene.assets.forEach(asset => {
                const key = `${asset.assetId}_${asset.instanceId || ''}`;
                if (!sceneProps.has(key)) {
                    sceneProps.set(key, {
                        assetId: asset.assetId,
                        name: asset.assetName,
                        scenes: []
                    });
                }
                sceneProps.get(key).scenes.push(sceneIndex);
            });
        });

        // Check for props that appear/disappear without explanation
        sceneProps.forEach((prop, key) => {
            if (prop.scenes.length < 2) return;

            const sortedScenes = prop.scenes.sort((a, b) => a - b);
            for (let i = 1; i < sortedScenes.length; i++) {
                const gap = sortedScenes[i] - sortedScenes[i - 1];
                if (gap > 1) {
                    this.warnings.push({
                        type: 'prop_consistency',
                        severity: 'warning',
                        sceneIndex: sortedScenes[i],
                        character: null,
                        message: `${prop.name} सीन ${sortedScenes[i - 1] + 1} के बाद गायब हुआ और सीन ${sortedScenes[i] + 1} में फिर से प्रकट हुआ`,
                        details: { prop: prop.assetId, missingScenes: gap - 1 },
                        suggestion: 'वस्तु के गायब होने/प्रकट होने का कारण जोड़ें या इसे बीच के सीन में रखें'
                    });
                }
            }
        });
    }

    // Check lighting consistency
    checkLightingConsistency() {
        this.scenes.forEach((scene, sceneIndex) => {
            if (sceneIndex === 0) return;

            const prevLighting = this.scenes[sceneIndex - 1].lightingSuggestion;
            const currLighting = scene.lightingSuggestion;

            if (prevLighting && currLighting && prevLighting !== currLighting) {
                // Check if it's a dramatic change
                const dramaticChanges = [
                    ['bright_cheerful', 'dark_shadows'],
                    ['moonlight', 'bright_cheerful'],
                    ['dramatic_contrast', 'soft_natural']
                ];

                const isDramatic = dramaticChanges.some(([a, b]) => 
                    (prevLighting === a && currLighting === b) || (prevLighting === b && currLighting === a)
                );

                if (isDramatic) {
                    this.warnings.push({
                        type: 'lighting_consistency',
                        severity: 'warning',
                        sceneIndex,
                        character: null,
                        message: `लाइटिंग "${prevLighting}" से "${currLighting}" में नाटकीय रूप से बदल गई`,
                        details: { from: prevLighting, to: currLighting },
                        suggestion: 'लाइटिंग परिवर्तन को क्रमिक बनाएं या सीन विवरण में कारण जोड़ें'
                    });
                }
            }
        });
    }

    // Check time continuity
    checkTimeContinuity() {
        const timeOrder = ['morning', 'day', 'afternoon', 'evening', 'night'];
        const timeIndex = (time) => timeOrder.indexOf(time);

        this.scenes.forEach((scene, sceneIndex) => {
            if (sceneIndex === 0) return;

            const prevTime = this.scenes[sceneIndex - 1].timeOfDay;
            const currTime = scene.timeOfDay;

            if (prevTime && currTime && prevTime !== currTime) {
                const prevIdx = timeIndex(prevTime);
                const currIdx = timeIndex(currTime);

                // Time should generally move forward or stay same
                if (currIdx < prevIdx - 1) {
                    this.warnings.push({
                        type: 'time_continuity',
                        severity: 'warning',
                        sceneIndex,
                        character: null,
                        message: `समय "${prevTime}" से "${currTime}" में पीछे चला गया`,
                        details: { from: prevTime, to: currTime },
                        suggestion: 'समय को तार्किक रूप से आगे बढ़ाएं या फ्लैशबैक/टाइम जंप का संकेत दें'
                    });
                } else if (currIdx > prevIdx + 1) {
                    this.info.push({
                        type: 'time_continuity',
                        severity: 'info',
                        sceneIndex,
                        character: null,
                        message: `समय "${prevTime}" से "${currTime}" में आगे कूद गया`,
                        details: { from: prevTime, to: currTime },
                        suggestion: 'टाइम जंप के लिए संक्रमण सीन या संकेत जोड़ें'
                    });
                }
            }
        });
    }

    // Check location continuity
    checkLocationContinuity() {
        this.scenes.forEach((scene, sceneIndex) => {
            if (sceneIndex === 0) return;

            const prevLocation = this.scenes[sceneIndex - 1].background;
            const currLocation = scene.background;

            if (prevLocation && currLocation && prevLocation !== currLocation) {
                // Check if locations are logically connected
                const connectedLocations = {
                    'घर': ['गांव', 'शहर', 'गार्डन'],
                    'गांव': ['घर', 'खेत', 'जंगल', 'नदी'],
                    'शहर': ['घर', 'बाजार', 'स्कूल', 'हॉस्पिटल'],
                    'जंगल': ['गांव', 'नदी', 'पहाड़', 'गुफा'],
                    'नदी': ['जंगल', 'गांव', 'पहाड़', 'समुद्र'],
                    'पहाड़': ['जंगल', 'नदी', 'गुफा', 'आकाश'],
                    'गार्डन': ['घर', 'स्कूल', 'पार्क'],
                    'स्कूल': ['गार्डन', 'कक्षा', 'खेल का मैदान'],
                    'कक्षा': ['स्कूल', 'पुस्तकालय', 'प्रयोगशाला'],
                    'अंतरिक्ष': ['पृथ्वी', 'चंद्रमा', 'अंतरिक्ष स्टेशन'],
                    'पानी के नीचे': ['समुद्र', 'मूंगा चट्टान', 'गुफा'],
                    'रेगिस्तान': ['ओएसिस', 'पहाड़', 'खंडहर']
                };

                const connections = connectedLocations[prevLocation] || [];
                if (!connections.includes(currLocation)) {
                    this.warnings.push({
                        type: 'location_continuity',
                        severity: 'warning',
                        sceneIndex,
                        character: null,
                        message: `स्थान "${prevLocation}" से "${currLocation}" में अप्रत्याशित रूप से बदल गया`,
                        details: { from: prevLocation, to: currLocation },
                        suggestion: 'स्थान परिवर्तन के लिए संक्रमण सीन या यात्रा संकेत जोड़ें'
                    });
                }
            }
        });
    }

    // Check character count continuity
    checkCharacterCount() {
        this.scenes.forEach((scene, sceneIndex) => {
            if (sceneIndex === 0) return;

            const prevChars = new Set(this.scenes[sceneIndex - 1].characters);
            const currChars = new Set(scene.characters);

            // Characters that disappeared
            const disappeared = [...prevChars].filter(c => !currChars.has(c));
            // Characters that appeared
            const appeared = [...currChars].filter(c => !prevChars.has(c));

            if (disappeared.length > 0) {
                disappeared.forEach(char => {
                    this.issues.push({
                        type: 'character_count',
                        severity: 'error',
                        sceneIndex,
                        character: char,
                        message: `${char} सीन ${sceneIndex} में था लेकिन सीन ${sceneIndex + 1} में गायब है`,
                        details: { disappeared },
                        suggestion: 'पात्र के जाने का कारण दिखाएं या स्पष्ट करें'
                    });
                });
            }

            if (appeared.length > 0) {
                appeared.forEach(char => {
                    this.issues.push({
                        type: 'character_count',
                        severity: 'error',
                        sceneIndex,
                        character: char,
                        message: `${char} सीन ${sceneIndex + 1} में बिना परिचय के प्रकट हुआ`,
                        details: { appeared },
                        suggestion: 'नए पात्र का परिचय दें या उसके प्रकट होने का कारण दिखाएं'
                    });
                });
            }
        });
    }

    // Check emotion continuity
    checkEmotionContinuity() {
        this.scenes.forEach((scene, sceneIndex) => {
            if (sceneIndex === 0) return;

            const prevMood = this.scenes[sceneIndex - 1].mood;
            const currMood = scene.mood;

            if (prevMood && currMood && prevMood !== currMood) {
                // Check for jarring emotional shifts
                const emotionalShifts = {
                    happy: ['sad', 'angry', 'scared'],
                    sad: ['happy', 'angry'],
                    angry: ['happy', 'peaceful'],
                    scared: ['happy', 'peaceful'],
                    peaceful: ['angry', 'scared'],
                    surprised: ['peaceful', 'sad']
                };

                const jarring = emotionalShifts[prevMood]?.includes(currMood);

                if (jarring) {
                    this.warnings.push({
                        type: 'emotion_continuity',
                        severity: 'warning',
                        sceneIndex,
                        character: null,
                        message: `भावनात्मक स्वर "${prevMood}" से "${currMood}" में अचानक बदल गया`,
                        details: { from: prevMood, to: currMood },
                        suggestion: 'भावनात्मक परिवर्तन को क्रमिक बनाएं या ट्रिगर घटना दिखाएं'
                    });
                }
            }
        });
    }

    // Get summary of validation results
    getSummary() {
        const total = this.issues.length + this.warnings.length + this.info.length;
        const bySeverity = {
            error: this.issues.length,
            warning: this.warnings.length,
            info: this.info.length
        };
        const byType = {};

        [...this.issues, ...this.warnings, ...this.info].forEach(item => {
            byType[item.type] = (byType[item.type] || 0) + 1;
        });

        return {
            total,
            bySeverity,
            byType,
            passed: this.issues.length === 0
        };
    }
}

// ========================================
// Auto-fix suggestions
// ========================================

export function generateFixSuggestions(validationResult) {
    const suggestions = [];

    validationResult.issues.forEach(issue => {
        switch (issue.type) {
            case 'character_appearance':
                suggestions.push({
                    type: 'fix_appearance',
                    sceneIndex: issue.sceneIndex,
                    character: issue.character,
                    action: 'reset_to_first_scene',
                    description: `${issue.character} की उपस्थिति को पहले सीन से मेल खाने के लिए रीसेट करें`
                });
                break;
            case 'character_count':
                if (issue.details.disappeared) {
                    suggestions.push({
                        type: 'add_exit_scene',
                        sceneIndex: issue.sceneIndex - 1,
                        character: issue.character,
                        action: 'add_exit_animation',
                        description: `${issue.character} के लिए निकास एनिमेशन जोड़ें`
                    });
                }
                if (issue.details.appeared) {
                    suggestions.push({
                        type: 'add_intro_scene',
                        sceneIndex: issue.sceneIndex,
                        character: issue.character,
                        action: 'add_intro_animation',
                        description: `${issue.character} के लिए प्रवेश एनिमेशन जोड़ें`
                    });
                }
                break;
        }
    });

    validationResult.warnings.forEach(warning => {
        switch (warning.type) {
            case 'character_position':
                suggestions.push({
                    type: 'add_walk_animation',
                    sceneIndex: warning.sceneIndex,
                    character: warning.character,
                    action: 'insert_walk_between_scenes',
                    description: `${warning.character} के लिए चलने की एनिमेशन डालें`
                });
                break;
            case 'time_continuity':
                suggestions.push({
                    type: 'add_time_transition',
                    sceneIndex: warning.sceneIndex,
                    action: 'add_transition_scene',
                    description: 'समय परिवर्तन के लिए संक्रमण सीन जोड़ें'
                });
                break;
            case 'location_continuity':
                suggestions.push({
                    type: 'add_travel_scene',
                    sceneIndex: warning.sceneIndex,
                    action: 'add_travel_animation',
                    description: 'स्थान परिवर्तन के लिए यात्रा एनिमेशन जोड़ें'
                });
                break;
        }
    });

    return suggestions;
}

// ========================================
// Export
// ========================================

export { CONTINUITY_CHECKS };
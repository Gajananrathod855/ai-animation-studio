/**
 * Enhanced Music and Sound Effects System
 * Procedural music generation, layered SFX, advanced audio controls
 */

// ========================================
// Musical Scales & Chords
// ========================================

export const MUSICAL_SCALES = {
    major: [0, 2, 4, 5, 7, 9, 11],
    minor: [0, 2, 3, 5, 7, 8, 10],
    pentatonicMajor: [0, 2, 4, 7, 9],
    pentatonicMinor: [0, 3, 5, 7, 10],
    blues: [0, 3, 5, 6, 7, 10],
    dorian: [0, 2, 3, 5, 7, 9, 10],
    mixolydian: [0, 2, 4, 5, 7, 9, 10],
    lydian: [0, 2, 4, 6, 7, 9, 11],
    phrygian: [0, 1, 3, 5, 7, 8, 10],
    locrian: [0, 1, 3, 5, 6, 8, 10],
    harmonicMinor: [0, 2, 3, 5, 7, 8, 11],
    melodicMinor: [0, 2, 3, 5, 7, 9, 11],
    indian: [0, 2, 4, 6, 7, 9, 11], // Bhairav
    japanese: [0, 2, 3, 7, 8], // In-sen
    chinese: [0, 2, 4, 7, 9], // Pentatonic
    arabic: [0, 2, 4, 5, 7, 8, 11], // Hijaz
    spanish: [0, 1, 4, 5, 7, 8, 11] // Phrygian dominant
};

export const CHORD_PROGRESSIONS = {
    // Major key progressions
    'I-V-vi-IV': [0, 7, 9, 5], // Pop progression
    'vi-IV-I-V': [9, 5, 0, 7], // Pop variation
    'I-IV-V': [0, 5, 7], // Basic
    'ii-V-I': [2, 7, 0], // Jazz
    'I-vi-ii-V': [0, 9, 2, 7], // Turnaround
    'I-V-vi-iii-IV-I-IV-V': [0, 7, 9, 4, 5, 0, 5, 7], // Extended
    
    // Minor key progressions
    'i-VII-VI-VII': [0, 10, 8, 10], // Minor pop
    'i-iv-VII-III': [0, 5, 10, 3], // Minor jazz
    'i-VI-III-VII': [0, 8, 3, 10], // Andalusian cadence
    'i-iv-v': [0, 5, 7], // Minor basic
    
    // Emotional progressions
    emotional: [0, 5, 9, 7], // I-IV-vi-V
    hopeful: [0, 7, 9, 5, 0, 5, 7, 9], // I-V-vi-IV-I-IV-V-vi
    sad: [9, 5, 0, 7], // vi-IV-I-V
    tense: [0, 1, 5, 7], // I-bII-IV-V
    mysterious: [0, 3, 8, 10], // i-bIII-bVI-bVII
    epic: [0, 7, 5, 9, 0, 7, 5, 9], // I-V-IV-vi
    peaceful: [0, 5, 7, 9], // I-IV-V-vi
    romantic: [9, 5, 0, 4, 5, 7], // vi-IV-I-iii-IV-V
    dark: [0, 3, 8, 10, 0], // i-bIII-bVI-bVII-i
    triumphant: [0, 7, 9, 5, 7, 0] // I-V-vi-IV-V-I
};

// ========================================
// Instrument Definitions
// ========================================

export const INSTRUMENTS = {
    // Pads/Atmospheric
    pad: { type: 'synth', wave: 'sine', attack: 2, decay: 0.5, sustain: 0.8, release: 3, filter: 'lowpass', filterFreq: 800 },
    warmPad: { type: 'synth', wave: 'triangle', attack: 3, decay: 1, sustain: 0.7, release: 4, filter: 'lowpass', filterFreq: 600 },
    brightPad: { type: 'synth', wave: 'sawtooth', attack: 1, decay: 0.5, sustain: 0.6, release: 2, filter: 'lowpass', filterFreq: 2000 },
    strings: { type: 'synth', wave: 'sawtooth', attack: 1.5, decay: 0.5, sustain: 0.8, release: 2, filter: 'lowpass', filterFreq: 1500 },
    choir: { type: 'synth', wave: 'sine', attack: 2, decay: 0.5, sustain: 0.9, release: 3, filter: 'lowpass', filterFreq: 1000 },
    
    // Leads
    lead: { type: 'synth', wave: 'square', attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.5, filter: 'lowpass', filterFreq: 3000 },
    pluckyLead: { type: 'synth', wave: 'triangle', attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.3, filter: 'lowpass', filterFreq: 2000 },
    bell: { type: 'synth', wave: 'sine', attack: 0.01, decay: 0.5, sustain: 0, release: 2, filter: 'none' },
    
    // Bass
    bass: { type: 'synth', wave: 'sine', attack: 0.01, decay: 0.1, sustain: 0.8, release: 0.5, filter: 'lowpass', filterFreq: 200 },
    subBass: { type: 'synth', wave: 'sine', attack: 0.01, decay: 0, sustain: 1, release: 1, filter: 'lowpass', filterFreq: 100 },
    acidBass: { type: 'synth', wave: 'sawtooth', attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.3, filter: 'lowpass', filterFreq: 500, resonance: 8 },
    
    // Keys
    piano: { type: 'synth', wave: 'triangle', attack: 0.01, decay: 0.5, sustain: 0.3, release: 1, filter: 'none' },
    electricPiano: { type: 'synth', wave: 'sine', attack: 0.01, decay: 0.3, sustain: 0.4, release: 1.5, filter: 'lowpass', filterFreq: 2000 },
    organ: { type: 'synth', wave: 'square', attack: 0.1, decay: 0, sustain: 1, release: 0.5, filter: 'lowpass', filterFreq: 1000 },
    
    // Plucked
    guitar: { type: 'synth', wave: 'triangle', attack: 0.01, decay: 0.3, sustain: 0.2, release: 1, filter: 'lowpass', filterFreq: 1500 },
    harp: { type: 'synth', wave: 'sine', attack: 0.01, decay: 0.2, sustain: 0, release: 3, filter: 'none' },
    kalimba: { type: 'synth', wave: 'sine', attack: 0.01, decay: 0.1, sustain: 0, release: 1.5, filter: 'lowpass', filterFreq: 3000 },
    
    // Percussion
    kick: { type: 'noise', wave: 'sine', attack: 0.001, decay: 0.5, sustain: 0, release: 0.1, pitch: 60, pitchDecay: 0.01 },
    snare: { type: 'noise', wave: 'white', attack: 0.001, decay: 0.2, sustain: 0, release: 0.1, filter: 'bandpass', filterFreq: 2000 },
    hihat: { type: 'noise', wave: 'white', attack: 0.001, decay: 0.05, sustain: 0, release: 0.05, filter: 'highpass', filterFreq: 8000 },
    openHihat: { type: 'noise', wave: 'white', attack: 0.001, decay: 0.3, sustain: 0, release: 0.2, filter: 'highpass', filterFreq: 6000 },
    clap: { type: 'noise', wave: 'white', attack: 0.001, decay: 0.1, sustain: 0, release: 0.1, filter: 'bandpass', filterFreq: 1500 },
    tom: { type: 'noise', wave: 'sine', attack: 0.001, decay: 0.3, sustain: 0, release: 0.2, pitch: 100, pitchDecay: 0.02 },
    cymbal: { type: 'noise', wave: 'white', attack: 0.001, decay: 1, sustain: 0, release: 1, filter: 'highpass', filterFreq: 4000 },
    shaker: { type: 'noise', wave: 'white', attack: 0.001, decay: 0.1, sustain: 0, release: 0.05, filter: 'highpass', filterFreq: 10000 },
    
    // FX
    riser: { type: 'synth', wave: 'sawtooth', attack: 4, decay: 0, sustain: 1, release: 0.5, filter: 'lowpass', filterFreq: 200, filterAttack: 4 },
    downer: { type: 'synth', wave: 'sine', attack: 0.1, decay: 0, sustain: 1, release: 2, filter: 'lowpass', filterFreq: 2000, filterDecay: 2 },
    impact: { type: 'noise', wave: 'white', attack: 0.001, decay: 0.5, sustain: 0, release: 0.3, filter: 'bandpass', filterFreq: 500 },
    whoosh: { type: 'noise', wave: 'white', attack: 0.1, decay: 0.5, sustain: 0, release: 0.5, filter: 'bandpass', filterFreq: 1000 },
    
    // Ethnic
    sitar: { type: 'synth', wave: 'sawtooth', attack: 0.1, decay: 0.5, sustain: 0.6, release: 1, filter: 'lowpass', filterFreq: 2000, resonance: 2 },
    flute: { type: 'synth', wave: 'sine', attack: 0.1, decay: 0.2, sustain: 0.8, release: 1, filter: 'none' },
    erhu: { type: 'synth', wave: 'sawtooth', attack: 0.2, decay: 0.3, sustain: 0.7, release: 1.5, filter: 'lowpass', filterFreq: 1500 },
    tabla: { type: 'noise', wave: 'sine', attack: 0.001, decay: 0.1, sustain: 0, release: 0.2, pitch: 150, pitchDecay: 0.01 }
};

// ========================================
// Genre Templates
// ========================================

export const GENRE_TEMPLATES = {
    cinematic: {
        name: 'सिनेमैटिक',
        tempo: 80,
        scale: 'minor',
        progression: 'i-VII-VI-VII',
        instruments: {
            melody: 'strings',
            harmony: 'warmPad',
            bass: 'subBass',
            rhythm: 'none',
            fx: ['riser', 'impact']
        },
        structure: ['intro', 'verse', 'chorus', 'bridge', 'chorus', 'outro'],
        dynamics: [0.3, 0.5, 0.8, 0.6, 0.9, 0.3]
    },
    happy: {
        name: 'खुशी/उत्साह',
        tempo: 120,
        scale: 'major',
        progression: 'I-V-vi-IV',
        instruments: {
            melody: 'piano',
            harmony: 'brightPad',
            bass: 'bass',
            rhythm: 'kick',
            fx: []
        },
        structure: ['intro', 'verse', 'chorus', 'verse', 'chorus', 'outro'],
        dynamics: [0.4, 0.6, 0.8, 0.6, 0.8, 0.4]
    },
    sad: {
        name: 'उदासी/भावुक',
        tempo: 70,
        scale: 'minor',
        progression: 'vi-IV-I-V',
        instruments: {
            melody: 'piano',
            harmony: 'pad',
            bass: 'subBass',
            rhythm: 'none',
            fx: []
        },
        structure: ['intro', 'verse', 'chorus', 'bridge', 'chorus', 'outro'],
        dynamics: [0.3, 0.4, 0.6, 0.5, 0.6, 0.2]
    },
    mysterious: {
        name: 'रहस्यमय',
        tempo: 85,
        scale: 'phrygian',
        progression: 'mysterious',
        instruments: {
            melody: 'flute',
            harmony: 'choir',
            bass: 'subBass',
            rhythm: 'shaker',
            fx: ['whoosh']
        },
        structure: ['intro', 'verse', 'chorus', 'verse', 'outro'],
        dynamics: [0.2, 0.4, 0.6, 0.4, 0.2]
    },
    epic: {
        name: 'महाकाव्य/वीरतापूर्ण',
        tempo: 90,
        scale: 'major',
        progression: 'epic',
        instruments: {
            melody: 'strings',
            harmony: 'choir',
            bass: 'subBass',
            rhythm: 'tom',
            fx: ['riser', 'impact', 'cymbal']
        },
        structure: ['intro', 'build', 'climax', 'breakdown', 'climax', 'outro'],
        dynamics: [0.3, 0.6, 1.0, 0.4, 1.0, 0.3]
    },
    peaceful: {
        name: 'शांत/ध्यान',
        tempo: 60,
        scale: 'pentatonicMajor',
        progression: 'peaceful',
        instruments: {
            melody: 'harp',
            harmony: 'warmPad',
            bass: 'none',
            rhythm: 'none',
            fx: []
        },
        structure: ['ambient', 'theme', 'variation', 'ambient'],
        dynamics: [0.2, 0.4, 0.3, 0.2]
    },
    indian: {
        name: 'भारतीय शैली',
        tempo: 100,
        scale: 'indian',
        progression: 'I-IV-V',
        instruments: {
            melody: 'sitar',
            harmony: 'pad',
            bass: 'bass',
            rhythm: 'tabla',
            fx: []
        },
        structure: ['alap', 'gat', 'jhala'],
        dynamics: [0.3, 0.6, 0.8]
    },
    electronic: {
        name: 'इलेक्ट्रॉनिक',
        tempo: 128,
        scale: 'minor',
        progression: 'i-VII-VI-VII',
        instruments: {
            melody: 'lead',
            harmony: 'brightPad',
            bass: 'acidBass',
            rhythm: 'kick',
            fx: ['riser', 'downer']
        },
        structure: ['intro', 'build', 'drop', 'breakdown', 'drop', 'outro'],
        dynamics: [0.4, 0.7, 1.0, 0.5, 1.0, 0.3]
    },
    ambient: {
        name: 'एंबिएंट/वातावरण',
        tempo: 50,
        scale: 'lydian',
        progression: 'I-vi-ii-V',
        instruments: {
            melody: 'bell',
            harmony: 'choir',
            bass: 'none',
            rhythm: 'none',
            fx: ['whoosh', 'riser']
        },
        structure: ['drone', 'texture', 'melody', 'drone'],
        dynamics: [0.2, 0.3, 0.4, 0.2]
    },
    horror: {
        name: 'हॉरर/तनाव',
        tempo: 60,
        scale: 'locrian',
        progression: 'dark',
        instruments: {
            melody: 'none',
            harmony: 'choir',
            bass: 'subBass',
            rhythm: 'none',
            fx: ['impact', 'whoosh', 'riser']
        },
        structure: ['silence', 'tension', 'scare', 'silence'],
        dynamics: [0.1, 0.5, 1.0, 0.1]
    },
    romantic: {
        name: 'रोमांटिक',
        tempo: 75,
        scale: 'major',
        progression: 'romantic',
        instruments: {
            melody: 'flute',
            harmony: 'strings',
            bass: 'bass',
            rhythm: 'shaker',
            fx: []
        },
        structure: ['intro', 'verse', 'chorus', 'bridge', 'chorus', 'outro'],
        dynamics: [0.3, 0.5, 0.7, 0.5, 0.7, 0.3]
    },
    comedy: {
        name: 'कॉमेडी/मजेदार',
        tempo: 110,
        scale: 'major',
        progression: 'I-V-vi-IV',
        instruments: {
            melody: 'kalimba',
            harmony: 'piano',
            bass: 'bass',
            rhythm: 'kick',
            fx: ['impact']
        },
        structure: ['intro', 'verse', 'chorus', 'verse', 'chorus', 'outro'],
        dynamics: [0.4, 0.6, 0.8, 0.6, 0.8, 0.4]
    }
};

// ========================================
// Sound Effect Library
// ========================================

export const SOUND_EFFECTS = {
    // UI Sounds
    click: { type: 'synth', wave: 'sine', frequency: 800, duration: 0.1, attack: 0.01, decay: 0.05 },
    pop: { type: 'synth', wave: 'sine', frequency: 600, duration: 0.15, attack: 0.01, decay: 0.1 },
    swoosh: { type: 'noise', wave: 'white', duration: 0.3, attack: 0.05, decay: 0.25, filter: 'bandpass', filterFreq: 2000 },
    success: { type: 'synth', wave: 'sine', frequency: [523, 659, 784], duration: 0.5, attack: 0.01, decay: 0.3 },
    error: { type: 'synth', wave: 'sawtooth', frequency: 200, duration: 0.3, attack: 0.01, decay: 0.2 },
    notification: { type: 'synth', wave: 'sine', frequency: [880, 1108], duration: 0.4, attack: 0.01, decay: 0.2 },
    
    // Character Sounds
    footsteps: { type: 'noise', wave: 'pink', duration: 0.1, attack: 0.01, decay: 0.05, filter: 'lowpass', filterFreq: 500 },
    footstepsGrass: { type: 'noise', wave: 'white', duration: 0.08, attack: 0.01, decay: 0.04, filter: 'bandpass', filterFreq: 2000 },
    footstepsWood: { type: 'synth', wave: 'sine', frequency: 150, duration: 0.1, attack: 0.001, decay: 0.05 },
    jump: { type: 'synth', wave: 'sine', frequency: 200, duration: 0.2, attack: 0.01, decay: 0.15, pitchDecay: 0.5 },
    land: { type: 'noise', wave: 'pink', duration: 0.15, attack: 0.001, decay: 0.1, filter: 'lowpass', filterFreq: 200 },
    
    // Object Interactions
    pickup: { type: 'synth', wave: 'sine', frequency: 1000, duration: 0.1, attack: 0.001, decay: 0.05 },
    drop: { type: 'synth', wave: 'triangle', frequency: 200, duration: 0.2, attack: 0.01, decay: 0.15 },
    throw: { type: 'noise', wave: 'white', duration: 0.2, attack: 0.05, decay: 0.15, filter: 'bandpass', filterFreq: 1000 },
    catch: { type: 'synth', wave: 'sine', frequency: 600, duration: 0.1, attack: 0.01, decay: 0.05 },
    openDoor: { type: 'synth', wave: 'sine', frequency: [300, 200], duration: 0.5, attack: 0.1, decay: 0.3 },
    closeDoor: { type: 'noise', wave: 'pink', duration: 0.2, attack: 0.01, decay: 0.1, filter: 'lowpass', filterFreq: 300 },
    
    // Nature/Environment
    birdChirp: { type: 'synth', wave: 'sine', frequency: 2000, duration: 0.3, attack: 0.01, decay: 0.1, frequencyMod: { rate: 10, depth: 500 } },
    wind: { type: 'noise', wave: 'pink', duration: 5, attack: 1, decay: 3, filter: 'lowpass', filterFreq: 200, loop: true },
    rain: { type: 'noise', wave: 'white', duration: 1, attack: 0.1, decay: 0.5, filter: 'highpass', filterFreq: 2000, loop: true },
    thunder: { type: 'noise', wave: 'white', duration: 3, attack: 0.01, decay: 2, filter: 'lowpass', filterFreq: 100 },
    waterFlow: { type: 'noise', wave: 'pink', duration: 2, attack: 0.2, decay: 1, filter: 'bandpass', filterFreq: 800, loop: true },
    fireCrackle: { type: 'noise', wave: 'pink', duration: 0.5, attack: 0.01, decay: 0.3, filter: 'bandpass', filterFreq: 1000, loop: true },
    
    // Magic/Fantasy
    magicSparkle: { type: 'synth', wave: 'sine', frequency: [1000, 1500, 2000], duration: 0.5, attack: 0.01, decay: 0.3 },
    spellCast: { type: 'synth', wave: 'sine', frequency: [400, 600, 800, 1200], duration: 1, attack: 0.1, decay: 0.5 },
    teleport: { type: 'noise', wave: 'white', duration: 0.5, attack: 0.05, decay: 0.3, filter: 'bandpass', filterFreq: 3000 },
    heal: { type: 'synth', wave: 'sine', frequency: [523, 659, 784, 1047], duration: 1.5, attack: 0.1, decay: 0.8 },
    
    // Mechanical
    machineStart: { type: 'synth', wave: 'sawtooth', frequency: 100, duration: 1, attack: 0.5, decay: 0.3, filter: 'lowpass', filterFreq: 500 },
    machineRun: { type: 'noise', wave: 'pink', duration: 2, attack: 0.2, decay: 1, filter: 'lowpass', filterFreq: 300, loop: true },
    gearTurn: { type: 'synth', wave: 'square', frequency: 200, duration: 0.2, attack: 0.01, decay: 0.1 },
    buttonPress: { type: 'synth', wave: 'sine', frequency: 400, duration: 0.05, attack: 0.001, decay: 0.02 },
    
    // Cartoon/Exaggerated
    boing: { type: 'synth', wave: 'sine', frequency: 400, duration: 0.3, attack: 0.01, decay: 0.2, pitchDecay: 0.8 },
    slideWhistle: { type: 'synth', wave: 'sine', frequency: [200, 2000], duration: 0.5, attack: 0.01, decay: 0.4 },
    cartoonHit: { type: 'noise', wave: 'white', duration: 0.1, attack: 0.001, decay: 0.05, filter: 'bandpass', filterFreq: 2000 },
    dizzy: { type: 'synth', wave: 'sine', frequency: [300, 250, 200], duration: 1, attack: 0.1, decay: 0.5 },
    
    // Transition
    whooshFast: { type: 'noise', wave: 'white', duration: 0.2, attack: 0.01, decay: 0.15, filter: 'bandpass', filterFreq: 3000 },
    whooshSlow: { type: 'noise', wave: 'pink', duration: 1, attack: 0.2, decay: 0.6, filter: 'lowpass', filterFreq: 500 },
    swish: { type: 'noise', wave: 'white', duration: 0.3, attack: 0.05, decay: 0.2, filter: 'bandpass', filterFreq: 1500 }
};

// ========================================
// Music Generator Class
// ========================================

export class MusicGenerator {
    constructor(audioContext) {
        this.ctx = audioContext;
        this.currentMusic = null;
        this.scheduledNotes = [];
        this.isPlaying = false;
        this.currentTempo = 120;
        this.currentBeat = 0;
        this.genre = 'cinematic';
    }

    // Generate music for a genre
    generateMusic(genreName, duration = 60) {
        const genre = GENRE_TEMPLATES[genreName] || GENRE_TEMPLATES.cinematic;
        this.genre = genreName;
        this.currentTempo = genre.tempo;
        
        const scale = MUSICAL_SCALES[genre.scale] || MUSICAL_SCALES.minor;
        const progression = CHORD_PROGRESSIONS[genre.progression] || CHORD_PROGRESSIONS['i-VII-VI-VII'];
        
        // Base frequency (A3 = 220Hz)
        const baseFreq = 220;
        const rootNote = baseFreq;
        
        // Generate sections
        const sections = this.generateSections(genre, scale, progression, rootNote, duration);
        
        return {
            genre: genreName,
            tempo: genre.tempo,
            scale: genre.scale,
            sections,
            totalDuration: duration
        };
    }

    generateSections(genre, scale, progression, rootNote, duration) {
        const sections = [];
        const sectionDuration = duration / genre.structure.length;
        const beatDuration = 60 / genre.tempo;
        const measureDuration = beatDuration * 4; // 4/4 time
        
        genre.structure.forEach((sectionName, index) => {
            const dynamic = genre.dynamics[index] || 0.5;
            const section = this.generateSection(
                sectionName,
                scale,
                progression,
                rootNote,
                sectionDuration,
                measureDuration,
                dynamic,
                genre.instruments
            );
            sections.push(section);
        });
        
        return sections;
    }

    generateSection(name, scale, progression, rootNote, duration, measureDuration, dynamic, instruments) {
        const measures = Math.ceil(duration / measureDuration);
        const notes = [];
        let currentTime = 0;
        
        for (let m = 0; m < measures; m++) {
            const chordIndex = m % progression.length;
            const chordRoot = progression[chordIndex];
            const chordNotes = this.buildChord(scale, chordRoot, rootNote);
            
            // Melody
            if (instruments.melody && instruments.melody !== 'none') {
                const melodyNotes = this.generateMelody(
                    chordNotes, scale, rootNote, measureDuration, 
                    instruments.melody, dynamic
                );
                notes.push(...melodyNotes.map(n => ({ ...n, time: currentTime + n.time, instrument: instruments.melody })));
            }
            
            // Harmony
            if (instruments.harmony && instruments.harmony !== 'none') {
                const harmonyNotes = this.generateHarmony(
                    chordNotes, measureDuration,
                    instruments.harmony, dynamic
                );
                notes.push(...harmonyNotes.map(n => ({ ...n, time: currentTime + n.time, instrument: instruments.harmony })));
            }
            
            // Bass
            if (instruments.bass && instruments.bass !== 'none') {
                const bassNotes = this.generateBass(
                    chordRoot, rootNote, measureDuration,
                    instruments.bass, dynamic
                );
                notes.push(...bassNotes.map(n => ({ ...n, time: currentTime + n.time, instrument: instruments.bass })));
            }
            
            // Rhythm
            if (instruments.rhythm && instruments.rhythm !== 'none') {
                const rhythmNotes = this.generateRhythm(
                    measureDuration,
                    instruments.rhythm, dynamic
                );
                notes.push(...rhythmNotes.map(n => ({ ...n, time: currentTime + n.time, instrument: instruments.rhythm })));
            }
            
            currentTime += measureDuration;
        }
        
        return { name, notes, duration, dynamic };
    }

    buildChord(scale, rootDegree, rootFreq) {
        // Build triad: root, third, fifth
        const root = scale[rootDegree % scale.length];
        const third = scale[(rootDegree + 2) % scale.length];
        const fifth = scale[(rootDegree + 4) % scale.length];
        
        // Convert to frequencies
        const rootFreqFinal = rootFreq * Math.pow(2, root / 12);
        const thirdFreq = rootFreq * Math.pow(2, third / 12);
        const fifthFreq = rootFreq * Math.pow(2, fifth / 12);
        
        return [rootFreqFinal, thirdFreq, fifthFreq];
    }

    generateMelody(chordNotes, scale, rootNote, measureDuration, instrumentName, dynamic) {
        const instrument = INSTRUMENTS[instrumentName];
        const notes = [];
        const beatsPerMeasure = 4;
        const beatDuration = measureDuration / beatsPerMeasure;
        
        // Generate 2-4 notes per measure
        const noteCount = 2 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < noteCount; i++) {
            // Choose note from chord or scale
            const useChordNote = Math.random() < 0.7;
            let freq;
            
            if (useChordNote) {
                freq = chordNotes[Math.floor(Math.random() * chordNotes.length)];
            } else {
                const scaleNote = scale[Math.floor(Math.random() * scale.length)];
                freq = rootNote * Math.pow(2, scaleNote / 12);
            }
            
            // Octave variation
            freq *= Math.pow(2, Math.floor(Math.random() * 2));
            
            const time = (i / noteCount) * measureDuration + Math.random() * 0.1;
            const duration = beatDuration * (0.5 + Math.random() * 1.5);
            const velocity = 0.3 + Math.random() * 0.4;
            
            notes.push({
                frequency: freq,
                time,
                duration: Math.min(duration, measureDuration - time - 0.05),
                velocity: velocity * dynamic,
                instrument: instrumentName
            });
        }
        
        return notes;
    }

    generateHarmony(chordNotes, measureDuration, instrumentName, dynamic) {
        const instrument = INSTRUMENTS[instrumentName];
        const notes = [];
        
        // Pad/chord sustained through measure
        chordNotes.forEach((freq, i) => {
            notes.push({
                frequency: freq * 0.5, // Lower octave for pads
                time: 0,
                duration: measureDuration * 0.95,
                velocity: 0.2 * dynamic,
                instrument: instrumentName
            });
        });
        
        return notes;
    }

    generateBass(chordRoot, rootNote, measureDuration, instrumentName, dynamic) {
        const instrument = INSTRUMENTS[instrumentName];
        const notes = [];
        const beatDuration = measureDuration / 4;
        
        // Root note on beat 1 and 3
        const rootFreq = rootNote * Math.pow(2, (chordRoot - 12) / 12); // Octave down
        
        [0, 2].forEach(beat => {
            notes.push({
                frequency: rootFreq,
                time: beat * beatDuration,
                duration: beatDuration * 0.8,
                velocity: 0.5 * dynamic,
                instrument: instrumentName
            });
        });
        
        // Passing note on beat 4
        if (Math.random() < 0.5) {
            const fifthFreq = rootFreq * Math.pow(2, 7/12);
            notes.push({
                frequency: fifthFreq,
                time: 3 * beatDuration,
                duration: beatDuration * 0.5,
                velocity: 0.3 * dynamic,
                instrument: instrumentName
            });
        }
        
        return notes;
    }

    generateRhythm(measureDuration, instrumentName, dynamic) {
        const instrument = INSTRUMENTS[instrumentName];
        const notes = [];
        const beatDuration = measureDuration / 4;
        
        if (instrumentName === 'kick') {
            // Kick on 1 and 3
            [0, 2].forEach(beat => {
                notes.push({
                    frequency: 60,
                    time: beat * beatDuration,
                    duration: beatDuration * 0.5,
                    velocity: 0.8 * dynamic,
                    instrument: instrumentName
                });
            });
        } else if (instrumentName === 'snare') {
            // Snare on 2 and 4
            [1, 3].forEach(beat => {
                notes.push({
                    frequency: 200,
                    time: beat * beatDuration,
                    duration: beatDuration * 0.3,
                    velocity: 0.6 * dynamic,
                    instrument: instrumentName
                });
            });
        } else if (instrumentName === 'hihat') {
            // Hihat on every 8th note
            for (let i = 0; i < 8; i++) {
                notes.push({
                    frequency: 8000,
                    time: i * beatDuration / 2,
                    duration: beatDuration / 4,
                    velocity: 0.3 * dynamic,
                    instrument: instrumentName
                });
            }
        } else if (instrumentName === 'shaker') {
            // Shaker on 2 and 4
            [1, 3].forEach(beat => {
                notes.push({
                    frequency: 10000,
                    time: beat * beatDuration,
                    duration: beatDuration * 0.2,
                    velocity: 0.2 * dynamic,
                    instrument: instrumentName
                });
            });
        } else if (instrumentName === 'tom') {
            // Tom fills at end of phrase
            if (Math.random() < 0.3) {
                [3.5, 3.75].forEach(beat => {
                    notes.push({
                        frequency: 100,
                        time: beat * beatDuration,
                        duration: beatDuration * 0.3,
                        velocity: 0.5 * dynamic,
                        instrument: instrumentName
                    });
                });
            }
        }
        
        return notes;
    }

    // Play generated music
    playMusic(musicData) {
        if (this.isPlaying) this.stopMusic();
        
        this.currentMusic = musicData;
        this.isPlaying = true;
        this.currentBeat = 0;
        
        const startTime = this.ctx.currentTime + 0.1;
        
        musicData.sections.forEach(section => {
            section.notes.forEach(note => {
                const noteTime = startTime + note.time;
                this.scheduleNote(note, noteTime);
            });
        });
        
        // Schedule next loop
        const totalDuration = musicData.totalDuration;
        this.loopTimer = setTimeout(() => {
            if (this.isPlaying) {
                this.playMusic(musicData);
            }
        }, (totalDuration - 0.1) * 1000);
    }

    scheduleNote(note, time) {
        const instrument = INSTRUMENTS[note.instrument];
        if (!instrument) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        
        osc.type = instrument.wave || 'sine';
        osc.frequency.value = note.frequency;
        
        // Filter
        if (instrument.filter && instrument.filter !== 'none') {
            filter.type = instrument.filter;
            filter.frequency.value = instrument.filterFreq || 1000;
            filter.Q.value = instrument.resonance || 1;
            osc.connect(filter);
            filter.connect(gain);
        } else {
            osc.connect(gain);
        }
        
        gain.connect(this.ctx.destination);
        
        // Envelope
        const attack = instrument.attack || 0.01;
        const decay = instrument.decay || 0.1;
        const sustain = instrument.sustain !== undefined ? instrument.sustain : 0.5;
        const release = instrument.release || 0.5;
        const noteDuration = note.duration;
        const velocity = note.velocity;
        
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(velocity, time + attack);
        gain.gain.linearRampToValueAtTime(velocity * sustain, time + attack + decay);
        gain.gain.linearRampToValueAtTime(0, time + noteDuration);
        
        osc.start(time);
        osc.stop(time + noteDuration + release);
        
        // Pitch decay for percussion
        if (instrument.pitchDecay) {
            osc.frequency.exponentialRampToValueAtTime(
                note.frequency * 0.5,
                time + instrument.pitchDecay
            );
        }
    }

    stopMusic() {
        this.isPlaying = false;
        if (this.loopTimer) {
            clearTimeout(this.loopTimer);
            this.loopTimer = null;
        }
        this.currentMusic = null;
    }

    // Play sound effect
    playSFX(sfxName, options = {}) {
        const sfx = SOUND_EFFECTS[sfxName];
        if (!sfx) {
            console.warn(`SFX "${sfxName}" not found`);
            return;
        }
        
        const time = this.ctx.currentTime;
        const volume = options.volume || 1;
        const pitch = options.pitch || 1;
        
        if (sfx.type === 'synth') {
            const frequencies = Array.isArray(sfx.frequency) ? sfx.frequency : [sfx.frequency];
            
            frequencies.forEach((freq, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const filter = this.ctx.createBiquadFilter();
                
                osc.type = sfx.wave || 'sine';
                osc.frequency.value = freq * pitch;
                
                if (sfx.filter && sfx.filter !== 'none') {
                    filter.type = sfx.filter;
                    filter.frequency.value = sfx.filterFreq || 1000;
                    osc.connect(filter);
                    filter.connect(gain);
                } else {
                    osc.connect(gain);
                }
                
                gain.connect(this.ctx.destination);
                
                const attack = sfx.attack || 0.01;
                const decay = sfx.decay || 0.1;
                const duration = sfx.duration || 0.2;
                
                gain.gain.setValueAtTime(0, time);
                gain.gain.linearRampToValueAtTime(volume * 0.5, time + attack);
                gain.gain.linearRampToValueAtTime(0, time + duration);
                
                osc.start(time + i * 0.05);
                osc.stop(time + duration);
                
                // Frequency modulation for bird chirp etc.
                if (sfx.frequencyMod) {
                    const modOsc = this.ctx.createOscillator();
                    const modGain = this.ctx.createGain();
                    modOsc.type = 'sine';
                    modOsc.frequency.value = sfx.frequencyMod.rate;
                    modGain.gain.value = sfx.frequencyMod.depth;
                    modOsc.connect(modGain);
                    modGain.connect(osc.frequency);
                    modOsc.start(time);
                    modOsc.stop(time + duration);
                }
                
                // Pitch decay
                if (sfx.pitchDecay) {
                    osc.frequency.exponentialRampToValueAtTime(
                        freq * 0.5,
                        time + sfx.pitchDecay
                    );
                }
            });
        } else if (sfx.type === 'noise') {
            // Generate noise buffer
            const bufferSize = this.ctx.sampleRate * (sfx.duration || 1);
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                if (sfx.wave === 'white') {
                    data[i] = Math.random() * 2 - 1;
                } else if (sfx.wave === 'pink') {
                    // Simple pink noise approximation
                    data[i] = (Math.random() * 2 - 1) * Math.pow(i / bufferSize, 0.5);
                }
            }
            
            const source = this.ctx.createBufferSource();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();
            
            source.buffer = buffer;
            
            if (sfx.filter && sfx.filter !== 'none') {
                filter.type = sfx.filter;
                filter.frequency.value = sfx.filterFreq || 1000;
                source.connect(filter);
                filter.connect(gain);
            } else {
                source.connect(gain);
            }
            
            gain.connect(this.ctx.destination);
            
            const attack = sfx.attack || 0.01;
            const decay = sfx.decay || 0.1;
            const duration = sfx.duration || 1;
            
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(volume * 0.3, time + attack);
            gain.gain.linearRampToValueAtTime(0, time + duration);
            
            if (sfx.loop) {
                source.loop = true;
                source.loopStart = 0;
                source.loopEnd = buffer.duration;
            }
            
            source.start(time);
            
            // Return source for later stopping
            return { source, gain, stop: () => source.stop() };
        }
    }
}

// ========================================
// Audio Manager Class
// ========================================

export class AudioManager {
    constructor() {
        this.ctx = null;
        this.musicGenerator = null;
        this.sfxCache = new Map();
        this.masterGain = null;
        this.musicGain = null;
        this.sfxGain = null;
        this.voiceGain = null;
        this.currentMusic = null;
    }

    async init() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create gain nodes for mixing
        this.masterGain = this.ctx.createGain();
        this.musicGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();
        this.voiceGain = this.ctx.createGain();
        
        this.musicGain.connect(this.masterGain);
        this.sfxGain.connect(this.masterGain);
        this.voiceGain.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);
        
        this.musicGenerator = new MusicGenerator(this.ctx);
        
        // Resume context on user interaction
        document.addEventListener('click', () => {
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }, { once: true });
        
        return this.ctx;
    }

    setMasterVolume(vol) {
        if (this.masterGain) this.masterGain.gain.value = vol;
    }

    setMusicVolume(vol) {
        if (this.musicGain) this.musicGain.gain.value = vol;
    }

    setSFXVolume(vol) {
        if (this.sfxGain) this.sfxGain.gain.value = vol;
    }

    setVoiceVolume(vol) {
        if (this.voiceGain) this.voiceGain.gain.value = vol;
    }

    // Play background music
    playMusic(genreName, duration) {
        if (!this.musicGenerator) return;
        
        const music = this.musicGenerator.generateMusic(genreName, duration);
        this.musicGenerator.playMusic(music);
        this.currentMusic = genreName;
    }

    stopMusic() {
        if (this.musicGenerator) {
            this.musicGenerator.stopMusic();
        }
        this.currentMusic = null;
    }

    // Play sound effect
    playSFX(sfxName, options = {}) {
        if (!this.musicGenerator) return;
        
        return this.musicGenerator.playSFX(sfxName, {
            ...options,
            volume: (options.volume || 1) * (this.sfxGain?.gain.value || 1)
        });
    }

    // Play procedural SFX with parameters
    playProceduralSFX(params) {
        if (!this.ctx) return;
        
        const time = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        
        osc.type = params.wave || 'sine';
        osc.frequency.value = params.frequency || 440;
        
        if (params.filter) {
            filter.type = params.filter;
            filter.frequency.value = params.filterFreq || 1000;
            filter.Q.value = params.resonance || 1;
            osc.connect(filter);
            filter.connect(gain);
        } else {
            osc.connect(gain);
        }
        
        gain.connect(this.sfxGain);
        
        const attack = params.attack || 0.01;
        const decay = params.decay || 0.1;
        const sustain = params.sustain || 0;
        const release = params.release || 0.1;
        const duration = params.duration || 0.5;
        const velocity = params.velocity || 0.5;
        
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(velocity, time + attack);
        gain.gain.linearRampToValueAtTime(velocity * sustain, time + attack + decay);
        gain.gain.linearRampToValueAtTime(0, time + duration);
        
        osc.start(time);
        osc.stop(time + duration + release);
        
        return { osc, gain, stop: () => osc.stop() };
    }

    // Crossfade between music genres
    crossfadeMusic(newGenre, duration = 5) {
        if (!this.musicGenerator) return;
        
        const oldVolume = this.musicGain.gain.value;
        const newMusic = this.musicGenerator.generateMusic(newGenre, 60);
        
        // Fade out old
        this.musicGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + duration);
        
        setTimeout(() => {
            this.musicGenerator.playMusic(newMusic);
            // Fade in new
            this.musicGain.gain.linearRampToValueAtTime(oldVolume, this.ctx.currentTime + duration);
        }, duration * 1000);
    }
}

// ========================================
// Export
// ========================================

// All exports are already declared with 'export' keyword above
/**
 * AI Animation Studio - 3D Human Character Animation Video Creator
 * Main Application Module
 * 
 * Features:
 * - Hindi UI for story input
 * - Automatic scene division
 * - Real 3D human characters with full customization
 * - Professional 3D camera, lighting, background controls
 * - Animations: walk, run, talk, sit, expressions
 * - Hindi TTS using Web Speech API
 * - Video export with MediaRecorder
 * - Mobile-responsive, PWA support
 */

// Import 3D Character System
import { Character3D } from './character3d.js';
import { CLOTHING_PRESETS, SKIN_TONES, HAIR_COLORS, EYE_COLORS } from './characters.js';
import { assetLibrary, SceneAssetManager, ASSET_CATEGORIES, ALL_ASSETS } from './assets.js';
import { DirectionParser, CharacterDirector, autoDirectScene, getDirectionSuggestions } from './direction.js';
import { ScriptManager, SCRIPT_TEMPLATES, createScriptFromTemplate, syncScriptToAnimation, generateSubtitlesFromScript } from './script.js';

// ========================================
// Global State Management
// ========================================
const AppState = {
    currentStep: 1,
    story: '',
    scenes: [],
    currentSceneIndex: -1,
    animationData: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    muted: false,
    settings: {
        videoStyle: 'paper-cutout',
        colorTheme: 'vibrant',
        aspectRatio: '16:9',
        sceneDuration: 8,
        animationSpeed: 1,
        cameraMovement: 'gentle',
        transitionType: 'paper-flip',
        paperThickness: 3
    },
    exportSettings: {
        resolution: '720p',
        framerate: 30,
        format: 'webm'
    },
    three: {
        scene: null,
        camera: null,
        renderer: null,
        composer: null,
        animationId: null,
        objects: [],
        characters: [],  // Legacy paper-cutout characters
        characters3d: [],  // New 3D human characters
        backgrounds: [],
        assetManager: null,  // Asset library manager
        currentScene: 0,
        transitionProgress: 0,
        isTransitioning: false,
        THREE: null,
        subtitleCanvas: null,
        subtitleCtx: null,
        subtitleTexture: null,
        subtitleSprite: null,
        // Professional 3D controls
        cameraControls: {
            type: 'perspective',
            fov: 50,
            distance: 15,
            height: 5,
            angle: 0,
            movement: 'static',
            speed: 1.0,
            lookAt: new THREE.Vector3(0, 0, 0)
        },
        lighting: {
            environment: 'studio',
            ambientIntensity: 0.6,
            ambientColor: 0xffffff,
            keyIntensity: 1.0,
            keyColor: 0xffffff,
            keyAngle: 45,
            fillIntensity: 0.5,
            fillColor: 0xffeedd,
            rimIntensity: 0.3,
            rimColor: 0xffaa00,
            shadowQuality: 'medium',
            exposure: 1.2
        },
        background: {
            type: 'color',
            color1: 0x87ceeb,
            color2: 0xe0f7fa,
            rotation: 0,
            skyPreset: 'clear',
            fogDensity: 0,
            fogColor: 0x87ceeb,
            showGround: true,
            groundShadows: true,
            groundColor: 0x4caf50,
            groundRoughness: 0.8
        }
    },
    audio: {
        synth: null,
        voices: [],
        hindiVoice: null,
        backgroundMusic: null,
        soundEffects: {},
        audioContext: null
    },
    export: {
        mediaRecorder: null,
        recordedChunks: [],
        stream: null,
        startTime: 0,
        totalFrames: 0,
        renderedFrames: 0,
        isExporting: false,
        videoBlob: null,
        videoUrl: null
    }
};

// ========================================
// DOM Element References
// ========================================
const Elements = {};

// ========================================
// Color Themes
// ========================================
const ColorThemes = {
    vibrant: {
        paper: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf', '#ff8b94', '#c7ceea', '#ffd3b6', '#b8e0d2'],
        background: ['#2c3e50', '#34495e', '#1a252f', '#2d3a4f'],
        accent: '#ff6b6b'
    },
    pastel: {
        paper: ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff', '#e1baff', '#ffbaeb', '#c9fff9'],
        background: ['#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da'],
        accent: '#a8d0e6'
    },
    monochrome: {
        paper: ['#1a1a1a', '#333333', '#4a4a4a', '#666666', '#808080', '#999999', '#b3b3b3', '#cccccc'],
        background: ['#ffffff', '#f0f0f0', '#e0e0e0', '#d0d0d0'],
        accent: '#333333'
    },
    earthy: {
        paper: ['#8b4513', '#a0522d', '#cd853f', '#d2b48c', '#deb887', '#f5deb3', '#8fbc8f', '#2e8b57'],
        background: ['#2f1b14', '#3d2817', '#4a3728', '#5c4a3d'],
        accent: '#8b4513'
    }
};

// ========================================
// Paper Cutout Shapes Library
// ========================================
const PaperShapes = {
    rabbit: {
        parts: [
            { name: 'body', shape: 'ellipse', size: [1.2, 1.5], color: 0, offset: [0, -0.3], rotation: 0 },
            { name: 'head', shape: 'circle', size: [0.8], color: 0, offset: [0, 0.7], rotation: 0 },
            { name: 'ear1', shape: 'ellipse', size: [0.3, 0.9], color: 1, offset: [-0.3, 1.2], rotation: -0.3 },
            { name: 'ear2', shape: 'ellipse', size: [0.3, 0.9], color: 1, offset: [0.3, 1.2], rotation: 0.3 },
            { name: 'eye1', shape: 'circle', size: [0.1], color: 'black', offset: [-0.2, 0.85] },
            { name: 'eye2', shape: 'circle', size: [0.1], color: 'black', offset: [0.2, 0.85] },
            { name: 'nose', shape: 'triangle', size: [0.15], color: 'pink', offset: [0, 0.7] },
            { name: 'leg1', shape: 'ellipse', size: [0.25, 0.6], color: 0, offset: [-0.4, -1.1], rotation: 0.2 },
            { name: 'leg2', shape: 'ellipse', size: [0.25, 0.6], color: 0, offset: [0.4, -1.1], rotation: -0.2 },
            { name: 'tail', shape: 'circle', size: [0.2], color: 'white', offset: [0.6, -0.5] }
        ],
        animations: {
            idle: ['ear1', 'ear2', 'tail'],
            walk: ['leg1', 'leg2', 'body'],
            hop: ['body', 'leg1', 'leg2', 'ear1', 'ear2']
        }
    },
    bird: {
        parts: [
            { name: 'body', shape: 'ellipse', size: [1, 0.7], color: 0, offset: [0, 0], rotation: 0 },
            { name: 'head', shape: 'circle', size: [0.4], color: 0, offset: [0.7, 0.2], rotation: 0 },
            { name: 'wing', shape: 'ellipse', size: [0.8, 0.4], color: 1, offset: [0, 0], rotation: 0 },
            { name: 'beak', shape: 'triangle', size: [0.2], color: 'orange', offset: [1.0, 0.2], rotation: 0 },
            { name: 'eye', shape: 'circle', size: [0.08], color: 'black', offset: [0.85, 0.3] },
            { name: 'tail', shape: 'triangle', size: [0.4], color: 2, offset: [-0.7, 0], rotation: 3.14 },
            { name: 'leg1', shape: 'line', size: [0.3], color: 'brown', offset: [0.2, -0.4] },
            { name: 'leg2', shape: 'line', size: [0.3], color: 'brown', offset: [0.2, -0.4] }
        ],
        animations: {
            idle: ['wing', 'tail'],
            fly: ['wing', 'body', 'tail']
        }
    },
    butterfly: {
        parts: [
            { name: 'body', shape: 'ellipse', size: [0.2, 1], color: 'black', offset: [0, 0] },
            { name: 'wing1', shape: 'ellipse', size: [1.2, 0.8], color: 0, offset: [-0.7, 0.3], rotation: 0.3 },
            { name: 'wing2', shape: 'ellipse', size: [1.2, 0.8], color: 0, offset: [0.7, 0.3], rotation: -0.3 },
            { name: 'wing3', shape: 'ellipse', size: [0.8, 0.6], color: 1, offset: [-0.5, -0.4], rotation: 0.5 },
            { name: 'wing4', shape: 'ellipse', size: [0.8, 0.6], color: 1, offset: [0.5, -0.4], rotation: -0.5 },
            { name: 'antenna1', shape: 'line', size: [0.4], color: 'black', offset: [-0.1, 0.6], rotation: -0.5 },
            { name: 'antenna2', shape: 'line', size: [0.4], color: 'black', offset: [0.1, 0.6], rotation: 0.5 }
        ],
        animations: {
            idle: ['wing1', 'wing2', 'wing3', 'wing4'],
            fly: ['body', 'wing1', 'wing2', 'wing3', 'wing4']
        }
    },
    tree: {
        parts: [
            { name: 'trunk', shape: 'rect', size: [0.5, 2], color: 'brown', offset: [0, -0.5] },
            { name: 'foliage1', shape: 'circle', size: [1.2], color: 0, offset: [0, 1] },
            { name: 'foliage2', shape: 'circle', size: [1], color: 1, offset: [-0.5, 1.5] },
            { name: 'foliage3', shape: 'circle', size: [1], color: 1, offset: [0.5, 1.5] },
            { name: 'foliage4', shape: 'circle', size: [0.8], color: 2, offset: [0, 2.2] }
        ],
        animations: {
            idle: ['foliage1', 'foliage2', 'foliage3', 'foliage4'],
            wind: ['foliage1', 'foliage2', 'foliage3', 'foliage4', 'trunk']
        }
    },
    cloud: {
        parts: [
            { name: 'puff1', shape: 'circle', size: [0.8], color: 'white', offset: [0, 0] },
            { name: 'puff2', shape: 'circle', size: [0.6], color: 'white', offset: [-0.7, 0.2] },
            { name: 'puff3', shape: 'circle', size: [0.6], color: 'white', offset: [0.7, 0.2] },
            { name: 'puff4', shape: 'circle', size: [0.5], color: 'white', offset: [-0.3, -0.3] },
            { name: 'puff5', shape: 'circle', size: [0.5], color: 'white', offset: [0.3, -0.3] }
        ],
        animations: {
            idle: ['puff1', 'puff2', 'puff3', 'puff4', 'puff5'],
            float: ['puff1', 'puff2', 'puff3', 'puff4', 'puff5']
        }
    },
    sun: {
        parts: [
            { name: 'core', shape: 'circle', size: [0.8], color: '#ffd700', offset: [0, 0] },
            { name: 'ray1', shape: 'triangle', size: [0.3], color: '#ffaa00', offset: [0, -1.2], rotation: 0 },
            { name: 'ray2', shape: 'triangle', size: [0.3], color: '#ffaa00', offset: [0, 1.2], rotation: 3.14 },
            { name: 'ray3', shape: 'triangle', size: [0.3], color: '#ffaa00', offset: [-1.2, 0], rotation: -1.57 },
            { name: 'ray4', shape: 'triangle', size: [0.3], color: '#ffaa00', offset: [1.2, 0], rotation: 1.57 },
            { name: 'ray5', shape: 'triangle', size: [0.25], color: '#ffaa00', offset: [-0.85, -0.85], rotation: -0.785 },
            { name: 'ray6', shape: 'triangle', size: [0.25], color: '#ffaa00', offset: [0.85, -0.85], rotation: 0.785 },
            { name: 'ray7', shape: 'triangle', size: [0.25], color: '#ffaa00', offset: [-0.85, 0.85], rotation: -2.355 },
            { name: 'ray8', shape: 'triangle', size: [0.25], color: '#ffaa00', offset: [0.85, 0.85], rotation: 2.355 }
        ],
        animations: {
            idle: ['ray1', 'ray2', 'ray3', 'ray4', 'ray5', 'ray6', 'ray7', 'ray8'],
            shine: ['core', 'ray1', 'ray2', 'ray3', 'ray4', 'ray5', 'ray6', 'ray7', 'ray8']
        }
    },
    flower: {
        parts: [
            { name: 'stem', shape: 'rect', size: [0.1, 1.5], color: 'green', offset: [0, -0.4] },
            { name: 'leaf1', shape: 'ellipse', size: [0.3, 0.6], color: 'green', offset: [-0.3, -0.2], rotation: -0.5 },
            { name: 'leaf2', shape: 'ellipse', size: [0.3, 0.6], color: 'green', offset: [0.3, -0.2], rotation: 0.5 },
            { name: 'petal1', shape: 'ellipse', size: [0.4, 0.8], color: 0, offset: [0, 0.6], rotation: 0 },
            { name: 'petal2', shape: 'ellipse', size: [0.4, 0.8], color: 0, offset: [0, 0.6], rotation: 0.785 },
            { name: 'petal3', shape: 'ellipse', size: [0.4, 0.8], color: 0, offset: [0, 0.6], rotation: 1.57 },
            { name: 'petal4', shape: 'ellipse', size: [0.4, 0.8], color: 0, offset: [0, 0.6], rotation: 2.355 },
            { name: 'petal5', shape: 'ellipse', size: [0.4, 0.8], color: 0, offset: [0, 0.6], rotation: 3.14 },
            { name: 'center', shape: 'circle', size: [0.25], color: '#ffd700', offset: [0, 0.6] }
        ],
        animations: {
            idle: ['petal1', 'petal2', 'petal3', 'petal4', 'petal5'],
            bloom: ['petal1', 'petal2', 'petal3', 'petal4', 'petal5', 'center']
        }
    },
    house: {
        parts: [
            { name: 'base', shape: 'rect', size: [1.5, 1.2], color: 0, offset: [0, -0.1] },
            { name: 'roof', shape: 'triangle', size: [1.8], color: 1, offset: [0, 0.7] },
            { name: 'door', shape: 'rect', size: [0.4, 0.7], color: 'brown', offset: [0, -0.45] },
            { name: 'window1', shape: 'square', size: [0.3], color: '#87ceeb', offset: [-0.5, 0.1] },
            { name: 'window2', shape: 'square', size: [0.3], color: '#87ceeb', offset: [0.5, 0.1] },
            { name: 'chimney', shape: 'rect', size: [0.2, 0.5], color: 'darkred', offset: [0.6, 1] }
        ],
        animations: {
            idle: []
        }
    },
    car: {
        parts: [
            { name: 'body', shape: 'rect', size: [1.8, 0.7], color: 0, offset: [0, 0.2] },
            { name: 'cabin', shape: 'rect', size: [0.9, 0.6], color: 1, offset: [-0.1, 0.7] },
            { name: 'wheel1', shape: 'circle', size: [0.35], color: 'black', offset: [-0.7, -0.15] },
            { name: 'wheel2', shape: 'circle', size: [0.35], color: 'black', offset: [0.7, -0.15] },
            { name: 'window', shape: 'rect', size: [0.7, 0.4], color: '#87ceeb', offset: [-0.1, 0.85] },
            { name: 'light', shape: 'circle', size: [0.1], color: '#ffd700', offset: [0.9, 0.3] }
        ],
        animations: {
            idle: ['wheel1', 'wheel2'],
            drive: ['wheel1', 'wheel2', 'body']
        }
    }
};

// Background templates
const BackgroundTemplates = {
    forest: {
        layers: [
            { type: 'sky', color: '#87ceeb', depth: -10 },
            { type: 'mountain', color: '#5d6d7e', depth: -5, shapes: 'mountain' },
            { type: 'trees-back', template: 'tree', count: 5, depth: -3, scale: 1.5 },
            { type: 'trees-mid', template: 'tree', count: 4, depth: -1, scale: 1.2 },
            { type: 'grass', color: '#2e8b57', depth: 0 },
            { type: 'flowers', template: 'flower', count: 6, depth: 0.5 },
            { type: 'bushes', template: 'tree', count: 3, depth: 1, scale: 0.5 }
        ]
    },
    garden: {
        layers: [
            { type: 'sky', color: '#87ceeb', depth: -10 },
            { type: 'sun', template: 'sun', depth: -8, position: [6, 4] },
            { type: 'clouds', template: 'cloud', count: 3, depth: -6 },
            { type: 'grass', color: '#7cfc00', depth: 0 },
            { type: 'flowers', template: 'flower', count: 8, depth: 0.5 },
            { type: 'butterflies', template: 'butterfly', count: 3, depth: 1 },
            { type: 'path', color: '#d2b48c', depth: 0.2 }
        ]
    },
    river: {
        layers: [
            { type: 'sky', color: '#87ceeb', depth: -10 },
            { type: 'mountains', color: '#5d6d7e', depth: -5, shapes: 'mountain' },
            { type: 'trees', template: 'tree', count: 4, depth: -2, scale: 1.3 },
            { type: 'water', color: '#1e90ff', depth: -0.5 },
            { type: 'rocks', color: '#808080', depth: -0.3, count: 6 },
            { type: 'grass-banks', color: '#2e8b57', depth: 0 },
            { type: 'reeds', template: 'flower', count: 5, depth: 0.3, color: 'green' }
        ]
    },
    village: {
        layers: [
            { type: 'sky', color: '#87ceeb', depth: -10 },
            { type: 'sun', template: 'sun', depth: -8, position: [-6, 4] },
            { type: 'clouds', template: 'cloud', count: 2, depth: -6 },
            { type: 'ground', color: '#d2b48c', depth: 0 },
            { type: 'houses', template: 'house', count: 3, depth: 0.5, spacing: 3 },
            { type: 'trees', template: 'tree', count: 4, depth: 1 },
            { type: 'road', color: '#555555', depth: 0.2 }
        ]
    },
    classroom: {
        layers: [
            { type: 'wall', color: '#f5f5dc', depth: -3 },
            { type: 'board', color: '#2c3e50', depth: -2.5, position: [0, 1] },
            { type: 'desks', template: 'rect', count: 6, depth: -1, color: '#8b4513' },
            { type: 'charts', color: '#ffffff', depth: -2.4, count: 3 }
        ]
    },
    space: {
        layers: [
            { type: 'space-bg', color: '#0a0a2a', depth: -20 },
            { type: 'stars', color: '#ffffff', depth: -15, count: 100 },
            { type: 'planet1', template: 'circle', depth: -10, color: '#ff6b6b', size: 3, position: [-8, 3] },
            { type: 'planet2', template: 'circle', depth: -12, color: '#4ecdc4', size: 2, position: [6, -2] },
            { type: 'rocket', template: 'rocket', depth: -5, position: [0, 0] }
        ]
    },
    underwater: {
        layers: [
            { type: 'water-bg', color: '#006994', depth: -10 },
            { type: 'corals', template: 'flower', count: 6, depth: -2, color: ['#ff6b6b', '#ffd700', '#ff69b4'] },
            { type: 'fish', template: 'fish', count: 5, depth: -1 },
            { type: 'bubbles', template: 'circle', count: 15, depth: 0, color: 'rgba(255,255,255,0.5)', size: 0.2 },
            { type: 'sand', color: '#f4e4bc', depth: 1 }
        ]
    },
    desert: {
        layers: [
            { type: 'sky', color: '#ffcc80', depth: -10 },
            { type: 'sun', template: 'sun', depth: -8, position: [0, 5] },
            { type: 'dunes', color: '#f4e4bc', depth: -3, count: 3 },
            { type: 'cactus', template: 'cactus', count: 3, depth: -1 },
            { type: 'sand', color: '#f4e4bc', depth: 0 }
        ]
    }
};

// ========================================
// Utility Functions
// ========================================
function $(selector, root = document) {
    return root.querySelector(selector);
}

function $$(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
}

function createElement(tag, props = {}, children = []) {
    const el = document.createElement(tag);
    Object.entries(props).forEach(([key, value]) => {
        if (key === 'class') el.className = value;
        else if (key === 'style') Object.assign(el.style, value);
        else if (key.startsWith('on')) el.addEventListener(key.slice(2).toLowerCase(), value);
        else if (key === 'dataset') Object.entries(value).forEach(([k, v]) => el.dataset[k] = v);
        else el.setAttribute(key, value);
    });
    children.forEach(child => {
        if (typeof child === 'string') el.appendChild(document.createTextNode(child));
        else if (child instanceof Node) el.appendChild(child);
    });
    return el;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getRandomColor(themeColors, exclude = []) {
    const available = themeColors.filter(c => !exclude.includes(c));
    return available[Math.floor(Math.random() * available.length)] || themeColors[0];
}

// ========================================
// Toast Notifications
// ========================================
function showToast(message, type = 'info', duration = 3000) {
    const container = $('#toastContainer');
    const icons = {
        success: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
        error: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
        warning: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        info: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };

    const toast = createElement('div', { class: `toast ${type}` }, [
        createElement('div', { class: 'toast-icon', innerHTML: icons[type] }),
        createElement('span', { class: 'toast-message' }, [message]),
        createElement('button', { class: 'toast-close', onclick: () => toast.remove() }, [
            createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', innerHTML: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' })
        ])
    ]);

    container.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
}

// ========================================
// Loading Modal
// ========================================
function showLoading(text = 'प्रोसेसिंग...') {
    $('#loadingText').textContent = text;
    $('#loadingModal').style.display = 'flex';
}

function hideLoading() {
    $('#loadingModal').style.display = 'none';
}

// ========================================
// Scene Generation Logic
// ========================================
function generateScenesFromStory(story, settings) {
    const sentences = story
        .split(/[।.!?]+/)
        .map(s => s.trim())
        .filter(s => s.length > 10);
    
    if (sentences.length === 0) {
        return [{ 
            id: generateId(),
            title: 'सीन 1',
            description: story,
            characters: ['मुख्य पात्र'],
            background: 'गार्डन',
            hindiText: story,
            duration: settings.sceneDuration
        }];
    }

    const scenes = [];
    const sentencesPerScene = Math.max(2, Math.ceil(sentences.length / 5));
    
    for (let i = 0; i < sentences.length; i += sentencesPerScene) {
        const sceneSentences = sentences.slice(i, i + sentencesPerScene);
        const sceneText = sceneSentences.join('। ') + '।';
        
        const characters = extractCharacters(sceneText);
        const background = extractBackground(sceneText);
        
        scenes.push({
            id: generateId(),
            title: `सीन ${scenes.length + 1}`,
            description: sceneText,
            characters: characters.length > 0 ? characters : ['पात्र'],
            background: background || 'गार्डन',
            hindiText: sceneText,
            duration: settings.sceneDuration
        });
    }

    return scenes.slice(0, 10);
}

function extractCharacters(text) {
    const characterKeywords = [
        'खरगोश', 'बिल्ली', 'कुत्ता', 'पक्षी', 'तितली', 'हाथी', 'शेर', 'बंदर',
        'चूहा', 'कछुआ', 'मोर', 'तोता', 'गाय', 'भैंस', 'बकरी', 'भेड़',
        'लड़का', 'लड़की', 'बच्चा', 'बूढ़ा', 'बूढ़ी', 'राजा', 'रानी',
        'परी', 'दानव', 'जादूगर', 'सैनिक', 'किसान', 'डॉक्टर', 'शिक्षक'
    ];
    
    const found = characterKeywords.filter(kw => text.includes(kw));
    return found.length > 0 ? found.slice(0, 3) : ['पात्र'];
}

function extractBackground(text) {
    const backgroundKeywords = {
        'जंगल': ['जंगल', 'वन', 'पेड़', 'झाड़ी'],
        'नदी': ['नदी', 'नहर', 'पानी', 'तालाब', 'झील', 'समुद्र'],
        'पहाड़': ['पहाड़', 'पर्वत', 'चोटी'],
        'गांव': ['गांव', 'ग्राम', 'घर', 'झोपड़ी'],
        'शहर': ['शहर', 'नगर', 'इमारत', 'सड़क', 'बाजार'],
        'गार्डन': ['बगीचा', 'गार्डन', 'फूल', 'घास', 'पौधे'],
        'कक्षा': ['कक्षा', 'स्कूल', 'क्लासरूम', 'बोर्ड', 'डेस्क'],
        'अंतरिक्ष': ['अंतरिक्ष', 'तारा', 'ग्रह', 'चंद्रमा', 'रॉकेट'],
        'पानी के नीचे': ['पानी के नीचे', 'समुद्र', 'मछली', 'मूंगा'],
        'रेगिस्तान': ['रेगिस्तान', 'रेत', 'कैक्टस', 'धूप']
    };

    for (const [bg, keywords] of Object.entries(backgroundKeywords)) {
        if (keywords.some(kw => text.includes(kw))) {
            return bg;
        }
    }
    return 'गार्डन';
}

// ========================================
// Three.js 3D Professional Renderer
// ========================================
async function initThreeJS() {
    const THREE = await import('three');
    AppState.three.THREE = THREE;
    const { EffectComposer } = await import('three/addons/postprocessing/EffectComposer.js');
    const { RenderPass } = await import('three/addons/postprocessing/RenderPass.js');
    const { ShaderPass } = await import('three/addons/postprocessing/ShaderPass.js');
    const { FXAAShader } = await import('three/addons/shaders/FXAAShader.js');

    AppState.three.scene = new THREE.Scene();
    
    // Initialize asset manager
    AppState.three.assetManager = new SceneAssetManager(AppState.three.scene);
    
    // Initialize background
    updateBackground();

    // Create camera based on settings
    createCamera();

    const canvas = $('#previewCanvas');
    AppState.three.renderer = new THREE.WebGLRenderer({ 
        canvas, 
        antialias: true, 
        alpha: true,
        preserveDrawingBuffer: true
    });
    AppState.three.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    AppState.three.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    AppState.three.renderer.shadowMap.enabled = true;
    AppState.three.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    AppState.three.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    AppState.three.renderer.toneMappingExposure = AppState.three.lighting.exposure;

    AppState.three.composer = new EffectComposer(AppState.three.renderer);
    AppState.three.composer.addPass(new RenderPass(AppState.three.scene, AppState.three.camera));
    
    const fxaaPass = new ShaderPass(FXAAShader);
    fxaaPass.material.uniforms['resolution'].value.set(1 / canvas.clientWidth, 1 / canvas.clientHeight);
    AppState.three.composer.addPass(fxaaPass);

    // Initialize professional lighting
    setupLighting();
    
    // Create ground plane
    createGroundPlane();

    window.addEventListener('resize', onThreeResize);
    
    initSubtitles();
    generateBackgroundMusic();
    
    animateThree();
    
    console.log('Three.js initialized with professional 3D controls');
}

function createCamera() {
    const { cameraControls } = AppState.three;
    const aspect = window.innerWidth / window.innerHeight;
    
    if (cameraControls.type === 'perspective') {
        AppState.three.camera = new THREE.PerspectiveCamera(
            cameraControls.fov,
            aspect,
            0.1,
            1000
        );
        // Position camera based on distance, height, angle
        const angleRad = THREE.MathUtils.degToRad(cameraControls.angle);
        AppState.three.camera.position.set(
            Math.sin(angleRad) * cameraControls.distance,
            cameraControls.height,
            Math.cos(angleRad) * cameraControls.distance
        );
    } else {
        const frustumSize = 15;
        AppState.three.camera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2,
            frustumSize * aspect / 2,
            frustumSize / 2,
            frustumSize / -2,
            0.1,
            1000
        );
        AppState.three.camera.position.set(0, cameraControls.height, cameraControls.distance);
    }
    
    AppState.three.camera.lookAt(cameraControls.lookAt);
}

function setupLighting() {
    const { scene, lighting } = AppState.three;
    const THREE = AppState.three.THREE;
    
    // Clear existing lights
    scene.children = scene.children.filter(child => 
        !(child.isLight || child.isAmbientLight || child.isDirectionalLight || child.isPointLight || child.isSpotLight || child.isHemisphereLight)
    );
    
    // Ambient light
    const ambientLight = new THREE.AmbientLight(lighting.ambientColor, lighting.ambientIntensity);
    scene.add(ambientLight);
    AppState.three.ambientLight = ambientLight;
    
    // Key light (main directional light)
    const keyAngleRad = THREE.MathUtils.degToRad(lighting.keyAngle);
    const keyLight = new THREE.DirectionalLight(lighting.keyColor, lighting.keyIntensity);
    keyLight.position.set(
        Math.sin(keyAngleRad) * 10,
        10,
        Math.cos(keyAngleRad) * 10
    );
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = lighting.shadowQuality === 'ultra' ? 4096 : 
                                   lighting.shadowQuality === 'high' ? 2048 : 
                                   lighting.shadowQuality === 'medium' ? 1024 : 512;
    keyLight.shadow.mapSize.height = keyLight.shadow.mapSize.width;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 50;
    keyLight.shadow.camera.left = -20;
    keyLight.shadow.camera.right = 20;
    keyLight.shadow.camera.top = 20;
    keyLight.shadow.camera.bottom = -20;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);
    AppState.three.keyLight = keyLight;
    
    // Fill light
    const fillLight = new THREE.DirectionalLight(lighting.fillColor, lighting.fillIntensity);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);
    AppState.three.fillLight = fillLight;
    
    // Rim light (backlight)
    const rimLight = new THREE.DirectionalLight(lighting.rimColor, lighting.rimIntensity);
    rimLight.position.set(0, 5, -10);
    scene.add(rimLight);
    AppState.three.rimLight = rimLight;
    
    // Hemisphere light for environment
    if (lighting.environment === 'outdoor' || lighting.environment === 'sunset') {
        const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x8fbc8f, 0.4);
        scene.add(hemiLight);
        AppState.three.hemiLight = hemiLight;
    }
    
    // Update shadow quality for all shadow-casting lights
    updateShadowQuality();
}

function updateShadowQuality() {
    const quality = AppState.three.lighting.shadowQuality;
    const size = quality === 'ultra' ? 4096 : quality === 'high' ? 2048 : quality === 'medium' ? 1024 : 512;
    
    if (AppState.three.keyLight) {
        AppState.three.keyLight.shadow.mapSize.width = size;
        AppState.three.keyLight.shadow.mapSize.height = size;
        AppState.three.keyLight.shadow.map = null; // Force recreation
        AppState.three.keyLight.shadow.needsUpdate = true;
    }
}

function createGroundPlane() {
    const { scene, background } = AppState.three;
    const THREE = AppState.three.THREE;
    
    // Remove existing ground
    if (AppState.three.groundPlane) {
        scene.remove(AppState.three.groundPlane);
        AppState.three.groundPlane.geometry.dispose();
        AppState.three.groundPlane.material.dispose();
    }
    
    if (!background.showGround) return;
    
    const groundGeo = new THREE.PlaneGeometry(100, 100);
    const groundMat = new THREE.MeshStandardMaterial({
        color: background.groundColor,
        roughness: background.groundRoughness,
        metalness: 0.0,
        shadowSide: THREE.DoubleSide
    });
    
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = background.groundShadows;
    ground.name = 'GroundPlane';
    
    scene.add(ground);
    AppState.three.groundPlane = ground;
}

function updateBackground() {
    const { scene, background, renderer } = AppState.three;
    const THREE = AppState.three.THREE;
    
    switch (background.type) {
        case 'color':
            scene.background = new THREE.Color(background.color1);
            break;
            
        case 'gradient':
            // Create gradient background using a plane
            if (AppState.three.bgPlane) {
                scene.remove(AppState.three.bgPlane);
                AppState.three.bgPlane.geometry.dispose();
                AppState.three.bgPlane.material.dispose();
            }
            
            const bgGeo = new THREE.PlaneGeometry(200, 200);
            const bgMat = new THREE.MeshBasicMaterial({
                vertexColors: true,
                side: THREE.DoubleSide,
                depthWrite: false
            });
            
            // We'll use a shader for gradient
            const gradientMat = new THREE.ShaderMaterial({
                uniforms: {
                    color1: { value: new THREE.Color(background.color1) },
                    color2: { value: new THREE.Color(background.color2) },
                    rotation: { value: background.rotation }
                },
                vertexShader: `
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform vec3 color1;
                    uniform vec3 color2;
                    uniform float rotation;
                    varying vec2 vUv;
                    void main() {
                        float angle = rotation;
                        vec2 rotatedUv = vec2(
                            cos(angle) * (vUv.x - 0.5) - sin(angle) * (vUv.y - 0.5) + 0.5,
                            sin(angle) * (vUv.x - 0.5) + cos(angle) * (vUv.y - 0.5) + 0.5
                        );
                        gl_FragColor = vec4(mix(color1, color2, rotatedUv.y), 1.0);
                    }
                `,
                depthWrite: false
            });
            
            const bgPlane = new THREE.Mesh(bgGeo, gradientMat);
            bgPlane.position.z = -50;
            bgPlane.renderOrder = -100;
            scene.add(bgPlane);
            AppState.three.bgPlane = bgPlane;
            scene.background = null;
            break;
            
        case 'sky':
            createSkyBackground();
            break;
            
        case 'hdri':
            // Placeholder for HDRI - would need RGBELoader
            scene.background = new THREE.Color(background.color1);
            break;
            
        case 'scene3d':
            // 3D scene background - add environmental objects
            create3DSceneBackground();
            break;
    }
    
    // Fog
    if (background.fogDensity > 0) {
        scene.fog = new THREE.FogExp2(background.fogColor, background.fogDensity);
    } else {
        scene.fog = null;
    }
}

function createSkyBackground() {
    const { scene, background } = AppState.three;
    const THREE = AppState.three.THREE;
    
    // Remove old sky
    if (AppState.three.skySphere) {
        scene.remove(AppState.three.skySphere);
        AppState.three.skySphere.geometry.dispose();
        AppState.three.skySphere.material.dispose();
    }
    
    const skyGeo = new THREE.SphereGeometry(500, 32, 32);
    skyGeo.scale(-1, 1, 1); // Invert normals for inside view
    
    let skyColor1 = 0x87ceeb;
    let skyColor2 = 0xffffff;
    
    switch (background.skyPreset) {
        case 'clear':
            skyColor1 = 0x87ceeb;
            skyColor2 = 0xe0f7fa;
            break;
        case 'cloudy':
            skyColor1 = 0x90a4ae;
            skyColor2 = 0xb0bec5;
            break;
        case 'sunset':
            skyColor1 = 0xff7043;
            skyColor2 = 0xffcc80;
            break;
        case 'night':
            skyColor1 = 0x0d0d2b;
            skyColor2 = 0x1a1a3e;
            break;
        case 'storm':
            skyColor1 = 0x37474f;
            skyColor2 = 0x455a64;
            break;
    }
    
    const skyMat = new THREE.ShaderMaterial({
        uniforms: {
            topColor: { value: new THREE.Color(skyColor1) },
            bottomColor: { value: new THREE.Color(skyColor2) },
            offset: { value: 0.5 },
            exponent: { value: 0.6 }
        },
        vertexShader: `
            varying vec3 vWorldPosition;
            void main() {
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 topColor;
            uniform vec3 bottomColor;
            uniform float offset;
            uniform float exponent;
            varying vec3 vWorldPosition;
            void main() {
                float h = normalize(vWorldPosition + offset).y;
                gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
            }
        `,
        side: THREE.BackSide,
        depthWrite: false
    });
    
    const skySphere = new THREE.Mesh(skyGeo, skyMat);
    skySphere.renderOrder = -100;
    scene.add(skySphere);
    AppState.three.skySphere = skySphere;
    
    // Add stars for night
    if (background.skyPreset === 'night') {
        addStars();
    }
    
    scene.background = null;
}

function addStars() {
    const { scene } = AppState.three;
    const THREE = AppState.three.THREE;
    
    const starsGeo = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const sizes = [];
    
    for (let i = 0; i < 5000; i++) {
        const radius = 400 + Math.random() * 100;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions.push(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
        );
        
        const starColor = Math.random() > 0.5 ? 0xffffff : 0xfff0e0;
        colors.push(
            (starColor >> 16 & 255) / 255,
            (starColor >> 8 & 255) / 255,
            (starColor & 255) / 255
        );
        
        sizes.push(Math.random() * 2 + 0.5);
    }
    
    starsGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    starsGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    starsGeo.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    
    const starsMat = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });
    
    const stars = new THREE.Points(starsGeo, starsMat);
    stars.renderOrder = -100;
    scene.add(stars);
    AppState.three.stars = stars;
}

function create3DSceneBackground() {
    const { scene } = AppState.three;
    const THREE = AppState.three.THREE;
    
    // Add some environmental objects for 3D scene background
    // Trees
    for (let i = 0; i < 20; i++) {
        createTree(
            (Math.random() - 0.5) * 80,
            (Math.random() - 0.5) * 80
        );
    }
    
    // Rocks
    for (let i = 0; i < 10; i++) {
        createRock(
            (Math.random() - 0.5) * 60,
            (Math.random() - 0.5) * 60
        );
    }
}

function createTree(x, z) {
    const { scene } = AppState.three;
    const THREE = AppState.three.THREE;
    
    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.4, 2, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a2c1a, roughness: 0.9 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.set(x, 1, z);
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    scene.add(trunk);
    
    const leavesGeo = new THREE.ConeGeometry(1.5, 3, 8);
    const leavesMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.8 });
    const leaves = new THREE.Mesh(leavesGeo, leavesMat);
    leaves.position.set(x, 3.5, z);
    leaves.castShadow = true;
    leaves.receiveShadow = true;
    scene.add(leaves);
    
    const leaves2 = new THREE.Mesh(leavesGeo, leavesMat);
    leaves2.position.set(x, 5, z);
    leaves2.scale.set(0.7, 0.7, 0.7);
    leaves2.castShadow = true;
    scene.add(leaves2);
}

function createRock(x, z) {
    const { scene } = AppState.three;
    const THREE = AppState.three.THREE;
    
    const rockGeo = new THREE.DodecahedronGeometry(Math.random() * 1.5 + 0.5);
    const rockMat = new THREE.MeshStandardMaterial({ 
        color: 0x757575, 
        roughness: 0.9,
        flatShading: true
    });
    const rock = new THREE.Mesh(rockGeo, rockMat);
    rock.position.set(x, rockGeo.parameters.radius, z);
    rock.rotation.set(Math.random(), Math.random(), Math.random());
    rock.castShadow = true;
    rock.receiveShadow = true;
    scene.add(rock);
}

function onThreeResize() {
    const { camera, renderer, composer, cameraControls } = AppState.three;
    const canvas = $('#previewCanvas');
    
    if (!camera || !renderer) return;
    
    const aspect = canvas.clientWidth / canvas.clientHeight;
    
    if (cameraControls.type === 'perspective' && camera.isPerspectiveCamera) {
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
    } else if (camera.isOrthographicCamera) {
        const frustumSize = 15;
        camera.left = frustumSize * aspect / -2;
        camera.right = frustumSize * aspect / 2;
        camera.top = frustumSize / 2;
        camera.bottom = frustumSize / -2;
        camera.updateProjectionMatrix();
    }
    
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    composer.setSize(canvas.clientWidth, canvas.clientHeight);
    
    const fxaaPass = composer.passes.find(p => p.material && p.material.uniforms.resolution);
    if (fxaaPass) {
        fxaaPass.material.uniforms['resolution'].value.set(1 / canvas.clientWidth, 1 / canvas.clientHeight);
    }
}

function animateThree() {
    const { scene, camera, renderer, composer, animationId, characters3d } = AppState.three;
    
    AppState.three.animationId = requestAnimationFrame(animateThree);
    
    if (!scene || !camera) return;
    
    const deltaTime = 1/60; // Fixed timestep for animation
    const time = performance.now() * 0.001 * AppState.settings.animationSpeed;
    
    // Update 3D characters
    characters3d.forEach(char => {
        if (char.character3d && char.character3d.mixer) {
            char.character3d.update(deltaTime * AppState.settings.animationSpeed);
        }
    });
    
    // Update legacy paper-cutout characters
    animateObjects(time);
    
    if (AppState.three.isTransitioning) {
        updateTransition(time);
    }
    
    updateCameraMovement(time);
    updateSubtitlesForCurrentTime();
    
    if (composer) {
        composer.render();
    } else {
        renderer.render(scene, camera);
    }
}

function animateObjects(time) {
    const { characters, backgrounds } = AppState.three;
    
    characters.forEach(char => {
        if (!char.mesh || !char.template) return;
        
        const animType = char.animation || 'idle';
        const animParts = char.template.animations[animType] || [];
        
        animParts.forEach(partName => {
            const part = char.parts.find(p => p.name === partName);
            if (!part || !part.mesh) return;
            
            const baseOffset = part.offset || [0, 0, 0];
            const baseRotation = part.rotation || 0;
            
            switch (animType) {
                case 'idle':
                    part.mesh.position.y = baseOffset[1] + Math.sin(time * 2 + part.phase) * 0.03;
                    part.mesh.rotation.z = baseRotation + Math.sin(time * 1.5 + part.phase) * 0.05;
                    break;
                case 'walk':
                    part.mesh.position.x = baseOffset[0] + Math.sin(time * 4 + part.phase) * 0.1;
                    part.mesh.rotation.z = baseRotation + Math.sin(time * 4 + part.phase) * 0.15;
                    break;
                case 'hop':
                    const hopCycle = Math.sin(time * 3);
                    part.mesh.position.y = baseOffset[1] + Math.max(0, hopCycle) * 0.5;
                    part.mesh.rotation.z = baseRotation + hopCycle * 0.1;
                    break;
                case 'fly':
                    part.mesh.position.y = baseOffset[1] + Math.sin(time * 5 + part.phase) * 0.15;
                    part.mesh.rotation.z = baseRotation + Math.sin(time * 5 + part.phase) * 0.2;
                    break;
                case 'float':
                    part.mesh.position.x = baseOffset[0] + Math.sin(time * 0.5 + part.phase) * 0.2;
                    part.mesh.position.y = baseOffset[1] + Math.cos(time * 0.7 + part.phase) * 0.1;
                    break;
                case 'wind':
                    part.mesh.rotation.z = baseRotation + Math.sin(time * 1.2 + part.phase) * 0.1;
                    part.mesh.position.x = baseOffset[0] + Math.sin(time * 1.2 + part.phase) * 0.05;
                    break;
                case 'shine':
                    part.mesh.rotation.z = baseRotation + time * 0.2;
                    part.mesh.scale.setScalar(1 + Math.sin(time * 2) * 0.05);
                    break;
                case 'bloom':
                    part.mesh.scale.y = Math.max(0.1, Math.sin(time * 0.5 + part.phase) * 0.5 + 0.5);
                    break;
                case 'drive':
                    part.mesh.rotation.z = baseRotation + time * 10;
                    break;
            }
        });
    });
    
    backgrounds.forEach(bg => {
        if (!bg.mesh || !bg.animData) return;
        
        bg.animData.parts.forEach(part => {
            if (!part.mesh) return;
            
            const animType = bg.animData.type || 'idle';
            const baseOffset = part.offset || [0, 0, 0];
            const baseRotation = part.rotation || 0;
            
            switch (animType) {
                case 'float':
                    part.mesh.position.x = baseOffset[0] + Math.sin(time * 0.3 + part.phase) * 0.3;
                    part.mesh.position.y = baseOffset[1] + Math.cos(time * 0.4 + part.phase) * 0.2;
                    break;
                case 'wind':
                    part.mesh.rotation.z = baseRotation + Math.sin(time * 0.8 + part.phase) * 0.08;
                    break;
                case 'idle':
                default:
                    part.mesh.position.y = baseOffset[1] + Math.sin(time * 1.5 + part.phase) * 0.02;
                    break;
            }
        });
    });
}

function updateCameraMovement(time) {
    const { camera, cameraControls } = AppState.three;
    const settings = AppState.settings;
    
    if (!camera) return;
    
    const speed = cameraControls.speed * 0.5;
    
    switch (cameraControls.movement) {
        case 'orbit':
            // Orbit around lookAt target
            const orbitRadius = cameraControls.distance;
            const orbitAngle = time * speed;
            camera.position.x = cameraControls.lookAt.x + Math.sin(orbitAngle) * orbitRadius;
            camera.position.z = cameraControls.lookAt.z + Math.cos(orbitAngle) * orbitRadius;
            camera.position.y = cameraControls.height + Math.sin(time * speed * 0.5) * 1;
            break;
            
        case 'dolly':
            // Dolly in/out
            const dollyDist = cameraControls.distance + Math.sin(time * speed * 0.3) * 3;
            const dollyAngle = THREE.MathUtils.degToRad(cameraControls.angle);
            camera.position.x = cameraControls.lookAt.x + Math.sin(dollyAngle) * dollyDist;
            camera.position.z = cameraControls.lookAt.z + Math.cos(dollyAngle) * dollyDist;
            camera.position.y = cameraControls.height;
            break;
            
        case 'crane':
            // Crane up/down
            camera.position.x = cameraControls.lookAt.x + Math.sin(time * speed * 0.2) * 2;
            camera.position.y = cameraControls.height + Math.sin(time * speed * 0.4) * 5;
            camera.position.z = cameraControls.lookAt.z + cameraControls.distance;
            break;
            
        case 'handheld':
            // Handheld shake
            camera.position.x = cameraControls.lookAt.x + Math.sin(time * speed * 5) * 0.1 + Math.sin(time * speed * 7) * 0.05;
            camera.position.y = cameraControls.height + Math.cos(time * speed * 3) * 0.1 + Math.cos(time * speed * 11) * 0.05;
            camera.position.z = cameraControls.lookAt.z + cameraControls.distance + Math.sin(time * speed * 2) * 0.1;
            break;
            
        case 'tracking':
            // Tracking shot - move parallel to subject
            camera.position.x = cameraControls.lookAt.x + Math.sin(time * speed) * 10;
            camera.position.y = cameraControls.height;
            camera.position.z = cameraControls.lookAt.z + cameraControls.distance;
            break;
            
        case 'static':
        default:
            const angleRad = THREE.MathUtils.degToRad(cameraControls.angle);
            camera.position.x = cameraControls.lookAt.x + Math.sin(angleRad) * cameraControls.distance;
            camera.position.y = cameraControls.height;
            camera.position.z = cameraControls.lookAt.z + Math.cos(angleRad) * cameraControls.distance;
            break;
    }
    
    // Smooth lookAt
    const targetLookAt = cameraControls.lookAt.clone();
    // Add slight offset for character focus
    if (AppState.three.characters3d.length > 0) {
        const mainChar = AppState.three.characters3d[0];
        if (mainChar && mainChar.character3d) {
            targetLookAt.y = Math.max(targetLookAt.y, 1.5); // Focus on character upper body
        }
    }
    
    camera.lookAt(targetLookAt);
}

function updateTransition(time) {
    const duration = 1.5;
    
    AppState.three.transitionProgress += (1 / 60) / duration * AppState.settings.animationSpeed;
    
    if (AppState.three.transitionProgress >= 1) {
        AppState.three.transitionProgress = 0;
        AppState.three.isTransitioning = false;
        AppState.three.currentScene = AppState.three.nextScene;
        completeTransition();
        return;
    }
    
    const progress = AppState.three.transitionProgress;
    const eased = easeInOutCubic(progress);
    
    switch (AppState.settings.transitionType) {
        case 'paper-flip':
            applyPaperFlipTransition(eased);
            break;
        case 'slide':
            applySlideTransition(eased);
            break;
        case 'fade':
            applyFadeTransition(eased);
            break;
        case 'zoom':
            applyZoomTransition(eased);
            break;
    }
}

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function applyPaperFlipTransition(progress) {
    const { currentScene, nextScene } = AppState.three;
    const currentBg = AppState.three.backgrounds[currentScene];
    const nextBg = AppState.three.backgrounds[nextScene];
    const currentChars = AppState.three.characters.filter(c => c.sceneIndex === currentScene);
    const nextChars = AppState.three.characters.filter(c => c.sceneIndex === nextScene);
    
    if (currentBg && currentBg.mesh) {
        currentBg.mesh.rotation.y = progress * Math.PI;
        currentBg.mesh.scale.x = 1 - progress;
        currentBg.mesh.visible = progress < 1;
    }
    currentChars.forEach(c => {
        if (c.mesh) {
            c.mesh.rotation.y = progress * Math.PI;
            c.mesh.scale.x = 1 - progress;
        }
    });
    
    if (nextBg && nextBg.mesh) {
        nextBg.mesh.rotation.y = (progress - 1) * Math.PI;
        nextBg.mesh.scale.x = progress;
        nextBg.mesh.visible = true;
    }
    nextChars.forEach(c => {
        if (c.mesh) {
            c.mesh.rotation.y = (progress - 1) * Math.PI;
            c.mesh.scale.x = progress;
        }
    });
}

function applySlideTransition(progress) {
    const { currentScene, nextScene } = AppState.three;
    const direction = nextScene > currentScene ? 1 : -1;
    
    const currentBg = AppState.three.backgrounds[currentScene];
    const nextBg = AppState.three.backgrounds[nextScene];
    const currentChars = AppState.three.characters.filter(c => c.sceneIndex === currentScene);
    const nextChars = AppState.three.characters.filter(c => c.sceneIndex === nextScene);
    
    const offset = 15 * direction;
    
    if (currentBg && currentBg.mesh) {
        currentBg.mesh.position.x = -offset * progress;
    }
    currentChars.forEach(c => {
        if (c.mesh) c.mesh.position.x = -offset * progress;
    });
    
    if (nextBg && nextBg.mesh) {
        nextBg.mesh.position.x = offset * (1 - progress);
        nextBg.mesh.visible = true;
    }
    nextChars.forEach(c => {
        if (c.mesh) {
            c.mesh.position.x = offset * (1 - progress);
        }
    });
}

function applyFadeTransition(progress) {
    const { currentScene, nextScene } = AppState.three;
    
    const currentBg = AppState.three.backgrounds[currentScene];
    const nextBg = AppState.three.backgrounds[nextScene];
    const currentChars = AppState.three.characters.filter(c => c.sceneIndex === currentScene);
    const nextChars = AppState.three.characters.filter(c => c.sceneIndex === nextScene);
    
    const opacity = 1 - progress;
    const nextOpacity = progress;
    
    [currentBg, ...currentChars].forEach(obj => {
        if (obj && obj.mesh) {
            obj.mesh.traverse(child => {
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(m => m.opacity = opacity);
                    } else {
                        child.material.opacity = opacity;
                    }
                    child.material.transparent = true;
                }
            });
        }
    });
    
    [nextBg, ...nextChars].forEach(obj => {
        if (obj && obj.mesh) {
            obj.mesh.traverse(child => {
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(m => m.opacity = nextOpacity);
                    } else {
                        child.material.opacity = nextOpacity;
                    }
                    child.material.transparent = true;
                }
            });
        }
    });
}

function applyZoomTransition(progress) {
    const { camera, currentScene, nextScene } = AppState.three;
    
    const currentBg = AppState.three.backgrounds[currentScene];
    const nextBg = AppState.three.backgrounds[nextScene];
    const currentChars = AppState.three.characters.filter(c => c.sceneIndex === currentScene);
    const nextChars = AppState.three.characters.filter(c => c.sceneIndex === nextScene);
    
    const scale = 1 + progress * 2;
    const nextScale = 3 - progress * 2;
    
    if (currentBg && currentBg.mesh) {
        currentBg.mesh.scale.setScalar(scale);
        currentBg.mesh.position.z = progress * 5;
    }
    currentChars.forEach(c => {
        if (c.mesh) {
            c.mesh.scale.setScalar(scale);
            c.mesh.position.z = progress * 5;
        }
    });
    
    if (nextBg && nextBg.mesh) {
        nextBg.mesh.scale.setScalar(nextScale);
        nextBg.mesh.position.z = (1 - progress) * 5;
        nextBg.mesh.visible = true;
    }
    nextChars.forEach(c => {
        if (c.mesh) {
            c.mesh.scale.setScalar(nextScale);
            c.mesh.position.z = (1 - progress) * 5;
        }
    });
    
    camera.zoom = 1 + progress * 0.5;
    camera.updateProjectionMatrix();
}

function completeTransition() {
    const { currentScene, nextScene } = AppState.three;
    
    const oldBg = AppState.three.backgrounds[currentScene];
    const oldChars = AppState.three.characters.filter(c => c.sceneIndex === currentScene);
    
    if (oldBg && oldBg.mesh) oldBg.mesh.visible = false;
    oldChars.forEach(c => { if (c.mesh) c.mesh.visible = false; });
    
    const newBg = AppState.three.backgrounds[nextScene];
    const newChars = AppState.three.characters.filter(c => c.sceneIndex === nextScene);
    
    if (newBg && newBg.mesh) {
        newBg.mesh.rotation.y = 0;
        newBg.mesh.scale.set(1, 1, 1);
        newBg.mesh.position.set(0, 0, newBg.depth || 0);
        newBg.mesh.visible = true;
    }
    newChars.forEach(c => {
        if (c.mesh) {
            c.mesh.rotation.y = 0;
            c.mesh.scale.set(1, 1, 1);
            c.mesh.visible = true;
        }
    });
    
    AppState.three.camera.zoom = 1;
    AppState.three.camera.updateProjectionMatrix();
}

// ========================================
// Paper Cutout Geometry Creation
// ========================================
async function createPaperCutout(templateName, colors, depth = 0, scale = 1) {
    const THREE = await import('three');
    const template = PaperShapes[templateName];
    if (!template) return null;
    
    const group = new THREE.Group();
    group.userData = { templateName, depth, parts: [] };
    
    const thickness = AppState.settings.paperThickness * 0.02;
    const paperColors = colors.paper;
    
    template.parts.forEach((partDef, index) => {
        let geometry;
        const size = partDef.size;
        const colorIndex = typeof partDef.color === 'number' ? partDef.color % paperColors.length : 0;
        
        let color;
        if (partDef.color === 'black') color = 0x1a1a1a;
        else if (partDef.color === 'white') color = 0xffffff;
        else if (partDef.color === 'pink') color = 0xff69b4;
        else if (partDef.color === 'orange') color = 0xffa500;
        else if (partDef.color === 'brown') color = 0x8b4513;
        else if (partDef.color === 'green') color = 0x2e8b57;
        else if (partDef.color === 'darkred') color = 0x8b0000;
        else if (partDef.color && partDef.color.startsWith('#')) color = parseInt(partDef.color.replace('#', '0x'));
        else color = parseInt(paperColors[colorIndex].replace('#', '0x'));
        
        switch (partDef.shape) {
            case 'circle':
                geometry = new THREE.CircleGeometry(size[0] * scale, 32);
                break;
            case 'ellipse':
                geometry = new THREE.EllipseCurve(0, 0, size[0] * scale, size[1] * scale).getPoints(32);
                geometry = new THREE.ShapeGeometry(new THREE.Shape(geometry));
                break;
            case 'rect':
                geometry = new THREE.PlaneGeometry(size[0] * scale, size[1] * scale);
                break;
            case 'square':
                geometry = new THREE.PlaneGeometry(size[0] * scale, size[0] * scale);
                break;
            case 'triangle':
                const triShape = new THREE.Shape();
                const s = size[0] * scale;
                triShape.moveTo(0, s);
                triShape.lineTo(-s * 0.866, -s * 0.5);
                triShape.lineTo(s * 0.866, -s * 0.5);
                triShape.lineTo(0, s);
                geometry = new THREE.ShapeGeometry(triShape);
                break;
            case 'line':
                geometry = new THREE.BufferGeometry();
                const linePoints = [0, 0, 0, 0, -size[0] * scale, 0];
                geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePoints, 3));
                break;
            default:
                geometry = new THREE.PlaneGeometry(1 * scale, 1 * scale);
        }
        
        const material = new THREE.MeshStandardMaterial({
            color: color,
            side: THREE.DoubleSide,
            roughness: 0.8,
            metalness: 0.05,
            transparent: false,
            depthWrite: true,
            polygonOffset: true,
            polygonOffsetFactor: -index - 1,
            polygonOffsetUnits: -1
        });
        
        let mesh;
        if (partDef.shape === 'line') {
            material.linewidth = 3;
            mesh = new THREE.Line(geometry, material);
        } else {
            mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
        }
        
        const offset = partDef.offset || [0, 0];
        mesh.position.set(
            offset[0] * scale,
            offset[1] * scale,
            (index + 1) * thickness * scale
        );
        
        if (partDef.rotation) {
            mesh.rotation.z = partDef.rotation;
        }
        
        const partData = {
            name: partDef.name,
            mesh,
            offset: [offset[0] * scale, offset[1] * scale, (index + 1) * thickness * scale],
            rotation: partDef.rotation || 0,
            phase: index * 0.5,
            index
        };
        
        group.add(mesh);
        group.userData.parts.push(partData);
    });
    
    group.position.z = depth;
    
    return { group, parts: group.userData.parts, template };
}

// ========================================
// Scene Building
// ========================================
async function buildScene(sceneIndex) {
    const sceneData = AppState.scenes[sceneIndex];
    if (!sceneData) return;
    
    const THREE = await import('three');
    const colors = ColorThemes[AppState.settings.colorTheme];
    
    clearSceneObjects(sceneIndex);
    
    const background = await buildBackground(sceneData.background, colors, sceneIndex);
    if (background) {
        AppState.three.backgrounds[sceneIndex] = background;
        AppState.three.scene.add(background.group);
    }
    
    for (let i = 0; i < sceneData.characters.length; i++) {
        await buildCharacter(sceneData.characters[i], colors, sceneIndex, i);
    }
    
    // Load assets for this scene
    if (sceneData.assets && AppState.three.assetManager) {
        // Clear existing assets first
        AppState.three.assetManager.clear();
        // Load saved assets
        AppState.three.assetManager.fromJSON(sceneData.assets);
    }
    
    console.log(`Scene ${sceneIndex + 1} built`);
}

async function buildBackground(bgName, colors, sceneIndex) {
    const template = BackgroundTemplates[bgName] || BackgroundTemplates.garden;
    const THREE = await import('three');
    
    const bgGroup = new THREE.Group();
    bgGroup.userData = { type: 'background', name: bgName, sceneIndex, layers: [] };
    
    const baseGeometry = new THREE.PlaneGeometry(30, 20);
    const baseMaterial = new THREE.MeshStandardMaterial({
        color: parseInt(colors.background[0].replace('#', '0x')),
        side: THREE.DoubleSide,
        roughness: 0.9,
        metalness: 0,
        polygonOffset: true,
        polygonOffsetFactor: -100,
        polygonOffsetUnits: -10
    });
    const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
    baseMesh.position.z = -5;
    baseMesh.receiveShadow = true;
    bgGroup.add(baseMesh);
    
    for (let layerIndex = 0; layerIndex < template.layers.length; layerIndex++) {
        const layer = template.layers[layerIndex];
        if (layer.type === 'sky') {
            baseMesh.material.color.set(parseInt(layer.color.replace('#', '0x')));
        } else if (layer.type === 'ground' || layer.type === 'grass' || layer.type === 'water' || layer.type === 'sand' || layer.type === 'wall') {
            const geo = new THREE.PlaneGeometry(30, layer.type === 'water' ? 8 : 5);
            const mat = new THREE.MeshStandardMaterial({
                color: parseInt(layer.color.replace('#', '0x')),
                side: THREE.DoubleSide,
                roughness: 0.9,
                metalness: layer.type === 'water' ? 0.3 : 0,
                transparent: layer.type === 'water',
                opacity: layer.type === 'water' ? 0.7 : 1,
                polygonOffset: true,
                polygonOffsetFactor: -50 + layerIndex,
                polygonOffsetUnits: -5
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(0, layer.type === 'water' ? -3 : -5, layer.depth || layerIndex * 0.5);
            mesh.rotation.x = layer.type === 'ground' || layer.type === 'grass' || layer.type === 'sand' ? -Math.PI / 2 : 0;
            mesh.receiveShadow = true;
            bgGroup.add(mesh);
        } else if (layer.type === 'mountain' || layer.type === 'mountains' || layer.type === 'dunes') {
            const count = layer.count || 3;
            for (let i = 0; i < count; i++) {
                const mountainShape = new THREE.Shape();
                const width = 8 + Math.random() * 6;
                const height = 4 + Math.random() * 3;
                const x = -15 + i * (30 / count) + (Math.random() - 0.5) * 3;
                
                mountainShape.moveTo(-width/2, 0);
                mountainShape.lineTo(0, height);
                mountainShape.lineTo(width/2, 0);
                mountainShape.lineTo(-width/2, 0);
                
                const geo = new THREE.ShapeGeometry(mountainShape);
                const mat = new THREE.MeshStandardMaterial({
                    color: parseInt(layer.color.replace('#', '0x')),
                    side: THREE.DoubleSide,
                    roughness: 0.9,
                    polygonOffset: true,
                    polygonOffsetFactor: -30 + layerIndex,
                    polygonOffsetUnits: -3
                });
                const mesh = new THREE.Mesh(geo, mat);
                mesh.position.set(x, -4, layer.depth || -3);
                mesh.userData = { animData: { type: 'idle', parts: [{ mesh, offset: [0, 0, 0], phase: i }] }};
                bgGroup.add(mesh);
                bgGroup.userData.layers.push(mesh);
            }
        } else if (layer.template && PaperShapes[layer.template]) {
            const count = layer.count || 1;
            const spacing = layer.spacing || 4;
            const startX = -((count - 1) * spacing) / 2;
            
            for (let i = 0; i < count; i++) {
                const x = startX + i * spacing + (Math.random() - 0.5) * 1;
                const y = (layer.position ? layer.position[1] : -2) + (Math.random() - 0.5) * 1;
                const z = layer.depth || layerIndex * 0.5;
                const scale = layer.scale || 1;
                
                const cutout = await createPaperCutout(layer.template, colors, z, scale);
                if (cutout) {
                    cutout.group.position.set(x, y, z);
                    cutout.group.userData = { 
                        ...cutout.group.userData, 
                        sceneIndex, 
                        layerIndex,
                        animData: { type: layer.type.includes('float') ? 'float' : 'wind', parts: cutout.parts }
                    };
                    bgGroup.add(cutout.group);
                    bgGroup.userData.layers.push(cutout.group);
                }
            }
        } else if (layer.type === 'clouds') {
            const count = layer.count || 3;
            for (let i = 0; i < count; i++) {
                const cutout = await createPaperCutout('cloud', colors, -4 + i * 0.5, 1.5);
                if (cutout) {
                    cutout.group.position.set(-10 + i * 8, 4 + Math.random() * 2, -4 + i * 0.5);
                    cutout.group.userData = { 
                        ...cutout.group.userData, 
                        sceneIndex, 
                        layerIndex,
                        animData: { type: 'float', parts: cutout.parts }
                    };
                    bgGroup.add(cutout.group);
                    bgGroup.userData.layers.push(cutout.group);
                }
            }
        } else if (layer.type === 'stars') {
            const starGeo = new THREE.BufferGeometry();
            const positions = [];
            for (let i = 0; i < layer.count; i++) {
                positions.push(
                    (Math.random() - 0.5) * 40,
                    (Math.random() - 0.5) * 20,
                    -15
                );
            }
            starGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            const starMat = new THREE.PointsMaterial({
                color: 0xffffff,
                size: 0.1,
                transparent: true,
                opacity: 0.8
            });
            const stars = new THREE.Points(starGeo, starMat);
            bgGroup.add(stars);
        }
    }
    
    return { group: bgGroup, depth: -5, animData: { type: 'wind', parts: [] } };
}

async function buildCharacter(charName, colors, sceneIndex, charIndex) {
    const sceneData = AppState.scenes[sceneIndex];
    if (!sceneData) return;
    
    // Check if we have 3D character data for this character
    const char3dData = sceneData.characters3d && sceneData.characters3d[charIndex];
    
    if (char3dData) {
        // Build 3D human character
        await buildCharacter3D(charName, char3dData, sceneIndex, charIndex);
    } else {
        // Fallback to paper cutout for backward compatibility
        await buildCharacterLegacy(charName, colors, sceneIndex, charIndex);
    }
}

async function buildCharacter3D(charName, char3dData, sceneIndex, charIndex) {
    // Create Character3D instance
    const character3d = new Character3D({
        id: char3dData.id || `char_${sceneIndex}_${charIndex}`,
        name: charName,
        preset: char3dData.bodyType || 'adult',
        skinTone: char3dData.skinTone !== undefined ? char3dData.skinTone : 2,
        hairStyle: char3dData.hairStyle || 'short',
        hairColor: char3dData.hairColor !== undefined ? char3dData.hairColor : 0,
        eyeColor: char3dData.eyeColor !== undefined ? char3dData.eyeColor : 0,
        clothing: char3dData.clothing || 'casual',
        bodyScale: char3dData.bodyScale || { height: 1.0, width: 1.0, depth: 1.0 },
        headScale: char3dData.headScale || 1.0,
        limbLength: char3dData.limbLength || 1.0,
        visualStyle: AppState.settings.videoStyle || 'paper-cutout',
        paperThickness: (AppState.settings.paperThickness || 3) * 0.02
    });
    
    // Position character
    const spacing = 3;
    const charCount = AppState.scenes[sceneIndex].characters.length;
    const startX = -((charCount - 1) * spacing) / 2;
    
    character3d.group.position.set(
        startX + charIndex * spacing,
        0,
        0
    );
    
    // Add to scene
    AppState.three.scene.add(character3d.group);
    
    // Store character data
    const charData = {
        name: charName,
        character3d: character3d,
        mesh: character3d.group,
        sceneIndex,
        charIndex,
        animation: char3dData.animation || 'idle',
        basePosition: character3d.group.position.clone(),
        // Customization data for persistence
        customization: {
            bodyType: char3dData.bodyType || 'adult',
            skinTone: char3dData.skinTone !== undefined ? char3dData.skinTone : 2,
            hairStyle: char3dData.hairStyle || 'short',
            hairColor: char3dData.hairColor !== undefined ? char3dData.hairColor : 0,
            eyeColor: char3dData.eyeColor !== undefined ? char3dData.eyeColor : 0,
            clothing: char3dData.clothing || 'casual',
            bodyScale: char3dData.bodyScale || { height: 1.0, width: 1.0, depth: 1.0 },
            headScale: char3dData.headScale || 1.0,
            limbLength: char3dData.limbLength || 1.0,
            expression: char3dData.expression || 'neutral',
            expressionIntensity: char3dData.expressionIntensity || 1.0,
            visualStyle: AppState.settings.videoStyle || 'paper-cutout',
            paperThickness: (AppState.settings.paperThickness || 3) * 0.02
        }
    };
    
    AppState.three.characters3d.push(charData);
    
    // Play default animation
    character3d.playAnimation('idle', { loop: true });
    
    console.log(`3D Character ${charName} created for scene ${sceneIndex}`);
}

async function buildCharacterLegacy(charName, colors, sceneIndex, charIndex) {
    const charTemplateMap = {
        'खरगोश': 'rabbit',
        'बिल्ली': 'rabbit',
        'कुत्ता': 'rabbit',
        'पक्षी': 'bird',
        'चिड़िया': 'bird',
        'तितली': 'butterfly',
        'हाथी': 'rabbit',
        'शेर': 'rabbit',
        'बंदर': 'rabbit',
        'मोर': 'bird',
        'तोता': 'bird',
        'फूल': 'flower',
        'पेड़': 'tree',
        'बादल': 'cloud',
        'सूरज': 'sun',
        'घर': 'house',
        'गाड़ी': 'car',
        'कार': 'car'
    };
    
    const templateName = charTemplateMap[charName] || 'rabbit';
    const cutout = await createPaperCutout(templateName, colors, charIndex * 0.5, 1);
    
    if (!cutout) return;
    
    const spacing = 3;
    const startX = -((AppState.scenes[sceneIndex].characters.length - 1) * spacing) / 2;
    cutout.group.position.set(
        startX + charIndex * spacing + (Math.random() - 0.5) * 0.5,
        -2 + (Math.random() - 0.5) * 1,
        charIndex * 0.5
    );
    
    AppState.three.scene.add(cutout.group);
    
    const charData = {
        name: charName,
        template: PaperShapes[templateName],
        mesh: cutout.group,
        parts: cutout.parts,
        sceneIndex,
        charIndex,
        animation: 'idle',
        basePosition: cutout.group.position.clone()
    };
    
    AppState.three.characters.push(charData);
}

function clearSceneObjects(sceneIndex) {
    const oldBg = AppState.three.backgrounds[sceneIndex];
    if (oldBg && oldBg.group) {
        AppState.three.scene.remove(oldBg.group);
        disposeObject(oldBg.group);
    }
    
    // Clear legacy characters
    const charIndices = [];
    AppState.three.characters.forEach((char, i) => {
        if (char.sceneIndex === sceneIndex) {
            if (char.mesh) {
                AppState.three.scene.remove(char.mesh);
                disposeObject(char.mesh);
            }
            charIndices.push(i);
        }
    });
    
    charIndices.reverse().forEach(i => AppState.three.characters.splice(i, 1));
    
    // Clear 3D characters
    const char3dIndices = [];
    AppState.three.characters3d.forEach((char, i) => {
        if (char.sceneIndex === sceneIndex) {
            if (char.character3d) {
                AppState.three.scene.remove(char.character3d.group);
                char.character3d.dispose();
            }
            char3dIndices.push(i);
        }
    });
    
    char3dIndices.reverse().forEach(i => AppState.three.characters3d.splice(i, 1));
    
    // Clear assets for this scene
    if (AppState.three.assetManager) {
        AppState.three.assetManager.clear();
    }
}

function disposeObject(obj) {
    if (!obj) return;
    obj.traverse(child => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
            if (Array.isArray(child.material)) {
                child.material.forEach(m => m.dispose());
            } else {
                child.material.dispose();
            }
        }
    });
}

// ========================================
// Subtitle System (3D Text Sprites)
// ========================================
function initSubtitles() {
    const THREE = AppState.three.THREE;
    if (!THREE) {
        console.warn('THREE not available for subtitles');
        return;
    }
    
    AppState.three.subtitleCanvas = document.createElement('canvas');
    AppState.three.subtitleCanvas.width = 1024;
    AppState.three.subtitleCanvas.height = 256;
    AppState.three.subtitleCtx = AppState.three.subtitleCanvas.getContext('2d');
    
    AppState.three.subtitleTexture = new THREE.CanvasTexture(AppState.three.subtitleCanvas);
    AppState.three.subtitleTexture.needsUpdate = true;
    
    const subtitleMaterial = new THREE.SpriteMaterial({
        map: AppState.three.subtitleTexture,
        transparent: true,
        depthTest: false,
        depthWrite: false
    });
    AppState.three.subtitleSprite = new THREE.Sprite(subtitleMaterial);
    AppState.three.subtitleSprite.renderOrder = 1000;
    AppState.three.subtitleSprite.scale.set(20, 5, 1);
    AppState.three.subtitleSprite.position.set(0, -7, 15);
    AppState.three.subtitleSprite.visible = false;
    AppState.three.scene.add(AppState.three.subtitleSprite);
    
    console.log('Subtitle system initialized');
}

function updateSubtitle(text) {
    const { subtitleCanvas, subtitleCtx, subtitleTexture, subtitleSprite } = AppState.three;
    if (!subtitleCanvas || !subtitleCtx) return;
    
    const ctx = subtitleCtx;
    const canvas = subtitleCanvas;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!text) {
        subtitleSprite.visible = false;
        return;
    }
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 4;
    
    ctx.font = 'bold 48px "Noto Sans Devanagari", Arial, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const maxWidth = canvas.width - 80;
    const lines = wrapText(ctx, text, maxWidth);
    
    const lineHeight = 60;
    const totalHeight = lines.length * lineHeight + 40;
    const startY = (canvas.height - totalHeight) / 2;
    
    lines.forEach((line, i) => {
        const y = startY + i * lineHeight + lineHeight / 2;
        const metrics = ctx.measureText(line);
        const textWidth = metrics.width;
        const padding = 30;
        
        const x = (canvas.width - textWidth) / 2 - padding;
        const w = textWidth + padding * 2;
        const h = lineHeight;
        const radius = 15;
        
        ctx.beginPath();
        ctx.moveTo(x + radius, y - h/2);
        ctx.lineTo(x + w - radius, y - h/2);
        ctx.quadraticCurveTo(x + w, y - h/2, x + w, y - h/2 + radius);
        ctx.lineTo(x + w, y + h/2 - radius);
        ctx.quadraticCurveTo(x + w, y + h/2, x + w - radius, y + h/2);
        ctx.lineTo(x + radius, y + h/2);
        ctx.quadraticCurveTo(x, y + h/2, x, y + h/2 - radius);
        ctx.lineTo(x, y - h/2 + radius);
        ctx.quadraticCurveTo(x, y - h/2, x + radius, y - h/2);
        ctx.closePath();
        
        ctx.fill();
        ctx.stroke();
    });
    
    lines.forEach((line, i) => {
        const y = startY + i * lineHeight + lineHeight / 2;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillText(line, canvas.width / 2 + 2, y + 2);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(line, canvas.width / 2, y);
    });
    
    subtitleTexture.needsUpdate = true;
    subtitleSprite.visible = true;
}

function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    }
    if (currentLine) lines.push(currentLine);
    
    return lines;
}

function updateSubtitlesForCurrentTime() {
    const scenes = AppState.animationData?.scenes;
    if (!scenes) return;
    
    const currentScene = AppState.three.currentScene;
    const sceneData = AppState.scenes[currentScene];
    
    if (sceneData && sceneData.hindiText) {
        updateSubtitle(sceneData.hindiText);
    } else {
        updateSubtitle('');
    }
}

// ========================================
// Background Music Generator
// ========================================
async function generateBackgroundMusic() {
    const ctx = AppState.audio.audioContext;
    if (!ctx) return;
    
    try {
        const duration = 30;
        const sampleRate = ctx.sampleRate;
        const buffer = ctx.createBuffer(2, sampleRate * duration, sampleRate);
        
        const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
        const pattern = [0, 2, 4, 5, 4, 2, 0, -1];
        
        for (let channel = 0; channel < 2; channel++) {
            const data = buffer.getChannelData(channel);
            
            for (let i = 0; i < buffer.length; i++) {
                const t = i / sampleRate;
                let sample = 0;
                
                const noteIndex = Math.floor(t * 2) % pattern.length;
                const noteFreq = notes[pattern[noteIndex] + 12];
                const bassFreq = notes[pattern[noteIndex]];
                
                sample += Math.sin(2 * Math.PI * noteFreq * t) * 0.1;
                sample += Math.sin(2 * Math.PI * bassFreq * t) * 0.05;
                sample += Math.sin(2 * Math.PI * (bassFreq * 2) * t) * 0.03;
                sample += Math.sin(2 * Math.PI * (bassFreq * 3) * t) * 0.02;
                
                const measure = Math.floor(t * 2) % 8;
                const measurePos = (t * 2) % 1;
                let env = 0.3;
                if (measurePos < 0.1) env *= measurePos * 10;
                else if (measurePos > 0.8) env *= (1 - measurePos) * 5;
                
                data[i] = sample * env;
            }
        }
        
        AppState.audio.backgroundMusic = {
            buffer,
            source: null,
            gain: ctx.createGain()
        };
        
        AppState.audio.backgroundMusic.gain.gain.value = 0.15;
        AppState.audio.backgroundMusic.gain.connect(ctx.destination);
        
        console.log('Background music generated');
    } catch (e) {
        console.warn('Background music generation failed:', e);
    }
}

function playBackgroundMusic() {
    const music = AppState.audio.backgroundMusic;
    const ctx = AppState.audio.audioContext;
    if (!music || !ctx || music.source) return;
    
    music.source = ctx.createBufferSource();
    music.source.buffer = music.buffer;
    music.source.loop = true;
    music.source.connect(music.gain);
    music.source.start();
}

function stopBackgroundMusic() {
    const music = AppState.audio.backgroundMusic;
    if (music && music.source) {
        music.source.stop();
        music.source = null;
    }
}

function setBackgroundMusicVolume(volume) {
    const music = AppState.audio.backgroundMusic;
    if (music && music.gain) {
        music.gain.gain.value = AppState.muted ? 0 : volume * 0.15;
    }
}

// ========================================
// Audio System (Web Speech API + Web Audio)
// ========================================
async function initAudio() {
    AppState.audio.synth = window.speechSynthesis;
    
    const loadVoices = () => {
        AppState.audio.voices = AppState.audio.synth.getVoices();
        AppState.audio.hindiVoice = AppState.audio.voices.find(v => 
            v.lang.includes('hi') || v.lang.includes('Hindi') || v.name.includes('Hindi')
        ) || AppState.audio.voices.find(v => v.lang.includes('en')) || AppState.audio.voices[0];
        console.log('Hindi voice:', AppState.audio.hindiVoice?.name);
    };
    
    loadVoices();
    AppState.audio.synth.onvoiceschanged = loadVoices;
    
    try {
        AppState.audio.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        await generateSoundEffects();
    } catch (e) {
        console.warn('Web Audio API not available:', e);
    }
    
    document.addEventListener('click', () => {
        if (AppState.audio.audioContext?.state === 'suspended') {
            AppState.audio.audioContext.resume();
        }
    }, { once: true });
}

function speakHindi(text, options = {}) {
    if (!AppState.audio.synth || !AppState.audio.hindiVoice) return Promise.resolve();
    
    return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = AppState.audio.hindiVoice;
        utterance.lang = 'hi-IN';
        utterance.rate = options.rate || 0.9;
        utterance.pitch = options.pitch || 1;
        utterance.volume = AppState.muted ? 0 : AppState.volume;
        utterance.onend = resolve;
        utterance.onerror = resolve;
        
        AppState.audio.synth.speak(utterance);
    });
}

function stopSpeech() {
    if (AppState.audio.synth) {
        AppState.audio.synth.cancel();
    }
}

async function generateSoundEffects() {
    const ctx = AppState.audio.audioContext;
    if (!ctx) return;
    
    const createTone = (freq, duration, type = 'sine', volume = 0.3) => {
        const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < buffer.length; i++) {
            const t = i / ctx.sampleRate;
            let sample = 0;
            switch (type) {
                case 'sine': sample = Math.sin(2 * Math.PI * freq * t); break;
                case 'square': sample = Math.sign(Math.sin(2 * Math.PI * freq * t)); break;
                case 'noise': sample = (Math.random() * 2 - 1); break;
            }
            const attack = 0.01;
            const release = 0.1;
            let env = 1;
            if (t < attack) env = t / attack;
            else if (t > duration - release) env = (duration - t) / release;
            data[i] = sample * env * volume;
        }
        return buffer;
    };
    
    AppState.audio.soundEffects = {
        click: createTone(800, 0.1, 'sine', 0.2),
        transition: createTone(400, 0.3, 'sine', 0.15),
        pop: createTone(600, 0.15, 'square', 0.2),
        whoosh: createTone(200, 0.5, 'noise', 0.1),
        success: createTone(523, 0.2, 'sine', 0.3)
    };
}

function playSoundEffect(name) {
    const ctx = AppState.audio.audioContext;
    const buffer = AppState.audio.soundEffects[name];
    if (!ctx || !buffer) return;
    
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.value = AppState.muted ? 0 : AppState.volume * 0.5;
    source.connect(gain).connect(ctx.destination);
    source.start();
}

async function playSceneAudio(sceneIndex) {
    const scene = AppState.scenes[sceneIndex];
    if (!scene || !scene.hindiText) return;
    
    stopSpeech();
    await speakHindi(scene.hindiText, { rate: 0.85 });
}

// ========================================
// Animation Timeline & Playback
// ========================================
function buildAnimationTimeline() {
    const settings = AppState.settings;
    const scenes = AppState.scenes;
    
    AppState.duration = scenes.reduce((sum, s) => sum + s.duration, 0);
    AppState.animationData = {
        scenes: scenes.map((s, i) => ({
            index: i,
            startTime: scenes.slice(0, i).reduce((sum, s) => sum + s.duration, 0),
            duration: s.duration,
            transitionDuration: 1.5
        })),
        totalDuration: AppState.duration
    };
    
    updateTimeDisplay();
    buildScene(0);
    $('#canvasOverlay').classList.add('hidden');
    
    scenes.forEach((_, i) => {
        if (i > 0) setTimeout(() => buildScene(i), i * 100);
    });
}

function updateTimeDisplay() {
    $('#timeDisplay').textContent = `${formatTime(AppState.currentTime)} / ${formatTime(AppState.duration)}`;
    const progress = AppState.duration > 0 ? (AppState.currentTime / AppState.duration) * 100 : 0;
    $('#timelineProgress').style.width = `${progress}%`;
    $('#timelineHandle').style.left = `${progress}%`;
}

function playAnimation() {
    if (AppState.isPlaying) return;
    AppState.isPlaying = true;
    $('#playPauseBtn .icon-play').style.display = 'none';
    $('#playPauseBtn .icon-pause').style.display = 'block';
    
    playBackgroundMusic();
    playSceneAudio(AppState.three.currentScene);
    
    animateLoop();
}

function pauseAnimation() {
    AppState.isPlaying = false;
    $('#playPauseBtn .icon-play').style.display = 'block';
    $('#playPauseBtn .icon-pause').style.display = 'none';
    
    if (AppState.audio.synth) {
        AppState.audio.synth.pause();
    }
    
    stopBackgroundMusic();
}

function stopAnimation() {
    pauseAnimation();
    AppState.currentTime = 0;
    AppState.three.currentScene = 0;
    AppState.three.transitionProgress = 0;
    AppState.three.isTransitioning = false;
    updateTimeDisplay();
    showScene(0);
    updateSubtitle('');
}

function restartAnimation() {
    stopAnimation();
    playAnimation();
}

function animateLoop() {
    if (!AppState.isPlaying) return;
    
    const delta = 1 / 60 * AppState.settings.animationSpeed;
    AppState.currentTime += delta;
    
    checkSceneTransition();
    updateTimeDisplay();
    
    if (AppState.currentTime >= AppState.duration) {
        stopAnimation();
    }
    
    requestAnimationFrame(animateLoop);
}

function checkSceneTransition() {
    const scenes = AppState.animationData.scenes;
    const currentScene = AppState.three.currentScene;
    
    if (currentScene >= scenes.length - 1) return;
    
    const currentSceneData = scenes[currentScene];
    const nextSceneStart = currentSceneData.startTime + currentSceneData.duration;
    const transitionStart = nextSceneStart - currentSceneData.transitionDuration;
    
    if (AppState.currentTime >= transitionStart && !AppState.three.isTransitioning) {
        startTransition(currentScene + 1);
    }
}

function startTransition(nextSceneIndex) {
    if (nextSceneIndex >= AppState.scenes.length) return;
    
    AppState.three.isTransitioning = true;
    AppState.three.nextScene = nextSceneIndex;
    AppState.three.transitionProgress = 0;
    
    if (!AppState.three.backgrounds[nextSceneIndex]) {
        buildScene(nextSceneIndex);
    }
    
    playSoundEffect('transition');
    
    setTimeout(() => {
        playSceneAudio(nextSceneIndex);
    }, 1500 / AppState.settings.animationSpeed);
}

function showScene(sceneIndex) {
    AppState.three.backgrounds.forEach((bg, i) => {
        if (bg && bg.group) bg.group.visible = i === sceneIndex;
    });
    AppState.three.characters.forEach(char => {
        if (char.mesh) char.mesh.visible = char.sceneIndex === sceneIndex;
    });
    AppState.three.characters3d.forEach(char => {
        if (char.character3d) char.character3d.group.visible = char.sceneIndex === sceneIndex;
    });
    
    AppState.three.currentScene = sceneIndex;
}

function seekAnimation(time) {
    AppState.currentTime = Math.max(0, Math.min(time, AppState.duration));
    
    const scenes = AppState.animationData.scenes;
    let newScene = 0;
    for (let i = 0; i < scenes.length; i++) {
        if (AppState.currentTime >= scenes[i].startTime && AppState.currentTime < scenes[i].startTime + scenes[i].duration) {
            newScene = i;
            break;
        }
    }
    
    if (newScene !== AppState.three.currentScene && !AppState.three.isTransitioning) {
        showScene(newScene);
    }
    
    updateTimeDisplay();
}

// ========================================
// Video Export
// ========================================
async function startExport() {
    if (AppState.export.isExporting) return;
    
    const settings = AppState.exportSettings;
    const canvas = $('#previewCanvas');
    
    let width, height;
    switch (settings.resolution) {
        case '1080p': [width, height] = [1920, 1080]; break;
        case '4k': [width, height] = [3840, 2160]; break;
        case '720p':
        default: [width, height] = [1280, 720]; break;
    }
    
    const [arW, arH] = AppState.settings.aspectRatio.split(':').map(Number);
    const targetAspect = arW / arH;
    const currentAspect = width / height;
    
    if (Math.abs(targetAspect - currentAspect) > 0.01) {
        height = Math.round(width / targetAspect);
    }
    
    AppState.export.totalFrames = Math.ceil(AppState.duration * settings.framerate);
    AppState.export.renderedFrames = 0;
    AppState.export.isExporting = true;
    
    $('#exportActions').style.display = 'none';
    $('#exportProgress').style.display = 'block';
    $('#framesRendered').textContent = '0';
    $('#totalFrames').textContent = AppState.export.totalFrames;
    $('#progressPercent').textContent = '0%';
    $('#progressStatus').textContent = 'रेंडर हो रहा है...';
    
    const stream = canvas.captureStream(settings.framerate);
    
    const mimeType = settings.format === 'mp4' ? 'video/mp4' : 'video/webm;codecs=vp9';
    let recorder;
    
    try {
        recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 10000000 });
    } catch (e) {
        recorder = new MediaRecorder(stream);
    }
    
    AppState.export.mediaRecorder = recorder;
    AppState.export.recordedChunks = [];
    AppState.export.stream = stream;
    
    recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
            AppState.export.recordedChunks.push(e.data);
        }
    };
    
    recorder.onstop = () => {
        finalizeExport();
    };
    
    recorder.start(100);
    
    AppState.export.startTime = performance.now();
    await renderExportFrames(width, height, settings.framerate);
}

async function renderExportFrames(width, height, framerate) {
    const { scene, camera, renderer, composer } = AppState.three;
    const totalFrames = AppState.export.totalFrames;
    const frameTime = 1 / framerate;
    
    const originalSize = { width: renderer.domElement.width, height: renderer.domElement.height };
    const originalPixelRatio = renderer.getPixelRatio();
    
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(1);
    camera.left = camera.left * (width / originalSize.width);
    camera.right = camera.right * (width / originalSize.width);
    camera.top = camera.top * (height / originalSize.height);
    camera.bottom = camera.bottom * (height / originalSize.height);
    camera.updateProjectionMatrix();
    composer.setSize(width, height);
    
    AppState.currentTime = 0;
    AppState.three.currentScene = 0;
    AppState.three.isTransitioning = false;
    showScene(0);
    
    for (let frame = 0; frame < totalFrames; frame++) {
        if (!AppState.export.isExporting) break;
        
        const time = frame * frameTime;
        AppState.currentTime = time;
        
        checkSceneTransitionExport(time);
        
        animateObjectsExport(time);
        updateCameraMovementExport(time);
        
        const scenes = AppState.animationData?.scenes;
        if (scenes) {
            const currentScene = AppState.three.currentScene;
            const sceneData = AppState.scenes[currentScene];
            if (sceneData && sceneData.hindiText) {
                updateSubtitle(sceneData.hindiText);
            } else {
                updateSubtitle('');
            }
        }
        
        composer.render();
        
        AppState.export.renderedFrames = frame + 1;
        const percent = Math.round(((frame + 1) / totalFrames) * 100);
        $('#progressPercent').textContent = `${percent}%`;
        $('#framesRendered').textContent = frame + 1;
        
        const elapsed = (performance.now() - AppState.export.startTime) / 1000;
        const remaining = elapsed / (frame + 1) * (totalFrames - frame - 1);
        $('#timeRemaining').textContent = formatTime(remaining);
        
        if (frame % 5 === 0) {
            await new Promise(r => setTimeout(r, 0));
        }
    }
    
    updateSubtitle('');
    
    if (AppState.export.mediaRecorder && AppState.export.mediaRecorder.state !== 'inactive') {
        AppState.export.mediaRecorder.stop();
    }
    
    renderer.setSize(originalSize.width, originalSize.height, false);
    renderer.setPixelRatio(originalPixelRatio);
    camera.left = camera.left * (originalSize.width / width);
    camera.right = camera.right * (originalSize.width / width);
    camera.top = camera.top * (originalSize.height / height);
    camera.bottom = camera.bottom * (originalSize.height / height);
    camera.updateProjectionMatrix();
    composer.setSize(originalSize.width, originalSize.height);
    
    AppState.currentTime = 0;
    showScene(0);
}

function checkSceneTransitionExport(time) {
    const scenes = AppState.animationData.scenes;
    const currentScene = AppState.three.currentScene;
    
    if (currentScene >= scenes.length - 1) return;
    
    const currentSceneData = scenes[currentScene];
    const nextSceneStart = currentSceneData.startTime + currentSceneData.duration;
    
    if (time >= nextSceneStart && !AppState.three.isTransitioning) {
        AppState.three.currentScene++;
        showScene(AppState.three.currentScene);
    }
}

function animateObjectsExport(time) {
    const { characters, characters3d, backgrounds } = AppState.three;
    
    // Update 3D characters
    characters3d.forEach(char => {
        if (char.character3d && char.character3d.mixer) {
            // Use fixed delta for export
            char.character3d.update(1/30);
        }
    });
    
    // Update legacy paper-cutout characters
    characters.forEach(char => {
        if (!char.mesh || !char.template) return;
        
        const animType = char.animation || 'idle';
        const animParts = char.template.animations[animType] || [];
        
        animParts.forEach(partName => {
            const part = char.parts.find(p => p.name === partName);
            if (!part || !part.mesh) return;
            
            const baseOffset = part.offset || [0, 0, 0];
            const baseRotation = part.rotation || 0;
            
            switch (animType) {
                case 'idle':
                    part.mesh.position.y = baseOffset[1] + Math.sin(time * 2 + part.phase) * 0.03;
                    part.mesh.rotation.z = baseRotation + Math.sin(time * 1.5 + part.phase) * 0.05;
                    break;
                case 'walk':
                    part.mesh.position.x = baseOffset[0] + Math.sin(time * 4 + part.phase) * 0.1;
                    part.mesh.rotation.z = baseRotation + Math.sin(time * 4 + part.phase) * 0.15;
                    break;
                case 'float':
                    part.mesh.position.x = baseOffset[0] + Math.sin(time * 0.5 + part.phase) * 0.2;
                    part.mesh.position.y = baseOffset[1] + Math.cos(time * 0.7 + part.phase) * 0.1;
                    break;
            }
        });
    });
    
    backgrounds.forEach(bg => {
        if (!bg.mesh || !bg.animData) return;
        bg.animData.parts.forEach(part => {
            if (!part.mesh) return;
            const baseOffset = part.offset || [0, 0, 0];
            part.mesh.position.y = baseOffset[1] + Math.sin(time * 1.5 + part.phase) * 0.02;
        });
    });
}

function updateCameraMovementExport(time) {
    const { camera, cameraControls } = AppState.three;
    
    if (!camera) return;
    
    const speed = cameraControls.speed * 0.5;
    
    switch (cameraControls.movement) {
        case 'orbit':
            const orbitRadius = cameraControls.distance;
            const orbitAngle = time * speed;
            camera.position.x = cameraControls.lookAt.x + Math.sin(orbitAngle) * orbitRadius;
            camera.position.z = cameraControls.lookAt.z + Math.cos(orbitAngle) * orbitRadius;
            camera.position.y = cameraControls.height + Math.sin(time * speed * 0.5) * 1;
            break;
        case 'dolly':
            const dollyDist = cameraControls.distance + Math.sin(time * speed * 0.3) * 3;
            const dollyAngle = THREE.MathUtils.degToRad(cameraControls.angle);
            camera.position.x = cameraControls.lookAt.x + Math.sin(dollyAngle) * dollyDist;
            camera.position.z = cameraControls.lookAt.z + Math.cos(dollyAngle) * dollyDist;
            camera.position.y = cameraControls.height;
            break;
        case 'crane':
            camera.position.x = cameraControls.lookAt.x + Math.sin(time * speed * 0.2) * 2;
            camera.position.y = cameraControls.height + Math.sin(time * speed * 0.4) * 5;
            camera.position.z = cameraControls.lookAt.z + cameraControls.distance;
            break;
        case 'handheld':
            camera.position.x = cameraControls.lookAt.x + Math.sin(time * speed * 5) * 0.1 + Math.sin(time * speed * 7) * 0.05;
            camera.position.y = cameraControls.height + Math.cos(time * speed * 3) * 0.1 + Math.cos(time * speed * 11) * 0.05;
            camera.position.z = cameraControls.lookAt.z + cameraControls.distance + Math.sin(time * speed * 2) * 0.1;
            break;
        case 'tracking':
            camera.position.x = cameraControls.lookAt.x + Math.sin(time * speed) * 10;
            camera.position.y = cameraControls.height;
            camera.position.z = cameraControls.lookAt.z + cameraControls.distance;
            break;
        case 'static':
        default:
            const angleRad = THREE.MathUtils.degToRad(cameraControls.angle);
            camera.position.x = cameraControls.lookAt.x + Math.sin(angleRad) * cameraControls.distance;
            camera.position.y = cameraControls.height;
            camera.position.z = cameraControls.lookAt.z + Math.cos(angleRad) * cameraControls.distance;
            break;
    }
    
    camera.lookAt(cameraControls.lookAt);
}

function finalizeExport() {
    const blob = new Blob(AppState.export.recordedChunks, { 
        type: AppState.exportSettings.format === 'mp4' ? 'video/mp4' : 'video/webm' 
    });
    
    const url = URL.createObjectURL(blob);
    const video = $('#exportedVideo');
    video.src = url;
    
    AppState.export.videoBlob = blob;
    AppState.export.videoUrl = url;
    
    $('#exportProgress').style.display = 'none';
    $('#exportResult').style.display = 'block';
    $('#exportActions').style.display = 'none';
    
    AppState.export.isExporting = false;
    
    showToast('वीडियो सफलतापूर्वक बन गया!', 'success');
}

function downloadVideo() {
    if (!AppState.export.videoBlob) return;
    
    const a = document.createElement('a');
    a.href = AppState.export.videoUrl;
    a.download = `paper-animation-${Date.now()}.${AppState.exportSettings.format === 'mp4' ? 'mp4' : 'webm'}`;
    a.click();
    
    showToast('डाउनलोड शुरू हो गया', 'success');
}

async function shareVideo() {
    if (!AppState.export.videoBlob) return;
    
    try {
        const file = new File([AppState.export.videoBlob], `paper-animation.${AppState.exportSettings.format === 'mp4' ? 'mp4' : 'webm'}`, {
            type: AppState.exportSettings.format === 'mp4' ? 'video/mp4' : 'video/webm'
        });
        
        if (navigator.share && navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], title: 'मेरा पेपर एनिमेशन वीडियो' });
        } else {
            showToast('शेयर करने के लिए वीडियो डाउनलोड करें', 'info');
        }
    } catch (e) {
        console.error('Share failed:', e);
        showToast('शेयर नहीं कर सके', 'error');
    }
}

// ========================================
// Professional 3D Controls Helpers
// ========================================

function switchProTab(tabName) {
    $$('.pro-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.proTab === tabName);
    });
    $$('.pro-tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === `pro-tab-${tabName}`);
    });
    
    // Load scene controls when scene tab is selected
    if (tabName === 'scene') {
        populateSceneSelector();
    }
    
    // Load asset library when assets tab is selected
    if (tabName === 'assets') {
        loadAssetLibrary();
    }
}

// Asset Library state
let currentAssetSearch = '';
let currentAssetCategory = 'all';
let selectedAssetId = null;
let selectedAssetInstanceId = null;

function initializeAssetLibrary() {
    // Populate category dropdown
    const categorySelect = $('#assetCategory');
    if (categorySelect) {
        ASSET_CATEGORIES.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            categorySelect.appendChild(option);
        });
    }
    
    // Search input
    const searchInput = $('#assetSearch');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => {
            currentAssetSearch = searchInput.value.toLowerCase();
            loadAssetLibrary();
        }, 300));
    }
    
    // Category select
    if (categorySelect) {
        categorySelect.addEventListener('change', () => {
            currentAssetCategory = categorySelect.value;
            loadAssetLibrary();
        });
    }
    
    // Transform controls
    ['X', 'Y', 'Z'].forEach(axis => {
        const slider = $('#assetPos' + axis);
        const valEl = $('#assetPos' + axis + 'Val');
        if (slider && valEl) {
            slider.addEventListener('input', () => {
                valEl.textContent = parseFloat(slider.value).toFixed(1);
                updateSelectedAssetTransform();
            });
        }
    });
    
    const rotSlider = $('#assetRotY');
    const rotVal = $('#assetRotYVal');
    if (rotSlider && rotVal) {
        rotSlider.addEventListener('input', () => {
            rotVal.textContent = rotSlider.value;
            updateSelectedAssetTransform();
        });
    }
    
    const scaleSlider = $('#assetScale');
    const scaleVal = $('#assetScaleVal');
    if (scaleSlider && scaleVal) {
        scaleSlider.addEventListener('input', () => {
            scaleVal.textContent = parseFloat(scaleSlider.value).toFixed(1);
            updateSelectedAssetTransform();
        });
    }
    
    // Add/Remove buttons
    const addBtn = $('#addAssetToScene');
    const removeBtn = $('#removeAssetFromScene');
    if (addBtn) addBtn.addEventListener('click', addSelectedAssetToScene);
    if (removeBtn) removeBtn.addEventListener('click', removeSelectedAssetFromScene);
}

function loadAssetLibrary() {
    const grid = $('#assetGrid');
    if (!grid) return;
    
    // Filter assets
    let assets = ALL_ASSETS;
    
    if (currentAssetCategory !== 'all') {
        assets = assets.filter(a => a.category === currentAssetCategory);
    }
    
    if (currentAssetSearch) {
        assets = assets.filter(a => 
            a.name.toLowerCase().includes(currentAssetSearch) ||
            a.id.toLowerCase().includes(currentAssetSearch)
        );
    }
    
    // Render grid
    grid.innerHTML = '';
    assets.forEach(asset => {
        const item = document.createElement('div');
        item.className = 'asset-item' + (selectedAssetId === asset.id ? ' selected' : '');
        item.dataset.assetId = asset.id;
        item.innerHTML = `
            <div class="asset-preview">${getAssetIcon(asset.category)}</div>
            <div class="asset-name">${asset.name}</div>
        `;
        item.addEventListener('click', () => selectAsset(asset.id));
        grid.appendChild(item);
    });
    
    // If selected asset is no longer in filtered list, clear selection
    if (selectedAssetId && !assets.find(a => a.id === selectedAssetId)) {
        clearAssetSelection();
    }
}

function getAssetIcon(category) {
    const cat = ASSET_CATEGORIES.find(c => c.id === category);
    return cat ? cat.icon : '📦';
}

function selectAsset(assetId) {
    selectedAssetId = assetId;
    const asset = assetLibrary.getAsset(assetId);
    
    if (!asset) return;
    
    // Update UI
    $$('#assetGrid .asset-item').forEach(item => {
        item.classList.toggle('selected', item.dataset.assetId === assetId);
    });
    
    // Show asset info
    const info = $('#selectedAssetInfo');
    const nameEl = $('#selectedAssetName');
    if (info && nameEl) {
        info.style.display = 'block';
        nameEl.textContent = asset.name;
    }
    
    // Check if this asset is already in the scene
    const assetManager = AppState.three.assetManager;
    if (assetManager) {
        const instances = assetManager.getAllAssets();
        const existing = instances.find(inst => inst.assetId === assetId);
        if (existing) {
            selectedAssetInstanceId = existing.instanceId;
            loadAssetTransform(existing);
            const removeBtn = $('#removeAssetFromScene');
            const addBtn = $('#addAssetToScene');
            if (removeBtn) removeBtn.style.display = 'inline-block';
            if (addBtn) addBtn.textContent = 'अपडेट करें';
        } else {
            selectedAssetInstanceId = null;
            resetAssetTransform();
            const removeBtn = $('#removeAssetFromScene');
            const addBtn = $('#addAssetToScene');
            if (removeBtn) removeBtn.style.display = 'none';
            if (addBtn) addBtn.textContent = 'सीन में जोड़ें';
        }
    }
}

function clearAssetSelection() {
    selectedAssetId = null;
    selectedAssetInstanceId = null;
    $$('#assetGrid .asset-item').forEach(item => item.classList.remove('selected'));
    const info = $('#selectedAssetInfo');
    if (info) info.style.display = 'none';
}

function loadAssetTransform(data) {
    const asset = data.asset;
    $('#assetPosX').value = asset.position.x.toFixed(1);
    $('#assetPosXVal').textContent = asset.position.x.toFixed(1);
    $('#assetPosY').value = asset.position.y.toFixed(1);
    $('#assetPosYVal').textContent = asset.position.y.toFixed(1);
    $('#assetPosZ').value = asset.position.z.toFixed(1);
    $('#assetPosZVal').textContent = asset.position.z.toFixed(1);
    $('#assetRotY').value = THREE.MathUtils.radToDeg(asset.rotation.y).toFixed(0);
    $('#assetRotYVal').textContent = THREE.MathUtils.radToDeg(asset.rotation.y).toFixed(0);
    $('#assetScale').value = asset.scale.x.toFixed(1);
    $('#assetScaleVal').textContent = asset.scale.x.toFixed(1);
}

function resetAssetTransform() {
    $('#assetPosX').value = 0;
    $('#assetPosXVal').textContent = '0';
    $('#assetPosY').value = 0;
    $('#assetPosYVal').textContent = '0';
    $('#assetPosZ').value = 0;
    $('#assetPosZVal').textContent = '0';
    $('#assetRotY').value = 0;
    $('#assetRotYVal').textContent = '0';
    $('#assetScale').value = 1.0;
    $('#assetScaleVal').textContent = '1.0';
}

function updateSelectedAssetTransform() {
    if (!selectedAssetInstanceId) return;
    
    const assetManager = AppState.three.assetManager;
    if (!assetManager) return;
    
    const data = assetManager.getAsset(selectedAssetInstanceId);
    if (!data) return;
    
    const position = new AppState.three.THREE.Vector3(
        parseFloat($('#assetPosX').value),
        parseFloat($('#assetPosY').value),
        parseFloat($('#assetPosZ').value)
    );
    const rotation = new AppState.three.THREE.Euler(
        0,
        AppState.three.THREE.MathUtils.degToRad(parseFloat($('#assetRotY').value)),
        0
    );
    const scale = new AppState.three.THREE.Vector3(
        parseFloat($('#assetScale').value),
        parseFloat($('#assetScale').value),
        parseFloat($('#assetScale').value)
    );
    
    assetManager.updateAsset(selectedAssetInstanceId, { position, rotation, scale });
}

function addSelectedAssetToScene() {
    if (!selectedAssetId) return;
    
    const assetManager = AppState.three.assetManager;
    if (!assetManager) return;
    
    const position = new AppState.three.THREE.Vector3(
        parseFloat($('#assetPosX').value),
        parseFloat($('#assetPosY').value),
        parseFloat($('#assetPosZ').value)
    );
    const rotation = new AppState.three.THREE.Euler(
        0,
        AppState.three.THREE.MathUtils.degToRad(parseFloat($('#assetRotY').value)),
        0
    );
    const scale = new AppState.three.THREE.Vector3(
        parseFloat($('#assetScale').value),
        parseFloat($('#assetScale').value),
        parseFloat($('#assetScale').value)
    );
    
    if (selectedAssetInstanceId) {
        // Update existing
        assetManager.updateAsset(selectedAssetInstanceId, { position, rotation, scale });
        showToast('एसेट अपडेट किया गया', 'success');
    } else {
        // Add new
        const instanceId = assetManager.addAsset(selectedAssetId, { position, rotation, scale });
        if (instanceId) {
            selectedAssetInstanceId = instanceId;
            const removeBtn = $('#removeAssetFromScene');
            const addBtn = $('#addAssetToScene');
            if (removeBtn) removeBtn.style.display = 'inline-block';
            if (addBtn) addBtn.textContent = 'अपडेट करें';
            showToast('एसेट सीन में जोड़ा गया', 'success');
        }
    }
}

function removeSelectedAssetFromScene() {
    if (!selectedAssetInstanceId) return;
    
    const assetManager = AppState.three.assetManager;
    if (!assetManager) return;
    
    assetManager.removeAsset(selectedAssetInstanceId);
    selectedAssetInstanceId = null;
    resetAssetTransform();
    
    const removeBtn = $('#removeAssetFromScene');
    const addBtn = $('#addAssetToScene');
    if (removeBtn) removeBtn.style.display = 'none';
    if (addBtn) addBtn.textContent = 'सीन में जोड़ें';
    
    showToast('एसेट हटाया गया', 'success');
}

// ========================================
// Keyframe Animation Editor
// ========================================

let keyframeState = {
    selectedCharacter: null,
    selectedAnimation: 'custom',
    currentTime: 0,
    duration: 2,
    isPlaying: false,
    keyframes: {}, // trackName -> array of keyframes
    selectedKeyframe: null,
    animationId: null
};

function initializeKeyframeEditor() {
    // Character select
    const charSelect = $('#keyframeCharacter');
    if (charSelect) {
        charSelect.addEventListener('change', () => {
            keyframeState.selectedCharacter = charSelect.value;
            updateKeyframeTracks();
        });
    }
    
    // Animation select
    const animSelect = $('#keyframeAnimation');
    if (animSelect) {
        // Populate with preset animations
        const presets = ['custom', 'idle', 'walk', 'run', 'talk', 'sit', 'wave', 'point', 'nod', 'shakeHead', 'jump'];
        presets.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name.charAt(0).toUpperCase() + name.slice(1);
            animSelect.appendChild(option);
        });
        
        animSelect.addEventListener('change', () => {
            keyframeState.selectedAnimation = animSelect.value;
            if (animSelect.value !== 'custom') {
                loadPresetAnimation(animSelect.value);
            } else {
                clearKeyframes();
            }
        });
    }
    
    // Timeline click to add keyframe
    const timeline = $('#keyframeTimeline');
    if (timeline) {
        timeline.addEventListener('click', (e) => {
            if (e.target.classList.contains('keyframe-marker')) return;
            const rect = timeline.getBoundingClientRect();
            const x = e.clientX - rect.left - 80; // Account for track header
            if (x < 0) return;
            const time = (x / (rect.width - 80)) * keyframeState.duration;
            addKeyframeAtTime(time);
        });
    }
    
    // Duration slider
    const durationSlider = $('#kfTime');
    const durationVal = $('#kfTimeVal');
    if (durationSlider && durationVal) {
        durationSlider.addEventListener('input', () => {
            durationVal.textContent = parseFloat(durationSlider.value).toFixed(2);
        });
    }
    
    // Control buttons
    const addBtn = $('#keyframeAdd');
    const delBtn = $('#keyframeDelete');
    const playBtn = $('#keyframePlay');
    const stopBtn = $('#keyframeStop');
    
    if (addBtn) addBtn.addEventListener('click', () => addKeyframeAtTime(keyframeState.currentTime));
    if (delBtn) delBtn.addEventListener('click', deleteSelectedKeyframe);
    if (playBtn) playBtn.addEventListener('click', playKeyframeAnimation);
    if (stopBtn) stopBtn.addEventListener('click', stopKeyframeAnimation);
    
    // Pose textarea
    const poseInput = $('#kfPose');
    if (poseInput) {
        poseInput.addEventListener('change', updateSelectedKeyframePose);
    }
    
    // Easing select
    const easingSelect = $('#kfEasing');
    if (easingSelect) {
        easingSelect.addEventListener('change', updateSelectedKeyframeEasing);
    }
    
    // Populate character list
    updateKeyframeCharacterList();
}

function updateKeyframeCharacterList() {
    const select = $('#keyframeCharacter');
    if (!select) return;
    
    const currentValue = select.value;
    select.innerHTML = '<option value="">पात्र चुनें</option>';
    
    // Add 3D characters from current scene
    const sceneIndex = AppState.three.currentScene;
    const scene = AppState.scenes[sceneIndex];
    if (scene && scene.characters3d) {
        scene.characters3d.forEach((char, i) => {
            const option = document.createElement('option');
            option.value = `char3d_${sceneIndex}_${i}`;
            option.textContent = `${scene.characters[i]} (3D)`;
            select.appendChild(option);
        });
    }
    
    // Add legacy characters
    const chars3d = AppState.three.characters3d.filter(c => c.sceneIndex === sceneIndex);
    chars3d.forEach((char, i) => {
        const option = document.createElement('option');
        option.value = char.sceneIndex + '_' + char.charIndex;
        option.textContent = `${scene?.characters[i] || 'Character'} (3D)`;
        select.appendChild(option);
    });
    
    if (currentValue) select.value = currentValue;
}

function updateKeyframeTracks() {
    const tracksContainer = $('#keyframeTracks');
    const ruler = $('#keyframeRuler');
    if (!tracksContainer || !ruler) return;
    
    // Build ruler
    const ticks = Math.ceil(keyframeState.duration);
    ruler.innerHTML = '';
    for (let i = 0; i <= ticks; i++) {
        const tick = document.createElement('div');
        tick.className = 'tick' + (i % 1 === 0 ? ' major' : '');
        tick.style.left = `${80 + (i / ticks) * (tracksContainer.parentElement.clientWidth - 80)}px`;
        if (i % 1 === 0) {
            const label = document.createElement('span');
            label.className = 'tick-label';
            label.style.left = tick.style.left;
            label.textContent = `${i}s`;
            ruler.appendChild(label);
        }
        ruler.appendChild(tick);
    }
    
    // Build tracks for selected character
    if (!keyframeState.selectedCharacter) {
        tracksContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-muted);">पात्र चुनें</div>';
        return;
    }
    
    const trackNames = ['position', 'rotation', 'scale'];
    tracksContainer.innerHTML = '';
    
    trackNames.forEach(trackName => {
        const track = document.createElement('div');
        track.className = 'keyframe-track';
        track.dataset.track = trackName;
        
        const header = document.createElement('div');
        header.className = 'keyframe-track-header';
        header.textContent = trackName;
        track.appendChild(header);
        
        const content = document.createElement('div');
        content.className = 'keyframe-track-content';
        track.appendChild(content);
        
        // Render keyframes for this track
        const keyframes = keyframeState.keyframes[trackName] || [];
        keyframes.forEach((kf, idx) => {
            const marker = document.createElement('div');
            marker.className = 'keyframe-marker' + (keyframeState.selectedKeyframe === `${trackName}_${idx}` ? ' selected' : '');
            marker.dataset.track = trackName;
            marker.dataset.index = idx;
            const xPos = 80 + (kf.time / keyframeState.duration) * (tracksContainer.parentElement.clientWidth - 80);
            marker.style.left = `${xPos}px`;
            marker.innerHTML = `<span class="keyframe-value">${kf.time.toFixed(2)}s</span>`;
            marker.addEventListener('click', (e) => {
                e.stopPropagation();
                selectKeyframe(trackName, idx);
            });
            marker.addEventListener('mousedown', (e) => startDragKeyframe(e, trackName, idx));
            content.appendChild(marker);
        });
        
        tracksContainer.appendChild(track);
    });
}

function selectKeyframe(trackName, index) {
    keyframeState.selectedKeyframe = `${trackName}_${index}`;
    const kf = keyframeState.keyframes[trackName]?.[index];
    
    if (kf) {
        const props = $('#keyframeProperties');
        const timeInput = $('#kfTime');
        const timeVal = $('#kfTimeVal');
        const easingSelect = $('#kfEasing');
        const poseInput = $('#kfPose');
        
        if (props) props.style.display = 'block';
        if (timeInput) { timeInput.value = kf.time; timeInput.max = keyframeState.duration; }
        if (timeVal) timeVal.textContent = kf.time.toFixed(2);
        if (easingSelect) easingSelect.value = kf.easing || 'linear';
        if (poseInput) poseInput.value = JSON.stringify(kf.pose || {}, null, 2);
    }
    
    updateKeyframeTracks();
}

function clearSelection() {
    keyframeState.selectedKeyframe = null;
    const props = $('#keyframeProperties');
    if (props) props.style.display = 'none';
    updateKeyframeTracks();
}

function addKeyframeAtTime(time) {
    if (!keyframeState.selectedCharacter) {
        showToast('पहले पात्र चुनें', 'warning');
        return;
    }
    
    // Clamp time
    time = Math.max(0, Math.min(keyframeState.duration, time));
    
    // Add keyframe to each track with default pose
    const defaultPoses = {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
    };
    
    Object.keys(defaultPoses).forEach(trackName => {
        if (!keyframeState.keyframes[trackName]) {
            keyframeState.keyframes[trackName] = [];
        }
        
        const keyframes = keyframeState.keyframes[trackName];
        const newKf = {
            time,
            pose: defaultPoses[trackName],
            easing: 'easeInOut'
        };
        
        // Insert in sorted order
        const insertIdx = keyframes.findIndex(kf => kf.time > time);
        if (insertIdx === -1) {
            keyframes.push(newKf);
        } else {
            keyframes.splice(insertIdx, 0, newKf);
        }
    });
    
    updateKeyframeTracks();
    showToast('कीफ्रेम जोड़ा गया', 'success');
}

function deleteSelectedKeyframe() {
    if (!keyframeState.selectedKeyframe) return;
    
    const [trackName, idx] = keyframeState.selectedKeyframe.split('_');
    const index = parseInt(idx);
    
    if (keyframeState.keyframes[trackName]) {
        keyframeState.keyframes[trackName].splice(index, 1);
    }
    
    clearSelection();
    showToast('कीफ्रेम हटाया गया', 'success');
}

function updateSelectedKeyframePose() {
    if (!keyframeState.selectedKeyframe) return;
    
    const [trackName, idx] = keyframeState.selectedKeyframe.split('_');
    const index = parseInt(idx);
    const poseInput = $('#kfPose');
    
    try {
        const pose = JSON.parse(poseInput.value);
        if (keyframeState.keyframes[trackName] && keyframeState.keyframes[trackName][index]) {
            keyframeState.keyframes[trackName][index].pose = pose;
            showToast('पोज़ अपडेट किया गया', 'success');
        }
    } catch (e) {
        showToast('अमान्य JSON', 'error');
    }
}

function updateSelectedKeyframeEasing() {
    if (!keyframeState.selectedKeyframe) return;
    
    const [trackName, idx] = keyframeState.selectedKeyframe.split('_');
    const index = parseInt(idx);
    const easingSelect = $('#kfEasing');
    
    if (keyframeState.keyframes[trackName] && keyframeState.keyframes[trackName][index]) {
        keyframeState.keyframes[trackName][index].easing = easingSelect.value;
    }
}

function clearKeyframes() {
    keyframeState.keyframes = {};
    clearSelection();
    updateKeyframeTracks();
}

function loadPresetAnimation(name) {
    // Load preset animation keyframes
    // This would load from ANIMATION_CLIPS
    clearKeyframes();
    showToast(`${name} एनिमेशन लोड किया गया`, 'info');
}

function playKeyframeAnimation() {
    if (keyframeState.isPlaying) return;
    if (!keyframeState.selectedCharacter) {
        showToast('पात्र चुनें', 'warning');
        return;
    }
    
    keyframeState.isPlaying = true;
    keyframeState.currentTime = 0;
    keyframeState.animationId = requestAnimationFrame(keyframeAnimationLoop);
    
    const playBtn = $('#keyframePlay');
    const stopBtn = $('#keyframeStop');
    if (playBtn) playBtn.style.display = 'none';
    if (stopBtn) stopBtn.style.display = 'inline-block';
}

function stopKeyframeAnimation() {
    keyframeState.isPlaying = false;
    if (keyframeState.animationId) {
        cancelAnimationFrame(keyframeState.animationId);
        keyframeState.animationId = null;
    }
    
    const playBtn = $('#keyframePlay');
    const stopBtn = $('#keyframeStop');
    if (playBtn) playBtn.style.display = 'inline-block';
    if (stopBtn) stopBtn.style.display = 'none';
    
    // Reset playhead
    keyframeState.currentTime = 0;
    updateKeyframePlayhead();
}

function keyframeAnimationLoop(timestamp) {
    if (!keyframeState.isPlaying) return;
    
    const delta = 1/60;
    keyframeState.currentTime += delta;
    
    if (keyframeState.currentTime >= keyframeState.duration) {
        keyframeState.currentTime = 0; // Loop
    }
    
    updateKeyframePlayhead();
    applyKeyframeAnimation(keyframeState.currentTime);
    
    keyframeState.animationId = requestAnimationFrame(keyframeAnimationLoop);
}

function updateKeyframePlayhead() {
    const playhead = $('#keyframePlayhead');
    const timeEl = $('#keyframeCurrentTime');
    const timeline = $('#keyframeTimeline');
    
    if (playhead && timeline) {
        const rect = timeline.getBoundingClientRect();
        const x = 80 + (keyframeState.currentTime / keyframeState.duration) * (rect.width - 80);
        playhead.style.left = `${x}px`;
    }
    
    if (timeEl) {
        timeEl.textContent = keyframeState.currentTime.toFixed(2);
    }
}

function applyKeyframeAnimation(time) {
    // Apply interpolated keyframe values to character
    // This is a simplified version - in production you'd interpolate between keyframes
    const charKey = keyframeState.selectedCharacter;
    let character3d = null;
    
    if (charKey.startsWith('char3d_')) {
        const parts = charKey.split('_');
        const sceneIndex = parseInt(parts[1]);
        const charIndex = parseInt(parts[2]);
        character3d = AppState.three.characters3d.find(c => c.sceneIndex === sceneIndex && c.charIndex === charIndex)?.character3d;
    }
    
    if (!character3d) return;
    
    // For each track, find the current interpolated value
    ['position', 'rotation', 'scale'].forEach(trackName => {
        const keyframes = keyframeState.keyframes[trackName] || [];
        if (keyframes.length === 0) return;
        
        // Find surrounding keyframes
        let prev = null;
        let next = null;
        for (let i = 0; i < keyframes.length; i++) {
            if (keyframes[i].time <= time) {
                prev = keyframes[i];
            } else {
                next = keyframes[i];
                break;
            }
        }
        
        if (!prev) prev = keyframes[0];
        if (!next) next = keyframes[keyframes.length - 1];
        
        if (prev === next) {
            // Apply directly
            applyPoseToCharacter(character3d, trackName, prev.pose);
        } else {
            // Interpolate
            const t = (time - prev.time) / (next.time - prev.time);
            const easedT = ease(t, prev.easing);
            const interpolated = interpolatePose(prev.pose, next.pose, easedT);
            applyPoseToCharacter(character3d, trackName, interpolated);
        }
    });
}

function ease(t, type) {
    switch (type) {
        case 'easeIn': return t * t;
        case 'easeOut': return 1 - (1 - t) * (1 - t);
        case 'easeInOut': return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        default: return t; // linear
    }
}

function interpolatePose(a, b, t) {
    const result = {};
    for (const key in a) {
        if (typeof a[key] === 'number' && typeof b[key] === 'number') {
            result[key] = a[key] + (b[key] - a[key]) * t;
        } else if (Array.isArray(a[key]) && Array.isArray(b[key])) {
            result[key] = a[key].map((v, i) => v + (b[key][i] - v) * t);
        }
    }
    return result;
}

function applyPoseToCharacter(character3d, trackName, pose) {
    if (trackName === 'position') {
        character3d.group.position.set(pose.x || 0, pose.y || 0, pose.z || 0);
    } else if (trackName === 'rotation') {
        character3d.group.rotation.set(pose.x || 0, pose.y || 0, pose.z || 0);
    } else if (trackName === 'scale') {
        character3d.group.scale.set(pose.x || 1, pose.y || 1, pose.z || 1);
    }
}

function startDragKeyframe(e, trackName, index) {
    e.preventDefault();
    e.stopPropagation();
    
    const timeline = $('#keyframeTimeline');
    const marker = e.target.closest('.keyframe-marker');
    if (!marker) return;
    
    const startX = e.clientX;
    const startTime = keyframeState.keyframes[trackName][index].time;
    
    function onMouseMove(e) {
        const rect = timeline.getBoundingClientRect();
        const deltaX = e.clientX - rect.left - 80 - startX;
        const deltaTime = (deltaX / (rect.width - 80)) * keyframeState.duration;
        let newTime = startTime + deltaTime;
        newTime = Math.max(0, Math.min(keyframeState.duration, newTime));
        
        keyframeState.keyframes[trackName][index].time = newTime;
        updateKeyframeTracks();
    }
    
    function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}

// ========================================
// Character Interactions
// ========================================

function initializeInteractions() {
    // Populate character dropdowns
    updateInteractionCharacterDropdowns();
    
    // Populate target object dropdown
    updateInteractionTargetObjects();
    
    // Event listeners
    const char1Select = $('#interactionChar1');
    const char2Select = $('#interactionChar2');
    const typeSelect = $('#interactionType');
    const targetSelect = $('#interactionTargetObject');
    const applyBtn = $('#applyInteraction');
    const previewBtn = $('#previewInteraction');
    const stopBtn = $('#stopInteraction');
    
    if (char1Select) char1Select.addEventListener('change', updateInteractionChar2Options);
    if (char2Select) char2Select.addEventListener('change', updateInteractionTargetObjects);
    if (typeSelect) typeSelect.addEventListener('change', updateInteractionTargetObjects);
    
    if (applyBtn) applyBtn.addEventListener('click', applyInteraction);
    if (previewBtn) previewBtn.addEventListener('click', previewInteraction);
    if (stopBtn) stopBtn.addEventListener('click', stopInteraction);
    
    // Scene selector change should update dropdowns
    const sceneSelector = $('#sceneSelector');
    if (sceneSelector) {
        sceneSelector.addEventListener('change', () => {
            updateInteractionCharacterDropdowns();
            updateInteractionTargetObjects();
        });
    }
}

function updateInteractionCharacterDropdowns() {
    const char1Select = $('#interactionChar1');
    const char2Select = $('#interactionChar2');
    
    if (!char1Select || !char2Select) return;
    
    const sceneIndex = $('#sceneSelector')?.value || AppState.three.currentScene;
    const scene = AppState.scenes[sceneIndex];
    
    const buildOptions = (select, excludeValue = null) => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">पात्र चुनें</option>';
        
        if (scene && scene.characters3d) {
            scene.characters3d.forEach((char, i) => {
                if (excludeValue && `${sceneIndex}_${i}` === excludeValue) return;
                const option = document.createElement('option');
                option.value = `${sceneIndex}_${i}`;
                option.textContent = `${scene.characters[i] || `पात्र ${i+1}`} (3D)`;
                select.appendChild(option);
            });
        }
        
        if (currentValue && !excludeValue) select.value = currentValue;
    };
    
    buildOptions(char1Select);
    buildOptions(char2Select, char1Select.value);
}

function updateInteractionChar2Options() {
    const char1Select = $('#interactionChar1');
    const char2Select = $('#interactionChar2');
    if (char1Select && char2Select) {
        updateInteractionCharacterDropdowns();
    }
}

function updateInteractionTargetObjects() {
    const targetSelect = $('#interactionTargetObject');
    const typeSelect = $('#interactionType');
    
    if (!targetSelect || !typeSelect) return;
    
    const type = typeSelect.value;
    const sceneIndex = $('#sceneSelector')?.value || AppState.three.currentScene;
    const scene = AppState.scenes[sceneIndex];
    
    targetSelect.innerHTML = '<option value="">कोई नहीं</option>';
    
    // Add assets in scene
    if (AppState.three.assetManager) {
        const assets = AppState.three.assetManager.getAllAssets();
        assets.forEach(asset => {
            const option = document.createElement('option');
            option.value = asset.instanceId;
            option.textContent = `${asset.assetName} (${asset.assetId})`;
            targetSelect.appendChild(option);
        });
    }
    
    // Add sit-able objects
    if (type === 'sit') {
        const sitAssets = ['chair', 'bench', 'sofa', 'bed'];
        sitAssets.forEach(assetId => {
            const assetDef = assetLibrary.getAsset(assetId);
            if (assetDef) {
                const option = document.createElement('option');
                option.value = `preset_${assetId}`;
                option.textContent = assetDef.name;
                targetSelect.appendChild(option);
            }
        });
    }
    
    // Show/hide target object based on interaction type
    const targetContainer = targetSelect.closest('.setting-item');
    if (targetContainer) {
        targetContainer.style.display = ['give', 'sit'].includes(type) ? 'block' : 'none';
    }
}

function applyInteraction() {
    const char1Select = $('#interactionChar1');
    const char2Select = $('#interactionChar2');
    const typeSelect = $('#interactionType');
    const targetSelect = $('#interactionTargetObject');
    
    if (!char1Select || !char2Select || !typeSelect) return;
    
    const char1Key = char1Select.value;
    const char2Key = char2Select.value;
    const type = typeSelect.value;
    const targetId = targetSelect.value;
    
    if (!char1Key || !char2Key) {
        showToast('दोनों पात्र चुनें', 'warning');
        return;
    }
    
    const char1 = getCharacter3DByKey(char1Key);
    const char2 = getCharacter3DByKey(char2Key);
    
    if (!char1 || !char2) {
        showToast('पात्र नहीं मिला', 'error');
        return;
    }
    
    // Apply interaction
    switch (type) {
        case 'look':
            char1.lookAt(char2.group.position);
            char2.lookAt(char1.group.position);
            showToast('पात्र एक-दूसरे को देख रहे हैं', 'success');
            break;
            
        case 'wave':
            char1.playAnimation('wave');
            char2.playAnimation('wave');
            char1.lookAt(char2.group.position);
            char2.lookAt(char1.group.position);
            showToast('हाथ हिला रहे हैं', 'success');
            break;
            
        case 'talk':
            char1.playAnimation('talk');
            char2.playAnimation('idle');
            char1.lookAt(char2.group.position);
            char2.lookAt(char1.group.position);
            showToast('बातचीत शुरू', 'success');
            break;
            
        case 'hug':
            char1.playAnimation('wave');
            char2.playAnimation('wave');
            // Move closer
            const midPoint = new THREE.Vector3().addVectors(char1.group.position, char2.group.position).multiplyScalar(0.5);
            char1.walkTo(midPoint.clone().add(new THREE.Vector3(-0.5, 0, 0)));
            char2.walkTo(midPoint.clone().add(new THREE.Vector3(0.5, 0, 0)));
            showToast('गले लग रहे हैं', 'success');
            break;
            
        case 'highfive':
            char1.playAnimation('point');
            char2.playAnimation('point');
            char1.lookAt(char2.group.position);
            char2.lookAt(char1.group.position);
            showToast('हाई-फाइव!', 'success');
            break;
            
        case 'walk_to':
            char1.walkTo(char2.group.position.clone(), {
                onComplete: () => {
                    char1.lookAt(char2.group.position);
                    char1.playAnimation('wave');
                }
            });
            showToast('पात्र 1 चल रहा है', 'success');
            break;
            
        case 'give':
            if (!targetId) {
                showToast('देने के लिए वस्तु चुनें', 'warning');
                return;
            }
            const object = getObjectByInstanceId(targetId);
            if (object) {
                char1.holdObject(object, 'right');
                setTimeout(() => {
                    char1.giveObject(char2, object);
                }, 1000);
                showToast('वस्तु दी जा रही है', 'success');
            }
            break;
            
        case 'sit':
            if (!targetId) {
                showToast('बैठने के लिए वस्तु चुनें', 'warning');
                return;
            }
            const sitObject = getObjectByInstanceId(targetId) || createSitObject(targetId);
            if (sitObject) {
                // Add sit position data
                sitObject.userData.sitPosition = sitObject.position.clone().add(new THREE.Vector3(0, 0.5, 0.5));
                sitObject.userData.sitRotation = new THREE.Euler(0, Math.PI, 0);
                char1.sitOn(sitObject);
                showToast('पात्र बैठ रहा है', 'success');
            }
            break;
    }
}

function previewInteraction() {
    // Same as apply but with preview mode
    applyInteraction();
}

function stopInteraction() {
    const char1Select = $('#interactionChar1');
    const char2Select = $('#interactionChar2');
    
    if (!char1Select || !char2Select) return;
    
    const char1Key = char1Select.value;
    const char2Key = char2Select.value;
    
    const char1 = getCharacter3DByKey(char1Key);
    const char2 = getCharacter3DByKey(char2Key);
    
    if (char1) {
        char1.stopWalking();
        char1.playAnimation('idle');
        char1.releaseObject();
    }
    if (char2) {
        char2.stopWalking();
        char2.playAnimation('idle');
        char2.releaseObject();
    }
    
    showToast('इंटरैक्शन रोकी गई', 'info');
}

function getCharacter3DByKey(key) {
    const parts = key.split('_');
    if (parts.length >= 2) {
        const sceneIndex = parseInt(parts[0]);
        const charIndex = parseInt(parts[1]);
        const charData = AppState.three.characters3d.find(c => c.sceneIndex === sceneIndex && c.charIndex === charIndex);
        return charData?.character3d;
    }
    return null;
}

function getObjectByInstanceId(instanceId) {
    if (!AppState.three.assetManager) return null;
    const asset = AppState.three.assetManager.getAsset(instanceId);
    return asset?.asset;
}

function createSitObject(presetId) {
    // Create a temporary sit object from preset
    if (presetId.startsWith('preset_')) {
        const assetId = presetId.replace('preset_', '');
        const assetGroup = assetLibrary.buildAsset(assetId, {
            position: new THREE.Vector3(0, 0, 2)
        });
        if (assetGroup && AppState.three.scene) {
            AppState.three.scene.add(assetGroup);
            // Add to asset manager
            if (AppState.three.assetManager) {
                const instanceId = AppState.three.assetManager.addAsset(assetId, {
                    position: new THREE.Vector3(0, 0, 2)
                });
                return AppState.three.assetManager.getAsset(instanceId)?.asset;
            }
        }
        return assetGroup;
    }
    return null;
}

// ========================================
// Auto-Direction System
// ========================================

function initializeAutoDirect() {
    const autoBtn = $('#autoDirectScene');
    const suggestBtn = $('#showDirectionSuggestions');
    
    if (autoBtn) autoBtn.addEventListener('click', handleAutoDirectScene);
    if (suggestBtn) suggestBtn.addEventListener('click', handleShowDirectionSuggestions);
}

function handleAutoDirectScene() {
    const sceneIndex = $('#sceneSelector')?.value || AppState.three.currentScene;
    
    if (sceneIndex === undefined || sceneIndex === null || sceneIndex === '') {
        showToast('पहले सीन चुनें', 'warning');
        return;
    }
    
    showLoading('सीन डायरेक्ट किया जा रहा है...');
    
    // Use setTimeout to allow loading to show
    setTimeout(() => {
        try {
            const directions = autoDirectScene(parseInt(sceneIndex));
            hideLoading();
            showToast('सीन ऑटो-डायरेक्ट हो गया!', 'success');
            
            // Update UI to reflect changes
            loadSceneControls(parseInt(sceneIndex));
        } catch (e) {
            hideLoading();
            console.error('Auto-direct failed:', e);
            showToast('ऑटो-डायरेक्ट विफल: ' + e.message, 'error');
        }
    }, 100);
}

function handleShowDirectionSuggestions() {
    const sceneIndex = $('#sceneSelector')?.value || AppState.three.currentScene;
    
    if (sceneIndex === undefined || sceneIndex === null || sceneIndex === '') {
        showToast('पहले सीन चुनें', 'warning');
        return;
    }
    
    const scene = AppState.scenes[sceneIndex];
    if (!scene) return;
    
    const suggestions = getDirectionSuggestions(scene.description, scene.characters);
    
    const container = $('#directionSuggestions');
    if (!container) return;
    
    container.style.display = 'block';
    
    if (suggestions.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 20px;">कोई सुझाव नहीं मिला</p>';
        return;
    }
    
    container.innerHTML = suggestions.map(s => `
        <div class="direction-suggestion">
            <span class="type-badge ${s.type}">${s.type}</span>
            <div class="details">
                ${s.character ? `<div class="character">${s.character}</div>` : ''}
                <div class="action">${s.action || s.expression || s.shot || s.mood || ''}</div>
                <div class="reason">${s.reason}</div>
            </div>
            <button class="btn apply-btn" onclick="applyDirectionSuggestion(${JSON.stringify(s).replace(/"/g, '"')})">लागू करें</button>
        </div>
    `).join('');
}

function applyDirectionSuggestion(suggestion) {
    const sceneIndex = $('#sceneSelector')?.value || AppState.three.currentScene;
    const scene = AppState.scenes[sceneIndex];
    if (!scene) return;
    
    // Find character
    const charData = AppState.three.characters3d.find(c => 
        c.sceneIndex === sceneIndex && 
        scene.characters[c.charIndex] === suggestion.character
    );
    
    if (!charData || !charData.character3d) {
        showToast('पात्र नहीं मिला', 'error');
        return;
    }
    
    const character3d = charData.character3d;
    
    switch (suggestion.type) {
        case 'animation':
            character3d.playAnimation(suggestion.action);
            showToast(`${suggestion.character}: ${suggestion.action} एनिमेशन लागू`, 'success');
            break;
        case 'expression':
            character3d.setExpression(suggestion.expression, 1.0);
            showToast(`${suggestion.character}: ${suggestion.expression} अभिव्यक्ति लागू`, 'success');
            break;
        case 'interaction':
            // Find target character
            const targetChar = scene.characters.indexOf(suggestion.target);
            if (targetChar >= 0) {
                const targetData = AppState.three.characters3d.find(c => 
                    c.sceneIndex === sceneIndex && c.charIndex === targetChar
                );
                if (targetData?.character3d) {
                    character3d.interactWith(targetData.character3d, suggestion.action);
                    showToast(`${suggestion.character} -> ${suggestion.target}: ${suggestion.action}`, 'success');
                }
            }
            break;
        case 'camera':
            applyCameraShot(suggestion.shot);
            showToast(`कैमरा: ${suggestion.shot}`, 'success');
            break;
        case 'lighting':
            applyLightingMood(suggestion.mood);
            showToast(`लाइटिंग: ${suggestion.mood}`, 'success');
            break;
    }
}

function applyCameraShot(shot) {
    const cameraControls = AppState.three.cameraControls;
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

function applyLightingMood(mood) {
    const moods = {
        bright: { ambientIntensity: 1.0, keyIntensity: 1.5, exposure: 1.5 },
        dark: { ambientIntensity: 0.2, keyIntensity: 0.5, exposure: 0.8 },
        warm: { ambientColor: 0xffcc88, keyColor: 0xffaa44, rimColor: 0xff8800 },
        cool: { ambientColor: 0x88aacc, keyColor: 0x4488ff, rimColor: 0x0044aa },
        dramatic: { keyIntensity: 2.0, fillIntensity: 0.1, rimIntensity: 0.5, exposure: 1.3 },
        soft: { ambientIntensity: 0.8, keyIntensity: 0.8, fillIntensity: 0.6, shadowQuality: 'high' }
    };
    
    if (moods[mood]) {
        Object.assign(AppState.three.lighting, moods[mood]);
    }
}

// ========================================
// Script Editor
// ========================================

let scriptManager = null;
let currentEditingScriptSceneId = null;

function initializeScriptEditor() {
    // Create script manager
    scriptManager = new ScriptManager();
    AppState.scriptManager = scriptManager;
    
    // Event listeners
    const newScriptBtn = $('#newScriptBtn');
    const templateBtn = $('#scriptTemplateBtn');
    const importBtn = $('#importScriptBtn');
    const exportBtn = $('#exportScriptBtn');
    const addSceneBtn = $('#addScriptSceneBtn');
    const addDialogueBtn = $('#addDialogueBtn');
    const addActionBtn = $('#addActionBtn');
    const saveBtn = $('#saveScriptSceneBtn');
    const deleteBtn = $('#deleteScriptSceneBtn');
    const closeBtn = $('#closeScriptEditorBtn');
    const generateBtn = $('#generateScenesFromScriptBtn');
    const languageSelect = $('#scriptLanguage');
    const backBtn = $('#backToStoryFromScriptBtn');
    
    if (newScriptBtn) newScriptBtn.addEventListener('click', handleNewScript);
    if (templateBtn) templateBtn.addEventListener('click', handleScriptTemplate);
    if (importBtn) importBtn.addEventListener('click', handleImportScript);
    if (exportBtn) exportBtn.addEventListener('click', handleExportScript);
    if (addSceneBtn) addSceneBtn.addEventListener('click', handleAddScriptScene);
    if (addDialogueBtn) addDialogueBtn.addEventListener('click', handleAddDialogue);
    if (addActionBtn) addActionBtn.addEventListener('click', handleAddAction);
    if (saveBtn) saveBtn.addEventListener('click', handleSaveScriptScene);
    if (deleteBtn) deleteBtn.addEventListener('click', handleDeleteScriptScene);
    if (closeBtn) closeBtn.addEventListener('click', handleCloseScriptEditor);
    if (generateBtn) generateBtn.addEventListener('click', handleGenerateScenesFromScript);
    if (languageSelect) languageSelect.addEventListener('change', (e) => {
        if (scriptManager) scriptManager.script.language = e.target.value;
    });
    if (backBtn) backBtn.addEventListener('click', () => goToStep(1));
    
    // Load script scenes list
    renderScriptScenesList();
}

function handleNewScript() {
    if (scriptManager && scriptManager.script.scenes.length > 0) {
        if (!confirm('वर्तमान स्क्रिप्ट खो जाएगी। जारी रखें?')) return;
    }
    scriptManager.newScript('', '');
    currentEditingScriptSceneId = null;
    renderScriptScenesList();
    closeScriptEditorPanel();
    showToast('नई स्क्रिप्ट बनाई गई', 'success');
}

function handleScriptTemplate() {
    // Show template selection modal
    const templates = Object.entries(SCRIPT_TEMPLATES).map(([id, t]) => `
        <button class="btn btn-secondary template-btn" data-template="${id}" style="width: 100%; margin: 4px 0; text-align: left;">
            <strong>${t.name}</strong><br>
            <small>${t.description}</small>
        </button>
    `).join('');
    
    const modal = createModal('स्क्रिप्ट टेम्पलेट चुनें', templates);
    modal.querySelectorAll('.template-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const script = createScriptFromTemplate(btn.dataset.template, '');
            if (script) {
                scriptManager.script = script;
                scriptManager.updateCharactersList();
                renderScriptScenesList();
                closeScriptEditorPanel();
                modal.remove();
                showToast(`${SCRIPT_TEMPLATES[btn.dataset.template].name} टेम्पलेट लोड किया गया`, 'success');
            }
        });
    });
}

function handleImportScript() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (scriptManager.importFromJSON(event.target.result)) {
                    renderScriptScenesList();
                    showToast('स्क्रिप्ट आयात की गई', 'success');
                } else {
                    showToast('आयात विफल: अमान्य फॉर्मेट', 'error');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

function handleExportScript() {
    if (!scriptManager || scriptManager.script.scenes.length === 0) {
        showToast('निर्यात करने के लिए कोई स्क्रिप्ट नहीं', 'warning');
        return;
    }
    
    const json = scriptManager.exportAsJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${scriptManager.script.title || 'script'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('स्क्रिप्ट निर्यात की गई', 'success');
}

function handleAddScriptScene() {
    const scene = scriptManager.addScene({
        title: `सीन ${scriptManager.script.scenes.length + 1}`,
        duration: 8
    });
    renderScriptScenesList();
    openScriptSceneEditor(scene.id);
    showToast('सीन जोड़ा गया', 'success');
}

function handleAddDialogue() {
    if (!currentEditingScriptSceneId) return;
    
    scriptManager.addDialogue(currentEditingScriptSceneId, {
        speaker: '',
        text: '',
        emotion: 'neutral',
        animation: 'talk'
    });
    renderDialoguesList(currentEditingScriptSceneId);
}

function handleAddAction() {
    if (!currentEditingScriptSceneId) return;
    
    scriptManager.addAction(currentEditingScriptSceneId, {
        character: '',
        action: 'walk',
        target: '',
        description: ''
    });
    renderActionsList(currentEditingScriptSceneId);
}

function handleSaveScriptScene() {
    if (!currentEditingScriptSceneId) return;
    
    const updates = {
        title: $('#scriptSceneTitle').value,
        location: $('#scriptSceneLocation').value,
        timeOfDay: $('#scriptSceneTimeOfDay').value,
        duration: parseInt($('#scriptSceneDuration').value) || 8,
        narration: $('#scriptSceneNarration').value,
        cameraNotes: $('#scriptCameraNotes').value,
        lightingNotes: $('#scriptLightingNotes').value,
        soundNotes: $('#scriptSoundNotes').value
    };
    
    scriptManager.updateScene(currentEditingScriptSceneId, updates);
    renderScriptScenesList();
    showToast('सीन सेव किया गया', 'success');
}

function handleDeleteScriptScene() {
    if (!currentEditingScriptSceneId) return;
    
    if (!confirm('इस सीन को हटाने से सभी संवाद और क्रियाएं मिट जाएंगी। जारी रखें?')) return;
    
    scriptManager.deleteScene(currentEditingScriptSceneId);
    currentEditingScriptSceneId = null;
    renderScriptScenesList();
    closeScriptEditorPanel();
    showToast('सीन हटाया गया', 'success');
}

function handleCloseScriptEditor() {
    closeScriptEditorPanel();
}

function handleGenerateScenesFromScript() {
    if (!scriptManager || scriptManager.script.scenes.length === 0) {
        showToast('पहले स्क्रिप्ट में सीन जोड़ें', 'warning');
        return;
    }
    
    showLoading('स्क्रिप्ट से सीन बनाए जा रहे हैं...');
    
    setTimeout(() => {
        // Convert script scenes to app scenes
        const breakdown = scriptManager.generateSceneBreakdown();
        AppState.scenes = breakdown.map((s, i) => ({
            ...s,
            id: s.id || generateId(),
            characters: s.characters.length > 0 ? s.characters : ['पात्र'],
            background: s.background || 'गार्डन'
        }));
        
        // Initialize 3D character data
        AppState.scenes.forEach((scene, sceneIndex) => {
            scene.characters3d = scene.characters.map((_, charIndex) => ({
                id: `char_${sceneIndex}_${charIndex}`,
                bodyType: 'adult',
                skinTone: 2,
                hairStyle: 'short',
                hairColor: 0,
                eyeColor: 0,
                clothing: 'casual',
                shirtColor: null,
                pantsColor: null,
                shoesColor: null,
                bodyScale: { height: 1.0, width: 1.0, depth: 1.0 },
                headScale: 1.0,
                limbLength: 1.0,
                expression: 'neutral',
                expressionIntensity: 1.0
            }));
        });
        
        // Store subtitles for later use
        AppState.generatedSubtitles = generateSubtitlesFromScript(scriptManager.script);
        
        renderSceneList();
        updateGenerateAnimationButton();
        goToStep(3); // Go to scene editor
        hideLoading();
        showToast(`${AppState.scenes.length} सीन स्क्रिप्ट से बनाए गए`, 'success');
    }, 100);
}

function renderScriptScenesList() {
    const container = $('#scriptScenesList');
    if (!container || !scriptManager) return;
    
    container.innerHTML = '';
    
    if (scriptManager.script.scenes.length === 0) {
        container.innerHTML = `
            <div style="padding: 40px; text-align: center; color: var(--text-muted);">
                <p>अभी तक कोई सीन नहीं</p>
                <p style="font-size: 0.8125rem;">"सीन जोड़ें" पर क्लिक करें</p>
            </div>
        `;
        return;
    }
    
    scriptManager.script.scenes.forEach(scene => {
        const item = document.createElement('div');
        item.className = 'script-scene-item' + (currentEditingScriptSceneId === scene.id ? ' active' : '');
        item.dataset.sceneId = scene.id;
        item.innerHTML = `
            <div class="script-scene-info">
                <div class="script-scene-number">सीन ${scene.number}</div>
                <div class="script-scene-title">${scene.title || 'बिना शीर्षक'}</div>
                <div class="script-scene-duration">${scene.duration}s • ${scene.dialogues.length} संवाद • ${scene.actions.length} क्रियाएं</div>
            </div>
        `;
        item.addEventListener('click', () => openScriptSceneEditor(scene.id));
        container.appendChild(item);
    });
}

function openScriptSceneEditor(sceneId) {
    const scene = scriptManager.script.scenes.find(s => s.id === sceneId);
    if (!scene) return;
    
    currentEditingScriptSceneId = sceneId;
    
    // Update UI
    $$('.script-scene-item').forEach(item => {
        item.classList.toggle('active', item.dataset.sceneId === sceneId);
    });
    
    const panel = $('#scriptEditorPanel');
    if (panel) panel.style.display = 'block';
    
    $('#editingScriptSceneTitle').textContent = `सीन ${scene.number}: ${scene.title}`;
    $('#scriptSceneTitle').value = scene.title;
    $('#scriptSceneLocation').value = scene.location;
    $('#scriptSceneTimeOfDay').value = scene.timeOfDay;
    $('#scriptSceneDuration').value = scene.duration;
    $('#scriptSceneNarration').value = scene.narration;
    $('#scriptCameraNotes').value = scene.cameraNotes;
    $('#scriptLightingNotes').value = scene.lightingNotes;
    $('#scriptSoundNotes').value = scene.soundNotes;
    
    renderDialoguesList(sceneId);
    renderActionsList(sceneId);
}

function closeScriptEditorPanel() {
    currentEditingScriptSceneId = null;
    const panel = $('#scriptEditorPanel');
    if (panel) panel.style.display = 'none';
    
    $$('.script-scene-item').forEach(item => item.classList.remove('active'));
}

function renderDialoguesList(sceneId) {
    const container = $('#scriptDialoguesList');
    if (!container) return;
    
    const scene = scriptManager.script.scenes.find(s => s.id === sceneId);
    if (!scene) return;
    
    if (scene.dialogues.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); font-size: 0.8125rem; padding: 8px;">कोई संवाद नहीं</p>';
        return;
    }
    
    container.innerHTML = scene.dialogues.map((dialogue, index) => `
        <div class="dialogue-item" data-dialogue-id="${dialogue.id}">
            <div class="dialogue-fields">
                <div class="dialogue-row">
                    <select class="select" data-field="speaker">
                        <option value="">स्पीकर चुनें</option>
                        ${scriptManager.script.characters.map(c => `<option value="${c}" ${c === dialogue.speaker ? 'selected' : ''}>${c}</option>`).join('')}
                    </select>
                    <select class="select" data-field="emotion">
                        <option value="neutral" ${dialogue.emotion === 'neutral' ? 'selected' : ''}>तटस्थ</option>
                        <option value="happy" ${dialogue.emotion === 'happy' ? 'selected' : ''}>खुश</option>
                        <option value="sad" ${dialogue.emotion === 'sad' ? 'selected' : ''}>उदास</option>
                        <option value="angry" ${dialogue.emotion === 'angry' ? 'selected' : ''}>गुस्सा</option>
                        <option value="surprised" ${dialogue.emotion === 'surprised' ? 'selected' : ''}>आश्चर्य</option>
                        <option value="scared" ${dialogue.emotion === 'scared' ? 'selected' : ''}>डर</option>
                        <option value="thinking" ${dialogue.emotion === 'thinking' ? 'selected' : ''}>सोच</option>
                    </select>
                    <select class="select" data-field="animation">
                        <option value="talk" ${dialogue.animation === 'talk' ? 'selected' : ''}>बात करना</option>
                        <option value="idle" ${dialogue.animation === 'idle' ? 'selected' : ''}>इडल</option>
                        <option value="wave" ${dialogue.animation === 'wave' ? 'selected' : ''}>हाथ हिलाना</option>
                        <option value="point" ${dialogue.animation === 'point' ? 'selected' : ''}>इशारा करना</option>
                    </select>
                </div>
                <div class="dialogue-row">
                    <input type="text" class="input" data-field="text" placeholder="संवाद टेक्स्ट" value="${dialogue.text}">
                    <input type="number" class="input" data-field="timing" placeholder="समय (सेकंड)" value="${dialogue.timing || 0}" step="0.5" min="0" style="width: 100px;">
                    <input type="number" class="input" data-field="duration" placeholder="अवधि" value="${dialogue.duration || 3}" step="0.5" min="1" style="width: 80px;">
                </div>
            </div>
            <div class="dialogue-actions">
                <button class="btn btn-danger btn-sm" data-action="delete">हटाएं</button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners
    container.querySelectorAll('.dialogue-item').forEach(item => {
        const dialogueId = item.dataset.dialogueId;
        const dialogue = scene.dialogues.find(d => d.id === dialogueId);
        if (!dialogue) return;
        
        item.querySelectorAll('[data-field]').forEach(field => {
            field.addEventListener('change', () => {
                const updates = { [field.dataset.field]: field.value };
                if (['timing', 'duration'].includes(field.dataset.field)) {
                    updates[field.dataset.field] = parseFloat(field.value) || 0;
                }
                scriptManager.updateDialogue(sceneId, dialogueId, updates);
            });
        });
        
        item.querySelector('[data-action="delete"]').addEventListener('click', () => {
            if (confirm('इस संवाद को हटाएं?')) {
                scriptManager.deleteDialogue(sceneId, dialogueId);
                renderDialoguesList(sceneId);
            }
        });
    });
}

function renderActionsList(sceneId) {
    const container = $('#scriptActionsList');
    if (!container) return;
    
    const scene = scriptManager.script.scenes.find(s => s.id === sceneId);
    if (!scene) return;
    
    const actionTypes = ['walk', 'run', 'sit', 'stand', 'wave', 'point', 'look', 'give', 'take', 'hug', 'highfive', 'nod', 'shake_head', 'jump', 'dance'];
    
    if (scene.actions.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); font-size: 0.8125rem; padding: 8px;">कोई क्रिया नहीं</p>';
        return;
    }
    
    container.innerHTML = scene.actions.map((action, index) => `
        <div class="action-item" data-action-id="${action.id}">
            <div class="action-fields">
                <div class="action-row">
                    <select class="select" data-field="character">
                        <option value="">पात्र चुनें</option>
                        ${scriptManager.script.characters.map(c => `<option value="${c}" ${c === action.character ? 'selected' : ''}>${c}</option>`).join('')}
                    </select>
                    <select class="select" data-field="action">
                        ${actionTypes.map(a => `<option value="${a}" ${a === action.action ? 'selected' : ''}>${a}</option>`).join('')}
                    </select>
                    <select class="select" data-field="target">
                        <option value="">लक्ष्य (वैकल्पिक)</option>
                        ${scriptManager.script.characters.map(c => `<option value="${c}" ${c === action.target ? 'selected' : ''}>${c}</option>`).join('')}
                    </select>
                </div>
                <div class="action-row">
                    <input type="text" class="input" data-field="description" placeholder="विवरण" value="${action.description || ''}" style="flex: 1;">
                    <input type="number" class="input" data-field="timing" placeholder="समय" value="${action.timing || 0}" step="0.5" min="0" style="width: 100px;">
                    <input type="number" class="input" data-field="duration" placeholder="अवधि" value="${action.duration || 2}" step="0.5" min="1" style="width: 80px;">
                </div>
            </div>
            <div class="action-actions">
                <button class="btn btn-danger btn-sm" data-action="delete">हटाएं</button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners
    container.querySelectorAll('.action-item').forEach(item => {
        const actionId = item.dataset.actionId;
        const action = scene.actions.find(a => a.id === actionId);
        if (!action) return;
        
        item.querySelectorAll('[data-field]').forEach(field => {
            field.addEventListener('change', () => {
                const updates = { [field.dataset.field]: field.value };
                if (['timing', 'duration'].includes(field.dataset.field)) {
                    updates[field.dataset.field] = parseFloat(field.value) || 0;
                }
                scriptManager.updateAction(sceneId, actionId, updates);
            });
        });
        
        item.querySelector('[data-action="delete"]').addEventListener('click', () => {
            if (confirm('इस क्रिया को हटाएं?')) {
                scriptManager.deleteAction(sceneId, actionId);
                renderActionsList(sceneId);
            }
        });
    });
}

function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 20px;
    `;
    modal.innerHTML = `
        <div style="background: var(--bg-card); border-radius: var(--radius-lg); padding: 24px; max-width: 500px; width: 100%; max-height: 80vh; overflow-y: auto;">
            <h3 style="margin: 0 0 16px;">${title}</h3>
            <div>${content}</div>
            <button class="btn btn-ghost" style="margin-top: 16px; width: 100%;" onclick="this.closest('.modal-overlay').remove()">रद्द करें</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    return modal;
}

function updateKeyLightPosition() {
    const { keyLight, lighting } = AppState.three;
    const THREE = AppState.three.THREE;
    
    if (!keyLight) return;
    
    const angleRad = THREE.MathUtils.degToRad(lighting.keyAngle);
    keyLight.position.set(
        Math.sin(angleRad) * 10,
        10,
        Math.cos(angleRad) * 10
    );
}

function populateSceneSelector() {
    const selector = $('#sceneSelector');
    if (!selector) return;
    
    selector.innerHTML = '';
    AppState.scenes.forEach((scene, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${index + 1}. ${scene.title}`;
        selector.appendChild(option);
    });
    
    // Load controls for first scene
    if (AppState.scenes.length > 0) {
        loadSceneControls(0);
    }
}

function loadSceneControls(sceneIndex) {
    const scene = AppState.scenes[sceneIndex];
    if (!scene) return;
    
    // Update character position controls
    const posContainer = $('#characterPositionControls');
    const animContainer = $('#characterAnimationControls');
    
    if (posContainer) posContainer.innerHTML = '';
    if (animContainer) animContainer.innerHTML = '';
    
    // Add controls for each character in the scene
    scene.characters.forEach((charName, charIndex) => {
        const char3d = AppState.three.characters3d.find(c => c.sceneIndex === sceneIndex && c.charIndex === charIndex);
        
        if (posContainer) {
            const row = createElement('div', { class: 'character-control-row' }, [
                createElement('label', {}, [`${charName} स्थिति`]),
                createElement('div', { class: 'vector-inputs' }, [
                    createElement('input', { 
                        type: 'number', 
                        class: 'input-small', 
                        placeholder: 'X', 
                        step: '0.1', 
                        value: char3d ? char3d.customization?.position?.x || 0 : 0,
                        dataset: { sceneIndex, charIndex, prop: 'position.x' }
                    }),
                    createElement('input', { 
                        type: 'number', 
                        class: 'input-small', 
                        placeholder: 'Y', 
                        step: '0.1', 
                        value: char3d ? char3d.customization?.position?.y || 0 : 0,
                        dataset: { sceneIndex, charIndex, prop: 'position.y' }
                    }),
                    createElement('input', { 
                        type: 'number', 
                        class: 'input-small', 
                        placeholder: 'Z', 
                        step: '0.1', 
                        value: char3d ? char3d.customization?.position?.z || 0 : 0,
                        dataset: { sceneIndex, charIndex, prop: 'position.z' }
                    })
                ])
            ]);
            posContainer.appendChild(row);
            
            // Add input listeners
            row.querySelectorAll('input').forEach(input => {
                input.addEventListener('change', e => {
                    const { sceneIndex, charIndex, prop } = e.target.dataset;
                    updateCharacterPosition(parseInt(sceneIndex), parseInt(charIndex), prop, parseFloat(e.target.value));
                });
            });
        }
        
        if (animContainer) {
            const row = createElement('div', { class: 'character-control-row' }, [
                createElement('label', {}, [`${charName} एनिमेशन`]),
                createElement('select', { 
                    class: 'select', 
                    dataset: { sceneIndex, charIndex }
                }, [
                    createElement('option', { value: 'idle' }, ['इडल']),
                    createElement('option', { value: 'walk' }, ['चलना']),
                    createElement('option', { value: 'run' }, ['दौड़ना']),
                    createElement('option', { value: 'talk' }, ['बोलना']),
                    createElement('option', { value: 'sit' }, ['बैठना']),
                    createElement('option', { value: 'wave' }, ['हाथ हिलाना']),
                    createElement('option', { value: 'point' }, ['इशारा करना']),
                    createElement('option', { value: 'nod' }, ['सिर हिलाना']),
                    createElement('option', { value: 'jump' }, ['कूदना'])
                ])
            ]);
            animContainer.appendChild(row);
            
            row.querySelector('select').addEventListener('change', e => {
                const { sceneIndex, charIndex } = e.target.dataset;
                const char3d = AppState.three.characters3d.find(c => c.sceneIndex === parseInt(sceneIndex) && c.charIndex === parseInt(charIndex));
                if (char3d && char3d.character3d) {
                    char3d.character3d.playAnimation(e.target.value, { loop: true });
                    char3d.animation = e.target.value;
                }
            });
        }
    });
}

function applySceneSettings() {
    const sceneIndex = parseInt($('#sceneSelector').value);
    const scene = AppState.scenes[sceneIndex];
    if (!scene) return;
    
    scene.duration = AppState.settings.sceneDuration;
    
    // Rebuild scene with new settings
    rebuildSceneForPreview(sceneIndex);
    
    showToast('सीन सेटिंग्स लागू की गईं', 'success');
}

// ========================================
// 3D Character Customization Helpers
// ========================================

let currentCustomizingCharacter = null;

function switchCharacterTab(tabName) {
    $$('#characterCustomization .tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    $$('#characterCustomization .tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === `tab-${tabName}`);
    });
}

function addCharacterToScene() {
    const index = AppState.currentSceneIndex;
    if (index < 0) return;
    
    const scene = AppState.scenes[index];
    const newCharName = `पात्र ${scene.characters.length + 1}`;
    scene.characters.push(newCharName);
    
    // Initialize 3D character data
    if (!scene.characters3d) scene.characters3d = [];
    scene.characters3d.push({
        id: `char_${index}_${scene.characters.length - 1}`,
        bodyType: 'adult',
        skinTone: 2,
        hairStyle: 'short',
        hairColor: 0,
        eyeColor: 0,
        clothing: 'casual',
        shirtColor: null,
        pantsColor: null,
        shoesColor: null,
        bodyScale: { height: 1.0, width: 1.0, depth: 1.0 },
        headScale: 1.0,
        limbLength: 1.0,
        expression: 'neutral',
        expressionIntensity: 1.0
    });
    
    renderSceneList();
    openSceneEditor(index);
    updateCharacter3DList();
    showToast('नया पात्र जोड़ा गया', 'success');
}

function updateCharacter3DList() {
    const container = $('#character3dList');
    const panel = $('#character3dPanel');
    const customization = $('#characterCustomization');
    
    if (!container || !panel) return;
    
    const index = AppState.currentSceneIndex;
    if (index < 0) {
        panel.style.display = 'none';
        return;
    }
    
    const scene = AppState.scenes[index];
    panel.style.display = 'block';
    
    container.innerHTML = '';
    
    scene.characters.forEach((charName, charIndex) => {
        const char3dData = scene.characters3d?.[charIndex] || {};
        const isActive = currentCustomizingCharacter?.sceneIndex === index && currentCustomizingCharacter?.charIndex === charIndex;
        
        const removeBtn = createElement('button', { class: 'btn btn-sm btn-ghost' }, ['हटाएं']);
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeCharacter(index, charIndex);
        });
        
        const item = createElement('div', { 
            class: `character-item ${isActive ? 'active' : ''}`,
            dataset: { sceneIndex: index, charIndex }
        }, [
            createElement('div', { class: 'character-avatar' }, [getCharacterIcon(charName).slice(0, 1)]),
            createElement('div', { class: 'character-info' }, [
                createElement('div', { class: 'character-name' }, [charName]),
                createElement('div', { class: 'character-details' }, [
                    `${char3dData.bodyType || 'adult'} • ${getHairStyleName(char3dData.hairStyle || 'short')} • ${getClothingName(char3dData.clothing || 'casual')}`
                ])
            ]),
            createElement('div', { class: 'character-actions' }, [removeBtn])
        ]);
        
        item.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON') {
                selectCharacterForCustomization(index, charIndex);
            }
        });
        
        container.appendChild(item);
    });
    
    // Select first character by default
    if (scene.characters.length > 0 && !currentCustomizingCharacter) {
        selectCharacterForCustomization(index, 0);
    }
}

function selectCharacterForCustomization(sceneIndex, charIndex) {
    const scene = AppState.scenes[sceneIndex];
    const char3dData = scene.characters3d?.[charIndex];
    
    if (!char3dData) return;
    
    currentCustomizingCharacter = { sceneIndex, charIndex };
    
    // Update UI
    $$('#character3dList .character-item').forEach(item => {
        item.classList.toggle('active', 
            parseInt(item.dataset.sceneIndex) === sceneIndex && 
            parseInt(item.dataset.charIndex) === charIndex
        );
    });
    
    const customization = $('#characterCustomization');
    if (customization) customization.style.display = 'block';
    
    $('#customizingCharacterName').textContent = `अनुकूलित: ${scene.characters[charIndex]}`;
    
    // Populate form with current values
    $('#charBodyType').value = char3dData.bodyType || 'adult';
    $('#charHeight').value = char3dData.bodyScale?.height || 1.0;
    $('#heightValue').textContent = ($('#charHeight').value);
    $('#charWidth').value = char3dData.bodyScale?.width || 1.0;
    $('#widthValue').textContent = ($('#charWidth').value);
    $('#charHeadScale').value = char3dData.headScale || 1.0;
    $('#headScaleValue').textContent = ($('#charHeadScale').value);
    $('#charLimbLength').value = char3dData.limbLength || 1.0;
    $('#limbLengthValue').textContent = ($('#charLimbLength').value);
    $('#charExpression').value = char3dData.expression || 'neutral';
    $('#expressionIntensity').value = char3dData.expressionIntensity || 1.0;
    $('#expressionIntensityValue').textContent = ($('#expressionIntensity').value);
    $('#charHairStyle').value = char3dData.hairStyle || 'short';
    $('#charClothing').value = char3dData.clothing || 'casual';
    
    // Populate color palettes
    populateSkinTonePalette(char3dData.skinTone || 2);
    populateEyeColorPalette(char3dData.eyeColor || 0);
    populateHairColorPalette(char3dData.hairColor || 0);
    
    // Set shirt/pants/shoes colors from clothing preset or custom colors
    const clothing = CLOTHING_PRESETS[char3dData.clothing || 'casual'];
    if (clothing) {
        $('#shirtColor').value = rgbToHex(char3dData.shirtColor || clothing.shirt?.color || 0x42a5f5);
        $('#pantsColor').value = rgbToHex(char3dData.pantsColor || clothing.pants?.color || 0x1565c0);
        $('#shoesColor').value = rgbToHex(char3dData.shoesColor || clothing.shoes?.color || 0xffffff);
    }
}

function populateSkinTonePalette(selectedIndex) {
    const container = $('#skinTonePalette');
    if (!container) return;
    
    container.innerHTML = '';
    
    SKIN_TONES.forEach((tone, index) => {
        const swatch = createElement('div', { 
            class: `color-swatch ${index === selectedIndex ? 'active' : ''}`,
            style: `background-color: #${tone.color.toString(16).padStart(6, '0')}`,
            dataset: { index }
        });
        swatch.addEventListener('click', () => selectSkinTone(index));
        container.appendChild(swatch);
    });
}

function populateEyeColorPalette(selectedIndex) {
    const container = $('#eyeColorPalette');
    if (!container) return;
    
    container.innerHTML = '';
    
    EYE_COLORS.forEach((eye, index) => {
        const swatch = createElement('div', { 
            class: `color-swatch ${index === selectedIndex ? 'active' : ''}`,
            style: `background-color: #${eye.iris.toString(16).padStart(6, '0')}`,
            dataset: { index }
        });
        swatch.addEventListener('click', () => selectEyeColor(index));
        container.appendChild(swatch);
    });
}

function populateHairColorPalette(selectedIndex) {
    const container = $('#hairColorPalette');
    if (!container) return;
    
    container.innerHTML = '';
    
    HAIR_COLORS.forEach((hair, index) => {
        const swatch = createElement('div', { 
            class: `color-swatch ${index === selectedIndex ? 'active' : ''}`,
            style: `background-color: #${hair.color.toString(16).padStart(6, '0')}`,
            dataset: { index }
        });
        swatch.addEventListener('click', () => selectHairColor(index));
        container.appendChild(swatch);
    });
}

function updateCharacter3DCustomization(property, value) {
    if (!currentCustomizingCharacter) return;
    
    const { sceneIndex, charIndex } = currentCustomizingCharacter;
    const scene = AppState.scenes[sceneIndex];
    const char3dData = scene.characters3d?.[charIndex];
    const char3d = AppState.three.characters3d.find(c => c.sceneIndex === sceneIndex && c.charIndex === charIndex);
    
    if (!char3dData) return;
    
    switch (property) {
        case 'bodyType':
            char3dData.bodyType = value;
            if (char3d?.character3d) char3d.character3d.setBodyType(value);
            break;
        case 'height':
            char3dData.bodyScale = char3dData.bodyScale || { height: 1, width: 1, depth: 1 };
            char3dData.bodyScale.height = value;
            if (char3d?.character3d) char3d.character3d.rebuildBody();
            break;
        case 'width':
            char3dData.bodyScale = char3dData.bodyScale || { height: 1, width: 1, depth: 1 };
            char3dData.bodyScale.width = value;
            if (char3d?.character3d) char3d.character3d.rebuildBody();
            break;
        case 'headScale':
            char3dData.headScale = value;
            if (char3d?.character3d) char3d.character3d.rebuildBody();
            break;
        case 'limbLength':
            char3dData.limbLength = value;
            if (char3d?.character3d) char3d.character3d.rebuildBody();
            break;
        case 'expression':
            char3dData.expression = value;
            if (char3d?.character3d) char3d.character3d.setExpression(value, char3dData.expressionIntensity || 1.0);
            break;
        case 'expressionIntensity':
            char3dData.expressionIntensity = value;
            if (char3d?.character3d) char3d.character3d.setExpression(char3dData.expression || 'neutral', value);
            break;
        case 'hairStyle':
            char3dData.hairStyle = value;
            if (char3d?.character3d) char3d.character3d.setHairStyle(value);
            break;
        case 'clothing':
            char3dData.clothing = value;
            if (char3d?.character3d) char3d.character3d.setClothing(value);
            break;
        case 'shirtColor':
            char3dData.shirtColor = value;
            if (char3d?.character3d) char3d.character3d.setShirtColor(value);
            break;
        case 'pantsColor':
            char3dData.pantsColor = value;
            if (char3d?.character3d) char3d.character3d.setPantsColor(value);
            break;
        case 'shoesColor':
            char3dData.shoesColor = value;
            if (char3d?.character3d) char3d.character3d.setShoesColor(value);
            break;
    }
    
    // Rebuild scene preview
    rebuildSceneForPreview(sceneIndex);
}

function selectSkinTone(index) {
    if (!currentCustomizingCharacter) return;
    const { sceneIndex, charIndex } = currentCustomizingCharacter;
    const scene = AppState.scenes[sceneIndex];
    const char3dData = scene.characters3d?.[charIndex];
    const char3d = AppState.three.characters3d.find(c => c.sceneIndex === sceneIndex && c.charIndex === charIndex);
    
    if (char3dData) {
        char3dData.skinTone = index;
        if (char3d?.character3d) char3d.character3d.setSkinTone(index);
        populateSkinTonePalette(index);
        rebuildSceneForPreview(sceneIndex);
    }
}

function selectEyeColor(index) {
    if (!currentCustomizingCharacter) return;
    const { sceneIndex, charIndex } = currentCustomizingCharacter;
    const scene = AppState.scenes[sceneIndex];
    const char3dData = scene.characters3d?.[charIndex];
    const char3d = AppState.three.characters3d.find(c => c.sceneIndex === sceneIndex && c.charIndex === charIndex);
    
    if (char3dData) {
        char3dData.eyeColor = index;
        if (char3d?.character3d) char3d.character3d.setEyeColor(index);
        populateEyeColorPalette(index);
        rebuildSceneForPreview(sceneIndex);
    }
}

function selectHairColor(index) {
    if (!currentCustomizingCharacter) return;
    const { sceneIndex, charIndex } = currentCustomizingCharacter;
    const scene = AppState.scenes[sceneIndex];
    const char3dData = scene.characters3d?.[charIndex];
    const char3d = AppState.three.characters3d.find(c => c.sceneIndex === sceneIndex && c.charIndex === charIndex);
    
    if (char3dData) {
        char3dData.hairColor = index;
        if (char3d?.character3d) char3d.character3d.setHairColor(index);
        populateHairColorPalette(index);
        rebuildSceneForPreview(sceneIndex);
    }
}

function removeCharacter(sceneIndex, charIndex) {
    const scene = AppState.scenes[sceneIndex];
    if (!scene || scene.characters.length <= 1) {
        showToast('कम से कम एक पात्र होना चाहिए', 'warning');
        return;
    }
    
    // Remove from scene data
    scene.characters.splice(charIndex, 1);
    if (scene.characters3d) {
        scene.characters3d.splice(charIndex, 1);
    }
    
    // Re-index remaining characters
    scene.characters3d?.forEach((char, i) => {
        char.id = `char_${sceneIndex}_${i}`;
    });
    
    // Update UI
    renderSceneList();
    openSceneEditor(sceneIndex);
    updateCharacter3DList();
    
    // Rebuild scene preview
    rebuildSceneForPreview(sceneIndex);
    
    showToast('पात्र हटाया गया', 'info');
}

function updateCharacterPosition(sceneIndex, charIndex, prop, value) {
    const char3d = AppState.three.characters3d.find(c => c.sceneIndex === sceneIndex && c.charIndex === charIndex);
    if (!char3d || !char3d.character3d) return;
    
    const parts = prop.split('.');
    if (parts[0] === 'position' && parts[1]) {
        char3d.character3d.group.position[parts[1]] = value;
        char3d.customization = char3d.customization || {};
        char3d.customization.position = char3d.customization.position || { x: 0, y: 0, z: 0 };
        char3d.customization.position[parts[1]] = value;
    }
}

function applyGlobalAnimation(animName) {
    AppState.three.characters3d.forEach(char => {
        if (char.character3d && animName !== 'none') {
            char.character3d.playAnimation(animName, { loop: true });
            char.animation = animName;
        } else if (char.character3d) {
            char.character3d.playAnimation('idle', { loop: true });
            char.animation = 'idle';
        }
    });
}

function getHairStyleName(style) {
    const names = {
        'short': 'छोटे', 'medium': 'मध्यम', 'long': 'लंबे',
        'curly': 'घुंघराले', 'bald': 'गंजा', 'ponytail': 'पोनीटेल',
        'bun': 'बन', 'dreadlocks': 'ड्रेडलॉक्स'
    };
    return names[style] || style;
}

function getClothingName(clothing) {
    const names = {
        'casual': 'कैजुअल', 'formal': 'औपचारिक', 'traditional': 'पारंपरिक',
        'school': 'स्कूल', 'sports': 'खेल', 'winter': 'सर्दी'
    };
    return names[clothing] || clothing;
}

function rgbToHex(color) {
    if (typeof color === 'string') return color;
    return '#' + color.toString(16).padStart(6, '0');
}

// ========================================
// UI Event Handlers
// ========================================
function initEventListeners() {
    $('#themeToggle').addEventListener('click', toggleTheme);
    
    $('#storyInput').addEventListener('input', debounce(handleStoryInput, 300));
    
    $('#videoStyle').addEventListener('change', e => { AppState.settings.videoStyle = e.target.value; });
    $('#colorTheme').addEventListener('change', e => { 
        AppState.settings.colorTheme = e.target.value; 
        rebuildAllScenes();
    });
    $('#aspectRatio').addEventListener('change', e => { 
        AppState.settings.aspectRatio = e.target.value; 
        updateCanvasAspectRatio();
    });
    $('#sceneDuration').addEventListener('change', e => { 
        AppState.settings.sceneDuration = parseInt(e.target.value) || 8;
        updateSceneDurations();
    });
    
    $('#generateScenesBtn').addEventListener('click', handleGenerateScenes);
    
    // 3D Character Customization
    $('#addCharacterBtn').addEventListener('click', addCharacterToScene);
    $('#charBodyType').addEventListener('change', e => updateCharacter3DCustomization('bodyType', e.target.value));
    $('#charHeight').addEventListener('input', e => { 
        updateCharacter3DCustomization('height', parseFloat(e.target.value));
        $('#heightValue').textContent = e.target.value;
    });
    $('#charWidth').addEventListener('input', e => { 
        updateCharacter3DCustomization('width', parseFloat(e.target.value));
        $('#widthValue').textContent = e.target.value;
    });
    $('#charHeadScale').addEventListener('input', e => { 
        updateCharacter3DCustomization('headScale', parseFloat(e.target.value));
        $('#headScaleValue').textContent = e.target.value;
    });
    $('#charLimbLength').addEventListener('input', e => { 
        updateCharacter3DCustomization('limbLength', parseFloat(e.target.value));
        $('#limbLengthValue').textContent = e.target.value;
    });
    $('#charExpression').addEventListener('change', e => updateCharacter3DCustomization('expression', e.target.value));
    $('#expressionIntensity').addEventListener('input', e => { 
        updateCharacter3DCustomization('expressionIntensity', parseFloat(e.target.value));
        $('#expressionIntensityValue').textContent = e.target.value.toFixed(1);
    });
    $('#charHairStyle').addEventListener('change', e => updateCharacter3DCustomization('hairStyle', e.target.value));
    $('#charClothing').addEventListener('change', e => updateCharacter3DCustomization('clothing', e.target.value));
    $('#shirtColor').addEventListener('input', e => updateCharacter3DCustomization('shirtColor', e.target.value));
    $('#pantsColor').addEventListener('input', e => updateCharacter3DCustomization('pantsColor', e.target.value));
    $('#shoesColor').addEventListener('input', e => updateCharacter3DCustomization('shoesColor', e.target.value));
    
    // Tab switching for character customization
    $$('#characterCustomization .tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchCharacterTab(btn.dataset.tab));
    });
    
    // Professional 3D Controls - Animation Tab
    $('#animationSpeed').addEventListener('input', e => { 
        AppState.settings.animationSpeed = parseFloat(e.target.value);
        $('#speedValue').textContent = `${AppState.settings.animationSpeed}x`;
    });
    $('#transitionType').addEventListener('change', e => { AppState.settings.transitionType = e.target.value; });
    $('#globalAnimation').addEventListener('change', e => applyGlobalAnimation(e.target.value));
    
    // Professional 3D Controls - Camera Tab
    $('#cameraType').addEventListener('change', e => { 
        AppState.three.cameraControls.type = e.target.value; 
        createCamera(); 
    });
    $('#cameraFOV').addEventListener('input', e => { 
        AppState.three.cameraControls.fov = parseInt(e.target.value);
        $('#fovValue').textContent = e.target.value;
        if (AppState.three.camera.isPerspectiveCamera) {
            AppState.three.camera.fov = AppState.three.cameraControls.fov;
            AppState.three.camera.updateProjectionMatrix();
        }
    });
    $('#cameraDistance').addEventListener('input', e => { 
        AppState.three.cameraControls.distance = parseInt(e.target.value);
        $('#camDistValue').textContent = e.target.value;
    });
    $('#cameraHeight').addEventListener('input', e => { 
        AppState.three.cameraControls.height = parseInt(e.target.value);
        $('#camHeightValue').textContent = e.target.value;
    });
    $('#cameraAngle').addEventListener('input', e => { 
        AppState.three.cameraControls.angle = parseInt(e.target.value);
        $('#camAngleValue').textContent = e.target.value;
    });
    $('#cameraMovement').addEventListener('change', e => { AppState.three.cameraControls.movement = e.target.value; });
    $('#cameraSpeed').addEventListener('input', e => { 
        AppState.three.cameraControls.speed = parseFloat(e.target.value);
        $('#camSpeedValue').textContent = e.target.value;
    });
    $('#lookAtX').addEventListener('input', e => { AppState.three.cameraControls.lookAt.x = parseFloat(e.target.value) || 0; });
    $('#lookAtY').addEventListener('input', e => { AppState.three.cameraControls.lookAt.y = parseFloat(e.target.value) || 0; });
    $('#lookAtZ').addEventListener('input', e => { AppState.three.cameraControls.lookAt.z = parseFloat(e.target.value) || 0; });
    
    // Professional 3D Controls - Lighting Tab
    $('#environmentPreset').addEventListener('change', e => { 
        AppState.three.lighting.environment = e.target.value; 
        setupLighting(); 
    });
    $('#ambientIntensity').addEventListener('input', e => { 
        AppState.three.lighting.ambientIntensity = parseFloat(e.target.value);
        $('#ambientValue').textContent = e.target.value;
        if (AppState.three.ambientLight) AppState.three.ambientLight.intensity = AppState.three.lighting.ambientIntensity;
    });
    $('#ambientColor').addEventListener('input', e => { 
        AppState.three.lighting.ambientColor = parseInt(e.target.value.replace('#', '0x'));
        if (AppState.three.ambientLight) AppState.three.ambientLight.color.set(AppState.three.lighting.ambientColor);
    });
    $('#keyIntensity').addEventListener('input', e => { 
        AppState.three.lighting.keyIntensity = parseFloat(e.target.value);
        $('#keyValue').textContent = e.target.value;
        if (AppState.three.keyLight) AppState.three.keyLight.intensity = AppState.three.lighting.keyIntensity;
    });
    $('#keyColor').addEventListener('input', e => { 
        AppState.three.lighting.keyColor = parseInt(e.target.value.replace('#', '0x'));
        if (AppState.three.keyLight) AppState.three.keyLight.color.set(AppState.three.lighting.keyColor);
    });
    $('#keyAngle').addEventListener('input', e => { 
        AppState.three.lighting.keyAngle = parseInt(e.target.value);
        $('#keyAngleValue').textContent = e.target.value;
        updateKeyLightPosition();
    });
    $('#fillIntensity').addEventListener('input', e => { 
        AppState.three.lighting.fillIntensity = parseFloat(e.target.value);
        $('#fillValue').textContent = e.target.value;
        if (AppState.three.fillLight) AppState.three.fillLight.intensity = AppState.three.lighting.fillIntensity;
    });
    $('#fillColor').addEventListener('input', e => { 
        AppState.three.lighting.fillColor = parseInt(e.target.value.replace('#', '0x'));
        if (AppState.three.fillLight) AppState.three.fillLight.color.set(AppState.three.lighting.fillColor);
    });
    $('#rimIntensity').addEventListener('input', e => { 
        AppState.three.lighting.rimIntensity = parseFloat(e.target.value);
        $('#rimValue').textContent = e.target.value;
        if (AppState.three.rimLight) AppState.three.rimLight.intensity = AppState.three.lighting.rimIntensity;
    });
    $('#rimColor').addEventListener('input', e => { 
        AppState.three.lighting.rimColor = parseInt(e.target.value.replace('#', '0x'));
        if (AppState.three.rimLight) AppState.three.rimLight.color.set(AppState.three.lighting.rimColor);
    });
    $('#shadowQuality').addEventListener('change', e => { 
        AppState.three.lighting.shadowQuality = e.target.value; 
        updateShadowQuality();
    });
    $('#exposure').addEventListener('input', e => { 
        AppState.three.lighting.exposure = parseFloat(e.target.value);
        $('#exposureValue').textContent = e.target.value;
        if (AppState.three.renderer) AppState.three.renderer.toneMappingExposure = AppState.three.lighting.exposure;
    });
    
    // Professional 3D Controls - Background Tab
    $('#backgroundType').addEventListener('change', e => { 
        AppState.three.background.type = e.target.value; 
        updateBackground(); 
    });
    $('#bgColor1').addEventListener('input', e => { 
        AppState.three.background.color1 = parseInt(e.target.value.replace('#', '0x'));
        updateBackground();
    });
    $('#bgColor2').addEventListener('input', e => { 
        AppState.three.background.color2 = parseInt(e.target.value.replace('#', '0x'));
        updateBackground();
    });
    $('#bgRotation').addEventListener('input', e => { 
        AppState.three.background.rotation = parseInt(e.target.value);
        $('#bgRotValue').textContent = e.target.value;
        updateBackground();
    });
    $('#skyPreset').addEventListener('change', e => { 
        AppState.three.background.skyPreset = e.target.value; 
        updateBackground();
    });
    $('#fogDensity').addEventListener('input', e => { 
        AppState.three.background.fogDensity = parseFloat(e.target.value);
        $('#fogValue').textContent = e.target.value;
        updateBackground();
    });
    $('#fogColor').addEventListener('input', e => { 
        AppState.three.background.fogColor = parseInt(e.target.value.replace('#', '0x'));
        updateBackground();
    });
    $('#showGround').addEventListener('change', e => { 
        AppState.three.background.showGround = e.target.checked; 
        createGroundPlane();
    });
    $('#groundShadows').addEventListener('change', e => { 
        AppState.three.background.groundShadows = e.target.checked; 
        if (AppState.three.groundPlane) AppState.three.groundPlane.receiveShadow = e.target.checked;
    });
    $('#groundColor').addEventListener('input', e => { 
        AppState.three.background.groundColor = parseInt(e.target.value.replace('#', '0x'));
        if (AppState.three.groundPlane) AppState.three.groundPlane.material.color.set(AppState.three.background.groundColor);
    });
    $('#groundRoughness').addEventListener('input', e => { 
        AppState.three.background.groundRoughness = parseFloat(e.target.value);
        $('#groundRoughValue').textContent = e.target.value;
        if (AppState.three.groundPlane) AppState.three.groundPlane.material.roughness = AppState.three.background.groundRoughness;
    });
    
    // Professional 3D Controls - Scene Edit Tab
    $('#sceneSelector').addEventListener('change', e => loadSceneControls(parseInt(e.target.value)));
    $('#sceneDuration').addEventListener('input', e => { 
        AppState.settings.sceneDuration = parseInt(e.target.value);
        $('#sceneDurValue').textContent = e.target.value;
    });
    $('#transitionIn').addEventListener('change', e => { /* transition in */ });
    $('#transitionOut').addEventListener('change', e => { /* transition out */ });
    $('#applySceneSettings').addEventListener('click', applySceneSettings);
    
    // Pro tabs
    $$('.pro-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchProTab(btn.dataset.proTab));
    });
    
    // Asset Library initialization
    initializeAssetLibrary();
    
    // Keyframe Animation Editor initialization
    initializeKeyframeEditor();
    
    // Character Interactions initialization
    initializeInteractions();
    
    // Auto-Direction initialization
    initializeAutoDirect();
    
    // Script Editor initialization
    initializeScriptEditor();
    
    $('#closeEditorBtn').addEventListener('click', closeSceneEditor);
    $('#saveSceneBtn').addEventListener('click', saveSceneEdit);
    $('#regenerateSceneBtn').addEventListener('click', regenerateScene);
    
    $('#backToStoryBtn').addEventListener('click', () => goToStep(1));
    $('#backToScenesBtn').addEventListener('click', () => goToStep(3));
    $('#backToPreviewBtn').addEventListener('click', () => goToStep(4));
    $('#backToStoryFromScriptBtn').addEventListener('click', () => goToStep(1));
    
    $('#generateAnimationBtn').addEventListener('click', handleGenerateAnimation);
    $('#playPauseBtn').addEventListener('click', togglePlayPause);
    $('#stopBtn').addEventListener('click', stopAnimation);
    $('#restartBtn').addEventListener('click', restartAnimation);
    $('#muteBtn').addEventListener('click', toggleMute);
    $('#volumeSlider').addEventListener('input', e => { 
        AppState.volume = parseFloat(e.target.value);
        updateVolumeUI();
        setBackgroundMusicVolume(AppState.volume);
    });
    $('#fullscreenBtn').addEventListener('click', toggleFullscreen);
    $('#timeline').addEventListener('click', handleTimelineClick);
    
    $('#timeline').addEventListener('touchstart', handleTimelineTouch, { passive: true });
    $('#timeline').addEventListener('touchmove', handleTimelineTouch, { passive: true });
    
    $('#previewCanvas').addEventListener('touchstart', handleCanvasTouchStart, { passive: true });
    $('#previewCanvas').addEventListener('touchmove', handleCanvasTouchMove, { passive: false });
    $('#previewCanvas').addEventListener('touchend', handleCanvasTouchEnd, { passive: true });
    
    $('#cameraMovement').addEventListener('change', e => { AppState.settings.cameraMovement = e.target.value; });
    $('#paperThickness').addEventListener('input', e => { 
        AppState.settings.paperThickness = parseInt(e.target.value);
        $('#thicknessValue').textContent = e.target.value;
        rebuildAllScenes();
    });
    
    $('#exportVideoBtn').addEventListener('click', () => goToStep(5));
    $('#startExportBtn').addEventListener('click', startExport);
    $('#downloadVideoBtn').addEventListener('click', downloadVideo);
    $('#shareVideoBtn').addEventListener('click', shareVideo);
    
    $$('input[name="resolution"]').forEach(r => r.addEventListener('change', e => { AppState.exportSettings.resolution = e.target.value; }));
    $$('input[name="framerate"]').forEach(r => r.addEventListener('change', e => { AppState.exportSettings.framerate = parseInt(e.target.value); }));
    $$('input[name="format"]').forEach(r => r.addEventListener('change', e => { AppState.exportSettings.format = e.target.value; }));
    
    $$('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => goToStep(parseInt(btn.dataset.step)));
    });
    
    $$('.progress-step').forEach(step => {
        step.addEventListener('click', () => goToStep(parseInt(step.dataset.step)));
    });
    
    document.addEventListener('keydown', handleKeydown);
}

function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

function handleStoryInput() {
    const text = $('#storyInput').value.trim();
    AppState.story = text;
    $('#generateScenesBtn').disabled = text.length === 0;
}

function handleGenerateScenes() {
    if (!AppState.story || AppState.story.length === 0) {
        showToast('कृपया कहानी या विषय लिखें', 'warning');
        return;
    }
    
    showLoading('सीन बनाए जा रहे हैं...');
    
    setTimeout(() => {
        AppState.scenes = generateScenesFromStory(AppState.story, AppState.settings);
        
        // Initialize 3D character data for each scene
        AppState.scenes.forEach((scene, sceneIndex) => {
            scene.characters3d = scene.characters.map((_, charIndex) => ({
                id: `char_${sceneIndex}_${charIndex}`,
                bodyType: 'adult',
                skinTone: 2,
                hairStyle: 'short',
                hairColor: 0,
                eyeColor: 0,
                clothing: 'casual',
                shirtColor: null,
                pantsColor: null,
                shoesColor: null,
                bodyScale: { height: 1.0, width: 1.0, depth: 1.0 },
                headScale: 1.0,
                limbLength: 1.0,
                expression: 'neutral',
                expressionIntensity: 1.0
            }));
        });
        
        renderSceneList();
        updateGenerateAnimationButton();
        goToStep(2); // Go to script editor
        hideLoading();
        showToast(`${AppState.scenes.length} सीन बनाए गए`, 'success');
    }, 500);
}

function renderSceneList() {
    const container = $('#sceneList');
    container.innerHTML = '';
    
    AppState.scenes.forEach((scene, index) => {
        const themeColors = ColorThemes[AppState.settings.colorTheme];
        const bgColor = themeColors.background[0];
        const paperColors = themeColors.paper;
        
        const card = createElement('div', { class: 'scene-card', dataset: { index } }, [
            createElement('div', { class: 'scene-card-header' }, [
                createElement('div', { class: 'scene-number' }, [String(index + 1)]),
                createElement('h4', { class: 'scene-title' }, [scene.title]),
                createElement('span', { class: 'scene-duration' }, [`${scene.duration} सेकंड`])
            ]),
            
            // Visual preview area
            createElement('div', { class: 'scene-visual-preview', style: `background: ${bgColor};` }, [
                createElement('div', { class: 'preview-bg' }),
                ...scene.characters.slice(0, 3).map((char, i) => 
                    createElement('div', { 
                        class: 'preview-character',
                        style: `background: ${paperColors[i % paperColors.length]}; left: ${10 + i * 35}px;`
                    }, [getCharacterIcon(char)])
                ),
                createElement('div', { class: 'preview-label' }, [`${scene.background} • ${scene.characters.length} पात्र`])
            ]),
            
            createElement('p', { class: 'scene-preview' }, [scene.description]),
            createElement('div', { class: 'scene-meta' }, [
                createElement('span', {}, ['👥 ', scene.characters.join(', ')]),
                createElement('span', {}, ['🎨 ', scene.background])
            ])
        ]);
        
        card.addEventListener('click', () => openSceneEditor(index));
        container.appendChild(card);
    });
    
    // Update the generate animation button state
    updateGenerateAnimationButton();
}

function getCharacterIcon(charName) {
    const icons = {
        'खरगोश': '🐰', 'बिल्ली': '🐱', 'कुत्ता': '🐶', 'पक्षी': '🐦', 'चिड़िया': '🐦',
        'तितली': '🦋', 'हाथी': '🐘', 'शेर': '🦁', 'बंदर': '🐒', 'मोर': '🦚',
        'तोता': '🦜', 'फूल': '🌸', 'पेड़': '🌳', 'बादल': '☁️', 'सूरज': '☀️',
        'घर': '🏠', 'गाड़ी': '🚗', 'कार': '🚗'
    };
    return icons[charName] || '🎭';
}

function updateGenerateAnimationButton() {
    const btn = $('#generateAnimationBtn');
    if (btn) {
        btn.disabled = AppState.scenes.length === 0;
    }
}

// Rebuild a specific scene for 3D visual preview
async function rebuildSceneForPreview(sceneIndex) {
    if (sceneIndex < 0 || sceneIndex >= AppState.scenes.length) return;
    
    // Only rebuild if Three.js is initialized
    if (!AppState.three.scene || !AppState.three.camera) return;
    
    try {
        await buildScene(sceneIndex);
    } catch (e) {
        console.warn('Scene preview rebuild failed:', e);
    }
}

function openSceneEditor(index) {
    AppState.currentSceneIndex = index;
    const scene = AppState.scenes[index];
    
    $('#editingSceneTitle').textContent = scene.title;
    $('#sceneDescription').value = scene.description;
    $('#sceneCharacters').value = scene.characters.join(', ');
    $('#sceneBackground').value = scene.background;
    $('#sceneHindiText').value = scene.hindiText;
    
    // Initialize 3D character data if not present
    if (!scene.characters3d) {
        scene.characters3d = scene.characters.map((_, i) => ({
            id: `char_${index}_${i}`,
            bodyType: 'adult',
            skinTone: 2,
            hairStyle: 'short',
            hairColor: 0,
            eyeColor: 0,
            clothing: 'casual',
            shirtColor: null,
            pantsColor: null,
            shoesColor: null,
            bodyScale: { height: 1.0, width: 1.0, depth: 1.0 },
            headScale: 1.0,
            limbLength: 1.0,
            expression: 'neutral',
            expressionIntensity: 1.0
        }));
    }
    
    $('#sceneEditor').style.display = 'block';
    $('#sceneEditor').scrollIntoView({ behavior: 'smooth' });
    
    // Update 3D character list
    updateCharacter3DList();
}

function closeSceneEditor() {
    $('#sceneEditor').style.display = 'none';
    AppState.currentSceneIndex = -1;
}

function saveSceneEdit() {
    const index = AppState.currentSceneIndex;
    if (index < 0) return;
    
    const scene = AppState.scenes[index];
    scene.description = $('#sceneDescription').value;
    const newCharacters = $('#sceneCharacters').value.split(',').map(s => s.trim()).filter(Boolean);
    
    // Preserve 3D character data for existing characters
    const oldCharacters3d = scene.characters3d || [];
    scene.characters = newCharacters;
    
    // Ensure characters3d array matches characters array
    if (!scene.characters3d) scene.characters3d = [];
    
    // If characters were added, initialize their 3D data
    while (scene.characters3d.length < scene.characters.length) {
        const i = scene.characters3d.length;
        scene.characters3d.push({
            id: `char_${index}_${i}`,
            bodyType: 'adult',
            skinTone: 2,
            hairStyle: 'short',
            hairColor: 0,
            eyeColor: 0,
            clothing: 'casual',
            shirtColor: null,
            pantsColor: null,
            shoesColor: null,
            bodyScale: { height: 1.0, width: 1.0, depth: 1.0 },
            headScale: 1.0,
            limbLength: 1.0,
            expression: 'neutral',
            expressionIntensity: 1.0
        });
    }
    
    // If characters were removed, trim the 3D data
    if (scene.characters3d.length > scene.characters.length) {
        scene.characters3d.length = scene.characters.length;
    }
    
    scene.background = $('#sceneBackground').value;
    scene.hindiText = $('#sceneHindiText').value;
    
    // Save assets for this scene
    if (AppState.three.assetManager) {
        scene.assets = AppState.three.assetManager.toJSON();
    }
    
    renderSceneList();
    updateGenerateAnimationButton();
    
    // Rebuild the 3D scene for visual preview
    rebuildSceneForPreview(index);
    
    closeSceneEditor();
    showToast('सीन सेव हो गया', 'success');
}

function regenerateScene() {
    const index = AppState.currentSceneIndex;
    if (index < 0) return;
    
    const scene = AppState.scenes[index];
    const variations = [
        `${scene.description} और भी दिलचस्प तरीके से।`,
        `यह सीन अब नए पात्रों के साथ: ${['नया पात्र', 'दोस्त', 'साथी'][Math.floor(Math.random() * 3)]}।`,
        `${scene.background} में एक नया रोमांच शुरू होता है।`
    ];
    
    scene.description = variations[Math.floor(Math.random() * variations.length)];
    scene.hindiText = scene.description;
    
    $('#sceneDescription').value = scene.description;
    $('#sceneHindiText').value = scene.hindiText;
    
    showToast('सीन पुनः बनाया गया', 'info');
}

function handleGenerateAnimation() {
    showLoading('एनिमेशन तैयार हो रही है...');
    
    setTimeout(() => {
        buildAnimationTimeline();
        goToStep(4); // Animation preview
        hideLoading();
        showToast('एनिमेशन तैयार! प्ले बटन दबाएं', 'success');
    }, 1000);
}

function togglePlayPause() {
    if (AppState.isPlaying) {
        pauseAnimation();
    } else {
        playAnimation();
    }
}

function toggleMute() {
    AppState.muted = !AppState.muted;
    $('#muteBtn .icon-volume').style.display = AppState.muted ? 'none' : 'block';
    $('#muteBtn .icon-mute').style.display = AppState.muted ? 'block' : 'none';
    $('#volumeSlider').disabled = AppState.muted;
    
    setBackgroundMusicVolume(AppState.volume);
    
    if (AppState.audio.synth) {
        AppState.audio.synth.pause();
        if (!AppState.muted && AppState.isPlaying) {
            playSceneAudio(AppState.three.currentScene);
        }
    }
}

function updateVolumeUI() {
    $('#volumeSlider').value = AppState.volume;
    if (AppState.audio.synth && AppState.isPlaying) {
        playSceneAudio(AppState.three.currentScene);
    }
}

function toggleFullscreen() {
    const canvas = $('#previewCanvas');
    if (!document.fullscreenElement) {
        canvas.requestFullscreen().catch(console.error);
    } else {
        document.exitFullscreen();
    }
}

function handleTimelineClick(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const time = percent * AppState.duration;
    seekAnimation(time);
}

function handleTimelineTouch(e) {
    const touch = e.touches[0] || e.changedTouches[0];
    if (!touch) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
    const time = percent * AppState.duration;
    seekAnimation(time);
    
    e.preventDefault();
}

let touchState = {
    startX: 0,
    startY: 0,
    startTime: 0,
    isDragging: false
};

function handleCanvasTouchStart(e) {
    const touch = e.touches[0];
    if (!touch) return;
    
    touchState.startX = touch.clientX;
    touchState.startY = touch.clientY;
    touchState.startTime = Date.now();
    touchState.isDragging = false;
}

function handleCanvasTouchMove(e) {
    if (e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchState.startX;
    const deltaY = touch.clientY - touchState.startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance > 10) {
        touchState.isDragging = true;
        e.preventDefault();
    }
}

function handleCanvasTouchEnd(e) {
    const touch = e.changedTouches[0];
    if (!touch) return;
    
    const deltaTime = Date.now() - touchState.startTime;
    const deltaX = touch.clientX - touchState.startX;
    const deltaY = touch.clientY - touchState.startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (!touchState.isDragging && deltaTime < 300 && distance < 20) {
        togglePlayPause();
    }
    
    touchState.isDragging = false;
}

function handleKeydown(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    switch (e.code) {
        case 'Space':
            e.preventDefault();
            togglePlayPause();
            break;
        case 'ArrowLeft':
            seekAnimation(Math.max(0, AppState.currentTime - 5));
            break;
        case 'ArrowRight':
            seekAnimation(Math.min(AppState.duration, AppState.currentTime + 5));
            break;
        case 'KeyM':
            toggleMute();
            break;
        case 'KeyF':
            toggleFullscreen();
            break;
    }
}

function goToStep(step) {
    if (step < 1 || step > 5) return;
    
    // Step 2: Script Editor - need script
    if (step === 2 && (!AppState.scriptManager || AppState.scriptManager.script.scenes.length === 0)) {
        showToast('पहले स्क्रिप्ट बनाएं', 'warning');
        return;
    }
    // Step 3: Scene Editor - need scenes
    if (step === 3 && AppState.scenes.length === 0) {
        showToast('पहले सीन बनाएं', 'warning');
        return;
    }
    // Step 4: Animation Preview - need animation
    if (step === 4 && !AppState.animationData) {
        showToast('पहले एनिमेशन बनाएं', 'warning');
        return;
    }
    // Step 5: Video Export - need animation
    if (step === 5 && !AppState.animationData) {
        showToast('पहले एनिमेशन बनाएं', 'warning');
        return;
    }
    
    // Update button state when navigating to step 3 (scene editor)
    if (step === 3) {
        updateGenerateAnimationButton();
    }
    
    $$('.step-panel').forEach(p => p.classList.remove('active'));
    $$('.progress-step').forEach(s => s.classList.remove('active'));
    $$('.nav-item').forEach(n => n.classList.remove('active'));
    
    $(`#step${step}`).classList.add('active');
    $(`.progress-step[data-step="${step}"]`).classList.add('active');
    $(`.nav-item[data-step="${step}"]`).classList.add('active');
    
    AppState.currentStep = step;
    
    $('.main-content').scrollTop = 0;
}

function updateCanvasAspectRatio() {
    const canvas = $('#previewCanvas');
    const [w, h] = AppState.settings.aspectRatio.split(':').map(Number);
    canvas.style.aspectRatio = `${w}/${h}`;
    
    if (AppState.three.camera) {
        onThreeResize();
    }
}

function updateSceneDurations() {
    AppState.scenes.forEach(scene => {
        scene.duration = AppState.settings.sceneDuration;
    });
    renderSceneList();
}

function rebuildAllScenes() {
    AppState.three.backgrounds.forEach((bg, i) => {
        if (bg) {
            clearSceneObjects(i);
            buildScene(i);
        }
    });
    
    // Clear all characters
    AppState.three.characters.forEach(char => {
        if (char.mesh) {
            AppState.three.scene.remove(char.mesh);
            disposeObject(char.mesh);
        }
    });
    AppState.three.characters = [];
    
    AppState.three.characters3d.forEach(char => {
        if (char.character3d) {
            AppState.three.scene.remove(char.character3d.group);
            char.character3d.dispose();
        }
    });
    AppState.three.characters3d = [];
    
    AppState.scenes.forEach((scene, i) => {
        scene.characters.forEach((charName, j) => {
            buildCharacter(charName, ColorThemes[AppState.settings.colorTheme], i, j);
        });
    });
}

// ========================================
// Initialization
// ========================================
async function init() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered:', registration.scope);
        } catch (err) {
            console.warn('Service Worker registration failed:', err);
        }
    }
    
    await initAudio();
    await initThreeJS();
    initEventListeners();
    updateCanvasAspectRatio();
    
    $('#storyInput').focus();
    
    console.log('App initialized successfully');
    showToast('ऐप तैयार है! अपनी कहानी लिखें', 'info');
}

document.addEventListener('DOMContentLoaded', init);

document.addEventListener('visibilitychange', () => {
    if (document.hidden && AppState.isPlaying) {
        pauseAnimation();
    }
});

let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, { passive: false });

export { AppState, init, goToStep };
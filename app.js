/**
 * 3D Paper Animation Video Creator
 * Main Application Module
 * 
 * Features:
 * - Hindi UI for story input
 * - Automatic scene division
 * - 3D paper-cutout rendering with Three.js
 * - Animation system with character movement, camera, transitions
 * - Hindi TTS using Web Speech API
 * - Video export with MediaRecorder
 * - Mobile-responsive
 */

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
        characters: [],
        backgrounds: [],
        currentScene: 0,
        transitionProgress: 0,
        isTransitioning: false,
        THREE: null,
        subtitleCanvas: null,
        subtitleCtx: null,
        subtitleTexture: null,
        subtitleSprite: null
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
// Three.js 3D Paper Cutout Renderer
// ========================================
async function initThreeJS() {
    const THREE = await import('three');
    AppState.three.THREE = THREE;
    const { EffectComposer } = await import('three/addons/postprocessing/EffectComposer.js');
    const { RenderPass } = await import('three/addons/postprocessing/RenderPass.js');
    const { ShaderPass } = await import('three/addons/postprocessing/ShaderPass.js');
    const { FXAAShader } = await import('three/addons/shaders/FXAAShader.js');

    AppState.three.scene = new THREE.Scene();
    AppState.three.scene.background = new THREE.Color(0x87ceeb);

    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 10;
    AppState.three.camera = new THREE.OrthographicCamera(
        frustumSize * aspect / -2,
        frustumSize * aspect / 2,
        frustumSize / 2,
        frustumSize / -2,
        0.1,
        100
    );
    AppState.three.camera.position.set(0, 0, 20);
    AppState.three.camera.lookAt(0, 0, 0);

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
    AppState.three.renderer.toneMappingExposure = 1.2;

    AppState.three.composer = new EffectComposer(AppState.three.renderer);
    AppState.three.composer.addPass(new RenderPass(AppState.three.scene, AppState.three.camera));
    
    const fxaaPass = new ShaderPass(FXAAShader);
    fxaaPass.material.uniforms['resolution'].value.set(1 / canvas.clientWidth, 1 / canvas.clientHeight);
    AppState.three.composer.addPass(fxaaPass);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    AppState.three.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 50;
    dirLight.shadow.camera.left = -15;
    dirLight.shadow.camera.right = 15;
    dirLight.shadow.camera.top = 15;
    dirLight.shadow.camera.bottom = -15;
    AppState.three.scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xffeedd, 0.3);
    fillLight.position.set(-5, 5, -5);
    AppState.three.scene.add(fillLight);

    window.addEventListener('resize', onThreeResize);
    
    initSubtitles();
    generateBackgroundMusic();
    
    animateThree();
    
    console.log('Three.js initialized');
}

function onThreeResize() {
    const { camera, renderer, composer } = AppState.three;
    const canvas = $('#previewCanvas');
    
    if (!camera || !renderer) return;
    
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const frustumSize = 10;
    
    camera.left = frustumSize * aspect / -2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = frustumSize / -2;
    camera.updateProjectionMatrix();
    
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    composer.setSize(canvas.clientWidth, canvas.clientHeight);
    
    const fxaaPass = composer.passes.find(p => p.material && p.material.uniforms.resolution);
    if (fxaaPass) {
        fxaaPass.material.uniforms['resolution'].value.set(1 / canvas.clientWidth, 1 / canvas.clientHeight);
    }
}

function animateThree() {
    const { scene, camera, renderer, composer, animationId } = AppState.three;
    
    AppState.three.animationId = requestAnimationFrame(animateThree);
    
    if (!scene || !camera) return;
    
    const time = performance.now() * 0.001 * AppState.settings.animationSpeed;
    
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
    const { camera, currentScene } = AppState.three;
    const settings = AppState.settings;
    
    if (!camera) return;
    
    const baseX = 0;
    const baseY = 0;
    const baseZ = 20;
    
    switch (settings.cameraMovement) {
        case 'gentle':
            camera.position.x = baseX + Math.sin(time * 0.15) * 0.8;
            camera.position.y = baseY + Math.cos(time * 0.1) * 0.5;
            break;
        case 'dynamic':
            camera.position.x = baseX + Math.sin(time * 0.3) * 2;
            camera.position.y = baseY + Math.cos(time * 0.2) * 1.5;
            camera.position.z = baseZ + Math.sin(time * 0.1) * 2;
            break;
        case 'static':
        default:
            camera.position.x = baseX;
            camera.position.y = baseY;
            camera.position.z = baseZ;
            break;
    }
    
    camera.lookAt(baseX, baseY, 0);
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
    const { camera } = AppState.three;
    const settings = AppState.settings;
    
    if (!camera) return;
    
    const baseX = 0, baseY = 0, baseZ = 20;
    
    switch (settings.cameraMovement) {
        case 'gentle':
            camera.position.x = baseX + Math.sin(time * 0.15) * 0.8;
            camera.position.y = baseY + Math.cos(time * 0.1) * 0.5;
            break;
        case 'dynamic':
            camera.position.x = baseX + Math.sin(time * 0.3) * 2;
            camera.position.y = baseY + Math.cos(time * 0.2) * 1.5;
            camera.position.z = baseZ + Math.sin(time * 0.1) * 2;
            break;
        default:
            camera.position.set(baseX, baseY, baseZ);
    }
    camera.lookAt(baseX, baseY, 0);
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
    
    $('#closeEditorBtn').addEventListener('click', closeSceneEditor);
    $('#saveSceneBtn').addEventListener('click', saveSceneEdit);
    $('#regenerateSceneBtn').addEventListener('click', regenerateScene);
    
    $('#backToStoryBtn').addEventListener('click', () => goToStep(1));
    $('#backToScenesBtn').addEventListener('click', () => goToStep(2));
    $('#backToPreviewBtn').addEventListener('click', () => goToStep(3));
    
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
    
    $('#animationSpeed').addEventListener('input', e => { 
        AppState.settings.animationSpeed = parseFloat(e.target.value);
        $('#speedValue').textContent = `${AppState.settings.animationSpeed}x`;
    });
    $('#cameraMovement').addEventListener('change', e => { AppState.settings.cameraMovement = e.target.value; });
    $('#transitionType').addEventListener('change', e => { AppState.settings.transitionType = e.target.value; });
    $('#paperThickness').addEventListener('input', e => { 
        AppState.settings.paperThickness = parseInt(e.target.value);
        $('#thicknessValue').textContent = e.target.value;
        rebuildAllScenes();
    });
    
    $('#exportVideoBtn').addEventListener('click', () => goToStep(4));
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
    $('#generateScenesBtn').disabled = text.length < 50;
}

function handleGenerateScenes() {
    if (!AppState.story || AppState.story.length < 50) {
        showToast('कृपया कम से कम ५० अक्षर लिखें', 'warning');
        return;
    }
    
    showLoading('सीन बनाए जा रहे हैं...');
    
    setTimeout(() => {
        AppState.scenes = generateScenesFromStory(AppState.story, AppState.settings);
        renderSceneList();
        updateGenerateAnimationButton();
        goToStep(2);
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
    
    $('#sceneEditor').style.display = 'block';
    $('#sceneEditor').scrollIntoView({ behavior: 'smooth' });
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
    scene.characters = $('#sceneCharacters').value.split(',').map(s => s.trim()).filter(Boolean);
    scene.background = $('#sceneBackground').value;
    scene.hindiText = $('#sceneHindiText').value;
    
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
        goToStep(3);
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
    if (step < 1 || step > 4) return;
    
    if (step === 2 && AppState.scenes.length === 0) {
        showToast('पहले सीन बनाएं', 'warning');
        return;
    }
    if (step === 3 && !AppState.animationData) {
        showToast('पहले एनिमेशन बनाएं', 'warning');
        return;
    }
    if (step === 4 && !AppState.animationData) {
        showToast('पहले एनिमेशन बनाएं', 'warning');
        return;
    }
    
    // Update button state when navigating to step 2
    if (step === 2) {
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
    
    AppState.three.characters.forEach(char => {
        if (char.mesh) {
            AppState.three.scene.remove(char.mesh);
            disposeObject(char.mesh);
        }
    });
    AppState.three.characters = [];
    
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
/**
 * Background Effects, Weather & Visual Effects System
 * Particle systems, post-processing, atmospheric effects
 */

// ========================================
// Particle System Types
// ========================================

export const PARTICLE_TYPES = {
    rain: {
        name: 'बारिश',
        particleCount: 500,
        size: 0.1,
        speed: 15,
        spread: 50,
        color: 0x88ccff,
        opacity: 0.6,
        gravity: 0,
        wind: 2,
        lifetime: 3,
        shape: 'line',
        emissionRate: 200
    },
    heavyRain: {
        name: 'भारी बारिश',
        particleCount: 1000,
        size: 0.15,
        speed: 20,
        spread: 60,
        color: 0x66aaff,
        opacity: 0.7,
        gravity: 0,
        wind: 5,
        lifetime: 2.5,
        shape: 'line',
        emissionRate: 400
    },
    snow: {
        name: 'बर्फ',
        particleCount: 400,
        size: 0.2,
        speed: 2,
        spread: 40,
        color: 0xffffff,
        opacity: 0.9,
        gravity: 0.5,
        wind: 1,
        lifetime: 10,
        shape: 'circle',
        emissionRate: 50,
        wobble: true
    },
    heavySnow: {
        name: 'भारी बर्फबारी',
        particleCount: 800,
        size: 0.3,
        speed: 3,
        spread: 50,
        color: 0xffffff,
        opacity: 0.95,
        gravity: 0.3,
        wind: 2,
        lifetime: 8,
        shape: 'circle',
        emissionRate: 100,
        wobble: true
    },
    fog: {
        name: 'कोहरा',
        particleCount: 200,
        size: 5,
        speed: 0.5,
        spread: 60,
        color: 0xcccccc,
        opacity: 0.15,
        gravity: 0,
        wind: 0.5,
        lifetime: 20,
        shape: 'circle',
        emissionRate: 10,
        groundHugging: true
    },
    mist: {
        name: 'धुंध',
        particleCount: 150,
        size: 8,
        speed: 0.3,
        spread: 80,
        color: 0xaaaaaa,
        opacity: 0.08,
        gravity: 0,
        wind: 0.2,
        lifetime: 30,
        shape: 'circle',
        emissionRate: 5,
        groundHugging: true
    },
    dust: {
        name: 'धूल',
        particleCount: 300,
        size: 0.05,
        speed: 1,
        spread: 30,
        color: 0xc9b896,
        opacity: 0.4,
        gravity: 0.1,
        wind: 2,
        lifetime: 5,
        shape: 'circle',
        emissionRate: 30
    },
    sandstorm: {
        name: 'रेत का तूफान',
        particleCount: 600,
        size: 0.1,
        speed: 8,
        spread: 40,
        color: 0xd2b48c,
        opacity: 0.6,
        gravity: 0.5,
        wind: 10,
        lifetime: 3,
        shape: 'circle',
        emissionRate: 100
    },
    leaves: {
        name: 'पत्ते',
        particleCount: 100,
        size: 0.4,
        speed: 1.5,
        spread: 30,
        color: 0x8fbc8f,
        opacity: 0.8,
        gravity: 0.8,
        wind: 3,
        lifetime: 8,
        shape: 'leaf',
        emissionRate: 10,
        rotation: true,
        colors: [0xff8c00, 0xff4500, 0xffd700, 0xa0522d, 0x8fbc8f]
    },
    cherryBlossoms: {
        name: 'चेरी ब्लॉसम',
        particleCount: 200,
        size: 0.25,
        speed: 1,
        spread: 30,
        color: 0xffb7c5,
        opacity: 0.9,
        gravity: 0.5,
        wind: 2,
        lifetime: 10,
        shape: 'petal',
        emissionRate: 20,
        rotation: true,
        colors: [0xffb7c5, 0xffc0cb, 0xff69b4, 0xffe4e1]
    },
    fireflies: {
        name: 'जुगनू',
        particleCount: 50,
        size: 0.15,
        speed: 0.5,
        spread: 40,
        color: 0xffff99,
        opacity: 1,
        gravity: 0,
        wind: 0.5,
        lifetime: 0,
        shape: 'glow',
        emissionRate: 5,
        glow: true,
        blink: true
    },
    sparks: {
        name: 'चिंगारी',
        particleCount: 100,
        size: 0.05,
        speed: 5,
        spread: 5,
        color: 0xffaa00,
        opacity: 1,
        gravity: 2,
        wind: 0,
        lifetime: 1,
        shape: 'circle',
        emissionRate: 50,
        colors: [0xffaa00, 0xff5500, 0xffff00, 0xff8800]
    },
    smoke: {
        name: 'धुआं',
        particleCount: 100,
        size: 2,
        speed: 1,
        spread: 10,
        color: 0x444444,
        opacity: 0.3,
        gravity: -0.5,
        wind: 1,
        lifetime: 5,
        shape: 'circle',
        emissionRate: 20,
        expand: true
    },
    steam: {
        name: 'भाप',
        particleCount: 80,
        size: 1,
        speed: 2,
        spread: 5,
        color: 0xcccccc,
        opacity: 0.4,
        gravity: -1,
        wind: 0.5,
        lifetime: 3,
        shape: 'circle',
        emissionRate: 30,
        expand: true
    },
    bubbles: {
        name: 'बुलबुले',
        particleCount: 60,
        size: 0.3,
        speed: 1,
        spread: 20,
        color: 0x88ccff,
        opacity: 0.4,
        gravity: -0.5,
        wind: 0.5,
        lifetime: 5,
        shape: 'circle',
        emissionRate: 10,
        wobble: true
    },
    pollen: {
        name: 'पराग',
        particleCount: 500,
        size: 0.02,
        speed: 0.3,
        spread: 50,
        color: 0xffff66,
        opacity: 0.6,
        gravity: 0.1,
        wind: 1,
        lifetime: 15,
        shape: 'circle',
        emissionRate: 100
    },
    ash: {
        name: 'राख',
        particleCount: 200,
        size: 0.1,
        speed: 1,
        spread: 30,
        color: 0x333333,
        opacity: 0.5,
        gravity: 0.8,
        wind: 2,
        lifetime: 6,
        shape: 'circle',
        emissionRate: 30
    },
    magic: {
        name: 'जादू/चमक',
        particleCount: 100,
        size: 0.2,
        speed: 1,
        spread: 10,
        color: 0xffd700,
        opacity: 1,
        gravity: 0,
        wind: 0,
        lifetime: 2,
        shape: 'star',
        emissionRate: 30,
        glow: true,
        colors: [0xffd700, 0xff69b4, 0x00ffff, 0xffaa00]
    },
    embers: {
        name: 'अंगारे',
        particleCount: 80,
        size: 0.1,
        speed: 2,
        spread: 5,
        color: 0xff6600,
        opacity: 0.8,
        gravity: 0.5,
        wind: 1,
        lifetime: 3,
        shape: 'circle',
        emissionRate: 20,
        colors: [0xff6600, 0xffaa00, 0xff8800, 0xff4400],
        glow: true
    }
};

// ========================================
// Post-Processing Effects
// ========================================

export const POST_PROCESSING_EFFECTS = {
    bloom: {
        name: 'ब्लूम',
        description: 'चमकदार क्षेत्रों से चमक',
        defaultParams: { strength: 1.0, radius: 0.5, threshold: 0.8 }
    },
    vignette: {
        name: 'विगनेट',
        description: 'किनारों को काला करना',
        defaultParams: { darkness: 0.5, offset: 0.5 }
    },
    colorCorrection: {
        name: 'कलर करेक्शन',
        description: 'रंग ग्रेडिंग',
        defaultParams: { saturation: 1.0, contrast: 1.0, brightness: 0, temperature: 0 }
    },
    filmGrain: {
        name: 'फिल्म ग्रेन',
        description: 'फिल्म जैसा शोर',
        defaultParams: { intensity: 0.3, size: 1.0 }
    },
    chromaticAberration: {
        name: 'क्रोमैटिक एबेरेशन',
        description: 'रंग फ्रिंजिंग',
        defaultParams: { offset: 0.005 }
    },
    depthOfField: {
        name: 'डेप्थ ऑफ फील्ड',
        description: 'फोकस ब्लर',
        defaultParams: { focus: 10, aperture: 0.1, maxBlur: 0.01 }
    },
    motionBlur: {
        name: 'मोशन ब्लर',
        description: 'गति धुंधलापन',
        defaultParams: { strength: 0.5, samples: 16 }
    },
    ssao: {
        name: 'SSAO',
        description: 'स्क्रीन स्पेस एंबिएंट ऑक्लूजन',
        defaultParams: { radius: 0.5, intensity: 1.0 }
    },
    godRays: {
        name: 'गॉड रेज़',
        description: 'वॉल्यूमेट्रिक लाइट शाफ्ट',
        defaultParams: { density: 0.5, decay: 0.95, weight: 0.5, exposure: 0.5 }
    },
    lensFlare: {
        name: 'लेंस फ्लेयर',
        description: 'कैमरा लेंस प्रतिबिंब',
        defaultParams: { intensity: 1.0, color: 0xffffee }
    }
};

// ========================================
// Weather Presets with Full Effects
// ========================================

export const WEATHER_PRESETS = {
    clear: {
        name: 'साफ',
        particles: [],
        fog: { enabled: false },
        skyColor: { top: 0x87ceeb, bottom: 0xe0f7fa },
        sunIntensity: 1.2,
        ambientIntensity: 0.6,
        postProcessing: ['colorCorrection'],
        colorGrade: { saturation: 1.1, contrast: 1.05, brightness: 0.05, temperature: 100 }
    },
    cloudy: {
        name: 'बादल',
        particles: [],
        fog: { enabled: true, density: 0.005, color: 0xbbbbbb },
        skyColor: { top: 0x99aab5, bottom: 0xb0bec5 },
        sunIntensity: 0.6,
        ambientIntensity: 0.8,
        postProcessing: ['colorCorrection'],
        colorGrade: { saturation: 0.8, contrast: 0.9, brightness: -0.05, temperature: -50 }
    },
    overcast: {
        name: 'घने बादल',
        particles: [],
        fog: { enabled: true, density: 0.01, color: 0x888888 },
        skyColor: { top: 0x6d7b8d, bottom: 0x90a4ae },
        sunIntensity: 0.3,
        ambientIntensity: 0.9,
        postProcessing: ['colorCorrection', 'vignette'],
        colorGrade: { saturation: 0.6, contrast: 0.8, brightness: -0.1, temperature: -100 }
    },
    lightRain: {
        name: 'हल्की बारिश',
        particles: ['rain'],
        fog: { enabled: true, density: 0.008, color: 0x88aacc },
        skyColor: { top: 0x5d7b9b, bottom: 0x789ac8 },
        sunIntensity: 0.4,
        ambientIntensity: 0.7,
        groundWetness: 0.5,
        postProcessing: ['colorCorrection', 'vignette'],
        colorGrade: { saturation: 0.7, contrast: 0.95, brightness: -0.05, temperature: -50 }
    },
    rain: {
        name: 'बारिश',
        particles: ['rain'],
        fog: { enabled: true, density: 0.012, color: 0x6a8db8 },
        skyColor: { top: 0x4a6a8a, bottom: 0x6a8ea8 },
        sunIntensity: 0.2,
        ambientIntensity: 0.6,
        groundWetness: 0.8,
        postProcessing: ['colorCorrection', 'vignette', 'filmGrain'],
        colorGrade: { saturation: 0.6, contrast: 0.9, brightness: -0.1, temperature: -100 }
    },
    heavyRain: {
        name: 'भारी बारिश',
        particles: ['heavyRain'],
        fog: { enabled: true, density: 0.02, color: 0x3d5a7a },
        skyColor: { top: 0x2d4a6a, bottom: 0x4a6a8a },
        sunIntensity: 0.1,
        ambientIntensity: 0.5,
        groundWetness: 1.0,
        postProcessing: ['colorCorrection', 'vignette', 'filmGrain', 'chromaticAberration'],
        colorGrade: { saturation: 0.5, contrast: 0.85, brightness: -0.15, temperature: -150 }
    },
    thunderstorm: {
        name: 'गरज के साथ बारिश',
        particles: ['heavyRain'],
        fog: { enabled: true, density: 0.025, color: 0x2d3a4a },
        skyColor: { top: 0x1a2a3a, bottom: 0x3a4a5a },
        sunIntensity: 0.05,
        ambientIntensity: 0.4,
        groundWetness: 1.0,
        lightning: true,
        lightningInterval: { min: 3, max: 8 },
        postProcessing: ['colorCorrection', 'vignette', 'filmGrain', 'bloom', 'chromaticAberration'],
        colorGrade: { saturation: 0.4, contrast: 1.1, brightness: -0.2, temperature: -200 }
    },
    lightSnow: {
        name: 'हल्की बर्फ',
        particles: ['snow'],
        fog: { enabled: true, density: 0.008, color: 0xdddddd },
        skyColor: { top: 0xbbccdd, bottom: 0xdddddd },
        sunIntensity: 0.5,
        ambientIntensity: 0.8,
        postProcessing: ['colorCorrection'],
        colorGrade: { saturation: 0.7, contrast: 0.9, brightness: 0.1, temperature: 50 }
    },
    snow: {
        name: 'बर्फ',
        particles: ['snow'],
        fog: { enabled: true, density: 0.015, color: 0xcccccc },
        skyColor: { top: 0x99aacc, bottom: 0xcccccc },
        sunIntensity: 0.3,
        ambientIntensity: 0.9,
        postProcessing: ['colorCorrection', 'vignette'],
        colorGrade: { saturation: 0.6, contrast: 0.85, brightness: 0.15, temperature: 100 }
    },
    blizzard: {
        name: 'बर्फीला तूफान',
        particles: ['heavySnow'],
        fog: { enabled: true, density: 0.03, color: 0xaaaaaa },
        skyColor: { top: 0x778899, bottom: 0xaaaaaa },
        sunIntensity: 0.1,
        ambientIntensity: 0.8,
        wind: 15,
        postProcessing: ['colorCorrection', 'vignette', 'filmGrain', 'motionBlur'],
        colorGrade: { saturation: 0.3, contrast: 0.8, brightness: 0.1, temperature: 150 }
    },
    foggy: {
        name: 'कोहरा',
        particles: ['fog'],
        fog: { enabled: true, density: 0.04, color: 0xaaaaaa },
        skyColor: { top: 0x999999, bottom: 0xbbbbbb },
        sunIntensity: 0.2,
        ambientIntensity: 0.7,
        postProcessing: ['colorCorrection', 'vignette', 'depthOfField'],
        colorGrade: { saturation: 0.4, contrast: 0.7, brightness: -0.05, temperature: 0 }
    },
    misty: {
        name: 'धुंध',
        particles: ['mist'],
        fog: { enabled: true, density: 0.02, color: 0xcccccc },
        skyColor: { top: 0xbbbbbb, bottom: 0xdddddd },
        sunIntensity: 0.4,
        ambientIntensity: 0.8,
        postProcessing: ['colorCorrection', 'depthOfField'],
        colorGrade: { saturation: 0.6, contrast: 0.8, brightness: 0.05, temperature: 50 }
    },
    dusty: {
        name: 'धूल भरा',
        particles: ['dust'],
        fog: { enabled: true, density: 0.015, color: 0xc9b896 },
        skyColor: { top: 0xd4c4a8, bottom: 0xe4d4b8 },
        sunIntensity: 0.8,
        ambientIntensity: 0.7,
        postProcessing: ['colorCorrection', 'filmGrain'],
        colorGrade: { saturation: 1.0, contrast: 1.0, brightness: 0, temperature: 200 }
    },
    sandstorm: {
        name: 'रेत का तूफान',
        particles: ['sandstorm'],
        fog: { enabled: true, density: 0.04, color: 0xd2b48c },
        skyColor: { top: 0xc9b896, bottom: 0xd2b48c },
        sunIntensity: 0.3,
        ambientIntensity: 0.5,
        wind: 20,
        postProcessing: ['colorCorrection', 'vignette', 'filmGrain', 'motionBlur', 'chromaticAberration'],
        colorGrade: { saturation: 0.8, contrast: 0.9, brightness: -0.1, temperature: 300 }
    },
    underwater: {
        name: 'पानी के नीचे',
        particles: ['bubbles'],
        fog: { enabled: true, density: 0.03, color: 0x006994 },
        skyColor: { top: 0x004d7a, bottom: 0x0088cc },
        sunIntensity: 0.3,
        ambientIntensity: 0.5,
        caustics: true,
        postProcessing: ['colorCorrection', 'depthOfField', 'chromaticAberration'],
        colorGrade: { saturation: 1.2, contrast: 1.1, brightness: -0.1, temperature: -300 }
    },
    volcanic: {
        name: 'ज्वालामुखी/राख',
        particles: ['ash', 'embers'],
        fog: { enabled: true, density: 0.03, color: 0x332211 },
        skyColor: { top: 0x4a2a1a, bottom: 0x6a3a1a },
        sunIntensity: 0.5,
        ambientIntensity: 0.4,
        postProcessing: ['colorCorrection', 'vignette', 'bloom', 'filmGrain'],
        colorGrade: { saturation: 1.3, contrast: 1.2, brightness: -0.1, temperature: 500 }
    },
    magical: {
        name: 'जादुई',
        particles: ['magic', 'fireflies'],
        fog: { enabled: true, density: 0.01, color: 0xffddaa },
        skyColor: { top: 0x8866aa, bottom: 0xffaacc },
        sunIntensity: 0.8,
        ambientIntensity: 0.7,
        postProcessing: ['colorCorrection', 'bloom', 'lensFlare', 'godRays'],
        colorGrade: { saturation: 1.3, contrast: 1.1, brightness: 0.1, temperature: 100 }
    },
    nightClear: {
        name: 'साफ रात',
        particles: [],
        fog: { enabled: false },
        skyColor: { top: 0x0a0a2a, bottom: 0x1a1a3a },
        sunIntensity: 0,
        moonIntensity: 0.5,
        ambientIntensity: 0.2,
        stars: true,
        postProcessing: ['colorCorrection', 'vignette', 'filmGrain'],
        colorGrade: { saturation: 0.8, contrast: 1.1, brightness: -0.2, temperature: -200 }
    },
    nightRain: {
        name: 'रात में बारिश',
        particles: ['rain'],
        fog: { enabled: true, density: 0.02, color: 0x1a2a3a },
        skyColor: { top: 0x0a1a2a, bottom: 0x1a2a3a },
        sunIntensity: 0,
        moonIntensity: 0.2,
        ambientIntensity: 0.15,
        groundWetness: 1.0,
        postProcessing: ['colorCorrection', 'vignette', 'filmGrain', 'bloom'],
        colorGrade: { saturation: 0.5, contrast: 1.2, brightness: -0.3, temperature: -200 }
    },
    sunset: {
        name: 'सूर्यास्त',
        particles: [],
        fog: { enabled: true, density: 0.008, color: 0xffaa66 },
        skyColor: { top: 0xff6b35, bottom: 0xffcc70 },
        sunIntensity: 1.5,
        ambientIntensity: 0.8,
        sunAngle: 10,
        postProcessing: ['colorCorrection', 'bloom', 'godRays', 'lensFlare'],
        colorGrade: { saturation: 1.4, contrast: 1.1, brightness: 0.1, temperature: 1000 }
    },
    goldenHour: {
        name: 'गोल्डन आवर',
        particles: ['dust', 'pollen'],
        fog: { enabled: true, density: 0.005, color: 0xffddaa },
        skyColor: { top: 0xff9955, bottom: 0xffddaa },
        sunIntensity: 1.3,
        ambientIntensity: 0.9,
        sunAngle: 20,
        postProcessing: ['colorCorrection', 'bloom', 'godRays', 'filmGrain'],
        colorGrade: { saturation: 1.2, contrast: 1.05, brightness: 0.05, temperature: 800 }
    }
};

// ========================================
// Effect Manager Class
// ========================================

export class EffectManager {
    constructor(three) {
        this.three = three;
        this.THREE = three.THREE;
        this.particleSystems = new Map();
        this.activeWeather = 'clear';
        this.effectComposer = null;
        this.postProcessingPasses = new Map();
        this.lightningTimer = null;
        this.causticsTimer = null;
        this.time = 0;
    }

    // Initialize post-processing
    initPostProcessing() {
        const { EffectComposer } = require('three/addons/postprocessing/EffectComposer.js');
        const { RenderPass } = require('three/addons/postprocessing/RenderPass.js');
        const { ShaderPass } = require('three/addons/postprocessing/ShaderPass.js');
        
        this.effectComposer = new EffectComposer(this.three.renderer);
        this.effectComposer.addPass(new RenderPass(this.three.scene, this.three.camera));
        
        // Add default FXAA
        const { FXAAShader } = require('three/addons/shaders/FXAAShader.js');
        const fxaaPass = new ShaderPass(FXAAShader);
        const pixelRatio = this.three.renderer.getPixelRatio();
        fxaaPass.material.uniforms['resolution'].value.set(
            1 / (window.innerWidth * pixelRatio),
            1 / (window.innerHeight * pixelRatio)
        );
        this.effectComposer.addPass(fxaaPass);
    }

    // Apply weather preset
    applyWeather(weatherName) {
        const preset = WEATHER_PRESETS[weatherName];
        if (!preset) {
            console.warn(`Weather preset "${weatherName}" not found`);
            return;
        }

        this.activeWeather = weatherName;
        this.clearParticles();

        // Apply particles
        preset.particles.forEach(particleType => {
            this.createParticleSystem(particleType);
        });

        // Apply fog
        if (preset.fog.enabled) {
            this.three.scene.fog = new this.THREE.FogExp2(preset.fog.color, preset.fog.density);
        } else {
            this.three.scene.fog = null;
        }

        // Apply sky colors
        this.updateSkyColors(preset.skyColor.top, preset.skyColor.bottom);

        // Apply lighting
        this.updateLighting(preset);

        // Apply post-processing
        this.applyPostProcessing(preset.postProcessing, preset.colorGrade);

        // Special effects
        if (preset.lightning) this.startLightning(preset.lightningInterval);
        else this.stopLightning();

        if (preset.caustics) this.startCaustics();
        else this.stopCaustics();

        // Wind
        if (preset.wind) this.setGlobalWind(preset.wind);
    }

    // Create particle system
    createParticleSystem(typeName) {
        const type = PARTICLE_TYPES[typeName];
        if (!type) return;

        const { scene } = this.three;
        const THREE = this.THREE;

        const count = type.particleCount;
        const spread = type.spread;
        const geometry = new THREE.BufferGeometry();
        
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const lifetimes = new Float32Array(count);
        const maxLifetimes = new Float32Array(count);
        const colors = new Float32Array(count * 3);
        const opacities = new Float32Array(count);
        const rotations = new Float32Array(count);
        const rotationSpeeds = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            this.resetParticle(i, positions, velocities, sizes, lifetimes, maxLifetimes, colors, opacities, rotations, rotationSpeeds, type, spread);
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1));
        geometry.setAttribute('maxLifetime', new THREE.BufferAttribute(maxLifetimes, 1));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
        geometry.setAttribute('rotation', new THREE.BufferAttribute(rotations, 1));
        geometry.setAttribute('rotationSpeed', new THREE.BufferAttribute(rotationSpeeds, 1));

        let material;
        if (type.glow) {
            material = new THREE.PointsMaterial({
                size: type.size,
                vertexColors: true,
                transparent: true,
                opacity: type.opacity,
                sizeAttenuation: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
        } else {
            material = new THREE.PointsMaterial({
                size: type.size,
                vertexColors: true,
                transparent: true,
                opacity: type.opacity,
                sizeAttenuation: true,
                depthWrite: false
            });
        }

        const particles = new THREE.Points(geometry, material);
        particles.userData = { type: typeName, typeConfig: type };
        scene.add(particles);
        this.particleSystems.set(typeName, particles);
    }

    resetParticle(i, positions, velocities, sizes, lifetimes, maxLifetimes, colors, opacities, rotations, rotationSpeeds, type, spread) {
        const i3 = i * 3;
        
        // Position
        positions[i3] = (Math.random() - 0.5) * spread;
        positions[i3 + 1] = Math.random() * spread * (type.groundHugging ? 0.3 : 1) + (type.groundHugging ? 1 : 0);
        positions[i3 + 2] = (Math.random() - 0.5) * spread;

        // Velocity
        velocities[i3] = (Math.random() - 0.5) * type.wind;
        velocities[i3 + 1] = -type.speed * (0.5 + Math.random() * 0.5);
        velocities[i3 + 2] = (Math.random() - 0.5) * type.wind * 0.5;

        // Size
        sizes[i] = type.size * (0.5 + Math.random() * 0.5);

        // Lifetime
        const lifetime = type.lifetime * (0.5 + Math.random() * 0.5);
        lifetimes[i] = lifetime;
        maxLifetimes[i] = lifetime;

        // Color
        if (type.colors) {
            const color = new THREE.Color(type.colors[Math.floor(Math.random() * type.colors.length)]);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        } else {
            const color = new THREE.Color(type.color);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        // Opacity
        opacities[i] = type.opacity * (0.5 + Math.random() * 0.5);

        // Rotation
        rotations[i] = Math.random() * Math.PI * 2;
        rotationSpeeds[i] = (Math.random() - 0.5) * 2;
    }

    // Update particles
    updateParticles(deltaTime) {
        this.time += deltaTime;
        
        this.particleSystems.forEach((particles, typeName) => {
            const type = particles.userData.typeConfig;
            const geometry = particles.geometry;
            const positions = geometry.attributes.position.array;
            const velocities = geometry.attributes.velocity.array;
            const lifetimes = geometry.attributes.lifetime.array;
            const maxLifetimes = geometry.attributes.maxLifetime.array;
            const sizes = geometry.attributes.size.array;
            const rotations = geometry.attributes.rotation.array;
            const rotationSpeeds = geometry.attributes.rotationSpeed.array;
            const opacities = geometry.attributes.opacity.array;
            const count = type.particleCount;

            for (let i = 0; i < count; i++) {
                const i3 = i * 3;
                
                // Update lifetime
                lifetimes[i] -= deltaTime;
                
                if (lifetimes[i] <= 0) {
                    // Reset particle
                    this.resetParticle(i, positions, velocities, sizes, lifetimes, maxLifetimes, 
                        geometry.attributes.color.array, opacities, rotations, rotationSpeeds, type, type.spread);
                    continue;
                }

                // Update position
                positions[i3] += velocities[i3] * deltaTime;
                positions[i3 + 1] += velocities[i3 + 1] * deltaTime;
                positions[i3 + 2] += velocities[i3 + 2] * deltaTime;

                // Apply gravity
                velocities[i3 + 1] -= type.gravity * deltaTime;

                // Apply wind
                velocities[i3] += (Math.random() - 0.5) * 0.1 * deltaTime;
                velocities[i3 + 2] += (Math.random() - 0.5) * 0.1 * deltaTime;

                // Wobble
                if (type.wobble) {
                    positions[i3] += Math.sin(this.time * 2 + i) * 0.1 * deltaTime;
                    positions[i3 + 2] += Math.cos(this.time * 2 + i) * 0.1 * deltaTime;
                }

                // Rotation
                if (type.rotation) {
                    rotations[i] += rotationSpeeds[i] * deltaTime;
                }

                // Fade out near end of life
                const lifeRatio = lifetimes[i] / maxLifetimes[i];
                if (lifeRatio < 0.1) {
                    opacities[i] *= 0.95;
                }

                // Expand (for smoke/steam)
                if (type.expand) {
                    sizes[i] += deltaTime * 0.2;
                    opacities[i] *= 0.98;
                }

                // Blink (for fireflies)
                if (type.blink) {
                    opacities[i] = 0.5 + 0.5 * Math.sin(this.time * 5 + i * 10);
                }

                // Boundary check - wrap around
                const halfSpread = type.spread / 2;
                if (positions[i3 + 1] < -halfSpread) {
                    positions[i3 + 1] = halfSpread;
                    lifetimes[i] = maxLifetimes[i];
                }
                if (positions[i3] < -halfSpread) positions[i3] = halfSpread;
                if (positions[i3] > halfSpread) positions[i3] = -halfSpread;
                if (positions[i3 + 2] < -halfSpread) positions[i3 + 2] = halfSpread;
                if (positions[i3 + 2] > halfSpread) positions[i3 + 2] = -halfSpread;
            }

            geometry.attributes.position.needsUpdate = true;
            geometry.attributes.lifetime.needsUpdate = true;
            geometry.attributes.rotation.needsUpdate = true;
            geometry.attributes.opacity.needsUpdate = true;
            geometry.attributes.size.needsUpdate = true;
        });
    }

    // Clear all particles
    clearParticles() {
        this.particleSystems.forEach(particles => {
            this.three.scene.remove(particles);
            particles.geometry.dispose();
            particles.material.dispose();
        });
        this.particleSystems.clear();
    }

    // Update sky colors
    updateSkyColors(topColor, bottomColor) {
        if (this.three.skySphere && this.three.skySphere.material.uniforms) {
            this.three.skySphere.material.uniforms.topColor.value.setHex(topColor);
            this.three.skySphere.material.uniforms.bottomColor.value.setHex(bottomColor);
        }
    }

    // Update lighting
    updateLighting(preset) {
        if (this.three.sunLight) {
            this.three.sunLight.intensity = preset.sunIntensity || 1;
        }
        if (this.three.ambientLight) {
            this.three.ambientLight.intensity = preset.ambientIntensity || 0.6;
        }
        if (this.three.moonLight) {
            this.three.moonLight.intensity = preset.moonIntensity || 0;
        }
    }

    // Apply post-processing effects
    applyPostProcessing(effectNames, colorGrade) {
        // This would require importing specific post-processing passes
        // For now, we'll apply color grading through renderer settings
        if (colorGrade) {
            this.three.renderer.toneMappingExposure = 1 + (colorGrade.brightness || 0);
        }
    }

    // Lightning effect
    startLightning(interval) {
        this.stopLightning();
        const triggerLightning = () => {
            this.flashLightning();
            const nextInterval = interval.min * 1000 + Math.random() * (interval.max - interval.min) * 1000;
            this.lightningTimer = setTimeout(triggerLightning, nextInterval);
        };
        triggerLightning();
    }

    stopLightning() {
        if (this.lightningTimer) {
            clearTimeout(this.lightningTimer);
            this.lightningTimer = null;
        }
    }

    flashLightning() {
        const originalIntensity = this.three.ambientLight?.intensity || 0.6;
        const originalSunIntensity = this.three.sunLight?.intensity || 1;
        
        // Flash
        if (this.three.ambientLight) this.three.ambientLight.intensity = 3;
        if (this.three.sunLight) this.three.sunLight.intensity = 5;
        this.three.scene.background = new this.THREE.Color(0xffffff);
        
        // Add brief directional flash
        const flashLight = new this.THREE.DirectionalLight(0xffffff, 10);
        flashLight.position.set(
            (Math.random() - 0.5) * 100,
            100,
            (Math.random() - 0.5) * 100
        );
        this.three.scene.add(flashLight);
        
        // Restore after brief moment
        setTimeout(() => {
            if (this.three.ambientLight) this.three.ambientLight.intensity = originalIntensity;
            if (this.three.sunLight) this.three.sunLight.intensity = originalSunIntensity;
            this.three.scene.background = null;
            this.three.scene.remove(flashLight);
        }, 50 + Math.random() * 100);
        
        // Thunder sound (visual only - would trigger audio)
        setTimeout(() => {
            this.createThunderFlash();
        }, 1000 + Math.random() * 2000);
    }

    createThunderFlash() {
        // Subtle secondary flash
        if (this.three.ambientLight) {
            this.three.ambientLight.intensity *= 1.5;
            setTimeout(() => {
                if (this.three.ambientLight) this.three.ambientLight.intensity /= 1.5;
            }, 50);
        }
    }

    // Caustics for underwater
    startCaustics() {
        this.causticsTimer = setInterval(() => {
            // Would animate caustics texture on ground
        }, 100);
    }

    stopCaustics() {
        if (this.causticsTimer) {
            clearInterval(this.causticsTimer);
            this.causticsTimer = null;
        }
    }

    setGlobalWind(speed) {
        this.globalWind = speed;
    }

    // Update loop
    update(deltaTime) {
        this.updateParticles(deltaTime);
    }

    // Dispose
    dispose() {
        this.clearParticles();
        this.stopLightning();
        this.stopCaustics();
        if (this.effectComposer) {
            this.effectComposer.dispose();
        }
    }
}

// ========================================
// Screen Space Effects (Shaders)
// ========================================

export const EFFECT_SHADERS = {
    // Color grading shader
    colorCorrection: {
        uniforms: {
            tDiffuse: { value: null },
            saturation: { value: 1.0 },
            contrast: { value: 1.0 },
            brightness: { value: 0.0 },
            temperature: { value: 0.0 }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform sampler2D tDiffuse;
            uniform float saturation;
            uniform float contrast;
            uniform float brightness;
            uniform float temperature;
            varying vec2 vUv;
            
            vec3 rgb2hsv(vec3 c) {
                vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
                vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
                vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
                float d = q.x - min(q.w, q.y);
                float e = 1.0e-10;
                return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
            }
            
            vec3 hsv2rgb(vec3 c) {
                vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
            }
            
            void main() {
                vec4 color = texture2D(tDiffuse, vUv);
                vec3 rgb = color.rgb;
                
                // Brightness
                rgb += brightness;
                
                // Contrast
                rgb = (rgb - 0.5) * contrast + 0.5;
                
                // Saturation
                vec3 hsv = rgb2hsv(rgb);
                hsv.y *= saturation;
                rgb = hsv2rgb(hsv);
                
                // Temperature (warm/cool)
                if (temperature != 0.0) {
                    float t = temperature / 1000.0;
                    rgb.r += t * 0.1;
                    rgb.b -= t * 0.1;
                }
                
                gl_FragColor = vec4(clamp(rgb, 0.0, 1.0), color.a);
            }
        `
    },
    
    // Vignette shader
    vignette: {
        uniforms: {
            tDiffuse: { value: null },
            darkness: { value: 0.5 },
            offset: { value: 0.5 }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform sampler2D tDiffuse;
            uniform float darkness;
            uniform float offset;
            varying vec2 vUv;
            
            void main() {
                vec4 color = texture2D(tDiffuse, vUv);
                vec2 center = vUv - 0.5;
                float dist = length(center) * 2.0;
                float vignette = smoothstep(offset, 1.0, dist);
                vignette = 1.0 - vignette * darkness;
                gl_FragColor = vec4(color.rgb * vignette, color.a);
            }
        `
    },
    
    // Film grain shader
    filmGrain: {
        uniforms: {
            tDiffuse: { value: null },
            intensity: { value: 0.3 },
            size: { value: 1.0 },
            time: { value: 0.0 }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform sampler2D tDiffuse;
            uniform float intensity;
            uniform float size;
            uniform float time;
            varying vec2 vUv;
            
            float rand(vec2 co) {
                return fract(sin(dot(co.xy * size, vec2(12.9898, 78.233))) * 43758.5453 + time);
            }
            
            void main() {
                vec4 color = texture2D(tDiffuse, vUv);
                float grain = rand(vUv * size + time) * 2.0 - 1.0;
                gl_FragColor = vec4(color.rgb + grain * intensity * 0.1, color.a);
            }
        `
    },
    
    // Chromatic aberration shader
    chromaticAberration: {
        uniforms: {
            tDiffuse: { value: null },
            offset: { value: 0.005 }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform sampler2D tDiffuse;
            uniform float offset;
            varying vec2 vUv;
            
            void main() {
                vec2 center = vec2(0.5, 0.5);
                vec2 dir = vUv - center;
                float dist = length(dir);
                
                vec2 rUv = vUv + dir * offset * dist;
                vec2 bUv = vUv - dir * offset * dist;
                
                float r = texture2D(tDiffuse, rUv).r;
                float g = texture2D(tDiffuse, vUv).g;
                float b = texture2D(tDiffuse, bUv).b;
                
                gl_FragColor = vec4(r, g, b, 1.0);
            }
        `
    }
};

// ========================================
// Export
// ========================================

// All exports are already declared with 'export' keyword above
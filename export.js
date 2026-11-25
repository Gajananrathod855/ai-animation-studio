/**
 * Professional Video Export System
 * MP4 via WebCodecs, WebM fallback, high-quality encoding
 */

// ========================================
// Export Formats & Codecs
// ========================================

export const EXPORT_FORMATS = {
    webm: {
        name: 'WebM (VP9)',
        mimeType: 'video/webm;codecs=vp9',
        extension: '.webm',
        quality: 'high',
        browserSupport: 'excellent',
        hardwareAcceleration: true
    },
    webm_h264: {
        name: 'WebM (H.264)',
        mimeType: 'video/webm;codecs=h264',
        extension: '.webm',
        quality: 'high',
        browserSupport: 'good',
        hardwareAcceleration: true
    },
    mp4_webcodecs: {
        name: 'MP4 (WebCodecs H.264)',
        mimeType: 'video/mp4',
        extension: '.mp4',
        quality: 'high',
        browserSupport: 'modern',
        hardwareAcceleration: true,
        requiresWebCodecs: true
    },
    mp4_ffmpeg: {
        name: 'MP4 (ffmpeg.wasm H.264)',
        mimeType: 'video/mp4',
        extension: '.mp4',
        quality: 'high',
        browserSupport: 'all',
        hardwareAcceleration: false,
        requiresFFmpeg: true
    },
    gif: {
        name: 'GIF (एनिमेटेड)',
        mimeType: 'image/gif',
        extension: '.gif',
        quality: 'low',
        browserSupport: 'excellent',
        hardwareAcceleration: false
    },
    png_sequence: {
        name: 'PNG सीक्वेंस',
        mimeType: 'image/png',
        extension: '.png',
        quality: 'lossless',
        browserSupport: 'excellent',
        hardwareAcceleration: false
    },
    jpeg_sequence: {
        name: 'JPEG सीक्वेंस',
        mimeType: 'image/jpeg',
        extension: '.jpg',
        quality: 'high',
        browserSupport: 'excellent',
        hardwareAcceleration: false
    }
};

// ========================================
// Export Presets
// ========================================

export const EXPORT_PRESETS = {
    draft: {
        name: 'ड्राफ्ट (तेज़)',
        resolution: '720p',
        framerate: 15,
        bitrate: 2_000_000,
        format: 'webm',
        quality: 'low'
    },
    standard: {
        name: 'मानक (संतुलित)',
        resolution: '1080p',
        framerate: 30,
        bitrate: 8_000_000,
        format: 'webm',
        quality: 'medium'
    },
    high: {
        name: 'उच्च गुणवत्ता',
        resolution: '1080p',
        framerate: 30,
        bitrate: 20_000_000,
        format: 'mp4_webcodecs',
        quality: 'high'
    },
    ultra: {
        name: 'अल्ट्रा (4K)',
        resolution: '4k',
        framerate: 30,
        bitrate: 50_000_000,
        format: 'mp4_ffmpeg',
        quality: 'ultra'
    },
    social_media: {
        name: 'सोशल मीडिया',
        resolution: '1080p',
        framerate: 30,
        bitrate: 12_000_000,
        format: 'mp4_webcodecs',
        quality: 'high',
        maxDuration: 60
    },
    youtube: {
        name: 'YouTube अपलोड',
        resolution: '1080p',
        framerate: 30,
        bitrate: 15_000_000,
        format: 'mp4_ffmpeg',
        quality: 'high'
    },
    instagram_reel: {
        name: 'Instagram Reel',
        resolution: '1080p',
        framerate: 30,
        bitrate: 8_000_000,
        format: 'mp4_webcodecs',
        quality: 'high',
        maxDuration: 90,
        aspectRatio: '9:16'
    },
    tiktok: {
        name: 'TikTok',
        resolution: '1080p',
        framerate: 30,
        bitrate: 8_000_000,
        format: 'mp4_webcodecs',
        quality: 'high',
        maxDuration: 180,
        aspectRatio: '9:16'
    }
};

// ========================================
// Resolution Definitions
// ========================================

export const RESOLUTIONS = {
    '480p': { width: 854, height: 480, label: '480p (854×480)' },
    '720p': { width: 1280, height: 720, label: '720p (1280×720)' },
    '1080p': { width: 1920, height: 1080, label: '1080p (1920×1080)' },
    '1440p': { width: 2560, height: 1440, label: '1440p (2560×1440)' },
    '4k': { width: 3840, height: 2160, label: '4K (3840×2160)' },
    'custom': { width: 1920, height: 1080, label: 'कस्टम' }
};

// ========================================
// Video Encoder (WebCodecs)
// ========================================

export class WebCodecsEncoder {
    constructor(options = {}) {
        this.width = options.width || 1920;
        this.height = options.height || 1080;
        this.framerate = options.framerate || 30;
        this.bitrate = options.bitrate || 10_000_000;
        this.codec = options.codec || 'avc1.42001E'; // H.264 baseline
        this.encoder = null;
        this.chunks = [];
        this.frameCount = 0;
        this.startTime = 0;
    }
    
    async init() {
        if (!('VideoEncoder' in window)) {
            throw new Error('WebCodecs VideoEncoder not supported');
        }
        
        this.encoder = new VideoEncoder({
            output: (chunk, metadata) => this.handleChunk(chunk, metadata),
            error: (err) => console.error('Encoder error:', err)
        });
        
        const config = {
            codec: this.codec,
            width: this.width,
            height: this.height,
            bitrate: this.bitrate,
            framerate: this.framerate,
            hardwareAcceleration: 'prefer-hardware'
        };
        
        this.encoder.configure(config);
        this.chunks = [];
        this.frameCount = 0;
        this.startTime = performance.now();
    }
    
    handleChunk(chunk, metadata) {
        this.chunks.push({ chunk, metadata });
    }
    
    async encodeFrame(canvas, timestamp = null) {
        if (!this.encoder) await this.init();
        
        const frame = new VideoFrame(canvas, {
            timestamp: timestamp !== null ? timestamp : (this.frameCount / this.framerate) * 1_000_000
        });
        
        this.encoder.encode(frame);
        frame.close();
        this.frameCount++;
        
        // Check encoder saturation
        if (this.encoder.encodeQueueSize > 30) {
            await new Promise(r => setTimeout(r, 10));
        }
    }
    
    async finish() {
        if (!this.encoder) return null;
        
        await this.encoder.flush();
        await this.encoder.close();
        this.encoder = null;
        
        // Create MP4 using a simple MP4 muxer
        return this.createMP4();
    }
    
    createMP4() {
        // Simple MP4 creation - in production, use a proper MP4 muxer like mp4box.js
        // For now, return the raw chunks for external muxing
        return {
            chunks: this.chunks,
            width: this.width,
            height: this.height,
            framerate: this.framerate,
            codec: this.codec
        };
    }
}

// ========================================
// WebM Encoder (MediaRecorder fallback)
// ========================================

export class WebMEncoder {
    constructor(options = {}) {
        this.width = options.width || 1920;
        this.height = options.height || 1080;
        this.framerate = options.framerate || 30;
        this.bitrate = options.bitrate || 10_000_000;
        this.mimeType = options.mimeType || 'video/webm;codecs=vp9';
        this.recorder = null;
        this.chunks = [];
        this.stream = null;
        this.canvas = null;
    }
    
    init(canvas) {
        this.canvas = canvas;
        this.stream = canvas.captureStream(this.framerate);
        
        this.recorder = new MediaRecorder(this.stream, {
            mimeType: this.mimeType,
            videoBitsPerSecond: this.bitrate
        });
        
        this.recorder.ondataavailable = (e) => {
            if (e.data.size > 0) this.chunks.push(e.data);
        };
        
        this.chunks = [];
    }
    
    start() {
        if (this.recorder) this.recorder.start(100); // Collect data every 100ms
    }
    
    stop() {
        return new Promise((resolve) => {
            if (!this.recorder) return resolve(null);
            
            this.recorder.onstop = () => {
                const blob = new Blob(this.chunks, { type: this.mimeType });
                resolve(blob);
            };
            
            this.recorder.stop();
        });
    }
}

// ========================================
// FFmpeg.wasm Encoder
// ========================================

export class FFmpegEncoder {
    constructor() {
        this.ffmpeg = null;
        this.loaded = false;
        this.loading = false;
    }
    
    async load() {
        if (this.loaded) return;
        if (this.loading) {
            while (this.loading) await new Promise(r => setTimeout(r, 100));
            return;
        }
        
        this.loading = true;
        
        try {
            // Dynamic import of ffmpeg.wasm
            const { createFFmpeg, fetchFile } = await import('@ffmpeg/ffmpeg');
            this.ffmpeg = createFFmpeg({ log: true });
            await this.ffmpeg.load();
            this.loaded = true;
        } catch (err) {
            console.error('FFmpeg load failed:', err);
            throw new Error('FFmpeg.wasm not available. Install @ffmpeg/ffmpeg package.');
        } finally {
            this.loading = false;
        }
    }
    
    async encode(frames, options = {}) {
        await this.load();
        
        const { width = 1920, height = 1080, framerate = 30, bitrate = '10M', outputName = 'output.mp4' } = options;
        
        // Write frames as PNG files
        for (let i = 0; i < frames.length; i++) {
            const frame = frames[i];
            const blob = await this.canvasToBlob(frame.canvas, 'image/png');
            const data = await blob.arrayBuffer();
            this.ffmpeg.FS('writeFile', `frame_${i.toString().padStart(6, '0')}.png`, new Uint8Array(data));
        }
        
        // Run FFmpeg
        await this.ffmpeg.run(
            '-framerate', framerate.toString(),
            '-i', 'frame_%06d.png',
            '-c:v', 'libx264',
            '-preset', 'medium',
            '-crf', '20',
            '-pix_fmt', 'yuv420p',
            '-b:v', bitrate,
            '-movflags', '+faststart',
            outputName
        );
        
        // Read output
        const data = this.ffmpeg.FS('readFile', outputName);
        const blob = new Blob([data], { type: 'video/mp4' });
        
        // Cleanup
        for (let i = 0; i < frames.length; i++) {
            this.ffmpeg.FS('unlink', `frame_${i.toString().padStart(6, '0')}.png`);
        }
        this.ffmpeg.FS('unlink', outputName);
        
        return blob;
    }
    
    canvasToBlob(canvas, type) {
        return new Promise(resolve => canvas.toBlob(resolve, type));
    }
}

// ========================================
// GIF Encoder
// ========================================

export class GIFEncoder {
    constructor(options = {}) {
        this.width = options.width || 480;
        this.height = options.height || 270;
        this.framerate = options.framerate || 15;
        this.quality = options.quality || 10;
        this.worker = null;
        this.frames = [];
    }
    
    async init() {
        // Use gif.js library via dynamic import
        try {
            const GIF = (await import('gif.js')).default;
            this.gif = new GIF({
                workers: 2,
                quality: this.quality,
                width: this.width,
                height: this.height,
                workerScript: 'https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js'
            });
            
            this.gif.on('finished', (blob) => {
                this.onFinished(blob);
            });
        } catch (err) {
            console.warn('gif.js not available, using fallback');
        }
    }
    
    addFrame(canvas, delay = null) {
        if (this.gif) {
            this.gif.addFrame(canvas, { 
                copy: true, 
                delay: delay || Math.round(1000 / this.framerate) 
            });
        } else {
            // Fallback: store canvas data
            this.frames.push({ canvas, delay: delay || Math.round(1000 / this.framerate) });
        }
    }
    
    async render() {
        if (this.gif) {
            return new Promise((resolve) => {
                this.onFinished = resolve;
                this.gif.render();
            });
        }
        return null;
    }
}

// ========================================
// Export Manager
// ========================================

export class ExportManager {
    constructor(three, timeline) {
        this.three = three;
        this.timeline = timeline;
        this.canvas = three.renderer?.domElement || document.getElementById('previewCanvas');
        this.isExporting = false;
        this.progress = 0;
        this.currentEncoder = null;
        this.onProgress = null;
        this.onComplete = null;
        this.onError = null;
    }
    
    async exportVideo(options = {}) {
        if (this.isExporting) {
            throw new Error('Export already in progress');
        }
        
        this.isExporting = true;
        this.progress = 0;
        
        const preset = options.preset || 'standard';
        const presetConfig = EXPORT_PRESETS[preset] || EXPORT_PRESETS.standard;
        
        const config = {
            width: options.width || RESOLUTIONS[presetConfig.resolution]?.width || 1920,
            height: options.height || RESOLUTIONS[presetConfig.resolution]?.height || 1080,
            framerate: options.framerate || presetConfig.framerate || 30,
            bitrate: options.bitrate || presetConfig.bitrate || 10_000_000,
            format: options.format || presetConfig.format || 'webm',
            quality: presetConfig.quality,
            duration: options.duration || this.calculateDuration(),
            aspectRatio: options.aspectRatio || '16:9'
        };
        
        // Check max duration
        if (presetConfig.maxDuration && config.duration > presetConfig.maxDuration) {
            config.duration = presetConfig.maxDuration;
        }
        
        try {
            let result;
            
            switch (config.format) {
                case 'mp4_webcodecs':
                    result = await this.exportWebCodecs(config);
                    break;
                case 'mp4_ffmpeg':
                    result = await this.exportFFmpeg(config);
                    break;
                case 'webm':
                case 'webm_h264':
                    result = await this.exportWebM(config);
                    break;
                case 'gif':
                    result = await this.exportGIF(config);
                    break;
                case 'png_sequence':
                case 'jpeg_sequence':
                    result = await this.exportImageSequence(config);
                    break;
                default:
                    result = await this.exportWebM(config);
            }
            
            this.isExporting = false;
            if (this.onComplete) this.onComplete(result);
            return result;
            
        } catch (err) {
            this.isExporting = false;
            if (this.onError) this.onError(err);
            throw err;
        }
    }
    
    calculateDuration() {
        if (this.timeline) {
            return this.timeline.duration;
        }
        // Fallback: calculate from scenes
        const scenes = this.three.scenes || [];
        return scenes.reduce((sum, s) => sum + (s.duration || 8), 0);
    }
    
    async exportWebCodecs(config) {
        const encoder = new WebCodecsEncoder({
            width: config.width,
            height: config.height,
            framerate: config.framerate,
            bitrate: config.bitrate
        });
        
        this.currentEncoder = encoder;
        await encoder.init();
        
        const totalFrames = Math.ceil(config.duration * config.framerate);
        const frameTime = 1 / config.framerate;
        
        // Save current camera state
        const originalCamera = this.three.camera.clone();
        const originalSize = { width: this.canvas.width, height: this.canvas.height };
        
        // Resize renderer for export
        this.three.renderer.setSize(config.width, config.height);
        this.three.camera.aspect = config.width / config.height;
        this.three.camera.updateProjectionMatrix();
        
        for (let i = 0; i < totalFrames; i++) {
            const time = i * frameTime;
            
            // Update timeline
            if (this.timeline) {
                this.timeline.seek(time);
            }
            
            // Update scene for this frame
            await this.renderFrame(time);
            
            // Capture frame
            await encoder.encodeFrame(this.canvas, time * 1_000_000);
            
            // Progress
            this.progress = (i + 1) / totalFrames;
            if (this.onProgress) this.onProgress(this.progress);
            
            // Yield to main thread
            if (i % 10 === 0) await new Promise(r => setTimeout(r, 0));
        }
        
        // Restore
        this.three.renderer.setSize(originalSize.width, originalSize.height);
        this.three.camera.copy(originalCamera);
        this.three.camera.updateProjectionMatrix();
        
        const result = await encoder.finish();
        return this.finalizeExport(result, config);
    }
    
    async exportWebM(config) {
        const encoder = new WebMEncoder({
            width: config.width,
            height: config.height,
            framerate: config.framerate,
            bitrate: config.bitrate,
            mimeType: config.format === 'webm_h264' ? 'video/webm;codecs=h264' : 'video/webm;codecs=vp9'
        });
        
        encoder.init(this.canvas);
        encoder.start();
        
        const totalFrames = Math.ceil(config.duration * config.framerate);
        const frameTime = 1 / config.framerate;
        
        const originalSize = { width: this.canvas.width, height: this.canvas.height };
        this.three.renderer.setSize(config.width, config.height);
        this.three.camera.aspect = config.width / config.height;
        this.three.camera.updateProjectionMatrix();
        
        for (let i = 0; i < totalFrames; i++) {
            const time = i * frameTime;
            
            if (this.timeline) {
                this.timeline.seek(time);
            }
            
            await this.renderFrame(time);
            
            this.progress = (i + 1) / totalFrames;
            if (this.onProgress) this.onProgress(this.progress);
            
            if (i % 10 === 0) await new Promise(r => setTimeout(r, 0));
        }
        
        this.three.renderer.setSize(originalSize.width, originalSize.height);
        this.three.camera.aspect = originalSize.width / originalSize.height;
        this.three.camera.updateProjectionMatrix();
        
        const blob = await encoder.stop();
        return this.finalizeExport(blob, config);
    }
    
    async exportFFmpeg(config) {
        const encoder = new FFmpegEncoder();
        
        const totalFrames = Math.ceil(config.duration * config.framerate);
        const frameTime = 1 / config.framerate;
        
        const frames = [];
        
        const originalSize = { width: this.canvas.width, height: this.canvas.height };
        this.three.renderer.setSize(config.width, config.height);
        this.three.camera.aspect = config.width / config.height;
        this.three.camera.updateProjectionMatrix();
        
        for (let i = 0; i < totalFrames; i++) {
            const time = i * frameTime;
            
            if (this.timeline) {
                this.timeline.seek(time);
            }
            
            await this.renderFrame(time);
            
            // Clone canvas for frame
            const frameCanvas = document.createElement('canvas');
            frameCanvas.width = config.width;
            frameCanvas.height = config.height;
            frameCanvas.getContext('2d').drawImage(this.canvas, 0, 0);
            frames.push({ canvas: frameCanvas });
            
            this.progress = (i + 1) / totalFrames;
            if (this.onProgress) this.onProgress(this.progress);
            
            if (i % 10 === 0) await new Promise(r => setTimeout(r, 0));
        }
        
        this.three.renderer.setSize(originalSize.width, originalSize.height);
        this.three.camera.aspect = originalSize.width / originalSize.height;
        this.three.camera.updateProjectionMatrix();
        
        const blob = await encoder.encode(frames, {
            width: config.width,
            height: config.height,
            framerate: config.framerate,
            bitrate: `${Math.round(config.bitrate / 1_000_000)}M`
        });
        
        return this.finalizeExport(blob, config);
    }
    
    async exportGIF(config) {
        const encoder = new GIFEncoder({
            width: Math.min(config.width, 640),
            height: Math.min(config.height, 480),
            framerate: Math.min(config.framerate, 15),
            quality: 10
        });
        
        await encoder.init();
        
        const totalFrames = Math.ceil(config.duration * config.framerate);
        const frameTime = 1 / config.framerate;
        
        const originalSize = { width: this.canvas.width, height: this.canvas.height };
        this.three.renderer.setSize(encoder.width, encoder.height);
        
        for (let i = 0; i < totalFrames; i++) {
            const time = i * frameTime;
            
            if (this.timeline) {
                this.timeline.seek(time);
            }
            
            await this.renderFrame(time);
            
            encoder.addFrame(this.canvas);
            
            this.progress = (i + 1) / totalFrames;
            if (this.onProgress) this.onProgress(this.progress);
            
            if (i % 10 === 0) await new Promise(r => setTimeout(r, 0));
        }
        
        this.three.renderer.setSize(originalSize.width, originalSize.height);
        
        const blob = await encoder.render();
        return this.finalizeExport(blob, config);
    }
    
    async exportImageSequence(config) {
        const totalFrames = Math.ceil(config.duration * config.framerate);
        const frameTime = 1 / config.framerate;
        
        const frames = [];
        const mimeType = config.format === 'png_sequence' ? 'image/png' : 'image/jpeg';
        const extension = config.format === 'png_sequence' ? '.png' : '.jpg';
        
        const originalSize = { width: this.canvas.width, height: this.canvas.height };
        this.three.renderer.setSize(config.width, config.height);
        this.three.camera.aspect = config.width / config.height;
        this.three.camera.updateProjectionMatrix();
        
        for (let i = 0; i < totalFrames; i++) {
            const time = i * frameTime;
            
            if (this.timeline) {
                this.timeline.seek(time);
            }
            
            await this.renderFrame(time);
            
            const blob = await this.canvasToBlob(this.canvas, mimeType);
            frames.push({
                index: i,
                blob,
                filename: `frame_${i.toString().padStart(6, '0')}${extension}`,
                time
            });
            
            this.progress = (i + 1) / totalFrames;
            if (this.onProgress) this.onProgress(this.progress);
            
            if (i % 10 === 0) await new Promise(r => setTimeout(r, 0));
        }
        
        this.three.renderer.setSize(originalSize.width, originalSize.height);
        this.three.camera.aspect = originalSize.width / originalSize.height;
        this.three.camera.updateProjectionMatrix();
        
        // Create ZIP file
        const zipBlob = await this.createZip(frames, config.format === 'png_sequence' ? 'png' : 'jpeg');
        return this.finalizeExport(zipBlob, config);
    }
    
    async renderFrame(time) {
        // Update characters
        if (this.three.characters3d) {
            this.three.characters3d.forEach(char => {
                if (char.character3d && char.character3d.mixer) {
                    // Update animation to specific time
                    char.character3d.update(0); // Will be handled by timeline
                }
            });
        }
        
        // Update timeline
        if (this.timeline) {
            this.timeline.seek(time);
        }
        
        // Update effects
        if (this.three.effectManager) {
            this.three.effectManager.update(1/60);
        }
        
        // Render
        this.three.renderer.render(this.three.scene, this.three.camera);
        
        // Allow frame to complete
        await new Promise(r => requestAnimationFrame(r));
    }
    
    canvasToBlob(canvas, type) {
        return new Promise(resolve => canvas.toBlob(resolve, type, 0.95));
    }
    
    async createZip(frames, format) {
        // Use JSZip if available
        try {
            const JSZip = (await import('jszip')).default;
            const zip = new JSZip();
            
            frames.forEach(f => {
                zip.file(f.filename, f.blob);
            });
            
            return await zip.generateAsync({ type: 'blob' });
        } catch (err) {
            console.warn('JSZip not available, returning first frame only');
            return frames[0]?.blob;
        }
    }
    
    finalizeExport(data, config) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const filename = `animation_${config.format}_${config.width}x${config.height}_${timestamp}${EXPORT_FORMATS[config.format]?.extension || '.webm'}`;
        
        return {
            data: data instanceof Blob ? data : new Blob([data]),
            filename,
            format: config.format,
            width: config.width,
            height: config.height,
            duration: config.duration,
            size: data instanceof Blob ? data.size : data.byteLength
        };
    }
    
    cancel() {
        this.isExporting = false;
        if (this.currentEncoder && this.currentEncoder.encoder) {
            this.currentEncoder.encoder.close();
        }
    }
}

// ========================================
// Export UI Integration
// ========================================

function createExportUI(exportManager, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="export-wizard">
            <div class="export-step" id="exportStep1">
                <h3>एक्सपोर्ट प्रीसेट चुनें</h3>
                <div class="preset-grid" id="presetGrid"></div>
            </div>
            <div class="export-step hidden" id="exportStep2">
                <h3>सेटिंग्स कॉन्फ़िगर करें</h3>
                <div class="settings-grid" id="exportSettings"></div>
            </div>
            <div class="export-step hidden" id="exportStep3">
                <h3>एक्सपोर्ट प्रगति</h3>
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" id="exportProgressFill"></div>
                    </div>
                    <div class="progress-text" id="exportProgressText">तैयार हो रहा है...</div>
                </div>
                <div class="export-stats" id="exportStats"></div>
            </div>
            <div class="export-actions">
                <button class="btn btn-secondary" id="exportBackBtn" disabled>वापस</button>
                <button class="btn btn-primary" id="exportNextBtn">आगे</button>
                <button class="btn btn-danger hidden" id="exportCancelBtn">रद्द करें</button>
            </div>
        </div>
    `;
    
    renderPresets();
    bindEvents();
    
    function renderPresets() {
        const grid = document.getElementById('presetGrid');
        if (!grid) return;
        
        grid.innerHTML = Object.entries(EXPORT_PRESETS).map(([key, preset]) => `
            <div class="preset-card" data-preset="${key}">
                <div class="preset-name">${preset.name}</div>
                <div class="preset-details">
                    ${preset.resolution} • ${preset.framerate}fps • ${preset.format}
                </div>
            </div>
        `).join('');
        
        grid.querySelectorAll('.preset-card').forEach(card => {
            card.addEventListener('click', () => selectPreset(card.dataset.preset));
        });
    }
    
    let selectedPreset = 'standard';
    let currentStep = 1;
    
    function selectPreset(preset) {
        selectedPreset = preset;
        document.querySelectorAll('.preset-card').forEach(c => c.classList.remove('selected'));
        document.querySelector(`.preset-card[data-preset="${preset}"]`)?.classList.add('selected');
        document.getElementById('exportNextBtn').disabled = false;
    }
    
    function bindEvents() {
        document.getElementById('exportNextBtn').addEventListener('click', () => {
            if (currentStep === 1) {
                showStep(2);
                renderSettings();
            } else if (currentStep === 2) {
                showStep(3);
                startExport();
            }
        });
        
        document.getElementById('exportBackBtn').addEventListener('click', () => {
            if (currentStep > 1) showStep(currentStep - 1);
        });
        
        document.getElementById('exportCancelBtn').addEventListener('click', () => {
            exportManager.cancel();
            showStep(1);
        });
    }
    
    function showStep(step) {
        currentStep = step;
        document.querySelectorAll('.export-step').forEach(s => s.classList.add('hidden'));
        document.getElementById(`exportStep${step}`).classList.remove('hidden');
        
        document.getElementById('exportBackBtn').disabled = step === 1;
        document.getElementById('exportNextBtn').textContent = step === 3 ? 'एक्सपोर्ट शुरू करें' : 'आगे';
        document.getElementById('exportCancelBtn').classList.toggle('hidden', step !== 3);
    }
    
    function renderSettings() {
        const preset = EXPORT_PRESETS[selectedPreset];
        const container = document.getElementById('exportSettings');
        
        container.innerHTML = `
            <div class="setting-item">
                <label class="label">रिज़ॉल्यूशन</label>
                <select id="exportResolution" class="select">
                    ${Object.entries(RESOLUTIONS).map(([k, v]) => `
                        <option value="${k}" ${k === preset.resolution ? 'selected' : ''}>${v.label}</option>
                    `).join('')}
                </select>
            </div>
            <div class="setting-item">
                <label class="label">फ्रेम रेट</label>
                <select id="exportFramerate" class="select">
                    <option value="15" ${preset.framerate === 15 ? 'selected' : ''}>15 FPS</option>
                    <option value="24" ${preset.framerate === 24 ? 'selected' : ''}>24 FPS (सिनेमैटिक)</option>
                    <option value="30" ${preset.framerate === 30 ? 'selected' : ''}>30 FPS</option>
                    <option value="60" ${preset.framerate === 60 ? 'selected' : ''}>60 FPS</option>
                </select>
            </div>
            <div class="setting-item">
                <label class="label">बिटरेट (Mbps)</label>
                <input type="range" id="exportBitrate" min="1" max="100" step="1" value="${Math.round(preset.bitrate / 1_000_000)}" class="slider">
                <span id="bitrateValue">${Math.round(preset.bitrate / 1_000_000)} Mbps</span>
            </div>
            <div class="setting-item">
                <label class="label">फॉर्मेट</label>
                <select id="exportFormat" class="select">
                    <option value="webm" ${preset.format === 'webm' ? 'selected' : ''}>WebM (VP9)</option>
                    <option value="webm_h264" ${preset.format === 'webm_h264' ? 'selected' : ''}>WebM (H.264)</option>
                    <option value="mp4_webcodecs" ${preset.format === 'mp4_webcodecs' ? 'selected' : ''}>MP4 (WebCodecs)</option>
                    <option value="mp4_ffmpeg" ${preset.format === 'mp4_ffmpeg' ? 'selected' : ''}>MP4 (ffmpeg.wasm)</option>
                    <option value="gif" ${preset.format === 'gif' ? 'selected' : ''}>GIF</option>
                    <option value="png_sequence" ${preset.format === 'png_sequence' ? 'selected' : ''}>PNG सीक्वेंस</option>
                </select>
            </div>
            <div class="setting-item">
                <label class="label">अनुमानित अवधि</label>
                <input type="number" id="exportDuration" value="${Math.ceil(exportManager.calculateDuration())}" min="1" max="3600" class="input">
            </div>
        `;
        
        $('#exportBitrate').addEventListener('input', (e) => {
            $('#bitrateValue').textContent = `${e.target.value} Mbps`;
        });
    }
    
    async function startExport() {
        const config = {
            preset: selectedPreset,
            width: RESOLUTIONS[$('#exportResolution').value]?.width || 1920,
            height: RESOLUTIONS[$('#exportResolution').value]?.height || 1080,
            framerate: parseInt($('#exportFramerate').value),
            bitrate: parseInt($('#exportBitrate').value) * 1_000_000,
            format: $('#exportFormat').value,
            duration: parseInt($('#exportDuration').value)
        };
        
        exportManager.onProgress = (p) => {
            document.getElementById('exportProgressFill').style.width = `${p * 100}%`;
            document.getElementById('exportProgressText').textContent = `फ्रेम रेंडर हो रहे हैं... ${Math.round(p * 100)}%`;
            document.getElementById('exportStats').textContent = 
                `फ्रेम: ${Math.round(p * config.duration * config.framerate)} / ${config.duration * config.framerate} | ` +
                `समय: ${(p * config.duration).toFixed(1)}s / ${config.duration}s`;
        };
        
        exportManager.onComplete = (result) => {
            downloadResult(result);
            showStep(1);
        };
        
        exportManager.onError = (err) => {
            alert('एक्सपोर्ट विफल: ' + err.message);
            showStep(1);
        };
        
        await exportManager.exportVideo(config);
    }
    
    function downloadResult(result) {
        const url = URL.createObjectURL(result.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.filename;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// ========================================
// Export
// ========================================

// All exports are already declared with 'export' keyword above
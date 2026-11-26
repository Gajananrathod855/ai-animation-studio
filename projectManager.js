/**
 * Project Management System
 * Save, load, autosave, and project file handling
 */

// ========================================
// Project Schema Version
// ========================================

export const PROJECT_VERSION = '1.0.0';

export const PROJECT_SCHEMA = {
    version: PROJECT_VERSION,
    metadata: {
        title: '',
        description: '',
        author: '',
        createdAt: 0,
        updatedAt: 0,
        duration: 0,
        thumbnail: null
    },
    settings: {
        resolution: '1080p',
        framerate: 30,
        quality: 'high',
        format: 'webm',
        aspectRatio: '16:9'
    },
    story: '',
    script: null,
    scenes: [],
    characters: [],
    timeline: null,
    assets: [],
    audio: {
        musicGenre: 'cinematic',
        musicTempo: 80,
        backgroundMusic: null,
        soundEffects: [],
        volumes: {
            master: 1,
            music: 0.7,
            sfx: 0.8,
            voice: 1
        }
    },
    visualEffects: {
        weather: 'clear',
        weatherIntensity: 0.5,
        timeOfDay: 'noon',
        postProcessing: {
            bloom: false,
            vignette: false,
            filmGrain: false,
            chromaticAberration: false,
            saturation: 1,
            contrast: 1,
            brightness: 0,
            temperature: 0
        }
    },
    camera: {
        type: 'perspective',
        fov: 50,
        distance: 15,
        height: 5,
        angle: 0,
        movement: 'static',
        speed: 1.0
    },
    lighting: {
        environment: 'studio',
        ambientIntensity: 0.6,
        exposure: 1.0,
        shadowQuality: 'high'
    }
};

// ========================================
// Project Manager Class
// ========================================

export class ProjectManager {
    constructor(appState) {
        this.appState = appState;
        this.currentProject = null;
        this.projectPath = null;
        this.autosaveInterval = null;
        this.autosaveEnabled = true;
        this.autosaveDelay = 30000; // 30 seconds
        this.hasUnsavedChanges = false;
        this.maxAutosaves = 5;
        this.autosaveKey = 'ai_animation_autosave';
    }

    // Initialize project manager
    init() {
        // Load autosave if exists
        this.loadAutosave();
        
        // Set up autosave
        this.startAutosave();
        
        // Track changes
        this.setupChangeTracking();
        
        // Handle before unload
        window.addEventListener('beforeunload', (e) => {
            if (this.hasUnsavedChanges) {
                this.saveAutosave();
                e.preventDefault();
                e.returnValue = 'आपके पास सेव न किए गए बदलाव हैं। क्या आप वाकई छोड़ना चाहते हैं?';
                return e.returnValue;
            }
        });
    }

    // Set up change tracking
    setupChangeTracking() {
        // Mark as changed when key data modifies
        const originalSetStory = this.appState.setStory;
        this.appState.setStory = (story) => {
            originalSetStory(story);
            this.markChanged();
        };

        // Track scene changes
        const originalSaveScene = this.appState.saveSceneEdit;
        if (originalSaveScene) {
            this.appState.saveSceneEdit = (...args) => {
                const result = originalSaveScene(...args);
                this.markChanged();
                return result;
            };
        }
    }

    // Mark project as having unsaved changes
    markChanged() {
        this.hasUnsavedChanges = true;
        this.updateProjectTitle();
    }

    // Update window title with project status
    updateProjectTitle() {
        const title = this.currentProject?.metadata?.title || 'नया प्रोजेक्ट';
        const suffix = this.hasUnsavedChanges ? ' ●' : '';
        document.title = `${title}${suffix} - AI Animation Studio`;
    }

    // Create new project
    createNewProject(title = 'नया प्रोजेक्ट') {
        this.currentProject = JSON.parse(JSON.stringify(PROJECT_SCHEMA));
        this.currentProject.metadata.title = title;
        this.currentProject.metadata.createdAt = Date.now();
        this.currentProject.metadata.updatedAt = Date.now();
        this.projectPath = null;
        this.hasUnsavedChanges = false;
        this.updateProjectTitle();
        return this.currentProject;
    }

    // Collect all current app state into project
    collectProjectData() {
        if (!this.currentProject) {
            this.createNewProject();
        }

        const project = this.currentProject;
        
        // Metadata
        project.metadata.updatedAt = Date.now();
        project.metadata.duration = this.calculateTotalDuration();
        
        // Settings
        project.settings.resolution = this.appState.settings?.resolution || '1080p';
        project.settings.framerate = this.appState.settings?.framerate || 30;
        project.settings.quality = this.appState.settings?.quality || 'high';
        project.settings.format = this.appState.settings?.format || 'webm';
        
        // Story
        project.story = this.appState.story || '';
        
        // Script
        if (this.appState.scriptManager) {
            project.script = this.appState.scriptManager.exportScript();
        }
        
        // Scenes
        project.scenes = this.appState.scenes ? this.appState.scenes.map(scene => this.serializeScene(scene)) : [];
        
        // Characters
        project.characters = this.appState.three?.characters3d ? 
            this.appState.three.characters3d.map(c => this.serializeCharacter(c)) : [];
        
        // Timeline
        if (this.appState.timeline) {
            project.timeline = this.appState.timeline.exportJSON();
        }
        
        // Assets
        project.assets = this.appState.three?.assetManager?.getAllAssets() || [];
        
        // Audio
        project.audio = {
            musicGenre: $('#musicGenre')?.value || 'cinematic',
            musicTempo: parseInt($('#musicTempo')?.value) || 80,
            volumes: {
                master: this.appState.audioManager?.masterGain?.gain?.value || 1,
                music: this.appState.audioManager?.musicGain?.gain?.value || 0.7,
                sfx: this.appState.audioManager?.sfxGain?.gain?.value || 0.8,
                voice: this.appState.audioManager?.voiceGain?.gain?.value || 1
            }
        };
        
        // Visual Effects
        const effects = this.appState.three?.effects || {};
        project.visualEffects = {
            weather: this.appState.three?.background?.weather || 'clear',
            weatherIntensity: this.appState.three?.background?.weatherIntensity || 0.5,
            timeOfDay: this.appState.three?.background?.timeOfDay || 'noon',
            postProcessing: {
                bloom: effects.bloom || false,
                vignette: effects.vignette || false,
                filmGrain: effects.filmGrain || false,
                chromaticAberration: effects.chromaticAberration || false,
                saturation: effects.saturation || 1,
                contrast: effects.contrast || 1,
                brightness: effects.brightness || 0,
                temperature: effects.temperature || 0
            }
        };
        
        // Camera
        project.camera = this.appState.three?.cameraControls || PROJECT_SCHEMA.camera;
        
        // Lighting
        project.lighting = this.appState.three?.lighting || PROJECT_SCHEMA.lighting;
        
        return project;
    }

    // Serialize scene for storage
    serializeScene(scene) {
        return {
            ...scene,
            // Remove non-serializable properties
            characters3d: undefined,
            assets: scene.assets?.map(a => ({
                instanceId: a.instanceId,
                assetId: a.assetId,
                assetName: a.assetName,
                variation: a.variation,
                customization: a.customization
            })) || []
        };
    }

    // Serialize character for storage
    serializeCharacter(char) {
        return {
            id: char.id,
            sceneIndex: char.sceneIndex,
            charIndex: char.charIndex,
            customization: char.customization,
            animation: char.animation,
            position: char.character3d?.group?.position ? {
                x: char.character3d.group.position.x,
                y: char.character3d.group.position.y,
                z: char.character3d.group.position.z
            } : { x: 0, y: 0, z: 0 }
        };
    }

    // Calculate total duration from scenes
    calculateTotalDuration() {
        if (this.appState.scenes) {
            return this.appState.scenes.reduce((sum, s) => sum + (s.duration || 8), 0);
        }
        if (this.appState.timeline) {
            return this.appState.timeline.duration;
        }
        return 0;
    }

    // Save project to file
    async saveProject(filePath = null) {
        try {
            const project = this.collectProjectData();
            
            if (filePath) {
                // Save to specific path (File System Access API)
                const handle = await this.getFileHandle(filePath);
                await this.writeProjectToHandle(handle, project);
                this.projectPath = filePath;
            } else if (this.projectPath) {
                // Save to existing path
                const handle = await this.getFileHandle(this.projectPath);
                await this.writeProjectToHandle(handle, project);
            } else {
                // Save as new file
                await this.saveProjectAs();
                return;
            }
            
            this.hasUnsavedChanges = false;
            this.updateProjectTitle();
            showToast('प्रोजेक्ट सेव हो गया', 'success');
            return true;
        } catch (err) {
            console.error('Save failed:', err);
            showToast('सेव विफल: ' + err.message, 'error');
            return false;
        }
    }

    // Save project as new file
    async saveProjectAs() {
        try {
            if (!window.showSaveFilePicker) {
                // Fallback: download as JSON
                return this.downloadProject();
            }
            
            const handle = await window.showSaveFilePicker({
                suggestedName: `${this.currentProject?.metadata?.title || 'project'}.aas`,
                types: [{
                    description: 'AI Animation Studio Project',
                    accept: { 'application/json': ['.aas', '.json'] }
                }]
            });
            
            const project = this.collectProjectData();
            await this.writeProjectToHandle(handle, project);
            this.projectPath = handle;
            this.hasUnsavedChanges = false;
            this.updateProjectTitle();
            showToast('प्रोजेक्ट सेव हो गया', 'success');
            return true;
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Save as failed:', err);
                showToast('सेव विफल: ' + err.message, 'error');
            }
            return false;
        }
    }

    // Download project as JSON file
    downloadProject() {
        const project = this.collectProjectData();
        const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${project.metadata.title || 'project'}_${Date.now()}.aas`;
        a.click();
        URL.revokeObjectURL(url);
        this.hasUnsavedChanges = false;
        this.updateProjectTitle();
        showToast('प्रोजेक्ट डाउनलोड हो गया', 'success');
        return true;
    }

    // Write project to file handle
    async writeProjectToHandle(handle, project) {
        const writable = await handle.createWritable();
        await writable.write(JSON.stringify(project, null, 2));
        await writable.close();
    }

    // Get file handle
    async getFileHandle(path) {
        if (typeof path === 'object' && path.createWritable) {
            return path; // Already a FileSystemFileHandle
        }
        // For string paths, we'd need to use the File System Access API differently
        // This is a simplified version
        return null;
    }

    // Load project from file
    async loadProject(file = null) {
        try {
            let projectData;
            
            if (file) {
                // Load from File object
                projectData = await this.readFileAsJson(file);
            } else if (window.showOpenFilePicker) {
                // Use File System Access API
                const [handle] = await window.showOpenFilePicker({
                    types: [{
                        description: 'AI Animation Studio Project',
                        accept: { 'application/json': ['.aas', '.json'] }
                    }]
                });
                const file = await handle.getFile();
                projectData = await this.readFileAsJson(file);
                this.projectPath = handle;
            } else {
                // Fallback: create file input
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.aas,.json';
                input.onchange = async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        projectData = await this.readFileAsJson(file);
                        await this.applyProjectData(projectData);
                    }
                };
                input.click();
                return;
            }
            
            await this.applyProjectData(projectData);
            this.hasUnsavedChanges = false;
            this.updateProjectTitle();
            showToast('प्रोजेक्ट लोड हो गया', 'success');
            return true;
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Load failed:', err);
                showToast('लोड विफल: ' + err.message, 'error');
            }
            return false;
        }
    }

    // Read file as JSON
    async readFileAsJson(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    resolve(data);
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    // Apply loaded project data to app state
    async applyProjectData(project) {
        // Validate version
        if (project.version && project.version !== PROJECT_VERSION) {
            console.warn(`Project version mismatch: ${project.version} vs ${PROJECT_VERSION}`);
            // Could run migration here
        }
        
        this.currentProject = project;
        
        // Restore metadata
        if (project.metadata) {
            document.title = `${project.metadata.title || 'प्रोजेक्ट'} - AI Animation Studio`;
        }
        
        // Restore settings
        if (project.settings) {
            this.appState.settings = { ...this.appState.settings, ...project.settings };
            this.updateSettingsUI();
        }
        
        // Restore story
        if (project.story) {
            this.appState.story = project.story;
            $('#storyInput').value = project.story;
        }
        
        // Restore script
        if (project.script && this.appState.scriptManager) {
            this.appState.scriptManager.importScript(project.script);
        }
        
        // Restore scenes
        if (project.scenes) {
            this.appState.scenes = project.scenes.map(s => this.deserializeScene(s));
            this.updateScenesUI();
        }
        
        // Restore characters
        if (project.characters && this.appState.three?.characters3d) {
            await this.restoreCharacters(project.characters);
        }
        
        // Restore timeline
        if (project.timeline && this.appState.timeline) {
            this.appState.timeline.importJSON(project.timeline);
            this.appState.timelineUI?.render();
        }
        
        // Restore assets
        if (project.assets && this.appState.three?.assetManager) {
            await this.restoreAssets(project.assets);
        }
        
        // Restore audio settings
        if (project.audio) {
            this.restoreAudioSettings(project.audio);
        }
        
        // Restore visual effects
        if (project.visualEffects) {
            this.restoreVisualEffects(project.visualEffects);
        }
        
        // Restore camera
        if (project.camera) {
            this.appState.three.cameraControls = { ...this.appState.three.cameraControls, ...project.camera };
            this.updateCameraUI();
        }
        
        // Restore lighting
        if (project.lighting) {
            this.appState.three.lighting = { ...this.appState.three.lighting, ...project.lighting };
            this.updateLightingUI();
        }
        
        // Rebuild scene previews
        if (this.appState.scenes?.length > 0) {
            this.appState.three.currentScene = 0;
            rebuildSceneForPreview(0);
        }
    }

    // Deserialize scene
    deserializeScene(scene) {
        return {
            ...scene,
            characters3d: []
        };
    }

    // Restore characters
    async restoreCharacters(characters) {
        for (const charData of characters) {
            if (this.appState.three.characters3d[charData.sceneIndex]?.[charData.charIndex]) {
                const char3d = this.appState.three.characters3d[charData.sceneIndex][charData.charIndex];
                if (char3d.character3d && charData.customization) {
                    Object.entries(charData.customization).forEach(([key, value]) => {
                        if (char3d.character3d[`set${key.charAt(0).toUpperCase() + key.slice(1)}`]) {
                            char3d.character3d[`set${key.charAt(0).toUpperCase() + key.slice(1)}`](value);
                        }
                    });
                }
                if (charData.position) {
                    char3d.character3d.group.position.set(
                        charData.position.x,
                        charData.position.y,
                        charData.position.z
                    );
                }
            }
        }
    }

    // Restore assets
    async restoreAssets(assets) {
        for (const asset of assets) {
            this.appState.three.assetManager.addAsset(asset.assetId, {
                instanceId: asset.instanceId,
                position: asset.position,
                rotation: asset.rotation,
                scale: asset.scale,
                customization: asset.customization,
                variation: asset.variation
            });
        }
    }

    // Restore audio settings
    restoreAudioSettings(audio) {
        if (audio.volumes && this.appState.audioManager) {
            this.appState.audioManager.setMasterVolume(audio.volumes.master);
            this.appState.audioManager.setMusicVolume(audio.volumes.music);
            this.appState.audioManager.setSFXVolume(audio.volumes.sfx);
            this.appState.audioManager.setVoiceVolume(audio.volumes.voice);
            
            $('#masterVolume').value = audio.volumes.master;
            $('#masterVolValue').textContent = Math.round(audio.volumes.master * 100) + '%';
            $('#musicVolume').value = audio.volumes.music;
            $('#musicVolValue').textContent = Math.round(audio.volumes.music * 100) + '%';
            $('#sfxVolume').value = audio.volumes.sfx;
            $('#sfxVolValue').textContent = Math.round(audio.volumes.sfx * 100) + '%';
            $('#voiceVolume').value = audio.volumes.voice;
            $('#voiceVolValue').textContent = Math.round(audio.volumes.voice * 100) + '%';
        }
        if (audio.musicGenre) {
            $('#musicGenre').value = audio.musicGenre;
        }
        if (audio.musicTempo) {
            $('#musicTempo').value = audio.musicTempo;
            $('#musicTempoValue').textContent = audio.musicTempo;
        }
    }

    // Restore visual effects
    restoreVisualEffects(effects) {
        if (effects.weather && this.appState.three.effectManager) {
            this.appState.three.effectManager.applyWeather(effects.weather);
            $('#weatherPreset').value = effects.weather;
        }
        if (effects.weatherIntensity) {
            $('#weatherIntensity').value = effects.weatherIntensity;
            $('#weatherIntensityValue').textContent = Math.round(effects.weatherIntensity * 100) + '%';
        }
        if (effects.timeOfDay) {
            $('#timeOfDayPreset').value = effects.timeOfDay;
            applyTimeOfDayPreset(effects.timeOfDay);
        }
        if (effects.postProcessing) {
            const pp = effects.postProcessing;
            $('#enableBloom').checked = pp.bloom;
            $('#enableVignette').checked = pp.vignette;
            $('#enableFilmGrain').checked = pp.filmGrain;
            $('#enableChromaticAberration').checked = pp.chromaticAberration;
            $('#saturation').value = pp.saturation;
            $('#saturationValue').textContent = pp.saturation.toFixed(2);
            $('#contrast').value = pp.contrast;
            $('#contrastValue').textContent = pp.contrast.toFixed(2);
            $('#brightness').value = pp.brightness;
            $('#brightnessValue').textContent = pp.brightness.toFixed(2);
            $('#temperature').value = pp.temperature;
            $('#temperatureValue').textContent = pp.temperature;
            updatePostProcessing();
        }
    }

    // Update UI functions
    updateSettingsUI() {
        const s = this.appState.settings;
        const resEl = $('#exportResolution');
        const fpsEl = $('#exportFramerate');
        const fmtEl = $('#exportFormat');
        if (s.resolution && resEl) resEl.value = s.resolution;
        if (s.framerate && fpsEl) fpsEl.value = s.framerate;
        if (s.format && fmtEl) fmtEl.value = s.format;
    }

    updateScenesUI() {
        updateSceneList();
        if (this.appState.scenes.length > 0) {
            this.appState.three.currentScene = 0;
            $('#sceneSelector').value = 0;
            rebuildSceneForPreview(0);
        }
    }

    updateCameraUI() {
        const c = this.appState.three.cameraControls;
        $('#camDistance').value = c.distance;
        $('#camDistValue').textContent = c.distance;
        $('#camHeight').value = c.height;
        $('#camHeightValue').textContent = c.height;
        $('#camFov').value = c.fov;
        $('#camFovValue').textContent = c.fov;
        $('#camAngle').value = c.angle;
        $('#camAngleValue').textContent = c.angle + '°';
        $('#camMovement').value = c.movement;
        $('#camSpeed').value = c.speed;
        $('#camSpeedValue').textContent = c.speed.toFixed(1) + 'x';
    }

    updateLightingUI() {
        const l = this.appState.three.lighting;
        $('#lightEnvironment').value = l.environment;
        $('#ambientIntensity').value = l.ambientIntensity;
        $('#ambientIntensityValue').textContent = l.ambientIntensity.toFixed(1);
        $('#exposure').value = l.exposure;
        $('#exposureValue').textContent = l.exposure.toFixed(1);
    }

    // Autosave functionality
    startAutosave() {
        if (this.autosaveInterval) clearInterval(this.autosaveInterval);
        
        this.autosaveInterval = setInterval(() => {
            if (this.autosaveEnabled && this.hasUnsavedChanges) {
                this.saveAutosave();
            }
        }, this.autosaveDelay);
    }

    stopAutosave() {
        if (this.autosaveInterval) {
            clearInterval(this.autosaveInterval);
            this.autosaveInterval = null;
        }
    }

    saveAutosave() {
        try {
            const project = this.collectProjectData();
            const autosaveData = {
                project,
                timestamp: Date.now()
            };
            
            // Get existing autosaves
            let autosaves = JSON.parse(localStorage.getItem(this.autosaveKey) || '[]');
            
            // Add new autosave
            autosaves.unshift(autosaveData);
            
            // Keep only max autosaves
            autosaves = autosaves.slice(0, this.maxAutosaves);
            
            localStorage.setItem(this.autosaveKey, JSON.stringify(autosaves));
            console.log('Autosaved at', new Date().toLocaleTimeString());
        } catch (err) {
            console.warn('Autosave failed:', err);
        }
    }

    loadAutosave() {
        try {
            const autosaves = JSON.parse(localStorage.getItem(this.autosaveKey) || '[]');
            if (autosaves.length > 0) {
                const latest = autosaves[0];
                const age = Date.now() - latest.timestamp;
                const hours = age / (1000 * 60 * 60);
                
                if (hours < 24 && confirm(`ऑटोसेव मिला (${hours.toFixed(1)} घंटे पुराना)। रिस्टोर करें?`)) {
                    this.applyProjectData(latest.project);
                    showToast('ऑटोसेव से रिस्टोर किया गया', 'success');
                }
            }
        } catch (err) {
            console.warn('Load autosave failed:', err);
        }
    }

    // Get autosave list
    getAutosaves() {
        return JSON.parse(localStorage.getItem(this.autosaveKey) || '[]');
    }

    // Clear autosaves
    clearAutosaves() {
        localStorage.removeItem(this.autosaveKey);
    }

    // Export project as template
    exportAsTemplate() {
        const project = this.collectProjectData();
        // Remove metadata that's specific to this project
        project.metadata = PROJECT_SCHEMA.metadata;
        project.metadata.title = 'टेम्पलेट';
        
        const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `template_${Date.now()}.aas`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('टेम्पलेट एक्सपोर्ट हो गया', 'success');
    }

    // Import project from template
    async importTemplate(file) {
        return this.loadProject(file);
    }
}

// ========================================
// Project UI Functions
// ========================================

export function createProjectUI(projectManager, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="project-manager">
            <div class="project-header">
                <h3>प्रोजेक्ट प्रबंधन</h3>
                <div class="project-status" id="projectStatus">
                    <span class="status-indicator" id="statusIndicator"></span>
                    <span id="statusText">नया प्रोजेक्ट</span>
                </div>
            </div>
            
            <div class="project-toolbar">
                <button class="btn btn-primary" id="btnNewProject">नया</button>
                <button class="btn btn-secondary" id="btnOpenProject">खोलें</button>
                <button class="btn btn-success" id="btnSaveProject">सेव</button>
                <button class="btn btn-secondary" id="btnSaveProjectAs">इस रूप में सेव</button>
                <button class="btn btn-secondary" id="btnExportTemplate">टेम्पलेट एक्सपोर्ट</button>
            </div>
            
            <div class="project-autosave">
                <label class="checkbox-label">
                    <input type="checkbox" id="autosaveEnabled" checked> ऑटोसेव सक्षम (हर 30 सेकंड)
                </label>
                <button class="btn btn-small" id="btnViewAutosaves">ऑटोसेव देखें</button>
                <button class="btn btn-danger btn-small" id="btnClearAutosaves">ऑटोसेव साफ़ करें</button>
            </div>
            
            <div class="autosave-list hidden" id="autosaveList"></div>
            
            <div class="project-info" id="projectInfo"></div>
        </div>
    `;

    bindEvents();

    function bindEvents() {
        $('#btnNewProject').addEventListener('click', () => {
            if (projectManager.hasUnsavedChanges && !confirm('सेव न किए गए बदलाव खो जाएंगे। जारी रखें?')) return;
            projectManager.createNewProject();
            projectManager.applyProjectData(projectManager.currentProject);
            updateStatus();
        });

        $('#btnOpenProject').addEventListener('click', () => {
            projectManager.loadProject();
        });

        $('#btnSaveProject').addEventListener('click', () => {
            projectManager.saveProject();
        });

        $('#btnSaveProjectAs').addEventListener('click', () => {
            projectManager.saveProjectAs();
        });

        $('#btnExportTemplate').addEventListener('click', () => {
            projectManager.exportAsTemplate();
        });

        $('#autosaveEnabled').addEventListener('change', (e) => {
            projectManager.autosaveEnabled = e.target.checked;
            if (e.target.checked) projectManager.startAutosave();
            else projectManager.stopAutosave();
        });

        $('#btnViewAutosaves').addEventListener('click', () => {
            const list = $('#autosaveList');
            list.classList.toggle('hidden');
            if (!list.classList.contains('hidden')) {
                renderAutosaves();
            }
        });

        $('#btnClearAutosaves').addEventListener('click', () => {
            if (confirm('सभी ऑटोसेव हटा दें?')) {
                projectManager.clearAutosaves();
                renderAutosaves();
                showToast('ऑटोसेव साफ़ किए गए', 'info');
            }
        });
    }

    function renderAutosaves() {
        const autosaves = projectManager.getAutosaves();
        const list = $('#autosaveList');
        
        if (autosaves.length === 0) {
            list.innerHTML = '<p class="empty">कोई ऑटोसेव नहीं</p>';
            return;
        }

        list.innerHTML = autosaves.map((save, i) => {
            const date = new Date(save.timestamp);
            const age = Date.now() - save.timestamp;
            const mins = Math.floor(age / 60000);
            const hrs = Math.floor(age / 3600000);
            const ageStr = hrs > 0 ? `${hrs}घं ${mins % 60}मिन` : `${मिन्स}मिन`;
            
            return `
                <div class="autosave-item">
                    <div class="autosave-info">
                        <span class="autosave-title">${save.project.metadata?.title || 'Unnamed'}</span>
                        <span class="autosave-time">${date.toLocaleString()} (${ageStr} पहले)</span>
                    </div>
                    <div class="autosave-actions">
                        <button class="btn btn-small" onclick="restoreAutosave(${i})">रिस्टोर</button>
                        <button class="btn btn-danger btn-small" onclick="deleteAutosave(${i})">हटाएं</button>
                    </div>
                </div>
            `;
        }).join('');

        // Make restore/delete functions global
        window.restoreAutosave = (index) => {
            const autosaves = projectManager.getAutosaves();
            if (autosaves[index]) {
                projectManager.applyProjectData(autosaves[index].project);
                showToast('ऑटोसेव से रिस्टोर किया गया', 'success');
                $('#autosaveList').classList.add('hidden');
            }
        };

        window.deleteAutosave = (index) => {
            const autosaves = projectManager.getAutosaves();
            autosaves.splice(index, 1);
            localStorage.setItem(projectManager.autosaveKey, JSON.stringify(autosaves));
            renderAutosaves();
        };
    }

    function updateStatus() {
        const project = projectManager.currentProject;
        const indicator = $('#statusIndicator');
        const text = $('#statusText');
        
        if (project) {
            text.textContent = project.metadata?.title || 'नया प्रोजेक्ट';
            indicator.style.background = projectManager.hasUnsavedChanges ? '#f59e0b' : '#10b981';
        } else {
            text.textContent = 'नया प्रोजेक्ट';
            indicator.style.background = '#10b981';
        }
    }

    // Initial status
    updateStatus();
}

// ========================================
// Export
// ========================================

// All exports are already declared with 'export' keyword above
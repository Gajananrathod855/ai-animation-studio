/**
 * Script and Narration Planner
 * Structured script editor with scene-wise narration, dialogue, speaker identification
 */

// ========================================
// Script Data Structures
// ========================================

export class ScriptManager {
    constructor() {
        this.script = {
            title: '',
            description: '',
            language: 'hi', // 'hi' or 'en'
            scenes: [],
            characters: [], // List of character names for speaker dropdown
            metadata: {
                createdAt: Date.now(),
                updatedAt: Date.now(),
                version: 1
            }
        };
    }
    
    // Create new script
    newScript(title = '', description = '') {
        this.script = {
            title,
            description,
            language: 'hi',
            scenes: [],
            characters: [],
            metadata: {
                createdAt: Date.now(),
                updatedAt: Date.now(),
                version: 1
            }
        };
        return this.script;
    }
    
    // Add a scene to script
    addScene(sceneData) {
        const scene = {
            id: `scene_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            number: this.script.scenes.length + 1,
            title: sceneData.title || `Scene ${this.script.scenes.length + 1}`,
            location: sceneData.location || '',
            timeOfDay: sceneData.timeOfDay || 'day', // day, night, morning, evening
            duration: sceneData.duration || 8, // seconds
            narration: sceneData.narration || '',
            dialogues: sceneData.dialogues || [], // Array of { speaker, text, emotion, animation }
            actions: sceneData.actions || [], // Array of { character, action, target, description }
            cameraNotes: sceneData.cameraNotes || '',
            lightingNotes: sceneData.lightingNotes || '',
            soundNotes: sceneData.soundNotes || '',
            metadata: {
                createdAt: Date.now(),
                updatedAt: Date.now()
            }
        };
        
        this.script.scenes.push(scene);
        this.updateSceneNumbers();
        this.updateCharactersList();
        this.script.metadata.updatedAt = Date.now();
        
        return scene;
    }
    
    // Update scene
    updateScene(sceneId, updates) {
        const scene = this.script.scenes.find(s => s.id === sceneId);
        if (scene) {
            Object.assign(scene, updates);
            scene.metadata.updatedAt = Date.now();
            this.updateCharactersList();
            this.script.metadata.updatedAt = Date.now();
            return true;
        }
        return false;
    }
    
    // Delete scene
    deleteScene(sceneId) {
        const index = this.script.scenes.findIndex(s => s.id === sceneId);
        if (index !== -1) {
            this.script.scenes.splice(index, 1);
            this.updateSceneNumbers();
            this.updateCharactersList();
            this.script.metadata.updatedAt = Date.now();
            return true;
        }
        return false;
    }
    
    // Reorder scenes
    reorderScenes(fromIndex, toIndex) {
        if (fromIndex < 0 || fromIndex >= this.script.scenes.length ||
            toIndex < 0 || toIndex >= this.script.scenes.length) {
            return false;
        }
        
        const [scene] = this.script.scenes.splice(fromIndex, 1);
        this.script.scenes.splice(toIndex, 0, scene);
        this.updateSceneNumbers();
        this.script.metadata.updatedAt = Date.now();
        return true;
    }
    
    updateSceneNumbers() {
        this.script.scenes.forEach((scene, index) => {
            scene.number = index + 1;
        });
    }
    
    updateCharactersList() {
        const characters = new Set();
        this.script.scenes.forEach(scene => {
            scene.dialogues.forEach(d => {
                if (d.speaker) characters.add(d.speaker);
            });
            scene.actions.forEach(a => {
                if (a.character) characters.add(a.character);
                if (a.target) characters.add(a.target);
            });
        });
        this.script.characters = Array.from(characters);
    }
    
    // Add dialogue to scene
    addDialogue(sceneId, dialogue) {
        const scene = this.script.scenes.find(s => s.id === sceneId);
        if (scene) {
            scene.dialogues.push({
                id: `dialogue_${Date.now()}`,
                speaker: dialogue.speaker || '',
                text: dialogue.text || '',
                emotion: dialogue.emotion || 'neutral',
                animation: dialogue.animation || 'talk',
                timing: dialogue.timing || 0, // Offset in seconds from scene start
                duration: dialogue.duration || 3
            });
            scene.metadata.updatedAt = Date.now();
            this.updateCharactersList();
            return true;
        }
        return false;
    }
    
    // Update dialogue
    updateDialogue(sceneId, dialogueId, updates) {
        const scene = this.script.scenes.find(s => s.id === sceneId);
        if (scene) {
            const dialogue = scene.dialogues.find(d => d.id === dialogueId);
            if (dialogue) {
                Object.assign(dialogue, updates);
                scene.metadata.updatedAt = Date.now();
                this.updateCharactersList();
                return true;
            }
        }
        return false;
    }
    
    // Delete dialogue
    deleteDialogue(sceneId, dialogueId) {
        const scene = this.script.scenes.find(s => s.id === sceneId);
        if (scene) {
            const index = scene.dialogues.findIndex(d => d.id === dialogueId);
            if (index !== -1) {
                scene.dialogues.splice(index, 1);
                scene.metadata.updatedAt = Date.now();
                this.updateCharactersList();
                return true;
            }
        }
        return false;
    }
    
    // Add action to scene
    addAction(sceneId, action) {
        const scene = this.script.scenes.find(s => s.id === sceneId);
        if (scene) {
            scene.actions.push({
                id: `action_${Date.now()}`,
                character: action.character || '',
                action: action.action || '', // walk, run, sit, wave, point, look, give, take, etc.
                target: action.target || '', // character or object
                description: action.description || '',
                timing: action.timing || 0,
                duration: action.duration || 2
            });
            scene.metadata.updatedAt = Date.now();
            this.updateCharactersList();
            return true;
        }
        return false;
    }
    
    // Delete action
    deleteAction(sceneId, actionId) {
        const scene = this.script.scenes.find(s => s.id === sceneId);
        if (scene) {
            const index = scene.actions.findIndex(a => a.id === actionId);
            if (index !== -1) {
                scene.actions.splice(index, 1);
                scene.metadata.updatedAt = Date.now();
                this.updateCharactersList();
                return true;
            }
        }
        return false;
    }
    
    // Update action
    updateAction(sceneId, actionId, updates) {
        const scene = this.script.scenes.find(s => s.id === sceneId);
        if (scene) {
            const action = scene.actions.find(a => a.id === actionId);
            if (action) {
                Object.assign(action, updates);
                scene.metadata.updatedAt = Date.now();
                this.updateCharactersList();
                return true;
            }
        }
        return false;
    }
    
    // Get total estimated duration
    getTotalDuration() {
        return this.script.scenes.reduce((sum, scene) => sum + (scene.duration || 8), 0);
    }
    
    // Export script as text
    exportAsText() {
        let output = `# ${this.script.title}\n`;
        if (this.script.description) {
            output += `\n${this.script.description}\n`;
        }
        output += `\nLanguage: ${this.script.language === 'hi' ? 'Hindi' : 'English'}\n`;
        output += `Total Scenes: ${this.script.scenes.length}\n`;
        output += `Estimated Duration: ${this.formatDuration(this.getTotalDuration())}\n`;
        output += `Characters: ${this.script.characters.join(', ') || 'None'}\n`;
        output += '\n' + '='.repeat(50) + '\n\n';
        
        this.script.scenes.forEach(scene => {
            output += `## Scene ${scene.number}: ${scene.title}\n`;
            if (scene.location) output += `Location: ${scene.location}\n`;
            if (scene.timeOfDay) output += `Time: ${scene.timeOfDay}\n`;
            output += `Duration: ${scene.duration}s\n\n`;
            
            if (scene.narration) {
                output += `**Narration:** ${scene.narration}\n\n`;
            }
            
            if (scene.dialogues.length > 0) {
                output += `**Dialogues:**\n`;
                scene.dialogues.forEach(d => {
                    output += `- ${d.speaker} (${d.emotion}): "${d.text}"\n`;
                });
                output += '\n';
            }
            
            if (scene.actions.length > 0) {
                output += `**Actions:**\n`;
                scene.actions.forEach(a => {
                    output += `- ${a.character} ${a.action}${a.target ? ` -> ${a.target}` : ''}: ${a.description}\n`;
                });
                output += '\n';
            }
            
            if (scene.cameraNotes) output += `Camera: ${scene.cameraNotes}\n`;
            if (scene.lightingNotes) output += `Lighting: ${scene.lightingNotes}\n`;
            if (scene.soundNotes) output += `Sound: ${scene.soundNotes}\n`;
            
            output += '\n' + '-'.repeat(30) + '\n\n';
        });
        
        return output;
    }
    
    // Export as JSON
    exportAsJSON() {
        return JSON.stringify(this.script, null, 2);
    }
    
    // Import from JSON
    importFromJSON(json) {
        try {
            const parsed = typeof json === 'string' ? JSON.parse(json) : json;
            // Validate structure
            if (parsed.scenes && Array.isArray(parsed.scenes)) {
                this.script = {
                    title: parsed.title || '',
                    description: parsed.description || '',
                    language: parsed.language || 'hi',
                    scenes: parsed.scenes.map((s, i) => ({
                        ...s,
                        number: i + 1,
                        dialogues: s.dialogues || [],
                        actions: s.actions || []
                    })),
                    characters: parsed.characters || [],
                    metadata: parsed.metadata || {
                        createdAt: Date.now(),
                        updatedAt: Date.now(),
                        version: 1
                    }
                };
                this.updateSceneNumbers();
                this.updateCharactersList();
                return true;
            }
        } catch (e) {
            console.error('Script import failed:', e);
        }
        return false;
    }
    
    formatDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    }
    
    // Generate scene breakdown for animation
    generateSceneBreakdown() {
        return this.script.scenes.map(scene => ({
            id: scene.id,
            title: scene.title,
            description: scene.narration,
            characters: [...new Set([
                ...scene.dialogues.map(d => d.speaker),
                ...scene.actions.map(a => a.character),
                ...scene.actions.map(a => a.target).filter(Boolean)
            ])].filter(Boolean),
            background: scene.location,
            hindiText: scene.narration,
            duration: scene.duration,
            dialogues: scene.dialogues,
            actions: scene.actions,
            cameraNotes: scene.cameraNotes,
            lightingNotes: scene.lightingNotes,
            soundNotes: scene.soundNotes
        }));
    }
}

// ========================================
// Script Template System
// ========================================

export const SCRIPT_TEMPLATES = {
    story: {
        name: 'कहानी (Story)',
        description: 'पारंपरिक कहानी संरचना',
        structure: [
            { title: 'शुरुआत', purpose: 'पात्रों और सेटिंग का परिचय' },
            { title: 'घटना', purpose: 'मुख्य घटना या समस्या' },
            { title: 'चरमोत्कर्ष', purpose: 'सबसे रोमांचक क्षण' },
            { title: 'समाधान', purpose: 'समस्या का समाधान' },
            { title: 'अंत', purpose: 'नैतिक या निष्कर्ष' }
        ]
    },
    educational: {
        name: 'शैक्षिक (Educational)',
        description: 'सीखने के लिए संरचित व्याख्या',
        structure: [
            { title: 'परिचय', purpose: 'विषय का परिचय और उद्देश्य' },
            { title: 'मुख्य अवधारणा 1', purpose: 'पहला मुख्य बिंदु' },
            { title: 'मुख्य अवधारणा 2', purpose: 'दूसरा मुख्य बिंदु' },
            { title: 'उदाहरण', purpose: 'व्यावहारिक उदाहरण' },
            { title: 'सारांश', purpose: 'मुख्य बिंदुओं का पुनर्कथन' }
        ]
    },
    documentary: {
        name: 'वृत्तचित्र (Documentary)',
        description: 'तथ्य-आधारित वर्णन',
        structure: [
            { title: 'हुक/परिचय', purpose: 'दर्शक का ध्यान आकर्षित करें' },
            { title: 'पृष्ठभूमि', purpose: 'संदर्भ और इतिहास' },
            { title: 'मुख्य विषय', purpose: 'केंद्रीय विषय का अन्वेषण' },
            { title: 'साक्ष्य/उदाहरण', purpose: 'समर्थन करने वाले तथ्य' },
            { title: 'निष्कर्ष', purpose: 'अंतिम विचार और कॉल टू एक्शन' }
        ]
    },
    dialogue: {
        name: 'संवाद-आधारित (Dialogue-heavy)',
        description: 'पात्रों के बीच बातचीत पर केंद्रित',
        structure: [
            { title: 'दृश्य सेटअप', purpose: 'पात्र मिलते हैं' },
            { title: 'संघर्ष', purpose: 'मतभेद या समस्या' },
            { title: 'चर्चा', purpose: 'बातचीत और तर्क' },
            { title: 'समाधान', purpose: 'सहमति या समझ' },
            { title: 'विदाई', purpose: 'पात्र अलग होते हैं' }
        ]
    }
};

export function createScriptFromTemplate(templateId, title = '') {
    const template = SCRIPT_TEMPLATES[templateId];
    if (!template) return null;
    
    const manager = new ScriptManager();
    manager.newScript(title, template.description);
    
    template.structure.forEach((section, index) => {
        manager.addScene({
            title: section.title,
            location: '',
            narration: `[${section.purpose}]`,
            duration: 10
        });
    });
    
    return manager.script;
}

// ========================================
// Dialogue/Script Sync with Animation
// ========================================

export function syncScriptToAnimation(script, animationData) {
    // This function syncs script timings with animation timeline
    let currentTime = 0;
    
    script.scenes.forEach((scene, sceneIndex) => {
        const animScene = animationData.scenes[sceneIndex];
        if (!animScene) return;
        
        // Sync narration timing
        if (scene.narration) {
            // Estimate narration duration based on text length (Hindi ~10 chars/sec, English ~15 chars/sec)
            const charsPerSec = script.language === 'hi' ? 10 : 15;
            const estimatedDuration = Math.max(3, scene.narration.length / charsPerSec);
            animScene.narrationDuration = estimatedDuration;
        }
        
        // Sync dialogues
        scene.dialogues.forEach((dialogue, dIndex) => {
            const charsPerSec = script.language === 'hi' ? 10 : 15;
            const estimatedDuration = Math.max(2, dialogue.text.length / charsPerSec);
            dialogue.estimatedDuration = estimatedDuration;
            dialogue.startTime = currentTime + (dialogue.timing || 0);
        });
        
        currentTime += scene.duration;
    });
    
    return animationData;
}

export function generateSubtitlesFromScript(script) {
    const subtitles = [];
    let currentTime = 0;
    
    script.scenes.forEach(scene => {
        // Narration subtitle
        if (scene.narration) {
            subtitles.push({
                text: scene.narration,
                startTime: currentTime,
                endTime: currentTime + scene.duration,
                type: 'narration',
                sceneId: scene.id
            });
        }
        
        // Dialogue subtitles
        scene.dialogues.forEach(dialogue => {
            const startTime = currentTime + (dialogue.timing || 0);
            const endTime = startTime + (dialogue.duration || dialogue.estimatedDuration || 3);
            
            subtitles.push({
                text: `${dialogue.speaker}: ${dialogue.text}`,
                startTime,
                endTime,
                type: 'dialogue',
                speaker: dialogue.speaker,
                emotion: dialogue.emotion,
                sceneId: scene.id
            });
        });
        
        currentTime += scene.duration;
    });
    
    return subtitles;
}
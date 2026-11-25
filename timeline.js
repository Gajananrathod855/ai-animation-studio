/**
 * Multi-Track Video Editing Timeline
 * Non-linear editing with video, audio, text, and effect tracks
 */

// ========================================
// Track Types
// ========================================

export const TRACK_TYPES = {
    video: { name: 'वीडियो', color: '#3b82f6', icon: '🎬', height: 80 },
    audio: { name: 'ऑडियो', color: '#10b981', icon: '🔊', height: 60 },
    text: { name: 'टेक्स्ट/उपशीर्षक', color: '#f59e0b', icon: '📝', height: 50 },
    effect: { name: 'इफेक्ट', color: '#ef4444', icon: '✨', height: 50 },
    camera: { name: 'कैमरा', color: '#8b5cf6', icon: '📷', height: 50 }
};

// ========================================
// Clip Class
// ========================================

export class TimelineClip {
    constructor(data = {}) {
        this.id = data.id || `clip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.trackId = data.trackId || '';
        this.type = data.type || 'video';
        this.name = data.name || 'Clip';
        this.startTime = data.startTime || 0; // in seconds
        this.duration = data.duration || 5; // in seconds
        this.endTime = this.startTime + this.duration;
        
        // Source media
        this.source = data.source || null; // video/audio element, canvas, etc.
        this.sourceStart = data.sourceStart || 0; // trim start
        this.sourceDuration = data.sourceDuration || this.duration; // trim duration
        
        // Visual properties
        this.color = data.color || this.getDefaultColor();
        this.waveform = data.waveform || null; // for audio
        this.thumbnail = data.thumbnail || null; // for video
        
        // Transform
        this.opacity = data.opacity !== undefined ? data.opacity : 1;
        this.volume = data.volume !== undefined ? data.volume : 1;
        this.speed = data.speed || 1;
        this.reverse = data.reverse || false;
        
        // Effects
        this.effects = data.effects || [];
        this.transitions = {
            in: data.transitionIn || 'none',
            out: data.transitionOut || 'none',
            inDuration: data.transitionInDuration || 0.5,
            outDuration: data.transitionOutDuration || 0.5
        };
        
        // Keyframes for animation
        this.keyframes = data.keyframes || [];
        
        // Metadata
        this.metadata = data.metadata || {};
        this.locked = data.locked || false;
        this.muted = data.muted || false;
        this.hidden = data.hidden || false;
    }
    
    getDefaultColor() {
        const colors = {
            video: '#3b82f6',
            audio: '#10b981',
            text: '#f59e0b',
            effect: '#ef4444',
            camera: '#8b5cf6'
        };
        return colors[this.type] || '#888888';
    }
    
    // Update end time when duration changes
    updateEndTime() {
        this.endTime = this.startTime + this.duration;
    }
    
    // Check if time is within clip
    containsTime(time) {
        return time >= this.startTime && time < this.endTime;
    }
    
    // Get progress within clip (0-1)
    getProgress(time) {
        if (!this.containsTime(time)) return null;
        return (time - this.startTime) / this.duration;
    }
    
    // Trim clip
    trim(start, end) {
        this.sourceStart = start;
        this.duration = end - start;
        this.updateEndTime();
    }
    
    // Split clip at time
    split(time) {
        if (!this.containsTime(time)) return null;
        
        const progress = this.getProgress(time);
        const sourceTime = this.sourceStart + progress * this.sourceDuration;
        
        const rightClip = new TimelineClip({
            ...this.toJSON(),
            id: `${this.id}_right`,
            startTime: time,
            duration: this.endTime - time,
            sourceStart: sourceTime,
            sourceDuration: this.sourceDuration * (1 - progress)
        });
        
        this.duration = time - this.startTime;
        this.sourceDuration = this.sourceDuration * progress;
        this.updateEndTime();
        
        return rightClip;
    }
    
    toJSON() {
        return {
            id: this.id,
            trackId: this.trackId,
            type: this.type,
            name: this.name,
            startTime: this.startTime,
            duration: this.duration,
            source: this.source,
            sourceStart: this.sourceStart,
            sourceDuration: this.sourceDuration,
            color: this.color,
            waveform: this.waveform,
            thumbnail: this.thumbnail,
            opacity: this.opacity,
            volume: this.volume,
            speed: this.speed,
            reverse: this.reverse,
            effects: this.effects,
            transitions: this.transitions,
            keyframes: this.keyframes,
            metadata: this.metadata,
            locked: this.locked,
            muted: this.muted,
            hidden: this.hidden
        };
    }
}

// ========================================
// Track Class
// ========================================

export class TimelineTrack {
    constructor(data = {}) {
        this.id = data.id || `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.type = data.type || 'video';
        this.name = data.name || this.getDefaultName();
        this.color = data.color || TRACK_TYPES[this.type]?.color || '#888888';
        this.height = data.height || TRACK_TYPES[this.type]?.height || 60;
        
        this.clips = data.clips || [];
        this.muted = data.muted || false;
        this.solo = data.solo || false;
        this.locked = data.locked || false;
        this.hidden = data.hidden || false;
        this.volume = data.volume || 1;
        this.opacity = data.opacity || 1;
        
        // Blending mode for video tracks
        this.blendMode = data.blendMode || 'normal';
    }
    
    getDefaultName() {
        const names = {
            video: 'वीडियो ट्रैक',
            audio: 'ऑडियो ट्रैक',
            text: 'टेक्स्ट ट्रैक',
            effect: 'इफेक्ट ट्रैक',
            camera: 'कैमरा ट्रैक'
        };
        return names[this.type] || 'ट्रैक';
    }
    
    // Add clip at time
    addClip(clip, time = null) {
        if (time !== null) {
            clip.startTime = time;
            clip.updateEndTime();
        }
        clip.trackId = this.id;
        this.clips.push(clip);
        this.sortClips();
        return clip;
    }
    
    // Remove clip
    removeClip(clipId) {
        this.clips = this.clips.filter(c => c.id !== clipId);
    }
    
    // Get clip at time
    getClipAtTime(time) {
        return this.clips.find(c => c.containsTime(time));
    }
    
    // Get all clips overlapping time range
    getClipsInRange(start, end) {
        return this.clips.filter(c => c.startTime < end && c.endTime > start);
    }
    
    // Sort clips by start time
    sortClips() {
        this.clips.sort((a, b) => a.startTime - b.startTime);
    }
    
    // Check for overlaps
    hasOverlap(clip, excludeId = null) {
        return this.clips.some(c => 
            c.id !== excludeId &&
            c.startTime < clip.endTime && 
            c.endTime > clip.startTime
        );
    }
    
    // Get total duration
    getDuration() {
        if (this.clips.length === 0) return 0;
        return Math.max(...this.clips.map(c => c.endTime));
    }
    
    toJSON() {
        return {
            id: this.id,
            type: this.type,
            name: this.name,
            color: this.color,
            height: this.height,
            clips: this.clips.map(c => c.toJSON()),
            muted: this.muted,
            solo: this.solo,
            locked: this.locked,
            hidden: this.hidden,
            volume: this.volume,
            opacity: this.opacity,
            blendMode: this.blendMode
        };
    }
}

// ========================================
// Timeline Class
// ========================================

export class MultiTrackTimeline {
    constructor() {
        this.tracks = [];
        this.duration = 60; // default 60 seconds
        this.currentTime = 0;
        this.playing = false;
        this.zoom = 1; // pixels per second
        this.scrollX = 0;
        this.selectedClips = new Set();
        this.playhead = 0;
        this.loop = false;
        this.loopStart = 0;
        this.loopEnd = 60;
        this.snapToGrid = true;
        this.gridSize = 1; // seconds
        
        // Callbacks
        this.onTimeUpdate = null;
        this.onClipSelect = null;
        this.onClipMove = null;
        this.onClipTrim = null;
        this.onTrackChange = null;
    }
    
    // Create default tracks
    createDefaultTracks() {
        this.tracks = [
            new TimelineTrack({ type: 'video', name: 'वीडियो 1' }),
            new TimelineTrack({ type: 'video', name: 'वीडियो 2' }),
            new TimelineTrack({ type: 'audio', name: 'संगीत' }),
            new TimelineTrack({ type: 'audio', name: 'SFX/डायलॉग' }),
            new TimelineTrack({ type: 'text', name: 'उपशीर्षक' }),
            new TimelineTrack({ type: 'effect', name: 'इफेक्ट्स' }),
            new TimelineTrack({ type: 'camera', name: 'कैमरा' })
        ];
    }
    
    // Add track
    addTrack(type, name = null) {
        const track = new TimelineTrack({ type, name });
        this.tracks.push(track);
        if (this.onTrackChange) this.onTrackChange('add', track);
        return track;
    }
    
    // Remove track
    removeTrack(trackId) {
        this.tracks = this.tracks.filter(t => t.id !== trackId);
        if (this.onTrackChange) this.onTrackChange('remove', trackId);
    }
    
    // Get track by ID
    getTrack(trackId) {
        return this.tracks.find(t => t.id === trackId);
    }
    
    // Add clip to track
    addClipToTrack(trackId, clip, time = null) {
        const track = this.getTrack(trackId);
        if (!track) return null;
        
        // Check for overlaps if not moving to empty space
        if (time === null) {
            // Find first available slot
            time = this.findEmptySlot(track, clip.duration);
        }
        
        // Check overlap
        if (track.hasOverlap({ ...clip, startTime: time, endTime: time + clip.duration })) {
            // Try to find next available slot
            time = this.findEmptySlot(track, clip.duration, time);
        }
        
        return track.addClip(clip, time);
    }
    
    // Find empty slot in track
    findEmptySlot(track, duration, startFrom = 0) {
        let time = startFrom;
        const clips = track.clips.filter(c => c.endTime > time).sort((a, b) => a.startTime - b.startTime);
        
        for (const clip of clips) {
            if (time + duration <= clip.startTime) {
                return time;
            }
            time = clip.endTime;
        }
        return time;
    }
    
    // Move clip
    moveClip(clipId, newTrackId, newTime) {
        const oldTrack = this.tracks.find(t => t.clips.some(c => c.id === clipId));
        if (!oldTrack) return false;
        
        const clipIndex = oldTrack.clips.findIndex(c => c.id === clipId);
        if (clipIndex === -1) return false;
        
        const clip = oldTrack.clips[clipIndex];
        
        // Remove from old track
        oldTrack.clips.splice(clipIndex, 1);
        
        // Add to new track
        const newTrack = this.getTrack(newTrackId);
        if (!newTrack) {
            // Put back
            oldTrack.clips.splice(clipIndex, 0, clip);
            return false;
        }
        
        // Check overlap
        if (newTrack.hasOverlap({ ...clip, startTime: newTime, endTime: newTime + clip.duration })) {
            // Put back
            oldTrack.clips.splice(clipIndex, 0, clip);
            return false;
        }
        
        clip.trackId = newTrackId;
        clip.startTime = newTime;
        clip.updateEndTime();
        newTrack.addClip(clip);
        
        if (this.onClipMove) this.onClipMove(clip, oldTrack.id, newTrackId);
        return true;
    }
    
    // Trim clip
    trimClip(clipId, newStart, newEnd) {
        const track = this.tracks.find(t => t.clips.some(c => c.id === clipId));
        if (!track) return false;
        
        const clip = track.clips.find(c => c.id === clipId);
        if (!clip) return false;
        
        if (newStart >= newEnd) return false;
        
        const oldDuration = clip.duration;
        clip.startTime = newStart;
        clip.duration = newEnd - newStart;
        clip.updateEndTime();
        
        // Adjust source timing
        const progressStart = (newStart - (clip.startTime - (clip.duration - oldDuration))) / oldDuration;
        clip.sourceStart += progressStart * clip.sourceDuration;
        clip.sourceDuration = (newEnd - newStart) / clip.duration * clip.sourceDuration;
        
        if (this.onClipTrim) this.onClipTrim(clip);
        return true;
    }
    
    // Split clip at playhead
    splitClipAtPlayhead(clipId) {
        const track = this.tracks.find(t => t.clips.some(c => c.id === clipId));
        if (!track) return null;
        
        const clip = track.clips.find(c => c.id === clipId);
        if (!clip || !clip.containsTime(this.playhead)) return null;
        
        const rightClip = clip.split(this.playhead);
        if (rightClip) {
            track.clips.push(rightClip);
            track.sortClips();
            return rightClip;
        }
        return null;
    }
    
    // Select/deselect clips
    selectClip(clipId, multi = false) {
        if (!multi) {
            this.selectedClips.clear();
        }
        this.selectedClips.add(clipId);
        if (this.onClipSelect) this.onClipSelect(Array.from(this.selectedClips));
    }
    
    deselectAll() {
        this.selectedClips.clear();
        if (this.onClipSelect) this.onClipSelect([]);
    }
    
    // Delete selected clips
    deleteSelectedClips() {
        this.selectedClips.forEach(clipId => {
            const track = this.tracks.find(t => t.clips.some(c => c.id === clipId));
            if (track) {
                track.removeClip(clipId);
            }
        });
        this.selectedClips.clear();
    }
    
    // Playback controls
    play() {
        this.playing = true;
    }
    
    pause() {
        this.playing = false;
    }
    
    stop() {
        this.playing = false;
        this.currentTime = 0;
        this.playhead = 0;
    }
    
    seek(time) {
        this.currentTime = Math.max(0, Math.min(time, this.duration));
        this.playhead = this.currentTime;
        if (this.onTimeUpdate) this.onTimeUpdate(this.currentTime);
    }
    
    // Update timeline (call each frame)
    update(deltaTime) {
        if (!this.playing) return;
        
        this.currentTime += deltaTime;
        this.playhead = this.currentTime;
        
        if (this.currentTime >= this.duration) {
            if (this.loop) {
                this.currentTime = this.loopStart;
                this.playhead = this.loopStart;
            } else {
                this.pause();
                this.currentTime = this.duration;
                this.playhead = this.duration;
            }
        }
        
        if (this.onTimeUpdate) this.onTimeUpdate(this.currentTime);
    }
    
    // Get current frame data for rendering
    getCurrentFrame() {
        const frame = {
            time: this.currentTime,
            tracks: []
        };
        
        this.tracks.forEach(track => {
            if (track.hidden) return;
            
            const activeClips = track.clips.filter(c => c.containsTime(this.currentTime));
            
            frame.tracks.push({
                trackId: track.id,
                trackType: track.type,
                trackName: track.name,
                muted: track.muted || track.solo,
                solo: track.solo,
                volume: track.volume,
                opacity: track.opacity,
                blendMode: track.blendMode,
                clips: activeClips.map(clip => ({
                    clip,
                    progress: clip.getProgress(this.currentTime),
                    sourceTime: clip.sourceStart + clip.getProgress(this.currentTime) * clip.sourceDuration
                }))
            });
        });
        
        return frame;
    }
    
    // Snap time to grid
    snapTime(time) {
        if (!this.snapToGrid) return time;
        return Math.round(time / this.gridSize) * this.gridSize;
    }
    
    // Auto-set duration based on content
    autoSetDuration() {
        let maxEnd = 0;
        this.tracks.forEach(track => {
            track.clips.forEach(clip => {
                maxEnd = Math.max(maxEnd, clip.endTime);
            });
        });
        this.duration = Math.max(maxEnd + 2, 10); // Add 2 seconds padding
        return this.duration;
    }
    
    // Export timeline data
    exportJSON() {
        return {
            duration: this.duration,
            zoom: this.zoom,
            loop: this.loop,
            loopStart: this.loopStart,
            loopEnd: this.loopEnd,
            tracks: this.tracks.map(t => t.toJSON())
        };
    }
    
    // Import timeline data
    importJSON(data) {
        this.duration = data.duration || 60;
        this.zoom = data.zoom || 1;
        this.loop = data.loop || false;
        this.loopStart = data.loopStart || 0;
        this.loopEnd = data.loopEnd || this.duration;
        
        this.tracks = data.tracks.map(trackData => {
            const track = new TimelineTrack(trackData);
            track.clips = trackData.clips.map(clipData => new TimelineClip(clipData));
            return track;
        });
    }
    
    // Render timeline to video (would use WebCodecs or MediaRecorder)
    async renderToVideo(options = {}) {
        // This would integrate with the existing video export system
        // For now, return the frame data for each frame
        const frames = [];
        const fps = options.fps || 30;
        const frameDuration = 1 / fps;
        const totalFrames = Math.ceil(this.duration * fps);
        
        for (let i = 0; i < totalFrames; i++) {
            const time = i * frameDuration;
            this.seek(time);
            frames.push(this.getCurrentFrame());
        }
        
        this.seek(0);
        return frames;
    }
}

// ========================================
// Timeline UI Controller
// ========================================

export class TimelineUI {
    constructor(timeline, containerId) {
        this.timeline = timeline;
        this.container = document.getElementById(containerId);
        this.canvas = null;
        this.ctx = null;
        this.dragging = null;
        this.resizing = null;
        this.selecting = false;
        this.selectionStart = { x: 0, y: 0 };
        this.lastMousePos = { x: 0, y: 0 };
        
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="timeline-container">
                <div class="timeline-header">
                    <div class="timeline-track-headers" id="trackHeaders"></div>
                    <div class="timeline-ruler" id="timelineRuler"></div>
                </div>
                <div class="timeline-body">
                    <div class="timeline-track-lanes" id="trackLanes"></div>
                </div>
                <div class="timeline-controls">
                    <div class="playback-controls">
                        <button class="btn btn-small" id="timelineRewind">⏮</button>
                        <button class="btn btn-small" id="timelinePlay">▶</button>
                        <button class="btn btn-small" id="timelinePause">⏸</button>
                        <button class="btn btn-small" id="timelineStop">⏹</button>
                        <button class="btn btn-small" id="timelineForward">⏭</button>
                    </div>
                    <div class="timeline-time-display">
                        <span id="currentTimeDisplay">00:00.00</span> / <span id="totalTimeDisplay">00:00.00</span>
                    </div>
                    <div class="timeline-zoom">
                        <label>ज़ूम:</label>
                        <input type="range" id="timelineZoom" min="0.1" max="10" step="0.1" value="1">
                    </div>
                </div>
            </div>
        `;
        
        this.bindEvents();
        this.render();
    }
    
    bindEvents() {
        // Playback controls
        $('#timelinePlay').addEventListener('click', () => this.timeline.play());
        $('#timelinePause').addEventListener('click', () => this.timeline.pause());
        $('#timelineStop').addEventListener('click', () => this.timeline.stop());
        $('#timelineRewind').addEventListener('click', () => this.timeline.seek(0));
        $('#timelineForward').addEventListener('click', () => this.timeline.seek(this.timeline.duration));
        
        // Zoom
        $('#timelineZoom').addEventListener('input', (e) => {
            this.timeline.zoom = parseFloat(e.target.value);
            this.render();
        });
        
        // Track lanes mouse events
        const trackLanes = $('#trackLanes');
        if (trackLanes) {
            trackLanes.addEventListener('mousedown', (e) => this.onMouseDown(e));
            trackLanes.addEventListener('mousemove', (e) => this.onMouseMove(e));
            trackLanes.addEventListener('mouseup', () => this.onMouseUp());
            trackLanes.addEventListener('mouseleave', () => this.onMouseUp());
            trackLanes.addEventListener('wheel', (e) => this.onWheel(e));
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
    }
    
    onMouseDown(e) {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left + this.timeline.scrollX;
        const y = e.clientY - rect.top;
        const time = x / this.timeline.zoom;
        
        // Check if clicking on clip
        const clip = this.getClipAtPosition(x, y);
        if (clip) {
            if (e.shiftKey) {
                this.timeline.selectClip(clip.id, true);
            } else {
                this.timeline.selectClip(clip.id, false);
            }
            
            // Check if resizing (near edges)
            const clipRect = this.getClipRect(clip);
            if (x - clipRect.left < 10) {
                this.resizing = { clip, side: 'left', startX: x, startTime: clip.startTime };
            } else if (clipRect.right - x < 10) {
                this.resizing = { clip, side: 'right', startX: x, startDuration: clip.duration };
            } else {
                this.dragging = { clip, startX: x, startTime: clip.startTime, trackId: clip.trackId };
            }
        } else {
            // Start selection box
            this.selecting = true;
            this.selectionStart = { x, y };
        }
        
        this.lastMousePos = { x, y };
    }
    
    onMouseMove(e) {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left + this.timeline.scrollX;
        const y = e.clientY - rect.top;
        
        if (this.dragging) {
            const deltaTime = (x - this.dragging.startX) / this.timeline.zoom;
            const newTime = this.timeline.snapTime(this.dragging.startTime + deltaTime);
            this.timeline.moveClip(this.dragging.clip.id, this.dragging.trackId, newTime);
            this.render();
        } else if (this.resizing) {
            const deltaTime = (x - this.resizing.startX) / this.timeline.zoom;
            if (this.resizing.side === 'left') {
                const newStart = this.timeline.snapTime(this.resizing.startTime + deltaTime);
                this.timeline.trimClip(this.resizing.clip.id, newStart, this.resizing.clip.endTime);
            } else {
                const newDuration = Math.max(0.1, this.resizing.startDuration + deltaTime);
                this.timeline.trimClip(this.resizing.clip.id, this.resizing.clip.startTime, this.resizing.clip.startTime + newDuration);
            }
            this.render();
        } else if (this.selecting) {
            // Update selection box
            this.renderSelectionBox(this.selectionStart.x, this.selectionStart.y, x, y);
        }
    }
    
    onMouseUp() {
        this.dragging = null;
        this.resizing = null;
        this.selecting = false;
    }
    
    onWheel(e) {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1;
            this.timeline.zoom = Math.max(0.1, Math.min(10, this.timeline.zoom + zoomDelta));
            $('#timelineZoom').value = this.timeline.zoom;
            this.render();
        } else {
            this.timeline.scrollX += e.deltaY;
            this.render();
        }
    }
    
    onKeyDown(e) {
        if (e.target.tagName === 'INPUT') return;
        
        switch (e.key) {
            case ' ':
                e.preventDefault();
                if (this.timeline.playing) this.timeline.pause();
                else this.timeline.play();
                break;
            case 'Delete':
            case 'Backspace':
                this.timeline.deleteSelectedClips();
                this.render();
                break;
            case 'ArrowLeft':
                this.timeline.seek(this.timeline.currentTime - 1);
                break;
            case 'ArrowRight':
                this.timeline.seek(this.timeline.currentTime + 1);
                break;
            case 'Home':
                this.timeline.seek(0);
                break;
            case 'End':
                this.timeline.seek(this.timeline.duration);
                break;
            case 's':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.saveProject();
                }
                break;
        }
    }
    
    getClipAtPosition(x, y) {
        // Convert x,y to track and clip
        const trackHeight = 60; // approximate
        const trackIndex = Math.floor(y / trackHeight);
        if (trackIndex >= this.timeline.tracks.length) return null;
        
        const track = this.timeline.tracks[trackIndex];
        return track.getClipAtTime(x / this.timeline.zoom);
    }
    
    getClipRect(clip) {
        const track = this.timeline.getTrack(clip.trackId);
        const trackIndex = this.timeline.tracks.indexOf(track);
        const trackHeight = track.height || 60;
        
        return {
            left: clip.startTime * this.timeline.zoom,
            right: clip.endTime * this.timeline.zoom,
            top: trackIndex * trackHeight,
            bottom: (trackIndex + 1) * trackHeight
        };
    }
    
    render() {
        if (!this.container) return;
        
        // Render track headers
        this.renderTrackHeaders();
        
        // Render ruler
        this.renderRuler();
        
        // Render track lanes
        this.renderTrackLanes();
        
        // Render playhead
        this.renderPlayhead();
        
        // Update time display
        this.updateTimeDisplay();
    }
    
    renderTrackHeaders() {
        const headers = $('#trackHeaders');
        if (!headers) return;
        
        headers.innerHTML = this.timeline.tracks.map((track, index) => `
            <div class="track-header" style="height: ${track.height}px; border-left: 4px solid ${track.color};" data-track-id="${track.id}">
                <div class="track-controls">
                    <input type="checkbox" class="track-mute" ${track.muted ? 'checked' : ''} title="म्यूट">
                    <input type="checkbox" class="track-solo" ${track.solo ? 'checked' : ''} title="सोलो">
                    <input type="checkbox" class="track-lock" ${track.locked ? 'checked' : ''} title="लॉक">
                    <input type="checkbox" class="track-hide" ${track.hidden ? 'checked' : ''} title="छिपाएं">
                </div>
                <div class="track-name">${track.name}</div>
                <div class="track-type">${TRACK_TYPES[track.type]?.icon || ''} ${TRACK_TYPES[track.type]?.name || track.type}</div>
                <div class="track-volume">
                    <input type="range" class="track-vol-slider" min="0" max="1" step="0.1" value="${track.volume}" style="width: 60px;">
                </div>
            </div>
        `).join('');
        
        // Bind track header events
        headers.querySelectorAll('.track-mute').forEach((cb, i) => {
            cb.addEventListener('change', (e) => {
                this.timeline.tracks[i].muted = e.target.checked;
                this.render();
            });
        });
        headers.querySelectorAll('.track-solo').forEach((cb, i) => {
            cb.addEventListener('change', (e) => {
                this.timeline.tracks[i].solo = e.target.checked;
                this.render();
            });
        });
        headers.querySelectorAll('.track-lock').forEach((cb, i) => {
            cb.addEventListener('change', (e) => {
                this.timeline.tracks[i].locked = e.target.checked;
            });
        });
        headers.querySelectorAll('.track-hide').forEach((cb, i) => {
            cb.addEventListener('change', (e) => {
                this.timeline.tracks[i].hidden = e.target.checked;
                this.render();
            });
        });
        headers.querySelectorAll('.track-vol-slider').forEach((slider, i) => {
            slider.addEventListener('input', (e) => {
                this.timeline.tracks[i].volume = parseFloat(e.target.value);
            });
        });
    }
    
    renderRuler() {
        const ruler = $('#timelineRuler');
        if (!ruler) return;
        
        const pixelsPerSecond = this.timeline.zoom;
        const totalPixels = this.timeline.duration * pixelsPerSecond;
        const majorInterval = this.getMajorInterval();
        const minorInterval = this.timeline.gridSize;
        
        let html = '<div class="ruler-major">';
        for (let t = 0; t <= this.timeline.duration; t += majorInterval) {
            const x = t * pixelsPerSecond;
            html += `<div class="ruler-mark" style="left: ${x}px;" data-time="${t}">${this.formatTime(t)}</div>`;
        }
        html += '</div>';
        
        html += '<div class="ruler-minor">';
        for (let t = 0; t <= this.timeline.duration; t += minorInterval) {
            const x = t * pixelsPerSecond;
            if (t % majorInterval !== 0) {
                html += `<div class="ruler-minor-mark" style="left: ${x}px;"></div>`;
            }
        }
        html += '</div>';
        
        ruler.innerHTML = html;
        ruler.style.width = `${totalPixels}px`;
    }
    
    getMajorInterval() {
        const duration = this.timeline.duration;
        if (duration <= 10) return 1;
        if (duration <= 30) return 5;
        if (duration <= 60) return 10;
        if (duration <= 300) return 30;
        return 60;
    }
    
    renderTrackLanes() {
        const lanes = $('#trackLanes');
        if (!lanes) return;
        
        const pixelsPerSecond = this.timeline.zoom;
        const totalPixels = this.timeline.duration * pixelsPerSecond;
        
        let html = '';
        this.timeline.tracks.forEach((track, trackIndex) => {
            if (track.hidden) {
                html += `<div class="track-lane hidden" style="height: ${track.height}px;"></div>`;
                return;
            }
            
            html += `<div class="track-lane" style="height: ${track.height}px;" data-track-id="${track.id}">`;
            
            track.clips.forEach(clip => {
                const left = clip.startTime * pixelsPerSecond;
                const width = clip.duration * pixelsPerSecond;
                const isSelected = this.timeline.selectedClips.has(clip.id);
                
                html += `
                    <div class="timeline-clip ${clip.type} ${isSelected ? 'selected' : ''} ${clip.locked ? 'locked' : ''} ${clip.muted ? 'muted' : ''}"
                         style="left: ${left}px; width: ${width}px; background: ${clip.color};"
                         data-clip-id="${clip.id}">
                        <div class="clip-name">${clip.name}</div>
                        <div class="clip-time">${this.formatTime(clip.startTime)} - ${this.formatTime(clip.endTime)}</div>
                        <div class="clip-trim-left" title="ट्रिम शुरू"></div>
                        <div class="clip-trim-right" title="ट्रिम अंत"></div>
                    </div>
                `;
            });
            
            html += '</div>';
        });
        
        lanes.innerHTML = html;
        lanes.style.width = `${totalPixels}px`;
    }
    
    renderPlayhead() {
        const lanes = $('#trackLanes');
        if (!lanes) return;
        
        // Remove existing playhead
        const existing = lanes.querySelector('.playhead');
        if (existing) existing.remove();
        
        const playheadX = this.timeline.playhead * this.timeline.zoom - this.timeline.scrollX;
        if (playheadX >= 0 && playheadX <= lanes.clientWidth) {
            const playhead = document.createElement('div');
            playhead.className = 'playhead';
            playhead.style.left = `${playheadX}px`;
            playhead.innerHTML = '<div class="playhead-triangle"></div><div class="playhead-line"></div>';
            lanes.appendChild(playhead);
        }
    }
    
    updateTimeDisplay() {
        const current = $('#currentTimeDisplay');
        const total = $('#totalTimeDisplay');
        if (current) current.textContent = this.formatTime(this.timeline.currentTime);
        if (total) total.textContent = this.formatTime(this.timeline.duration);
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 100);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    }
    
    renderSelectionBox(x1, y1, x2, y2) {
        // Would render a selection rectangle
    }
    
    saveProject() {
        const data = this.timeline.exportJSON();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `timeline_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// ========================================
// Export
// ========================================

// All exports are already declared with 'export' keyword above
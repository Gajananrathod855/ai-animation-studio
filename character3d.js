/**
 * 3D Human Character Class
 * Creates procedural 3D human characters with full customization
 * Uses only Three.js primitives - no external models needed
 */

import * as THREE from 'three';
import { 
    CHARACTER_PRESETS, 
    SKIN_TONES, 
    HAIR_STYLES, 
    HAIR_COLORS, 
    EYE_COLORS,
    CLOTHING_PRESETS,
    ANIMATION_CLIPS,
    FACIAL_EXPRESSIONS
} from './characters.js';

export class Character3D {
    constructor(options = {}) {
        this.id = options.id || THREE.MathUtils.generateUUID();
        this.name = options.name || 'Character';
        
        // Character definition
        this.preset = options.preset || 'adult';
        this.skinTone = options.skinTone || 2; // Medium
        this.hairStyle = options.hairStyle || 'short';
        this.hairColor = options.hairColor || 0; // Black
        this.eyeColor = options.eyeColor || 0; // Brown
        this.clothing = options.clothing || 'casual';
        
        // Customization
        this.bodyScale = options.bodyScale || { height: 1.0, width: 1.0, depth: 1.0 };
        this.headScale = options.headScale || 1.0;
        this.limbLength = options.limbLength || 1.0;
        
        // Visual style
        this.visualStyle = options.visualStyle || 'paper-cutout'; // 'paper-cutout' or 'realistic'
        this.paperThickness = options.paperThickness || 0.06;
        
        // Animation state
        this.currentAnimation = 'idle';
        this.animationTime = 0;
        this.animationSpeed = 1.0;
        this.isPlaying = false;
        
        // Facial expression
        this.currentExpression = 'neutral';
        this.expressionIntensity = 1.0;
        this.blendshapes = {};
        
        // Three.js objects
        this.group = new THREE.Group();
        this.group.name = `Character_${this.id}`;
        
        // Outline group for paper-cutout style
        this.outlineGroup = new THREE.Group();
        this.outlineGroup.name = 'Outlines';
        this.group.add(this.outlineGroup);
        
        // Body parts references
        this.parts = {
            // Root
            root: null,
            hips: null,
            
            // Spine
            spine: null,
            spine1: null,
            spine2: null,
            neck: null,
            head: null,
            
            // Left arm
            leftShoulder: null,
            leftArm: null,
            leftForearm: null,
            leftHand: null,
            
            // Right arm
            rightShoulder: null,
            rightArm: null,
            rightForearm: null,
            rightHand: null,
            
            // Left leg
            leftThigh: null,
            leftShin: null,
            leftFoot: null,
            leftToes: null,
            
            // Right leg
            rightThigh: null,
            rightShin: null,
            rightFoot: null,
            rightToes: null,
            
            // Face
            face: {
                leftEye: null,
                rightEye: null,
                leftPupil: null,
                rightPupil: null,
                leftEyebrow: null,
                rightEyebrow: null,
                nose: null,
                mouth: null,
                teeth: null,
                tongue: null
            },
            
            // Hair
            hair: null,
            
            // Clothing
            clothes: {
                shirt: null,
                pants: null,
                shoes: null,
                jacket: null
            }
        };
        
        // Animation mixer
        this.mixer = null;
        this.clips = {};
        this.actions = {};
        
        // IK targets
        this.ikTargets = {
            leftHand: new THREE.Vector3(),
            rightHand: new THREE.Vector3(),
            leftFoot: new THREE.Vector3(),
            rightFoot: new THREE.Vector3()
        };
        
        // Look-at target
        this.lookAtTarget = new THREE.Vector3(0, 1.6, -5);
        
        // Interaction state
        this.isWalking = false;
        this.walkTarget = null;
        this.walkSpeed = 1.0;
        this.walkStopDistance = 0.5;
        this.walkFaceTarget = true;
        this.walkOnComplete = null;
        this.walkOnProgress = null;
        this.heldObject = null;
        this.holdHand = 'right';
        
        // Initialize
        this.createCharacter();
        this.createAnimations();
    }
    
    createCharacter() {
        const preset = CHARACTER_PRESETS[this.preset] || CHARACTER_PRESETS.adult;
        const skinTone = SKIN_TONES[this.skinTone] || SKIN_TONES[2];
        const hairStyle = HAIR_STYLES[this.hairStyle] || HAIR_STYLES.short;
        const hairColor = HAIR_COLORS[this.hairColor] || HAIR_COLORS[0];
        const eyeColor = EYE_COLORS[this.eyeColor] || EYE_COLORS[0];
        const clothing = CLOTHING_PRESETS[this.clothing] || CLOTHING_PRESETS.casual;
        
        // Apply body scale
        const height = preset.bodyScale.height * this.bodyScale.height;
        const width = preset.bodyScale.width * this.bodyScale.width;
        const depth = preset.bodyScale.depth * this.bodyScale.depth;
        
        // Create materials
        this.materials = this.createMaterials(skinTone, hairColor, eyeColor, clothing);
        
        // Build skeleton hierarchy
        this.buildSkeleton(height, width, depth, preset);
        
        // Build mesh geometry
        this.buildGeometry(height, width, depth, preset, hairStyle);
        
        // Add clothing
        this.addClothing(clothing, height, width, depth);
        
        // Add hair
        this.addHair(hairStyle, hairColor, preset);
        
        // Setup shadows
        this.enableShadows(true);
        
        // Create paper-cutout outlines
        this.createOutlines();
        
        // Create animation mixer
        this.mixer = new THREE.AnimationMixer(this.group);
    }
    
    createMaterials(skinTone, hairColor, eyeColor, clothing) {
        const isPaperStyle = this.visualStyle === 'paper-cutout';
        
        const createMaterial = (color, options = {}) => new THREE.MeshStandardMaterial({
            color,
            roughness: isPaperStyle ? 0.95 : 0.7,
            metalness: isPaperStyle ? 0.0 : 0.1,
            flatShading: isPaperStyle,
            ...options
        });
        
        // Skin materials
        const skinMat = createMaterial(skinTone.color, { 
            subsurfaceScattering: !isPaperStyle,
            skinning: true
        });
        const skinMatDark = createMaterial(skinTone.shade, { skinning: true });
        
        // Hair material
        const hairMat = createMaterial(hairColor.color, { 
            sheen: isPaperStyle ? 0.0 : 0.3,
            sheenColor: new THREE.Color(hairColor.highlight)
        });
        
        // Eye materials
        const eyeWhiteMat = createMaterial(eyeColor.sclera, { 
            roughness: isPaperStyle ? 0.9 : 0.1
        });
        const irisMat = createMaterial(eyeColor.iris, { 
            roughness: isPaperStyle ? 0.8 : 0.3
        });
        const pupilMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        
        // Eyebrow material
        const eyebrowMat = createMaterial(hairColor.color);
        
        // Mouth and teeth
        const mouthMat = createMaterial(0x8b3a3a);
        const teethMat = createMaterial(0xf5f0e1);
        
        // Clothing materials
        const clothingMats = {};
        if (clothing.shirt) {
            clothingMats.shirt = createMaterial(clothing.shirt.color);
        }
        if (clothing.pants) {
            clothingMats.pants = createMaterial(clothing.pants.color);
        }
        if (clothing.shoes) {
            clothingMats.shoes = createMaterial(clothing.shoes.color);
        }
        if (clothing.jacket) {
            clothingMats.jacket = createMaterial(clothing.jacket.color);
        }
        
        return {
            skin: skinMat,
            skinDark: skinMatDark,
            hair: hairMat,
            eyeWhite: eyeWhiteMat,
            iris: irisMat,
            pupil: pupilMat,
            eyebrow: eyebrowMat,
            mouth: mouthMat,
            teeth: teethMat,
            clothing: clothingMats
        };
    }
    
    buildSkeleton(height, width, depth, preset) {
        // Root/hips position
        const hipHeight = height * 0.52;
        
        // Create bone hierarchy using Groups
        this.parts.root = new THREE.Group();
        this.parts.root.name = 'Root';
        this.parts.root.position.y = hipHeight;
        this.group.add(this.parts.root);
        
        // Hips
        this.parts.hips = new THREE.Group();
        this.parts.hips.name = 'Hips';
        this.parts.root.add(this.parts.hips);
        
        // Spine
        this.parts.spine = new THREE.Group();
        this.parts.spine.name = 'Spine';
        this.parts.spine.position.y = height * 0.08;
        this.parts.hips.add(this.parts.spine);
        
        this.parts.spine1 = new THREE.Group();
        this.parts.spine1.name = 'Spine1';
        this.parts.spine1.position.y = height * 0.12;
        this.parts.spine.add(this.parts.spine1);
        
        this.parts.spine2 = new THREE.Group();
        this.parts.spine2.name = 'Spine2';
        this.parts.spine2.position.y = height * 0.12;
        this.parts.spine1.add(this.parts.spine2);
        
        // Neck
        this.parts.neck = new THREE.Group();
        this.parts.neck.name = 'Neck';
        this.parts.neck.position.y = height * 0.1;
        this.parts.spine2.add(this.parts.neck);
        
        // Head
        this.parts.head = new THREE.Group();
        this.parts.head.name = 'Head';
        this.parts.head.position.y = height * 0.12 * this.headScale;
        this.parts.neck.add(this.parts.head);
        
        // Shoulders
        const shoulderWidth = width * 0.6;
        
        this.parts.leftShoulder = new THREE.Group();
        this.parts.leftShoulder.name = 'LeftShoulder';
        this.parts.leftShoulder.position.set(-shoulderWidth, height * 0.02, 0);
        this.parts.spine2.add(this.parts.leftShoulder);
        
        this.parts.rightShoulder = new THREE.Group();
        this.parts.rightShoulder.name = 'RightShoulder';
        this.parts.rightShoulder.position.set(shoulderWidth, height * 0.02, 0);
        this.parts.spine2.add(this.parts.rightShoulder);
        
        // Arms
        const armLength = height * 0.32 * this.limbLength;
        const forearmLength = height * 0.28 * this.limbLength;
        
        // Left arm
        this.parts.leftArm = new THREE.Group();
        this.parts.leftArm.name = 'LeftArm';
        this.parts.leftArm.position.y = -height * 0.02;
        this.parts.leftShoulder.add(this.parts.leftArm);
        
        this.parts.leftForearm = new THREE.Group();
        this.parts.leftForearm.name = 'LeftForearm';
        this.parts.leftForearm.position.y = -armLength;
        this.parts.leftArm.add(this.parts.leftForearm);
        
        this.parts.leftHand = new THREE.Group();
        this.parts.leftHand.name = 'LeftHand';
        this.parts.leftHand.position.y = -forearmLength;
        this.parts.leftForearm.add(this.parts.leftHand);
        
        // Right arm
        this.parts.rightArm = new THREE.Group();
        this.parts.rightArm.name = 'RightArm';
        this.parts.rightArm.position.y = -height * 0.02;
        this.parts.rightShoulder.add(this.parts.rightArm);
        
        this.parts.rightForearm = new THREE.Group();
        this.parts.rightForearm.name = 'RightForearm';
        this.parts.rightForearm.position.y = -armLength;
        this.parts.rightArm.add(this.parts.rightForearm);
        
        this.parts.rightHand = new THREE.Group();
        this.parts.rightHand.name = 'RightHand';
        this.parts.rightHand.position.y = -forearmLength;
        this.parts.rightForearm.add(this.parts.rightHand);
        
        // Legs
        const thighLength = height * 0.26 * this.limbLength;
        const shinLength = height * 0.25 * this.limbLength;
        const hipWidth = width * 0.2;
        
        // Left leg
        this.parts.leftThigh = new THREE.Group();
        this.parts.leftThigh.name = 'LeftThigh';
        this.parts.leftThigh.position.set(-hipWidth, 0, 0);
        this.parts.hips.add(this.parts.leftThigh);
        
        this.parts.leftShin = new THREE.Group();
        this.parts.leftShin.name = 'LeftShin';
        this.parts.leftShin.position.y = -thighLength;
        this.parts.leftThigh.add(this.parts.leftShin);
        
        this.parts.leftFoot = new THREE.Group();
        this.parts.leftFoot.name = 'LeftFoot';
        this.parts.leftFoot.position.y = -shinLength;
        this.parts.leftShin.add(this.parts.leftFoot);
        
        this.parts.leftToes = new THREE.Group();
        this.parts.leftToes.name = 'LeftToes';
        this.parts.leftToes.position.y = -height * 0.04;
        this.parts.leftFoot.add(this.parts.leftToes);
        
        // Right leg
        this.parts.rightThigh = new THREE.Group();
        this.parts.rightThigh.name = 'RightThigh';
        this.parts.rightThigh.position.set(hipWidth, 0, 0);
        this.parts.hips.add(this.parts.rightThigh);
        
        this.parts.rightShin = new THREE.Group();
        this.parts.rightShin.name = 'RightShin';
        this.parts.rightShin.position.y = -thighLength;
        this.parts.rightThigh.add(this.parts.rightShin);
        
        this.parts.rightFoot = new THREE.Group();
        this.parts.rightFoot.name = 'RightFoot';
        this.parts.rightFoot.position.y = -shinLength;
        this.parts.rightShin.add(this.parts.rightFoot);
        
        this.parts.rightToes = new THREE.Group();
        this.parts.rightToes.name = 'RightToes';
        this.parts.rightToes.position.y = -height * 0.04;
        this.parts.rightFoot.add(this.parts.rightToes);
        
        // Store initial positions for animation reference
        this.initialPositions = this.captureInitialPositions();
    }
    
    buildGeometry(height, width, depth, preset, hairStyle) {
        const skinMat = this.materials.skin;
        const skinDarkMat = this.materials.skinDark;
        
        // Helper to create body part mesh
        const createPart = (name, w, h, d, color = null, position = [0,0,0], rotation = [0,0,0]) => {
            const geo = new THREE.CapsuleGeometry(w * 0.5, h - w, 8, 16);
            const mat = color || skinMat;
            const mesh = new THREE.Mesh(geo, mat);
            mesh.name = name;
            mesh.position.set(...position);
            mesh.rotation.set(...rotation);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            return mesh;
        };
        
        // Hips/Pelvis
        const hipGeo = new THREE.CapsuleGeometry(width * 0.5, height * 0.1, 8, 16);
        const hipMesh = new THREE.Mesh(hipGeo, skinMat);
        hipMesh.name = 'HipsMesh';
        hipMesh.position.y = -height * 0.02;
        hipMesh.castShadow = true;
        hipMesh.receiveShadow = true;
        this.parts.hips.add(hipMesh);
        
        // Torso (spine + spine1 + spine2 combined)
        const torsoHeight = height * 0.34;
        const torsoGeo = new THREE.CapsuleGeometry(width * 0.4, torsoHeight - width * 0.4, 8, 16);
        const torsoMesh = new THREE.Mesh(torsoGeo, skinMat);
        torsoMesh.name = 'TorsoMesh';
        torsoMesh.position.y = height * 0.12;
        torsoMesh.castShadow = true;
        torsoMesh.receiveShadow = true;
        this.parts.spine.add(torsoMesh);
        
        // Chest detail
        const chestGeo = new THREE.SphereGeometry(width * 0.35, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5);
        const chestMesh = new THREE.Mesh(chestGeo, skinMat);
        chestMesh.name = 'ChestMesh';
        chestMesh.position.y = height * 0.25;
        chestMesh.scale.set(1, 0.6, 0.7);
        chestMesh.castShadow = true;
        this.parts.spine1.add(chestMesh);
        
        // Neck
        const neckGeo = new THREE.CapsuleGeometry(width * 0.12, height * 0.1, 8, 16);
        const neckMesh = new THREE.Mesh(neckGeo, skinMat);
        neckMesh.name = 'NeckMesh';
        neckMesh.position.y = height * 0.05;
        neckMesh.castShadow = true;
        this.parts.neck.add(neckMesh);
        
        // Head
        const headScale = this.headScale;
        const headGeo = new THREE.SphereGeometry(width * 0.45 * headScale, 32, 24);
        const headMesh = new THREE.Mesh(headGeo, skinMat);
        headMesh.name = 'HeadMesh';
        headMesh.position.y = height * 0.06 * headScale;
        headMesh.scale.set(1, 1.1, 1);
        headMesh.castShadow = true;
        headMesh.receiveShadow = true;
        this.parts.head.add(headMesh);
        
        // Face features
        this.createFace(headMesh, width, headScale);
        
        // Shoulders
        const shoulderGeo = new THREE.SphereGeometry(width * 0.18, 16, 12);
        const leftShoulderMesh = new THREE.Mesh(shoulderGeo, skinMat);
        leftShoulderMesh.name = 'LeftShoulderMesh';
        leftShoulderMesh.position.set(-width * 0.55, height * 0.02, 0);
        leftShoulderMesh.scale.set(1, 0.7, 0.7);
        leftShoulderMesh.castShadow = true;
        this.parts.leftShoulder.add(leftShoulderMesh);
        
        const rightShoulderMesh = new THREE.Mesh(shoulderGeo, skinMat);
        rightShoulderMesh.name = 'RightShoulderMesh';
        rightShoulderMesh.position.set(width * 0.55, height * 0.02, 0);
        rightShoulderMesh.scale.set(1, 0.7, 0.7);
        rightShoulderMesh.castShadow = true;
        this.parts.rightShoulder.add(rightShoulderMesh);
        
        // Arms
        this.createArm(this.parts.leftArm, this.parts.leftForearm, this.parts.leftHand, 
            -1, height, width, depth, skinMat, skinDarkMat, false);
        this.createArm(this.parts.rightArm, this.parts.rightForearm, this.parts.rightHand, 
            1, height, width, depth, skinMat, skinDarkMat, true);
        
        // Legs
        this.createLeg(this.parts.leftThigh, this.parts.leftShin, this.parts.leftFoot, this.parts.leftToes,
            -1, height, width, depth, skinMat, skinDarkMat, false);
        this.createLeg(this.parts.rightThigh, this.parts.rightShin, this.parts.rightFoot, this.parts.rightToes,
            1, height, width, depth, skinMat, skinDarkMat, true);
    }
    
    createArm(upperArm, forearm, hand, side, height, width, depth, skinMat, skinDarkMat, isRight) {
        const armLength = height * 0.32 * this.limbLength;
        const forearmLength = height * 0.28 * this.limbLength;
        const armRadius = width * 0.11;
        const forearmRadius = width * 0.09;
        
        // Upper arm
        const upperGeo = new THREE.CapsuleGeometry(armRadius, armLength - armRadius * 2, 8, 16);
        const upperMesh = new THREE.Mesh(upperGeo, skinMat);
        upperMesh.name = `${side > 0 ? 'Right' : 'Left'}UpperArmMesh`;
        upperMesh.position.y = -armLength * 0.5;
        upperMesh.castShadow = true;
        upperMesh.receiveShadow = true;
        upperArm.add(upperMesh);
        
        // Elbow
        const elbowGeo = new THREE.SphereGeometry(armRadius * 1.1, 16, 12);
        const elbowMesh = new THREE.Mesh(elbowGeo, skinDarkMat);
        elbowMesh.name = `${side > 0 ? 'Right' : 'Left'}ElbowMesh`;
        elbowMesh.position.y = -armLength;
        elbowMesh.castShadow = true;
        upperArm.add(elbowMesh);
        
        // Forearm
        const foreGeo = new THREE.CapsuleGeometry(forearmRadius, forearmLength - forearmRadius * 2, 8, 16);
        const foreMesh = new THREE.Mesh(foreGeo, skinMat);
        foreMesh.name = `${side > 0 ? 'Right' : 'Left'}ForearmMesh`;
        foreMesh.position.y = -forearmLength * 0.5;
        foreMesh.castShadow = true;
        foreMesh.receiveShadow = true;
        forearm.add(foreMesh);
        
        // Wrist
        const wristGeo = new THREE.SphereGeometry(forearmRadius * 1.05, 16, 12);
        const wristMesh = new THREE.Mesh(wristGeo, skinDarkMat);
        wristMesh.name = `${side > 0 ? 'Right' : 'Left'}WristMesh`;
        wristMesh.position.y = -forearmLength;
        wristMesh.castShadow = true;
        forearm.add(wristMesh);
        
        // Hand
        const handGeo = new THREE.BoxGeometry(width * 0.22, height * 0.06, depth * 0.18);
        const handMesh = new THREE.Mesh(handGeo, skinMat);
        handMesh.name = `${side > 0 ? 'Right' : 'Left'}HandMesh`;
        handMesh.position.set(0, -height * 0.08, depth * 0.02);
        handMesh.castShadow = true;
        hand.add(handMesh);
        
        // Fingers (simplified as boxes)
        for (let i = 0; i < 4; i++) {
            const fingerGeo = new THREE.CapsuleGeometry(width * 0.015, height * 0.06, 4, 8);
            const fingerMesh = new THREE.Mesh(fingerGeo, skinMat);
            fingerMesh.name = `${side > 0 ? 'Right' : 'Left'}Finger${i}Mesh`;
            fingerMesh.position.set(
                (i - 1.5) * width * 0.045,
                -height * 0.11,
                depth * 0.08
            );
            fingerMesh.rotation.x = -0.2;
            fingerMesh.castShadow = true;
            hand.add(fingerMesh);
        }
        
        // Thumb
        const thumbGeo = new THREE.CapsuleGeometry(width * 0.018, height * 0.045, 4, 8);
        const thumbMesh = new THREE.Mesh(thumbGeo, skinMat);
        thumbMesh.name = `${side > 0 ? 'Right' : 'Left'}ThumbMesh`;
        thumbMesh.position.set(side * width * 0.09, -height * 0.1, depth * 0.05);
        thumbMesh.rotation.z = side * -0.5;
        thumbMesh.rotation.x = -0.3;
        thumbMesh.castShadow = true;
        hand.add(thumbMesh);
    }
    
    createLeg(thigh, shin, foot, toes, side, height, width, depth, skinMat, skinDarkMat, isRight) {
        const thighLength = height * 0.26 * this.limbLength;
        const shinLength = height * 0.25 * this.limbLength;
        const thighRadius = width * 0.16;
        const shinRadius = width * 0.11;
        
        // Thigh
        const thighGeo = new THREE.CapsuleGeometry(thighRadius, thighLength - thighRadius * 2, 8, 16);
        const thighMesh = new THREE.Mesh(thighGeo, skinMat);
        thighMesh.name = `${side > 0 ? 'Right' : 'Left'}ThighMesh`;
        thighMesh.position.y = -thighLength * 0.5;
        thighMesh.castShadow = true;
        thighMesh.receiveShadow = true;
        thigh.add(thighMesh);
        
        // Knee
        const kneeGeo = new THREE.SphereGeometry(thighRadius * 1.1, 16, 12);
        const kneeMesh = new THREE.Mesh(kneeGeo, skinDarkMat);
        kneeMesh.name = `${side > 0 ? 'Right' : 'Left'}KneeMesh`;
        kneeMesh.position.y = -thighLength;
        kneeMesh.castShadow = true;
        thigh.add(kneeMesh);
        
        // Shin
        const shinGeo = new THREE.CapsuleGeometry(shinRadius, shinLength - shinRadius * 2, 8, 16);
        const shinMesh = new THREE.Mesh(shinGeo, skinMat);
        shinMesh.name = `${side > 0 ? 'Right' : 'Left'}ShinMesh`;
        shinMesh.position.y = -shinLength * 0.5;
        shinMesh.castShadow = true;
        shinMesh.receiveShadow = true;
        shin.add(shinMesh);
        
        // Ankle
        const ankleGeo = new THREE.SphereGeometry(shinRadius * 1.1, 16, 12);
        const ankleMesh = new THREE.Mesh(ankleGeo, skinDarkMat);
        ankleMesh.name = `${side > 0 ? 'Right' : 'Left'}AnkleMesh`;
        ankleMesh.position.y = -shinLength;
        ankleMesh.castShadow = true;
        shin.add(ankleMesh);
        
        // Foot
        const footGeo = new THREE.BoxGeometry(width * 0.2, height * 0.06, depth * 0.35);
        const footMesh = new THREE.Mesh(footGeo, skinMat);
        footMesh.name = `${side > 0 ? 'Right' : 'Left'}FootMesh`;
        footMesh.position.set(0, -height * 0.03, depth * 0.12);
        footMesh.castShadow = true;
        foot.add(footMesh);
        
        // Toes
        const toesGeo = new THREE.BoxGeometry(width * 0.18, height * 0.04, depth * 0.15);
        const toesMesh = new THREE.Mesh(toesGeo, skinMat);
        toesMesh.name = `${side > 0 ? 'Right' : 'Left'}ToesMesh`;
        toesMesh.position.set(0, -height * 0.05, depth * 0.25);
        toesMesh.castShadow = true;
        toes.add(toesMesh);
    }
    
    createFace(headMesh, width, headScale) {
        const faceGroup = new THREE.Group();
        faceGroup.name = 'Face';
        faceGroup.position.z = width * 0.45 * headScale;
        headMesh.add(faceGroup);
        
        const eyeWhiteMat = this.materials.eyeWhite;
        const irisMat = this.materials.iris;
        const pupilMat = this.materials.pupil;
        const eyebrowMat = this.materials.eyebrow;
        const mouthMat = this.materials.mouth;
        const teethMat = this.materials.teeth;
        
        const eyeSpacing = width * 0.12 * headScale;
        const eyeHeight = width * 0.02;
        const eyeForward = width * 0.02;
        
        // Left eye
        const leftEyeGroup = new THREE.Group();
        leftEyeGroup.name = 'LeftEye';
        leftEyeGroup.position.set(-eyeSpacing, width * 0.02, eyeForward);
        
        const leftEyeWhite = new THREE.Mesh(
            new THREE.SphereGeometry(width * 0.045 * headScale, 16, 12),
            eyeWhiteMat
        );
        leftEyeWhite.name = 'LeftEyeWhite';
        leftEyeWhite.scale.set(1.3, 0.8, 0.5);
        leftEyeGroup.add(leftEyeWhite);
        
        const leftIris = new THREE.Mesh(
            new THREE.CircleGeometry(width * 0.025 * headScale, 16),
            irisMat
        );
        leftIris.name = 'LeftIris';
        leftIris.position.z = width * 0.015;
        leftIris.rotation.x = -Math.PI * 0.5;
        leftEyeGroup.add(leftIris);
        this.parts.face.leftIris = leftIris;
        
        const leftPupil = new THREE.Mesh(
            new THREE.CircleGeometry(width * 0.012 * headScale, 12),
            pupilMat
        );
        leftPupil.name = 'LeftPupil';
        leftPupil.position.z = width * 0.016;
        leftPupil.rotation.x = -Math.PI * 0.5;
        leftEyeGroup.add(leftPupil);
        this.parts.face.leftPupil = leftPupil;
        
        // Left eyebrow
        const leftEyebrow = new THREE.Mesh(
            new THREE.PlaneGeometry(width * 0.07, width * 0.015),
            eyebrowMat
        );
        leftEyebrow.name = 'LeftEyebrow';
        leftEyebrow.position.set(-eyeSpacing, width * 0.065, eyeForward + width * 0.005);
        leftEyebrow.rotation.x = -0.2;
        faceGroup.add(leftEyebrow);
        this.parts.face.leftEyebrow = leftEyebrow;
        
        faceGroup.add(leftEyeGroup);
        this.parts.face.leftEye = leftEyeGroup;
        
        // Right eye
        const rightEyeGroup = new THREE.Group();
        rightEyeGroup.name = 'RightEye';
        rightEyeGroup.position.set(eyeSpacing, width * 0.02, eyeForward);
        
        const rightEyeWhite = new THREE.Mesh(
            new THREE.SphereGeometry(width * 0.045 * headScale, 16, 12),
            eyeWhiteMat
        );
        rightEyeWhite.name = 'RightEyeWhite';
        rightEyeWhite.scale.set(1.3, 0.8, 0.5);
        rightEyeGroup.add(rightEyeWhite);
        
        const rightIris = new THREE.Mesh(
            new THREE.CircleGeometry(width * 0.025 * headScale, 16),
            irisMat
        );
        rightIris.name = 'RightIris';
        rightIris.position.z = width * 0.015;
        rightIris.rotation.x = -Math.PI * 0.5;
        rightEyeGroup.add(rightIris);
        this.parts.face.rightIris = rightIris;
        
        const rightPupil = new THREE.Mesh(
            new THREE.CircleGeometry(width * 0.012 * headScale, 12),
            pupilMat
        );
        rightPupil.name = 'RightPupil';
        rightPupil.position.z = width * 0.016;
        rightPupil.rotation.x = -Math.PI * 0.5;
        rightEyeGroup.add(rightPupil);
        this.parts.face.rightPupil = rightPupil;
        
        // Right eyebrow
        const rightEyebrow = new THREE.Mesh(
            new THREE.PlaneGeometry(width * 0.07, width * 0.015),
            eyebrowMat
        );
        rightEyebrow.name = 'RightEyebrow';
        rightEyebrow.position.set(eyeSpacing, width * 0.065, eyeForward + width * 0.005);
        rightEyebrow.rotation.x = -0.2;
        faceGroup.add(rightEyebrow);
        this.parts.face.rightEyebrow = rightEyebrow;
        
        faceGroup.add(rightEyeGroup);
        this.parts.face.rightEye = rightEyeGroup;
        
        // Nose
        const noseGeo = new THREE.ConeGeometry(width * 0.025 * headScale, width * 0.05 * headScale, 8);
        const noseMesh = new THREE.Mesh(noseGeo, this.materials.skin);
        noseMesh.name = 'Nose';
        noseMesh.position.set(0, -width * 0.01, eyeForward + width * 0.04);
        noseMesh.rotation.x = Math.PI * 0.5;
        faceGroup.add(noseMesh);
        this.parts.face.nose = noseMesh;
        
        // Mouth
        const mouthGroup = new THREE.Group();
        mouthGroup.name = 'Mouth';
        mouthGroup.position.set(0, -width * 0.05, eyeForward + width * 0.02);
        
        const mouthGeo = new THREE.PlaneGeometry(width * 0.08, width * 0.015);
        const mouthMesh = new THREE.Mesh(mouthGeo, mouthMat);
        mouthMesh.name = 'MouthLips';
        mouthMesh.rotation.x = -0.1;
        mouthGroup.add(mouthMesh);
        this.parts.face.mouth = mouthMesh;
        
        // Teeth
        const teethGeo = new THREE.PlaneGeometry(width * 0.05, width * 0.02);
        const teethMesh = new THREE.Mesh(teethGeo, teethMat);
        teethMesh.name = 'Teeth';
        teethMesh.position.set(0, -width * 0.005, width * 0.002);
        teethMesh.rotation.x = -0.1;
        mouthGroup.add(teethMesh);
        this.parts.face.teeth = teethMesh;
        
        faceGroup.add(mouthGroup);
        
        // Ears
        const earGeo = new THREE.SphereGeometry(width * 0.03 * headScale, 12, 10);
        earGeo.scale(0.7, 1.2, 0.4);
        
        const leftEar = new THREE.Mesh(earGeo, this.materials.skin);
        leftEar.name = 'LeftEar';
        leftEar.position.set(-width * 0.45 * headScale, 0, 0);
        leftEar.rotation.y = Math.PI * 0.5;
        faceGroup.add(leftEar);
        
        const rightEar = new THREE.Mesh(earGeo, this.materials.skin);
        rightEar.name = 'RightEar';
        rightEar.position.set(width * 0.45 * headScale, 0, 0);
        rightEar.rotation.y = -Math.PI * 0.5;
        faceGroup.add(rightEar);
        
        // Store face group
        this.parts.face.group = faceGroup;
    }
    
    addHair(hairStyle, hairColor, preset) {
        if (hairStyle === 'bald') return;
        
        const hairGroup = new THREE.Group();
        hairGroup.name = 'Hair';
        
        const hairMat = this.materials.hair;
        const headWidth = 0.45 * this.headScale;
        const headHeight = 0.5 * this.headScale;
        
        switch (hairStyle) {
            case 'short':
                this.createShortHair(hairGroup, hairMat, headWidth, headHeight);
                break;
            case 'medium':
                this.createMediumHair(hairGroup, hairMat, headWidth, headHeight);
                break;
            case 'long':
                this.createLongHair(hairGroup, hairMat, headWidth, headHeight);
                break;
            case 'curly':
                this.createCurlyHair(hairGroup, hairMat, headWidth, headHeight);
                break;
            case 'ponytail':
                this.createPonytail(hairGroup, hairMat, headWidth, headHeight);
                break;
            case 'bun':
                this.createBun(hairGroup, hairMat, headWidth, headHeight);
                break;
            case 'dreadlocks':
                this.createDreadlocks(hairGroup, hairMat, headWidth, headHeight);
                break;
        }
        
        hairGroup.position.y = headHeight * 0.6;
        this.parts.head.add(hairGroup);
        this.parts.hair = hairGroup;
    }
    
    createShortHair(group, mat, w, h) {
        // Cap-like short hair
        const capGeo = new THREE.SphereGeometry(w * 1.05, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.55);
        const cap = new THREE.Mesh(capGeo, mat);
        cap.name = 'HairCap';
        cap.scale.set(1, 0.7, 1.1);
        cap.position.y = h * 0.1;
        cap.castShadow = true;
        group.add(cap);
        
        // Side burns
        for (const side of [-1, 1]) {
            const sideburnGeo = new THREE.CapsuleGeometry(w * 0.04, h * 0.25, 8, 8);
            const sideburn = new THREE.Mesh(sideburnGeo, mat);
            sideburn.position.set(side * w * 0.95, -h * 0.1, 0);
            sideburn.castShadow = true;
            group.add(sideburn);
        }
    }
    
    createMediumHair(group, mat, w, h) {
        // Base cap
        const capGeo = new THREE.SphereGeometry(w * 1.08, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.5);
        const cap = new THREE.Mesh(capGeo, mat);
        cap.name = 'HairCap';
        cap.scale.set(1.05, 0.8, 1.15);
        cap.position.y = h * 0.15;
        cap.castShadow = true;
        group.add(cap);
        
        // Layers
        for (let i = 0; i < 3; i++) {
            const layerGeo = new THREE.SphereGeometry(w * (1.1 + i * 0.03), 24, 16, 0, Math.PI * 2, 0, Math.PI * (0.45 - i * 0.05));
            const layer = new THREE.Mesh(layerGeo, mat);
            layer.name = `HairLayer${i}`;
            layer.scale.set(1 + i * 0.02, 0.7 - i * 0.05, 1.1 + i * 0.03);
            layer.position.y = h * (0.1 + i * 0.03);
            layer.castShadow = true;
            group.add(layer);
        }
        
        // Back hair
        const backGeo = new THREE.SphereGeometry(w * 1.15, 24, 16, 0, Math.PI * 2, Math.PI * 0.3, Math.PI * 0.5);
        const back = new THREE.Mesh(backGeo, mat);
        back.name = 'HairBack';
        back.scale.set(1, 0.9, 1.3);
        back.position.y = h * 0.05;
        back.rotation.x = 0.2;
        back.castShadow = true;
        group.add(back);
    }
    
    createLongHair(group, mat, w, h) {
        // Base
        const baseGeo = new THREE.SphereGeometry(w * 1.1, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.45);
        const base = new THREE.Mesh(baseGeo, mat);
        base.name = 'HairBase';
        base.scale.set(1.1, 0.9, 1.2);
        base.position.y = h * 0.15;
        base.castShadow = true;
        group.add(base);
        
        // Strands at back
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI - Math.PI * 0.5;
            const strandGeo = new THREE.CapsuleGeometry(w * 0.03, h * (0.6 + Math.random() * 0.3), 4, 8);
            const strand = new THREE.Mesh(strandGeo, mat);
            strand.name = `HairStrand${i}`;
            strand.position.set(
                Math.sin(angle) * w * 0.9,
                -h * 0.3,
                Math.cos(angle) * w * 0.9
            );
            strand.rotation.x = -0.3 + Math.random() * 0.3;
            strand.rotation.z = (Math.random() - 0.5) * 0.3;
            strand.castShadow = true;
            group.add(strand);
        }
        
        // Front strands
        for (const side of [-1, 1]) {
            for (let i = 0; i < 3; i++) {
                const strandGeo = new THREE.CapsuleGeometry(w * 0.025, h * 0.4, 4, 8);
                const strand = new THREE.Mesh(strandGeo, mat);
                strand.name = `HairFront${side}${i}`;
                strand.position.set(
                    side * w * (0.8 + i * 0.05),
                    -h * 0.1,
                    w * 0.2
                );
                strand.rotation.x = -0.2;
                strand.rotation.z = side * (0.2 + i * 0.1);
                strand.castShadow = true;
                group.add(strand);
            }
        }
    }
    
    createCurlyHair(group, mat, w, h) {
        // Tight curls as spheres
        const curlCount = 50;
        for (let i = 0; i < curlCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI * 0.5;
            const r = w * (0.95 + Math.random() * 0.15);
            
            const curlGeo = new THREE.SphereGeometry(w * (0.03 + Math.random() * 0.02), 8, 6);
            const curl = new THREE.Mesh(curlGeo, mat);
            curl.name = `Curl${i}`;
            curl.position.set(
                r * Math.sin(phi) * Math.cos(theta),
                h * (0.1 + Math.random() * 0.3),
                r * Math.sin(phi) * Math.sin(theta)
            );
            curl.scale.set(
                0.8 + Math.random() * 0.4,
                0.8 + Math.random() * 0.4,
                0.8 + Math.random() * 0.4
            );
            curl.castShadow = true;
            group.add(curl);
        }
    }
    
    createPonytail(group, mat, w, h) {
        // Base hair
        this.createShortHair(group, mat, w, h);
        
        // Ponytail
        const tailGeo = new THREE.CapsuleGeometry(w * 0.25, h * 0.5, 8, 16);
        const tail = new THREE.Mesh(tailGeo, mat);
        tail.name = 'Ponytail';
        tail.position.set(0, -h * 0.3, w * 0.1);
        tail.rotation.x = 0.2;
        tail.castShadow = true;
        group.add(tail);
        
        // Hair tie
        const tieGeo = new THREE.TorusGeometry(w * 0.2, w * 0.02, 8, 16);
        const tie = new THREE.Mesh(tieGeo, new THREE.MeshStandardMaterial({ color: 0x1a1a1a }));
        tie.name = 'HairTie';
        tie.position.set(0, -h * 0.05, w * 0.15);
        tie.rotation.x = Math.PI * 0.5;
        group.add(tie);
    }
    
    createBun(group, mat, w, h) {
        // Base
        this.createShortHair(group, mat, w, h);
        
        // Bun
        const bunGeo = new THREE.SphereGeometry(w * 0.22, 16, 12);
        const bun = new THREE.Mesh(bunGeo, mat);
        bun.name = 'Bun';
        bun.scale.set(1, 0.8, 1);
        bun.position.set(0, h * 0.25, 0);
        bun.castShadow = true;
        group.add(bun);
    }
    
    createDreadlocks(group, mat, w, h) {
        const dreadCount = 25;
        for (let i = 0; i < dreadCount; i++) {
            const theta = (i / dreadCount) * Math.PI * 2;
            const phi = Math.PI * (0.2 + Math.random() * 0.3);
            const r = w * (0.95 + Math.random() * 0.1);
            
            const dreadGeo = new THREE.CapsuleGeometry(w * 0.035, h * (0.5 + Math.random() * 0.3), 4, 8);
            const dread = new THREE.Mesh(dreadGeo, mat);
            dread.name = `Dread${i}`;
            dread.position.set(
                r * Math.sin(phi) * Math.cos(theta),
                -h * 0.1,
                r * Math.sin(phi) * Math.sin(theta)
            );
            dread.rotation.x = -phi * 0.5;
            dread.castShadow = true;
            group.add(dread);
        }
    }
    
    addClothing(clothing, height, width, depth) {
        const clothesGroup = new THREE.Group();
        clothesGroup.name = 'Clothing';
        
        // Shirt
        if (clothing.shirt) {
            const shirtGeo = new THREE.CapsuleGeometry(
                width * 0.45, 
                height * 0.35, 
                8, 16
            );
            const shirtMesh = new THREE.Mesh(shirtGeo, this.materials.clothing.shirt);
            shirtMesh.name = 'ShirtMesh';
            shirtMesh.position.y = height * 0.15;
            shirtMesh.scale.set(1.05, 1, 1.05);
            shirtMesh.castShadow = true;
            shirtMesh.receiveShadow = true;
            clothesGroup.add(shirtMesh);
            
            // Sleeves
            if (clothing.shirt.sleeve === 'long') {
                for (const side of [-1, 1]) {
                    const sleeveGeo = new THREE.CapsuleGeometry(
                        width * 0.11,
                        height * 0.32 * this.limbLength,
                        8, 16
                    );
                    const sleeveMesh = new THREE.Mesh(sleeveGeo, this.materials.clothing.shirt);
                    sleeveMesh.name = `Sleeve${side > 0 ? 'Right' : 'Left'}`;
                    sleeveMesh.position.set(
                        side * width * 0.55,
                        height * 0.15,
                        0
                    );
                    sleeveMesh.castShadow = true;
                    clothesGroup.add(sleeveMesh);
                }
            }
        }
        
        // Pants
        if (clothing.pants) {
            const pantsLength = clothing.pants.length === 'long' ? 0.45 : 0.25;
            const pantsGeo = new THREE.CapsuleGeometry(
                width * 0.38,
                height * pantsLength,
                8, 16
            );
            const pantsMesh = new THREE.Mesh(pantsGeo, this.materials.clothing.pants);
            pantsMesh.name = 'PantsMesh';
            pantsMesh.position.y = -height * 0.05;
            pantsMesh.scale.set(1.02, 1, 1.02);
            pantsMesh.castShadow = true;
            pantsMesh.receiveShadow = true;
            clothesGroup.add(pantsMesh);
        }
        
        // Shoes
        if (clothing.shoes) {
            for (const side of [-1, 1]) {
                const shoeGeo = new THREE.BoxGeometry(
                    width * 0.22,
                    height * 0.07,
                    depth * 0.4
                );
                const shoeMesh = new THREE.Mesh(shoeGeo, this.materials.clothing.shoes);
                shoeMesh.name = `Shoe${side > 0 ? 'Right' : 'Left'}`;
                shoeMesh.position.set(
                    side * width * 0.2,
                    -height * 0.51,
                    depth * 0.15
                );
                shoeMesh.castShadow = true;
                shoeMesh.receiveShadow = true;
                clothesGroup.add(shoeMesh);
            }
        }
        
        // Jacket
        if (clothing.jacket) {
            const jacketGeo = new THREE.CapsuleGeometry(
                width * 0.48,
                height * 0.4,
                8, 16
            );
            const jacketMesh = new THREE.Mesh(jacketGeo, this.materials.clothing.jacket);
            jacketMesh.name = 'JacketMesh';
            jacketMesh.position.y = height * 0.15;
            jacketMesh.scale.set(1.1, 1, 1.1);
            jacketMesh.castShadow = true;
            jacketMesh.receiveShadow = true;
            clothesGroup.add(jacketMesh);
        }
        
        this.parts.hips.add(clothesGroup);
        this.parts.clothes.group = clothesGroup;
    }
    
    enableShadows(enabled) {
        this.group.traverse(child => {
            if (child.isMesh) {
                child.castShadow = enabled;
                child.receiveShadow = enabled;
            }
        });
    }
    
    createOutlines() {
        if (this.visualStyle !== 'paper-cutout') return;
        
        // Clear existing outlines
        this.outlineGroup.clear();
        
        const outlineMaterial = new THREE.MeshBasicMaterial({
            color: 0x1a1a1a,
            side: THREE.BackSide,
            depthWrite: false,
            transparent: true,
            opacity: 0.8
        });
        
        // Create outline meshes for main body parts
        this.group.traverse(child => {
            if (child.isMesh && child.name && !child.name.includes('Outline')) {
                // Skip small parts like eyes, teeth, etc.
                const bbox = new THREE.Box3().setFromObject(child);
                const size = bbox.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                
                if (maxDim > 0.15) { // Only outline larger parts
                    const outlineMesh = child.clone();
                    outlineMesh.material = outlineMaterial;
                    outlineMesh.scale.multiplyScalar(1 + this.paperThickness);
                    outlineMesh.name = child.name + 'Outline';
                    outlineMesh.castShadow = false;
                    outlineMesh.receiveShadow = false;
                    outlineMesh.renderOrder = -1;
                    
                    // Add to outline group at same position
                    const parent = child.parent;
                    if (parent) {
                        // We need to add the outline to the same parent hierarchy
                        // For simplicity, add to outline group with same world transform
                        const worldPos = new THREE.Vector3();
                        const worldQuat = new THREE.Quaternion();
                        const worldScale = new THREE.Vector3();
                        child.matrixWorld.decompose(worldPos, worldQuat, worldScale);
                        outlineMesh.position.copy(worldPos);
                        outlineMesh.quaternion.copy(worldQuat);
                        outlineMesh.scale.copy(worldScale).multiplyScalar(1 + this.paperThickness);
                        this.outlineGroup.add(outlineMesh);
                    }
                }
            }
        });
    }
    
    updateOutlines() {
        if (this.visualStyle !== 'paper-cutout') return;
        
        // Update outline positions to match character
        this.outlineGroup.children.forEach((outlineMesh, index) => {
            // Find corresponding original mesh
            const originalName = outlineMesh.name.replace('Outline', '');
            let originalMesh = null;
            this.group.traverse(child => {
                if (child.isMesh && child.name === originalName) {
                    originalMesh = child;
                }
            });
            
            if (originalMesh) {
                const worldPos = new THREE.Vector3();
                const worldQuat = new THREE.Quaternion();
                const worldScale = new THREE.Vector3();
                originalMesh.matrixWorld.decompose(worldPos, worldQuat, worldScale);
                outlineMesh.position.copy(worldPos);
                outlineMesh.quaternion.copy(worldQuat);
                outlineMesh.scale.copy(worldScale).multiplyScalar(1 + this.paperThickness);
            }
        });
    }
    
    createAnimations() {
        // Create animation clips procedurally
        Object.entries(ANIMATION_CLIPS).forEach(([name, clipData]) => {
            const clip = this.createAnimationClip(name, clipData);
            this.clips[name] = clip;
            this.actions[name] = this.mixer.clipAction(clip);
            
            // Configure action
            this.actions[name].setLoop(clipData.loop ? THREE.LoopRepeat : THREE.LoopOnce);
            this.actions[name].clampWhenFinished = !clipData.loop;
        });
    }
    
    createAnimationClip(name, clipData) {
        const tracks = [];
        const duration = clipData.duration;
        const fps = 30;
        const frames = Math.ceil(duration * fps);
        
        // Get all animated bones
        const bones = this.getAnimatedBones();
        
        bones.forEach(bone => {
            if (!bone) return;
            
            const boneName = bone.name;
            const positionKeys = [];
            const rotationKeys = [];
            const scaleKeys = [];
            
            clipData.keyframes.forEach(kf => {
                const pose = this.getPoseForBone(boneName, kf.pose, kf.time / duration);
                
                if (pose.position) {
                    positionKeys.push(kf.time, ...pose.position);
                }
                if (pose.rotation) {
                    rotationKeys.push(kf.time, ...pose.rotation);
                }
                if (pose.scale) {
                    scaleKeys.push(kf.time, ...pose.scale);
                }
            });
            
            if (positionKeys.length > 0) {
                tracks.push(new THREE.VectorKeyframeTrack(
                    `${boneName}.position`,
                    positionKeys.filter((_, i) => i % 4 === 0),
                    positionKeys.filter((_, i) => i % 4 !== 0)
                ));
            }
            if (rotationKeys.length > 0) {
                tracks.push(new THREE.QuaternionKeyframeTrack(
                    `${boneName}.quaternion`,
                    rotationKeys.filter((_, i) => i % 5 === 0),
                    rotationKeys.filter((_, i) => i % 5 !== 0)
                ));
            }
        });
        
        return new THREE.AnimationClip(name, duration, tracks);
    }
    
    getAnimatedBones() {
        return [
            this.parts.root,
            this.parts.hips,
            this.parts.spine,
            this.parts.spine1,
            this.parts.spine2,
            this.parts.neck,
            this.parts.head,
            this.parts.leftShoulder,
            this.parts.leftArm,
            this.parts.leftForearm,
            this.parts.leftHand,
            this.parts.rightShoulder,
            this.parts.rightArm,
            this.parts.rightForearm,
            this.parts.rightHand,
            this.parts.leftThigh,
            this.parts.leftShin,
            this.parts.leftFoot,
            this.parts.leftToes,
            this.parts.rightThigh,
            this.parts.rightShin,
            this.parts.rightFoot,
            this.parts.rightToes
        ].filter(b => b !== null);
    }
    
    getPoseForBone(boneName, poseName, normalizedTime) {
        // Procedural pose generation based on bone and pose name
        // Returns { position: [x,y,z], rotation: [x,y,z,w], scale: [x,y,z] }
        
        const poses = {
            // Idle poses
            idle: this.getIdlePose(boneName),
            breath_in: this.getBreathInPose(boneName),
            breath_out: this.getBreathOutPose(boneName),
            
            // Walk poses
            walk_0: this.getWalkPose(boneName, 0),
            walk_1: this.getWalkPose(boneName, 0.25),
            walk_2: this.getWalkPose(boneName, 0.5),
            walk_3: this.getWalkPose(boneName, 0.75),
            
            // Run poses
            run_0: this.getRunPose(boneName, 0),
            run_1: this.getRunPose(boneName, 0.25),
            run_2: this.getRunPose(boneName, 0.5),
            run_3: this.getRunPose(boneName, 0.75),
            
            // Talk poses
            talk_neutral: this.getTalkPose(boneName, 'neutral'),
            talk_a: this.getTalkPose(boneName, 'a'),
            talk_e: this.getTalkPose(boneName, 'e'),
            talk_o: this.getTalkPose(boneName, 'o'),
            talk_m: this.getTalkPose(boneName, 'm'),
            
            // Sit poses
            stand: this.getStandPose(boneName),
            sit_down_1: this.getSitDownPose(boneName, 0.5),
            sit_down_2: this.getSitDownPose(boneName, 1.0),
            sit_idle_1: this.getSitIdlePose(boneName),
            sit_idle: this.getSitIdlePose(boneName),
            
            // Wave poses
            wave_up: this.getWavePose(boneName, 'up'),
            wave_left: this.getWavePose(boneName, 'left'),
            wave_right: this.getWavePose(boneName, 'right'),
            wave_down: this.getWavePose(boneName, 'down'),
            
            // Point poses
            point_up: this.getPointPose(boneName, 'up'),
            point_hold: this.getPointPose(boneName, 'hold'),
            
            // Nod poses
            nod_down: this.getNodPose(boneName, 'down'),
            nod_up: this.getNodPose(boneName, 'up'),
            
            // Shake head poses
            shake_left: this.getShakePose(boneName, 'left'),
            shake_right: this.getShakePose(boneName, 'right'),
            
            // Jump poses
            crouch: this.getCrouchPose(boneName),
            jump_up: this.getJumpPose(boneName, 'up'),
            air: this.getJumpPose(boneName, 'air'),
            land: this.getJumpPose(boneName, 'land')
        };
        
        return poses[poseName] || { position: [0,0,0], rotation: [0,0,0,1], scale: [1,1,1] };
    }
    
    // Pose generation methods
    getIdlePose(boneName) {
        const base = this.initialPositions[boneName] || { position: [0,0,0], rotation: [0,0,0,1] };
        return {
            position: base.position,
            rotation: base.rotation,
            scale: [1,1,1]
        };
    }
    
    getBreathInPose(boneName) {
        const base = this.initialPositions[boneName] || { position: [0,0,0], rotation: [0,0,0,1] };
        const pos = [...base.position];
        const rot = [...base.rotation];
        
        if (boneName === 'Spine' || boneName === 'Spine1') {
            pos[1] += 0.02;
            // Slight chest expansion
        }
        if (boneName === 'Head') {
            pos[1] += 0.01;
        }
        
        return { position: pos, rotation: rot, scale: [1,1,1] };
    }
    
    getBreathOutPose(boneName) {
        const base = this.initialPositions[boneName] || { position: [0,0,0], rotation: [0,0,0,1] };
        const pos = [...base.position];
        const rot = [...base.rotation];
        
        if (boneName === 'Spine' || boneName === 'Spine1') {
            pos[1] -= 0.02;
        }
        if (boneName === 'Head') {
            pos[1] -= 0.01;
        }
        
        return { position: pos, rotation: rot, scale: [1,1,1] };
    }
    
    getWalkPose(boneName, phase) {
        const base = this.initialPositions[boneName] || { position: [0,0,0], rotation: [0,0,0,1] };
        const pos = [...base.position];
        const rot = [...base.rotation];
        
        const swing = Math.sin(phase * Math.PI * 2) * 0.5;
        const lift = Math.max(0, Math.sin(phase * Math.PI * 2)) * 0.15;
        
        switch (boneName) {
            case 'LeftThigh':
                rot[0] = swing * 0.8;
                pos[1] += lift * 0.5;
                break;
            case 'LeftShin':
                rot[0] = -swing * 0.4;
                pos[1] += lift;
                break;
            case 'LeftFoot':
                rot[0] = swing * 0.2;
                break;
            case 'RightThigh':
                rot[0] = -swing * 0.8;
                pos[1] += lift * 0.5;
                break;
            case 'RightShin':
                rot[0] = swing * 0.4;
                pos[1] += lift;
                break;
            case 'RightFoot':
                rot[0] = -swing * 0.2;
                break;
            case 'LeftArm':
                rot[0] = -swing * 0.6;
                break;
            case 'RightArm':
                rot[0] = swing * 0.6;
                break;
            case 'Spine':
                rot[2] = swing * 0.05;
                break;
            case 'Hips':
                pos[1] -= Math.abs(swing) * 0.02;
                rot[2] = swing * 0.1;
                break;
        }
        
        return { position: pos, rotation: this.eulerToQuaternion(rot), scale: [1,1,1] };
    }
    
    getRunPose(boneName, phase) {
        const walkPose = this.getWalkPose(boneName, phase);
        // Amplify for running
        if (walkPose.rotation) {
            walkPose.rotation = walkPose.rotation.map((v, i) => 
                i < 3 ? v * 1.5 : v
            );
        }
        if (walkPose.position) {
            walkPose.position = walkPose.position.map((v, i) => 
                i === 1 ? v * 1.3 : v
            );
        }
        return walkPose;
    }
    
    getTalkPose(boneName, phoneme) {
        const base = this.initialPositions[boneName] || { position: [0,0,0], rotation: [0,0,0,1] };
        const pos = [...base.position];
        const rot = [...base.rotation];
        
        if (boneName === 'Head') {
            rot[0] = Math.sin(Date.now() * 0.002) * 0.05;
            rot[1] = Math.sin(Date.now() * 0.003) * 0.08;
        }
        if (boneName === 'Jaw' || boneName === 'Head') {
            const mouthOpen = { 
                neutral: 0, a: 0.6, e: 0.3, o: 0.5, m: 0.1 
            }[phoneme] || 0;
            pos[1] -= mouthOpen * 0.02;
        }
        
        return { position: pos, rotation: this.eulerToQuaternion(rot), scale: [1,1,1] };
    }
    
    getStandPose(boneName) {
        return this.getIdlePose(boneName);
    }
    
    getSitDownPose(boneName, progress) {
        const base = this.initialPositions[boneName] || { position: [0,0,0], rotation: [0,0,0,1] };
        const pos = [...base.position];
        const rot = [...base.rotation];
        
        const hipDrop = progress * 0.8;
        const kneeBend = progress * Math.PI * 0.7;
        const spineLean = progress * 0.3;
        
        switch (boneName) {
            case 'Hips':
                pos[1] -= hipDrop;
                rot[0] = spineLean;
                break;
            case 'LeftThigh':
            case 'RightThigh':
                rot[0] = kneeBend;
                break;
            case 'LeftShin':
            case 'RightShin':
                rot[0] = -kneeBend * 0.5;
                break;
            case 'LeftFoot':
            case 'RightFoot':
                rot[0] = kneeBend * 0.3;
                break;
            case 'Spine':
            case 'Spine1':
                rot[0] = spineLean * 0.5;
                break;
        }
        
        return { position: pos, rotation: this.eulerToQuaternion(rot), scale: [1,1,1] };
    }
    
    getSitIdlePose(boneName) {
        return this.getSitDownPose(boneName, 1.0);
    }
    
    getWavePose(boneName, stage) {
        const base = this.initialPositions[boneName] || { position: [0,0,0], rotation: [0,0,0,1] };
        const pos = [...base.position];
        const rot = [...base.rotation];
        
        if (boneName === 'RightArm' || boneName === 'RightForearm') {
            const stages = {
                up: { arm: -Math.PI * 0.5, fore: 0 },
                left: { arm: -Math.PI * 0.5, fore: -Math.PI * 0.3 },
                right: { arm: -Math.PI * 0.5, fore: Math.PI * 0.3 },
                down: { arm: 0, fore: 0 }
            };
            const s = stages[stage] || stages.up;
            if (boneName === 'RightArm') rot[0] = s.arm;
            if (boneName === 'RightForearm') rot[0] = s.fore;
        }
        
        return { position: pos, rotation: this.eulerToQuaternion(rot), scale: [1,1,1] };
    }
    
    getPointPose(boneName, stage) {
        const base = this.initialPositions[boneName] || { position: [0,0,0], rotation: [0,0,0,1] };
        const pos = [...base.position];
        const rot = [...base.rotation];
        
        if (boneName === 'RightArm') {
            rot[0] = -Math.PI * 0.4;
            rot[1] = -Math.PI * 0.3;
        }
        if (boneName === 'RightForearm') {
            rot[0] = Math.PI * 0.2;
        }
        if (boneName === 'RightHand') {
            // Point index finger
        }
        
        return { position: pos, rotation: this.eulerToQuaternion(rot), scale: [1,1,1] };
    }
    
    getNodPose(boneName, stage) {
        const base = this.initialPositions[boneName] || { position: [0,0,0], rotation: [0,0,0,1] };
        const pos = [...base.position];
        const rot = [...base.rotation];
        
        if (boneName === 'Head') {
            rot[0] = stage === 'down' ? 0.3 : -0.1;
        }
        
        return { position: pos, rotation: this.eulerToQuaternion(rot), scale: [1,1,1] };
    }
    
    getShakePose(boneName, stage) {
        const base = this.initialPositions[boneName] || { position: [0,0,0], rotation: [0,0,0,1] };
        const pos = [...base.position];
        const rot = [...base.rotation];
        
        if (boneName === 'Head') {
            rot[1] = stage === 'left' ? 0.5 : -0.5;
        }
        
        return { position: pos, rotation: this.eulerToQuaternion(rot), scale: [1,1,1] };
    }
    
    getCrouchPose(boneName) {
        const base = this.initialPositions[boneName] || { position: [0,0,0], rotation: [0,0,0,1] };
        const pos = [...base.position];
        const rot = [...base.rotation];
        
        switch (boneName) {
            case 'Hips':
                pos[1] -= 0.3;
                rot[0] = 0.3;
                break;
            case 'LeftThigh':
            case 'RightThigh':
                rot[0] = 1.0;
                break;
            case 'LeftShin':
            case 'RightShin':
                rot[0] = -0.5;
                break;
        }
        
        return { position: pos, rotation: this.eulerToQuaternion(rot), scale: [1,1,1] };
    }
    
    getJumpPose(boneName, stage) {
        const base = this.initialPositions[boneName] || { position: [0,0,0], rotation: [0,0,0,1] };
        const pos = [...base.position];
        const rot = [...base.rotation];
        
        const stages = {
            up: { hip: 0.5, thigh: -0.5, shin: 0.3 },
            air: { hip: 0.8, thigh: -0.8, shin: 0.5 },
            land: { hip: -0.2, thigh: 1.0, shin: -0.5 }
        };
        const s = stages[stage] || stages.up;
        
        switch (boneName) {
            case 'Hips':
                pos[1] += s.hip;
                break;
            case 'LeftThigh':
            case 'RightThigh':
                rot[0] = s.thigh;
                break;
            case 'LeftShin':
            case 'RightShin':
                rot[0] = s.shin;
                break;
        }
        
        return { position: pos, rotation: this.eulerToQuaternion(rot), scale: [1,1,1] };
    }
    
    eulerToQuaternion(euler) {
        const q = new THREE.Quaternion();
        q.setFromEuler(new THREE.Euler(euler[0], euler[1], euler[2], 'YXZ'));
        return [q.x, q.y, q.z, q.w];
    }
    
    captureInitialPositions() {
        const positions = {};
        this.group.traverse(child => {
            if (child.name && (child.name.endsWith('Mesh') || child.name.endsWith('Group') || ['Root','Hips','Spine','Spine1','Spine2','Neck','Head','LeftShoulder','LeftArm','LeftForearm','LeftHand','RightShoulder','RightArm','RightForearm','RightHand','LeftThigh','LeftShin','LeftFoot','LeftToes','RightThigh','RightShin','RightFoot','RightToes'].includes(child.name))) {
                positions[child.name] = {
                    position: child.position.toArray(),
                    rotation: child.quaternion.toArray(),
                    scale: child.scale.toArray()
                };
            }
        });
        return positions;
    }
    
    // Public animation control methods
    playAnimation(name, options = {}) {
        if (!this.actions[name]) return;
        
        const action = this.actions[name];
        action.reset();
        action.setLoop(options.loop !== false ? THREE.LoopRepeat : THREE.LoopOnce);
        action.clampWhenFinished = options.loop === false;
        action.timeScale = options.speed || 1.0;
        action.play();
        
        this.currentAnimation = name;
        this.isPlaying = true;
        
        // Crossfade from current
        if (options.crossfade !== false && this.lastAction && this.lastAction !== action) {
            this.lastAction.crossFadeTo(action, options.crossfadeDuration || 0.3);
        }
        
        this.lastAction = action;
    }
    
    stopAnimation(name = null) {
        if (name) {
            if (this.actions[name]) {
                this.actions[name].stop();
            }
        } else {
            Object.values(this.actions).forEach(a => a.stop());
        }
        this.isPlaying = false;
    }
    
    setAnimationSpeed(speed) {
        this.animationSpeed = speed;
        Object.values(this.actions).forEach(a => a.setEffectiveTimeScale(speed));
    }
    
    setExpression(expression, intensity = 1.0) {
        if (!FACIAL_EXPRESSIONS[expression]) return;
        
        this.currentExpression = expression;
        this.expressionIntensity = intensity;
        
        const expr = FACIAL_EXPRESSIONS[expression];
        this.blendshapes = { ...expr.blendshapes };
        
        // Apply to face mesh
        this.applyExpression(expression, intensity);
    }
    
    applyExpression(expression, intensity) {
        const face = this.parts.face;
        if (!face.group) return;
        
        const blends = FACIAL_EXPRESSIONS[expression]?.blendshapes || {};
        
        // Apply blendshapes to face parts
        Object.entries(blends).forEach(([key, value]) => {
            const scaledValue = value * intensity;
            
            switch (key) {
                case 'smile':
                    if (face.mouth) {
                        face.mouth.scale.x = 1 + scaledValue * 0.3;
                        face.mouth.rotation.z = -scaledValue * 0.2;
                    }
                    if (face.cheeks) {
                        face.cheeks.scale.y = 1 + scaledValue * 0.2;
                    }
                    break;
                case 'cheekRaise':
                    if (face.leftEye) face.leftEye.scale.y = 1 - scaledValue * 0.2;
                    if (face.rightEye) face.rightEye.scale.y = 1 - scaledValue * 0.2;
                    break;
                case 'eyeSquint':
                    if (face.leftEye) face.leftEye.scale.y = 1 - scaledValue * 0.4;
                    if (face.rightEye) face.rightEye.scale.y = 1 - scaledValue * 0.4;
                    break;
                case 'browInnerUp':
                    if (face.leftEyebrow) face.leftEyebrow.rotation.z = scaledValue * 0.3;
                    if (face.rightEyebrow) face.rightEyebrow.rotation.z = -scaledValue * 0.3;
                    break;
                case 'browOuterUp':
                    if (face.leftEyebrow) face.leftEyebrow.position.y += scaledValue * 0.02;
                    if (face.rightEyebrow) face.rightEyebrow.position.y += scaledValue * 0.02;
                    break;
                case 'browDown':
                case 'browInnerDown':
                    if (face.leftEyebrow) face.leftEyebrow.rotation.z = -scaledValue * 0.3;
                    if (face.rightEyebrow) face.rightEyebrow.rotation.z = scaledValue * 0.3;
                    break;
                case 'eyeWide':
                    if (face.leftEye) face.leftEye.scale.y = 1 + scaledValue * 0.3;
                    if (face.rightEye) face.rightEye.scale.y = 1 + scaledValue * 0.3;
                    break;
                case 'jawOpen':
                    if (face.mouth) {
                        face.mouth.position.y -= scaledValue * 0.03;
                        face.mouth.scale.y = 1 + scaledValue * 0.5;
                    }
                    if (face.teeth) {
                        face.teeth.visible = scaledValue > 0.3;
                    }
                    break;
                case 'mouthFrown':
                    if (face.mouth) {
                        face.mouth.rotation.z = scaledValue * 0.3;
                    }
                    break;
                case 'mouthPress':
                    if (face.mouth) {
                        face.mouth.scale.x = 1 - scaledValue * 0.2;
                    }
                    break;
                case 'noseWrinkle':
                    if (face.nose) {
                        face.nose.scale.y = 1 - scaledValue * 0.1;
                    }
                    break;
                case 'upperLipRaise':
                    if (face.mouth) {
                        face.mouth.position.y += scaledValue * 0.02;
                    }
                    break;
                case 'mouthStretch':
                    if (face.mouth) {
                        face.mouth.scale.x = 1 + scaledValue * 0.2;
                    }
                    break;
                case 'mouthTwist':
                    if (face.mouth) {
                        face.mouth.rotation.z = scaledValue * 0.2;
                    }
                    break;
                case 'eyeClosedLeft':
                    if (face.leftEye) face.leftEye.scale.y = 0.05;
                    break;
                case 'eyeClosedRight':
                    if (face.rightEye) face.rightEye.scale.y = 0.05;
                    break;
            }
        });
    }
    
    lookAt(target) {
        this.lookAtTarget.copy(target);
        
        // Head tracking
        const head = this.parts.head;
        if (!head) return;
        
        const headWorldPos = new THREE.Vector3();
        head.getWorldPosition(headWorldPos);
        
        const direction = new THREE.Vector3().subVectors(target, headWorldPos).normalize();
        
        // Calculate rotation to look at target
        const quat = new THREE.Quaternion();
        quat.setFromUnitVectors(new THREE.Vector3(0, 0, -1), direction);
        
        // Limit head rotation
        const euler = new THREE.Euler().setFromQuaternion(quat, 'YXZ');
        euler.x = THREE.MathUtils.clamp(euler.x, -0.8, 0.5);
        euler.y = THREE.MathUtils.clamp(euler.y, -1.0, 1.0);
        euler.z = THREE.MathUtils.clamp(euler.z, -0.3, 0.3);
        
        const limitedQuat = new THREE.Quaternion().setFromEuler(euler);
        
        // Smooth interpolation
        head.quaternion.slerp(limitedQuat, 0.1);
        
        // Eye tracking
        if (this.parts.face.leftPupil && this.parts.face.rightPupil) {
            const pupilOffset = direction.clone().multiplyScalar(0.005);
            this.parts.face.leftPupil.position.x = pupilOffset.x;
            this.parts.face.leftPupil.position.y = pupilOffset.y;
            this.parts.face.rightPupil.position.x = pupilOffset.x;
            this.parts.face.rightPupil.position.y = pupilOffset.y;
        }
    }
    
    // ========================================
    // Interaction System
    // ========================================
    
    // Walk to a target position
    walkTo(targetPosition, options = {}) {
        const { 
            onComplete, 
            onProgress, 
            speed = 1.0, 
            stopDistance = 0.5,
            faceTarget = true 
        } = options;
        
        this.walkTarget = targetPosition.clone();
        this.walkSpeed = speed;
        this.walkStopDistance = stopDistance;
        this.walkFaceTarget = faceTarget;
        this.walkOnComplete = onComplete;
        this.walkOnProgress = onProgress;
        this.isWalking = true;
        
        // Start walk animation
        this.playAnimation('walk');
    }
    
    // Stop walking
    stopWalking() {
        this.isWalking = false;
        this.walkTarget = null;
        this.playAnimation('idle');
    }
    
    // Update walking logic (call in update loop)
    updateWalking(delta) {
        if (!this.isWalking || !this.walkTarget) return;
        
        const currentPos = this.group.position.clone();
        const targetPos = this.walkTarget.clone();
        targetPos.y = currentPos.y; // Keep same height
        
        const distance = currentPos.distanceTo(targetPos);
        
        if (distance <= this.walkStopDistance) {
            // Reached target
            this.stopWalking();
            if (this.walkOnComplete) this.walkOnComplete();
            return;
        }
        
        // Calculate direction
        const direction = new THREE.Vector3().subVectors(targetPos, currentPos).normalize();
        
        // Move character
        const moveSpeed = this.walkSpeed * 2 * delta; // 2 units per second at speed 1
        this.group.position.add(direction.clone().multiplyScalar(moveSpeed));
        
        // Rotate to face movement direction
        const targetRotation = Math.atan2(direction.x, direction.z);
        this.group.rotation.y = THREE.MathUtils.lerp(this.group.rotation.y, targetRotation, 0.1);
        
        // Face target if enabled
        if (this.walkFaceTarget) {
            this.lookAt(this.walkTarget);
        }
        
        if (this.walkOnProgress) this.walkOnProgress(distance);
    }
    
    // Hold an object in hand
    holdObject(object, hand = 'right') {
        if (this.heldObject) {
            this.releaseObject();
        }
        
        this.heldObject = object;
        this.holdHand = hand;
        
        // Attach to hand
        const handBone = hand === 'right' ? this.parts.rightHand : this.parts.leftHand;
        if (handBone && object) {
            // Store original parent
            object.userData.originalParent = object.parent;
            object.userData.originalPosition = object.position.clone();
            object.userData.originalRotation = object.rotation.clone();
            object.userData.originalScale = object.scale.clone();
            
            // Position relative to hand
            handBone.attach(object);
            object.position.set(0, 0, 0);
            object.rotation.set(0, 0, 0);
            
            // Play hold animation
            this.playAnimation('point'); // Use point as hold pose
        }
    }
    
    // Release held object
    releaseObject() {
        if (!this.heldObject) return;
        
        const object = this.heldObject;
        const originalParent = object.userData.originalParent || this.group.parent || AppState.three?.scene;
        
        if (originalParent) {
            // Get world transform
            const worldPos = new THREE.Vector3();
            const worldQuat = new THREE.Quaternion();
            const worldScale = new THREE.Vector3();
            object.matrixWorld.decompose(worldPos, worldQuat, worldScale);
            
            // Detach from hand and reattach to original parent
            this.group.remove(object);
            originalParent.add(object);
            object.position.copy(worldPos);
            object.quaternion.copy(worldQuat);
            object.scale.copy(worldScale);
        }
        
        this.heldObject = null;
        this.holdHand = null;
    }
    
    // Give object to another character
    giveObject(targetCharacter, object) {
        if (!this.heldObject || this.heldObject !== object) return false;
        
        // Release from this character
        this.releaseObject();
        
        // Target character holds it
        targetCharacter.holdObject(object, 'left');
        
        // Play give/receive animations
        this.playAnimation('point');
        targetCharacter.playAnimation('wave'); // Receive gesture
        
        return true;
    }
    
    // Interact with another character
    interactWith(otherCharacter, interactionType) {
        const interactions = {
            'wave': () => {
                this.playAnimation('wave');
                otherCharacter.lookAt(this.group.position);
            },
            'talk': () => {
                this.playAnimation('talk');
                otherCharacter.playAnimation('idle');
                otherCharacter.lookAt(this.group.position);
            },
            'hug': () => {
                this.playAnimation('wave'); // Approximate
                otherCharacter.playAnimation('wave');
                this.lookAt(otherCharacter.group.position);
                otherCharacter.lookAt(this.group.position);
            },
            'highfive': () => {
                this.playAnimation('point');
                otherCharacter.playAnimation('point');
            },
            'handover': (object) => {
                this.giveObject(otherCharacter, object);
            }
        };
        
        if (interactions[interactionType]) {
            if (interactionType === 'handover') {
                // Need object parameter
                return interactions[interactionType];
            }
            interactions[interactionType]();
            return true;
        }
        return false;
    }
    
    // Sit on an object (chair, bench, etc.)
    sitOn(object) {
        if (!object || !object.userData.sitPosition) return false;
        
        const sitPos = object.userData.sitPosition;
        const sitRot = object.userData.sitRotation || new THREE.Euler(0, 0, 0);
        
        // Walk to sit position first
        this.walkTo(sitPos, {
            onComplete: () => {
                // Position character at sit position
                this.group.position.copy(sitPos);
                this.group.rotation.copy(sitRot);
                this.playAnimation('sit');
            },
            stopDistance: 0.2
        });
        
        return true;
    }
    
    // Stand up from sitting
    standUp() {
        this.playAnimation('idle');
    }
    
    // Update interaction logic (call in update loop)
    updateInteractions(delta) {
        this.updateWalking(delta);
    }
    
    update(delta) {
        if (this.mixer) {
            this.mixer.update(delta);
        }
        
        // Update facial expressions
        this.updateExpressions(delta);
        
        // Update look-at
        if (this.lookAtTarget) {
            this.lookAt(this.lookAtTarget);
        }
        
        // Update interactions (walking, holding, etc.)
        this.updateInteractions(delta);
        
        // Update paper-cutout outlines
        this.updateOutlines();
    }
    
    updateExpressions(delta) {
        // Smooth expression transitions
        // Could add expression blending here
    }
    
    // Customization methods
    setSkinTone(index) {
        if (index >= 0 && index < SKIN_TONES.length) {
            this.skinTone = index;
            this.updateSkinMaterial();
        }
    }
    
    setHairStyle(style) {
        if (HAIR_STYLES[style]) {
            this.hairStyle = style;
            this.rebuildHair();
        }
    }
    
    setHairColor(index) {
        if (index >= 0 && index < HAIR_COLORS.length) {
            this.hairColor = index;
            this.updateHairMaterial();
        }
    }
    
    setEyeColor(index) {
        if (index >= 0 && index < EYE_COLORS.length) {
            this.eyeColor = index;
            this.updateEyeMaterial();
        }
    }
    
    setClothing(preset) {
        if (CLOTHING_PRESETS[preset]) {
            this.clothing = preset;
            this.rebuildClothing();
        }
    }
    
    setBodyType(preset) {
        if (CHARACTER_PRESETS[preset]) {
            this.preset = preset;
            this.rebuildBody();
        }
    }
    
    setVisualStyle(style) {
        if (style === 'paper-cutout' || style === 'realistic') {
            this.visualStyle = style;
            this.rebuildBody();
        }
    }
    
    setPaperThickness(thickness) {
        this.paperThickness = Math.max(0.01, Math.min(0.2, thickness));
        this.createOutlines();
    }
    
    updateSkinMaterial() {
        const skinTone = SKIN_TONES[this.skinTone];
        this.materials.skin.color.set(skinTone.color);
        this.materials.skinDark.color.set(skinTone.shade);
    }
    
    updateHairMaterial() {
        const hairColor = HAIR_COLORS[this.hairColor];
        this.materials.hair.color.set(hairColor.color);
        this.materials.hair.sheenColor.set(hairColor.highlight);
        this.materials.eyebrow.color.set(hairColor.color);
    }
    
    updateEyeMaterial() {
        const eyeColor = EYE_COLORS[this.eyeColor];
        this.materials.iris.color.set(eyeColor.iris);
    }
    
    // Clothing color update methods
    setShirtColor(color) {
        if (this.materials.clothing.shirt) {
            this.materials.clothing.shirt.color.set(color);
        }
        // Also update sleeves if they exist
        this.group.traverse(child => {
            if (child.name && child.name.startsWith('Sleeve') && child.material) {
                child.material.color.set(color);
            }
        });
    }
    
    setPantsColor(color) {
        if (this.materials.clothing.pants) {
            this.materials.clothing.pants.color.set(color);
        }
    }
    
    setShoesColor(color) {
        if (this.materials.clothing.shoes) {
            this.materials.clothing.shoes.color.set(color);
        }
    }
    
    setJacketColor(color) {
        if (this.materials.clothing.jacket) {
            this.materials.clothing.jacket.color.set(color);
        }
    }
    
    rebuildHair() {
        // Remove old hair
        if (this.parts.hair) {
            this.parts.head.remove(this.parts.hair);
            this.disposeObject(this.parts.hair);
        }
        
        // Create new hair
        const hairStyle = HAIR_STYLES[this.hairStyle];
        const hairColor = HAIR_COLORS[this.hairColor];
        const preset = CHARACTER_PRESETS[this.preset];
        this.addHair(hairStyle, hairColor, preset);
    }
    
    rebuildClothing() {
        // Remove old clothes
        if (this.parts.clothes.group) {
            this.parts.hips.remove(this.parts.clothes.group);
            this.disposeObject(this.parts.clothes.group);
        }
        
        // Create new clothes
        const clothing = CLOTHING_PRESETS[this.clothing];
        const height = CHARACTER_PRESETS[this.preset].bodyScale.height * this.bodyScale.height;
        const width = CHARACTER_PRESETS[this.preset].bodyScale.width * this.bodyScale.width;
        const depth = CHARACTER_PRESETS[this.preset].bodyScale.depth * this.bodyScale.depth;
        this.addClothing(clothing, height, width, depth);
    }
    
    rebuildBody() {
        // Full rebuild - dispose and recreate
        this.dispose();
        this.createCharacter();
        this.createAnimations();
    }
    
    disposeObject(obj) {
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
    
    dispose() {
        this.group.traverse(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(m => m.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
        
        // Dispose outline group
        if (this.outlineGroup) {
            this.outlineGroup.traverse(child => {
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
    }
    
    // Serialization for saving/loading
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            preset: this.preset,
            skinTone: this.skinTone,
            hairStyle: this.hairStyle,
            hairColor: this.hairColor,
            eyeColor: this.eyeColor,
            clothing: this.clothing,
            bodyScale: this.bodyScale,
            headScale: this.headScale,
            limbLength: this.limbLength,
            visualStyle: this.visualStyle,
            paperThickness: this.paperThickness,
            position: this.group.position.toArray(),
            rotation: this.group.rotation.toArray(),
            scale: this.group.scale.toArray()
        };
    }
    
    static fromJSON(json) {
        return new Character3D(json);
    }
}

// Export for use in main app
export default Character3D;
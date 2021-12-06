import { EventDispatcher, MOUSE, TOUCH, Vector3 } from 'three';
declare class OrbitControls extends EventDispatcher {
    object: any;
    domElement: any;
    enabled: boolean;
    target: Vector3;
    minDistance: number;
    maxDistance: number;
    minZoom: number;
    maxZoom: number;
    minPolarAngle: number;
    maxPolarAngle: number;
    minAzimuthAngle: number;
    maxAzimuthAngle: number;
    enableDamping: boolean;
    dampingFactor: number;
    enableZoom: boolean;
    zoomSpeed: number;
    enableRotate: boolean;
    rotateSpeed: number;
    enablePan: boolean;
    panSpeed: number;
    screenSpacePanning: boolean;
    keyPanSpeed: number;
    autoRotate: boolean;
    autoRotateSpeed: number;
    keys: {
        LEFT: string;
        UP: string;
        RIGHT: string;
        BOTTOM: string;
    };
    mouseButtons: {
        LEFT: MOUSE;
        MIDDLE: MOUSE;
        RIGHT: MOUSE;
    };
    touches: {
        ONE: TOUCH;
        TWO: TOUCH;
    };
    target0: any;
    position0: any;
    zoom0: any;
    _domElementKeyEvents: any;
    getPolarAngle: () => number;
    getAzimuthalAngle: () => number;
    getDistance: () => any;
    listenToKeyEvents: (domElement: any) => void;
    saveState: () => void;
    reset: () => void;
    dispose: () => void;
    constructor(object: any, domElement: any);
    update(): void;
}
declare class MapControls extends OrbitControls {
    constructor(object: any, domElement: any);
}
export { OrbitControls, MapControls };

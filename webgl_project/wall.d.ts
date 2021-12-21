import * as THREE from "three";
export declare class Wall {
    geometry: THREE.BoxGeometry;
    mesh: THREE.Mesh;
    material: THREE.MeshPhongMaterial;
    size: THREE.Vector3;
    position: THREE.Vector3;
    blocksCars: boolean;
    width: number;
    height: number;
    long: number;
    stick: THREE.Mesh;
    rotation: number;
    constructor(width?: number, height?: number, long?: number);
    init(): void;
    rotate(angle: number): void;
    setPosition(newPos: THREE.Vector3): void;
    toggle(): void;
    logic(): void;
}

import * as THREE from "three";
export declare class Wall {
    geometry: THREE.BoxGeometry;
    mesh: THREE.Mesh;
    material: THREE.MeshPhongMaterial;
    light: THREE.PointLight;
    lightMesh: THREE.Mesh;
    size: THREE.Vector3;
    position: THREE.Vector3;
    blocksCars: boolean;
    width: number;
    height: number;
    long: number;
    stick: THREE.Mesh;
    bar: THREE.Mesh;
    rotation: number;
    group: THREE.Group;
    constructor(width?: number, height?: number, long?: number);
    init(): void;
    rotate(angle: number): void;
    setPosition(newPos: THREE.Vector3): void;
    toggle(): void;
    logic(): void;
}

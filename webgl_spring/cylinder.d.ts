import { Object3dTextured, Shader } from "./objects3d";
export declare class CylinderTextured extends Object3dTextured {
    textureCoordinates: number[];
    texture: any;
    shader: Shader;
    radius: number;
    quality: number;
    height: number;
    constructor(radius?: number, height?: number, quality?: number);
    generatePositions(): void;
    generatePolygons(): void;
    generateRenderable(): void;
}

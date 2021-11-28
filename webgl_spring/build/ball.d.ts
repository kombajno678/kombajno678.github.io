import { Object3dTextured, Shader } from "./objects3d";
export declare class BallTextured extends Object3dTextured {
    textureCoordinates: number[];
    texture: any;
    shader: Shader;
    radius: number;
    quality: number;
    constructor(radius?: number, quality?: number);
    generatePositions(): void;
    generatePolygons(): void;
    generateRenderable(): void;
}

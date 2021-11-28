import { Object3d, Object3dTextured } from "./objects3d";
export declare class Cube extends Object3d {
    size: number[];
    colors: number[];
    constructor(size: number[]);
    generatePositions(): void;
    generatePolygons(): void;
    generateRenderable(): void;
    draw(gl: WebGLRenderingContext, programInfo: any, projectionMatrix: any, modelViewMatrix: any): void;
}
export declare class CubeTextured extends Object3dTextured {
    size: number[];
    origin: number[];
    colors: number[];
    constructor(size?: number[], origin?: number[]);
    generatePositions(): void;
    generatePolygons(): void;
    generateRenderable(): void;
}

import { Object3dTextured, ShaderTextured } from "./objects3d";
export declare class Spring extends Object3dTextured {
    quality: number;
    springRadius: number;
    springInnerRadius: number;
    springLoosness: number;
    springRotations: number;
    endPoint: number[];
    startPoint: number[];
    shader: ShaderTextured;
    constructor(quality: number);
    generate(): void;
}

export interface Buffers {
    positionBuffer: any;
    indexBuffer: any;
    textureCoordBuffer?: any;
    colorBuffer?: any;
}
export interface Singleton {
}
export interface Renderable {
    draw(gl: WebGLRenderingContext, programInfo: any, projectionMatrix: any, modelViewMatrix: any): void;
    shader: Shader;
    setShader(shader: ShaderTextured): any;
    generatePositions(): any;
    generatePolygons(): any;
    generateRenderable(): any;
    generate(): any;
}
export interface RenderableTextured extends Renderable {
    textureCoordinates: number[];
    texture: any;
    loadTexture(gl: WebGLRenderingContext, url: String): any;
}
export declare abstract class Object3d implements Renderable {
    positions: number[];
    polygonIndices: number[];
    constructor();
    setShader(shader: ShaderTextured): void;
    shader: Shader;
    generatePositions(): void;
    generatePolygons(): void;
    generateRenderable(): void;
    generate(): void;
    draw(gl: WebGLRenderingContext, programInfo: any, projectionMatrix: any, modelViewMatrix: any): void;
}
export declare abstract class Object3dTextured extends Object3d implements RenderableTextured {
    textureCoordinates: number[];
    positions: number[];
    polygonIndices: number[];
    texture: any;
    shader: Shader;
    constructor();
    loadTexture(gl: WebGLRenderingContext, url: any): void;
    setShader(shader: ShaderTextured): void;
    draw(gl: WebGLRenderingContext, projectionMatrix: any, modelViewMatrix: any): void;
}
export declare class Shader {
    shaderProgram: any;
    programInfo: any;
    vsSource: String;
    fsSource: String;
    initShaderProgram(gl: any, vsSource: any, fsSource: any): any;
    loadShader(gl: any, type: any, source: any): any;
    constructor(gl: WebGLRenderingContext, vsSource: String, fsSource: String);
}
export declare class ShaderTextured extends Shader implements Singleton {
    private static _instance;
    static Instance(gl: WebGLRenderingContext): ShaderTextured;
    private constructor();
}
export declare class ShaderColored extends Shader {
    constructor(gl: WebGLRenderingContext);
}

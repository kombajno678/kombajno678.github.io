export declare class Controls {
    static initialRotation: {
        x: number;
        y: number;
        z: number;
    };
    static initialPosition: {
        x: number;
        y: number;
        z: number;
    };
    static mouse: {
        lastX: number;
        lastY: number;
        dX: number;
        dY: number;
        dScroll: number;
        dragging: boolean;
    };
    static dMove: number[];
    static keyboardPressing: boolean;
    static dragFactor: number;
    static zoomFactor: number;
    static mouseDown(event: any): void;
    static mouseMove(event: any): void;
    static mouseUp(event: any): void;
    static mouseWheel(event: any): void;
    static onkeydown(event: any): void;
    static onkeyup(event: any): void;
}

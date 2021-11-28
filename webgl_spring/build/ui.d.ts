export declare let quality: number;
export declare let resolutionQuality: number;
export declare let antialiasing: boolean;
export declare function setOnQualityChange(f: any): void;
export declare function setOnResolutionQualityChange(f: any): void;
export declare let onResolutionQualityChange: (newQuality: any) => {
    (...data: any[]): void;
    (message?: any, ...optionalParams: any[]): void;
};
export declare let onQualityChange: (newQuality: any) => {
    (...data: any[]): void;
    (message?: any, ...optionalParams: any[]): void;
};
declare function springQualityChangeSlider(): void;
declare function springQualityChangeInput(): void;
declare const _default: {
    springQualityChangeSlider: typeof springQualityChangeSlider;
    springQualityChangeInput: typeof springQualityChangeInput;
    quality: number;
    antialiasing: boolean;
};
export default _default;

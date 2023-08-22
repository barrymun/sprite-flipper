import { camelCase } from "lodash";

/**
 * Toggles the visibility of elements with the specified data attributes.
 */
export const toggleElementVisibility = ({ 
    selector,
    isHidden, 
}: { 
    selector: "hidden-a" | "hidden-b"; 
    isHidden: "true" | "false"; 
}): void => {
    const hiddenElements: NodeListOf<HTMLDivElement> = document.querySelectorAll(`[data-${selector}]`);
    for (const el of hiddenElements) {
        el.dataset[camelCase(selector)] = isHidden;
    }
};

/**
 * Loads an image from the specified source asynchronously.
 */
export const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
        return img;
    });
};

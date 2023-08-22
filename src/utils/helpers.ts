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

import { camelCase, isNaN } from "lodash";

import { ImageType, ImageExtension } from "./constants";

import "./style.css";

const spriteSheetInput = document.getElementById("sprite-input")! as HTMLInputElement;
const spriteSheetImage = document.getElementById("sprite-img")! as HTMLImageElement;
const spriteSheetFlipped = document.getElementById("sprite-flipped")! as HTMLImageElement;
const spriteInputWidth = document.getElementById("sprite-input-width")! as HTMLInputElement;
const spriteInputHeight = document.getElementById("sprite-input-height")! as HTMLInputElement;
const spriteSubmitBtn = document.getElementById("sprite-submit")! as HTMLButtonElement;
const downloadLink = document.getElementById("download")! as HTMLAnchorElement;

const numRows: number = 1; // leaving this as 1 for now

let imageExtension: string | undefined;
let widthOfOnePiece: number = 0;
let heightOfOnePiece: number = 0;
let numCols: number = 0;

const showElement = (selector: string): void => {
    const hiddenElements: NodeListOf<HTMLDivElement> = document.querySelectorAll(`[data-${selector}]`);
    for (const el of hiddenElements) {
        el.dataset[camelCase(selector)] = "false";
    }
};

const setDimensions = (): void => {
    widthOfOnePiece = isNaN(spriteInputWidth.valueAsNumber) ? 0 : spriteInputWidth.valueAsNumber;
    heightOfOnePiece = isNaN(spriteInputHeight.valueAsNumber) ? 0 : spriteInputHeight.valueAsNumber;
    numCols = spriteSheetImage.width / widthOfOnePiece;
    sliceImage();
};

const sliceImage = (): void => {
    let imagePieces: string[] = [];
    for (let x = 0; x < numCols; ++x) {
        for (let y = 0; y < numRows; ++y) {
            const canvas: HTMLCanvasElement = document.createElement("canvas");
            canvas.width = widthOfOnePiece;
            canvas.height = heightOfOnePiece;
            const context: CanvasRenderingContext2D = canvas.getContext("2d")!;
            context.translate(widthOfOnePiece, 0);
            context.scale(-1, 1);
            context.drawImage(
                spriteSheetImage,
                x * widthOfOnePiece,
                y * heightOfOnePiece,
                widthOfOnePiece,
                heightOfOnePiece,
                0,
                0,
                canvas.width,
                canvas.height,
            );
            imagePieces = [...imagePieces, canvas.toDataURL()];
        }
    }
    assembleImage(imagePieces);
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
        return img;
    });
};

const assembleImage = async (imagePieces: string[]): Promise<void> => {
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.width = widthOfOnePiece * imagePieces.length;
    canvas.height = heightOfOnePiece;
    const context: CanvasRenderingContext2D = canvas.getContext("2d")!;

    let width: number = 0;
    for (const imagePiece of imagePieces) {
        const img = await loadImage(imagePiece);
        context.drawImage(img, width, 0);
        width += widthOfOnePiece;
    }
    spriteSheetFlipped.src = canvas.toDataURL();
    showElement('hidden-b');
};

const downloadImage = (): void => {
    downloadLink.href = spriteSheetFlipped.src;
    downloadLink.download = `flipped.${imageExtension}`;
};

spriteSheetInput.addEventListener("change", (event: Event) => {
    if (!(event.target instanceof HTMLInputElement)) return;

    if (!event.target.files) return;

    console.log(event.target.files[0])

    switch (event.target.files[0].type) {
        case ImageType.Png:
            imageExtension = ImageExtension.Png;
            break;
        case ImageType.Jpeg:
            imageExtension = ImageExtension.Jpeg;
            break;
        default:
            break;
    }

    if (!imageExtension) {
        alert("Invalid image type");
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        spriteSheetImage.src = reader.result as string;
        showElement('hidden-a');
    };
    reader.readAsDataURL(event.target.files[0]);
});

spriteSubmitBtn.addEventListener("click", setDimensions);

downloadLink.addEventListener("click", downloadImage);

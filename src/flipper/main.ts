import { getImageTargetFileList } from "image-ops";

import { ImageExtension, ImageType } from "utils/constants";
import {
  downloadLink,
  spriteInputHeight,
  spriteInputWidth,
  spriteSheetFlipped,
  spriteSheetImage,
  spriteSheetInput,
  spriteSubmitBtn,
} from "utils/elements";
import { loadImage, toggleElementVisibility } from "utils/helpers";

const numRows: number = 1; // leaving this as 1 for now.

export class Flipper {
  private imageExtension: string | undefined;

  public getImageExtension = (): string | undefined => this.imageExtension;

  private setImageExtension = (imageExtension: string): void => {
    this.imageExtension = imageExtension;
  };

  private widthOfOnePiece: number = 0;

  public getWidthOfOnePiece = (): number => this.widthOfOnePiece;

  private setWidthOfOnePiece = (widthOfOnePiece: number): void => {
    this.widthOfOnePiece = widthOfOnePiece;
  };

  private heightOfOnePiece: number = 0;

  public getHeightOfOnePiece = (): number => this.heightOfOnePiece;

  private setHeightOfOnePiece = (heightOfOnePiece: number): void => {
    this.heightOfOnePiece = heightOfOnePiece;
  };

  private numCols: number = 0;

  public getNumCols = (): number => this.numCols;

  private setNumCols = (numCols: number): void => {
    this.numCols = numCols;
  };

  constructor() {
    this.bindListeners();
  }

  private handleChange = (event: Event): void => {
    const files = getImageTargetFileList(event);
    if (files === null) {
      return;
    }

    switch (files[0].type) {
      case ImageType.Png:
        this.setImageExtension(ImageExtension.Png);
        break;
      case ImageType.Jpeg:
        this.setImageExtension(ImageExtension.Jpeg);
        break;
      default:
        break;
    }

    if (!this.getImageExtension()) {
      alert("Invalid image type");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      spriteSheetImage.src = reader.result as string;
      toggleElementVisibility({ selector: "hidden-b", isHidden: "true" });
      toggleElementVisibility({ selector: "hidden-a", isHidden: "false" });
    };
    reader.readAsDataURL(files[0]);
  };

  private setDimensions = (): void => {
    if (spriteSheetImage.width === 0 || spriteSheetImage.height === 0) {
      alert("Please try again. The image may not have loaded properly or the dimensions are invalid.");
      return;
    }
    if (
      isNaN(spriteInputWidth.valueAsNumber) ||
      spriteInputWidth.valueAsNumber === 0 ||
      isNaN(spriteInputHeight.valueAsNumber) ||
      spriteInputHeight.valueAsNumber === 0
    ) {
      alert("Invalid dimensions. Please ensure that the width and height are greater than 0.");
      return;
    }
    this.setWidthOfOnePiece(isNaN(spriteInputWidth.valueAsNumber) ? 0 : spriteInputWidth.valueAsNumber);
    this.setHeightOfOnePiece(isNaN(spriteInputHeight.valueAsNumber) ? 0 : spriteInputHeight.valueAsNumber);
    this.setNumCols(spriteSheetImage.width / this.getWidthOfOnePiece());
    this.sliceImage();
  };

  private downloadImage = (): void => {
    downloadLink.href = spriteSheetFlipped.src;
    downloadLink.download = `flipped.${this.getImageExtension()}`;
  };

  private sliceImage = (): void => {
    let imagePieces: string[] = [];
    for (let x = 0; x < this.getNumCols(); ++x) {
      for (let y = 0; y < numRows; ++y) {
        const canvas: HTMLCanvasElement = document.createElement("canvas");
        canvas.width = this.getWidthOfOnePiece();
        canvas.height = this.getHeightOfOnePiece();
        const context: CanvasRenderingContext2D = canvas.getContext("2d")!;
        context.translate(this.getWidthOfOnePiece(), 0);
        context.scale(-1, 1);
        context.drawImage(
          spriteSheetImage,
          x * this.getWidthOfOnePiece(),
          y * this.getHeightOfOnePiece(),
          this.getWidthOfOnePiece(),
          this.getHeightOfOnePiece(),
          0,
          0,
          canvas.width,
          canvas.height,
        );
        imagePieces = [...imagePieces, canvas.toDataURL()];
      }
    }
    this.assembleImage(imagePieces);
  };

  private assembleImage = async (imagePieces: string[]): Promise<void> => {
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.width = this.getWidthOfOnePiece() * imagePieces.length;
    canvas.height = this.getHeightOfOnePiece();
    const context: CanvasRenderingContext2D = canvas.getContext("2d")!;

    let width: number = 0;
    for (const imagePiece of imagePieces) {
      const img = await loadImage(imagePiece);
      context.drawImage(img, width, 0);
      width += this.getWidthOfOnePiece();
    }
    spriteSheetFlipped.src = canvas.toDataURL();
    toggleElementVisibility({ selector: "hidden-b", isHidden: "false" });
  };

  private bindListeners = (): void => {
    spriteSheetInput.addEventListener("change", this.handleChange);
    spriteSubmitBtn.addEventListener("click", this.setDimensions);
    downloadLink.addEventListener("click", this.downloadImage);

    window.addEventListener("unload", this.handleUnload);
  };

  private handleUnload = (): void => {
    spriteSheetInput.removeEventListener("change", this.handleChange);
    spriteSubmitBtn.removeEventListener("click", this.setDimensions);
    downloadLink.removeEventListener("click", this.downloadImage);

    window.removeEventListener("unload", this.handleUnload);
  };
}

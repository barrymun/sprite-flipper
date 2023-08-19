import './style.css'

const spriteSheetInput = document.getElementById('sprite-input')! as HTMLInputElement;
const spriteSheetImage = document.getElementById('sprite-img')! as HTMLImageElement;
const spriteSheetFlipped = document.getElementById('sprite-flipped')! as HTMLImageElement;
const downloadLink = document.getElementById('download')! as HTMLAnchorElement;

const widthOfOnePiece: number = 150;
const heightOfOnePiece: number = 150;
const numCols: number = 5;
const numRows: number = 1;

spriteSheetInput.addEventListener('change', (event: Event) => {
  if (!(event.target instanceof HTMLInputElement)) return;
  
  if (!event.target.files) return;

  const reader = new FileReader();
  reader.onload = () => {
    console.log(reader.result)
    spriteSheetImage.onload = sliceImage;
    spriteSheetImage.src = reader.result as string;
  };
  reader.readAsDataURL(event.target.files[0]);
});

const sliceImage = (): void => {
  let imagePieces: string[] = [];
  for (let x = 0; x < numCols; ++x) {
    for (let y = 0; y < numRows; ++y) {
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = widthOfOnePiece;
        canvas.height = heightOfOnePiece;
        const context: CanvasRenderingContext2D = canvas.getContext('2d')!;
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
          canvas.height
        );
        imagePieces = [
          ...imagePieces,
          canvas.toDataURL(),
        ];
    }
  }
  assembleImage(imagePieces);
}

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
    return img;
  });
}

const assembleImage = async (imagePieces: string[]): Promise<void> => {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  canvas.width = widthOfOnePiece * imagePieces.length;
  canvas.height = heightOfOnePiece;
  const context: CanvasRenderingContext2D = canvas.getContext('2d')!;

  let width: number = 0;
  for (const imagePiece of imagePieces) {
    const img = await loadImage(imagePiece);
    context.drawImage(img, width, 0);
    width += widthOfOnePiece;
  }
  spriteSheetFlipped.src = canvas.toDataURL();
};

const downloadImage = (): void => {
  downloadLink.href = spriteSheetFlipped.src;
  downloadLink.download = 'flipped.png';
};

downloadLink.addEventListener('click', downloadImage);

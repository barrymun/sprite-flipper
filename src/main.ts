import './style.css'

const spriteSheetInput = document.getElementById('sprite-input')! as HTMLInputElement;
const spriteSheetImage = document.getElementById('sprite-img')! as HTMLImageElement;
const spriteSheetFlipped = document.getElementById('sprite-flipped')! as HTMLImageElement;

const widthOfOnePiece: number = 150;
const heightOfOnePiece: number = 150;
const numCols: number = 8;
const numRows: number = 1;

spriteSheetInput.addEventListener('change', (event: Event) => {
  if (!(event.target instanceof HTMLInputElement)) return;
  
  if (!event.target.files) return;
  
  console.log(event.target.files[0])

  const reader = new FileReader();
  reader.onload = () => {
    console.log(reader.result)
    spriteSheetImage.onload = sliceImage;
    spriteSheetImage.src = reader.result as string;
  };
  reader.readAsDataURL(event.target.files[0]);
});

const sliceImage = (): void => {
  const imagePieces: string[] = [];
  for (let x = 0; x < numCols; ++x) {
    for (let y = 0; y < numRows; ++y) {
        var canvas: HTMLCanvasElement = document.createElement('canvas');
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
        imagePieces.push(canvas.toDataURL());
    }
  }
  spriteSheetFlipped.src = imagePieces[0];
}

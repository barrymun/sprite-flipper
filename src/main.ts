import './style.css'

const spriteSheetInput = document.getElementById('sprite-input')! as HTMLInputElement;
const spriteSheetImage = document.getElementById('sprite-img')! as HTMLImageElement;
const spriteSheetFlipped = document.getElementById('sprite-flipped')! as HTMLImageElement;

const widthOfOnePiece: number = 150;
const heightOfOnePiece: number = 150;

spriteSheetInput.addEventListener('change', (event: Event) => {
  if (!(event.target instanceof HTMLInputElement)) return;
  
  if (!event.target.files) return;
  console.log(event.target.files[0])
  // spriteSheetImage.src = URL.createObjectURL(event.target.files[0]);
  // spriteSheetImage.onload = function() {
  //   URL.revokeObjectURL(spriteSheetImage.src); // free memory
  // }

  const reader = new FileReader();
  reader.onload = () => {
    console.log(reader.result)
    spriteSheetImage.onload = sliceImage;
    spriteSheetImage.src = reader.result as string;
  };
  reader.readAsDataURL(event.target.files[0]);
});

const sliceImage = () => {
  const imagePieces = [];
  for(var x = 0; x < 8; ++x) {
      for(var y = 0; y < 1; ++y) {
          var canvas = document.createElement('canvas');
          canvas.width = widthOfOnePiece;
          canvas.height = heightOfOnePiece;
          const context = canvas.getContext('2d')!;
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

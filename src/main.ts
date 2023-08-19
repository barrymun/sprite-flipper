import './style.css'

const spriteSheetInput = document.getElementById('sprite-input')! as HTMLInputElement;
const spriteSheetImage = document.getElementById('sprite-img')! as HTMLImageElement;

spriteSheetInput.addEventListener('change', (event: Event) => {
  if (!(event.target instanceof HTMLInputElement)) return;
  
  if (!event.target.files) return;
  console.log(event.target.files[0])
  spriteSheetImage.src = URL.createObjectURL(event.target.files[0]);
  spriteSheetImage.onload = function() {
    URL.revokeObjectURL(spriteSheetImage.src); // free memory
  }
});

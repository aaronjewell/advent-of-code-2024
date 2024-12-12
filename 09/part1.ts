async function getDiskMap(): Promise<number[]> {
  const file = Bun.file(import.meta.dir + '/input.txt');
  return (await file.text()).trim().split('').map(Number);
}


const dm = (await getDiskMap());

let leftFileId = 0;
let rightFileId = Math.floor((dm.length - 1) / 2);
let checksum = 0;
let finalPosition = 0;

let left = 0;
let right = dm.length - (dm.length % 2);

while (left <= right) {
  while (dm[left]) { // block count of left file
    checksum += leftFileId * finalPosition;
    finalPosition++;
    dm[left]--;
  }

  leftFileId++;
  left++; // free space

  while (dm[left]) { // block count of free space
    if (dm[right] === 0) { // we've moved all the blocks of the rightmost file
      right--; // free space
      right--; // next file id block count index
      rightFileId--;

      if (right <= left) {
        break
      }
      continue;
    }

    checksum += rightFileId * finalPosition;
    finalPosition++;
    dm[right]--;
    dm[left]--;
  }

  left++; // we've used up all the blocks of free space
}

console.log(checksum);

export { };

async function getDiskMap(): Promise<number[]> {
  const file = Bun.file(import.meta.dir + '/input.txt');
  return (await file.text()).trim().split('').map(Number);
}

interface File {
  fileId: number,
  count: number,
}

const fileInsertMap: Map<number, File[]> = new Map();

const dm = (await getDiskMap());

let leftFileId = 0;
let rightFileId = Math.floor((dm.length - 1) / 2);
let checksum = 0;
let finalPosition = 0;

let left = 0;
let right = dm.length - 1;
let searcher = 0;

while (dm[left]) { // block count of first left file
  checksum += leftFileId * finalPosition;
  finalPosition++;
  dm[left]--;
}

leftFileId++;
left++; // free space

while (right > left) {
  searcher = left;
  while (dm[right] > dm[searcher] && searcher < right) { // find the first free space that the rightmost file will fit
    searcher += 2; // skip file blocks while looking for next empty space
  }

  if (searcher < right) { // Found some free space for the rightmost file
    let existingFiles = fileInsertMap.get(searcher) || [];
    const file = { fileId: rightFileId, count: dm[right] };
    existingFiles.push(file);
    fileInsertMap.set(searcher, existingFiles);
    // Add the file blocks to the queue and remove the free space
    dm[right] -= (2 * file.count); // negative space so we account for the gap later
    dm[searcher] -= file.count;
  }

  right -= 2 // next file skipping empty space
  rightFileId--;
}

while (left < dm.length) {
  // starting on our first empty space block insert any queued files to move into that space
  let filesToInsert = fileInsertMap.get(left) ?? [];
  while (filesToInsert.length) {
    const nextFile = filesToInsert.shift()!;
    let count = nextFile.count;
    while (count) { // add a moved file that is intended for this position from queue 
      checksum += nextFile.fileId * finalPosition;
      count--;
      finalPosition++;
    }
  }

  while (dm[left]) { // increase final position for any remaining empty space after moves
    finalPosition++;
    dm[left]--;
  }

  left++; // unmoved left file

  if (dm[left] >= 0) {
    while (dm[left]) { // add file to checksum
      checksum += leftFileId * finalPosition;
      finalPosition++;
      dm[left]--;
    }
  } else {
    while (dm[left] < 0) { // increase the final position to account for empty space from a previously removed file
      finalPosition++;
      dm[left]++;
    }
  }

  leftFileId++;
  left++; // next file
}

console.log(checksum);


export { };

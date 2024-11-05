const keyLetters = "ADFGVX"; // Letters for the grid
const substitutionTable = {
  'A': 'AD', 'B': 'AG', 'C': 'AV', 'D': 'AX',
  'E': 'FD', 'F': 'FG', 'G': 'FV', 'H': 'FX',
  'I': 'GD', 'J': 'GG', 'K': 'GV', 'L': 'GX',
  'M': 'VD', 'N': 'VG', 'O': 'VV', 'P': 'VX',
  'Q': 'XD', 'R': 'XG', 'S': 'XV', 'T': 'XX',
  'U': 'DA', 'V': 'DG', 'W': 'DV', 'X': 'DX',
  'Y': 'FA', 'Z': 'FG'};

function createGrid(key) {
  let grid = {};
  let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let index = 0;
  for (let i = 0; i < keyLetters.length; i++) {
    grid[keyLetters[i]] = {};
    for (let j = 0; j < keyLetters.length; j++) {
      grid[keyLetters[i]][keyLetters[j]] = alphabet[index % alphabet.length];
      index++;
    }
  }
  return grid;
}

function encode(text, key, grid) {
  let encoded = "";
  for (let i = 0; i < text.length; i++) {
    let char = text[i]; 
    if (substitutionTable[char]) {
      encoded += substitutionTable[char];
    } else {
      encoded += char;
    }
  }
  return encoded;
}

function permute(encodedText, key) {
  let keySorted = key.split('').sort();
  let keyLength = key.length;
  let gridRows = Math.ceil(encodedText.length / keyLength);
  let permutationGrid = [];
  let index = 0;
  for (let i = 0; i < gridRows; i++) {
    permutationGrid.push([]);
    for (let j = 0; j < keyLength; j++) {
      if (index < encodedText.length) {
        permutationGrid[i].push(encodedText[index]);
        index++;
      }
    }
  }
  let permutedText = "";
  for (let i = 0; i < keyLength; i++) {
    let columnIndex = keySorted.indexOf(key[i]);
    for (let row = 0; row < gridRows; row++) {
      if (row < permutationGrid.length && columnIndex < permutationGrid[row].length) {
        permutedText += permutationGrid[row][columnIndex];
      }
    }
  }
  return permutedText;
}

function decryptText(text, key, grid) {
  let keySorted = key.split('').sort();
  let keyLength = key.length;
  let gridRows = Math.ceil(text.length / keyLength);
  let permutationGrid = [];
  for (let i = 0; i < gridRows; i++) {
    permutationGrid.push(new Array(keyLength).fill(null));
  }
  let index = 0;
  for (let col = 0; col < keyLength; col++) {
    let sortedColIndex = keySorted.indexOf(key[col]);
    for (let row = 0; row < gridRows; row++) {
      if (index < text.length) {
        permutationGrid[row][sortedColIndex] = text[index];
        index++;
      }
    }
  }
  let decoded = "";
  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < permutationGrid[row].length; col++) {
      if (permutationGrid[row][col] !== null) {
        decoded += permutationGrid[row][col];
      }
    }
  }
  let decrypted = "";
  for (let i = 0; i < decoded.length; i += 2) {
    const pair = decoded.substr(i, 2);
    let found = false;
    for (const char in substitutionTable) {
      if (substitutionTable[char] === pair) {
        decrypted += char;
        found = true;
        break;
      }
    }
    if (!found) {
      decrypted += pair;
    }
  }
  return decrypted;
}

function encrypt() {
  let text = document.getElementById("text").value;
  let key = document.getElementById("key").value.toUpperCase(); // Keep key uppercase
  let grid = createGrid(key);
  let encodedText = encode(text, key, grid);
  let permutedText = permute(encodedText, key);
  document.getElementById("result").value = permutedText;
}

function decrypt() {
  let text = document.getElementById("text").value;
  let key = document.getElementById("key").value.toUpperCase();
  let grid = createGrid(key);
  let decryptedText = decryptText(text, key, grid);
  document.getElementById("result").value = decryptedText;
}

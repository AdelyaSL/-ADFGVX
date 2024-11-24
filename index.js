const adfgvxChars = ['A', 'D', 'F', 'G', 'V', 'X'];
const adfgvxTable = [
  ['A', 'B', 'C', 'D', 'E', 'F'],
  ['G', 'H', 'I', 'J', 'K', 'L'],
  ['M', 'N', 'O', 'P', 'Q', 'R'],
  ['S', 'T', 'U', 'V', 'W', 'X'],
  ['Y', 'Z', '0', '1', '2', '3'],
  ['4', '5', '6', '7', '8', '9'],
];

function createLookupMaps(table) {
  const charToCode = {};
  const codeToChar = {};
  for (let i = 0; i < table.length; i++) {
    for (let j = 0; j < table[i].length; j++) {
      const rowChar = adfgvxChars[i];
      const colChar = adfgvxChars[j];
      charToCode[table[i][j]] = rowChar + colChar;
      codeToChar[rowChar + colChar] = table[i][j];
    }
  }
  return { charToCode, codeToChar };
}

const { charToCode, codeToChar } = createLookupMaps(adfgvxTable);


function encrypt() {
  const text = document.getElementById('text').value;
  const key = document.getElementById('key').value.toUpperCase();

  if (!key) {
    alert('Please enter a key.');
    return;
  }

  let substitutedText = '';
  for (let char of text) {
    const upperChar = char.toUpperCase();
    if (charToCode[upperChar]) {
      substitutedText += charToCode[upperChar];
    } else {
      substitutedText += char; 
    }
  }

  const columns = key.length;
  const rows = Math.ceil(substitutedText.length / columns);
  const grid = Array.from({ length: rows }, (_, i) =>
    substitutedText.slice(i * columns, (i + 1) * columns)
  );

  const sortedKey = [...key].map((char, index) => [char, index]).sort();
  let result = '';

  for (const [, index] of sortedKey) {
    for (const row of grid) {
      if (row[index] !== undefined) {
        result += row[index];
      }
    }
  }

  document.getElementById('result').value = result;
}

function decrypt() {
  const text = document.getElementById('text').value;
  const key = document.getElementById('key').value.toUpperCase();

  if (!key) {
    alert('Please enter a key.');
    return;
  }

  const columns = key.length;
  const rows = Math.ceil(text.length / columns);

  const columnLengths = Array(columns).fill(Math.floor(text.length / columns));
  for (let i = 0; i < text.length % columns; i++) {
    columnLengths[i]++;
  }

  const sortedKey = [...key].map((char, index) => [char, index]).sort();
  const grid = Array.from({ length: rows }, () => Array(columns).fill(''));

  let index = 0;

  for (const [, keyIndex] of sortedKey) {
    for (let row = 0; row < columnLengths[keyIndex]; row++) {
      if (index < text.length) {
        grid[row][keyIndex] = text[index++];
      }
    }
  }

  let substitutedText = '';
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      if (grid[row][col] !== '') {
        substitutedText += grid[row][col];
      }
    }
  }

  let result = '';
  let i = 0;

  while (i < substitutedText.length) {
    const pair = substitutedText.slice(i, i + 2);

    if (codeToChar[pair]) {
      result += codeToChar[pair];
      i += 2;
    } else {
      result += substitutedText[i];
      i++;
    }
  }

  document.getElementById('result').value = result;
}

document.getElementById('encryptBtn').addEventListener('click', encrypt);
document.getElementById('decryptBtn').addEventListener('click', decrypt);


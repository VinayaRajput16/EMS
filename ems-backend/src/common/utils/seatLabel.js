export function seatLabelFromIndex(index, columns) {
  const rowIndex = Math.floor(index / columns);
  const colIndex = index % columns;
  const row = String.fromCharCode(65 + rowIndex); // A, B, C...
  const col = colIndex + 1; // 1-based
  return `${row}${col}`;
}

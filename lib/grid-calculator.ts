// lib/grid-calculator.ts

// 1. ค่าคงที่
const TOTAL_SLOTS = 21; 
const ROWS = 3; 
const COLUMNS = 7; 

// 2. Interface Definition
export interface GridPosition {
    row: number;      // แถว (R: 1-3)
    column: number;   // คอลัมน์ (C: 1-7)
    slotIndex: number;// ลำดับช่องในรอบ 1-21
}

export interface TriplexResult extends GridPosition {
    finalValue: number; // ค่าตัวเลขสุดท้าย (V: 1-7)
}

// ----------------------------------------------------------------------
// A. ฟังก์ชันหลัก (Function 1): หาตำแหน่ง R และ C จากลำดับ X (Column-Major)
// ----------------------------------------------------------------------
export function calculateColumnMajor(X: number): GridPosition {
    if (X <= 0) {
        throw new Error("Input X must be a positive integer.");
    }
  
    const zeroBasedIndex = (X - 1) % TOTAL_SLOTS;
    const slotIndex = zeroBasedIndex + 1;
  
    // Row: (index % ROWS) + 1
    const row = (zeroBasedIndex % ROWS) + 1;
  
    // Column: floor(index / ROWS) + 1
    const column = Math.floor(zeroBasedIndex / ROWS) + 1;
  
    return { row, column, slotIndex };
}

// ----------------------------------------------------------------------
// B. Forward Logic: หาค่า V เมื่อรู้ตำแหน่ง (ใช้ในอนาคต)
// ----------------------------------------------------------------------
export function calculateTriplexGridValue(
    startR1: number,
    startR2: number,
    startR3: number,
    X: number
): TriplexResult {
  
    const position = calculateColumnMajor(X);
    const { row, column } = position;
    
    let startValue: number;
    switch (row) {
        case 1: startValue = startR1; break;
        case 2: startValue = startR2; break;
        case 3: startValue = startR3; break;
        default: throw new Error("Internal row calculation error."); 
    }
  
    // Logic Clean Version: ((Start + Col - 2) % 7 + 7) % 7 + 1
    const rawValue = startValue + column - 2;
    const V = ((rawValue % COLUMNS) + COLUMNS) % COLUMNS + 1;
  
    return { ...position, finalValue: V };
}

// ----------------------------------------------------------------------
// C. Inverse Logic (Function 2): หาตำแหน่ง C จากค่า V และ Start
// ----------------------------------------------------------------------
export function findPositionByFinalValue(
    startR1: number,
    startR2: number,
    startR3: number,
    finalValue: number
): GridPosition[] {
  
    if (finalValue < 1 || finalValue > 7) {
        throw new Error("Final Value must be between 1 and 7.");
    }

    const results: GridPosition[] = [];
    const startMap = [startR1, startR2, startR3];
  
    for (let row = 1; row <= ROWS; row++) {
        const start = startMap[row - 1]; 
        
        // 1. คำนวณผลต่างการเลื่อน D
        const difference = finalValue - start;
        const D = ((difference % COLUMNS) + COLUMNS) % COLUMNS; 
        
        // 2. คำนวณ Column C
        const column = D + 1; 
        
        // 3. คำนวณ Slot Index
        const slotIndex = (column - 1) * ROWS + row;
        
        results.push({ row, column, slotIndex });
    }
  
    return results;
}

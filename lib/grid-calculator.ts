// lib/grid-calculator.ts (ฉบับแก้ไข: เพิ่ม export ที่ถูกต้อง)

// 1. ค่าคงที่
const TOTAL_SLOTS = 21; 
const ROWS = 3; 
const COLUMNS = 7; 

// 2. Interface Definition
export interface GridPosition {
    row: number;      
    column: number;   
    slotIndex: number;
}

export interface TriplexResult extends GridPosition {
    finalValue: number; 
}

// ----------------------------------------------------------------------
// A. Function 1: หาตำแหน่ง R และ C จากลำดับ X (Column-Major)
// ----------------------------------------------------------------------
export function calculateColumnMajor(X: number): GridPosition {
    if (X <= 0) {
        throw new Error("Input X must be a positive integer.");
    }
  
    const zeroBasedIndex = (X - 1) % TOTAL_SLOTS;
    const slotIndex = zeroBasedIndex + 1;
    const row = (zeroBasedIndex % ROWS) + 1;
    const column = Math.floor(zeroBasedIndex / ROWS) + 1;
  
    return { row, column, slotIndex };
}

// ----------------------------------------------------------------------
// B. Forward Logic: หาค่า V เมื่อรู้ตำแหน่งและค่าตั้งต้น (แก้ไข Error 2305)
// ----------------------------------------------------------------------
export function calculateFinalValue(
    row: number, 
    column: number, 
    startR1: number, 
    startR2: number, 
    startR3: number
): TriplexResult {
    const position = { row, column, slotIndex: 0 }; 
    let startValue: number;

    switch (row) {
        case 1: startValue = startR1; break;
        case 2: startValue = startR2; break;
        case 3: startValue = startR3; break;
        default: throw new Error("Internal row calculation error."); 
    }
  
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
        const difference = finalValue - start;
        const D = ((difference % COLUMNS) + COLUMNS) % COLUMNS; 
        const column = D + 1;
        
        if (column >= 1 && column <= COLUMNS) {
            const slotIndex = row + ROWS * (column - 1);
            results.push({ row, column, slotIndex });
        }
    }

    return results;
}
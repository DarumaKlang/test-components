// data/GridValue.ts

export interface GridCellData {
    id: string;      // ตำแหน่ง R_C (e.g., 'R1C1', 'R3C7')
    kaset: number | 'x'; // ค่าเกษตร (1-8 หรือ 'x')
    koonnam: number | 'x'; // ค่าคุณนาม (0-9 หรือ 'x')
    note: string | null;  // หมายเหตุ (เก็บเป็น null ไปก่อน แล้วคำนวณเพิ่มใน Component)
}

export const GridValueData: GridCellData[] = [
    // R1
    { id: 'R1C1', kaset: 5, koonnam: 1, note: null },
    { id: 'R1C2', kaset: 8, koonnam: 0, note: null },
    { id: 'R1C3', kaset: 6, koonnam: 4, note: null },
    { id: 'R1C4', kaset: 1, koonnam: 'x', note: null },
    { id: 'R1C5', kaset: 2, koonnam: 'x', note: null },
    { id: 'R1C6', kaset: 3, koonnam: 7, note: null },
    { id: 'R1C7', kaset: 4, koonnam: 'x', note: null },
    // R2
    { id: 'R2C1', kaset: 3, koonnam: 2, note: null },
    { id: 'R2C2', kaset: 6, koonnam: 'x', note: null },
    { id: 'R2C3', kaset: 4, koonnam: 5, note: null },
    { id: 'R2C4', kaset: 2, koonnam: 'x', note: null },
    { id: 'R2C5', kaset: 1, koonnam: 'x', note: null },
    { id: 'R2C6', kaset: 4, koonnam: 8, note: null },
    { id: 'R2C7', kaset: 6, koonnam: 'x', note: null },
    // R3
    { id: 'R3C1', kaset: 3, koonnam: 3, note: null },
    { id: 'R3C2', kaset: 5, koonnam: 'x', note: null },
    { id: 'R3C3', kaset: 7, koonnam: 6, note: null },
    { id: 'R3C4', kaset: 7, koonnam: 'x', note: null },
    { id: 'R3C5', kaset: 5, koonnam: 'x', note: null },
    { id: 'R3C6', kaset: 7, koonnam: 9, note: null },
    { id: 'R3C7', kaset: 7, koonnam: 'x', note: null },
];
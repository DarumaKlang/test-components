// components/GridValueSummary.tsx

'use client'; 
import { GridValueData, GridCellData } from '@/data/GridValue';
import React, { useMemo } from 'react';
import { calculateFinalValue, TriplexResult } from '@/lib/grid-calculator'; 

// ----------------------------------------------------------------------
// 1. Logic การ Mapping ตัวเลขเป็นชื่อดาว (Star Map) (ไม่เปลี่ยนแปลง)
// ----------------------------------------------------------------------
const StarNameMap: Record<number, string> = {
    1: 'อาทิตย์ (1)', 2: 'จันทร์ (2)', 3: 'อังคาร (3)', 4: 'พุธ (4)', 
    5: 'พฤหัสบดี (5)', 6: 'ศุกร์ (6)', 7: 'เสาร์ (7)', 8: 'ราหู (8)', 
    9: 'เกตุ (9)', 0: 'ไม่มี (0)',
};

const getStarNames = (cell: GridCellData): string => {
    let kasetName = 'N/A';
    let koonnamName = 'N/A';

    if (typeof cell.kaset === 'number' && StarNameMap[cell.kaset]) { kasetName = StarNameMap[cell.kaset]; } else if (cell.kaset === 'x') { kasetName = 'ไม่ระบุ'; }
    if (typeof cell.koonnam === 'number' && StarNameMap[cell.koonnam]) { koonnamName = StarNameMap[cell.koonnam]; } else if (cell.koonnam === 'x') { koonnamName = 'ไม่ระบุ'; }
    
    return `${kasetName} / ${koonnamName}`;
};

// ----------------------------------------------------------------------
// 2. Interface และ Props (ไม่เปลี่ยนแปลง)
// ----------------------------------------------------------------------

interface GridValueSummaryProps {
    startR1: number;
    startR2: number;
    startR3: number;
}

interface ProcessedGridCellData extends GridCellData {
    finalValue: number;
    pair_ab: string; // คู่ a (Kaset), b (Koonnam) -> C5
    pair_ac: string; // คู่ a (Kaset), c (Final Value) -> C6
    pair_bc: string; // คู่ b (Koonnam), c (Final Value) -> C7
}

// ----------------------------------------------------------------------
// 3. Main Component
// ----------------------------------------------------------------------

export default function GridValueSummary({ startR1, startR2, startR3 }: GridValueSummaryProps) {
    
    // Logic คำนวณค่า V และจัดการการจับคู่
    const processedGridData = useMemo(() => {
        return GridValueData.map((cell) => {
            // 1. คำนวณ Final Value (V) (ค่า c)
            let result: TriplexResult | null = null;
            try {
                // แยก Row และ Column จาก ID
                const match = cell.id.match(/R(\d)C(\d)/);
                if (match) {
                    const row = parseInt(match[1]);
                    const column = parseInt(match[2]);
                    
                    // เรียกใช้ calculateFinalValue
                    result = calculateFinalValue(row, column, startR1, startR2, startR3);
                }
            } catch (e) {
                console.error("Error calculating Final Value:", e);
            }
            
            const finalValue = result?.finalValue ?? 0; // ค่า c
            
            // 2. กำหนดค่า a (Kaset) และ b (Koonnam)
            const a = cell.kaset !== 'x' ? cell.kaset : 'x';
            const b = cell.koonnam !== 'x' ? cell.koonnam : 'x';
            const c = finalValue;
            
            let pair_ab: string;
            let pair_ac: string;
            let pair_bc: string;

            // 3. จัดการเงื่อนไข
            if (b === 'x') {
                // เงื่อนไขพิเศษ: ถ้า b = 'x'
                pair_ab = "ว่าง"; // C5
                pair_ac = `${a} / ${c}`; // C6
                pair_bc = "ว่าง"; // C7
            } else {
                // เงื่อนไขปกติ
                pair_ab = `${a} / ${b}`; // C5 (a, b)
                pair_ac = `${a} / ${c}`; // C6 (a, c)
                pair_bc = `${b} / ${c}`; // C7 (b, c)
            }
            
            // 4. คืนค่า Cell ที่ประมวลผลแล้ว
            return {
                ...cell,
                finalValue,
                pair_ab,
                pair_ac,
                pair_bc,
            } as ProcessedGridCellData;

        });
    }, [startR1, startR2, startR3]); // Re-run when start values change

    // ------------------------------------------------------------------
    // 4. JSX Render
    // ------------------------------------------------------------------
    
    // จัดกลุ่มตาม Row (R1, R2, R3) เพื่อแสดงผล
    const groupedData = useMemo(() => {
        return [
            processedGridData.filter(d => d.id.startsWith('R1')),
            processedGridData.filter(d => d.id.startsWith('R2')),
            processedGridData.filter(d => d.id.startsWith('R3')),
        ];
    }, [processedGridData]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 dark:bg-zinc-800 dark:border-zinc-700">
            <h2 className="text-xl font-bold text-gray-800 mb-4 dark:text-white border-b pb-2">
                🌟 สรุปค่า (Kaset, Koonnam, Final Value)
            </h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                    <thead className="bg-gray-50 dark:bg-zinc-700">
                        <tr>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                Row/Col
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                เกษตร (a)
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                คุณนาม (b)
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 bg-purple-100 dark:bg-purple-900/50">
                                Final V (c)
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 bg-teal-100 dark:bg-teal-900/50">
                                C5 (a, b)
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 bg-yellow-100 dark:bg-yellow-900/50">
                                C6 (a, c)
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 bg-teal-100 dark:bg-teal-900/50">
                                C7 (b, c)
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                สรุปชื่อดาว
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                        {groupedData.map((rowCells, rowIndex) => (
                            <React.Fragment key={rowIndex}>
                                {rowCells.map((cell: ProcessedGridCellData) => (
                                    <tr 
                                        key={cell.id} 
                                        className={`group transition-colors ${rowIndex % 2 === 0 ? 'bg-white dark:bg-zinc-800' : 'bg-gray-50 dark:bg-zinc-700/50'} hover:bg-yellow-50 dark:hover:bg-yellow-900/30`}
                                    >
                                        <td className="px-3 py-2 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                                            {cell.id}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {cell.kaset}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {cell.koonnam}
                                        </td>
                                        {/* 🎯 Final Value (V) - ปรับขนาดจาก text-xl font-bold เป็น text-sm font-medium */}
                                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-purple-700 dark:text-purple-400 bg-purple-50/50 dark:bg-zinc-700/50 text-center">
                                            {cell.finalValue}
                                        </td>
                                        {/* C5 (a, b) */}
                                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white text-center bg-teal-50/50 dark:bg-teal-900/30">
                                            {cell.pair_ab}
                                        </td>
                                        {/* C6 (a, c) */}
                                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white text-center bg-yellow-50/50 dark:bg-yellow-900/30">
                                            {cell.pair_ac}
                                        </td>
                                        {/* C7 (b, c) */}
                                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white text-center bg-teal-50/50 dark:bg-teal-900/30">
                                            {cell.pair_bc}
                                        </td>
                                        {/* สรุปชื่อดาว */}
                                        <td className="px-3 py-2 text-sm font-semibold text-purple-600 dark:text-purple-400">
                                            {getStarNames(cell)}
                                        </td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                **การจับคู่:** C5 (เกษตร/คุณนาม), C6 (เกษตร/V), C7 (คุณนาม/V). <br/>
                **เงื่อนไข:** ถ้า คุณนาม (b) เป็น &apos;x&apos; จะแสดง &quot;ว่าง&quot; ในช่อง C5 และ C7 
            </p>
        </div>
    );
}
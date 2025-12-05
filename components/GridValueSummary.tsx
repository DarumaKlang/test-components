// components/GridValueSummary.tsx

'use client'; 
import { GridValueData, GridCellData } from '@/data/GridValue';
// 1. นำเข้า useState และ useEffect 
import React, { useMemo, useState, useEffect } from 'react'; 
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
// 2. Interface, Props, และ Types
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

type ModalContentType = { id: string; content: string } | null;

// NOTE: Dynamic content map for C5 popups has been removed while links are disabled.

interface SimpleModalProps {
    modalContent: ModalContentType;
    onClose: () => void;
}

// 4. Modal Component (Fix Animation State for ESLint)
const SimpleModal: React.FC<SimpleModalProps> = ({ modalContent, onClose }) => {
    
    // isVisible ควบคุม opacity/scale (สำหรับ Transition)
    const [isVisible, setIsVisible] = useState(false);
    
    // contentToRender เก็บเนื้อหาไว้ใน DOM ตลอดช่วง Fade-out
    const [contentToRender, setContentToRender] = useState<ModalContentType>(null);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout; // สำหรับ setTimeout หลัก (เปิด/ปิด)
        let cleanupId: NodeJS.Timeout; // สำหรับ setTimeout ทำความสะอาด (ปิด)

        if (modalContent) {
            // OPENING SEQUENCE:
            // FIX: หน่วงเวลาอัปเดต State 10ms เพื่อให้การเรียก setState เป็น Asynchronous 
            timeoutId = setTimeout(() => {
                setContentToRender(modalContent); 
                setIsVisible(true);
            }, 10);

        } else if (contentToRender) { 
            // CLOSING SEQUENCE (modalContent เป็น null):
            
            // FIX: หน่วงเวลาการเปลี่ยนสถานะปิด (setIsVisible(false)) 10ms
            // เพื่อหลีกเลี่ยงการเรียก setState อย่างซิงโครนัสใน Effect (แก้ปัญหา react-hooks/set-state-in-effect)
            timeoutId = setTimeout(() => {
                setIsVisible(false); // เริ่ม Fade-out
                
                // 3. หน่วงเวลาล้าง Content จนกว่า Transition จะจบ (300ms)
                cleanupId = setTimeout(() => {
                    setContentToRender(null); // ล้างเนื้อหา/ถอด Modal ออกจาก DOM
                }, 300); 
            }, 10); // Deferred start
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            if (cleanupId) clearTimeout(cleanupId);
        };
    // FIX: เพิ่ม contentToRender เข้าไปใน Dependency Array (แก้ปัญหา react-hooks/exhaustive-deps)
    }, [modalContent, contentToRender]); 

    // Only render if we have content
    if (!contentToRender) return null;

    // การแสดงผลเนื้อหาแบบขึ้นบรรทัดใหม่
    const lines = contentToRender.content.split('\n').map((line, index) => (
        <React.Fragment key={index}>
            {line || <span>&nbsp;</span>} 
            <br />
        </React.Fragment>
    ));

    // กำหนดคลาสสำหรับ Animation
    const overlayClasses = isVisible ? 'opacity-100' : 'opacity-0';
    const modalClasses = isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95';

    return (
        // Overlay - Centering and Floating with Fade-in/out
        <div 
            className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${overlayClasses} backdrop-blur-sm bg-opacity-50`}
            onClick={() => onClose()}
        >
            {/* Modal Container - Scale and Fade Animation */}
            <div 
                className={`bg-white p-6 rounded-lg shadow-2xl max-w-lg w-full m-4 dark:bg-zinc-800 transform transition-all duration-300 ease-out ${modalClasses}`}
                onClick={(e) => e.stopPropagation()} 
            >
                <div className="flex justify-between items-center border-b pb-2 mb-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        ข้อมูลคู่ดาว: {contentToRender.id}
                    </h3>
                    <button 
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" 
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line max-h-[70vh] overflow-y-auto">
                    {lines}
                </div>
            </div>
        </div>
    );
};


// ----------------------------------------------------------------------
// 5. Main Component (ไม่เปลี่ยนแปลง)
// ----------------------------------------------------------------------

export default function GridValueSummary({ startR1, startR2, startR3 }: GridValueSummaryProps) {
    
    // State สำหรับ Modal
    const [modalContent, setModalContent] = useState<ModalContentType>(null);

    // NOTE: C5 clicks were removed to disable link popups for now.

    // Logic คำนวณค่า V และจัดการการจับคู่
    const processedGridData = useMemo(() => {
        return GridValueData.map((cell) => {
            let result: TriplexResult | null = null;
            try {
                const match = cell.id.match(/R(\d)C(\d)/);
                if (match) {
                    const row = parseInt(match[1]);
                    const column = parseInt(match[2]);
                    result = calculateFinalValue(row, column, startR1, startR2, startR3); 
                }
            } catch (e) {
                console.error("Error calculating Final Value:", e);
            }
            
            const finalValue = result?.finalValue ?? 0; // ค่า c
            const a = cell.kaset !== 'x' ? cell.kaset : 'x';
            const b = cell.koonnam !== 'x' ? cell.koonnam : 'x';
            const c = finalValue;
            
            let pair_ab: string;
            let pair_ac: string;
            let pair_bc: string;

            if (b === 'x') {
                pair_ab = "ว่าง"; // C5
                pair_ac = `${a} / ${c}`; // C6
                pair_bc = "ว่าง"; // C7
            } else {
                pair_ab = `${a} / ${b}`; // C5 (a, b)
                pair_ac = `${a} / ${c}`; // C6 (a, c)
                pair_bc = `${b} / ${c}`; // C7 (b, c)
            }
            
            return {
                ...cell,
                finalValue,
                pair_ab,
                pair_ac,
                pair_bc,
            } as ProcessedGridCellData;

        });
    }, [startR1, startR2, startR3]); 
    
    // จัดกลุ่มตาม Row (R1 ถึง R22)
    const groupedData = useMemo(() => {
        const data: ProcessedGridCellData[][] = [];
        for (let i = 1; i <= 22; i++) {
            const rowData = processedGridData.filter(d => d.id.startsWith(`R${i}`));
            if (rowData.length > 0) {
                data.push(rowData);
            }
        }
        return data;
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
                            {/* C5 ถูกทำเครื่องหมายให้เป็น clickable */}
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
                                {rowCells.map((cell: ProcessedGridCellData) => {
                                    // No clickable C5 cells: remove link behavior and special styling
                                    
                                    return (
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
                                        {/* Final Value (V) */}
                                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-purple-700 dark:text-purple-400 bg-purple-50/50 dark:bg-zinc-700/50 text-center">
                                            {cell.finalValue}
                                        </td>
                                        {/* C5 (a, b) */}
                                        <td 
                                            className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white text-center bg-teal-50/50 dark:bg-teal-900/30"
                                        >
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
                                    )
                                })}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
                <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                **การจับคู่:** C5 (เกษตร/คุณนาม), C6 (เกษตร/V), C7 (คุณนาม/V). <br/>
                **เงื่อนไข:** ถ้า คุณนาม (b) เป็น &apos;x&apos; จะแสดง &quot;ว่าง&quot; ในช่อง C5 และ C7 <br/>
                **ข้อมูลเพิ่มเติม:** หากต้องการเปิดความสามารถของการดูรายละเอียด ให้สร้างเงื่อนไขการแสดงผลใน `DynamicContentMap` (Disabled ปัจจุบัน)
            </p>

            {/* Render Modal ถ้ามีข้อมูล */}
            <SimpleModal modalContent={modalContent} onClose={() => setModalContent(null)} /> 
        </div>
    );
}
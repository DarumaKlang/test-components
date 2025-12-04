// src/components/TriplexGridFinder.tsx

'use client';

import React, { useState, useMemo } from 'react';
import {
    findPositionByFinalValue,
    calculateColumnMajor,
} from '@/lib/grid-calculator';
import { VariableMap } from '@/data/grid-variables';
import { StrategyDescriptionMap, StrategyContent } from '@/data/strategy-descriptions';

// ค่าเริ่มต้น
const INITIAL_SLOT_X = 12;
const INITIAL_TARGET_VALUE = 1;

// Interface สำหรับ Props ที่รับค่าตั้งต้นและ Setter จาก Parent
export interface TriplexGridFinderProps {
    startR1: number | '';
    setStartR1: (value: number | '') => void;
    startR2: number | '';
    setStartR2: (value: number | '') => void;
    startR3: number | '';
    setStartR3: (value: number | '') => void;
}

export default function TriplexGridFinder({
    startR1,
    setStartR1,
    startR2,
    setStartR2,
    startR3,
    setStartR3,
}: TriplexGridFinderProps) {

    // State Mode 1
    const [slotX, setSlotX] = useState<number | ''>(INITIAL_SLOT_X);

    // State Mode 2
    const [targetValue, setTargetValue] = useState<number>(INITIAL_TARGET_VALUE);
    const [showInverseResult, setShowInverseResult] = useState(false);

    // State Modal (Popup คำทำนาย)
    const [modalContent, setModalContent] = useState<{ title: string; description: string } | null>(null);

    // Logic 1: หาตำแหน่งจากลำดับ X
    const columnMajorPosition = useMemo(() => {
        const xVal = Number(slotX);
        if (xVal >= 1 && xVal <= 99) {
            try {
                return calculateColumnMajor(xVal);
            } catch { return null; }
        }
        return null;
    }, [slotX]);

    // Logic 2: หาตำแหน่งจากค่า V (ใช้ค่า startR จาก Props)
    const finalValueResults = useMemo(() => {
        if (!showInverseResult) return [];
        const r1 = Number(startR1);
        const r2 = Number(startR2);
        const r3 = Number(startR3);
        
        // ตรวจสอบว่ามีค่าครบหรือไม่
        if (!r1 || !r2 || !r3 || !targetValue) return [];
        
        return findPositionByFinalValue(r1, r2, r3, targetValue);
    }, [startR1, startR2, startR3, targetValue, showInverseResult]);

    // Logic 3 Helpers
    const getGridValue = (start: number | '', col: number) => {
        const s = Number(start);
        if (!s) return '-';
        return ((s + col - 2) % 7 + 7) % 7 + 1;
    };

    const getVariableName = (row: number, column: number) => {
        return VariableMap[`R${row}C${column}`] || '-';
    };

    const openPrediction = (row: number, column: number) => {
        const key = `R${row}C${column}`;
        const variableName = VariableMap[key] || 'ไม่ระบุชื่อ';
        const title = variableName.split('/')[0].trim();
        const content: StrategyContent | undefined = StrategyDescriptionMap[key];
        const description = content ? content.short : 'ไม่มีข้อมูลคำทำนาย';
        setModalContent({ title: `${title} (R${row}C${column})`, description });
    };

    return (
        <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100 font-sans mb-10 relative">

            {/* --- Modal / Popup Area --- */}
            {modalContent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={() => setModalContent(null)}>
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative transform transition-all scale-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setModalContent(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Close modal"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h3 className="text-xl font-bold text-slate-800 mb-4 pr-8 border-b pb-2">
                            {modalContent.title}
                        </h3>
                        <div className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
                            {modalContent.description}
                        </div>

                        <div className="mt-6 text-right">
                            <button
                                onClick={() => setModalContent(null)}
                                className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-medium transition-colors"
                            >
                                ปิดหน้าต่าง
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-slate-800 text-white p-4 text-center">
                <h2 className="text-xl font-bold">ระบบคำนวณตำแหน่งพิชัยสงคราม (Triplex Grid)</h2>
            </div>

            <div className="p-6 space-y-10">

                {/* MODE 1 */}
                <section>
                    <div className="flex items-center gap-2 mb-4 text-blue-800 border-b pb-2 border-blue-100">
                        <span className="bg-blue-100 text-blue-800 font-bold px-2 py-1 rounded text-sm">MODE 1</span>
                        <h3 className="font-bold text-lg">ค้นหาตำแหน่งจากลำดับ X</h3>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm">
                        <div className="w-full sm:w-1/3">
                            <label htmlFor="inputSlotX" className="block text-sm font-medium text-gray-600 mb-1">ใส่เลขลำดับช่อง (1-99)</label>
                            <input
                                id="inputSlotX"
                                type="number"
                                min="1" max="99"
                                value={slotX}
                                onChange={(e) => setSlotX(e.target.value === '' ? '' : parseInt(e.target.value))}
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 text-center text-2xl font-bold text-gray-800"
                                placeholder="50"
                            />
                        </div>

                        <div className="w-full sm:w-2/3 text-center sm:text-left pl-0 sm:pl-6 border-t sm:border-t-0 sm:border-l border-blue-200 pt-4 sm:pt-0">
                            {columnMajorPosition ? (
                                <div className="animate-fadeIn">
                                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Result</p>
                                    <div className="flex items-baseline gap-3 mb-2 justify-center sm:justify-start">
                                        <div className="text-4xl font-extrabold text-blue-600">
                                            R{columnMajorPosition.row}<span className="text-gray-300 text-2xl mx-1">/</span>C{columnMajorPosition.column}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => openPrediction(columnMajorPosition.row, columnMajorPosition.column)}
                                        className="p-3 bg-white border border-blue-100 rounded-lg shadow-sm inline-block hover:shadow-md hover:border-blue-300 transition-all cursor-pointer text-left w-full sm:w-auto"
                                    >
                                        <p className="text-lg text-gray-800 font-bold flex items-center gap-2">
                                            {getVariableName(columnMajorPosition.row, columnMajorPosition.column)}
                                            <span className="text-blue-500 text-xs bg-blue-50 px-2 py-1 rounded-full border border-blue-100">ดูคำทำนาย</span>
                                        </p>
                                    </button>
                                </div>
                            ) : (
                                <p className="text-red-400 text-sm italic">กรุณาใส่เลข 1-99</p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Divider */}
                <div className="border-t border-gray-100"></div>

                {/* SHARED SETTINGS (ตอนนี้รับค่าจาก Props) */}
                <section className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                        ตั้งค่าเริ่มต้น (Configuration)
                        <span className="text-xs font-normal text-gray-500 ml-2">(เลือกได้เฉพาะ 1-7)</span>
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                        <InputNumber id="inputR1" label="ค่าตั้งต้น R1" value={startR1} setter={setStartR1} />
                        <InputNumber id="inputR2" label="ค่าตั้งต้น R2" value={startR2} setter={setStartR2} />
                        <InputNumber id="inputR3" label="ค่าตั้งต้น R3" value={startR3} setter={setStartR3} />
                    </div>
                </section>

                {/* MODE 2 */}
                <section>
                    <div className="flex items-center gap-2 mb-4 text-green-800 border-b pb-2 border-green-100">
                        <span className="bg-green-100 text-green-800 font-bold px-2 py-1 rounded text-sm">MODE 2</span>
                        <h3 className="font-bold text-lg">ค้นหาตำแหน่งจากค่า V</h3>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-green-100 space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4 items-end">
                            <div className="w-full sm:w-1/2">
                                <label htmlFor="selectTargetValue" className="block text-sm font-medium text-gray-700 mb-1">เลือกตัวเลขเป้าหมาย (V)</label>
                                <select
                                    id="selectTargetValue"
                                    value={targetValue}
                                    onChange={(e) => {
                                        setTargetValue(parseInt(e.target.value));
                                        setShowInverseResult(false);
                                    }}
                                    className="block w-full border-gray-300 rounded-md shadow-sm p-2 text-lg font-bold text-center bg-white text-gray-900 border cursor-pointer hover:bg-gray-50"
                                >
                                    {[1, 2, 3, 4, 5, 6, 7].map((v) => (
                                        <option key={v} value={v}>{v}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-full sm:w-1/2">
                                <button
                                    onClick={() => setShowInverseResult(true)}
                                    className="w-full py-2.5 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 shadow-sm transition-colors"
                                >
                                    ค้นหาตำแหน่ง
                                </button>
                            </div>
                        </div>

                        {showInverseResult && finalValueResults.length > 0 && (
                            <div className="mt-4 space-y-2 animate-fadeIn bg-green-50 p-4 rounded-lg">
                                <p className="text-sm font-semibold text-gray-600 mb-2">คลิกที่ผลลัพธ์เพื่อดูคำทำนาย:</p>
                                {finalValueResults.map((pos, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => openPrediction(pos.row, pos.column)}
                                        className="w-full flex items-center justify-between bg-white border border-green-200 p-3 rounded shadow-sm hover:shadow-md hover:bg-green-50 transition-all mb-2 cursor-pointer text-left group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded text-xs">R{pos.row}</span>
                                            <span className="text-gray-800 font-bold text-lg">C{pos.column}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600 truncate max-w-[150px] sm:max-w-none group-hover:text-green-700">
                                                {getVariableName(pos.row, pos.column)}
                                            </span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-hover:text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* MODE 3 */}
                <section>
                    <div className="flex items-center gap-2 mb-4 text-purple-800 border-b pb-2 border-purple-100">
                        <span className="bg-purple-100 text-purple-800 font-bold px-2 py-1 rounded text-sm">MODE 3</span>
                        <h3 className="font-bold text-lg">ตารางภาพรวม (Grid View)</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">* คลิกที่ช่องตารางเพื่อดูคำทำนาย (ค่าจะอัพเดทตามตารางสรุปด้านล่าง)</p>

                    <div className="overflow-x-auto pb-2">
                        <div className="min-w-[800px] bg-white rounded-lg border border-gray-200 shadow-sm">
                            {/* Header Row */}
                            <div className="grid grid-cols-[50px_repeat(7,1fr)] bg-gray-100 border-b border-gray-200 text-sm font-semibold text-gray-600">
                                <div className="p-3 text-center border-r border-gray-200 bg-gray-200 flex items-center justify-center">Row</div>
                                {[1, 2, 3, 4, 5, 6, 7].map(col => (
                                    <div key={col} className="p-3 text-center border-r border-gray-200 last:border-r-0">
                                        C{col}
                                    </div>
                                ))}
                            </div>

                            {/* Rows Data */}
                            {[
                                { rowId: 1, start: startR1, color: 'text-blue-600 bg-blue-50' },
                                { rowId: 2, start: startR2, color: 'text-green-600 bg-green-50' },
                                { rowId: 3, start: startR3, color: 'text-red-600 bg-red-50' }
                            ].map((row) => (
                                <div key={row.rowId} className="grid grid-cols-[50px_repeat(7,1fr)] border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors min-h-[100px]">
                                    {/* Row Label */}
                                    <div className={`p-2 text-center font-bold border-r border-gray-200 flex items-center justify-center ${row.color}`}>
                                        R{row.rowId}
                                    </div>

                                    {/* Data Cells */}
                                    {[1, 2, 3, 4, 5, 6, 7].map(col => {
                                        const val = getGridValue(row.start, col);
                                        const rawVariableName = getVariableName(row.rowId, col);
                                        const variableLines = rawVariableName.split('/').map(s => s.trim());

                                        return (
                                            <div
                                                key={col}
                                                onClick={() => openPrediction(row.rowId, col)}
                                                className="p-1 text-center border-r border-gray-100 last:border-r-0 flex flex-col items-center justify-start pt-3 cursor-pointer hover:bg-yellow-50 active:bg-yellow-100 transition-colors group"
                                            >
                                                <div className="mb-2 w-7 h-7 rounded-full bg-gray-100 group-hover:bg-white flex items-center justify-center text-base font-extrabold text-gray-800 shadow-sm border border-gray-200 group-hover:border-yellow-200 group-hover:text-yellow-700 transition-all">
                                                    {val}
                                                </div>

                                                <div className="flex flex-col gap-0.5 w-full">
                                                    {variableLines.map((line, idx) => (
                                                        <div key={idx} className="text-[10px] leading-tight text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis px-1">
                                                            {line}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}

// 🆕 Helper Component: InputNumber (เปลี่ยนเป็น Select Dropdown)
interface InputNumberProps {
    id: string;
    label: string;
    value: number | '';
    setter: (value: number | '') => void;
}

const InputNumber = ({ id, label, value, setter }: InputNumberProps) => (
    <div className="text-center bg-white p-3 rounded-lg shadow-sm border border-gray-100">
        <label htmlFor={id} className="block text-xs font-medium text-gray-500 mb-2">{label}</label>
        <div className="relative">
            <select
                id={id}
                value={value}
                onChange={(e) => setter(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 p-2 text-center text-xl font-bold text-gray-900 appearance-none cursor-pointer hover:bg-gray-50 transition-colors"
            >
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <option key={num} value={num}>
                        {num}
                    </option>
                ))}
            </select>
            {/* ลูกศร Dropdown แบบ Custom เพื่อความสวยงาม */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
            </div>
        </div>
    </div>
);
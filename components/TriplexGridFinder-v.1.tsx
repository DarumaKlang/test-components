// src/components/TriplexGridFinder.tsx

'use client';

import React, { useState, useMemo } from 'react';
import {
    findPositionByFinalValue,
    calculateColumnMajor,
} from '@/lib/grid-calculator';
import { VariableMap } from '@/data/grid-variables';

// ค่าเริ่มต้น
const INITIAL_START_R1 = 1;
const INITIAL_START_R2 = 1;
const INITIAL_START_R3 = 1;
const INITIAL_TARGET_VALUE = 1;
const INITIAL_SLOT_X = 12;

export default function TriplexGridFinder() {

    // State Mode 1
    const [slotX, setSlotX] = useState<number | ''>(INITIAL_SLOT_X);

    // State Shared
    const [startR1, setStartR1] = useState<number | ''>(INITIAL_START_R1);
    const [startR2, setStartR2] = useState<number | ''>(INITIAL_START_R2);
    const [startR3, setStartR3] = useState<number | ''>(INITIAL_START_R3);

    // State Mode 2
    const [targetValue, setTargetValue] = useState<number>(INITIAL_TARGET_VALUE);
    const [showInverseResult, setShowInverseResult] = useState(false);

    // Logic 1
    const columnMajorPosition = useMemo(() => {
        const xVal = Number(slotX);
        if (xVal >= 1 && xVal <= 99) {
            try {
                return calculateColumnMajor(xVal);
            } catch { return null; }
        }
        return null;
    }, [slotX]);

    // Logic 2
    const finalValueResults = useMemo(() => {
        if (!showInverseResult) return [];
        const r1 = Number(startR1);
        const r2 = Number(startR2);
        const r3 = Number(startR3);
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

    return (
        <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100 font-sans mb-10">
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
                                    <div className="p-3 bg-white border border-blue-100 rounded-lg shadow-sm inline-block">
                                        <p className="text-lg text-gray-800 font-bold">
                                            {getVariableName(columnMajorPosition.row, columnMajorPosition.column)}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-red-400 text-sm italic">กรุณาใส่เลข 1-99</p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Divider */}
                <div className="border-t border-gray-100"></div>

                {/* SHARED SETTINGS */}
                <section className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                        ตั้งค่าเริ่มต้น (Configuration)
                        <span className="text-xs font-normal text-gray-500 ml-2">(ใช้สำหรับ Mode 2 และ 3)</span>
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
                                    className="block w-full border-gray-300 rounded-md shadow-sm p-2 text-lg font-bold text-center bg-white text-gray-900 border"
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
                                <p className="text-sm font-semibold text-gray-600">ผลลัพธ์สำหรับเลข {targetValue}:</p>
                                {finalValueResults.map((pos, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-white border border-green-200 p-2 rounded shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <span className="bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded text-xs">R{pos.row}</span>
                                            <span className="text-gray-800 font-bold">C{pos.column}</span>
                                        </div>
                                        <span className="text-xs text-gray-500 text-right truncate max-w-[150px] sm:max-w-none">
                                            {getVariableName(pos.row, pos.column)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* MODE 3: ตาราง Grid (อัปเดตใหม่) */}
                <section>
                    <div className="flex items-center gap-2 mb-4 text-purple-800 border-b pb-2 border-purple-100">
                        <span className="bg-purple-100 text-purple-800 font-bold px-2 py-1 rounded text-sm">MODE 3</span>
                        <h3 className="font-bold text-lg">ตารางภาพรวม (Grid View)</h3>
                    </div>

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
                                        // แยกข้อความด้วย '/' และตัดช่องว่างออก
                                        const variableLines = rawVariableName.split('/').map(s => s.trim());

                                        return (
                                            <div key={col} className="p-1 text-center border-r border-gray-100 last:border-r-0 flex flex-col items-center justify-start pt-3">
                                                {/* ตัวเลขค่าผลลัพธ์ */}
                                                <div className="mb-2 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-base font-extrabold text-gray-800 shadow-sm border border-gray-200">
                                                    {val}
                                                </div>

                                                {/* ชื่อตัวแปร แยกบรรทัด */}
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

interface InputNumberProps {
    id: string;
    label: string;
    value: number | '';
    setter: (value: number | '') => void;
}

const InputNumber = ({ id, label, value, setter }: InputNumberProps) => (
    <div className="text-center bg-white p-3 rounded-lg shadow-sm border border-gray-100">
        <label htmlFor={id} className="block text-xs font-medium text-gray-500 mb-2">{label}</label>
        <input
            id={id}
            type="number" min="1" max="7"
            value={value}
            onChange={(e) => setter(e.target.value === '' ? '' : parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 p-2 text-center text-xl font-bold text-gray-900"
        />
    </div>
);
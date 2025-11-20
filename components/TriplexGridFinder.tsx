// src/components/TriplexGridFinder.tsx

'use client'; 

import React, { useState, useMemo } from 'react';
import { 
  findPositionByFinalValue, 
  calculateColumnMajor, 
} from '@/lib/grid-calculator'; // ตรวจสอบ path ให้ตรงกับโปรเจกต์ของคุณ
import { VariableMap } from '@/data/grid-variables'; // ตรวจสอบ path ให้ตรงกับโปรเจกต์ของคุณ

// ค่าเริ่มต้น (สามารถเปลี่ยนได้ตามต้องการ)
const INITIAL_START_R1 = 5;
const INITIAL_START_R2 = 2;
const INITIAL_START_R3 = 4;
const INITIAL_TARGET_VALUE = 3;
const INITIAL_SLOT_X = 50;

export default function TriplexGridFinder() {
  
  // --- State ส่วนที่ 1: หา R, C จาก X ---
  const [slotX, setSlotX] = useState<number | ''>(INITIAL_SLOT_X);
  
  // --- State ส่วนที่ 2: หาตำแหน่งจากค่า V (Inverse) ---
  const [startR1, setStartR1] = useState<number | ''>(INITIAL_START_R1);
  const [startR2, setStartR2] = useState<number | ''>(INITIAL_START_R2);
  const [startR3, setStartR3] = useState<number | ''>(INITIAL_START_R3);
  const [targetValue, setTargetValue] = useState<number>(INITIAL_TARGET_VALUE);
  const [showInverseResult, setShowInverseResult] = useState(false);

  // --------------------------------------------------
  // Logic 1: คำนวณหา R, C จาก X ทันที (Auto Calc)
  // --------------------------------------------------
  const columnMajorPosition = useMemo(() => {
    const xVal = Number(slotX);
    if (xVal >= 1 && xVal <= 99) {
      try {
        return calculateColumnMajor(xVal);
      } catch (e) { return null; }
    }
    return null;
  }, [slotX]);

  // --------------------------------------------------
  // Logic 2: คำนวณหาตำแหน่งจาก V เมื่อกดปุ่ม (Manual Calc)
  // --------------------------------------------------
  const finalValueResults = useMemo(() => {
    if (!showInverseResult) return []; // ไม่แสดงผลถ้ายั่งไม่ได้กดปุ่ม

    const r1 = Number(startR1);
    const r2 = Number(startR2);
    const r3 = Number(startR3);

    if (!r1 || !r2 || !r3 || !targetValue) return [];
    
    return findPositionByFinalValue(r1, r2, r3, targetValue);
  }, [startR1, startR2, startR3, targetValue, showInverseResult]);


  // Helper: ดึงชื่อตัวแปร
  const getVariableName = (row: number, column: number) => {
    return VariableMap[`R${row}C${column}`] || '-';
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100 font-sans">
      <div className="bg-slate-800 text-white p-4 text-center">
        <h2 className="text-xl font-bold">Grid Calculation System</h2>
      </div>

      <div className="p-6 space-y-8">
        
        {/* ========================================== */}
        {/* ส่วนที่ 1: หาตำแหน่งจากลำดับ X */}
        {/* ========================================== */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-blue-800 border-b pb-2 border-blue-100">
            <span className="bg-blue-100 text-blue-800 font-bold px-2 py-1 rounded text-sm">MODE 1</span>
            <h3 className="font-bold text-lg">ค้นหาตำแหน่งจากลำดับ X</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-medium text-gray-600 mb-1">ใส่เลขลำดับช่อง (1-99)</label>
              <input
                type="number"
                min="1" max="99"
                value={slotX}
                onChange={(e) => setSlotX(e.target.value === '' ? '' : parseInt(e.target.value))}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-center text-xl font-bold text-gray-800"
                placeholder="เช่น 50"
              />
            </div>

            <div className="w-full sm:w-1/2 text-center">
               {columnMajorPosition ? (
                 <div className="animate-fadeIn">
                    <p className="text-gray-500 text-sm">ผลลัพธ์ตำแหน่ง</p>
                    <div className="text-2xl font-extrabold text-blue-600">
                      R{columnMajorPosition.row} <span className="text-gray-300 mx-1">|</span> C{columnMajorPosition.column}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Slot Index: {columnMajorPosition.slotIndex}</p>
                 </div>
               ) : (
                 <p className="text-red-400 text-sm italic">กรุณาใส่เลข 1-99</p>
               )}
            </div>
          </div>
        </section>


        {/* ========================================== */}
        {/* ส่วนที่ 2: หาตำแหน่งจากค่า V (Inverse) */}
        {/* ========================================== */}
        <section>
           <div className="flex items-center gap-2 mb-4 text-green-800 border-b pb-2 border-green-100">
            <span className="bg-green-100 text-green-800 font-bold px-2 py-1 rounded text-sm">MODE 2</span>
            <h3 className="font-bold text-lg">ค้นหาตำแหน่งจากค่า V</h3>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-100 space-y-4">
            {/* Inputs: Start Values */}
            <div className="grid grid-cols-3 gap-3">
              <InputNumber label="ค่าตั้งต้น R1" value={startR1} setter={setStartR1} />
              <InputNumber label="ค่าตั้งต้น R2" value={startR2} setter={setStartR2} />
              <InputNumber label="ค่าตั้งต้น R3" value={startR3} setter={setStartR3} />
            </div>

            <hr className="border-green-200" />

            {/* Dropdown & Button */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">เลือกตัวเลขเป้าหมาย (V)</label>
              <div className="flex gap-3">
                <select
                  value={targetValue}
                  onChange={(e) => {
                    setTargetValue(parseInt(e.target.value));
                    setShowInverseResult(false); // Reset ผลลัพธ์เมื่อเปลี่ยนค่าเลือก
                  }}
                  className="block w-full border-gray-300 rounded-md shadow-sm p-2 text-lg font-bold text-center bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
                
                <button
                  onClick={() => setShowInverseResult(true)}
                  className="whitespace-nowrap px-6 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 shadow-sm transition-colors"
                >
                  ค้นหาตำแหน่ง
                </button>
              </div>
            </div>
          </div>

          {/* Results List */}
          {showInverseResult && finalValueResults.length > 0 && (
            <div className="mt-4 space-y-2 animate-fadeIn">
              <p className="text-sm font-semibold text-gray-600">ผลลัพธ์สำหรับเลข {targetValue}:</p>
              {finalValueResults.map((pos, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white border border-gray-200 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                   <div className="flex items-center gap-3">
                      <span className="bg-gray-100 text-gray-600 font-bold px-2 py-1 rounded text-xs">R{pos.row}</span>
                      <span className="text-green-700 font-bold text-lg">C{pos.column}</span>
                   </div>
                   <span className="text-sm text-gray-600 font-medium text-right">
                     {getVariableName(pos.row, pos.column)}
                   </span>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

// Sub-component สำหรับ Input เล็กๆ
const InputNumber = ({ label, value, setter }: { label: string, value: number | '', setter: any }) => (
  <div className="text-center">
    <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
    <input
      type="number" min="1" max="7"
      value={value}
      onChange={(e) => setter(e.target.value === '' ? '' : parseInt(e.target.value))}
      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-1 text-center font-bold"
    />
  </div>
);

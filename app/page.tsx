// app/page.tsx

'use client'; // 👈 เพิ่มบรรทัดนี้ไว้บนสุดเสมอเมื่อใช้ useState

import TriplexGridFinder, { TriplexGridFinderProps } from "@/components/TriplexGridFinder";
import GridValueSummary from "@/components/GridValueSummary";
import { useState } from 'react';

// ค่าเริ่มต้น
const INITIAL_START_R1 = 1;
const INITIAL_START_R2 = 1;
const INITIAL_START_R3 = 1;

export default function Home() {
    // State สำหรับเก็บค่าตั้งต้น R1, R2, R3
    const [startR1, setStartR1] = useState<number | ''>(INITIAL_START_R1);
    const [startR2, setStartR2] = useState<number | ''>(INITIAL_START_R2);
    const [startR3, setStartR3] = useState<number | ''>(INITIAL_START_R3);

    // เตรียม Props สำหรับ TriplexGridFinder
    const triplexProps: TriplexGridFinderProps = {
        startR1,
        setStartR1,
        startR2,
        setStartR2,
        startR3,
        setStartR3,
    };

    // แปลงค่าเป็น number เพื่อส่งให้ GridValueSummary (ใช้ 1 เป็นค่า default ถ้าเป็นค่าว่าง)
    const r1Value = Number(startR1) || 1;
    const r2Value = Number(startR2) || 1;
    const r3Value = Number(startR3) || 1;

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-900">
            <main className="container mx-auto py-10 px-4">
                <div className="flex flex-col items-center justify-center gap-8">

                    {/* หัวข้อของหน้าเว็บ */}
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            ระบบคำนวณตำแหน่งพิชัยสงคราม
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Triplex Grid Calculation System
                        </p>
                    </div>

                    {/* เรียกใช้ Component หลัก (Mode 1 & 2 & 3) */}
                    <div className="w-full">
                        <TriplexGridFinder {...triplexProps} />
                    </div>

                    {/* ส่วนสรุปข้อมูล Grid (ตารางสรุป) */}
                    <div className="w-full max-w-4xl">
                        {/* ส่งค่าที่คำนวณแล้วไปยังตาราง */}
                        <GridValueSummary startR1={r1Value} startR2={r2Value} startR3={r3Value} />
                    </div>

                </div>
            </main>
        </div>
    );
}
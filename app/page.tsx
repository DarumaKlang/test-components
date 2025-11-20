import TriplexGridFinder from "@/components/TriplexGridFinder";

export default function Home() {
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

                    {/* เรียกใช้ Component หลัก */}
                    <div className="w-full">
                        <TriplexGridFinder />
                    </div>

                </div>
            </main>
        </div>
    );
}
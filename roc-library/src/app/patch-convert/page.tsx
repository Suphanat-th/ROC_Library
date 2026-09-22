import { headers } from "next/headers";
import PatchConvertClient from "./PatchConvertClient";

type PatchConvertPageProps = {
  searchParams: Promise<{ Key?: string | string[] }>;
};

export default async function PatchConvertPage({
  searchParams,
}: PatchConvertPageProps) {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host")?.split(":")[0].toLowerCase();
  const isLocalhost = host === "localhost" || host === "127.0.0.1";
  const params = await searchParams;
  const patchMember = Array.isArray(params.Key)
    ? params.Key[0]
    : params.Key;
    
  const allowedKeys = "bfeedcdb-0b1a-4370-b4a8-6c94b59b7525";

  if (
    !isLocalhost &&
    (!allowedKeys || patchMember !== allowedKeys)
  ) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-2xl font-bold text-red-600">Access denied</h1>
          <p className="mt-2 text-gray-600">
            เปิดหน้านี้ด้วย parameter ที่ถูกต้อง
            <br/>
            ติดตามข้อมูลเพิ่มเติมได้ที่
            <a href="https://www.facebook.com/profile.php?id=61579020425764" target="_blank" className="text-blue-600 underline m-2">
              FB: หมากัดหมวด
            </a>
            ประจำวันพุธ เวลา 06:00 เป็นต้นไป
          </p>
        </div>
      </main>
    );
  }

  return <PatchConvertClient />;
}

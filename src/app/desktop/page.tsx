import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Desktop() {
  return (
    <div className="relative z-10 mx-auto flex h-full min-h-screen items-center p-12">
      <div className="inline-flex w-[400px] flex-col items-start justify-start gap-6 rounded-[30px] bg-white p-6">
        <div className="flex h-[68px] flex-col items-start justify-start gap-2 self-stretch">
          <div className="inline-flex items-center justify-between self-stretch">
            <div className="text-center text-xl font-semibold leading-tight text-black">
              Dream Widgets
            </div>

            <div className="relative flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-black/5 text-gray-400 transition-all duration-200 ease-in-out hover:scale-105 hover:bg-black/10 hover:text-gray-500">
              <Link href="/desktop/start">
                <X className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="text-sm font-medium leading-tight text-black/40">
            Widgets bring the power of Web3 to your fingertips. Let&apos;s get
            started with adding your first widget.
          </div>
        </div>
        <div>
          <Image
            src="/images/desktop-widgets.png"
            alt="Desktop Widgets"
            width={359}
            height={240}
          />
        </div>

        <div className="mt-1 w-full">
          <Button size="lg" className="w-full py-6 text-lg font-normal" asChild>
            <Link href="/desktop/start">Get Started Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

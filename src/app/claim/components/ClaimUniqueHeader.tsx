import { DreamLogo } from "@/app/assets/logo";

export function ClaimUniqueHeader() {
  return (
    <div className="absolute left-12 top-12 flex flex-row items-center justify-center">
      <div className="mr-6 rounded-xl bg-white p-5">
        <div className="h-10 w-10">
          <DreamLogo width={40} height={43} />
        </div>
      </div>
      <div>
        <div className="text-3xl font-semibold text-black opacity-50">
          Claim your unique
        </div>
        <div className="text-3xl font-semibold text-black">Dream ID</div>
      </div>
    </div>
  );
}

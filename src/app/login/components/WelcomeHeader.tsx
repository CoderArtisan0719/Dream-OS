export function WelcomeHeader() {
  return (
    <div className="absolute left-12 top-12 flex flex-row items-center justify-center">
      <div className="z-10 w-full max-w-5xl flex-col items-start justify-between text-sm lg:flex">
        <div className="text-3xl font-semibold text-black opacity-50">
          Welcome to
        </div>
        <div className="text-3xl font-semibold text-black">the Dream</div>
      </div>
    </div>
  );
}

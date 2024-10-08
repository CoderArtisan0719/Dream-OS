import { cn } from "@/utils/tailwind";

// For storybook
export function ResponsiveContainer({
  viewport = "sm",
  className = "",
  children,
}: {
  viewport?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "@container",
        {
          "w-[172px]": viewport === "sm",
          "w-[364px]": viewport === "md",
          "w-[550px]": viewport === "lg",
        },
        className,
      )}
    >
      {children}
    </div>
  );
}

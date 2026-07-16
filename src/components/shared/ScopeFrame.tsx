import { cn } from "@/lib/utils";

export function ScopeFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full bg-moss-200 p-1",
        className
      )}
    >
      <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-canopy-950/10" />
      <div className="relative h-full w-full overflow-hidden rounded-full">
        {children}
      </div>
    </div>
  );
}

export function ScopeDivider() {
  return (
    <div className="mx-auto my-10 flex items-center justify-center">
      <span className="sr-only">Section</span>
      <span className="inline-block h-8 w-8 rounded-full bg-moss-200 ring-1 ring-inset ring-canopy-950/10" />
    </div>
  );
}

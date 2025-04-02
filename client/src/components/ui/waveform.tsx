import { cn } from "@/lib/utils";

interface WaveformProps {
  className?: string;
  position?: "left" | "right";
}

const Waveform = ({ className, position = "left" }: WaveformProps) => {
  return (
    <svg
      className={cn(
        "absolute h-48 w-48 opacity-30",
        position === "left" ? "left-0 top-20 -translate-x-10" : "right-0 top-20 translate-x-10",
        className
      )}
      viewBox="0 0 100 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="stroke-primary stroke-2 fill-none opacity-50"
        d={
          position === "left"
            ? "M10,100 C20,80 30,120 40,90 C50,60 60,140 70,110 C80,80 90,120 100,100"
            : "M0,100 C10,80 20,120 30,90 C40,60 50,140 60,110 C70,80 80,120 90,100"
        }
      />
    </svg>
  );
};

export default Waveform;

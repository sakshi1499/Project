import { cn } from "@/lib/utils";

interface WaveformProps {
  className?: string;
  position?: "left" | "right";
}

const Waveform = ({ className, position = "left" }: WaveformProps) => {
  return (
    <div
      className={cn(
        "absolute h-full opacity-80 z-0",
        position === "left" ? "left-0" : "right-0",
        className
      )}
    >
      <svg
        className={cn(
          "h-full w-48",
          position === "left" ? "-translate-x-10" : "translate-x-10"
        )}
        viewBox="0 0 100 200"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          className="stroke-[#6b77c9] stroke-[1.5] fill-none opacity-70"
          d={
            position === "left"
              ? "M10,100 C20,80 30,120 40,90 C50,60 60,140 70,110 C80,80 90,120 100,100"
              : "M0,100 C10,80 20,120 30,90 C40,60 50,140 60,110 C70,80 80,120 90,100"
          }
        />
        <path
          className="stroke-[#6b77c9] stroke-1 fill-none opacity-40"
          d={
            position === "left"
              ? "M0,70 C10,90 20,50 30,80 C40,110 50,30 60,60 C70,90 80,50 90,70"
              : "M10,70 C20,90 30,50 40,80 C50,110 60,30 70,60 C80,90 90,50 100,70"
          }
        />
        <path
          className="stroke-[#6b77c9] stroke-1 fill-none opacity-20"
          d={
            position === "left"
              ? "M5,50 C15,30 25,70 35,40 C45,20 55,80 65,50 C75,30 85,70 95,50"
              : "M5,50 C15,30 25,70 35,40 C45,20 55,80 65,50 C75,30 85,70 95,50"
          }
        />
      </svg>
    </div>
  );
};

export default Waveform;

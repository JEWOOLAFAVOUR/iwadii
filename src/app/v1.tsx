import { useEffect, useState, useRef, useCallback } from "react";

export default function Home() {
  const [layers, setLayers] = useState<
    Array<{ color: string; phase: "closed" | "opening" | "done" }>
  >([]);
  const [imageRevealed, setImageRevealed] = useState(false);
  const colorIndexRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cycleCountRef = useRef(0);
  const TOTAL_CYCLES = 5;

  const colors = ["#b5f80f", "#02b5fd", "#0ab579", "#FF006E", "#FFB703"];

  // Tagline lines: each has text + the highlight bar color
  const taglineLines = [
    { text: "Curiosity", color: "#0ab579" },
    { text: "is", color: "#b5f80f" },
    { text: "Life", color: "#02b5fd" },
  ];

  const scheduleNext = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      cycleCountRef.current += 1;

      if (cycleCountRef.current >= TOTAL_CYCLES) {
        setLayers((prev) => [...prev, { color: "image", phase: "closed" }]);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setLayers((prev) =>
              prev.map((layer, i) =>
                i === prev.length - 1 ? { ...layer, phase: "opening" } : layer,
              ),
            );
          });
        });
        return;
      }

      colorIndexRef.current = (colorIndexRef.current + 1) % colors.length;
      const newColor = colors[colorIndexRef.current];

      setLayers((prev) => [...prev, { color: newColor, phase: "closed" }]);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setLayers((prev) =>
            prev.map((layer, i) =>
              i === prev.length - 1 ? { ...layer, phase: "opening" } : layer,
            ),
          );
        });
      });
    }, 800);
  }, []);

  useEffect(() => {
    scheduleNext();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [scheduleNext]);

  const handleTransitionEnd = (index: number, isImage: boolean) => {
    if (isImage) {
      // Image finished sweeping in — trigger the text reveal
      setImageRevealed(true);
      return;
    }

    setLayers((prev) => {
      const updated = prev.map((layer, i) =>
        i === index ? { ...layer, phase: "done" as const } : layer,
      );
      return updated.length > 2 ? updated.slice(-2) : updated;
    });
    scheduleNext();
  };

  const getClipPath = (phase: string) => {
    if (phase === "done" || phase === "opening") {
      return "polygon(100% 100%, -150% 150%, 150% -150%)";
    }
    return "polygon(100% 100%, 100% 100%, 100% 100%)";
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Color layers */}
      {layers
        .map((layer, index) => ({ layer, index }))
        .filter(({ layer }) => layer.color !== "image")
        .map(({ layer, index }) => (
          <div
            key={`${layer.color}-${index}`}
            className="absolute inset-0"
            style={{
              backgroundColor: layer.color,
              clipPath: getClipPath(layer.phase),
              transition:
                layer.phase === "opening"
                  ? "clip-path 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                  : "none",
              zIndex: index + 1,
            }}
            onTransitionEnd={() => {
              if (layer.phase === "opening") {
                handleTransitionEnd(index, false);
              }
            }}
          />
        ))}

      {/* Center text during color cycle — above colors, below image */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 50 }}
      >
        <h1
          className="text-9xl font-bold text-black"
          style={{ fontFamily: "var(--font-ojuju)" }}
        >
          ìwádìí
        </h1>
      </div>

      {/* Image layer */}
      {layers
        .map((layer, index) => ({ layer, index }))
        .filter(({ layer }) => layer.color === "image")
        .map(({ layer, index }) => (
          <div
            key={`image-${index}`}
            className="absolute inset-0"
            style={{
              backgroundImage: "url(/iwadii-bg.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              clipPath: getClipPath(layer.phase),
              transition:
                layer.phase === "opening"
                  ? "clip-path 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                  : "none",
              zIndex: 100,
            }}
            onTransitionEnd={() => {
              if (layer.phase === "opening") {
                handleTransitionEnd(index, true);
              }
            }}
          >
            {/* Tagline — static on the image, sweeps in with it */}
            <div
              className="absolute flex flex-col gap-0"
              style={{
                top: "30%",
                left: "30%",
                transform: "translateX(-50%)",
              }}
            >
              {taglineLines.map((line, i) => (
                <div
                  key={line.text}
                  style={{
                    border: "1px solid #000",
                    display: "inline-block",
                    padding: "2px 8px",
                    backgroundColor: line.color,
                  }}
                >
                  <span
                    className="font-bold text-black"
                    style={{
                      fontFamily: "var(--font-ojuju)",
                      fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                      lineHeight: 1.1,
                    }}
                  >
                    {line.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

      {/* Post-reveal text elements — sit above the image */}
      {imageRevealed && (
        <div className="absolute inset-0" style={{ zIndex: 200 }}>
          {/* Logo top-left — bordered box, text slides in inside */}
          <div
            className="absolute top-8 left-8"
            style={{
              animation: "fadeIn 0.3s ease 0.1s both",
            }}
          >
            <div
              className="overflow-hidden"
              style={{
                border: "1px solid #000",
                padding: "6px 14px",
                display: "inline-block",
                backgroundColor: "#0ab579",
              }}
            >
              <span
                className="font-bold text-black inline-block"
                style={{
                  fontFamily: "var(--font-ojuju)",
                  fontSize: "1.5rem",
                  animation:
                    "slideInTop 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.25s both",
                }}
              >
                ìwádìí
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Keyframes */}
      <style>{`
        @keyframes slideInLeft {
          from {
            transform: translateX(-110%);
          }
          to {
            transform: translateX(0);
          }
        }
        @keyframes slideInTop {
          from {
            transform: translateY(-110%);
          }
          to {
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

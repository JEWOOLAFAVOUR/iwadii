"use client";

import { useEffect, useState, useRef, useCallback } from "react";

export default function Home() {
  const [layers, setLayers] = useState<
    Array<{ color: string; phase: "closed" | "opening" | "done" }>
  >([]);
  const [imageRevealed, setImageRevealed] = useState(false);
  const [textBgLayers, setTextBgLayers] = useState<
    Array<{ color: string; phase: "closed" | "opening" | "done" }>
  >([]);
  const colorIndexRef = useRef(0);
  const textColorIndexRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cycleCountRef = useRef(0);
  const TOTAL_CYCLES = 5;

  const colors = ["#b5f80f", "#02b5fd", "#0ab579", "#FF006E", "#FFB703"];

  // Tagline lines: just text, bg color will come from cycling animation
  const taglineLines = ["Curiosity", "is", "Life"];

  const scheduleNext = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      cycleCountRef.current += 1;

      if (cycleCountRef.current === 1) {
        // First cycle - add initial color
        colorIndexRef.current = 0;
        const initialColor = colors[0];
        setLayers((prev) => [
          ...prev,
          { color: initialColor, phase: "closed" },
        ]);

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

      if (cycleCountRef.current > TOTAL_CYCLES) {
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

  // Continuous color cycling for text backgrounds after image reveal
  const scheduleTextBgCycle = useCallback(() => {
    const newColor = colors[textColorIndexRef.current];

    // Add new layer in "closed" state
    setTextBgLayers((prev) => [...prev, { color: newColor, phase: "closed" }]);

    // Trigger opening animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTextBgLayers((prev) =>
          prev.map((layer, i) =>
            i === prev.length - 1 ? { ...layer, phase: "opening" } : layer,
          ),
        );
      });
    });

    // Move to next color
    textColorIndexRef.current = (textColorIndexRef.current + 1) % colors.length;
  }, [colors]);

  const handleTextBgTransitionEnd = () => {
    // Clean up old layers, keep only last 2
    setTextBgLayers((prev) => {
      const updated = prev.map((layer) => ({
        ...layer,
        phase: "done" as const,
      }));
      return updated.length > 2 ? updated.slice(-2) : updated;
    });

    // Schedule next cycle
    textTimeoutRef.current = setTimeout(() => {
      scheduleTextBgCycle();
    }, 1000);
  };

  // Start text bg cycling when image is revealed
  useEffect(() => {
    if (imageRevealed) {
      // Start with first color immediately
      scheduleTextBgCycle();
    }
    return () => {
      if (textTimeoutRef.current) clearTimeout(textTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageRevealed]);

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
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ zIndex: 50 }}
      >
        <h1
          className="text-9xl font-bold text-black"
          style={{ fontFamily: "var(--font-ojuju)" }}
        >
          ìwádìí
        </h1>

        {/* Loading message */}
        <div className="absolute bottom-32 flex flex-col items-center gap-2">
          <p
            className="text-black text-lg"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Loading..
          </p>
          <p
            className="text-black text-xl opacity-80"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            For the full experience, let curiosity guide you.
          </p>
        </div>
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
            {/* Tagline — each word in its own fitted box with shared cycling bg */}
            <div
              className="absolute flex flex-col items-start"
              style={{
                top: "30%",
                left: "25%",
              }}
            >
              {taglineLines.map((text, i) => (
                <div
                  key={text}
                  className="relative overflow-hidden"
                  style={{
                    border: "2px solid #000",
                    padding: "10px 24px",
                    marginTop: i === 0 ? 0 : "-2px", // overlap borders
                  }}
                >
                  {/* Cycling background layers */}
                  {textBgLayers.map((layer, layerIndex) => (
                    <div
                      key={`${layer.color}-${layerIndex}`}
                      className="absolute inset-0"
                      style={{
                        backgroundColor: layer.color,
                        clipPath:
                          layer.phase === "opening" || layer.phase === "done"
                            ? "polygon(-100% -100%, 200% -100%, 200% 200%, -100% 200%)"
                            : "polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)",
                        transition:
                          layer.phase === "opening"
                            ? "clip-path 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                            : "none",
                        zIndex: layerIndex,
                      }}
                      onTransitionEnd={
                        i === 0 && layer.phase === "opening"
                          ? handleTextBgTransitionEnd
                          : undefined
                      }
                    />
                  ))}
                  {/* Text on top */}
                  <span
                    className="font-bold text-black relative"
                    style={{
                      fontFamily: "var(--font-ojuju)",
                      fontSize: "clamp(3rem, 7vw, 4.5rem)",
                      lineHeight: 1,
                      zIndex: 100,
                    }}
                  >
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

      {/* Post-reveal text elements — sit above the image */}
      {imageRevealed && (
        <div className="absolute inset-0" style={{ zIndex: 200 }}>
          {/* Logo top-left — bordered box with shared cycling background */}
          <div className="absolute top-8 left-8">
            <div
              className="relative overflow-hidden"
              style={{
                border: "2px solid #000",
                padding: "8px 16px",
              }}
            >
              {/* Cycling background layers - same as tagline */}
              {textBgLayers.map((layer, layerIndex) => (
                <div
                  key={`logo-${layer.color}-${layerIndex}`}
                  className="absolute inset-0"
                  style={{
                    backgroundColor: layer.color,
                    clipPath:
                      layer.phase === "opening" || layer.phase === "done"
                        ? "polygon(-100% -100%, 200% -100%, 200% 200%, -100% 200%)"
                        : "polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)",
                    transition:
                      layer.phase === "opening"
                        ? "clip-path 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                        : "none",
                    zIndex: layerIndex,
                  }}
                />
              ))}
              {/* Text on top */}
              <span
                className="font-bold text-black relative inline-block"
                style={{
                  fontFamily: "var(--font-ojuju)",
                  fontSize: "1.5rem",
                  zIndex: 100,
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
        @keyframes slideInBg {
          from {
            clip-path: polygon(100% 100%, 100% 100%, 100% 100%);
          }
          to {
            clip-path: polygon(100% 100%, -150% 150%, 150% -150%);
          }
        }
      `}</style>
    </div>
  );
}

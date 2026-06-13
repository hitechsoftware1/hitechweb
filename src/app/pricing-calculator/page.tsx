```tsx
"use client";

import { useMemo, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

const features = [
  {
    id: "mobile",
    name: "Mobile App (iOS/Android)",
    base: 2500,
    icon: "📱",
  },
  {
    id: "ecommerce",
    name: "E-commerce Integration",
    base: 1500,
    icon: "🛒",
  },
  {
    id: "ai",
    name: "AI & Neural Systems",
    base: 3000,
    icon: "🧠",
  },
  {
    id: "auth",
    name: "Advanced Security (Auth)",
    base: 800,
    icon: "🔐",
  },
  {
    id: "cloud",
    name: "Cloud Infrastructure",
    base: 1200,
    icon: "☁️",
  },
  {
    id: "analytics",
    name: "Real-time Analytics",
    base: 1000,
    icon: "📊",
  },
];

function cn(...inputs: string[]) {
  return inputs.filter(Boolean).join(" ");
}

export default function PricingCalculator() {
  const [selections, setSelections] =
    useState<string[]>([]);

  const [complexity, setComplexity] =
    useState(1);

  const total = useMemo(() => {
    const featureTotal = features
      .filter((f) =>
        selections.includes(f.id)
      )
      .reduce(
        (sum, f) => sum + f.base,
        0
      );

    return Math.round(
      (2000 + featureTotal) *
        (1 + (complexity - 1) * 0.5)
    );
  }, [selections, complexity]);

  const toggleFeature = (
    id: string
  ) => {
    setSelections((prev) =>
      prev.includes(id)
        ? prev.filter(
            (x) => x !== id
          )
        : [...prev, id]
    );
  };

  return (
    <main className="min-h-screen bg-background">

      <Navbar />

      <section className="container mx-auto px-6 pt-32 mb-24">

        <h1 className="text-5xl lg:text-8xl font-bold text-center mb-8">

          Invest in
          <br />
          Value.

        </h1>

        <p className="text-center max-w-2xl mx-auto text-muted-foreground">

          Calculate the estimated
          investment for your next
          high-performance digital
          ecosystem.

        </p>

      </section>

      <section className="container mx-auto px-6 mb-32">

        <div className="grid lg:grid-cols-12 gap-12 max-w-6xl mx-auto">

          <div className="lg:col-span-7 space-y-10">

            <div className="apple-card p-10">

              <div className="flex items-center gap-3 mb-8">

                <Calculator className="w-6 h-6" />

                <h3 className="text-2xl font-bold">

                  Feature Selection

                </h3>

              </div>

              <div className="grid sm:grid-cols-2 gap-4">

                {features.map(
                  (feature) => (
                    <button
                      key={
                        feature.id
                      }
                      type="button"
                      onClick={() =>
                        toggleFeature(
                          feature.id
                        )
                      }
                      className={cn(
                        "p-6 rounded-3xl border transition text-left",

                        selections.includes(
                          feature.id
                        )
                          ? "bg-primary/10 border-primary"
                          : "hover:border-primary/40"
                      )}
                    >
                      <div className="text-2xl mb-3">
                        {
                          feature.icon
                        }
                      </div>

                      <h4 className="font-bold">

                        {
                          feature.name
                        }

                      </h4>

                      <p className="text-sm opacity-60">

                        Base:
                        ${feature.base}

                      </p>

                    </button>
                  )
                )}

              </div>

            </div>

            <div className="apple-card p-10">

              <div className="flex justify-between items-center mb-8">

                <h3 className="text-2xl font-bold">

                  Project Complexity

                </h3>

                <div className="border rounded-full px-4 py-1">

                  Level {complexity}

                </div>

              </div>

              <Slider
                value={[complexity]}
                max={5}
                min={1}
                step={1}
                onValueChange={(
                  value
                ) =>
                  setComplexity(
                    value[0]
                  )
                }
              />

            </div>

          </div>

          <div className="lg:col-span-5">

            <div className="apple-card p-10 sticky top-32">

              <h3 className="mb-8 uppercase">

                Estimate Breakdown

              </h3>

              <div className="space-y-5">

                <div className="flex justify-between">

                  <span>
                    Core Fee
                  </span>

                  <strong>
                    $2,000
                  </strong>

                </div>

                <div className="flex justify-between">

                  <span>
                    Total
                  </span>

                  <strong className="text-4xl">

                    $
                    {total.toLocaleString()}

                  </strong>

                </div>

              </div>

              <Button className="w-full mt-10 h-14 rounded-full">

                Get Detailed Proposal

              </Button>

            </div>

          </div>

        </div>

      </section>

      <Footer />

    </main>
  );
}
```

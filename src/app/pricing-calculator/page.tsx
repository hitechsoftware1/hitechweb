```tsx
"use client";

import { useMemo, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

const FEATURES = [
  {
    id: "mobile",
    name: "Mobile App (iOS / Android)",
    price: 2500,
    icon: "📱",
  },
  {
    id: "ecommerce",
    name: "E-commerce Integration",
    price: 1500,
    icon: "🛒",
  },
  {
    id: "ai",
    name: "AI & Neural Systems",
    price: 3000,
    icon: "🧠",
  },
  {
    id: "auth",
    name: "Advanced Security",
    price: 800,
    icon: "🔐",
  },
  {
    id: "cloud",
    name: "Cloud Infrastructure",
    price: 1200,
    icon: "☁️",
  },
  {
    id: "analytics",
    name: "Real-time Analytics",
    price: 1000,
    icon: "📊",
  },
];

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function PricingCalculator() {
  const [selected, setSelected] = useState<string[]>([]);
  const [complexity, setComplexity] = useState(1);

  const toggleFeature = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const multiplier = useMemo(
    () => 1 + (complexity - 1) * 0.5,
    [complexity]
  );

  const total = useMemo(() => {
    const extras = FEATURES
      .filter((f) => selected.includes(f.id))
      .reduce((sum, f) => sum + f.price, 0);

    return Math.round((2000 + extras) * multiplier);
  }, [selected, multiplier]);

  return (
    <main className="min-h-screen bg-background">

      <Navbar />

      <section className="container mx-auto px-6 pt-32 pb-16">

        <div className="max-w-3xl mx-auto text-center">

          <h1 className="text-5xl md:text-7xl font-bold mb-8">
            Pricing Calculator
          </h1>

          <p className="text-muted-foreground text-lg">
            Estimate the investment for your next
            digital product.
          </p>

        </div>

      </section>

      <section className="container mx-auto px-6 pb-32">

        <div className="grid lg:grid-cols-12 gap-10 max-w-7xl mx-auto">

          <div className="lg:col-span-7 space-y-8">

            <div className="apple-card p-8">

              <div className="flex items-center gap-3 mb-8">

                <Calculator className="w-6 h-6" />

                <h2 className="text-2xl font-bold">
                  Select Features
                </h2>

              </div>

              <div className="grid sm:grid-cols-2 gap-4">

                {FEATURES.map((feature) => {

                  const active =
                    selected.includes(feature.id);

                  return (
                    <button
                      key={feature.id}
                      type="button"
                      onClick={() =>
                        toggleFeature(feature.id)
                      }
                      className={cn(
                        "border rounded-3xl p-6 text-left transition",
                        active
                          ? "border-primary bg-primary/10"
                          : "hover:border-primary/40"
                      )}
                    >
                      <div className="text-3xl mb-4">
                        {feature.icon}
                      </div>

                      <h3 className="font-bold mb-2">
                        {feature.name}
                      </h3>

                      <p className="text-sm opacity-60">
                        ${feature.price}
                      </p>

                    </button>
                  );
                })}

              </div>

            </div>

            <div className="apple-card p-8">

              <div className="flex justify-between mb-8">

                <h2 className="text-2xl font-bold">
                  Complexity
                </h2>

                <div className="border rounded-full px-4 py-1 text-sm">

                  Level {complexity}

                </div>

              </div>

              <Slider
                value={[complexity]}
                min={1}
                max={5}
                step={1}
                onValueChange={(v) =>
                  setComplexity(v[0])
                }
              />

              <div className="flex justify-between mt-6 text-sm opacity-50">

                <span>Startup MVP</span>

                <span>Enterprise</span>

              </div>

            </div>

          </div>

          <div className="lg:col-span-5">

            <div className="apple-card sticky top-28 p-8">

              <h3 className="uppercase text-sm mb-8">
                Estimate
              </h3>

              <div className="space-y-5">

                <div className="flex justify-between">

                  <span>Base Architecture</span>

                  <strong>$2,000</strong>

                </div>

                {FEATURES
                  .filter((f) =>
                    selected.includes(f.id)
                  )
                  .map((f) => (
                    <div
                      key={f.id}
                      className="flex justify-between"
                    >
                      <span>{f.name}</span>

                      <strong>
                        +${f.price}
                      </strong>

                    </div>
                  ))}

                <div className="flex justify-between">

                  <span>Multiplier</span>

                  <strong>
                    ×{multiplier.toFixed(1)}
                  </strong>

                </div>

                <div className="border-t pt-8">

                  <div className="flex justify-between items-end">

                    <span className="font-bold">
                      Total
                    </span>

                    <span className="text-4xl font-bold">

                      ${total.toLocaleString()}

                    </span>

                  </div>

                </div>

              </div>

              <Button
                className="w-full mt-10 h-14 rounded-full"
              >
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

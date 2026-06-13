
"use client";

import { useMemo, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function PricingCalculator() {
  const [selected, setSelected] = useState<string[]>([]);
  const [complexity, setComplexity] = useState(1);

  const total = useMemo(() => {
    const featureTotal = features
      .filter((f) => selected.includes(f.id))
      .reduce((sum, item) => sum + item.base, 0);

    const multiplier = 1 + (complexity - 1) * 0.5;

    return Math.round((2000 + featureTotal) * multiplier);
  }, [selected, complexity]);

  const multiplier = (1 + (complexity - 1) * 0.5).toFixed(1);

  const toggleFeature = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  return (
    <main className="min-h-screen bg-background">

      <Navbar />

      <section className="container mx-auto px-6 pt-32 pb-20">
        <div className="max-w-3xl mx-auto text-center">

          <h1 className="text-5xl md:text-7xl font-bold mb-8">
            Pricing Calculator
          </h1>

          <p className="text-lg text-muted-foreground">
            Estimate the investment required to build your next
            digital product.
          </p>

        </div>
      </section>

      <section className="container mx-auto px-6 pb-32">

        <div className="grid lg:grid-cols-12 gap-10 max-w-7xl mx-auto">

          {/* LEFT */}

          <div className="lg:col-span-7 space-y-8">

            <div className="apple-card p-8">

              <div className="flex items-center gap-3 mb-8">
                <Calculator className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">
                  Select Features
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">

                {features.map((feature) => {

                  const active = selected.includes(feature.id);

                  return (
                    <button
                      key={feature.id}
                      type="button"
                      onClick={() => toggleFeature(feature.id)}
                      className={cn(
                        "rounded-3xl border p-6 text-left transition-all",

                        active
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      <div className="text-3xl mb-4">
                        {feature.icon}
                      </div>

                      <h3 className="font-semibold mb-2">
                        {feature.name}
                      </h3>

                      <p className="text-sm text-muted-foreground">
                        Starting at ${feature.base}
                      </p>
                    </button>
                  );
                })}

              </div>

            </div>

            <div className="apple-card p-8">

              <div className="flex items-center justify-between mb-8">

                <h2 className="text-2xl font-bold">
                  Complexity
                </h2>

                <Badge variant="outline">
                  Level {complexity}
                </Badge>

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

              <div className="flex justify-between mt-6 text-xs text-muted-foreground">

                <span>Startup MVP</span>

                <span>Enterprise</span>

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="lg:col-span-5">

            <div className="apple-card p-8 sticky top-28">

              <h2 className="uppercase tracking-widest text-primary mb-10 text-sm">
                Estimate Breakdown
              </h2>

              <div className="space-y-5">

                <div className="flex justify-between">

                  <span>Core Architecture</span>

                  <strong>$2,000</strong>

                </div>

                {features
                  .filter((f) =>
                    selected.includes(f.id)
                  )
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between"
                    >
                      <span>
                        {item.name}
                      </span>

                      <strong>
                        +${item.base}
                      </strong>
                    </div>
                  ))}

                <div className="flex justify-between text-primary">

                  <span>Complexity</span>

                  <strong>x{multiplier}</strong>

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

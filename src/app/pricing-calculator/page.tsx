"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

const FEATURES = [
  { id: "mobile", name: "Mobile App", price: 2500, icon: "📱" },
  { id: "ecommerce", name: "E-commerce", price: 1500, icon: "🛒" },
  { id: "ai", name: "AI Systems", price: 3000, icon: "🧠" },
  { id: "security", name: "Security", price: 800, icon: "🔐" },
  { id: "cloud", name: "Cloud", price: 1200, icon: "☁️" },
  { id: "analytics", name: "Analytics", price: 1000, icon: "📊" },
];

export default function PricingCalculator() {
  const [selected, setSelected] =
    useState<string[]>([]);

  const [complexity, setComplexity] =
    useState(1);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter(
            (x) => x !== id
          )
        : [...prev, id]
    );
  }

  const featuresTotal =
    FEATURES.filter((f) =>
      selected.includes(f.id)
    ).reduce(
      (sum, f) =>
        sum + f.price,
      0
    );

  const multiplier =
    1 +
    (complexity - 1) * 0.5;

  const total =
    Math.round(
      (2000 +
        featuresTotal) *
        multiplier
    );

  return (
    <main className="min-h-screen bg-background">

      <Navbar />

      <section className="container mx-auto px-6 pt-32 pb-20">

        <div className="text-center">

          <h1 className="text-6xl font-bold mb-4">

            Pricing Calculator

          </h1>

          <p className="opacity-60">

            Estimate project pricing.

          </p>

        </div>

      </section>

      <section className="container mx-auto px-6 pb-32">

        <div className="grid lg:grid-cols-12 gap-10">

          <div className="lg:col-span-7">

            <div className="apple-card p-8">

              <div className="flex gap-3 mb-8">

                <Calculator />

                <h2 className="font-bold">

                  Select Features

                </h2>

              </div>

              <div className="grid sm:grid-cols-2 gap-4">

                {FEATURES.map(
                  (
                    feature
                  ) => (
                    <button
                      key={
                        feature.id
                      }
                      type="button"
                      onClick={() =>
                        toggle(
                          feature.id
                        )
                      }
                      className={`border rounded-3xl p-6 text-left ${
                        selected.includes(
                          feature.id
                        )
                          ? "border-primary bg-primary/10"
                          : ""
                      }`}
                    >
                      <div className="text-3xl">

                        {
                          feature.icon
                        }

                      </div>

                      <div className="mt-3">

                        {
                          feature.name
                        }

                      </div>

                      <div className="opacity-60">

                        $
                        {
                          feature.price
                        }

                      </div>

                    </button>
                  )
                )}

              </div>

            </div>

            <div className="apple-card p-8 mt-8">

              <div className="flex justify-between mb-6">

                <span>

                  Complexity

                </span>

                <strong>

                  Level {
                    complexity
                  }

                </strong>

              </div>

              <Slider
                value={[
                  complexity,
                ]}
                min={1}
                max={5}
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

            <div className="apple-card p-8">

              <h3 className="mb-8">

                Estimate

              </h3>

              <div className="space-y-5">

                <div className="flex justify-between">

                  <span>

                    Base

                  </span>

                  <strong>

                    $2000

                  </strong>

                </div>

                <div className="flex justify-between">

                  <span>

                    Features

                  </span>

                  <strong>

                    $
                    {
                      featuresTotal
                    }

                  </strong>

                </div>

                <div className="flex justify-between">

                  <span>

                    Multiplier

                  </span>

                  <strong>

                    ×
                    {
                      multiplier.toFixed(
                        1
                      )
                    }

                  </strong>

                </div>

                <hr />

                <div className="flex justify-between">

                  <span>

                    Total

                  </span>

                  <strong className="text-4xl">

                    $
                    {
                      total.toLocaleString()
                    }

                  </strong>

                </div>

              </div>

              <Button className="w-full mt-8">

                Get Proposal

              </Button>

            </div>

          </div>

        </div>

      </section>

      <Footer />

    </main>
  );
}
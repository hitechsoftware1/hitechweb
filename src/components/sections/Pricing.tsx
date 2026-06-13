```tsx
"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Startup",
    price: "$2,499",
    description:
      "Great for new businesses starting their journey.",
    features: [
      "Dedicated Lead",
      "Easy Design",
      "Secure Setup",
      "Weekly Updates",
    ],
  },

  {
    name: "Business",
    price: "$5,999",
    description:
      "The complete team to help your business grow fast.",
    features: [
      "Full Team",
      "24/7 Support",
      "AI Tools",
      "Guaranteed Speed",
    ],
    popular: true,
  },

  {
    name: "Enterprise",
    price: "Custom",
    description:
      "Built for large companies that need global reach.",
    features: [
      "Global R&D",
      "Safe Storage",
      "Easy Migration",
      "Personal Support",
    ],
  },
];

type Tier =
  (typeof tiers)[number];

export function Pricing() {
  const [
    api,
    setApi,
  ] =
    useState<
      CarouselApi | null
    >(null);

  const [
    current,
    setCurrent,
  ] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(
      api.selectedScrollSnap()
    );

    const update =
      () =>
        setCurrent(
          api.selectedScrollSnap()
        );

    api.on(
      "select",
      update
    );

    return () => {
      api.off(
        "select",
        update
      );
    };
  }, [api]);

  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-background py-16 lg:py-32"
    >
      <div className="absolute inset-0">

        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover opacity-10"
        >
          <source
            src="https://assets.mixkit.co/videos/31413/31413-720.mp4"
            type="video/mp4"
          />
        </video>

        <div className="absolute inset-0 bg-background/60" />

      </div>

      <div className="container relative z-10 mx-auto px-6">

        <div className="mb-20 text-center">

          <h2 className="text-5xl font-bold mb-6">

            Investment

          </h2>

          <p className="mx-auto max-w-2xl text-muted-foreground">

            Simple pricing for teams
            that value speed and
            quality.

          </p>

        </div>

        {/* Desktop */}

        <div className="hidden lg:grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {tiers.map(
            (
              tier,
              index
            ) => (
              <PricingCard
                key={
                  index
                }
                tier={
                  tier
                }
              />
            )
          )}

        </div>

        {/* Mobile */}

        <div className="lg:hidden">

          <Carousel
            setApi={
              setApi
            }
            plugins={[
              Autoplay({
                delay: 5000,
                stopOnInteraction:
                  false,
              }),
            ]}
            opts={{
              loop: true,
              align:
                "center",
            }}
          >
            <CarouselContent>

              {tiers.map(
                (
                  tier,
                  index
                ) => (
                  <CarouselItem
                    key={
                      index
                    }
                    className="basis-[85%]"
                  >
                    <motion.div
                      animate={{
                        scale:
                          current ===
                          index
                            ? 1
                            : 0.9,
                        opacity:
                          current ===
                          index
                            ? 1
                            : 0.6,
                      }}
                    >
                      <PricingCard
                        tier={
                          tier
                        }
                        mobile
                      />
                    </motion.div>
                  </CarouselItem>
                )
              )}

            </CarouselContent>

          </Carousel>

        </div>

      </div>
    </section>
  );
}

function PricingCard({
  tier,
  mobile,
}: {
  tier: Tier;
  mobile?: boolean;
}) {
  return (
    <div
      className={cn(
        "apple-card flex h-full flex-col",

        mobile
          ? "p-6"
          : "p-10",

        tier.popular
          ? "border-primary ring-1 ring-primary/20"
          : ""
      )}
    >
      <div className="mb-8 flex justify-between">

        <h3
          className={cn(
            "font-bold",

            mobile
              ? "text-2xl"
              : "text-3xl"
          )}
        >
          {tier.name}
        </h3>

        {tier.popular && (
          <div className="rounded-full bg-primary px-3 py-1 text-xs text-white font-bold">

            Popular

          </div>
        )}

      </div>

      <div className="mb-8">

        <div className="text-4xl font-bold">

          {tier.price}

        </div>

        {tier.price !==
          "Custom" && (
          <span className="opacity-50">

            / month

          </span>
        )}

        <p className="mt-4 text-muted-foreground">

          {tier.description}

        </p>

      </div>

      <div className="space-y-4 flex-grow">

        {tier.features.map(
          (
            item,
            idx
          ) => (
            <div
              key={
                idx
              }
              className="flex gap-3"
            >
              <Check className="w-4 h-4 text-primary" />

              <span>

                {item}

              </span>

            </div>
          )
        )}

      </div>

      <Button
        asChild
        className="mt-10 rounded-full"
      >
        <Link href="#contact">

          {tier.price ===
          "Custom"
            ? "Contact Us"
            : "Get Started"}

        </Link>
      </Button>

    </div>
  );
}
```

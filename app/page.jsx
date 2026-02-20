import PricingSection from "@/components/PricingSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_STATS, FEATURES, HOW_IT_WORKS_STEPS } from "@/lib/data";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight, Clock, Star, Users, Sparkles, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const { has } = await auth();
  const subscriptionTier = has({ plan: "pro" }) ? "pro" : "free";

  return (
    <div className="min-h-screen bg-white text-stone-900 selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden">
      {/* Hero section */}
      <section className="relative pt-24 pb-20 md:pt-20 md:pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-sm font-semibold animate-in fade-in slide-in-from-bottom-3 duration-700">
                <Sparkles className="w-4 h-4 fill-orange-600/20" />
                <span>AI-Powered Recipe Generation</span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] md:leading-[1.05]">
                Cook anything <br />
                with <span className="text-gradient-orange italic font-serif pr-2">whatever</span> <br />
                you have.
              </h1>

              <p className="text-base md:text-lg text-stone-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                Turn your leftovers into chef-quality masterpieces. Snap a photo, scan your pantry, and let AI do the rest.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
                <Link href="/dashboard">
                  <Button size="xl" className="rounded-full px-8 h-14 text-lg btn-gradient-orange transition-all cursor-pointer">
                    Start Cooking Free <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <div className="text-sm text-stone-500 font-medium">
                  <span className="font-bold text-stone-900 underline decoration-orange-400">10k+</span> happy cooks joined this week
                </div>
              </div>
            </div>

            {/* Hero Image / Visual */}
            <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
              <div className="relative aspect-square md:aspect-4/5 rounded-3xl overflow-hidden shadow-2xl shadow-stone-200 border border-stone-100">
                <Image
                  src="/pasta-dish.png"
                  alt="Delicious pasta dish"
                  width={800}
                  height={1000}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                
                {/* Floating Recipe Card */}
                <Card className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl border-white shadow-2xl py-0">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-xl text-stone-900">
                          Rustic Tomato Basil Pasta
                        </h3>
                        <div className="flex gap-0.5 mt-1.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
                          ))}
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 font-bold border-green-200">
                        98% MATCH
                      </Badge>
                    </div>
                    <div className="flex gap-4 text-sm text-stone-500 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> 25 mins
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" /> 2 servings
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-100/50 rounded-full blur-2xl -z-10" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-100/50 rounded-full blur-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 md:py-24 bg-stone-100 border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {SITE_STATS.map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="text-3xl md:text-4xl font-bold tracking-tight text-stone-900">
                  {stat.val}
                </div>
                <div className="text-sm font-medium uppercase tracking-[0.2em] text-stone-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Modern Grid */}
      <section className="py-24 md:py-32 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <div className="mb-16 text-center lg:text-left">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
              Master your <br />
              meal prep.
            </h2>
            <p className="text-stone-500 text-lg font-light max-w-2xl">
              Everything you need to turn your kitchen into a smart, waste-free zone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {FEATURES.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={index}
                  className="group relative overflow-hidden border-stone-100 bg-stone-50/50 hover:bg-white hover:border-orange-100 transition-all duration-300 py-0"
                >
                  <CardContent className="p-10">
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-white border border-stone-100 flex items-center justify-center text-orange-600 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider text-stone-400 border-stone-200">
                        {feature.limit}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-orange-600 transition-colors">{feature.title}</h3>
                    <p className="text-stone-500 text-base leading-relaxed font-light">
                      {feature.description}
                    </p>
                  </CardContent>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-50/50 rounded-tl-[100px] -mr-16 -mb-16 blur-2xl group-hover:opacity-100 opacity-0 transition-opacity" />
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works - Visual Timeline */}
      <section className="py-24 md:py-32 bg-stone-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            <div className="flex-1 space-y-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                Fresh meals in <br />
                three easy steps.
              </h2>
              
              <div className="space-y-8">
                {HOW_IT_WORKS_STEPS.map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full border-2 border-orange-500/30 flex items-center justify-center text-orange-500 font-bold shrink-0 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                        {item.step}
                      </div>
                      {i < HOW_IT_WORKS_STEPS.length - 1 && (
                        <div className="w-px h-full bg-stone-800 my-2" />
                      )}
                    </div>
                    <div className="pb-8">
                      <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-3">
                        {item.title}
                        {i === 2 && <CheckCircle2 className="w-5 h-5 text-orange-500" />}
                      </h3>
                      <p className="text-stone-400 text-lg font-light leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/dashboard">
                <Button variant="secondary" size="xl" className="rounded-full px-10 h-16 text-xl bg-white text-stone-950 hover:bg-stone-100 transition-all border-none cursor-pointer">
                  Get Started Now
                </Button>
              </Link>
            </div>

            <div className="flex-1 relative">
              <div className="relative aspect-square max-w-lg mx-auto overflow-hidden rounded-3xl border border-stone-800 shadow-2xl">
                 <Image
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop"
                  alt="AI scanning pantry"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-stone-900/80 via-transparent to-transparent " />
              </div>
              {/* Floating Badge */}
              <div className="absolute -top-6 -right-6 md:-right-12 bg-orange-600 text-white p-6 rounded-2xl shadow-xl rotate-6 hidden md:block">
                <p className="font-bold text-lg leading-tight">AI Vision <br /> Technology</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - Using Component */}
      <section className="py-24 md:py-32 px-4 bg-white overflow-hidden">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">Pricing Plans</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Simple, transparent pricing.</h2>
          <p className="text-stone-500 text-base font-light">Choose the plan that&apos;s right for your kitchen.</p>
        </div>
        <PricingSection subscriptionTier={subscriptionTier} />
      </section>
      
      {/* Footer / CTA */}
      <section className="py-24 px-4 border-t border-stone-100 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Ready to cook something <br />
            <span className="text-gradient-orange italic font-serif pr-2">extraordinary?</span>
          </h2>
          <Link href="/dashboard">
            <Button size="xl" className="rounded-full px-12 h-18 text-2xl btn-gradient-orange cursor-pointer">
              Join 10,000+ Cooks
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

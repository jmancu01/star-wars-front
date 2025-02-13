// src/app/page.tsx
import Link from "next/link";
import { Star, Users, Film, Rocket, Globe } from "lucide-react";

export default function Home() {
  const categories = [
    {
      title: "Characters",
      description: "Explore the heroes and villains of the Star Wars universe",
      path: "/characters",
      icon: Users,
      emoji: "👥",
    },
    {
      title: "Movies",
      description: "Discover the epic Star Wars saga films",
      path: "/movies",
      icon: Film,
      emoji: "🎬",
    },
    {
      title: "Starships",
      description: "Browse through iconic vessels and spaceships",
      path: "/starships",
      icon: Rocket,
      emoji: "🚀",
    },
    {
      title: "Planets",
      description: "Visit worlds across the galaxy",
      path: "/planets",
      icon: Globe,
      emoji: "🌍",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white relative">
      {/* Hero Section */}
      <section className="relative py-32 text-center px-4">
        <div className="animate-pulse">
          <Star className="w-20 h-20 mx-auto mb-8 text-yellow-400 transform hover:scale-110 transition-transform duration-300" />
        </div>
        <h1 className="text-6xl font-bold mb-6 text-yellow-400">
          Welcome to Star Wars Hub
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Explore the vast universe of Star Wars. Discover characters, movies,
          starships, and planets from the iconic saga.
        </p>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.path}
                href={category.path}
                className="group block p-8 rounded-lg transition-all duration-300 bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-yellow-400/20 hover:border-yellow-400/50"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="w-8 h-8 text-yellow-400 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-2xl">{category.emoji}</span>
                </div>
                <h2 className="text-xl font-semibold mb-3 text-yellow-400 group-hover:text-yellow-300 transition-colors">
                  {category.title}
                </h2>
                <p className="text-gray-300 group-hover:text-gray-200 transition-colors">
                  {category.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Feature Section */}
      <section className="relative py-20 px-4 bg-black/40">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12 text-yellow-400">
            Experience the Force
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Rich Content",
                description:
                  "Access detailed information about all aspects of Star Wars",
                emoji: "📚",
              },
              {
                title: "Regular Updates",
                description: "Stay current with the latest Star Wars content",
                emoji: "🔄",
              },
              {
                title: "Interactive Experience",
                description:
                  "Chat with you favorite characters with our AI implementation",
                emoji: "✨",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-lg bg-black/60 backdrop-blur-sm border border-yellow-400/20 hover:border-yellow-400/50 transition-all duration-300"
              >
                <div className="text-3xl mb-4">{feature.emoji}</div>
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

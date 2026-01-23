import { FileSearch, FolderTree, MessageSquare, Zap } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Analysis",
    description: "Drop a repository URL and understand its entire structure in seconds, not hours.",
    gradient: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400",
  },
  {
    icon: FileSearch,
    title: "Smart File Insights",
    description: "Every file explained in plain English. Know what it does, why it exists, and how it connects.",
    gradient: "from-primary/20 to-cyan-500/20",
    iconColor: "text-primary",
  },
  {
    icon: FolderTree,
    title: "Architecture Mapping",
    description: "Visualize folder hierarchies and understand the design patterns at a glance.",
    gradient: "from-emerald-500/20 to-green-500/20",
    iconColor: "text-emerald-400",
  },
  {
    icon: MessageSquare,
    title: "Ask Anything",
    description: "Chat with the codebase. Ask about data flow, business logic, or implementation details.",
    gradient: "from-purple-500/20 to-violet-500/20",
    iconColor: "text-purple-400",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-32 px-6 relative">
      {/* Subtle divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-foreground animate-fade-in-up">
            Everything you need to
            <br />
            <span className="gradient-text">understand code faster</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-lg animate-fade-in-up animation-delay-100">
            Built for developers who value their time. No setup, no learning curve.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 gap-5">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className={`
                glass-container p-8 card-hover group
                animate-fade-in-up animation-delay-${(index + 2) * 100}
              `}
            >
              {/* Icon with gradient background */}
              <div className={`
                relative w-12 h-12 rounded-xl mb-6
                bg-gradient-to-br ${feature.gradient}
                flex items-center justify-center
                group-hover:scale-110 transition-transform duration-500
              `}>
                <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
                <div className={`
                  absolute inset-0 rounded-xl bg-gradient-to-br ${feature.gradient}
                  blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500
                `} />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-foreground mb-3 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-[15px] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
const features = [
  {
    title: "Repository overview",
    description: "Understand what the project does and how it's structured.",
  },
  {
    title: "Folder and file explanations",
    description: "Learn the purpose of each major directory and file.",
  },
  {
    title: "Ask questions",
    description: "Get clear answers about logic, data flow, and design.",
  },
];

export function Features() {
  return (
    <section className="w-full max-w-xl mx-auto space-y-10 md:space-y-12">
      {features.map((feature) => (
        <div key={feature.title} className="space-y-2">
          <h3 className="text-sm font-medium text-foreground">
            {feature.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </div>
      ))}
    </section>
  );
}

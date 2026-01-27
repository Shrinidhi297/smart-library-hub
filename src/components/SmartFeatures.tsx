import { Wifi, Scan, Brain, Cloud, Database } from "lucide-react";

const features = [
  {
    icon: Wifi,
    title: "IoT Integration",
    shortTitle: "IoT",
    description: "Internet of Things technology connects physical library resources with digital systems. Smart sensors monitor book locations, environmental conditions, and occupancy levels in real-time.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Scan,
    title: "RFID Technology",
    shortTitle: "RFID",
    description: "Radio Frequency Identification enables automatic book tracking, self-checkout systems, and inventory management. Simply tap your ID card for seamless borrowing and returns.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Brain,
    title: "Artificial Intelligence",
    shortTitle: "AI",
    description: "AI-powered systems provide personalized recommendations, intelligent search results, and automated cataloging. Our system learns from your preferences to suggest relevant resources.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Cloud,
    title: "Cloud Computing",
    shortTitle: "Cloud",
    description: "Cloud-based infrastructure ensures your data is always accessible, secure, and synchronized across all devices. Access your library account from anywhere in the world.",
    color: "from-orange-500 to-amber-500",
  },
  {
    icon: Database,
    title: "Digital Database",
    shortTitle: "Database",
    description: "Comprehensive digital databases store millions of books, journals, and research papers. Advanced indexing ensures quick retrieval of any resource you need.",
    color: "from-rose-500 to-red-500",
  },
];

const SmartFeatures = () => {
  return (
    <section id="features" className="section-padding bg-background">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
            Smart Features
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
            Technologies Powering Our Library
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Our Smart Library leverages five core technologies to deliver an unparalleled 
            learning experience. Each technology works seamlessly together to create an 
            intelligent ecosystem.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
              } gap-8 items-center bg-card rounded-2xl p-8 border border-border card-hover`}
            >
              {/* Icon Section */}
              <div className="flex-shrink-0">
                <div
                  className={`w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}
                >
                  <feature.icon className="h-12 w-12 md:h-16 md:w-16 text-white" />
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-block px-3 py-1 bg-muted rounded-full text-xs font-semibold text-muted-foreground mb-3">
                  {feature.shortTitle}
                </div>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SmartFeatures;

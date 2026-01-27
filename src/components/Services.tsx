import { 
  BookOpen, 
  Search, 
  CreditCard, 
  UserCircle, 
  Lightbulb,
  Download
} from "lucide-react";

const services = [
  {
    icon: BookOpen,
    title: "Digital Book Access",
    description: "Access thousands of e-books, journals, and research papers from anywhere, anytime through our comprehensive digital library.",
  },
  {
    icon: Search,
    title: "Smart Book Search",
    description: "Find exactly what you need with our intelligent search system that understands context and provides accurate results instantly.",
  },
  {
    icon: CreditCard,
    title: "RFID-Based Issue & Return",
    description: "Experience hassle-free book borrowing and returns with our automated RFID system - no queues, no paperwork.",
  },
  {
    icon: UserCircle,
    title: "Online Student Portal",
    description: "Manage your library account, track borrowed books, view due dates, and access your reading history all in one place.",
  },
  {
    icon: Lightbulb,
    title: "AI Book Recommendations",
    description: "Get personalized book suggestions based on your reading patterns, interests, and academic requirements.",
  },
  {
    icon: Download,
    title: "Offline Downloads",
    description: "Download books for offline reading and access your materials even without an internet connection.",
  },
];

const Services = () => {
  return (
    <section id="services" className="section-padding bg-muted/50">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
            Our Services
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
            Comprehensive Library Services
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Discover our wide range of services designed to enhance your learning experience 
            and make accessing knowledge easier than ever before.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-8 card-hover border border-border group"
            >
              <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
                <service.icon className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

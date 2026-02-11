import {
  BookOpen,
  Search,
  CreditCard,
  UserCircle,
  Download,
  Scan,
  Database,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone
} from "lucide-react";

const services = [
  {
    icon: Search,
    title: "Online Book Search",
    description: "Instantly find any book in our massive digital repository using our high-speed indexing engine.",
  },
  {
    icon: Scan,
    title: "Availability Status",
    description: "Real-time tracking of book availability. Know exactly which books are on shelves or when they'll return.",
  },
  {
    icon: Database,
    title: "Digital Library System",
    description: "A comprehensive ecosystem managing physical and digital assets with seamless synchronization.",
  },
  {
    icon: UserCircle,
    title: "User Login System",
    description: "Secure Clerk-powered authentication providing a personalized dashboard for every member.",
  },
  {
    icon: BookOpen,
    title: "Book Reservation",
    description: "Reserve your favorite titles ahead of time. Our system holds your selection for quick pickup.",
  },
  {
    icon: Download,
    title: "E-Books Access",
    description: "Direct access to thousands of digital publications, journals, and interactive research materials.",
  },
  {
    icon: CreditCard,
    title: "Fine Calculation",
    description: "Automated transparent fine management. Track overdue books and pay dues online instantly.",
  },
  {
    icon: ShieldCheck,
    title: "Admin Dashboard",
    description: "Powerful management tools for librarians to curate content, track inventory, and manage users.",
  },
  {
    icon: SlidersHorizontal,
    title: "Search Filters",
    description: "Drill down into our collection with granular filters including genre, year, status, and author.",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description: "Access the entire library hub from any device. Our responsive design ensures a premium experience everywhere.",
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

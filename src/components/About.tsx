import { BookOpen, Users, Globe, Award } from "lucide-react";

const stats = [
  { icon: BookOpen, value: "50,000+", label: "Digital Books" },
  { icon: Users, value: "10,000+", label: "Active Students" },
  { icon: Globe, value: "24/7", label: "Access Available" },
  { icon: Award, value: "99%", label: "User Satisfaction" },
];

const About = () => {
  return (
    <section id="about" className="section-padding bg-background">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
            About Us
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
            What is a Smart Library?
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            A Smart Library is a modern, technology-enhanced library that leverages cutting-edge 
            innovations to provide seamless access to knowledge. It integrates digital resources, 
            automated systems, and intelligent technologies to create an efficient and user-friendly 
            learning environment.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-6 text-center card-hover border border-border"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-lg mb-4">
                <stat.icon className="h-6 w-6 text-secondary" />
              </div>
              <div className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6">
              Revolutionizing Education Through Technology
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Our Smart Library System combines the best of traditional library services with 
              modern technology. We believe that every student deserves easy access to quality 
              educational resources, regardless of time or location.
            </p>
            <ul className="space-y-4">
              {[
                "Instant access to thousands of digital books and journals",
                "AI-powered recommendations based on your interests",
                "Seamless book borrowing with RFID technology",
                "Cloud-based system accessible from any device",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-secondary rounded-full" />
                  </div>
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center">
              <div className="text-center p-8">
                <BookOpen className="h-24 w-24 text-primary mx-auto mb-6 animate-float" />
                <p className="font-serif text-xl text-foreground">
                  "Knowledge at Your Fingertips"
                </p>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

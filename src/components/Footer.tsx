import { BookOpen, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "About Us", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Book Search", href: "#search" },
    { name: "Contact", href: "#contact" },
  ];

  const resources = [
    { name: "E-Books", href: "#" },
    { name: "Journals", href: "#" },
    { name: "Research Papers", href: "#" },
    { name: "Student Portal", href: "#" },
    { name: "Help Center", href: "#" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-header text-header-foreground">
      <div className="section-container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="#home" className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-secondary rounded-lg">
                <BookOpen className="h-6 w-6 text-secondary-foreground" />
              </div>
              <span className="font-serif text-xl font-semibold">
                Smart Library
              </span>
            </a>
            <p className="text-header-foreground/70 mb-6 leading-relaxed">
              Transforming education through technology. Access knowledge anytime, 
              anywhere with our intelligent library management system.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-white/10 hover:bg-secondary rounded-lg flex items-center justify-center transition-colors group"
                >
                  <social.icon className="h-5 w-5 text-header-foreground/70 group-hover:text-secondary-foreground" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-header-foreground/70 hover:text-header-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6">Resources</h4>
            <ul className="space-y-3">
              {resources.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-header-foreground/70 hover:text-header-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6">Stay Updated</h4>
            <p className="text-header-foreground/70 mb-4">
              Subscribe to our newsletter for the latest updates and resources.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-header-foreground placeholder:text-header-foreground/50 focus:outline-none focus:border-secondary"
              />
              <button
                type="submit"
                className="w-full px-4 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-header-foreground/60 text-sm text-center md:text-left">
            © {currentYear} Smart Library System. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a
              href="#"
              className="text-header-foreground/60 hover:text-header-foreground transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-header-foreground/60 hover:text-header-foreground transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

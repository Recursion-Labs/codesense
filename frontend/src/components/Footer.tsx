"use client";

import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

const footerLinks = {
  Product: ["Features", "How it Works", "Documentation", "Changelog"],
  Resources: ["Blog", "Community", "Support", "Status"],
  Company: ["About", "Careers", "Contact", "Privacy Policy"],
};

const socialLinks = [
  { icon: Github, href: "https://github.com/Recursion-Labs/codesense", label: "GitHub" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Mail, href: "mailto:hello@codesense.dev", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-foreground">
                Codesense
              </span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-xs">
              Automate browser compatibility checking with official Baseline
              data. Write code with confidence.
            </p>
            
            {/* Social links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-foreground mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={index}>
                    <motion.a
                      href="#"
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Codesense. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <motion.a
                href="#"
                className="hover:text-foreground transition-colors"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                Terms
              </motion.a>
              <motion.a
                href="#"
                className="hover:text-foreground transition-colors"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                Privacy
              </motion.a>
              <motion.a
                href="#"
                className="hover:text-foreground transition-colors"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                Cookies
              </motion.a>
              {/* Link to external Codesense repository (Recursion-Labs) */}
              <motion.a
                href="https://github.com/Recursion-Labs/codesense"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors flex items-center gap-2"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Github className="w-4 h-4" />
                <span>Recursion-Labs/codesense</span>
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
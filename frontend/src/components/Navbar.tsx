"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Download, Github, MessageSquare } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
  transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold text-foreground">Codesense</span>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {["Features", "How it Works", "Docs"].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-3">
            <motion.a
              href="https://marketplace.visualstudio.com/items?itemName=RecursionLabs.recursion-codesense"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Download className="w-4 h-4" />
              <span>Install</span>
            </motion.a>

            <a
              href="https://github.com/Recursion-Labs/codesense"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              aria-label="View on GitHub"
            >
              <Github className="w-5 h-5 text-gray-700" />
            </a>


          </div>
        </div>
      </div>
    </motion.nav>
  );
}
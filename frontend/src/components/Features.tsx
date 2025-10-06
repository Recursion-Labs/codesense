"use client";

import { motion } from "framer-motion";
import { ScanSearch, FileSearch, FileBarChart, Package, LayoutDashboard } from "lucide-react";

const features = [
  {
    icon: ScanSearch,
    title: "Scan Project for Baseline Compatibility",
    description:
      "Analyze your entire project to identify modern web features and check their browser compatibility against official Baseline data.",
    color: "from-blue-400 to-blue-600",
    command: "CodeSense.scanProject",
  },
  {
    icon: FileSearch,
    title: "Scan Current File",
    description:
      "Quickly check compatibility for the file you're currently working on. Get instant feedback without scanning the entire project.",
    color: "from-purple-400 to-purple-600",
    command: "CodeSense.scanFile",
  },
  {
    icon: FileBarChart,
    title: "Generate Compatibility Report",
    description:
      "Create detailed compatibility reports showing APIs used, their support status, severity levels, and affected file locations.",
    color: "from-orange-400 to-red-500",
    command: "CodeSense.generateReport",
  },
  {
    icon: Package,
    title: "Inject Required Polyfills",
    description:
      "Automatically inject polyfills for unsupported features, ensuring your code works across all target browsers.",
    color: "from-green-400 to-green-600",
    command: "CodeSense.injectPolyfills",
  },
  {
    icon: LayoutDashboard,
    title: "Show Compatibility Dashboard",
    description:
      "View an interactive dashboard with compatibility scores, detailed results, and visual insights about your project's browser support.",
    color: "from-yellow-400 to-orange-500",
    command: "CodeSense.showDashboard",
  },
];

export default function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
      visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section id="features" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/30 to-white" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to ensure browser compatibility in your VS Code projects
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="mb-6">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-4 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm mb-4">
                  {feature.description}
                </p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                  {feature.command}
                </code>
              </div>

              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
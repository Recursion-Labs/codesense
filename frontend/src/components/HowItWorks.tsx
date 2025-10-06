"use client";

import { motion } from "framer-motion";
import { Download, ScanSearch, FileBarChart, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Download,
    title: "Install Extension",
    description:
      "Download Codesense from the VS Code marketplace with a single click. No additional setup or configuration needed.",
    step: "01",
  },
  {
    icon: ScanSearch,
    title: "Scan Your Project",
    description:
      "Use the command palette to scan your entire project or individual files. Codesense analyzes all web APIs and features you're using.",
    step: "02",
  },
  {
    icon: FileBarChart,
    title: "Review Report",
    description:
      "Get a detailed compatibility report showing which APIs have limited support, with severity levels and exact line numbers.",
    step: "03",
  },
  {
    icon: CheckCircle,
    title: "Fix & Deploy",
    description:
      "Inject polyfills automatically or refactor code based on recommendations. Ship with confidence knowing browser support is covered.",
    step: "04",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-20 md:py-32 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50/20 to-white" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              How It Works
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes with our simple, four-step process
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/50 to-primary/20" />

          <div className="space-y-12 lg:space-y-24">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div
                  className={`flex-1 ${
                    index % 2 === 0 ? "lg:text-right" : "lg:text-left"
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                  >
                    <div
                      className={`flex items-center gap-4 mb-4 ${
                        index % 2 === 0
                          ? "lg:justify-end"
                          : "lg:justify-start"
                      } justify-start`}
                    >
                      <span className="text-5xl font-bold text-primary/20">
                        {step.step}
                      </span>
                      <h3 className="text-2xl font-bold text-foreground">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                </div>

                {/* Icon circle */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="relative z-10 w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl"
                >
                  <step.icon className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                  
                  {/* Pulse animation */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary/30"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>

                {/* Spacer for alternating layout */}
                <div className="flex-1 hidden lg:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
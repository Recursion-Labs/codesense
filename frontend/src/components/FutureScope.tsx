"use client";

import { motion } from "framer-motion";
import { Sparkles, Bot, Users, Workflow, Cloud, Zap, GitBranch, LineChart } from "lucide-react";

const futureFeatures = [
  {
    icon: Bot,
    title: "AI-Powered Suggestions",
    description: "Get intelligent code recommendations and automatic fixes for compatibility issues using advanced AI",
    category: "AI Enhancement",
    status: "Coming Soon",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share compatibility reports, set team-wide browser support policies, and track issues together",
    category: "Collaboration",
    status: "Planned",
  },
  {
    icon: Workflow,
    title: "CI/CD Integration",
    description: "Integrate compatibility checks into your build pipeline with GitHub Actions, GitLab CI, and more",
    category: "DevOps",
    status: "Coming Soon",
  },
  {
    icon: Cloud,
    title: "Cloud Sync & Profiles",
    description: "Sync your settings and compatibility profiles across multiple devices and team members",
    category: "Productivity",
    status: "Planned",
  },
  {
    icon: Zap,
    title: "Real-time Collaboration",
    description: "Live compatibility monitoring with instant notifications when team members introduce breaking changes",
    category: "Collaboration",
    status: "Future",
  },
  {
    icon: GitBranch,
    title: "Branch Comparison",
    description: "Compare compatibility between branches and see compatibility impact of pull requests",
    category: "Version Control",
    status: "Planned",
  },
  {
    icon: LineChart,
    title: "Advanced Analytics",
    description: "Detailed insights, trends, and metrics about your project's browser compatibility over time",
    category: "Analytics",
    status: "Coming Soon",
  },
  {
    icon: Sparkles,
    title: "Custom Baseline Rules",
    description: "Define your own compatibility rules and custom browser support targets for specific projects",
    category: "Customization",
    status: "Future",
  },
];

export default function FutureScope() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Coming Soon":
        return "bg-green-100 text-green-700 border-green-200";
      case "Planned":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Future":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <section id="future-scope" className="py-20 md:py-32 relative overflow-hidden bg-gradient-to-b from-white via-purple-50/30 to-white">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 rounded-full border border-purple-200 mb-6">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">
              What's Next
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Future Roadmap
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Exciting features on the horizon to make your development workflow even more powerful
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {futureFeatures.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mb-3">
                  <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full border ${getStatusColor(feature.status)}`}>
                    {feature.status}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {feature.description}
                </p>
                <div className="text-xs text-primary font-medium">
                  {feature.category}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-muted-foreground mb-6">
            Have a feature request or idea?
          </p>
          <motion.a
            href="https://github.com/Recursion-Labs/codesense/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Share Your Feedback</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
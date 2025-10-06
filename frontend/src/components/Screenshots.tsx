"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Screenshots() {
  return (
    <section id="screenshots" className="py-20 md:py-32 relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white">
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
              See It In Action
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Seamlessly integrated into your VS Code workflow
          </p>
        </motion.div>

        <div className="space-y-16">
          {/* Command Palette Screenshot */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Command Palette Integration
              </h3>
              <p className="text-muted-foreground">
                Access all Codesense features directly from the VS Code command palette
              </p>
            </div>
            <div className="relative aspect-video bg-gray-900">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/Screenshot-2025-10-06-204405-1759775027781.png"
                alt="Codesense Command Palette"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          {/* Compatibility Report Screenshot */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Detailed Compatibility Reports
              </h3>
              <p className="text-muted-foreground">
                Get comprehensive reports with compatibility scores, API usage, and severity levels
              </p>
            </div>
            <div className="relative aspect-video bg-white">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/image-1759775781312.png"
                alt="Codesense Compatibility Report"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          {/* Extension Page Screenshot */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                VS Code Marketplace
              </h3>
              <p className="text-muted-foreground">
                Install with one click from the official VS Code Marketplace
              </p>
            </div>
            <div className="relative aspect-video bg-gray-900">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/Screenshot-2025-10-06-204948-1759775028251.png"
                alt="Codesense VS Code Extension"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
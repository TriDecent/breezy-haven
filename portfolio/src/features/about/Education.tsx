"use client";
import { CUSTOM_VARIANTS } from "@/shared/animation";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

export function Education() {
  return (
    <section className="bg-secondary rounded-2xl py-20 md:py-28">
      <div className="container mx-auto max-w-3xl px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
          Education
        </h2>
        <motion.div
          variants={CUSTOM_VARIANTS.pop}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="mx-auto mt-8 max-w-md"
        >
          <Card className="text-left">
            <CardHeader className="flex flex-row items-start gap-4">
              <div className="bg-primary/10 rounded-lg p-3">
                <GraduationCap className="text-primary h-6 w-6" />
              </div>
              <div className="space-y-1">
                <CardTitle>
                  University of Information Technology (UIT)
                </CardTitle>
                <p className="text-muted-foreground text-sm">
                  Bachelor of Engineering in Computer Networks and
                  Communications
                </p>
                <p className="text-muted-foreground mt-1 text-xs font-medium">
                  Expected Graduation: 2026
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-primary text-sm font-bold">
                Most Recent Semester GPA: 8.97 / 10
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

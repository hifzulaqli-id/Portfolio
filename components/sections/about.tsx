"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Sparkles, Code2, Palette, Video, Mic } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import type { Profile, Education, Skill } from "@/types";

// ── SVG Tech Logos (inline, accurate brand colors) ──────────────────────────
const TechIcons: Record<string, { svg: React.ReactNode; color: string; name: string }> = {
  // Web
  HTML: {
    color: "#E34F26",
    name: "HTML5",
    svg: (
      <svg viewBox="0 0 24 24" fill="#E34F26" className="h-5 w-5">
        <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.239.003.23-2.622L5.48 4.41l.698 8.01h9.126l-.326 3.426-2.974.808-2.974-.808-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/>
      </svg>
    ),
  },
  CSS: {
    color: "#1572B6",
    name: "CSS3",
    svg: (
      <svg viewBox="0 0 24 24" fill="#1572B6" className="h-5 w-5">
        <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z"/>
      </svg>
    ),
  },
  JavaScript: {
    color: "#F7DF1E",
    name: "JavaScript",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <rect width="24" height="24" rx="2" fill="#F7DF1E"/>
        <path d="M6.235 5.772v12.101c0 .74-.364 1.237-1.047 1.237-.584 0-.972-.274-1.345-.798l-1.297 1.205c.674.92 1.61 1.394 2.875 1.394 1.87 0 3.063-1.068 3.063-3.056V5.772H6.235zm7.083 8.551c.538.956 1.296 1.667 2.651 1.667 1.214 0 2.024-.607 2.024-1.463 0-.986-.792-1.343-2.064-1.908l-.698-.298c-2.049-.873-3.41-1.97-3.41-4.284 0-2.135 1.627-3.762 4.167-3.762 1.81 0 3.108.628 4.043 2.273l-2.217 1.423c-.488-.873-.995-1.215-1.826-1.215-.832 0-1.354.527-1.354 1.215 0 .852.527 1.196 1.742 1.727l.698.299c2.417 1.035 3.777 2.088 3.777 4.46 0 2.556-2.007 3.969-4.705 3.969-2.64 0-4.342-1.25-5.17-2.895l2.35-1.208z" fill="#000"/>
      </svg>
    ),
  },
  TypeScript: {
    color: "#3178C6",
    name: "TypeScript",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <rect width="24" height="24" rx="2" fill="#3178C6"/>
        <path d="M13.6 15.4v1.74c.28.14.62.25 1 .32.38.07.79.11 1.22.11.42 0 .82-.04 1.2-.13.38-.09.71-.23.99-.43.28-.2.5-.46.67-.78.17-.32.25-.71.25-1.17 0-.33-.05-.63-.14-.88-.09-.26-.23-.49-.42-.69-.18-.2-.41-.39-.68-.55-.27-.16-.58-.32-.94-.46-.26-.1-.48-.2-.67-.29-.19-.09-.35-.18-.47-.28-.12-.1-.22-.2-.28-.31-.06-.11-.09-.24-.09-.38 0-.13.03-.24.09-.34.06-.1.14-.18.25-.25.11-.07.23-.12.38-.15.15-.03.31-.05.49-.05.13 0 .26.01.41.03.15.02.29.06.43.11.14.05.27.12.39.2.12.08.22.18.3.3V12.4c-.24-.09-.52-.16-.82-.21-.3-.05-.63-.08-.99-.08-.41 0-.8.05-1.18.14-.37.09-.7.24-.98.43-.28.2-.51.45-.67.76-.17.31-.25.68-.25 1.11 0 .54.15.99.44 1.35.29.36.75.67 1.36.91.27.1.51.2.72.3.21.1.38.2.53.31.14.11.26.22.33.35.08.12.12.27.12.43 0 .14-.03.26-.08.37-.05.11-.13.2-.23.28-.1.08-.23.13-.38.17-.15.04-.33.06-.53.06-.34 0-.68-.06-1.01-.18-.33-.12-.63-.31-.9-.56zm-2.73-3.87H13v-1.3H8.2v1.3h1.7v6.27h1.97V11.53z" fill="#fff"/>
      </svg>
    ),
  },
  React: {
    color: "#61DAFB",
    name: "React",
    svg: (
      <svg viewBox="0 0 24 24" fill="#61DAFB" className="h-5 w-5">
        <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.29zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.36-.034-.47 0-.92.013-1.36.034.44-.572.895-1.096 1.36-1.564zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.150-1.315.283-2.015.386.24-.375.48-.762.705-1.158.225-.39.435-.788.634-1.176zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.36.034.47 0 .92-.012 1.36-.034-.44.572-.895 1.095-1.36 1.563-.465-.468-.92-.992-1.36-1.563z"/>
      </svg>
    ),
  },
  "Next.js": {
    color: "#000000",
    name: "Next.js",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <circle cx="12" cy="12" r="12" fill="#000"/>
        <path d="M9.75 7.5v6.37L16.5 7.5h1.5v9h-1.5v-6.37L9.75 16.5 6 10.5v-3h3.75z" fill="#fff"/>
      </svg>
    ),
  },
  "Tailwind CSS": {
    color: "#06B6D4",
    name: "Tailwind CSS",
    svg: (
      <svg viewBox="0 0 24 24" fill="#06B6D4" className="h-5 w-5">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/>
      </svg>
    ),
  },
  "Node.js": {
    color: "#339933",
    name: "Node.js",
    svg: (
      <svg viewBox="0 0 24 24" fill="#339933" className="h-5 w-5">
        <path d="M11.998.016L.686 6.5v13.003l11.312 6.482L23.31 19.5V6.5L11.998.016zM12 4.315l7.967 4.561v9.12L12 22.556l-7.967-4.56v-9.12L12 4.315z"/>
        <path d="M12 7.5l-4.75 2.72v5.56L12 18.5l4.75-2.72V10.22L12 7.5z" fill="#fff"/>
      </svg>
    ),
  },
  Figma: {
    color: "#F24E1E",
    name: "Figma",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <path d="M8 24c2.208 0 4-1.792 4-4v-4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4z" fill="#0ACF83"/>
        <path d="M4 12c0-2.208 1.792-4 4-4h4v8H8c-2.208 0-4-1.792-4-4z" fill="#A259FF"/>
        <path d="M4 4c0-2.208 1.792-4 4-4h4v8H8C5.792 8 4 6.208 4 4z" fill="#F24E1E"/>
        <path d="M12 0h4c2.208 0 4 1.792 4 4s-1.792 4-4 4h-4V0z" fill="#FF7262"/>
        <path d="M20 12c0 2.208-1.792 4-4 4s-4-1.792-4-4 1.792-4 4-4 4 1.792 4 4z" fill="#1ABCFE"/>
      </svg>
    ),
  },
  "Adobe Premiere Pro": {
    color: "#9999FF",
    name: "Premiere Pro",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <rect width="24" height="24" rx="4" fill="#00005B"/>
        <path d="M6 16.5V7.5h3.375c1.875 0 3 .938 3 2.625 0 1.688-1.125 2.813-3 2.813H7.688V16.5H6zm1.688-4.875H9.25c.938 0 1.5-.563 1.5-1.5s-.563-1.5-1.5-1.5H7.688v3zM13.875 16.5V7.5h3.375c1.875 0 3 .938 3 2.625 0 1.688-1.125 2.813-3 2.813H15.563V16.5H13.875zm1.688-4.875H17.125c.938 0 1.5-.563 1.5-1.5s-.563-1.5-1.5-1.5h-1.563v3z" fill="#9999FF"/>
      </svg>
    ),
  },
  "After Effects": {
    color: "#9999FF",
    name: "After Effects",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <rect width="24" height="24" rx="4" fill="#00005B"/>
        <path d="M12 5.25L17.25 18.75H15.375L14.063 15.375H9.938L8.625 18.75H6.75L12 5.25zm0 3.563l-1.688 4.688h3.375L12 8.813zM18.375 9.75c.75 0 1.313.188 1.688.563.375.375.563.938.563 1.688v6.75h-1.688v-6.375c0-.563-.188-.938-.75-.938-.375 0-.75.188-1.125.563v6.75H15.375V9.75h1.688v.563c.375-.375.938-.563 1.313-.563z" fill="#9999FF"/>
      </svg>
    ),
  },
  Photoshop: {
    color: "#31A8FF",
    name: "Photoshop",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <rect width="24" height="24" rx="4" fill="#001E36"/>
        <path d="M6.5 7.5h3.25c.875 0 1.563.25 2.063.75S12.5 9.5 12.5 10.25c0 .813-.25 1.438-.75 1.938-.5.5-1.188.75-2.063.75H8.125V16.5H6.5V7.5zm1.625 4H9.5c.5 0 .875-.125 1.125-.375.25-.25.375-.563.375-.938 0-.375-.125-.688-.375-.938-.25-.25-.625-.375-1.125-.375H8.125V11.5zm6.25-1.5c.438-.25.938-.375 1.5-.375.563 0 1.063.125 1.5.375.438.25.75.625.938 1.063.188.438.313.938.313 1.5v.188h-3.5c.063.563.25.938.563 1.188.313.25.688.375 1.125.375.438 0 .938-.125 1.5-.375v1.313c-.563.25-1.188.375-1.875.375-.75 0-1.375-.188-1.875-.563-.5-.375-.875-.875-1.063-1.5-.188-.625-.25-1.25-.063-1.875.188-.625.5-1.125.938-1.5.438-.375.938-.563 1.5-.563h.248zm-.5 1.938h2.125c0-.375-.125-.688-.313-.938-.188-.25-.5-.375-.875-.375-.375 0-.688.125-.938.375-.25.25-.375.563-.375.938h.376z" fill="#31A8FF"/>
      </svg>
    ),
  },
  Illustrator: {
    color: "#FF9A00",
    name: "Illustrator",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <rect width="24" height="24" rx="4" fill="#330000"/>
        <path d="M12 5.5l4.5 13H15l-1.125-3.375H10.125L9 18.5H7.5L12 5.5zm0 3.25L10.5 13h3L12 8.75zM16.5 9.5c.375-.125.813-.25 1.313-.25s.875.125 1.188.375c.313.25.5.563.5.938 0 .375-.125.688-.375.938-.25.25-.625.375-1.063.375-.125 0-.313 0-.563-.063V13h-1v-3.5zm1 .875v1.313c.188.063.313.063.438.063.563 0 .813-.25.813-.75 0-.438-.25-.688-.688-.688-.188 0-.375.063-.563.063z" fill="#FF9A00"/>
      </svg>
    ),
  },
  CapCut: {
    color: "#000000",
    name: "CapCut",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <rect width="24" height="24" rx="6" fill="#000"/>
        <path d="M7 8.5L12 5l5 3.5v7L12 19l-5-3.5V8.5z" fill="none" stroke="#fff" strokeWidth="1.5"/>
        <circle cx="12" cy="12" r="2.5" fill="#fff"/>
      </svg>
    ),
  },
  Audacity: {
    color: "#0000CC",
    name: "Audacity",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <rect width="24" height="24" rx="4" fill="#0000CC"/>
        <path d="M12 4c-1.1 0-2 .9-2 2v3.5c-1.2.5-2 1.7-2 3s.8 2.5 2 3V18c0 1.1.9 2 2 2s2-.9 2-2v-2.5c1.2-.5 2-1.7 2-3s-.8-2.5-2-3V6c0-1.1-.9-2-2-2zm0 8.5c-.83 0-1.5-.67-1.5-1.5S11.17 9.5 12 9.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="#fff"/>
      </svg>
    ),
  },
  Git: {
    color: "#F05032",
    name: "Git",
    svg: (
      <svg viewBox="0 0 24 24" fill="#F05032" className="h-5 w-5">
        <path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.606-.403-.545-.545-.676-1.342-.396-2.009L7.636 3.67 .45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187"/>
      </svg>
    ),
  },
};

// ── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ── What I Do tags ────────────────────────────────────────────────────────────
const SERVICES_TAGS = [
  { label: "Web Development", icon: Code2, color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  { label: "UI/UX Design", icon: Palette, color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  { label: "Video Editing", icon: Video, color: "bg-pink-500/10 text-pink-600 border-pink-500/20" },
  { label: "Voice Over", icon: Mic, color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
];

// ── Skill Tooltip Item ────────────────────────────────────────────────────────
function SkillIcon({ skill, index }: { skill: Skill; index: number }) {
  const [hovered, setHovered] = useState(false);
  const icon = TechIcons[skill.name];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 10 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.045, ease: "backOut" }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative"
    >
      <motion.div
        whileHover={{ y: -5, scale: 1.12 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="group relative flex h-[60px] w-[60px] cursor-default items-center justify-center rounded-2xl border border-border/60 bg-background/80 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
        title={skill.name}
        style={icon ? { boxShadow: hovered ? `0 8px 24px ${icon.color}30` : undefined } : undefined}
      >
        {icon ? (
          <span className="flex-shrink-0 [&>svg]:!h-8 [&>svg]:!w-8">
            {icon.svg}
          </span>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-[10px] font-black text-primary">
            {skill.name.slice(0, 2).toUpperCase()}
          </div>
        )}
      </motion.div>

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 4, scale: 0.9 }}
        animate={hovered ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 4, scale: 0.9 }}
        transition={{ duration: 0.15 }}
        className="pointer-events-none absolute -top-9 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border/60 bg-popover px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-lg"
      >
        {icon?.name ?? skill.name}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 border-b border-r border-border/60 bg-popover" />
      </motion.div>
    </motion.div>
  );
}

const STATS = [
  { key: "projects_count" as const, label: "Proyek Selesai", suffix: "+", emoji: "🚀", color: "from-violet-500/20 to-violet-500/5", border: "border-violet-500/20", glow: "shadow-violet-500/10", textColor: "text-violet-500" },
  { key: "clients_count" as const, label: "Klien Puas", suffix: "+", emoji: "🤝", color: "from-blue-500/20 to-blue-500/5", border: "border-blue-500/20", glow: "shadow-blue-500/10", textColor: "text-blue-500" },
  { key: "years_experience" as const, label: "Tahun Pengalaman", suffix: "", emoji: "⚡", color: "from-amber-500/20 to-amber-500/5", border: "border-amber-500/20", glow: "shadow-amber-500/10", textColor: "text-amber-500" },
];

export function About({ profile, education = [], skills = [] }: { profile: Profile; education?: Education[]; skills?: Skill[] }) {
  return (
    <section id="tentang" className="relative overflow-hidden section-pad">
      {/* Ambient background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-20 h-[400px] w-[400px] rounded-full bg-primary/6 blur-[100px]" />
        <div className="absolute -right-20 bottom-20 h-[350px] w-[350px] rounded-full bg-violet-500/5 blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'radial-gradient(circle, rgba(136,136,160,0.3) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      </div>

      <div className="container">
        {/* ── Section Heading ── */}
        <SectionHeading
          eyebrow="Tentang Saya"
          title={
            <>
              Menggabungkan{" "}
              <span className="text-primary-strong">logika</span> &{" "}
              <span className="text-primary-strong">kreativitas</span>
            </>
          }
          description="Latar belakang Informatika memberi saya fondasi teknis yang kuat, sementara passion di desain dan konten memungkinkan saya menghadirkan karya yang utuh."
        />

        {/* ── Main two-column grid ── */}
        <div className="grid gap-10 md:grid-cols-2 lg:gap-14">

          {/* ── LEFT COLUMN ── */}
          <ScrollReveal>
            <div className="flex h-full flex-col gap-8">

              {/* Bio card */}
              <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/50 p-7 backdrop-blur-sm">
                {/* Decorative top gradient line */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

                <div className="space-y-4 text-[15px] leading-[1.75] text-muted-foreground">
                  <p>
                    Saya{" "}
                    <span className="font-semibold text-foreground">Hifzul Aqli</span>,
                    mahasiswa Informatika yang nguli di persimpangan antara{" "}
                    <span className="font-medium text-primary">kode</span> dan{" "}
                    <span className="font-medium text-primary">kreativitas</span>.
                    Selama <span className="font-semibold text-foreground">1+ tahun</span> saya bantu
                    UMKM, konten kreator, dan startup kecil mewujudkan ide mereka lewat website,
                    desain iklan Instagram, editing video, dan voice over.
                  </p>
                  <p>
                    Saya percaya karya yang baik lahir dari komunikasi yang jelas,
                    proses yang transparan, dan perhatian terhadap detail. Setiap
                    proyek — <em className="not-italic font-medium text-foreground">sekecil apa pun</em> —
                    saya perlakukan seperti karya profesional.
                  </p>
                </div>

                {/* Service tags */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {SERVICES_TAGS.map((tag) => (
                    <span
                      key={tag.label}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${tag.color}`}
                    >
                      <tag.icon className="h-3 w-3" />
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats cards */}
              <div className="grid grid-cols-3 gap-3">
                {STATS.map((stat, i) => (
                  <motion.div
                    key={stat.key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-b p-5 text-center shadow-lg transition-all duration-300 ${stat.color} ${stat.border} ${stat.glow}`}
                  >
                    <div className="relative z-10">
                      <div className="mb-2 text-2xl">{stat.emoji}</div>
                      <div className={`font-display text-3xl font-black leading-none ${stat.textColor}`}>
                        <AnimatedCounter target={profile[stat.key] as number} suffix={stat.suffix} />
                      </div>
                      <div className="mt-1.5 text-[11px] font-medium text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                    {/* Bottom accent line */}
                    <div className={`absolute inset-x-4 bottom-0 h-0.5 rounded-full opacity-0 transition-opacity group-hover:opacity-100 ${stat.textColor} bg-current`} />
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* ── RIGHT COLUMN: Tech Stack ── */}
          <ScrollReveal delay={0.12}>
            <div className="relative flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/50 p-7 backdrop-blur-sm">
              {/* Decorative top gradient line */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-display text-sm font-bold uppercase tracking-[0.15em] text-foreground">
                    Tech Stack & Tools
                  </h3>
                </div>
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary ring-1 ring-primary/20"
                >
                  {skills.length} tools
                </motion.span>
              </div>

              {/* Icons grid */}
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, i) => (
                  <SkillIcon key={skill.id} skill={skill} index={i} />
                ))}

                {skills.length === 0 && (
                  <p className="text-sm text-muted-foreground">Belum ada skill ditambahkan.</p>
                )}
              </div>

              {/* Footer hint */}
              <div className="mt-6 flex items-center gap-2 border-t border-border/40 pt-4">
                <div className="flex -space-x-1">
                  {["bg-blue-400", "bg-purple-400", "bg-pink-400", "bg-emerald-400"].map((c, idx) => (
                    <div key={idx} className={`h-2 w-2 rounded-full ${c} ring-1 ring-card`} />
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Hover ikon untuk melihat nama tool
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

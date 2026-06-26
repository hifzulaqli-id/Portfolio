// One-off asset generator. Run: node scripts/gen-placeholders.mjs
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, "..", "public", "images");

function make(file, { label, sub, emoji, c1, c2 }) {
  const svg = `<svg width="1200" height="900" viewBox="0 0 1200 900" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="900" gradientUnits="userSpaceOnUse">
      <stop stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#F0F0F5" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="900" fill="#0A0A0F"/>
  <rect width="1200" height="900" fill="url(#grid)"/>
  <rect x="80" y="80" width="1040" height="740" rx="24" fill="url(#bg)" opacity="0.18"/>
  <text x="600" y="430" font-size="180" text-anchor="middle">${emoji}</text>
  <text x="600" y="560" font-family="Space Grotesk, sans-serif" font-size="64" font-weight="700" fill="#F0F0F5" text-anchor="middle">${label}</text>
  <text x="600" y="620" font-family="Inter, sans-serif" font-size="28" fill="#8888A0" text-anchor="middle">${sub}</text>
</svg>`;
  writeFileSync(join(out, file), svg.trim());
  console.log("wrote", file);
}

make("project-web-1.svg", { label: "Web Dev", sub: "Company Profile", emoji: "🌐", c1: "#6C63FF", c2: "#3B82F6" });
make("project-web-2.svg", { label: "Web App", sub: "Task Management", emoji: "⚡", c1: "#3B82F6", c2: "#6C63FF" });
make("project-design-1.svg", { label: "Design Ads", sub: "Instagram Feed", emoji: "🎨", c1: "#EC4899", c2: "#6C63FF" });
make("project-design-2.svg", { label: "Carousel", sub: "Streetwear", emoji: "👗", c1: "#F59E0B", c2: "#EC4899" });
make("project-video-1.svg", { label: "Video Edit", sub: "Cinematic Ad", emoji: "🎬", c1: "#F97316", c2: "#EF4444" });
make("project-voice-1.svg", { label: "Voice Over", sub: "Course Narration", emoji: "🎙", c1: "#8B5CF6", c2: "#6C63FF" });
make("gallery-1.svg", { label: "Detail", sub: "Screenshot 1", emoji: "🖼", c1: "#6C63FF", c2: "#00D4AA" });
make("gallery-2.svg", { label: "Detail", sub: "Screenshot 2", emoji: "📊", c1: "#00D4AA", c2: "#6C63FF" });
make("gallery-3.svg", { label: "Detail", sub: "Screenshot 3", emoji: "✨", c1: "#6C63FF", c2: "#EC4899" });

// OG image (1200x630)
const og = `<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop stop-color="#6C63FF"/><stop offset="1" stop-color="#00D4AA"/>
    </linearGradient>
    <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.5" fill="#8888A0" fill-opacity="0.18"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="#0A0A0F"/>
  <rect width="1200" height="630" fill="url(#dots)"/>
  <rect x="60" y="60" width="1080" height="510" rx="28" fill="url(#g)" opacity="0.12"/>
  <text x="80" y="270" font-family="Space Grotesk, sans-serif" font-size="80" font-weight="700" fill="#F0F0F5">Budi Santoso</text>
  <text x="84" y="350" font-family="Inter, sans-serif" font-size="32" fill="#8888A0">Mahasiswa Informatika · Web Developer · Creative Designer</text>
  <text x="84" y="480" font-family="Inter, sans-serif" font-size="24" fill="url(#g)">🌐 Web Dev    🎨 Design Ads    🎬 Video    🎙 Voice Over</text>
</svg>`;
writeFileSync(join(out, "og-image.svg"), og.trim());
console.log("wrote og-image.svg");

// Blog covers (1200x750)
make("blog-1.svg", { label: "Next.js Tips", sub: "Web Development", emoji: "⚡", c1: "#6C63FF", c2: "#00D4AA" });
make("blog-2.svg", { label: "Video Workflow", sub: "Video Editing", emoji: "🎬", c1: "#F97316", c2: "#EF4444" });
make("blog-3.svg", { label: "Feed Design", sub: "Design", emoji: "🎨", c1: "#EC4899", c2: "#6C63FF" });

// Certificates (landscape 1200x850)
make("cert-1.svg", { label: "Certificate", sub: "Verified Achievement", emoji: "🎓", c1: "#6C63FF", c2: "#3B82F6" });
make("cert-2.svg", { label: "Certificate", sub: "Verified Achievement", emoji: "🏅", c1: "#00D4AA", c2: "#6C63FF" });
make("cert-3.svg", { label: "Certificate", sub: "Verified Achievement", emoji: "🏆", c1: "#F59E0B", c2: "#EC4899" });

// Generic logo placeholder (square 200x200)
const logoSvg = (initial) => `<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="lg" x1="0" y1="0" x2="200" y2="200"><stop stop-color="#6C63FF"/><stop offset="1" stop-color="#00D4AA"/></linearGradient></defs>
  <rect width="200" height="200" rx="40" fill="#13131A"/>
  <rect x="4" y="4" width="192" height="192" rx="36" fill="none" stroke="url(#lg)" stroke-width="2" opacity="0.5"/>
  <text x="100" y="120" font-family="Space Grotesk, sans-serif" font-size="84" font-weight="700" fill="url(#lg)" text-anchor="middle">${initial}</text>
</svg>`;
writeFileSync(join(out, "logo-default.svg"), logoSvg("L").trim());

console.log("done");

import Link from "next/link";
import { Instagram, Linkedin, Github, Sparkles } from "lucide-react";
import type { Profile, NavItem } from "@/types";

interface FooterProps {
  profile: Profile;
  navItems?: NavItem[];
}

export function Footer({ profile, navItems = [] }: FooterProps) {
  const year = new Date().getFullYear();
  const col1 = navItems.filter((n) => n.location === "footer-col-1");
  const col2 = navItems.filter((n) => n.location === "footer-col-2");
  return (
    <footer className="relative border-t border-border bg-background">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="font-display text-base font-bold">
              {profile.full_name}
            </span>
          </Link>
          <p className="max-w-sm text-sm text-muted-foreground">
            {profile.tagline}. Membantu mewujudkan ide Anda lewat web, desain,
            video, dan suara.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="mb-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Jelajahi
            </h4>
            <ul className="flex flex-col gap-2 text-sm">
              {col1.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    target={item.open_in_new_tab ? "_blank" : undefined}
                    rel={item.open_in_new_tab ? "noopener noreferrer" : undefined}
                    className="text-muted-foreground hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Tentang
            </h4>
            <ul className="flex flex-col gap-2 text-sm">
              {col2.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    target={item.open_in_new_tab ? "_blank" : undefined}
                    rel={item.open_in_new_tab ? "noopener noreferrer" : undefined}
                    className="text-muted-foreground hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h4 className="mb-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Sosial
          </h4>
          <div className="flex gap-3">
            {profile.instagram_url && (
              <SocialLink href={profile.instagram_url} label="Instagram">
                <Instagram className="h-5 w-5" />
              </SocialLink>
            )}
            {profile.linkedin_url && (
              <SocialLink href={profile.linkedin_url} label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </SocialLink>
            )}
            {profile.github_url && (
              <SocialLink href={profile.github_url} label="GitHub">
                <Github className="h-5 w-5" />
              </SocialLink>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-border py-5">
        <div className="container flex items-center justify-center text-xs text-muted-foreground">
          <p>© {year} {profile.full_name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary"
    >
      {children}
    </a>
  );
}

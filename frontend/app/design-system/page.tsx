"use client";

import { useTheme } from "@/components/theme-provider";

export default function DesignSystemPreviewPage() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const brandColors = [
    { name: "Navy Dark", class: "bg-brand-navy", text: "text-white", token: "var(--brand-navy)" },
    { name: "Navy Mid", class: "bg-brand-navy-mid", text: "text-white", token: "var(--brand-navy-mid)" },
    { name: "Primary Blue", class: "bg-brand-blue", text: "text-white", token: "var(--brand-blue)" },
    { name: "Blue Light", class: "bg-brand-blue-light", text: "text-white", token: "var(--brand-blue-light)" },
    { name: "Cyan Accent", class: "bg-brand-cyan", text: "text-gray-900", token: "var(--brand-cyan)" },
    { name: "Cyan Light", class: "bg-brand-cyan-light", text: "text-gray-900", token: "var(--brand-cyan-light)" },
    { name: "White", class: "bg-white", text: "text-gray-900 border border-gray-200", token: "var(--white)" },
  ];

  const grayColors = [
    { name: "Gray 50", class: "bg-gray-50", text: "text-gray-900", token: "var(--gray-50)" },
    { name: "Gray 100", class: "bg-gray-100", text: "text-gray-900", token: "var(--gray-100)" },
    { name: "Gray 200", class: "bg-gray-200", text: "text-gray-900", token: "var(--gray-200)" },
    { name: "Gray 300", class: "bg-gray-300", text: "text-gray-900", token: "var(--gray-300)" },
    { name: "Gray 500", class: "bg-gray-500", text: "text-white", token: "var(--gray-500)" },
    { name: "Gray 700", class: "bg-gray-700", text: "text-white", token: "var(--gray-700)" },
    { name: "Gray 900", class: "bg-gray-900", text: "text-white", token: "var(--gray-900)" },
  ];

  const semanticColors = [
    { name: "Success", class: "bg-semantic-success", text: "text-white", token: "var(--color-success)" },
    { name: "Warning", class: "bg-semantic-warning", text: "text-gray-900", token: "var(--color-warning)" },
    { name: "Danger", class: "bg-semantic-danger", text: "text-white", token: "var(--color-danger)" },
    { name: "Info", class: "bg-semantic-info", text: "text-white", token: "var(--color-info)" },
  ];

  const surfaceColors = [
    { name: "Background", class: "bg-background", text: "text-foreground border border-border", token: "background" },
    { name: "Card", class: "bg-card", text: "text-foreground border border-border", token: "card" },
    { name: "Muted", class: "bg-muted", text: "text-muted-foreground", token: "muted" },
    { name: "Border", class: "bg-border", text: "text-foreground", token: "border" },
  ];

  const spacingTokens = [
    { label: "0.5", px: "2px", widthClass: "w-0.5" },
    { label: "1", px: "4px", widthClass: "w-1" },
    { label: "1.5", px: "6px", widthClass: "w-1.5" },
    { label: "2", px: "8px", widthClass: "w-2" },
    { label: "3", px: "12px", widthClass: "w-3" },
    { label: "4", px: "16px", widthClass: "w-4" },
    { label: "6", px: "24px", widthClass: "w-6" },
    { label: "8", px: "32px", widthClass: "w-8" },
    { label: "12", px: "48px", widthClass: "w-12" },
    { label: "16", px: "64px", widthClass: "w-16" },
    { label: "24", px: "96px", widthClass: "w-24" },
  ];

  const radiusTokens = [
    { label: "sm (6px)", class: "rounded-sm" },
    { label: "md (10px)", class: "rounded-md" },
    { label: "lg (14px)", class: "rounded-lg" },
    { label: "xl (20px)", class: "rounded-xl" },
    { label: "full (9999px)", class: "rounded-full" },
  ];

  const shadowTokens = [
    { label: "shadow-sm", class: "shadow-sm" },
    { label: "shadow-md", class: "shadow-md" },
    { label: "shadow-lg", class: "shadow-lg" },
    { label: "shadow-brand", class: "shadow-brand border-brand-blue/20" },
  ];

  return (
    <div className="min-h-screen bg-background p-8 text-foreground transition-colors duration-200">
      <div className="mx-auto max-w-6xl space-y-16">
        {/* Header & Theme Controls */}
        <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-h1">Design System</h1>
            <p className="text-body text-muted-foreground">
              Tech Tians Academy token preview & living styleguide
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-1.5">
            <span className="px-3 text-caption text-muted-foreground">
              Theme: {theme} ({resolvedTheme})
            </span>
            {(["light", "dark", "system"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`rounded-md px-3 py-1 text-caption font-medium capitalize transition-colors ${
                  theme === t
                    ? "bg-brand-blue text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </header>

        {/* 1. Color Palette */}
        <section className="space-y-6">
          <div className="border-b border-border pb-2">
            <h2 className="text-h2">1. Colors</h2>
            <p className="text-body-sm text-muted-foreground">
              Brand, gray, semantic, and dynamic theme surface tokens
            </p>
          </div>

          {/* Brand Colors */}
          <div className="space-y-3">
            <h3 className="text-h4">Brand Palette</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
              {brandColors.map((color) => (
                <div
                  key={color.name}
                  className="flex flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm"
                >
                  <div className={`h-20 w-full ${color.class}`} />
                  <div className="p-3">
                    <div className="text-body-sm font-semibold">{color.name}</div>
                    <div className="text-caption text-muted-foreground font-mono">{color.token}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grays */}
          <div className="space-y-3">
            <h3 className="text-h4">Grays</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
              {grayColors.map((color) => (
                <div
                  key={color.name}
                  className="flex flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm"
                >
                  <div className={`h-20 w-full ${color.class}`} />
                  <div className="p-3">
                    <div className="text-body-sm font-semibold">{color.name}</div>
                    <div className="text-caption text-muted-foreground font-mono">{color.token}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Semantic Colors */}
          <div className="space-y-3">
            <h3 className="text-h4">Semantic Tokens</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {semanticColors.map((color) => (
                <div
                  key={color.name}
                  className="flex flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm"
                >
                  <div className={`h-20 w-full ${color.class}`} />
                  <div className="p-3">
                    <div className="text-body-sm font-semibold">{color.name}</div>
                    <div className="text-caption text-muted-foreground font-mono">{color.token}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Surface Tokens */}
          <div className="space-y-3">
            <h3 className="text-h4">Theme Surfaces</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {surfaceColors.map((color) => (
                <div
                  key={color.name}
                  className="flex flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm"
                >
                  <div className={`h-20 w-full ${color.class}`} />
                  <div className="p-3">
                    <div className="text-body-sm font-semibold">{color.name}</div>
                    <div className="text-caption text-muted-foreground font-mono">{color.token}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2. Typography Scale */}
        <section className="space-y-6">
          <div className="border-b border-border pb-2">
            <h2 className="text-h2">2. Typography</h2>
            <p className="text-body-sm text-muted-foreground">
              Inter for interface text, JetBrains Mono for code
            </p>
          </div>

          <div className="space-y-6 rounded-lg border border-border bg-card p-6">
            <div className="border-b border-border pb-4">
              <div className="text-caption font-mono text-muted-foreground">text-display (3.5rem / 800)</div>
              <div className="text-display">Tech Tians Academy</div>
            </div>

            <div className="border-b border-border pb-4">
              <div className="text-caption font-mono text-muted-foreground">text-h1 (2.5rem / 700)</div>
              <div className="text-h1">Heading 1 — Next Gen Learning</div>
            </div>

            <div className="border-b border-border pb-4">
              <div className="text-caption font-mono text-muted-foreground">text-h2 (2rem / 700)</div>
              <div className="text-h2">Heading 2 — Structured Curriculum</div>
            </div>

            <div className="border-b border-border pb-4">
              <div className="text-caption font-mono text-muted-foreground">text-h3 (1.5rem / 600)</div>
              <div className="text-h3">Heading 3 — Interactive Practice Modules</div>
            </div>

            <div className="border-b border-border pb-4">
              <div className="text-caption font-mono text-muted-foreground">text-h4 (1.25rem / 600)</div>
              <div className="text-h4">Heading 4 — Developer Tools & Workflows</div>
            </div>

            <div className="border-b border-border pb-4">
              <div className="text-caption font-mono text-muted-foreground">text-body-lg (1.125rem / 400)</div>
              <div className="text-body-lg">
                Body Large — Lead paragraphs and prominent section intros that require extra presence and clarity.
              </div>
            </div>

            <div className="border-b border-border pb-4">
              <div className="text-caption font-mono text-muted-foreground">text-body (1rem / 400)</div>
              <div className="text-body">
                Body — Standard paragraph text used across descriptions, lessons, card bodies, and general user interfaces.
              </div>
            </div>

            <div className="border-b border-border pb-4">
              <div className="text-caption font-mono text-muted-foreground">text-body-sm (0.875rem / 400)</div>
              <div className="text-body-sm">
                Body Small — Secondary descriptions, captions, list metadata, and sub-labels.
              </div>
            </div>

            <div className="border-b border-border pb-4">
              <div className="text-caption font-mono text-muted-foreground">text-caption (0.75rem / 500)</div>
              <div className="text-caption">
                Caption — Microcopy, timestamp badges, auxiliary labels, and fine print.
              </div>
            </div>

            <div>
              <div className="text-caption font-mono text-muted-foreground">font-mono (JetBrains Mono)</div>
              <pre className="mt-2 rounded-md bg-muted p-4 font-mono text-body-sm text-foreground">
                <code>{`const techTians = new Academy({
  mission: "Empower next-gen builders",
  stack: ["Next.js 14", "TypeScript", "Tailwind CSS"],
});`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 3. Spacing Scale */}
        <section className="space-y-6">
          <div className="border-b border-border pb-2">
            <h2 className="text-h2">3. Spacing Scale</h2>
            <p className="text-body-sm text-muted-foreground">
              4px base grid system
            </p>
          </div>

          <div className="space-y-3 rounded-lg border border-border bg-card p-6">
            {spacingTokens.map((step) => (
              <div key={step.label} className="flex items-center gap-4">
                <div className="w-20 font-mono text-caption text-muted-foreground">
                  {step.label} ({step.px})
                </div>
                <div className={`h-4 bg-brand-blue rounded-sm ${step.widthClass}`} />
              </div>
            ))}
          </div>
        </section>

        {/* 4. Radius Scale */}
        <section className="space-y-6">
          <div className="border-b border-border pb-2">
            <h2 className="text-h2">4. Radius Scale</h2>
            <p className="text-body-sm text-muted-foreground">
              Corner radiuses from sharp indicators to pill shapes
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {radiusTokens.map((r) => (
              <div
                key={r.label}
                className={`flex h-28 items-center justify-center border-2 border-brand-blue bg-muted p-4 text-center text-body-sm font-medium ${r.class}`}
              >
                {r.label}
              </div>
            ))}
          </div>
        </section>

        {/* 5. Shadow Scale */}
        <section className="space-y-6">
          <div className="border-b border-border pb-2">
            <h2 className="text-h2">5. Shadow Scale</h2>
            <p className="text-body-sm text-muted-foreground">
              Elevation levels including brand-tinted glow
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {shadowTokens.map((s) => (
              <div
                key={s.label}
                className={`flex h-32 flex-col items-center justify-center rounded-lg border border-border bg-card p-4 text-center ${s.class}`}
              >
                <div className="font-mono text-body-sm font-semibold">{s.label}</div>
                <div className="mt-1 text-caption text-muted-foreground">Elevation token</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

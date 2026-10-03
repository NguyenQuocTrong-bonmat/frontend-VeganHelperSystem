VeganHelper — Master Design System
Project: VeganHelper
Design Theme: Botanical Glassmorphism — A Living Garden
Platform: Responsive Web Application
Frontend: React (existing project stack)
Design Reference: [UI UX Pro Max Skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
Status: Approved design direction — implementation pending

1. Design Philosophy
1.1 Core Concept
VeganHelper is a plant-based recipe-sharing platform designed around the idea of a living garden.
The interface should combine:
Botanical: Natural greens, organic shapes, plant-inspired colors.
Glassmorphism: Frosted glass surfaces, subtle transparency, soft blur.
Modern: Clean layouts, consistent spacing, smooth interactions.
Premium: Refined typography, quality food imagery, balanced visual hierarchy.
Friendly: Approachable, accessible, and easy to navigate.

1.2 Design Principles
Content and food photography are the main focus.
Use glass effects selectively instead of applying blur to every element.
Prioritize readability and usability over decoration.
Maintain consistent design patterns across all pages.
Keep animations subtle and purposeful.
Preserve the existing business logic and API integrations.
Design mobile-first while supporting desktop layouts.

1.3 Visual Identity
Brand personality:
Fresh
Natural
Calm
Welcoming
Contemporary

Visual keywords:
Botanical · Organic · Glassmorphism · Forest Green · Soft Gradient · Natural Light · Elegant · Clean UI

2. UI UX Pro Max Integration
Reference repository:
[https://github.com/nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)

2.1 Required Workflow
Use UI UX Pro Max as a design intelligence and validation tool, not as a replacement for the approved VeganHelper design direction.
Before implementation:
Check whether UI UX Pro Max is installed and available in Antigravity.
If available, use its design system generation and relevant UI/UX guidance.
Review recommendations for:
Recipe and food-related product patterns
Glassmorphism
Color palettes
Typography pairings
React implementation
UX and accessibility
Compare its recommendations against this MASTER.md.
Preserve the approved Botanical Glassmorphism identity.
Document any important conflicts or suggested changes before modifying the design direction.
Do not install additional tools or dependencies without approval.

2.2 Design Priority
When recommendations conflict, follow this priority:
Existing functional requirements and API contracts.
This approved MASTER.md.
Project-specific UX requirements.
UI UX Pro Max recommendations.
General design conventions.
Do not blindly apply generated design recommendations if they conflict with the project requirements.

2.3 Design System Persistence
Use this file as the global source of truth.
For future page-specific design documents, use:
design-system/
└── veganhelper/
    ├── MASTER.md
    └── pages/
        ├── home.md
        ├── my-posts.md
        ├── post-detail.md
        └── recipe-form.md

Page-specific documents may add details but must not redefine global tokens without approval.

3. Color System
3.1 Primary Palette
Token | Hex | Usage
Forest Green | #244C38 | Primary brand color, main buttons
Sage Green | #A8BDA2 | Secondary accents, icons
Mint | #DDF2E1 | Soft highlights, secondary backgrounds
Cream | #FAF8F0 | Main page background
Glass White | rgba(255,255,255,0.65) | Glass surfaces
Warm Gold | #D6B66A | Limited decorative accents

3.2 Semantic Colors
Token | Suggested value | Usage
Text Primary | #26342B | Main text
Text Secondary | #667568 | Supporting text
Border | #DCE5D9 | Standard borders
Success | #347A50 | Success feedback
Warning | #A66A19 | Warning feedback
Error | #B54747 | Errors and destructive actions
Surface | #FFFFFF | Standard cards and form fields

Semantic colors must remain distinguishable from decorative brand colors.
Do not use color alone to communicate error, success, or selected states.

3.3 Gradient System
Use natural, low-contrast gradients.
Hero gradient:
linear-gradient( 135deg, #DDF2E1 0%, #A8BDA2 55%, #FAF8F0 100% );
Soft background glow:
radial-gradient( circle at 20% 20%, rgba(168, 189, 162, 0.28), transparent 60% );
Glass surface:
rgba(255, 255, 255, 0.65);

Avoid neon colors, excessive saturation, and strong gradients behind text.

4. Typography
4.1 Font Direction
Preferred pairing:
Headings: DM Serif Display
Body and UI: DM Sans

Alternative pairing:
Headings: Playfair Display
Body and UI: Inter

Before implementation, inspect the existing project's fonts and assets. Reuse available assets when appropriate.

4.2 Type Scale
Element | Desktop | Mobile | Weight
Hero heading | 48–64px | 34–42px | 600
Page heading | 36–44px | 28–34px | 600
Section heading | 24–30px | 22–26px | 600
Card heading | 18–22px | 18–20px | 600
Body | 16px | 16px | 400
Supporting text | 14px | 14px | 400
Metadata | 12–13px | 12–13px | 500

Use responsive typography and allow natural text wrapping.
Avoid excessively small text and long lines that reduce readability.

5. Layout and Spacing
5.1 Spacing Scale
Use a consistent 4px-based spacing system.
Token | Value
space-1 | 4px
space-2 | 8px
space-3 | 12px
space-4 | 16px
space-5 | 20px
space-6 | 24px
space-8 | 32px
space-10 | 40px
space-12 | 48px
space-16 | 64px
space-20 | 80px

5.2 Container
Maximum content width: approximately 1280px.
Desktop horizontal padding: 32–48px.
Tablet horizontal padding: 24px.
Mobile horizontal padding: 16px.
Keep consistent alignment between page headings, content grids, and navigation.

5.3 Border Radius
Component | Radius
Small controls | 10px
Buttons and inputs | 12px
Standard cards | 18px
Large feature cards | 24px
Modal | 24px
Pills and chips | 999px

Use consistent radii rather than arbitrary values.

6. Glassmorphism System
6.1 Glass Surface
Use glassmorphism for selected high-level UI elements:
Navigation surfaces
Search panels
Featured cards
Floating controls
Modal backdrops and overlays

Suggested CSS:
.glass-surface { background: rgba(255, 255, 255, 0.65); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.7); box-shadow: 0 8px 32px rgba(36, 76, 56, 0.08); }

6.2 Glass Rules
Maintain sufficient text contrast.
Do not place important text over visually busy backgrounds.
Provide a solid or near-solid fallback when backdrop blur is unavailable.
Avoid stacking many translucent surfaces.
Do not use heavy blur on every recipe card.
Keep form inputs visually clear and easy to identify.
Glassmorphism is a visual enhancement, not a usability requirement.

7. Component Guidelines
7.1 Buttons
Primary button: Forest Green background, White text, 12px radius, Clear hover and focus states
Secondary button: Light or transparent surface, Forest Green text, Subtle border
Destructive button: Clearly distinguishable error color, Used only for destructive actions such as delete
Interaction: Transition duration: approximately 180–250ms, Subtle hover color or elevation changes, Visible keyboard focus, Disabled state must be visually and distinct

7.2 Recipe Cards
Recipe cards should include: Food image, Recipe title, Optional category, Relevant preparation metadata, Optional author information, Relevant actions
Visual rules: Use consistent image aspect ratios. Use object-fit cover for food imagery. Apply rounded corners. Keep information hierarchy clear. Use subtle image zoom on hover. Ensure the entire card is not accidentally clickable when it contains separate interactive actions.

7.3 Search
Rounded search container. Clear search icon and placeholder. Visible focus state. Optional glass surface. Search input must remain accessible on mobile. Do not rely on placeholder text as the only label.

7.4 Category Chips
Rounded pill style. Sage or Mint for inactive states. Forest Green for active states. Clear selected state. Support wrapping on narrow screens. Preserve existing filter behavior.

7.5 Forms
Use consistent form patterns for Create Post and Edit Post. Group related fields. Provide visible labels. Use clear validation messages. Show upload previews when supported. Keep submit and cancel actions easy to find. Preserve user input when an API request fails. Provide loading and disabled states during submission. Never show a successful save state if the API request fails.

7.6 Modals
Rounded surface. Subtle shadow. Optional background blur. Clear title and action hierarchy. Close behavior must be predictable. Destructive confirmation must explain the action. Support keyboard focus and Escape where appropriate.

8. Motion and Interaction
8.1 Motion Principles
Animations should communicate state and provide feedback.
Use: Fade-in for content appearance. Small vertical movement for entrance transitions. Subtle card elevation on hover. Image zoom for recipe cards. Smooth transitions for tabs and category filters. Lightweight modal transitions.
Avoid: Excessive parallax. Constant floating animations. Long transitions. Large motion that delays interaction. Animations that cause layout shifts.

8.2 Motion Tokens
Token | Duration | Usage
motion-fast | 150ms | Small control feedback
motion-normal | 220ms | Buttons, cards, chips
motion-slow | 350ms | Modal and section transitions
Suggested easing: cubic-bezier(0.2, 0.8, 0.2, 1)

8.3 Reduced Motion
Respect: @media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; } }

9. Page Design Direction
9.1 Home Feed
Concept: A Living Garden
Layout: Main navigation, Hero section, Search panel, Category filters, Featured recipes, Recipe feed, Optional promotional or informational section
Visual direction: Soft green gradient background. Large editorial heading. Clear search panel. Recipe cards with natural food photography. Generous whitespace. Responsive recipe grid.

9.2 Category Filter
Concept: Explore Naturally
Layout: Category navigation or chips. Selected category state. Recipe results. Empty state when no recipes match.
Requirements: Preserve existing category filtering logic. Make active filters obvious. Allow users to change or clear filters easily. Keep the layout compact and responsive.

9.3 Post Detail
Concept: Recipe Story
Layout: Recipe cover image, Title and metadata, Author information, Description, Ingredients, Cooking steps, Relevant actions
Visual direction: Large food image. Calm content layout. Clear distinction between ingredients and steps. Comfortable reading width. Optional glass metadata panel. Do not sacrifice readability for decorative effects.

9.4 Create Post
Concept: Recipe Studio
Layout: Page heading and short introduction. Recipe information. Category and dietary details. Preparation and cooking times. Media upload and preview. Ingredients editor. Cooking steps editor. Form actions.
Visual direction: Structured form sections. Clear input hierarchy. Light surfaces and subtle borders. Optional progress or section indicators only if they improve usability.
Requirements: Preserve the existing API payload and validation contract. Do not rename or remove required fields without confirming the backend contract. Display meaningful API errors. Avoid fake success behavior.

9.5 Edit Post
Concept: Refine Your Recipe
Reuse the Create Post visual system.
Requirements: Populate the form with the correct post data. Distinguish loading, error, and ready states. Preserve edits when submission fails. Keep cancel and save actions clear. Never send mock post IDs to the real backend. Do not claim a successful update if the API request fails.

9.6 My Posts
Concept: My Recipe Garden
Layout: Page heading. Optional summary statistics if backed by real data. Recipe management cards. Edit and delete actions. Empty state.
Visual direction: Organized dashboard layout. Consistent recipe cards. Clear separation between viewing and management actions. Confirmation dialog for deletion.
Requirements: Distinguish real posts from mock data. Do not show fabricated statistics as real user data. Preserve existing API integration and error handling.

10. Responsive Design
Support these target viewport widths:
Small mobile 375px
Large mobile 430px
Tablet 768px
Laptop 1024px
Desktop 1440px
Responsive requirements: No horizontal overflow. Navigation adapts to narrow screens. Recipe grids reduce columns naturally. Forms remain usable on mobile. Buttons and controls have adequate touch targets. Text and chips wrap without clipping. Modals fit within the viewport. Images maintain suitable aspect ratios.

11. Accessibility
Follow practical WCAG-oriented accessibility principles. Maintain at least 4.5:1 contrast for normal text where applicable. Provide visible keyboard focus. Use semantic HTML elements. Add accessible labels to form controls. Provide meaningful alternative text for informative images. Hide purely decorative images from assistive technologies when appropriate. Ensure buttons and interactive cards are keyboard accessible. Do not communicate state through color alone. Respect reduced-motion preferences. Ensure errors are identifiable and understandable.

12. Imagery and Assets
12.1 Image Direction
Use high-quality plant-based food photography.
Preferred: Natural lighting, Fresh ingredients, Realistic food presentation, Earthy backgrounds, Clean composition, Consistent image treatment.
Avoid: Unrelated stock photography, Non-food imagery in recipe cards, Visually inconsistent image styles, Distorted or misleading food images.

12.2 Asset Handling
Before creating new assets: Inspect existing project assets. Reuse relevant images, fonts, icons, and logos. Identify missing assets. Propose suitable replacements when necessary. Avoid deleting or replacing existing assets without approval. Do not invent official logos or brand assets.

13. Technical Constraints
This project is an existing React application.
Implementation rules: Work only in the approved UI redesign branch. Do not modify the backend repository. Do not rewrite authentication. Preserve existing API contracts. Reuse working business logic. Avoid unnecessary dependencies. Do not replace real API behavior with mock success. Keep changes focused on the approved redesign scope. Do not delete existing functionality merely to simplify the UI. Run the available build and relevant regression checks after each implementation phase. If an existing implementation conflicts with the design, change the presentation layer first. Escalate functional changes for approval.

14. Design Anti-Patterns
Avoid: Excessive glassmorphism on every component. Low-contrast text on translucent surfaces. Overly saturated green backgrounds. Neon gradients. Excessive shadows and glow. Unnecessary animations. Inconsistent border radii. Too many font families. Dense layouts with little whitespace. Decorative elements that interfere with content. Fake loading or success feedback. Fake statistics presented as real data. Non-functional buttons. Unrelated or placeholder images left in the final UI. Desktop-only layouts. Unapproved changes to existing functionality.

15. Implementation Phases
Phase 0 — Design System Validation (Current phase)
Phase 1 — Global Design Foundation
Phase 2 — Home Feed
Phase 3 — My Posts and Post Detail
Phase 4 — Create and Edit
Phase 5 — Polish and Regression

16. Final Quality Checklist
Visual Consistency, Interaction, Responsive, Functionality

17. Source of Truth
This document is the approved global design specification for VeganHelper.
Final design direction: Botanical Glassmorphism — A Living Garden.

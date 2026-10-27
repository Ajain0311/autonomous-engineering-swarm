# UI/UX Quality Gate & Design Standards

This document establishes the UI/UX standards and verification gate enforced by the **UI/UX Design Engineer**.

---

## 1. Design Reference & Philosophy

1. **Google-Inspired Visual Clarity**:
   - Clean, uncluttered layout with deliberate negative space.
   - High typographic hierarchy: primary titles, subheadings, labels, and helper text have unambiguous visual distinction.
   - Purposeful color application: vibrant accents for primary actions, subtle neutrals for layout chrome.
2. **Rapido-Inspired Speed & Usability**:
   - Frictionless workflows: minimum clicks to achieve the user's primary goal.
   - Immediate visual feedback on every tap, click, or state change.
   - Prominent primary action button (FAB or full-width bottom bar on mobile).
   - Touch-first ergonomics: minimum 44x44px touch targets on mobile viewports.

---

## 2. Mandatory State Matrix

Every new screen, tab, modal, or form must provide explicit implementations for:

| State | Purpose & Requirements |
|---|---|
| **Loading** | Skeleton loaders or non-blocking spinners matching component dimensions. |
| **Empty** | Helpful message, contextual illustration or icon, and a clear call-to-action (CTA) to populate data. |
| **Success** | Non-intrusive toast notifications or inline state transitions confirming completion. |
| **Error** | Plain-language error messages explaining what went wrong and how to recover, plus a retry button. |
| **Forbidden (403)** | Explains insufficient permissions and offers contact/request-access or redirect options. |

---

## 3. UI/UX Verification Checklist

Before marking any UI/UX or frontend task complete, verify:
- [ ] Navigation is predictable and breadcrumbs / active tab indicators are accurate.
- [ ] Primary actions are visually distinct from secondary/destructive actions.
- [ ] Form controls have inline validation, clear placeholder hints, and accessible focus outlines.
- [ ] Responsive layout adapts cleanly from mobile (375px) to tablet (768px) and desktop (1280px+).
- [ ] Contrast ratios meet WCAG AA standards (minimum 4.5:1 for normal text).
- [ ] Full keyboard navigation is functional (Tab, Enter, Escape for dialogs).
- [ ] Role-based UI visibility matches backend authorization (no visible menus for forbidden routes).
- [ ] Visual artifacts/screenshots captured during QA testing.

# UI/UX Interaction Specification: {{SCREEN_NAME}}

## 1. Overview & References
- **Screen / Tab Name**: `{{SCREEN_NAME}}`
- **Design Philosophy**: Google-inspired visual clarity + Rapido-inspired speed & ergonomics.
- **Target Viewports**: Responsive Desktop (1280px+), Tablet (768px), Mobile (375px+).

---

## 2. Navigation & Role Visibility
- **Parent Menu**: `{{NAV_MENU}}`
- **Active Tab Key**: `{{TAB_KEY}}`
- **Authorized Roles**: `{{ROLES_LIST}}` (Hidden from unauthorized users in navigation AND protected by backend API).

---

## 3. Interaction Plan & States Matrix

```
[Screen Load] ──► (Data fetching?) ──► Loading Skeleton
                         │
                         ├── (No records?) ──► Empty State (with Primary CTA)
                         │
                         ├── (API Error?)   ──► Error State (with Retry Button)
                         │
                         └── (Success?)     ──► Render Interactive Interface
```

### State Definitions
1. **Loading State**: Skeleton layout matching cards/table rows.
2. **Empty State**: Icon `{{ICON_NAME}}`, headline `"No {{ITEMS}} found"`, subtext `"Get started by creating your first {{ITEM}}."`, button `"[+ Add {{ITEM}}]"`.
3. **Success State**: Immediate optimistic UI update with subtle toast confirmation.
4. **Error State**: Inline alert banner with user-friendly error description and `[Retry]` action.
5. **Forbidden State**: 403 screen with lock icon and `"You do not have permission to view this page."`.

---

## 4. Typography, Spacing & Design Tokens
- **Primary Action Button**: High contrast, minimum 44px height, keyboard accessible (`Tab` + `Enter`).
- **Form Inputs**: Floating/clear labels, inline validation message below input, visible focus ring.
- **Iconography**: Lucide / SVG icons with aria-hidden or accessible screen reader labels.

# Design Guidelines: Personal Study PWA

## Design Approach

**Selected Approach**: Design System - Apple Human Interface Guidelines (HIG)
**Justification**: As an iOS-first productivity tool, the app should feel native and familiar to iOS users. Apple HIG provides clean, content-focused patterns ideal for study/productivity applications.

**Key Design Principles**:
- Clarity over decoration
- Content-first hierarchy
- Intuitive iOS-native interactions
- Seamless focus mode experience
- Motivational but non-intrusive

## Core Design Elements

### A. Color Palette

**Light Mode**:
- Primary: 220 90% 56% (iOS-style blue for actions/CTAs)
- Background: 0 0% 98% (soft off-white)
- Surface: 0 0% 100% (pure white cards)
- Text Primary: 220 20% 10%
- Text Secondary: 220 10% 50%
- Success/Streak: 142 76% 36% (green for achievements)
- Warning: 38 92% 50% (amber for reminders)

**Dark Mode**:
- Primary: 220 90% 66% (lighter blue for contrast)
- Background: 220 20% 8% (deep charcoal)
- Surface: 220 15% 12% (elevated cards)
- Text Primary: 0 0% 95%
- Text Secondary: 220 10% 65%
- Success: 142 70% 45%
- Warning: 38 85% 60%

### B. Typography

**Font Stack**: 
- Primary: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif
- Monospace (for timer): "SF Mono", Consolas, monospace

**Hierarchy**:
- H1 (Page Titles): 32px/600 
- H2 (Section Headers): 24px/600
- H3 (Card Titles): 18px/600
- Body: 16px/400
- Small/Meta: 14px/400
- Timer Display: 48px/300 (monospace)

### C. Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 24
- Tight spacing: p-2, gap-2 (within components)
- Standard spacing: p-4, gap-4 (cards, lists)
- Section spacing: p-8, gap-8 (major sections)
- Large spacing: p-16, gap-16 (page margins)

**Container**: max-w-2xl mx-auto (optimized for mobile reading)

### D. Component Library

**Navigation**:
- Bottom tab bar (iOS pattern) with 4 tabs: Study, Timer, Progress, Profile
- Sticky header with page title and optional action button
- Minimal, icon-based navigation for mobile optimization

**Study Session Cards**:
- Rounded corners (rounded-2xl)
- Subtle shadow (shadow-sm in light, border in dark)
- Leading icon or emoji
- Title, description, and daily target displayed
- Progress indicator as subtle bottom border or circular progress

**Focus Timer**:
- Full-screen immersive mode option
- Large circular progress indicator
- Monospace time display (centered, prominent)
- Minimal controls: Start/Pause/Stop
- Ambient background gradient (very subtle)

**Post-Study Capture Form**:
- Clean textarea for text input
- Media upload buttons with preview thumbnails
- Character count for entries
- "Save" primary action button (fixed bottom on mobile)

**Streak & Progress**:
- Calendar heatmap visualization (GitHub-style)
- Circular progress rings for daily goals
- Achievement badges (subtle, not gamified)
- Simple bar charts for weekly/monthly trends

**Notifications/Nudges**:
- Toast notifications (top or bottom)
- Motivational cards on dashboard
- Gentle reminder modals (non-blocking)

**Data Displays**:
- List view with dividers for study sessions
- Timeline view for study history
- Stats cards with icon + number + label

**Forms**:
- iOS-style input fields (rounded, subtle borders)
- Floating labels for better UX
- Clear validation states
- Photo/video upload with preview grid

### E. Animations

Use sparingly and only for:
- Page transitions: Subtle slide (200ms ease)
- Timer countdown: Smooth progress ring animation
- Streak achievement: Brief celebration (scale + fade)
- Button feedback: Scale down on press (transform: scale(0.98))

**Avoid**: Excessive motion, parallax, background animations

## Images

**No hero images needed** - this is a utility app, not a marketing page. However, include:

**Empty State Illustrations**: 
- Location: Center of empty study list, empty progress view
- Style: Simple line drawings, iOS-style, 2-color (primary + gray)
- Description: Minimalist illustrations showing a book/timer/calendar

**Achievement Visuals**:
- Location: Streak milestone modals
- Style: Flat, colorful badges or emoji-based celebrations
- Keep lightweight and joyful without being childish

## iOS-Specific Considerations

- Safe area insets for notch/home indicator
- Haptic feedback on key interactions (timer start/stop, achievement unlock)
- Pull-to-refresh on lists
- Swipe gestures (swipe to delete sessions)
- Native-feeling transitions and interactions
- Add to Home Screen prompt with custom icon
- Offline-first data strategy with sync indicator
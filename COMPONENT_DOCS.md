# Component Usage Documentation

## ScrollControls Component

### Features
- Floating scroll buttons (scroll-to-top and scroll-to-bottom)
- Only one button visible at a time with smooth cross-fade
- Keyboard support (Home/End keys, Enter/Space)
- ARIA labels and live regions for accessibility
- Safe area inset support for mobile devices
- Respects `prefers-reduced-motion` preference

### Usage
```tsx
import ScrollControls from './components/ScrollControls';

function App() {
  return (
    <>
      <YourContent />
      <ScrollControls />
    </>
  );
}
```

### Button Specifications
- Mobile: 56×56px (with min tappable area 44×44px)
- Desktop: 72×72px
- Position: Bottom-right with safe area awareness
- Scroll-to-Bottom: Visible when NOT at bottom (⬇️ icon)
- Scroll-to-Top: Visible when AT bottom (⬆️ icon)

### Keyboard Controls
- `Home`: Scroll to top
- `End`: Scroll to bottom
- `Enter`/`Space`: Activate focused button

---

## PercentileInfo Component

### Features
- Calculates percentile from SGPA using industry-standard formula
- Displays inline info icon with tooltip
- Shows formula, example calculation, and raw data
- Handles edge cases (missing data, invalid SGPA)
- Fully accessible with keyboard and screen reader support

### Usage
```tsx
import { PercentileInfo } from './components/PercentileInfo';

function ResultPage({ student, allStudents }) {
  // Gather batch SGPA data
  const batchSgpas = allStudents
    .map(s => s.sgpa)
    .filter(sgpa => typeof sgpa === 'number' && !isNaN(sgpa));
  
  return (
    <div>
      <PercentileInfo 
        sgpa={student.sgpa} 
        batchSgpas={batchSgpas} 
      />
    </div>
  );
}
```

### Programmatic Usage
```tsx
import { getPercentileData } from './components/PercentileInfo';

const data = getPercentileData(8.83, [7.5, 8.0, 8.5, 9.0], '211271524003');
// Returns:
// {
//   roll: "211271524003",
//   sgpa: 8.83,
//   count_leq: 3,
//   total_students: 4,
//   percentile: 75.00,
//   formula: "Percentile = (Count of students with SGPA ≤ x ÷ Total students) × 100",
//   notes: null
// }
```

### Percentile Formula
```
Percentile = (Count of students with SGPA ≤ your SGPA ÷ Total students) × 100
```

- Includes ties (uses ≤ comparison)
- Rounded to 2 decimal places
- Clamped to [0.00, 100.00]

### Error Handling
- **NO_SGPA**: SGPA missing or invalid
- **NO_BATCH_DATA**: No batch data available
- **INVALID_COUNTS**: Calculation error

---

## Chatbot Rename

### Updated Name
**ce vault ai assist ofhatbit**

### Changes Made
- UI display text updated in ChatBot component
- `aria-label="ce vault ai assist ofhatbit chat assistant"`
- Service system instruction updated
- All references to "GlassGrade Assistant" replaced

### Usage
```tsx
import ChatBot from './components/ChatBot';

function App() {
  return (
    <>
      <YourContent />
      <ChatBot />
    </>
  );
}
```

---

## Server-Side Percentile Calculation

### SQL Example (PostgreSQL)
```sql
-- Calculate percentile for a specific student
WITH batch AS (
  SELECT sgpa FROM aggregates 
  WHERE semester = $1 AND course = $2
)
SELECT
  SUM(CASE WHEN sgpa <= $student_sgpa THEN 1 ELSE 0 END) AS count_leq,
  COUNT(*) AS total_students,
  ROUND(
    (SUM(CASE WHEN sgpa <= $student_sgpa THEN 1 ELSE 0 END)::numeric / COUNT(*)::numeric) * 100, 
    2
  ) AS percentile
FROM batch;
```

### API Response Format
```json
{
  "roll": "211271524003",
  "sgpa": 8.83,
  "count_leq": 5,
  "total_students": 7,
  "percentile": 71.43,
  "formula": "Percentile = (Count of students with SGPA ≤ x ÷ Total students) × 100",
  "notes": null
}
```

---

## Browser Support

### Modern Browsers
- All features work in Chrome, Firefox, Safari, Edge (latest versions)
- Safe area insets: iOS Safari 11+
- Prefers-reduced-motion: All modern browsers

### Fallback
If JavaScript is disabled, add static anchor links:
```html
<a href="#top">Go to Top</a>
<a href="#bottom">Go to Bottom</a>
```

---

## Styling

All components use Tailwind CSS utility classes for styling:
- Glassmorphism effects: `bg-white/10 backdrop-blur-xl`
- Gradients and shadows for depth
- Responsive sizing with `md:` breakpoints
- Focus rings for accessibility

---

## Accessibility Checklist

- ✅ All interactive elements have aria-labels
- ✅ Keyboard navigation support
- ✅ Focus indicators visible
- ✅ Screen reader announcements (live regions)
- ✅ Tooltip dismissible with Escape key
- ✅ Touch target sizes meet WCAG standards (44×44px minimum)
- ✅ Color contrast meets WCAG AA standards

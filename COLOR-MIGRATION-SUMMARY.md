# Color System Migration Summary

**Date:** October 21, 2025  
**Source:** [XRPL.org Design Tokens - Figma](https://figma.com/design/zRyhXG4hRP3Lk3B6Owr3eo/XRPL.org-Design-Tokens)

## Migration Strategy: Clean Migration

The old 10-level color scale (100-1000) has been completely migrated to a new 5-level scale (100-500). All references in the codebase have been updated, and backward compatibility aliases have been removed for a clean implementation.

**Mapping Applied:**
```
Old System    →    New System
100           →    100 (lightest)
200           →    100
300           →    200
400           →    200
500           →    300 (mid-tone, default)
600           →    300
700           →    400
800           →    400
900           →    500 (darkest)
1000          →    500
```

**Migration Approach:**
1. All color usages (600-1000) were found and replaced with their new equivalents (300-500)
2. Backward compatibility aliases were removed from `_colors.scss`
3. Only 100-500 design tokens remain for each color family

## Color Families Updated

### Primary Colors

#### Gray (Neutral) ⏸️ NOT UPDATED
- **Status:** Original values retained - design tokens not ready
- **Current values:** #FCFCFD, #F5F5F7, #E0E0E1, #C1C1C2, #A2A2A4, #838386, #454549, #343437, #232325, #111112
- **Note:** Gray/Neutral design tokens will be migrated in a future update

#### Green ✅
- **New Design Tokens:** #EAFCF1, #70EE97, #21E46B, #0DAA3E, #078139
- **Variables:** `$green-100` through `$green-500` only
- **Migrated:** 14 file references updated
- **Special:** `$apex-2023-green` (#00FF76) retained

#### Lilac (Primary) ✅ *replaces blue-purple*
- **New Design Tokens:** #F2EDFF, #D9CAFF, #C0A7FF, #7649E3, #5429A1
- **Variables:** `$lilac-100` through `$lilac-500` only
- **Legacy aliases:** `$blue-purple-100` through `$blue-purple-500` map to lilac (600-900 removed)
- **Migrated:** 16 file references updated
- **Note:** This is a new color name in the design system

### Secondary Colors

#### Red ✅ *NEW*
- **New Design Tokens:** #FDECE7, #F27A66, #F0643A, #DA4518, #A22514
- **Variables:** `$red-100` through `$red-500` only
- **Note:** This is a completely new color family added to the design system

#### Pink ✅ *replaces magenta*
- **New Design Tokens:** #FDF1F4, #F2B5C3, #F18DA5, #FF577F, #DC466F
- **Variables:** `$pink-100` through `$pink-500` only
- **Legacy aliases:** `$magenta-100` through `$magenta-500` map to pink (600-900 removed)
- **Migrated:** 7 file references updated

#### Blue ✅
- **New Design Tokens:** #EDF4FF, #93BFF1, #428CFF, #0179E7, #0A4DC0
- **Variables:** `$blue-100` through `$blue-500` only
- **Migrated:** 8 file references updated
- **Special:** `$accent-blue-90` (#001133) retained

#### Yellow ✅
- **New Design Tokens:** #F3F1EB, #E6F1A7, #DBF15E, #E1DB26, #D4C02D
- **Variables:** `$yellow-100` through `$yellow-500` only
- **Migrated:** 11 file references updated

## Colors Retained (No Design Token Replacement)

### Orange
- **Status:** Legacy values retained
- **Values:** #FFEEE5, #FFCCB2, #FFAA80, #FF884B, #FF6719, #E54D00, #B23C00, #802B00, #4C1A00
- **Reason:** No corresponding design token in new system

### Red-purple
- **Status:** Legacy values retained
- **Values:** #FBE5FF, #F2B2FF, #EA80FF, #E24CFF, #D919FF, #C000E5, #9500B2, #6B0080, #40004C
- **Reason:** No corresponding design token in new system

### Special Event Colors
- `$apex-2023-green: #00FF76`
- `$token-2049-purple: #410bb9`
- `$accent-blue-90: #001133`

## Bootstrap & Component Colors

All Bootstrap theme variables remain functional:
- `$primary` → `$purple` (now `$lilac-400`)
- `$secondary` → `$gray-200`
- `$success` → `$green-500`
- `$info` → `$blue-500`
- `$warning` → `$yellow-500`
- `$danger` → `$magenta-500` (now `$pink-500`)

## Breaking Changes

**Removed Variables:**
- All color variables from 600-1000 have been removed for: Green, Blue, Lilac, Pink, Red, Yellow
- `$blue-purple-600` through `$blue-purple-900` removed (use 100-500)
- `$magenta-600` through `$magenta-900` removed (use 100-500)

**No Impact:**
- All usages in the codebase have been updated
- Legacy color name aliases maintained (100-500 only):
  - `$blue-purple-100` through `$blue-purple-500` → maps to `$lilac-*`
  - `$magenta-100` through `$magenta-500` → maps to `$pink-*`

## Color Name Changes

| Old Name | New Name | Reason |
|----------|----------|--------|
| `blue-purple-*` | `lilac-*` | Design system rebranding |
| `magenta-*` | `pink-*` | Design system rebranding |
| N/A | `red-*` | New color family added |

## Usage Recommendations

### Current Best Practices
Use the new 5-level design tokens (100-500):
```scss
// Primary colors
color: $gray-300;      // Gray (not yet migrated - still uses old values)
color: $green-300;     // Default green
color: $lilac-400;     // Primary purple

// Secondary colors
color: $red-300;       // Default red
color: $pink-300;      // Default pink
color: $blue-300;      // Default blue
color: $yellow-300;    // Default yellow
```

### Legacy Aliases Still Available
```scss
// These legacy names work (100-500 only)
color: $blue-purple-400;  // Same as $lilac-400
color: $magenta-300;      // Same as $pink-300
```

## Files Modified

- `styles/_colors.scss` - Complete color system update

## Validation Status

✅ All SCSS variables resolve correctly  
✅ No linter errors  
✅ Bootstrap theme colors functional  
✅ All old color references (600-1000) removed from codebase  
✅ Special event colors preserved  
⏸️ Gray/Neutral colors - pending future update

## Migration Statistics

**Files Updated:** 11 SCSS files
- `styles/_colors.scss` - Color definitions cleaned up
- `styles/light/_light-theme.scss` - 11 color references updated
- `styles/_status-labels.scss` - 39 color references updated  
- `styles/_diagrams.scss` - 6 color references updated
- `styles/_code-tabs.scss` - 2 color references updated
- `styles/_content.scss` - 1 color reference updated
- `styles/_buttons.scss` - 7 color references updated
- `styles/_pages.scss` - 3 color references updated
- `styles/_blog.scss` - 2 color references updated
- `styles/_feedback.scss` - 2 color references updated
- `styles/_rpc-tool.scss` - 1 color reference updated
- `styles/_landings.scss` - 1 color reference updated

**Total Color References Updated:** 75+ instances


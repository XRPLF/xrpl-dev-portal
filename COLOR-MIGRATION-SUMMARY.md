# Color System Migration Summary

**Date:** October 21, 2025  
**Source:** [XRPL.org Design Tokens - Figma](https://figma.com/design/zRyhXG4hRP3Lk3B6Owr3eo/XRPL.org-Design-Tokens)

## Migration Strategy: Smart Merge Approach

The old 10-level color scale (100-1000) has been consolidated into a new 5-level scale (100-500) using the following mapping:

```
Old System    →    New System
100, 200      →    100 (lightest)
300, 400      →    200
500, 600      →    300 (mid-tone, default)
700, 800      →    400
900, 1000     →    500 (darkest)
```

## Color Families Updated

### Primary Colors

#### Gray (Neutral) ⏸️ NOT UPDATED
- **Status:** Original values retained - design tokens not ready
- **Current values:** #FCFCFD, #F5F5F7, #E0E0E1, #C1C1C2, #A2A2A4, #838386, #454549, #343437, #232325, #111112
- **Note:** Gray/Neutral design tokens will be migrated in a future update

#### Green ✅
- **New Design Tokens:** #EAFCF1, #70EE97, #21E46B, #0DAA3E, #078139
- **Backward compatibility:** All old variables (100-1000) mapped to new values
- **Special:** `$apex-2023-green` (#00FF76) retained

#### Lilac (Primary) ✅ *replaces blue-purple*
- **New Design Tokens:** #F2EDFF, #D9CAFF, #C0A7FF, #7649E3, #5429A1
- **Legacy aliases:** All `$blue-purple-*` variables now map to `$lilac-*`
- **Note:** This is a new color name in the design system

### Secondary Colors

#### Red ✅ *NEW*
- **New Design Tokens:** #FDECE7, #F27A66, #F0643A, #DA4518, #A22514
- **Note:** This is a completely new color family added to the design system

#### Pink ✅ *replaces magenta*
- **New Design Tokens:** #FDF1F4, #F2B5C3, #F18DA5, #FF577F, #DC466F
- **Legacy aliases:** All `$magenta-*` variables now map to `$pink-*`

#### Blue ✅
- **New Design Tokens:** #EDF4FF, #93BFF1, #428CFF, #0179E7, #0A4DC0
- **Backward compatibility:** All old variables (100-900) mapped to new values
- **Special:** `$accent-blue-90` (#001133) retained

#### Yellow ✅
- **New Design Tokens:** #F3F1EB, #E6F1A7, #DBF15E, #E1DB26, #D4C02D
- **Backward compatibility:** All old variables (100-900) mapped to new values

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

**None.** All existing color variables are still available through either:
1. Direct design token values (100-500)
2. Backward compatibility aliases (600-1000)
3. Legacy color family aliases (magenta→pink, blue-purple→lilac)

## Color Name Changes

| Old Name | New Name | Reason |
|----------|----------|--------|
| `blue-purple-*` | `lilac-*` | Design system rebranding |
| `magenta-*` | `pink-*` | Design system rebranding |
| N/A | `red-*` | New color family added |

## Usage Recommendations

### For New Code
Use the new design tokens directly:
```scss
// Primary colors
color: $gray-300;      // Default gray
color: $green-300;     // Default green
color: $lilac-400;     // Primary purple

// Secondary colors
color: $red-300;       // Default red
color: $pink-300;      // Default pink
color: $blue-300;      // Default blue
color: $yellow-300;    // Default yellow
```

### For Existing Code
No changes required. All existing variables continue to work:
```scss
// These still work via backward compatibility
background: $gray-800;
color: $blue-purple-500;
border: 1px solid $magenta-600;
```

## Files Modified

- `styles/_colors.scss` - Complete color system update

## Validation Status

✅ All SCSS variables resolve correctly  
✅ No linter errors  
✅ Bootstrap theme colors functional  
✅ Backward compatibility maintained  
✅ Special event colors preserved  
⏸️ Gray/Neutral colors - pending future update


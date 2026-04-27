# Code Citations

## License: Apache-2.0
https://github.com/protwis/protwis/blob/8bd3b142ae03f10c4960247330117d95fd855e3f/static/home/js/phylo_tree.js

```
## Step-by-step Solution

1. Add state to track clicked/visited person indices in `PeopleCircles.tsx`
2. When a person icon is clicked, add their index to the visited set
3. Apply a lighter color tone to visited/clicked icons
4. Create a helper function to lighten a hex color

### /Users/khaliunganbat/Desktop/shenzhen-metro-ai-map /components/PeopleCircles.tsx

Add visited state and lighter color for clicked icons.

````tsx
// filepath: /Users/khaliunganbat/Desktop/shenzhen-metro-ai-map /components/PeopleCircles.tsx
import { useMemo, useState, startTransition, type CSSProperties } from "react"
import { motion } from "framer-motion"
import { PeopleData } from "../data/people"

// ...existing code for interfaces...

// Helper function to lighten a hex color
function lightenColor(hex: string, percent: number): string {
    // Remove # if present
    const cleanHex = hex.replace('#', '')
    
    // Parse RGB values
    const r = parseInt(cleanHex.substring(0, 2), 16)
    const g = parseInt(cleanHex.substring(2, 4), 16)
    const b = parseInt(cleanHex.substring(4, 6), 16)
    
    // Lighten each channel
    const newR = Math.min(255, Math.round(r + (255 - r) * percent))
    const newG = Math.min(255, Math.round(g + (255 - g) * percent))
    const newB = Math.min(255, Math.round(b + (255 - b) * percent))
    
    // Convert back to hex
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
}

// ...existing code for Person
```


## License: Apache-2.0
https://github.com/protwis/protwis/blob/8bd3b142ae03f10c4960247330117d95fd855e3f/static/home/js/phylo_tree.js

```
## Step-by-step Solution

1. Add state to track clicked/visited person indices in `PeopleCircles.tsx`
2. When a person icon is clicked, add their index to the visited set
3. Apply a lighter color tone to visited/clicked icons
4. Create a helper function to lighten a hex color

### /Users/khaliunganbat/Desktop/shenzhen-metro-ai-map /components/PeopleCircles.tsx

Add visited state and lighter color for clicked icons.

````tsx
// filepath: /Users/khaliunganbat/Desktop/shenzhen-metro-ai-map /components/PeopleCircles.tsx
import { useMemo, useState, startTransition, type CSSProperties } from "react"
import { motion } from "framer-motion"
import { PeopleData } from "../data/people"

// ...existing code for interfaces...

// Helper function to lighten a hex color
function lightenColor(hex: string, percent: number): string {
    // Remove # if present
    const cleanHex = hex.replace('#', '')
    
    // Parse RGB values
    const r = parseInt(cleanHex.substring(0, 2), 16)
    const g = parseInt(cleanHex.substring(2, 4), 16)
    const b = parseInt(cleanHex.substring(4, 6), 16)
    
    // Lighten each channel
    const newR = Math.min(255, Math.round(r + (255 - r) * percent))
    const newG = Math.min(255, Math.round(g + (255 - g) * percent))
    const newB = Math.min(255, Math.round(b + (255 - b) * percent))
    
    // Convert back to hex
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
}

// ...existing code for Person
```


## License: Apache-2.0
https://github.com/protwis/protwis/blob/8bd3b142ae03f10c4960247330117d95fd855e3f/static/home/js/phylo_tree.js

```
## Step-by-step Solution

1. Add state to track clicked/visited person indices in `PeopleCircles.tsx`
2. When a person icon is clicked, add their index to the visited set
3. Apply a lighter color tone to visited/clicked icons
4. Create a helper function to lighten a hex color

### /Users/khaliunganbat/Desktop/shenzhen-metro-ai-map /components/PeopleCircles.tsx

Add visited state and lighter color for clicked icons.

````tsx
// filepath: /Users/khaliunganbat/Desktop/shenzhen-metro-ai-map /components/PeopleCircles.tsx
import { useMemo, useState, startTransition, type CSSProperties } from "react"
import { motion } from "framer-motion"
import { PeopleData } from "../data/people"

// ...existing code for interfaces...

// Helper function to lighten a hex color
function lightenColor(hex: string, percent: number): string {
    // Remove # if present
    const cleanHex = hex.replace('#', '')
    
    // Parse RGB values
    const r = parseInt(cleanHex.substring(0, 2), 16)
    const g = parseInt(cleanHex.substring(2, 4), 16)
    const b = parseInt(cleanHex.substring(4, 6), 16)
    
    // Lighten each channel
    const newR = Math.min(255, Math.round(r + (255 - r) * percent))
    const newG = Math.min(255, Math.round(g + (255 - g) * percent))
    const newB = Math.min(255, Math.round(b + (255 - b) * percent))
    
    // Convert back to hex
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
}

// ...existing code for Person
```


## License: Apache-2.0
https://github.com/protwis/protwis/blob/8bd3b142ae03f10c4960247330117d95fd855e3f/static/home/js/phylo_tree.js

```
## Step-by-step Solution

1. Add state to track clicked/visited person indices in `PeopleCircles.tsx`
2. When a person icon is clicked, add their index to the visited set
3. Apply a lighter color tone to visited/clicked icons
4. Create a helper function to lighten a hex color

### /Users/khaliunganbat/Desktop/shenzhen-metro-ai-map /components/PeopleCircles.tsx

Add visited state and lighter color for clicked icons.

````tsx
// filepath: /Users/khaliunganbat/Desktop/shenzhen-metro-ai-map /components/PeopleCircles.tsx
import { useMemo, useState, startTransition, type CSSProperties } from "react"
import { motion } from "framer-motion"
import { PeopleData } from "../data/people"

// ...existing code for interfaces...

// Helper function to lighten a hex color
function lightenColor(hex: string, percent: number): string {
    // Remove # if present
    const cleanHex = hex.replace('#', '')
    
    // Parse RGB values
    const r = parseInt(cleanHex.substring(0, 2), 16)
    const g = parseInt(cleanHex.substring(2, 4), 16)
    const b = parseInt(cleanHex.substring(4, 6), 16)
    
    // Lighten each channel
    const newR = Math.min(255, Math.round(r + (255 - r) * percent))
    const newG = Math.min(255, Math.round(g + (255 - g) * percent))
    const newB = Math.min(255, Math.round(b + (255 - b) * percent))
    
    // Convert back to hex
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
}

// ...existing code for Person
```


## License: Apache-2.0
https://github.com/protwis/protwis/blob/8bd3b142ae03f10c4960247330117d95fd855e3f/static/home/js/phylo_tree.js

```
## Step-by-step Solution

1. Add state to track clicked/visited person indices in `PeopleCircles.tsx`
2. When a person icon is clicked, add their index to the visited set
3. Apply a lighter color tone to visited/clicked icons
4. Create a helper function to lighten a hex color

### /Users/khaliunganbat/Desktop/shenzhen-metro-ai-map /components/PeopleCircles.tsx

Add visited state and lighter color for clicked icons.

````tsx
// filepath: /Users/khaliunganbat/Desktop/shenzhen-metro-ai-map /components/PeopleCircles.tsx
import { useMemo, useState, startTransition, type CSSProperties } from "react"
import { motion } from "framer-motion"
import { PeopleData } from "../data/people"

// ...existing code for interfaces...

// Helper function to lighten a hex color
function lightenColor(hex: string, percent: number): string {
    // Remove # if present
    const cleanHex = hex.replace('#', '')
    
    // Parse RGB values
    const r = parseInt(cleanHex.substring(0, 2), 16)
    const g = parseInt(cleanHex.substring(2, 4), 16)
    const b = parseInt(cleanHex.substring(4, 6), 16)
    
    // Lighten each channel
    const newR = Math.min(255, Math.round(r + (255 - r) * percent))
    const newG = Math.min(255, Math.round(g + (255 - g) * percent))
    const newB = Math.min(255, Math.round(b + (255 - b) * percent))
    
    // Convert back to hex
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
}

// ...existing code for Person
```


## License: Apache-2.0
https://github.com/protwis/protwis/blob/8bd3b142ae03f10c4960247330117d95fd855e3f/static/home/js/phylo_tree.js

```
## Step-by-step Solution

1. Add state to track clicked/visited person indices in `PeopleCircles.tsx`
2. When a person icon is clicked, add their index to the visited set
3. Apply a lighter color tone to visited/clicked icons
4. Create a helper function to lighten a hex color

### /Users/khaliunganbat/Desktop/shenzhen-metro-ai-map /components/PeopleCircles.tsx

Add visited state and lighter color for clicked icons.

````tsx
// filepath: /Users/khaliunganbat/Desktop/shenzhen-metro-ai-map /components/PeopleCircles.tsx
import { useMemo, useState, startTransition, type CSSProperties } from "react"
import { motion } from "framer-motion"
import { PeopleData } from "../data/people"

// ...existing code for interfaces...

// Helper function to lighten a hex color
function lightenColor(hex: string, percent: number): string {
    // Remove # if present
    const cleanHex = hex.replace('#', '')
    
    // Parse RGB values
    const r = parseInt(cleanHex.substring(0, 2), 16)
    const g = parseInt(cleanHex.substring(2, 4), 16)
    const b = parseInt(cleanHex.substring(4, 6), 16)
    
    // Lighten each channel
    const newR = Math.min(255, Math.round(r + (255 - r) * percent))
    const newG = Math.min(255, Math.round(g + (255 - g) * percent))
    const newB = Math.min(255, Math.round(b + (255 - b) * percent))
    
    // Convert back to hex
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
}

// ...existing code for Person
```


## License: Apache-2.0
https://github.com/protwis/protwis/blob/8bd3b142ae03f10c4960247330117d95fd855e3f/static/home/js/phylo_tree.js

```
## Step-by-step Solution

1. Add state to track clicked/visited person indices in `PeopleCircles.tsx`
2. When a person icon is clicked, add their index to the visited set
3. Apply a lighter color tone to visited/clicked icons
4. Create a helper function to lighten a hex color

### /Users/khaliunganbat/Desktop/shenzhen-metro-ai-map /components/PeopleCircles.tsx

Add visited state and lighter color for clicked icons.

````tsx
// filepath: /Users/khaliunganbat/Desktop/shenzhen-metro-ai-map /components/PeopleCircles.tsx
import { useMemo, useState, startTransition, type CSSProperties } from "react"
import { motion } from "framer-motion"
import { PeopleData } from "../data/people"

// ...existing code for interfaces...

// Helper function to lighten a hex color
function lightenColor(hex: string, percent: number): string {
    // Remove # if present
    const cleanHex = hex.replace('#', '')
    
    // Parse RGB values
    const r = parseInt(cleanHex.substring(0, 2), 16)
    const g = parseInt(cleanHex.substring(2, 4), 16)
    const b = parseInt(cleanHex.substring(4, 6), 16)
    
    // Lighten each channel
    const newR = Math.min(255, Math.round(r + (255 - r) * percent))
    const newG = Math.min(255, Math.round(g + (255 - g) * percent))
    const newB = Math.min(255, Math.round(b + (255 - b) * percent))
    
    // Convert back to hex
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
}

// ...existing code for Person
```


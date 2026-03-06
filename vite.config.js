import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

**`.gitignore`** — replace with:
```
node_modules
dist
.DS_Store

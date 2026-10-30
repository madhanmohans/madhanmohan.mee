projects - things that I care about 

issue #7


1. Master the Asset Pipelines

Unoptimized assets are the most common source of page bloat. Next.js offers specialized components built specifically to handle these out of the box.
• Image Optimization (next/image): Replace standard HTML <img> elements with the Next.js Image Component. It automatically resizes, compresses, and converts images into modern formats like WebP or AVIF.
	• Rule: Always supply explicit width and height properties to calculate the aspect ratio and prevent Cumulative Layout Shift (CLS).
	• Rule: Add the priority prop to your hero image or above-the-fold content so it loads immediately without delaying LCP.
• Font Subsetting (next/font): Built-in font loaders host Google Fonts locally within your deployment. This cuts out third-party network requests and eliminates flash-of-unstyled-text (FOUT) through automated font-display: swap configurations.
• Script Handling (next/script): Stop letting third-party scripts (like Google Analytics or tag managers) block your main thread. Use the Next.js Script Component with strategy="lazyOnload" or strategy="worker" to defer execution until the page is fully interactive.

2. Streamlining Rendering & the App Router

If you are using the App Router, leveraging Server Components correctly is paramount.
• Default to Server Components (RSC): Next.js processes server components natively, meaning their dependencies do not add weight to your client-side JavaScript bundle.
• Move use client to the Leaves: Do not flag entire page layouts with "use client". Wrap only the interactive nodes (like a toggled dropdown or a specific form button) in client components to keep the main bundle light.
• Data Streaming with Suspense: Don't let slow database queries hold back your entire page load. Wrap slower components in React <Suspense> boundaries or use a loading.js file. This allows Next.js to stream the static UI shell instantly while dynamic components populate as their data resolves.

3. Data Fetching & Caching Strategy

Optimizing network traffic on the server is just as critical as optimizing client assets.
• Avoid Request Waterfalls: When fetching multiple datasets, avoid sequentially awaiting them if they are independent. Use Promise.all() to fire requests in parallel.
• Intelligent Caching: Next.js extends the native fetch API to cache data responses automatically. Use static rendering for content that rarely shifts and opt into Time-based Revalidation (next: { revalidate: 3600 }) to refresh stale data in the background without penalizing users.
• Fetch on the Server Directly: Do not create separate API Route Handlers just to call them from Server Components; doing so creates an unnecessary network hop. Fetch directly from your database or external API inside the Server Component.

4. Shrinking Client-Side Bundles

• Dynamic Imports (next/dynamic): Defer loading large components or heavy client-side libraries until they are actually needed (e.g., a modal or a complex charting library).javascript
import dynamic from 'next/dynamic'
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  ssr: false, // Prevents server-side execution if it depends on browser window APIs
  loading: () => <p>Loading chart...</p>
})
Use code with caution.
• Tree Shaking & Specific Imports: Be deliberate with your imports. If you use utilities like lodash, import explicit methods (import debounce from 'lodash/debounce') instead of full global packages to save considerable bundle workspace. Avoid bulky legacy date libraries like moment.js entirely, opting for native features like the Intl API.
• Bundle Auditing: Install @next/bundle-analyzer. Running a production build with this tool maps out a visual graphic breakdown of your client bundles, helping you isolate and remove hidden dependencies.
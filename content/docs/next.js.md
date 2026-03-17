## Client Side rendering

The response contains a barebones HTML page, and accompanying JavaScript assembles the rest of the page’s content.

think of how your Gmail inbox updates with new emails, all without refreshing the page itself.

React component with a `'use client'` directive. This directive specifies that the component and its children components should be rendered on the client side.

---
## Server Side rendering

Server-side rendering is ideal for web applications that need a lot of data fetching, search engine optimization (SEO), and speed. By moving the fetching [requests](https://www.codecademy.com/resources/docs/javascript/requests) closer to the database, developers reduced the latency of these requests.

---

## Hydration

once the HTML page and associated JS files are sent to client,
then Next.JS reads the JS Files and constructs the virtual DOM and then compares and reconciles it with the server sent DOM tree. then once that is done, it attaches the interactivity (event handlers) to the corresponding elements making the static page interactive. 

after that point any re-render will be handled in client side itself. (touch up)

This is called Hydration. (giving life to the static)

Next.JS leverages both SSR and CSR techniques.

---

`npx create-next-app` 

styling methods offered by Next.JS
- [Modules](https://www.codecademy.com/resources/docs/javascript/modules)
- [Tailwind CSS](https://tailwindcss.com/)
- [CSS-in-JS](https://cssinjs.org/)
- [Sass](https://sass-lang.com/)

layout.tsx 
- shared ui for the nested components
- must have html and body tags
- will hold the children within
- will not render within the components

template.tsx
- same as layout.tsx but it rerenders within children navigation

```
layout.tsx and template.tsx
```

- define shared UI across nested components
- atleast one root layout.tsx must be defined
- template.tsx is optional
- both have child props

not-found.tsx
error.tsx
loading.tsx

> page.tsx is the innermost element in Next.js Router component hierarchy

if we need to navigate using our application structure (like static links), we use the `<Link>` component, but if we need programmatic navigation (like redirecting), we use the `useRouter()` hook.
- router.back()
- router.forward()
- router.push("/dashboard")

> [[..slugs]] catchall dynamic segment (folder name for the route)

folder - path segments
reserved files (page, layout, not-found etc) - segment's UI

In the example, the `not-found.tsx` and `loading.tsx` exported components do not receive props. `error.tsx` receives an `Error` object named `error` and a reset callback named `reset()`. Note that `error.tsx` components _must_ be client components and they _do not_ catch errors thrown in `layout.tsx` or `template.tsx`

The component hierarchy establishes how all the default exported components in the route segment’s reserved files are rendered.


![[Pasted image 20250825172257.png]]
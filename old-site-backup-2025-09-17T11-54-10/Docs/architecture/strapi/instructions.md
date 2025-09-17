Deep Analysis of Strapi Integration and Workflow
Overview of the JAMstack Architecture
Your project is a JAMstack e-learning platform built with a headless CMS (Strapi) and a static front-end. JAMstack refers to a modern web architecture based on JavaScript (client-side), APIs (reusable backend services), and Markup (prebuilt static HTML)
strapi.io
strapi.io
. In this setup, Strapi serves as the headless CMS API layer, while the front-end consists of pre-designed static pages enhanced with client-side JavaScript for dynamic content. This decoupled architecture brings benefits in performance, security, and scalability: static pages prebuilt and served via CDN load extremely fast, with fewer server vulnerabilities and easy scaling for high traffic
strapi.io
. Key Goal: Emphasize static content delivery and performance over real-time interactivity. There are no live previews or real-time content pushes in place. Instead, content updates flow from Strapi to the site through build processes or client fetches, which we’ll detail. Below is a deep dive into each aspect of this integration, covering how the front-end and Strapi work together, how content updates propagate, and best practices for using Strapi in this JAMstack context.
Frontend Setup: Webflow Templates with Vanilla JS Integration
Front-end Framework: The site is built using plain HTML, CSS, and JavaScript, with no front-end frameworks like React or Vue. The design and layout were created in Webflow, then exported as static code. This means the HTML structure and CSS styles come directly from Webflow’s design tools (including Webflow’s custom CSS framework for responsive design). The result is a set of static pages that look exactly as designed in Webflow, without any dynamic rendering on the server. Integration Script: Dynamic content from Strapi is injected on the client side via a custom script (e.g. webflow-strapi-integration.js). This is a vanilla JS file included in the pages, responsible for fetching data from Strapi’s API and populating the HTML elements. For example, the script might use the Fetch API to retrieve content and then update the DOM. A simplified illustration of this would be:
fetch('http://localhost:1337/api/courses')
  .then(res => res.json())
  .then(data => {
    data.data.forEach(course => {
      // Insert course content into the page
      document.getElementById('courses-list').innerHTML += 
        `<li>${course.attributes.title}</li>`;
    });
  });
Such a function could run on page load to replace placeholder elements with real data from Strapi. (In Strapi’s response format, note that the actual fields are nested under a .attributes object
stackoverflow.com
stackoverflow.com
, hence the integration code must access course.attributes for the actual content like title or description.) No Front-end Frameworks: By not using React/Vue and instead sticking to vanilla JS, the application avoids heavy client-side libraries, which keeps the bundle size small and the loading speed fast. The trade-off is that all dynamic behavior must be coded manually. In this project, the integration script handles tasks such as: fetching course lists from Strapi, injecting text/images into the HTML, and handling user interactions (like form submissions for login) using plain JavaScript DOM manipulation. Styling: The CSS comes from Webflow’s exported styles. Webflow’s framework ensures the design is responsive and consistent with what was visually designed. There’s no separate CSS library like Bootstrap; rather, the design system is essentially “Webflow CSS” plus any minor custom CSS tweaks. This means the front-end appearance is managed in Webflow, while content is managed in Strapi – a separation of design and content. Summary: The front-end is a static Webflow-generated site enhanced with JavaScript to pull in live content. Users visiting the site download static HTML/JS/CSS files (deployed on a host like Vercel), and then the JavaScript runs in their browser to fetch the latest content from Strapi’s REST API. This approach fits the JAMstack model: the pages are fast and static, yet they can show up-to-date content via API calls.
Strapi Content API (REST) and Authentication
API Type: The project exclusively uses Strapi’s REST API to query and submit content. Strapi automatically generates REST endpoints for each content type you create
docs.strapi.io
docs.strapi.io
. For example, if you have a collection type called “Course” (with plural API ID courses), Strapi provides endpoints like:
GET /api/courses – fetch list of courses (with pagination),
GET /api/courses/:id – fetch a single course by ID,
POST /api/courses – create a new course (if allowed),
PUT /api/courses/:id – update a course, etc.
These follow standard HTTP methods for CRUD operations
docs.strapi.io
. In your case, key endpoints in use include:
/api/courses – to retrieve the list of courses (or lessons, modules, etc. depending on your content model). The front-end script calls this to get all course data to display on the courses page.
/api/auth/local – to authenticate users (login). This is a built-in endpoint provided by Strapi’s Users & Permissions plugin. The front-end likely sends a POST request here with user credentials (identifier = email/username, and password) to log a user in. On success, Strapi responds with a JSON containing a JWT (JSON Web Token) and the user’s information
strapi.io
. The JWT is then stored on the client (e.g. in memory or localStorage) for subsequent requests.
/api/users/me – to fetch the current user’s profile data. After login, the front-end can call this endpoint (with the JWT in the Authorization header) to verify and retrieve user info (like name, email, or any relations like enrolled courses, etc.).
(Other endpoints) – e.g. if you have other collection types (categories, testimonials, etc.), each would have its own /api/<pluralName> endpoint.
REST vs GraphQL: Notably, GraphQL is not used in this project. Strapi does support GraphQL via a plugin, but you’ve opted for REST for simplicity and compatibility with plain JS. The REST approach is perfectly fine and often simpler to implement in a vanilla JS context (just use fetch or XHR). GraphQL would require constructing queries and potentially including a GraphQL client library, which isn’t necessary here. Data Format: Strapi v4/v5’s REST API returns JSON in a standardized format. For collection types, the response has a data array of entries, each with an id and attributes object (containing the fields). For example, a GET /api/courses might return:
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Course 101",
        "description": "Introductory course ...",
        "visible": true,
        "createdAt": "...", 
        "updatedAt": "...",
        // other fields, and relations or media as nested objects if populated
      }
    },
    { "id": 2, "attributes": { ... } },
    ...
  ],
  "meta": { ...pagination info... }
}
Your integration script must traverse this structure (as shown in the example earlier) to extract the needed fields. In the above code snippet, course.attributes.title would yield "Course 101"
stackoverflow.com
stackoverflow.com
. Keep this in mind when mapping Strapi data to your front-end elements. Authentication & Roles: Since you have user login, Strapi’s authentication is handled via JWT. You likely have the Users & Permissions plugin configured. By default, Strapi secures all new content types – meaning no public access unless you configure it
docs.strapi.io
. In Strapi’s admin panel under Settings > Users & Permissions > Roles, you need to enable permissions for the Public role (for content that should be publicly accessible) and for the Authenticated role (for content accessible after login)
strapi.io
.
For example, to let any visitor see the list of courses, you must grant the Public role permission to “find” and/or “findOne” on the Course content type
strapi.io
. If this is done, then GET /api/courses will succeed without a token. Otherwise, without a JWT, the API would return 403 Forbidden for protected resources.
Meanwhile, certain endpoints like /api/users/me or creating new content might require the user to be authenticated (JWT present and the role having permission). In your case, JWT authentication is primarily used for logging in users (via /api/auth/local) and possibly gating some API calls.
When a user logs in through the front-end form, the flow is: the form submission triggers a POST /api/auth/local with { identifier: email, password: password }. If credentials are valid, Strapi responds with { jwt: "<token>", user: { ...user profile... } }. The front-end should store the jwt (e.g., in localStorage or a cookie) and include it in an Authorization: Bearer <token> header for any subsequent API calls that require authentication. For example, to fetch the logged-in user’s info, your code would call /api/users/me with the JWT header, and Strapi will return the user object. This JWT remains valid until it expires (the default expiration is often 30 days, configurable in Strapi). If it expires, the user would need to log in again (or you can implement refresh tokens, but that’s an advanced setup). Summary: All content fetching and user authentication is done through Strapi’s REST API endpoints. The front-end integration JS handles making these HTTP requests. There is no GraphQL layer in use, simplifying the tech stack to plain REST calls. Standard HTTP and JSON are at play – which is easy to test and debug (e.g., you can even use a tool like Postman to test /api/courses or /api/auth/local manually). Just remember that Strapi’s default security model means you must explicitly allow or authenticate requests; once configured, the Strapi API acts as the single source of truth for all content and user info in your application.
Strapi Hosting and Infrastructure
Development Setup: Currently, Strapi is running in a self-hosted environment (not on Strapi Cloud). For development, you run Strapi locally on localhost:1337. The content database is PostgreSQL, which you’ve set up via a Docker container. Using Docker for the database is convenient – it ensures everyone on the team can run a Postgres instance with the same configuration. Strapi connects to this Postgres DB (likely via connection details in your Strapi project’s .env file). This means during development, your stack looks like: Strapi (Node.js) on your machine, Postgres in Docker (on your machine), and the front-end served (perhaps via a simple file server or through Vercel’s dev environment) separately. The front-end will call http://localhost:1337 for API requests in the dev stage. You may have configured CORS in Strapi to allow http://localhost:PORT (whatever port your front-end dev server uses) – by default Strapi has a CORS setting to restrict API access, but typically it allows all origins in development mode unless configured otherwise. Production Deployment Plans: You plan to deploy Strapi on Railway. Railway is a popular hosting platform that can deploy web services easily (it supports running Dockerfiles or using their templates). In fact, Strapi has official guides for Railway deployment, highlighting it as a strong alternative to Strapi Cloud for developers who want more control
strapi.io
strapi.io
. The mention of “$5/month” likely refers to Railway’s pricing – Railway offers a free tier with limited usage, and beyond that it’s a pay-as-you-go model. Many users report that you can run a small Strapi instance on Railway for roughly $5/month (especially if you use their hobby plan for a small PostgreSQL database and keep the Strapi service within the free execution hours or minimal usage)
forum.strapi.io
. On Railway, you will have to handle a few things:
Setting up the Postgres database (Railway can provision a Postgres add-on, or you deploy one as well).
Ensuring environment variables are set (Railway’s dashboard allows you to configure the same variables from your dev .env, such as database credentials, JWT secret, etc.).
Possibly enabling persistent storage for file uploads (Railway ephemeral file system means if you store media locally, it might not persist between deploys – a common solution is to use a cloud storage like Cloudinary for media files, or use Railway’s volume feature if available).
Deploying the Strapi code: Railway can auto-deploy from your GitHub repo. Often, you might use a Dockerfile or simply provide the repo and Railway auto-detects it’s a Node app and deploys. There’s also a one-click template for Strapi on Railway
railway.com
 which sets up a basic project.
Importantly, you are not using Strapi Cloud (the official hosted service by Strapi). Strapi Cloud is a managed offering with automatic scaling, built-in email and media handling, etc
strapi.io
strapi.io
. You’ve chosen self-hosting (Railway) likely for reasons of cost and flexibility – as noted, Strapi Cloud provides convenience, but self-hosting gives more control at the cost of manual setup
strapi.io
. With Railway, you remain in charge of updates and configuration, but you can tailor everything to your needs. Strapi Version Control: Make sure your Strapi project code (the API definitions, configurations, and any custom code) is in version control (GitHub). Typically, a Strapi project consists of source code (JavaScript/TypeScript) plus configuration files (like schema JSON files for content types). Since you are using GitHub, you likely commit all these files. That way, when deploying to Railway, the same code and content schema can be pulled. The content (actual entries in the database) is not in Git – you will populate the production database either by re-entering content, migrating data, or simply starting fresh. For an e-learning platform, you might manually add the initial content (courses, lessons) in the production Strapi once it’s live. In the future, if you have a lot of content, consider seeding or migrating content between environments (Strapi doesn’t yet have an official content migration tool, but you can use the Import/Export plugin or database backups to move data from dev to prod if needed). Local vs Prod URLs: Once deployed, your Strapi will have a URL (e.g., https://yourapp.up.railway.app or a custom domain). The front-end needs to know this URL to call the APIs. In development it calls localhost; in production, it must call the Railway URL. Often, you’d handle this by using environment-specific configs or JavaScript that picks the API base URL based on environment. Since you are deploying the front-end on Vercel, you can set an environment variable there (e.g., STRAPI_API_URL) and in your integration JS, use that instead of hardcoding localhost. CORS: Also, ensure the Strapi server has CORS enabled for your production domain. In Strapi’s settings (or middleware config), you should allow the Vercel domain to make requests, otherwise API calls from the front-end could be blocked by the browser. Strapi’s default CORS config typically allows all origins in development; for production, explicitly set it for your domain for security. Database in Docker: In production, you won’t use Docker for Postgres on Railway (Railway provides a managed Postgres service). The Docker setup is mainly for dev. But continue using Docker in dev to match the database engine with production (Postgres vs using SQLite). Having Postgres in both dev and prod avoids surprises due to differences in SQL dialects or JSON field handling between SQLite and Postgres. Summary: The Strapi backend is self-hosted (Node.js app with a Postgres DB). Development is local (port 1337) with Docker for DB, and production will be on Railway (with a $5-ish plan). You’ve chosen to manage your own hosting rather than Strapi Cloud, giving you full control. This requires careful configuration (env variables, CORS, persistence) but is cost-effective and flexible. Keep your Strapi code in Git, and use that for deployments. As a result, you maintain the ability to update Strapi (upgrade versions or add plugins) by pushing code and redeploying, similar to any Node application.
Content Update Workflow and Visibility Toggles
A crucial question is how updates in Strapi propagate to the live website. Since we’re not using real-time features (no WebSockets or live preview), updates are not instantly pushed to users’ screens – instead, the JAMstack approach relies on pull or rebuild mechanisms. Let’s break down the scenarios:
Client-Side Fetch (on page load): If your front-end pages fetch data at runtime (each time the page loads or on some interval), then any new content in Strapi will appear as soon as the page requests it. For instance, if you publish a new course in Strapi’s admin and mark it visible, when a user next loads the courses page (or hits refresh), the integration script’s API call will fetch the updated list, which now includes the new course. In this case, the content update is reflected on the next page load. There’s no need to rebuild the site since the site always pulls fresh data from the API. This provides up-to-date content, but it does mean your site is somewhat dynamic (it depends on the Strapi API being reachable for each user request). It also means search engine crawlers might need to execute JS to see content, which most modern crawlers like Google can do, but it’s a consideration.
Static Build (SSG) with Redeploy: If instead you choose to pre-render content at build time (for SEO and speed), the site won’t automatically know about new content until you trigger a rebuild. In a static site generation scenario, you might run a build script that pulls all courses from Strapi and generates static HTML pages (for example, using a static site generator or a custom Node script). The built pages are then deployed to Vercel’s hosting. In that case, when you update or add a course in Strapi, the site remains unchanged until you perform a new build + deploy. To streamline that, you can use webhooks: Strapi can send a notification to Vercel whenever content changes, prompting Vercel to rebuild the site. This architecture is common – it yields a very fast site (content is baked into HTML), and Strapi changes eventually propagate through automated deployment. As Strapi’s documentation notes, making a static site and using Strapi webhooks allows immediate rebuilds on content updates
strapi.io
. For example, if a new blog post is published, Strapi’s webhook can trigger Vercel to pull the latest content and redeploy the site, so the new content is live shortly after publishing
strapi.io
.
Given your stack (no Next.js or Gatsby in use), you might currently be using the client-side fetch approach, since you have a direct integration JS. However, you’ve indicated a focus on static performance and mentioned a Vercel webhook. This suggests you are moving toward or already attempting a hybrid approach: perhaps using client-side fetch for now, but considering static site generation for key pages, or at least automating redeployments on content change. Let’s clarify the current state:
“Toggle visible on/off in Strapi” – You likely have a boolean field (e.g., visible) or you rely on Strapi’s Draft/Publish system to control whether a course should show up on the site. Strapi’s Draft & Publish feature means each entry has a published state; if a course is unpublished (draft), Strapi’s public API won’t return it
strapi.io
strapi.io
. Toggling a course from draft to published will make it appear in API results. Alternatively, if you created a custom visible field, your front-end code must check that field and only render items where visible: true. In either case, the action of toggling visibility in Strapi does not directly notify the website – it simply changes what data is available via the API.
If using client fetch: the next API call (on page reload) will fetch the updated list. If a course was made invisible (unpublished), it will no longer come through the API (or will come with visible:false which your JS can filter out), thus it disappears from the site UI after a reload. If something was made visible/published, it will now appear in the data and thus show up in the UI on reload. There is no explicit “command” sent to the web page from Strapi – the web page just requests data and gets the current state. Essentially, the browser is in charge of pulling updates, not Strapi pushing them.
If using static build: toggling content won’t show up until a rebuild is triggered. In this case, you must have a mechanism to update the site. This is where the Vercel deploy hook comes in. You mentioned a Vercel webhook is set up (though possibly not fully implemented yet). The idea is: configure a Strapi Webhook (in Settings > Webhooks in Strapi admin) that fires on certain events (e.g., after publish, after update)
strapi.io
strapi.io
. This webhook is essentially an HTTP POST from Strapi to a special URL Vercel provides (the deploy hook URL). When Vercel receives it, it starts a new build of your front-end project. The front-end build process (if you have one) should fetch the latest content from Strapi and include it in the static files. Vercel will then deploy the updated static site. Strapi’s documentation emphasizes how webhooks enable real-time integration with external systems to update on content changes
strapi.io
. In a tutorial example, they show publishing a new post in Strapi triggering a webhook that rebuilds a Next.js static site
strapi.io
. In your case, even without a framework, you could script a build or simply re-deploy the static files.
Current Status: According to your notes, webhooks are not yet implemented, meaning content updates require a manual step. Possibly, after updating content, you manually trigger a redeploy on Vercel (or just know that users will see it on next load if using client fetch). The presence of a Vercel deploy hook URL suggests you attempted to set it up. Double-check that in Strapi’s Webhooks settings, you’ve added the URL and selected appropriate events (e.g., entry publish/update for the relevant collection). If it’s there but not firing, look at Strapi’s logs or webhook history to debug any errors (Strapi can log if the webhook POST failed). The target is to achieve what the integration promise states: updating content in Strapi automatically reflects on the website, without manual intervention
codi.pro
. This automation reduces the risk of forgetting to deploy changes and ensures content editors can simply publish in Strapi and know the site will update shortly
codi.pro
. No Real-time Features: It’s important to note that you do not have real-time interactivity such as live content updates or collaborative editing on the front-end. For instance, there’s no use of WebSockets or Strapi’s GraphQL subscriptions (which would allow pushing updates to clients instantly). This is a conscious decision to keep the system simpler and aligned with static delivery. Users won’t see content change before their eyes in real-time; they’ll only see new content when they load or reload a page after it’s been published. This is acceptable for an e-learning platform where content (courses, lessons) doesn’t change every second. It also significantly simplifies architecture – no persistent socket connections or listener services are needed. Preview Considerations: Since live preview is not required, content editors in Strapi must use the traditional approach: make changes in the Strapi admin panel, save/publish them, then manually check the website to see how it looks. Strapi does have a preview feature (you can configure a Preview button that opens the front-end site with a draft token), but you indicated it’s not in use. So content managers likely just publish and then verify on the production site. This is fine given the team size or workflow, though in the future you could implement preview if needed (especially if you want to see how an unpublished draft would appear on the site). Conclusion of Workflow: In summary, when you update content in Strapi, the website’s UI will update on the next fetch or build. There is no instantaneous push from Strapi to the browser. The toggle of “visible” or publish essentially changes what the Strapi API returns. The front-end must request the data (either by users navigating or by an automated rebuild). To achieve near-immediacy in updating the live site after content changes, use Strapi Webhooks + Vercel Deploy Hooks: this setup automates the process of pulling new content into your static site build on Vercel whenever content is created/updated
strapi.io
. If you haven’t already, it’s highly recommended to enable this. Once working, the cycle will be:
Editor publishes or updates an item in Strapi (e.g., marks a course as “Visible” and clicks publish).
Strapi’s webhook fires a POST to Vercel’s deploy hook URL.
Vercel triggers a new build of your front-end. In that build, your code (or a script) fetches the fresh content from Strapi.
Vercel deploys the updated site. Within seconds or a minute, the live site reflects the new content.
This keeps the content delivery flow static yet automated, combining the best of JAMstack (performance and security of static files) with a workable content editing experience (nearly on-demand updates)
strapi.io
.
Content Modeling in Strapi
Your Strapi content model already includes complex nested structures to represent e-learning content. Let’s outline how Strapi handles such structures and how that impacts the integration:
Collection Types and Relations: In an e-learning platform, you likely have multiple content types (collections). For example, Course, Lesson, Module, Instructor, etc. Strapi allows you to relate these: a Course could have many Lessons (one-to-many relation), an Instructor could be related to Courses, etc. These relationships are defined in the content type builder and result in relational data in the API. When fetching, you can get related data by using query parameters. For instance, GET /api/courses?populate=lessons would include the course’s lessons in the response (if lessons is a relation field). However, note that by default, Strapi’s REST API does not include relations or media unless explicitly populated
docs.strapi.io
. This is done to keep responses light and secure. You must use the ?populate= parameter (or ?populate=* to get all, or deeper syntax for nested) to retrieve nested content in one request
docs.strapi.io
. If your integration script wasn’t doing that, you might see only IDs for relations and then need to fetch those separately.
Components and Dynamic Zones: Strapi also supports components (reusable field groups) and dynamic zones (flexible sections that can hold different types of components). If you modeled something like a “Module” as a component (e.g., a course has a repeatable component list of modules, each module has fields for title, description, etc.), then in the API, those appear as nested objects within the course entry. Dynamic zones similarly appear as arrays of components. This is great for structured content, but again, the API might require populate to include them. A known point is that deeply nested components might need a deep populate (populate=deep,3 for example) or multiple queries if Strapi doesn’t populate sub-components automatically. As of Strapi v4/v5, you can populate nested levels, but you need to specify them.
Handling Nested Data on the Front-end: Given “complex nested structures”, your front-end integration script likely has to reconstruct some HTML for nested data. For example, if a Course includes a list of Module components, the JSON might look like:
"attributes": {
  "title": "Course 101",
  "modules": [
     { "id": 1, "__component": "course.module", "title": "Module A", "lessons": 5 },
     { "id": 2, "__component": "course.module", "title": "Module B", "lessons": 3 }
  ]
}
The JS code should iterate through course.attributes.modules and perhaps create an HTML section for each module. This is all done client-side in your case. It’s straightforward logic, but be mindful of performance if there are many nested items – you might want to minimize DOM updates (e.g., build a string of HTML then assign it, rather than heavy element-by-element insertion).
Content Modeling Best Practices: It sounds like you have already carefully designed your content types. For others reading, it’s worth noting a few best practices you likely followed:
Use clear content type structures that mirror the site’s needs (e.g., a Course has fields like title, description, maybe a difficulty level, and relationships to lessons or categories).
Leverage components for repeatable groups of fields, which keeps the content flexible (like course modules, FAQ sections, etc., can be components).
Use relational fields for real entities (like linking a Course to an Instructor user or to many Lesson entries).
Avoid overly deep nesting if possible because it can complicate data fetching. Sometimes splitting into separate types and relating them (even if it means multiple API calls) can be cleaner than deeply nested components. But if you’ve managed it well, Strapi can handle moderately nested data, especially with the populate feature.
Verification and Audits: As the project grows, maintain consistency in content structure. Strapi doesn’t enforce referential integrity or required relations beyond what you configure, so occasionally review if all courses have the expected sub-entries, etc. The integration script might also need to handle cases where data is missing (e.g., a course with no lessons should not break the page script).
In summary, Strapi’s content modeling capabilities have allowed you to create a rich schema for your e-learning content. You have nested and related data representing the hierarchy of courses. Your integration code fetches this structured data via REST. Just remember to use query parameters to get all necessary fields (especially for images or relations). If you find yourself making many sequential API calls to gather one page’s data, consider optimizing with Strapi’s populate or by creating custom endpoints. For example, a custom endpoint /api/homepage-data could return all needed collections in one shot (by internally querying courses, testimonials, etc.). But that’s an enhancement; the current standard endpoints suffice if used with the right parameters.
Deployment Workflow and Version Control
The project employs Git for version control (hosted on GitHub), which is essential for collaboration and tracking changes both in the front-end code and Strapi backend code. Let’s outline how the deployment and CI/CD might work, and address the noted Vercel integration issues:
Front-end Deployment on Vercel: Your front-end (the static Webflow-based site and integration JS) can be deployed on Vercel. Vercel is well-suited for JAMstack apps; it can host static sites or front-end frameworks. In your case, since it’s mostly static files, Vercel will serve those over its CDN. Typically, you’d have a GitHub repository for the front-end. Whenever you push changes (e.g., updates to the integration JS or HTML), Vercel’s Git integration will auto-build (if there’s a build step) and deploy the new version. If you have no build step (just static files), Vercel simply uploads those. You mentioned some issues with Vercel integration – possibly related to the webhook or environment variables. Common things to check:
Environment Variables: If your JS needs the Strapi URL, set STRAPI_API_URL (or similar) in Vercel’s project settings. In the code, refer to it (e.g., const apiUrl = process.env.STRAPI_API_URL || 'http://localhost:1337';). Since you aren’t using a build tool, you might not have process.env at runtime in the browser. In that case, you could make a small build script or simply hardcode the prod URL in a production version of the file. But a cleaner way is to use a build setup or Vercel’s replacement features. One approach: use Vercel’s environment injection in a Next.js or Astro app – but since you don’t have those, another simple way is to do it manually. This can be an area to refine (perhaps introduce a minimal build process using a tool like Parcel, webpack, or even a tiny Node script to inject the correct URLs before deploying).
Build Command: If you do add a static site generator or any build step, ensure Vercel’s settings have the correct build command and output directory. If it’s pure static, no build command is needed – Vercel will just take the files. However, if you want to generate pages (say using Eleventy or others), then configure that.
Routing: If your site is multi-page and you want to use client-side routing, you’d configure Vercel’s routes. But likely each page is a separate HTML file given Webflow’s export.
Vercel Deploy Hook: As discussed, you have a deploy hook for content updates. To elaborate: Vercel provides a URL (unique to your project) that when hit with an HTTP POST will trigger a deployment. You plug that into Strapi’s webhook. On content changes, Strapi calls it, and Vercel begins a new deploy. The deploy will pull the latest code from GitHub by default. Important: If your content changes but your front-end code hasn’t changed, Vercel will just rebuild the same code. How does it get new content then? Two possibilities:
Runtime fetch model: If your site is purely runtime fetching, redeploying doesn’t necessarily change anything, since the code hasn’t changed. However, redeploy might clear any cached data or just ensure a fresh version. Actually, in this model, a redeploy is not strictly needed for content, because every page load pulls from Strapi live. So triggering Vercel on content edit is somewhat redundant (unless you have ISR caching or something). It might still be useful if you plan to implement incremental static generation later.
Static generation model: If you incorporate a build step that fetches content (e.g., a script that at build time calls Strapi and injects content into the HTML), then the Vercel redeploy will fetch the new content and bake it in. For example, you could have a Node script that runs as part of Vercel build, which calls the Strapi API for courses and writes an HTML file (or JSON file that your page reads). This is advanced, but something to consider to truly use static generation. Many choose a framework like Next.js or Astro to do this heavy lifting. Given you don’t use those, a custom script or using a simpler static site generator (Eleventy, Jekyll with Strapi data, etc.) could be an option.
GitHub and Collaboration: With Git in place, all changes to the front-end code or Strapi code can be reviewed and tracked. You likely have a single repository for the front-end and possibly a separate one for the Strapi backend (or you might keep them in one mono-repo). It’s often cleaner to separate them. That way, deploying Strapi to Railway uses the Strapi repo, and deploying front-end to Vercel uses the front-end repo. This separation aligns with the headless CMS philosophy – the two can evolve independently. For version control of content modeling, since Strapi stores the schema files (in ./src/api/<content-type>/content-types/<name>/schema.json for each type), those are in Git. So changes to content structure (adding a new field, etc.) should be committed. If multiple developers are working, be cautious: if one person changes the content type via the admin UI and doesn’t commit, someone else might override it. It’s best to have a workflow (maybe only make model changes in development and push to Git, then deploy to prod and run migrations). Strapi v4 ensures that if the file schema and database are out of sync, it tries to auto-migrate (for simple changes) on startup.
Deployment Workflow: The ideal workflow is:
Developer makes code changes or config changes in a feature branch.
Test locally (Strapi on localhost, etc.).
Merge to main branch in GitHub.
CI/CD: Vercel auto-deploys the front-end (if any changes there). Railway auto-deploys Strapi (if changes in that repo) – or you manually trigger it.
Content editors add/edit content in Strapi production.
Content changes trigger Vercel redeploy via webhook (if using static generation). If using live fetch, content is immediately live without needing a redeploy.
Given you had “Vercel integration issues,” if those pertain to automatic deploys, ensure the above steps are configured. If it’s about content not showing, it could be due to forgetting to allow public API access or not redeploying when needed – which we’ve addressed by using webhooks or runtime fetch.
Performance and CDN: By deploying on Vercel, your static files are cached on a global CDN. This means users around the world get quick responses for the HTML, CSS, JS. The dynamic content from Strapi (if fetched at runtime) is not CDN-cached by default (unless you implement a caching layer). So there could be a slight delay when the site fetches data from Strapi’s server (especially if Railway’s instance is in one region and user is far from it). If this becomes an issue, you could introduce caching on the front-end (storing responses in localStorage or sessionStorage for repeat visits) or use a proxy/CDN for the API. However, until you have high traffic, this is likely fine. A single course list JSON fetch is usually lightweight.
Backups and Maintenance: Since you manage Strapi, ensure you have backups for the Postgres data (Railway might have a backup feature, or you can periodically export data). Also keep note of your Strapi version – updating Strapi (say from 4.x to 5.x) is a project in itself, so plan those updates carefully and test locally with your content.
Future Improvements (if needed): If down the road you require more dynamic features (like interactive lessons, real-time notifications of new content, etc.), you might consider integrating a front-end framework. But that would add complexity and is not necessary given current priorities. The current stack is advantageous for being lightweight and focused on JAMstack principles.
Finally, maintain clear documentation for your team: how content is modeled, how to deploy, how the front-end integration works. This detailed understanding will help onboard others and troubleshoot issues.
Conclusion
In summary, your e-learning platform is built on a headless CMS + static front-end architecture that prioritizes speed and simplicity. The front-end is a Webflow-designed static site infused with dynamic data via a custom vanilla JS integration. It pulls content from Strapi’s REST API, which provides structured data (courses, users, etc.) secured by Strapi’s permission settings and delivered in JSON over HTTP. Strapi is self-hosted (dev locally, prod on Railway with Postgres), giving you full control over the backend. Content updates flow from Strapi to the site either by on-demand fetching or by triggering static rebuilds. While not real-time in the sense of instantaneous push, this approach ensures content can be updated in a timely manner while keeping the production site highly optimized. By leveraging webhooks and deploy hooks, you can automate the content deployment cycle – a change in Strapi can result in a new static build on Vercel, marrying the conveniences of a CMS with the performance of static files
strapi.io
. If implemented, an editor’s publish action will lead to an updated site without developer intervention. You’ve effectively adopted the JAMstack methodology: JavaScript handles client-side interaction (your integration script), APIs (Strapi’s endpoints) provide the data and functionality (login, content CRUD) over HTTPS, and Markup is prebuilt or served statically via Vercel
strapi.io
. This yields better performance, security, and scalability compared to a traditional monolithic site
strapi.io
. Users get fast page loads from the CDN, and your backend Strapi is freed from serving templates – it only serves data or handles authenticated operations. Going forward, focus on refining the integration (making sure all needed data is fetched efficiently, handling edge cases in the content), strengthening the deployment pipeline (so that content changes are reliably reflected on the site, using the webhook system), and maintaining content structure (as courses or requirements evolve, adjust Strapi models carefully and document any changes). With GitHub version control and the decoupled nature of the system, you can evolve the front-end and backend independently, swap out pieces if needed (for instance, you could replace the front-end with a Next.js app in the future without changing the CMS, or vice versa upgrade the CMS without redesigning the site). In essence, the current way to work with Strapi in your project is as a true headless CMS: editors manage content in Strapi’s admin UI, and that content is exposed via RESTful APIs to be consumed by your static front-end. No detail is missed in this flow – from content modeling in Strapi’s database, through secure API endpoints with JWT auth, to front-end rendering and deployment. By adhering to JAMstack best practices and leveraging Strapi’s features (like webhooks and robust content modeling), you ensure a smooth authoring experience and an optimal end-user experience. Sources:
Strapi REST API auto-generated endpoints
docs.strapi.io
 and default security settings
docs.strapi.io
Strapi Users & Permissions (public vs authenticated roles)
strapi.io
 and authentication workflow
strapi.io
Example of fetching Strapi API data in vanilla JS
stackoverflow.com
stackoverflow.com
JAMstack architecture principles and benefits
strapi.io
strapi.io
Webhook-based deployment for static sites (Strapi + Vercel)
strapi.io
strapi.io
Strapi and Webflow integration concept for automated content updates
codi.pro
Strapi API populate requirement for nested content
docs.strapi.io
Citations

JAMstack - What it is and why you should use it
https://strapi.io/blog/jamstack

JAMstack - What it is and why you should use it
https://strapi.io/blog/jamstack

JAMstack - What it is and why you should use it
https://strapi.io/blog/jamstack

Trying to fetch data from Strapi API and post to HTML page using vanilla Javascript - Stack Overflow
https://stackoverflow.com/questions/77573811/trying-to-fetch-data-from-strapi-api-and-post-to-html-page-using-vanilla-javascr

Trying to fetch data from Strapi API and post to HTML page using vanilla Javascript - Stack Overflow
https://stackoverflow.com/questions/77573811/trying-to-fetch-data-from-strapi-api-and-post-to-html-page-using-vanilla-javascr

REST API reference | Strapi 5 Documentation
https://docs.strapi.io/cms/api/rest

REST API reference | Strapi 5 Documentation
https://docs.strapi.io/cms/api/rest

Guide on Authenticating Requests With the REST API
https://strapi.io/blog/guide-on-authenticating-requests-with-the-rest-api

REST API reference | Strapi 5 Documentation
https://docs.strapi.io/cms/api/rest

Guide on Authenticating Requests With the REST API
https://strapi.io/blog/guide-on-authenticating-requests-with-the-rest-api

The best open-source headless CMS for Railway
https://strapi.io/integrations/railway

The best open-source headless CMS for Railway
https://strapi.io/integrations/railway

What are different ways in which strapi can be deployed?
https://forum.strapi.io/t/what-are-different-ways-in-which-strapi-can-be-deployed/35026

Deploy Strapi 5 - Railway
https://railway.com/deploy/e10OW1

The best open-source headless CMS for Railway
https://strapi.io/integrations/railway

The best open-source headless CMS for Railway
https://strapi.io/integrations/railway

The best open-source headless CMS for Railway
https://strapi.io/integrations/railway

https://strapi.io/blog/how-to-create-an-ssg-static-site-generation-application-with-strapi-webhooks-and-nextjs

Guide on Authenticating Requests With the REST API
https://strapi.io/blog/guide-on-authenticating-requests-with-the-rest-api

Guide on Authenticating Requests With the REST API
https://strapi.io/blog/guide-on-authenticating-requests-with-the-rest-api

https://strapi.io/blog/how-to-create-an-ssg-static-site-generation-application-with-strapi-webhooks-and-nextjs

https://strapi.io/blog/how-to-create-an-ssg-static-site-generation-application-with-strapi-webhooks-and-nextjs

Deployments Using Vercel Deploy Hooks and Strapi Webhooks
https://strapi.io/blog/trigger-deployments-using-vercel-deploy-hook-and-strapi-webhook

https://strapi.io/blog/how-to-create-an-ssg-static-site-generation-application-with-strapi-webhooks-and-nextjs

Integrating Strapi with Webflow for Seamless Content Management - Codi.pro
https://codi.pro/blog/integrating-strapi-with-webflow

Deployments Using Vercel Deploy Hooks and Strapi Webhooks
https://strapi.io/blog/trigger-deployments-using-vercel-deploy-hook-and-strapi-webhook

REST API reference | Strapi 5 Documentation
https://docs.strapi.io/cms/api/rest
All Sources
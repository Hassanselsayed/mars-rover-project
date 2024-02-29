### [Site Link](https://helsayed-mars-rover.netlify.app/)

### Local environment
To run the project locally please follow these steps:
- clone repo from your terminal
- make sure you are using a node version from v18.0.0 and higher
- run `npm install`
- create a `.env` file and add the following variable to it `NASA_API_KEY`, then add your [Nasa Api](https://api.nasa.gov/#mars-rover-photos) Key
- in your terminal, run `npm run dev`

### Project Features
- A single-page application in Nuxt.js with Tailwind CSS integration.
- Performed a GET request to the following [NASA API endpoint](https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=2&api_key=FmcghkDwhYEdeghM4tgl5Z5xdbsPscbqTA32ToNF).
- Parsed the response to display images, including details like the camera used and the landing date.
- Implemented pagination to load 25 images per page.
- Used infinite scrolling for pagination, automatically loading the next page of images as the user reaches the bottom of the current page.
- Displayed each image and its details in a responsive container suitable for both desktop and mobile devices, styled with Tailwind CSS.
- Implemented a feature where clicking on an image opens it in a full-screen modal.
- Included basic error handling for HTTP status codes 403 (Forbidden), 404 (Not Found), and 429 (Too Many Requests).
- Added slider functionality to modal images.
- Hid the API Key from the client side.
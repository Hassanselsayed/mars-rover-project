### [Site Link](https://helsayed-mars-rover.netlify.app/)

## Mars Rover Project
Create a project using Nuxt.js (version 2 or 3) named “Mars Rover Project”, incorporating
Tailwind CSS. This project will interact with NASA’s public API to display images from the Mars
Rover mission.

### Project Requirements
- Create a single-page application in Nuxt.js (v2 or v3) with Tailwind CSS integration.
- Perform a GET request to the following [NASA API endpoint](https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=2&api_key=FmcghkDwhYEdeghM4tgl5Z5xdbsPscbqTA32ToNF).
- Parse the response to display images, including details like the camera used and the landing date.
- Implement pagination to load 25 images per page.
- Use infinite scrolling, automatically loading the next page of images as the user reaches the bottom of the current page.
- Display each image and its details in a responsive container suitable for both desktop and mobile devices, styled with Tailwind CSS.
- Implement a feature where clicking on an image opens it in a full-screen modal. Pressing the escape key should close the modal.
- Include basic error handling for HTTP status codes 403 (Forbidden), 404 (Not Found), and 429 (Too Many Requests).

### Stretch Goals
- Add slider functionality to modal.
- Hide the API Key from the client side.
export default defineEventHandler(async (event) => {
  const { page } = getQuery(event);
  const { apiKey } = useRuntimeConfig();

  const data = await $fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=${page}&api_key=${apiKey}`);

  return data
})
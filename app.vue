<template>
  <div
    v-if="isReady"
    class="bg-gray-100 relative"
  >
    <div class="container mx-auto py-10">
      <h1 class="mb-5 text-center text-xl font-bold">
        A collection of images taken on Mars on 2015-05-30
      </h1>

      <div class="gallery p-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 bg-white rounded-lg" :key="componentKey">
        <div
          v-for="(img, i) in images"
          :key="i"
        >
          <img
            class="main-img rounded-lg"
            :class="`img-${i+1}`"
            :src="img.img_src"
            :alt="getAltText(img)"
            @click="openModal(i)"
          >
          
          <div :id="`modal${i}`" class="hidden bg-gray-400 bg-opacity-90 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 z-50 flex justify-center items-center h-100vh w-100vw">
            <div class="overlay"></div>
            <img
              class="modal-img rounded-lg"
              :src="img.img_src"
              :alt="getAltText(img)"
            >
          </div>

          <small>
            <p>Rover: <strong>{{ img.rover.name }}</strong></p>
            <p>Camera Used: <strong>{{ img.camera.name }}</strong></p>
            <p>Landing Date: <strong>{{ img.rover.landing_date }}</strong></p>
          </small>
        </div>
      </div>

      <h2 class="footer-text mt-10 text-center">
        *** All the data displayed on this page is fetched from the
        <NuxtLink
          class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
          to="https://api.nasa.gov/#mars-rover-photos"
          target="_blank"
        >
          NASA API
        </NuxtLink>
        ***
      </h2>
    </div>
  </div>
</template>

<script setup>
// fetch photos
// const { data } = await useFetch('/api/nasa');
import { onMounted, ref, onUpdated } from 'vue';
let pageNumber = 1;
let isReady = false;
let images = [];
const componentKey = ref(0);

const registerObserver = () => {
  const options = {
    rootMargin: '50px',
    threshold: 0.2
  };
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(async entry => {
      // console.log(entry.intersectionRatio > 0 ? 'visible' : 'invisible');
      console.log(entry.intersectionRatio);
      if (entry.isIntersecting) {
        // console.log('a7a');
        pageNumber++;
        await fetchData();
      }
    });
  }, options);
  const element = document.querySelector(`.img-${images.length - 4}`);
  // const element = document.querySelector(`.gallery`);
  console.log(element);
  observer.observe(element);
}


// add try/catch + internal server
const fetchData = async () => {
  const { data } = await useFetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=${pageNumber}&api_key=FmcghkDwhYEdeghM4tgl5Z5xdbsPscbqTA32ToNF`);
  images = [...images, ...data._rawValue.photos];
  isReady = true;
  componentKey.value += 1;
  if (pageNumber === 1) return;
  // registerObserver();
}

await fetchData();

// const getPhotos = async () => {
//   const { data } = await useFetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=2&api_key=FmcghkDwhYEdeghM4tgl5Z5xdbsPscbqTA32ToNF`);
//   return data._rawValue.photos;
// }

// const images = getPhotos();

onUpdated(() => {
  registerObserver();
  // scroll();
})

onMounted(() => {
  // window.addEventListener('scroll', (e) => {
  //   scroll();
  // })
  // scroll();

  registerObserver();
});

// const scroll = () => {
//   window.onscroll = () => {
//     const bottomOfWindow = Math.max(window.scrollY, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight + 500 === document.documentElement.offsetHeight
//     console.log(Math.max(window.scrollY, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight, document.documentElement.offsetHeight);

//     if (bottomOfWindow) {
//       pageNumber++;
//       fetchData();
//     }
//   }
// }

const openModal = (i) => {
  document.getElementById(`modal${i}`).classList.remove('hidden');
  window.addEventListener('click', (e) => {
    const target = e.target.classList[0];
    if (target === 'main-img' || target === 'modal-img') return;
    closeModal(i);
  })
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal(i);
  })
}

const closeModal = (i) => {
  document.getElementById(`modal${i}`).classList.add('hidden');
}

const getAltText = (img) => {
  return `Image of Mars, taken by the ${img.rover.name} rover, using its ${img.camera.name} camera.`
}

</script>

<style scoped>
.main-img {
  height: 300px;
  width: 100%;
  object-fit: cover;
}

.modal-img {
  max-width: 80vw;
  max-height: 80vh;
  object-fit: cover;
}
</style>

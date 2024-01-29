<template>
  <div
    class="app bg-gray-100 relative"
  >
    <div class="app-container container mx-auto py-10">
      <h1 class="header-text mx-5 mb-5 text-center text-xl font-bold">
        A collection of images taken on Mars on 2015-05-30
      </h1>

      <section class="gallery-section p-5 bg-white rounded-lg min-h-[75vh]">
        <div
          v-if="images.length > 0"
          class="gallery-container grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
          :key="componentKey"
        >
          <div
            v-for="(img, i) in images"
            class="main-images"
            :key="i"
          >
            <img
              class="main-img rounded-lg cursor-pointer"
              :class="`img-${i+1}`"
              :src="img.img_src"
              :alt="getAltText(img)"
              type="button"
              @click="openModal(i)"
            >
            
            <div
              :id="`modal${i}`"
              class="modal hidden bg-gray-400 bg-opacity-90 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 z-50 flex justify-center items-center h-100vh w-100vw"
              >
              <div class="overlay"></div>

              <button
                v-if="activeSlide > 0"
                @click="handleSlider(activeSlide - 1)"
                class="arrow text-xl font-semibold absolute left-10 bottom-10 lg:bottom-1/2"
                title="previous image"
                >
                prev
              </button>

              <img
                class="modal-img rounded-lg"
                :src="img.img_src"
                :alt="getAltText(img)"
              >

              <button
                v-if="activeSlide < images.length - 1"
                @click="handleSlider(activeSlide + 1)"
                class="arrow text-xl font-semibold absolute right-10 bottom-10 lg:bottom-1/2"
                title="next image"
              >
                next
              </button>
            </div>
  
            <small>
              <p>Rover: <strong>{{ img.rover.name }}</strong></p>
              <p>Camera Used: <strong>{{ img.camera.name }}</strong></p>
              <p>Landing Date: <strong>{{ img.rover.landing_date }}</strong></p>
            </small>
          </div>

          <div
            v-if="noMoreMsg"
            class="no-more-data text-center col-span-full mt-5"
          >
            {{ noMoreMsg }}
          </div>
        </div>
  
        <div
          v-if="errorMsg"
          class="blocking-errors flex items-center justify-center h-[60vh] text-center"
          :key="componentKey"
        >
          {{ errorMsg }}
        </div>
      </section>

      <h2 class="footer-text mx-5 mt-10 text-center">
        *** All the data displayed on this page is fetched from the
        <NuxtLink
          class="api-link font-medium text-blue-600 dark:text-blue-500 hover:underline"
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
  import { onMounted, ref, onUpdated } from 'vue';

  let pageNumber = 1,
  images = [],
  noMoreMsg = '',
  errorMsg = '';
  const componentKey = ref(0);
  const activeSlide = ref(-1)

  // methods
  /**
   * register IntersectionObserver to implement infinte scrolling
   */
  const registerObserver = () => {
    const options = {
      rootMargin: '50px',
      threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(async entry => {
        if (!entry.isIntersecting) return;
        
        pageNumber++;
        await fetchData();
      });
    }, options);

    const element = document.querySelector(`.img-${images.length - 4}`);
    observer.observe(element);
  }

  /**
   * make api call to fetch data and handle the response/error
   */
  const fetchData = async () => {
    try {
      const response = await useFetch(`/api/nasa?page=${pageNumber}`);

      const errorCode = response.error._object[response.error._key]?.statusCode; 
      const { data } = response;

      // error handling
      if (errorCode) throw new Error(errorCode);
      if (data._rawValue.photos.length === 0) throw new Error('404');

      // successful api call
      images = [...images, ...data._rawValue.photos];
      componentKey.value += 1;

    } catch (err) {
      componentKey.value = -1;
      getErrorMessage(err.message);
    }
  }

  /**
   * get error message based on thrown error
   * @param  {string} code the error status code
   */
  const getErrorMessage = (code) => {
    // error 429 - too many requests
    if (code === '429') {
      const baseText = 'Too many requests have been made in the past hour. Please wait some time (up to an hour) and try to use the site again.';
      errorMsg = images.length
      ? `Couldn't fetch more data. ${baseText}`  
      : baseText
      return;
    }
    
    // error 404 - not found
    if (code === '404' && images.length) {
      noMoreMsg = 'No more data to fetch. Enjoy the pictures available above.';
      return;
    }
    
    // forbidden/blocked requests
    errorMsg = 'It looks like the API from which we fetch our data has blocked our request. We are working to get it back up shortly.';
  }
  
  /**
   * open modal with image of index 'i'
   * @param  {string} i the image index
   */
  const openModal = (i) => {
    activeSlide.value = i;

    document.getElementById(`modal${i}`).classList.remove('hidden');

    window.addEventListener('click', (e) => {
      const target = [...e.target.classList];
      if (target.includes('main-img') || target.includes('modal-img') || target.includes('arrow')) return;
      closeModal(i);
      activeSlide.value = -1;
    })

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal(i);
        activeSlide.value = -1;
      }
    })
  }

  /**
   * close modal with image of index 'i'
   * @param  {string} i the image index
   */
  const closeModal = (i) => {
    document.getElementById(`modal${i}`).classList.add('hidden');
  }

  /**
   * flip from active slide to new slide in modal
   * @param  {number} newSlide the index of the new slide
   */
  const handleSlider = (newSlide) => {
    closeModal(activeSlide.value);
    openModal(newSlide);
  }

  /**
   * get alt text for image object 'img'
   * @param  {Object} img the image object
   */
  const getAltText = (img) => {
    return `Image of Mars, taken by the ${img.rover.name} rover, using its ${img.camera.name} camera.`;
  }

  
  // lifecycle hooks
  onMounted(() => {
    if (images.length) registerObserver();
  });
  onUpdated(() => {
    registerObserver();
  });
  
  // fetch data on app creation
  await fetchData();
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

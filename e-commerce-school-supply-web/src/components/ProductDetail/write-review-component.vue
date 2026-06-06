<template>
  <div>
    <!-- Show Review Card if user already submitted -->
    <div v-if="userReview">
      <review-card-component
        :review="userReview"
        :editable="true"
        @edit="editReview"
        @delete="deleteReview"
      />
    </div>

    <!-- Show Form if no review submitted -->
        <!-- Show Form if no review submitted -->
    <div v-else>
      <h2 class="text-lg md:text-xl lg:text-2xl font-bold dark:text-white">{{ $t('writeReview.title') }}</h2>
      <div class="flex flex-col sm:flex-row gap-3 md:gap-4 mt-4">
        <!-- Profile -->
        <img :src="profilePicSrc" class="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-400 self-start" />

        <!-- Form -->
        <div class="flex-1 space-y-3">
          <input
            type="text"
            :placeholder="$t('writeReview.placeholder_title')"
            v-model="title"
            class="w-full h-9 md:h-10 px-3 text-sm md:text-base rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1A535C] bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
          <textarea
            :placeholder="$t('writeReview.placeholder_body')"
            v-model="body"
            class="w-full h-32 md:h-40 px-3 py-2 text-sm md:text-base rounded-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1A535C] bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          ></textarea>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 flex-wrap justify-end mt-4">
        <div class="flex flex-col text-xs md:text-sm dark:text-gray-300">
          <label class="font-semibold mb-1">{{ $t('writeReview.recommend_prompt') }}</label>
          <drop-down-component v-model="recommendOption" :options="recommendOptions" />
        </div>

        <div class="flex flex-col text-xs md:text-sm dark:text-gray-300">
          <label class="font-semibold mb-1">{{ $t('writeReview.rating_prompt') }}</label>
          <drop-down-component v-model="starOption" :options="starOptions" />
        </div>

        <button
          v-if="isEditing"
          @click="cancelEdit"
          class="sm:mt-6 px-4 md:px-6 py-2 md:py-3 text-sm md:text-base bg-gray-500 text-white rounded-sm font-semibold dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-700 transition"
        >
          {{ $t('writeReview.cancel_button') || 'Cancel' }}
        </button>

        <button
          @click="submitReview"
          class="sm:mt-6 px-4 md:px-6 py-2 md:py-3 text-sm md:text-base bg-[#1A535C] text-white rounded-sm font-semibold dark:bg-[#1A535C] dark:text-gray-100 dark:hover:bg-[#2A7A8F] transition"
        >
          {{ isEditing ? ($t('writeReview.update_button') || 'Update') : $t('writeReview.post_button') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, type PropType } from "vue";
import DropDownComponent from "./drop-down-component.vue";
import ReviewCardComponent from "./review-card-component.vue";
import BlankProfile from '@/assets/images/pfp_blank.jpeg'

const API_BASE_URL = import.meta.env.VITE_API_URL || ''

interface Review {
  id: string | number;
  profile: string;
  name: string;
  title: string;
  body: string;
  rating: number;
  recommend: boolean;
  verified: boolean;
  date: string;
}

export default defineComponent({
  name: "WriteReviewComponent",
  components: { DropDownComponent, ReviewCardComponent },

  props: {
    profilePic: {
      type: String,
      default: ""
    },
    currentUserName: {
      type: String,
      required: true
    },
    userReview: {
      type: Object as PropType<Review | null>,
      default: null
    }
  },

  emits: ["submit-review", "delete-review", "cancel-edit", "edit-review"],

  setup(props, { emit }) {
    const profilePicSrc = computed(() => {
      const raw = props.profilePic
      if (typeof raw !== 'string') return BlankProfile
      const s = raw.trim()
      if (!s) return BlankProfile
      if (s.startsWith('/')) return `${String(API_BASE_URL).replace(/\/$/, '')}${s}`
      if (/^(https?:\/\/|data:image\/|blob:|\.{1,2}\/)/.test(s)) return s
      return BlankProfile
    })

    const title = ref("");
    const body = ref("");
    const starOption = ref("0");
    const recommendOption = ref("true");
    const isEditing = ref(false);
    const originalReview = ref<Review | null>(null);

    const recommendOptions = [
      { label: "Yes", value: "true" },
      { label: "No", value: "false" }
    ];

    const starOptions = [
      { label: "0 Stars", value: "0" },
      { label: "5 Stars", value: "5" },
      { label: "4 Stars", value: "4" },
      { label: "3 Stars", value: "3" },
      { label: "2 Stars", value: "2" },
      { label: "1 Star", value: "1" }
    ];

    const submitReview = () => {
      if (!title.value || !body.value) return;
      if (Number(starOption.value) <= 0) return;

      emit("submit-review", {
        id: Date.now(),
        profile: props.profilePic,
        name: props.currentUserName,
        title: title.value,
        body: body.value,
        rating: Number(starOption.value),
        recommend: recommendOption.value === "true",
        verified: true,
        date: new Date().toISOString()
      });

      title.value = "";
      body.value = "";
      starOption.value = "0";
      recommendOption.value = "true";
    };

    const editReview = () => {
      if (!props.userReview) return;
  console.log('📝 Edit review clicked:', props.userReview);

      // Store original review for cancel
      originalReview.value = { ...props.userReview };
      isEditing.value = true;

      title.value = props.userReview.title;
      body.value = props.userReview.body;
      starOption.value = props.userReview.rating.toString();
      recommendOption.value = props.userReview.recommend ? "true" : "false";
  console.log('📝 Form populated:', { title: title.value, body: body.value, rating: starOption.value });

      // Emit edit event to hide review card (don't delete from backend)
      emit("edit-review");
    };

    const cancelEdit = () => {
      // Clear form
      title.value = "";
      body.value = "";
      starOption.value = "0";
      recommendOption.value = "true";
      isEditing.value = false;
      
      // Restore original review by re-emitting it
      if (originalReview.value) {
        emit("cancel-edit", originalReview.value);
        originalReview.value = null;
      }
    };

    const deleteReview = () => {
      if (!props.userReview) return;
      emit("delete-review", props.userReview.id);
    };

    return {
      profilePicSrc,
      title,
      body,
      starOption,
      recommendOption,
      recommendOptions,
      starOptions,
      isEditing,
      submitReview,
      editReview,
      cancelEdit,
      deleteReview
    };
  }
});
</script>


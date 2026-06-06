<template>
  <div class="dark:bg-gray-900 transition-colors">
    <section class="relative w-full h-screen">
      <!-- Background image with dark overlay -->
      <div class="absolute inset-0">
        <img
          :src="bgSchool"
          alt="Back-to-school scene"
          class="w-full h-full object-cover"
        />
        <!-- Dark overlay -->
        <div class="absolute inset-0 bg-black opacity-50"></div>
      </div>

      <!-- Overlay content -->
      <div class="relative z-10 flex flex-col justify-between h-full text-white px-4 md:px-8 lg:px-0">
        <!-- Top left content -->
        <div class="text-left w-full md:w-[90%] lg:w-[500px] lg:ml-20 mt-16 md:mt-24 lg:mt-30">
          <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-[60px] font-bold italic">{{ $t('aboutUs.title') }}</h2>
          <p class="text-sm sm:text-base md:text-lg lg:text-[20px] mt-2 md:mt-4">
            {{ $t('aboutUs.description') }}
          </p>
        </div>

        <!-- Bottom right content -->
        <div class="flex justify-start md:justify-end lg:mr-20 mb-6 md:mb-10">
            <p class="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-relaxed italic text-left md:text-right w-full md:w-[90%] lg:w-[850px]">
            {{ $t('aboutUs.mission') }}
          </p>
        </div>
      </div>

    </section>

    <section class="flex flex-col md:flex-row items-center justify-center md:justify-around w-full py-8 md:py-12 px-4 md:px-6 lg:px-4 gap-6 md:gap-4 lg:gap-8 bg-white dark:bg-gray-800 transition-colors">
      <div class="bg-[#1A535C] dark:bg-[#1A535C] rounded-xl text-white p-6 md:p-8 w-full md:w-[45%] lg:w-3xl">
        <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-[55px] font-bold font-quicksand dark:text-white">{{ $t('aboutUs.goal_title') }}</h2>
        <p class="text-base sm:text-lg md:text-[20px] font-lato dark:text-gray-100 mt-2 md:mt-4">
          {{ $t('aboutUs.goal_description') }}
        </p>
      </div>

      <div class="bg-[#1A535C] dark:bg-[#1A535C] rounded-xl text-white p-6 md:p-8 w-full md:w-[45%] lg:w-3xl">
        <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-[55px] font-bold font-quicksand dark:text-white">{{ $t('aboutUs.vision_title') }}</h2>
        <p class="text-base sm:text-lg md:text-[20px] font-lato dark:text-gray-100 mt-2 md:mt-4">
          {{ $t('aboutUs.vision_description') }}
        </p>
      </div>
    </section>

    <section class="py-8 md:py-12 px-4 md:px-6 bg-gray-50 dark:bg-gray-800 transition-colors">
      <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-[55px] font-bold text-center mb-6 md:mb-10 font-quicksand dark:text-white">{{ $t('aboutUs.team_title') }}</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 mb-6 md:mb-10 max-w-7xl mx-auto">
        <MemberCard
          name="Lim Kity"
          :role="$t('aboutUs.role_frontend')"
          email="kitylim123@gmail.com"
          :avatar="Kity"
          facebook="https://web.facebook.com/kity.lim.5/"
          github="https://github.com/Ty-168"
          linkedin="https://linkedin.com/in/kity"
        />
        <MemberCard
          name="Luy Lyhor"
          :role="$t('aboutUs.role_frontend_designer')"
          email="horhorsloy@gmail.com"
          :avatar="Lyhor"
          facebook="https://facebook.com/lyhor"
          github="https://github.com/lyhor"
          linkedin="https://linkedin.com/in/lyhor"
        />
        <MemberCard
          name="Im Chheanngim"
          :role="$t('aboutUs.role_tester')"
          email="ngimgim168@gmail.com"
          :avatar="Chheangngim"
          facebook="https://facebook.com/gim"
          github="https://github.com/gim"
          linkedin="https://linkedin.com/in/gim"
        />
        <MemberCard
          name="Loeng Pheaktra"
          :role="$t('aboutUs.role_frontend')"
          email="tratra67@gmail.com"
          :avatar="Pheaktra"
          facebook="https://web.facebook.com/loeng.pheaktra"
          github="https://github.com/pheaktra01"
          linkedin="https://www.linkedin.com/in/loeng-pheaktra-b4b8053a6/"
        />
        <MemberCard
          name="La Vireak"
          :role="$t('aboutUs.role_fullstack')"
          email="lavireak@gmail.com"
          :avatar="Vireak"
          facebook="https://facebook.com/vireak"
          github="https://github.com/LaVireak"
          linkedin="https://linkedin.com/in/vireak"
        />
      </div>

    </section>
  </div>

</template>


<script setup lang="ts">
import bgSchool from '@/assets/images/bgSchool.png'
import MemberCard from '@/components/MemberCard.vue'
import Kity from '@/assets/images/members/lim_kity.png'
import Vireak from '@/assets/images/members/la_vireak.jpg'
import Lyhor from '@/assets/images/members/luy_lyhor.jpg'
import Pheaktra from '@/assets/images/members/loeng_pheaktra.png'
import Chheangngim from '@/assets/images/members/im_chheangngim.jpg'
</script>

<template>
  <div class="default-layout min-h-screen flex flex-col">
    <TheNavbar />
    <main class="flex-auto">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>

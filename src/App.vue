<template>
  <main class="main" font-sans w-full text="center gray-700 dark:gray-200">
    <Header />
    <RouterView />
  </main>
</template>

<style>
@media screen and (min-width: 1366px) {
  .nav,.content {
    max-width: 1366px;
    padding-left: 60px;
    padding-right: 60px;
  }
}

@media screen and (min-width: 1440px) {
  .nav,.content {
    max-width: 1440px;
    padding-left: 90px;
    padding-right: 90px;
  }
}

@media screen and (min-width: 1680px) {
  .nav,.content {
    max-width: 1680px;
    padding-left: 120px;
    padding-right: 120px;
  }
}

@media screen and (min-width: 1920px) {
  .nav,.content {
    max-width: 1920;
    padding-left: 240px;
    padding-right: 240px;
  }
}
</style>

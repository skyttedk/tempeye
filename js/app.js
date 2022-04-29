const debugging = false;

function loadPage(page) {
  dataStore.page = page;
  saveConfiguration();
  location.reload();
}
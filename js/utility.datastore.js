let dataStore = null



function deleteConfiguration() {
  localStorage.removeItem("dataStore")
}

function loadConfiguration() {
  dataStore = JSON.parse(localStorage.getItem("dataStore"))
  if (dataStore == null) {
    //Create new default config
    dataStore = {
      page: 'page.main',
      devices: [
        { id: generateShortGuid(), name: "device_1", description: "Device 1", category: "", type: "", alarms: [] }
      ],
      user: {
        phone: "",
        email: "",
        receiveSms: false,
        receiveEmail: false,
      },
      ably: {
        channelId: 'f1e82afb-f24e-46ae-af7d-14b70afe4e8c',
        APIKEY: 'xyojOQ.rayVcQ:S0AJDREybgNnOC3kzGJLKxzZo6DBgoCU_6WMhhjRtjk' //Security breach
      }
    }
    saveConfiguration()
  }
  if (debugging == true)
    console.log(JSON.stringify(dataStore, 0, 4))
}

function saveConfiguration() {
  localStorage.setItem("dataStore", JSON.stringify(dataStore))
}
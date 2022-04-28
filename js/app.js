let config = null;
//create a monolithic datastore
let dataStore = null

function renderApp() {
  loadConfiguration();
  renderComponents(Array.from($("[data-component]")))
}

function renderComponents(elements) {
  for (element of elements) {

    element.id = generateShortGuid()
    let template = "components/" + element.getAttribute("data-component") + ".mustache"
      //let dataObjectName = element.getAttribute("data-source")
      //let dataObj = window[dataObjectName];
    renderComponent(template, element)
  }
}

function renderComponent(path, target) {
  fetch(path)
    .then((response) => response.text())
    .then((template) => {
      var rendered = Mustache.render(template, dataStore);
      $(target).html(rendered)

      // check if we have nested components!!
      let elements = $(`#${target.id} [data-component]`)
      elements = Array.from(elements)

      let componentName = path.split("/")[1].split(".")[0]

      componentsFiltered = elements.filter(function(element) {
        return element.getAttribute("data-component") != componentName
      })
      if (componentsFiltered.length > 0) {
        renderComponents(componentsFiltered)
      }
    });
}

function generateShortGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

}
//QR scanner

//References
/*
    //QR
    https://blog.minhazav.dev/research/html5-qrcode.html
    https://github.com/mebjas/html5-qrcode

*/
function sqanDevice() {
  Html5Qrcode.getCameras().then(devices => {

    //Start scanning
    const html5QrCode = new Html5Qrcode("reader");
    html5QrCode.start({ facingMode: "environment" }, {
          fps: 10, // Optional, frame per seconds for qr code scanning
          qrbox: {
            width: 250,
            height: 250
          } // Optional, if you want bounded box UI
        },
        (decodedText, decodedResult) => {
          // do something when code is read
          //do stuff

          html5QrCode.stop().then((ignore) => {
            // QR Code scanning is stopped.
            alert('this is the decoded text: ' + decodedText);
          }).catch((err) => {
            // Stop failed, handle it.
          });


        },
        (errorMessage) => {})
      .catch((err) => {});
  }).catch(err => {
    // handle err
  });
}

//Local storage
//TODO:

// device categorty: animal
// devices.type : hun
// devices.name : bil_1

/**
  user : {
    phone: "",
  } ,
  devices : {
    [{
        id: "",
        profile : //profiler loades måske fra en server (REST API)
        category: "",
        type : "",
        alarms : [],
    }]
  }
  
  en profil skal definere
    min temperatur
    max temperatur  osv...
     
 */

localStorage.removeItem("dataStore")

function loadConfiguration() {
  dataStore = JSON.parse(localStorage.getItem("dataStore"))
  if (dataStore == null) {
    //Create new default config
    dataStore = {
      devices: [
        { id: generateShortGuid(), name: "bob1", description: "bob1's device", category: "animal", type: "cat", alarms: [] },
        { id: generateShortGuid(), name: "bob2", description: "bob2's device", category: "animal", type: "cat", alarms: [] },
        { id: generateShortGuid(), name: "bob3", description: "bob3's device", category: "animal", type: "cat", alarms: [] },
      ],
      user: {
        phone: "26190720"
      }
    }
    saveConfiguration()
  }
  console.log(JSON.stringify(dataStore))
}

function saveConfiguration() {
  localStorage.setItem("dataStore", JSON.stringify(dataStore))
}
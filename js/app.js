let dataStore = null
let ably = null

function renderApp() {
  loadConfiguration();
  setupAbly();
  renderComponents(Array.from($("[data-component]")))
}

function renderComponents(elements) {
  for (element of elements) {
    element.id = generateShortGuid()
    let attributes = namedNodemapToObject(element.attributes);
    let template = "components/" + element.getAttribute("data-component") + ".mustache"
    renderComponent(template, element, attributes)
  }
}


async function renderComponent(path, target, attributes) {

  try {
    let template = await fetch(path)
    let templateString = await template.text()
    let dataStoreCopy = JSON.parse(JSON.stringify(dataStore))
      //merge dataSToreCopy and attributes
    for (let key in attributes) {
      dataStoreCopy[key] = attributes[key]
    }

    let rendered = Mustache.render(templateString, dataStoreCopy);
    $(target).html(rendered)

    // check if we have nested components!!
    let elements = $(`#${target.id} [data-component]`)
    elements = Array.from(elements)

    let componentName = path.split("/")[1].split(".")[0]
    console.log("Rendering component:" + componentName)

    componentsFiltered = elements.filter(function(element) {
      return element.getAttribute("data-component") != componentName
    })
    if (componentsFiltered.length > 0) {
      renderComponents(componentsFiltered)
    }
  } catch (error) {

  }


}

function namedNodemapToObject(nodemap) {
  let obj = {}
  for (let node of nodemap) {
    obj[node.nodeName] = node.nodeValue
  }
  return obj
}


function setupAbly() {
  ably = new Ably.Realtime(dataStore.ably.APIKEY);

  ably.connection.on('connected', () => {
    //TODO: HVad hvis vi ikke kan forbinde til ably?
    console.log("Ably connected");


    const channel = ably.channels.get(channelId);

    channel.subscribe(deviceId, (message) => {
      console.log(`Received a greeting message in realtime: ${JSON.stringify(message.data)}`);
      $("#gmTemperature").gaugeMeter({
        percent: message.data.temperature
      });

      $("#gmHumidity").gaugeMeter({
        percent: message.data.humidity
      });

      //update timestamp
      //format timestamp to nordic format
      var date = new Date(message.data.timeStamp);
      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var seconds = date.getSeconds();
      var nordicDate = day + "-" + month + "-" + year + " " + hours + ":" + minutes + ":" + seconds;
      $("#timeStamp").html(nordicDate);

    });

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
function scanDevice() {
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


function loadPage(page) {
  dataStore.page = page;
  saveConfiguration();
  location.reload();
}
//localStorage.removeItem("dataStore")

function loadConfiguration() {
  dataStore = JSON.parse(localStorage.getItem("dataStore"))
  if (dataStore == null) {
    //Create new default config
    dataStore = {
      page: 'page.main',
      devices: [
        { id: generateShortGuid(), name: "bentley", description: "illy mess. 1", category: "", type: "", alarms: [] },
        { id: generateShortGuid(), name: "bob2", description: "bob2's device", category: "animal", type: "cat", alarms: [] },
        { id: generateShortGuid(), name: "bob3", description: "bob3's device", category: "animal", type: "cat", alarms: [] },
      ],
      user: {
        phone: "26190720"
      },
      ably: {
        channelId: 'f1e82afb-f24e-46ae-af7d-14b70afe4e8c',
        APIKEY: 'xyojOQ.rayVcQ:S0AJDREybgNnOC3kzGJLKxzZo6DBgoCU_6WMhhjRtjk' //Security breach
      }
    }
    saveConfiguration()
  }
  console.log(JSON.stringify(dataStore, 0, 4))
}

function saveConfiguration() {
  localStorage.setItem("dataStore", JSON.stringify(dataStore))
}
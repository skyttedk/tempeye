/**
 * mystache.js
 * author: sigurd.skytte@gmail.com
 * decription: A simple extension for the mustache template engine.
 */
function renderApp() {
  loadConfiguration();
  setupAbly();
  renderComponents(Array.from($("[component]")))
}

function renderComponents(elements) {
  for (element of elements) {
    element.id = generateShortGuid()
    let attributes = namedNodemapToObject(element.attributes);
    let template = "components/" + element.getAttribute("component") + ".mustache"
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

    let componentName = path.split("/")[1].split(".")[0]
    if (debugging == true)
      console.log("Rendering component:" + componentName)

    let rendered = Mustache.render(templateString, dataStoreCopy);


    $(target).html(rendered)

    // check if we have nested components!!
    let elements = $(`#${target.id} [component]`)
    elements = Array.from(elements)



    componentsFiltered = elements.filter(function(element) {
      return element.getAttribute("component") != componentName
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


function generateShortGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

}
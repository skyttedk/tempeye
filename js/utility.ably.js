let ably = null
let ablyConnected = false;
let mainChannel = 'tempeye';

function setupAbly() {
  ably = new Ably.Realtime(dataStore.ably.APIKEY);

  ably.connection.on('connected', () => {
    //TODO: HVad hvis vi ikke kan forbinde til ably?
    if (debugging == true)
      console.log("Ably connected");

    let ablyConnected = true;

  });
}



//format timestamp to nordic format
function toNordicTimeStamp(timeStamp) {
  var date = new Date(timeStamp);
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  var nordicDate = day + "-" + month + "-" + year + " " + hours + ":" + minutes + ":" + seconds;
  return nordicDate;
}
let ably = null


function setupAbly() {
  ably = new Ably.Realtime(dataStore.ably.APIKEY);

  ably.connection.on('connected', () => {
    //TODO: HVad hvis vi ikke kan forbinde til ably?
    if (debugging == true)
      console.log("Ably connected");


    //TODO: Her skal vi loope over alle devices og subscribe til alle deres channels
    let dummyChannel = 'test'
    let dummyDeviceId = 'test'
    const channel = ably.channels.get(dummyChannel);

    channel.subscribe(dummyDeviceId, (message) => {
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
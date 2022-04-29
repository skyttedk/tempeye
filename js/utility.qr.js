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
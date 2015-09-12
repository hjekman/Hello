  if (!window.plugins) {
    window.plugins = {}
  }

  var lastScanId = "";
  var scanCode = function(id)
  {

    window.plugins.barcodeScanner.scan(
      function(result) {

          if (! result.cancelled)
          {
              $.ajax({
                  url: "http://api.openweathermap.org/data/2.5/weather",
                  data: "?q=London&mode=xml",
                  success: function ( xml ) { alert( $(xml).find("current>wind>direction").attr("name").text(); scanCode(); }
              }); } },

      function(error) {
        alert("Scan failed: " + error);
      }
    );

  }

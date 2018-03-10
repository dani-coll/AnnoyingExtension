function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    var tab = tabs[0];
    var url = tab.url;
    callback(url);
  });
}

function runScript(script, callback) {
  chrome.tabs.executeScript({
    code: script
  }, callback);
}

function getRandomNumber(max) {
  return Math.floor((Math.random() * max) + 1);
}

function generateDot() {
  setInterval( () => {
    var script = "var dot = document.createElement('div')"
    runScript(script, (a) => {
      script = "window.innerWidth"
      runScript(script, (width) => {
        var leftPx = getRandomNumber(width)
        script = "window.innerHeight"
        runScript(script, (height) => {
          var topPx = getRandomNumber(height)
          script = "dot.style = \"background-color: black; width: 1px; height: 1px; display: block; position: fixed; top: "+ topPx  + "px; left: "+ leftPx + "px; z-index: 900;\""
          runScript(script, (a) => {
            script = "document.getElementsByTagName(\"BODY\")[0].appendChild(dot)";
            runScript(script)
          })
        })
      })
    });
  }, 2000)
}

function generateDisturb(disturbType) {
  generateDot()
}


document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url) => {
    var dropdown = document.getElementById('dropdown');
    dropdown.addEventListener('change', () => {
      generateDisturb(dropdown.value);
    });
  });
});

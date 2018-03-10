const dotStyleScript = "dot.style = \"background-color: red; width: 1px; height: 1px; display: block; position: fixed; z-index: 900;"
const appendDotScript = "document.getElementsByTagName(\"BODY\")[0].appendChild(dot)"
const getWindowHeightScript = "window.innerHeight"
const createDotScript = "var dot = document.createElement('div')"

const maxTopDiff = 150

const treeDirection = {
  top: 1,
  right: 2
}

function runScript(script, callback) {
  chrome.tabs.executeScript({
    code: script
  }, callback);
}

function getRandomNumber(max) {
  return Math.floor((Math.random() * max) + 1);
}

function styleDot(topPx, leftPx) {
  return dotStyleScript + "top: " + topPx + "px;left: " + leftPx + "px;\""
}

function generateScratch(isTree, direction, leftStart, topStart, callback) { 
  let mDirection = direction ? direction : treeDirection.top
  let leftPx = leftStart ? leftStart : 0
  let topDiff = 0
  let timer = setInterval( function() {
    let script = createDotScript
      runScript(script, (a) => {
        script = getWindowHeightScript
        runScript(script, (height) => {
          topPx = topStart ? topStart - topDiff : (height * 4 / 5 - topDiff)
          script = styleDot(topPx, leftPx)
          runScript(script, (width) => {
            script = appendDotScript
            runScript(script, () => {
              if(mDirection === treeDirection.top) {
                if(getRandomNumber(3)%3 == 0) leftPx++;
                topDiff += 2
              } else {
                if(getRandomNumber(3)%3 == 0) topDiff++;
                leftPx += 2;
              }
              if(topDiff > maxTopDiff || (mDirection === treeDirection.right && topDiff > maxTopDiff/2) || topPx < 0) {
                clearInterval(timer)
                if(isTree && topPx > 0) {
                  generateScratch(isTree, treeDirection.top, leftPx, topPx, generateScratch.bind(this, isTree, treeDirection.right, leftPx, topPx, callback))
                } else {
                  if(callback) callback()
                }
                
              } 
            })
          })
        })
      })
  }, 50)
}

function hideRandomElements() {

}


function generateDots() {
  setInterval( () => {
    let script = createDotScript
    runScript(script, (a) => {
      script = "window.innerWidth"
      runScript(script, (width) => {
        let leftPx = getRandomNumber(width)
        script = getWindowHeightScript
        runScript(script, (height) => {
          let topPx = getRandomNumber(height)
          script = styleDot(topPx, leftPx)
          runScript(script, (a) => {
            script = appendDotScript
            runScript(script)
          })
        })
      })
    });
  }, 10)
}

function generateDisturb(disturbType) {
  switch(disturbType) {
    case '1':
      generateDots()
    break;
    case '2':
      generateScratch(false)
    break;
    case '3':
      generateScratch(true)
    break;
    case '4':
      hideRandomElements()
    break;
  }
}


document.addEventListener('DOMContentLoaded', () => {
  var dropdown = document.getElementById('dropdown');
  dropdown.addEventListener('change', () => {
    generateDisturb(dropdown.value);
  });
});

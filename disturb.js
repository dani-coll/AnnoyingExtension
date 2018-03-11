const dotStyleScript = "dot.style = \"background-color: red; width: 1px; height: 1px; display: block; position: fixed; z-index: 900;"
const appendDotScript = "document.getElementsByTagName(\"BODY\")[0].appendChild(dot)"
const getWindowHeightScript = "window.innerHeight"
const getWindowWidthScript = "window.innerWidth"
const elementsLengthScript = "allElements.length"
const createAllElements = "allElements = document.getElementsByTagName(\"*\")"
const createDotScript = "dot = document.createElement('div')"

const treeDirection = {
  top: 1,
  right: 2
}

var isExtensionScope = true

function runScript(script, callback) {
    if(isExtensionScope) {
        chrome.tabs.executeScript({
            code: script
        }, callback);
    } else {
        let myScript = new Function (script);
        let result = myScript()
        if(callback) callback(result)
    }
}

function getRandomNumber(max) {
  return Math.floor((Math.random() * max) + 1);
}

function styleDot(topPx, leftPx) {
  return dotStyleScript + "top: " + topPx + "px;left: " + leftPx + "px;\""
}


//TO DO: Generate multiple branches at the same time using different variables for each thread
function generateScratch(isTree, direction, leftStart, topStart, callback) { 
  let maxIterations = 70
  let mDirection = direction ? direction : treeDirection.top
  let leftPx = leftStart ? leftStart : 0
  let topDiff = 0
  let iteration = 0
  let timer = setInterval( () => {
    let script = isExtensionScope ? "var " + createDotScript : createDotScript
      runScript(script, () => {
        script = !isExtensionScope ? "return " + getWindowHeightScript : getWindowHeightScript
        runScript(script, (height) => {
          topPx = topStart ? topStart - topDiff : (height * 4 / 5 - topDiff)
          script = styleDot(topPx, leftPx)
          runScript(script, () => {
            script = appendDotScript
            runScript(script, () => {
              if(mDirection === treeDirection.top) {
                if(getRandomNumber(3)%3 == 0) leftPx++;
                  topDiff += 2
              } else if(getRandomNumber(3)%3 == 0) {
                  topDiff++;
                  leftPx += 2;
              } 
              iteration++
              if(
                    iteration > maxIterations
                    || topPx < 0
                ) {
                clearInterval(timer)
                if(isTree && topPx > 0) {
                  generateScratch(
                                    isTree, 
                                    treeDirection.top, 
                                    leftPx, 
                                    topPx, 
                                    generateScratch.bind(this, isTree, treeDirection.right, leftPx, topPx, callback)
                                )
                } else if(callback) callback()
              } 
            })
          })
        })
      })
  }, 50)
}

function hideRandomElements() {
  let maxIterations = 200
  let iteration = 0
  let hideInterval = setInterval( () => {
    let script = isExtensionScope ? "var " + createAllElements : createAllElements
    runScript(script, () => {
      script = !isExtensionScope ? "return " + elementsLengthScript : elementsLengthScript
      runScript(script, (elementsLength) => {
        let randomNumber = getRandomNumber(elementsLength)
        script = "allElements[" + randomNumber + "].style.opacity = '0'"
        runScript(script, () => {
          ++iteration
          if(iteration > maxIterations) clearInterval(hideInterval)
        })
      })
    })
  }, 1000)
}

function generateDots() {
  let maxIterations = 100
  let iteration = 0
  let dotInterval = setInterval( () => {
    let script = createDotScript
    runScript(script, () => {
      script = !isExtensionScope ? "return " + getWindowWidthScript : getWindowWidthScript
      runScript(script, (width) => {
        let leftPx = getRandomNumber(width)
        script = !isExtensionScope ? "return " + getWindowHeightScript : getWindowHeightScript
        runScript(script, (height) => {
          let topPx = getRandomNumber(height)
          script = styleDot(topPx, leftPx)
          runScript(script, () => {
            script = appendDotScript
            runScript(script, () => {
              ++iteration
              if(iteration > maxIterations) clearInterval(dotInterval)
            })
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
  let items = {
    disturb: disturbType
  }
  chrome.storage.sync.set(items)
  
}
function shuffle(array) {
  var currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

let csvFile = "";
const openFile = function (event) {
  const input = event.target;

  const reader = new FileReader();
  reader.onload = function () {
    csvFile = reader.result;
    setUp();
  };
  reader.readAsText(input.files[0]);
};

let rawData = [];
let curTile = null;
let correct = 0;
let remain = 0;
let wrong = 0;
const extractData = (rawData) => {
  let data = [];

  for (let i = 0; i < rawData.length; i++) {
    data.push({
      pair: i,
      value: rawData[i][0],
    });

    data.push({
      pair: i,
      value: rawData[i][1],
    });
  }
  return shuffle(data);
};

const tileClick = (div) => {
  console.log(div.getAttribute("pair"));
  if (!curTile) {
    div.className += " selected";
    curTile = div;
  } else {
    if (div.id === curTile.id) {
      // Click on current tile
      div.className = div.className.replace("selected", "").trim();
    } else if (div.getAttribute("pair") === curTile.getAttribute("pair")) {
      // Correct
      div.onclick = () => {};
      curTile.onclick = () => {};
      div.className += " correct";
      curTile.className +=
        div.className.replace("selected", "").trim() + " correct";
      correct++;
      remain--;
      if (remain === 0) {
        congrats();
      }
    } else {
      // Wrong
      div.className = div.className.replace("selected", "").trim();
      curTile.className = curTile.className.replace("selected", "").trim();

      div.className += " wrong";
      curTile.className += " wrong";

      wrong++;
    }
    curTile = null;
    setStatistics();
  }
};

const congrats = () => {
  const congratDiv = document.createElement("div");
  congratDiv.innerHTML = `<lottie-player
  class="congrat"
  src="https://assets10.lottiefiles.com/packages/lf20_htmzfjyu.json"
  background="transparent"
  speed="1"
  loop
  count="1"
  autoplay
></lottie-player>`;
  document.getElementById("body").appendChild(congratDiv);

  setTimeout(() => {
    document.getElementById("body").removeChild(congratDiv);
  }, 5000);
};

const animationEnd = (div) => {
  div.className = div.className.replace("wrong").trim();
};

const setStatistics = () => {
  document.getElementById("remain").innerText = remain;
  document.getElementById("correct").innerText = correct;
  document.getElementById("wrong").innerText = wrong;
};

const getRawData = () => {
  rawData = $.csv.toArrays(csvFile);
};

const setUp = () => {
  //Reset
  document.getElementById("content").innerHTML = "";

  getRawData();
  const data = extractData(rawData);
  remain = data.length / 2;
  setStatistics();
  for (let i = 0; i < data.length; i++) {
    const tileDiv = document.createElement("div");
    tileDiv.addEventListener(
      "animationend",
      () => animationEnd(tileDiv),
      false
    );
    tileDiv.className = "tile";
    tileDiv.id = i;
    tileDiv.setAttribute("pair", data[i].pair);
    tileDiv.onclick = () => tileClick(tileDiv);
    tileDiv.innerHTML = `<span class="tile-content">${data[i].value}</span>`;
    document.getElementById("content").appendChild(tileDiv);
  }
};

const refresh = () => {
  correct = 0;
  wrong = 0;
  remain = 0;
  setStatistics();
  document.getElementById(
    "content"
  ).innerHTML = `<input type="file" accept=".csv" onchange="openFile(event)" />`;
};

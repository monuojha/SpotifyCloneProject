// globle varibleS//
let allsongs;
let currfolder;

// time in mm:ss converter function//

function convertSecondsToMMSS(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = Math.floor(seconds % 60);

  // Pad the minutes and seconds with leading zeros if needed
  let paddedMinutes = minutes.toString().padStart(2, "0");
  let paddedSeconds = remainingSeconds.toString().padStart(2, "0");

  return `${paddedMinutes}:${paddedSeconds}`;
}

// cuurentsong//

let currentsong = new Audio();
async function getsong(folder) {
  currfolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith("mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);

      // by slpiting we get array with 2-element, i choosed second //
    }
  }

  return songs;
}
// ---------------//

// playsong function //

function playMusic(track, pause = false) {
  // let audio =new Audio( "/music/" + track) it play multiple songs
  currentsong.src = `/${currfolder}/` + track;
  if (!pause) {
    currentsong.play();
    play.src = " /image/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songTime").innerHTML = "00:00/00:00";
}

// --------------//

async function mainsong() {
  // get song list //
  allsongs = await getsong("music/copyright");
  playMusic(allsongs[0], true);

  // list of all songs in library

  let songUrlList = document
    .querySelector(".songsList")
    .getElementsByTagName("ul")[0];
  songUrlList.innerHTML = " ";

  for (const songs of allsongs) {
    songUrlList.innerHTML =
      songUrlList.innerHTML +
      `<li>
        
         
                            <div class="la-box">
                            <img src="image/music.svg" alt="">
                            
                                <div class="musicName">
                                    <p>${songs.replaceAll("%20", " ")}</p>
                                   <div class="play">
                                    <img src="image/playPu.svg" alt="">
                                   </div>
                                </div>
                           
                        </div>
                        </li>
         `;
  }

  // attack eventlisner for each song//

  let getEachSong = document
    .querySelector(".songsList")
    .getElementsByTagName("li");

  let arraySong = Array.from(getEachSong);

  arraySong.forEach((e) => {
    e.addEventListener("click", (element) => {
      let playsong = e.querySelector(".musicName").firstElementChild.innerHTML;

      //    this is the playsong function call//
      return playMusic(playsong);
    });
  });

  //  attack addEventListener for play, next, preview//

  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = " /image/pause.svg";
    } else {
      currentsong.pause();
      play.src = "/image/play.svg";
    }
  });

  //   Attach add addEventListener for time update//

  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `${convertSecondsToMMSS(
      currentsong.currentTime
    )}/${convertSecondsToMMSS(currentsong.duration)}`;

    // for seekline//
    document.querySelector(".trackPoint").style.left =
      (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });

  // Attach add addEventListener for seekbar//

  document.querySelector(".trackLine").addEventListener("click", (e) => {
    let pacent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".trackPoint").style.left = pacent + "%";
    currentsong.currentTime = (currentsong.duration * pacent) / 100;
  });

  // addEventListener for next song//

  next.addEventListener("click", () => {
    currentsong.pause;
    let index = allsongs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index + 1 < allsongs.length) {
      playMusic(allsongs[index + 1]);
    }
  });

  // addEventListener for next song//

  preview.addEventListener("click", () => {
    console.log("preview click");

    let index = allsongs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(allsongs[index - 1]);
    }
  });

  // addEventListener for volume//

  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      console.log(e.target.value);
      currentsong.volume = parseInt(e.target.value) / 100;
    });

  // addEventListener for side bar//

  //  ----open menu
  document.getElementById("menu").addEventListener("click", (e) => {
    document.querySelector(".left-container").style.display = "block";
    document.getElementById("menu").style.display = "none";
  });

  //  ---close menu
  document.getElementById("menu-close").addEventListener("click", (e) => {
    document.querySelector(".left-container").style.display = "none";
    document.getElementById("menu").style.display = "block";
  });
}

mainsong();

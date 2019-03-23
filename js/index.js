var sessionLength = 25,
    breakLength = 5,
    sessionSeconds,
    breakSeconds,
    remainingSec,
    sMinutes = $("#sessionMinutes"),
    bMinutes = $("#breakMinutes"),
    title = $("#title"),
    timer = $("#timer"),
    start = $("#start"),
    pause = $("#pause"),
    reset = $("#reset"),
    resume = $("#resume"),
    counter,
    breakSound = new Audio('https://www.freesound.org/data/previews/22/22627_7037-lq.mp3');

sMinutes.text(sessionLength);
bMinutes.text(breakLength);
timer.text(sessionLength);
title.text("SESSION");

function formatTime(seconds) {
  var h = Math.floor(seconds / 3600),
      m = Math.floor(seconds / 60) % 60,
      s = seconds % 60;
      if (m < 10) m = "0" + m;
      if (s < 10) s = "0" + s;
      if (h > 0) {
        h = "0" + h;
        timer.text(h + ":" + m + ":" + s);
      } else { timer.text(m + ":" + s); }
}

function runTimer(seconds, sessionOrBreak) {
  counter = setInterval(function(){
    seconds--;
    remainingSec = seconds;
    formatTime(remainingSec);
    if (remainingSec < 0) {
      clearInterval(counter);
      breakSound.play();
      start.toggleClass("break");
      sessionOrBreak();
    }
  }, 1000);
}

function startSession() {
  title.text("SESSION");
  sessionSeconds = parseInt(sMinutes.text()) * 60;
  runTimer(sessionSeconds, startBreak);
}

function startBreak() {
  title.text("BREAK");
  start.toggleClass("break");
  breakSeconds = parseInt(bMinutes.text()) * 60;
  runTimer(breakSeconds, startSession);
}

function changeDisplay(val, arr) {
  for(var i = 0; i < arr.length; i++) {
    var el = arr[i];
    el.css("display", val);
  }
}

start.click(function() {
  changeDisplay("none", [start]);
  changeDisplay("inline-block", [pause, reset]);
  startSession();
});

pause.click(function() {
  changeDisplay("none", [pause]);
  changeDisplay("inline-block", [resume]);
  clearInterval(counter);
});

resume.click(function() {
  changeDisplay("none", [resume]);
  changeDisplay("inline-block", [pause]);
  if(!start.hasClass("break")) {
    counter = setInterval(function() {
      remainingSec--;
      formatTime(remainingSec);
      if (remainingSec < 0) {
        clearInterval(counter);
        breakSound.play();
        startBreak();
      }
    }, 1000);
  } else {
    runTimer(remainingSec, startSession);
  }
});

reset.click(function() {
  changeDisplay("inline-block", [start]);
  changeDisplay("none", [pause, resume]);
  clearInterval(counter);
  timer.text(sMinutes.text());
});

$("#sessionMinus").click(function() {
  sessionLength < 2 ? sessionLength = 1 : sessionLength--;
  $("#sessionMinutes, #timer").text(sessionLength);
});

$("#sessionPlus").click(function() {
  sessionLength++;
  $("#sessionMinutes, #timer").text(sessionLength);
});

$("#breakMinus").click(function() {
  breakLength < 2 ? breakLength = 1 : breakLength--;
  $("#breakMinutes").text(breakLength);
});

$("#breakPlus").click(function() {
  breakLength++;
  $("#breakMinutes").text(breakLength);
});
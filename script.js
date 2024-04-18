document.addEventListener("DOMContentLoaded", () => {
  //get elements
  const startbutton = document.getElementById("start");
  const pausebutton = document.getElementById("pause");
  const resumebutton = document.getElementById("resume");
  const cancelbutton = document.getElementById("cancel");

  //initial values
  let countdowntimer;
  let endtime;

  function updatedisplay(time) {
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minute = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const second = Math.floor((time % (1000 * 60)) / 1000);
    document.getElementById("days").textContent = days
      .toString()
      .padStart(2, "0");
    document.getElementById("hours").textContent = hours
      .toString()
      .padStart(2, "0");
    document.getElementById("minute").textContent = minute
      .toString()
      .padStart(2, "0");
    document.getElementById("second").textContent = second
      .toString()
      .padStart(2, "0");
  }

  //resetdisplay
  function resetdisplay() {
    document.getElementById("datetime").value = "";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minute").textContent = "00";
    document.getElementById("days").textContent = "00";
    document.getElementById("second").textContent = "00";
    startbutton.disabled = false;
    pausebutton.disabled = true;
    resumebutton.disabled = true;
    cancelbutton.disabled = true;
  }

  //startcountcown
  function startcountdown(duration, isresuming) {
    if (!isresuming) {
      endtime = Date.now() + duration;
    }

    countdowntimer = setInterval(() => {
      const now = Date.now();
      const timeleft = endtime - now;
      if (timeleft <= 0) {
        clearInterval(countdowntimer);
        localStorage.removeItem("countdowntarget");
        resetdisplay();
        display("countdown finished");

        return;
      }

      updatedisplay(timeleft);
      pausebutton.disabled = false;
      cancelbutton.disabled = false;
    }, 1000);
  }

  //function displaymessage
  function display(message) {
    const display = document.getElementById("timerdisplay");
    display.textContent = message;
  }

  //start
  startbutton.addEventListener("click", function () {
    const targetdatevalue = document.getElementById("datetime").value;
    if (targetdatevalue) {
      const targetdate = new Date(targetdatevalue);
      const now = new Date();

      if (targetdate > now) {
        const duration = targetdate - now;

        localStorage.setItem("countdowntarget", targetdate.toString());
        startcountdown(duration);
        startbutton.disabled = true;
        resumebutton.disabled = true;
        pausebutton.disables = false;
        cancelbutton.disabled = false;
      } else {
        alert("plz select a future date and time");
      }
    } else {
      alert("select date and time");
    }
  });

  //pausebutton
  pausebutton.addEventListener("click", function () {
    clearInterval(countdowntimer);
    pausebutton.disabled = true;
    resumebutton.disabled = false;
  });

  resumebutton.addEventListener("click", function () {
    const duration = endtime - Date.now();
    startcountdown(duration, true);
    pausebutton.disabled = false;
    resumebutton.disabled = true;
  });

  cancelbutton.addEventListener("click", function () {
    clearInterval(countdowntimer);
    localStorage.removeItem("countdowntarget");
    resetdisplay();
  });

  const saveddate = localStorage.getItem("countdowntarget");
  if (saveddate) {
    const targetdate = new Date(saveddate);
    const now = new Date();
    if (targetdate > now) {
      const duration = targetdate - now;
      startcountdown(duration);
      startbutton.disabled = true;
      pausebutton.disabled = false;
      cancelbutton.disabled = false;
    } else {
      localStorage.removeItem("countdowntarget");
      resetdisplay();
    }
  }
});

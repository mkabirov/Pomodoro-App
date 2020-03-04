const startButton = 
document.querySelector('#pomodoro-start');

const stopButton = 
document.querySelector('#pomodoro-stop');

//Start
startButton.addEventListener('click', () => {
  toggleClock();
})

//Stop
stopButton.addEventListener('click', () => {
    toggleClock(true);
})

let isClockRunning = false;
let isClockStopped = true;

let workSessionDuration = 1500;
let currentTimeLeftInSession = 1500;
let breakSessionDuration = 300;
let timeSpentInCurrentSession = 0;

let type = 'Work';

let currentTaskLabel = document.querySelector('#pomodoro-clock-task');
let workDurationInput = document.querySelector('#input-work-duration');
let breakDurationInput = document.querySelector('#input-break-duration');

let updatedWorkSessionDuration;
let updatedBreakSessionDuration;

workDurationInput.value = '25';
breakDurationInput.value = '5';

// UPDATE WORK TIME
workDurationInput.addEventListener('input', () => {
    updatedWorkSessionDuration = minuteToSeconds(workDurationInput.value)
  })
  
  // UPDATE PAUSE TIME
  breakDurationInput.addEventListener('input', () => {
    updatedBreakSessionDuration = minuteToSeconds(
      breakDurationInput.value
    )
  })

  const minuteToSeconds = mins => {
    return mins * 60
  }


  const setUpdatedTimers = () => {
    if (type === 'Work') {
      currentTimeLeftInSession = updatedWorkSessionDuration
        ? updatedWorkSessionDuration
        : workSessionDuration
      workSessionDuration = currentTimeLeftInSession
    } else {
      currentTimeLeftInSession = updatedBreakSessionDuration
        ? updatedBreakSessionDuration
        : breakSessionDuration
      breakSessionDuration = currentTimeLeftInSession
    }
  }
 

  const stopClock = () => {
    setUpdatedTimers();
    displaySessionLog(type);
    clearInterval(clockTimer);
    isClockStopped = true;
    isClockRunning = false;
    currentTimeLeftInSession = workSessionDuration;
    displayCurrentTimeLeftInSession();
    type = "Work";
    timeSpentInCurrentSession = 0;
  };


  const showStopIcon = () => {
    const stopButton = document.querySelector('#pomodoro-stop')
    stopButton.classList.remove('hidden');
  }


  const calculateSessionProgress = () => {
    // calculate the completion rate of this session
    const sessionDuration =
      type === 'Work' ? workSessionDuration : breakSessionDuration
    return (timeSpentInCurrentSession / sessionDuration)
  }
  
const toggleClock = reset => {
    togglePlayPauseIcon(reset);
    if (reset) {
      stopClock();
    } else {
      console.log(isClockStopped);
      if (isClockStopped) {
        setUpdatedTimers();
        isClockStopped = false;
      }
  
      if (isClockRunning === true) {
        // pause
        clearInterval(clockTimer)
        // update icon to the play one
        // set the vale of the button to start or pause
        isClockRunning = false
      } else {
        // start
        clockTimer = setInterval(() => {
          stepDown();
          displayCurrentTimeLeftInSession();
          progressBar.set(calculateSessionProgress());
        }, 1000)
        isClockRunning = true
      }
      showStopIcon();
    }
  }

const displayCurrentTimeLeftInSession = () => {
    const secondsLeft = currentTimeLeftInSession;
    let result = '';
    const seconds = secondsLeft % 60;
    const minutes = parseInt(secondsLeft / 60) % 60;
    let hours = parseInt(secondsLeft / 3600);
    function addLeadingZeroes(time) {
        return time < 10 ? `0${time}` : time
    }
    if (hours > 0) result += `${hours}:`
    result += `${addLeadingZeroes(minutes)}:${addLeadingZeroes(seconds)}`
    // pomodoroTimer.innerText = 
    // result.toString();
    progressBar.text.innerText = result.toString();
}


const displaySessionLog = (type) => {
    const sessionsList = document.querySelector('#pomodoro-sessions');
    const li = document.createElement('li');
    let sessionLabel; //= type;
    
    if(type === 'Work') {
        sessionLabel = currentTaskLabel.value ? currentTaskLabel.value
        : 'Work'
        workSessionLabel = sessionLabel
    } else {
        sessionLabel = 'Break'
    }
    let elapsedTime =
    parseInt(timeSpentInCurrentSession / 60)
    elapsedTime = elapsedTime > 0 ? elapsedTime : ' < 1'; 
    const text = document.createTextNode(
        `${sessionLabel} : ${elapsedTime} min`
    )
    li.appendChild(text);
    sessionsList.appendChild(li); 
}

const stepDown = () => {
    if (currentTimeLeftInSession > 0) {
       //decrease time left / increase time spent
       currentTimeLeftInSession--; 
       timeSpentInCurrentSession++;
    } else if (currentTimeLeftInSession === 0) {
        //Timer is over 
        timeSpentInCurrentSession = 0;
        if (type = 'Work') {
            currentTimeLeftInSession = breakSessionDuration;
            displaySessionLog('Work');
            type = 'Break';
            currentTaskLabel.value = 'Break';
            currentTaskLabel.disabled = true;
        } else {
            currentTimeLeftInSession = workSessionDuration;
            type = 'Work';
            if (currentTaskLabel.value === 'Break') {
                currentTaskLabel.value = workSessionLabel;
            }
            currentTaskLabel.disabled = false;
             displaySessionLog('Break');
        }
        
    }
    displayCurrentTimeLeftInSession();
}

const togglePlayPauseIcon = (reset) => {
  const playIcon = document.querySelector('#play-icon');
  const pauseIcon = document.querySelector('#pause-icon');
  if (reset) {
    // when resetting -> always revert to play icon
    if (playIcon.classList.contains('hidden')) {
      playIcon.classList.remove('hidden')
    }
    if (!pauseIcon.classList.contains('hidden')) {
      pauseIcon.classList.add('hidden')
    }
  } else {
    playIcon.classList.toggle('hidden')
    pauseIcon.classList.toggle('hidden')
  }
}

const progressBar = new ProgressBar.Circle("#pomodoro-timer", { 

  strokeWidth: 8,
  stroke: 'rgb(30, 30, 30)',
  color: '#555',
  fill: null,
  text: {
    style: {
        color: null,
        position: 'absolute',
        left: '50%',
        top: '50%',
        padding: 0,
        margin: 0,
        transform: {
            prefix: true,
            value: 'translate(-50%, -50%)'
        }
    },
    autoStyleContainer: true,
    alignToBottom: true,
    value: "25:00",
    className: 'progressbar-text'
},
  trailColor: "#ed5867",
  svgStyle: {
    display: 'block',
    width: '100%',
},
});
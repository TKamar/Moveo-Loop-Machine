
let urlMediaArr = ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3'];

let playEvents = [];
let pauseEvents = [];
let stopEvents = [];

let playBtn = document.querySelector('#btn-play');
let pauseBtn = document.querySelector('#btn-pause');
let stopBtn = document.querySelector('#btn-stop');
let loopBtn = document.querySelector('.loopBtn input');
let audioDuration = document.querySelector('.audio-duration');


/** 
 * Load all media files
 *  */
function loadAudio(url) {
    const audioObj = new Audio(url);
    return new Promise((resolve, reject) => {
        audioObj.addEventListener('canplay', event => {
            resolve(audioObj);
        });
    });
}


Promise.all(urlMediaArr.map((value) => {
    return loadAudio(value);
})).then((audioFiles) => {

    playEvents.push(func => {
        audioFiles.forEach((audioFile) => {
            audioFile.play();
        });
    });

    stopEvents.push(func => {
        audioFiles.forEach((audioFile) => {
            audioFile.pause();
            audioFile.currentTime = 0;
        });
    });

    pauseEvents.push(func => {
        audioFiles.forEach((audioFile) => {
            audioFile.pause();

        });
    });

    let longestAudio = getLongestAudio(audioFiles);
    muteMusic(audioFiles);
    loopAudio(longestAudio);

    let maxDuration = getLongestAudioDuration(audioFiles);
    listenDurationMonitor(maxDuration);
    audioDuration.innerHTML = Math.floor(getLongestAudioDuration(audioFiles) / 60) + ':' + Math.floor(getLongestAudioDuration(audioFiles) % 60);
});


function listenDurationMonitor(maxDuration) {
    let start = null;
    let timePassed = 0;
    let animationRequest = null;
    playEvents.push(function () {
        if (animationRequest == null) {
            animationRequest = setInterval(function () {
                setTime(Date.now());
                moveLine();
            }, 10);
        }
    });

    pauseEvents.push(function () {
        if (animationRequest != null) {
            window.clearInterval(animationRequest);
            animationRequest = null;
        }
        start = null;
    });

    stopEvents.push(function () {
        if (animationRequest != null) {
            window.clearInterval(animationRequest);
            animationRequest = null;
        }
        start = null;
        timePassed = 0;
        moveLine();
    });

    function setTime(time) {
        if (start == null) {
            start = time;
        }
        timePassed += time - start;
        start = time;
    }

    function moveLine() {
        const secondsPassed = Math.floor(timePassed / 1000);
        let playPosition = document.querySelector('#playPosition');
        playPosition.style.left = ((secondsPassed / maxDuration) * 100) + '%';
    }
}

function loopAudio(longestAudio) {
    setInterval(() => {
        if (loopBtn.checked && longestAudio.ended) {
            stop();
            play();
        }
    }, 10);
}

function getLongestAudioDuration(audioFiles) {
    let maxDuration = 0;
    audioFiles.forEach((audio) => {
        if (audio.duration > maxDuration) {
            maxDuration = audio.duration;
        }
    });
    return maxDuration;
}

function getLongestAudio(audioFiles) {
    let maxAudio = audioFiles[0];
    for (let i = 1; i < audioFiles.length; i++) {
        if (maxAudio.length < audioFiles[i]) {
            maxAudio = audioFiles[i];
        }
    }
    return maxAudio;
}

function muteMusic(audioFiles) {
    for (let i = 0; i < audioFiles.length; i++) {
        let muteBtn = document.querySelector('.track' + (i + 1) + 'MuteBtn input').addEventListener('click', event => {
            audioFiles[i].muted = event.target.checked;
        });
    }
}

function play() {
    playEvents.forEach(func => {
        func();
    });
}

playBtn.addEventListener('click', event => {
    play();
});

pauseBtn.addEventListener('click', event => {
    pauseEvents.forEach(func => {
        func();
    });
});

function stop() {
    stopEvents.forEach(func => {
        func();
    });
}

stopBtn.addEventListener('click', event => {
    stop();
});















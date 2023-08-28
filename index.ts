document.addEventListener('DOMContentLoaded', () => {
    let audioCtx: AudioContext | null = null;
    let oscillator: OscillatorNode | null = null;
    let isPlaying: boolean = false;
    let playInterval: number | null = null;
  
    // 初始化音頻上下文
    function initializeAudioContext(): void {
      if (!audioCtx) {
       audioCtx = new (window.AudioContext || window.AudioContext)();
      }
    }
  
    // 播放聲音
    function startTone(frequency: number, duration: number, silence: number): void {
      if (isPlaying) {
        stopTone();
      };

      isPlaying = true;
  
      playing(frequency, duration);
      playInterval = window.setInterval(() => {
        playing(frequency, duration);
      }, (duration + silence) * 1000);
    }

    function playing(frequency: number, duration: number): void {
        if (!audioCtx) return;
        
        oscillator = audioCtx.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        oscillator.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);
  
        window.setTimeout(() => {
          if (oscillator) {
            oscillator.disconnect(audioCtx!.destination);
          }
        }, duration * 1000);
    }
  
    // 停止聲音
    function stopTone(): void {
      if (playInterval !== null) {
        window.clearInterval(playInterval);
      }
  
      if (oscillator) {
        oscillator.disconnect();
      }
  
      isPlaying = false;
    }
  
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const frequencyInput = document.getElementById('frequency') as HTMLInputElement;
    const durationInput = document.getElementById('duration') as HTMLInputElement;
    const silenceInput = document.getElementById('silence') as HTMLInputElement;
  
    if (startBtn && stopBtn && frequencyInput && durationInput && silenceInput) {
      startBtn.addEventListener('click', () => {
        // The AudioContext was not allowed to start.
        // It must be resumed (or created) after a user gesture on the page.
        initializeAudioContext();
  
        const frequency = parseFloat(frequencyInput.value);
        const duration = parseFloat(durationInput.value);
        const silence = parseFloat(silenceInput.value);
        startTone(frequency, duration, silence);
      });
  
      stopBtn.addEventListener('click', () => {
        stopTone();
      });
    }
  });
  
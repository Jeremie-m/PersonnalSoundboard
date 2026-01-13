document.addEventListener("DOMContentLoaded", () => {
    const range = document.querySelector(".volume-range");
    const barHoverBox = document.querySelector(".bar-hoverbox");
    const fill = document.querySelector(".bar-fill");
    const icon = document.querySelector(".icon i");
    const audio = document.getElementById("audioPlayer");
    const audioButtons = document.querySelectorAll('.audio-button');
    
    // Initialize state
    let previousValue = range.value;
    let isMuted = false;
    let isMouseDown = false;
  
    // Function to update visual volume bar
    const updateVolumeBar = (value) => {
        // Ensure value is between 0 and 100
        let safeValue = Math.max(0, Math.min(100, value));
        
        fill.style.width = safeValue + "%";
        range.value = safeValue; 
        updateIcon(safeValue);
        updateAudioVolume(safeValue);
    };
  
    // Function to update icon based on volume
    const updateIcon = (value) => {
        // Remove existing classes first to avoid accumulation or conflicts if needed, 
        // but setting className completely is safer
        if (value <= 0) {
            icon.className = "fa fa-2x fa-volume-off icon-size";
        } else if (value < 50) {
            icon.className = "fa fa-2x fa-volume-down icon-size";
        } else {
            icon.className = "fa fa-2x fa-volume-up icon-size";
        }
    };
  
    // Function to update audio element volume
    const updateAudioVolume = (value) => {
        audio.volume = value / 100;
    };
  
    // Initialize volume
    updateVolumeBar(range.value);
  
    // Range input event (hidden but technically functional)
    range.addEventListener("input", (e) => {
        updateVolumeBar(e.target.value);
    });
  
    // Mute toggle on icon click
    icon.parentElement.addEventListener("click", () => {
        if (isMuted) {
            // Unmute
            if (previousValue <= 0) previousValue = 50; // Default if was 0
            updateVolumeBar(previousValue);
            isMuted = false;
        } else {
            // Mute
            previousValue = range.value;
            updateVolumeBar(0);
            isMuted = true;
        }
    });
  
    // Button click handlers for playing sounds
    audioButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Add animation class
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 100);

            // Play sound
            const audioSrc = this.getAttribute('data-src');
            if (audioSrc) {
                audio.src = audioSrc;
                // Ensure volume is set correctly before playing
                audio.volume = range.value / 100;
                
                const playPromise = audio.play();
                
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.error("Audio playback error:", error);
                    });
                }
            }
        });
    });
  
    // Volume bar interaction logic
    const calculateFill = (clientX) => {
        const rect = barHoverBox.getBoundingClientRect();
        // Calculate click position relative to the bar
        // The bar is inside barHoverBox. barHoverBox might have padding.
        // Let's use the full width of the hoverbox for interaction to be easier
        let offsetX = clientX - rect.left;
        const width = rect.width;
        
        let percentage = (offsetX / width) * 100;
        updateVolumeBar(percentage);
    };
  
    // Desktop events
    barHoverBox.addEventListener("mousedown", (e) => {
        isMouseDown = true;
        calculateFill(e.clientX);
    });
  
    document.addEventListener("mousemove", (e) => {
        if (isMouseDown) {
            e.preventDefault(); // Prevent selection
            calculateFill(e.clientX);
        }
    });
  
    document.addEventListener("mouseup", () => {
        isMouseDown = false;
    });
  
    // Mobile events
    barHoverBox.addEventListener("touchstart", (e) => {
        isMouseDown = true;
        // e.touches[0] is the first touch
        calculateFill(e.touches[0].clientX);
    });
  
    barHoverBox.addEventListener("touchmove", (e) => {
        if (isMouseDown) {
            e.preventDefault(); // Prevent scrolling while adjusting volume
            calculateFill(e.touches[0].clientX);
        }
    });
  
    document.addEventListener("touchend", () => {
        isMouseDown = false;
    });
});

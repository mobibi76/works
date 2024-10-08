        /*--A. click event to all inter-link class--*/
        function bindInterLinkEvent() {
            const interLinks = document.querySelectorAll('.inter-link');
            interLinks.forEach(link => {
                link.addEventListener('click', function(event) {
                    event.preventDefault();
                    const pageTitle = this.getAttribute('href').substring(2);
                    introFetch(pageTitle);
                });
            });
        }

/*--B. fetch.js control--*/
    // B1. define introFetch function
    function introFetch(pageTitle) {
        fetch(pageTitle).then(response => {

            if (!response.ok) {
                throw new Error('Network Failure');
            }
            return response.text();
        }).then(text => {
            const containerElement = document.querySelector('#container');

            if (containerElement) {
                containerElement.innerHTML = text;
                containerElement.scrollTop = 0;
                bindInterLinkEvent(); // add inter-link class for CSP
            }
        }).catch(error => {
            console.error('Fetch Operation Failure:', error);
        });
    }

    // B2. load pages through fetch.js with error handle
    function fetchPageContent(pageTitle, targetElementSelector) {
        return fetch(pageTitle).then(response => {

            if (!response.ok) {
                throw new Error('Network Failure');
            }
            return response.text();
        }).then(text => {
            const targetElement = document.querySelector(targetElementSelector);

            if (targetElement) {
                targetElement.innerHTML = text;
                targetElement.scrollTop = 0;

                if (targetElementSelector === '#container') { // add inter-link class for CSP
                   bindInterLinkEvent();
                }
            }
        }).catch(error => {
            console.error('Fetch Operation Failure:', error);
        });
    }

/*--C. calculate header-flex to fix scroll issue on container--*/
    function adjustContainerHeight() {                
        const headers = document.querySelectorAll('header h1, header h2');
        let headerHeight = 0;                    
        headers.forEach(header => {
            headerHeight += header.getBoundingClientRect().height;
        });                    
        const windowHeight = window.innerHeight;
        const flexHeight = windowHeight - headerHeight;
        document.querySelector('#flex').style.height = `${flexHeight}px`;
        const navElement = document.querySelector('#nav');
            
        if (navElement) {
            navElement.style.height = 'auto';
            const navHeight = navElement.scrollHeight;
            navElement.style.height = `${navHeight}px`;
        }                    
        const containerHeight = flexHeight - navElement.offsetHeight;
        document.querySelector('#container').style.height = `${containerHeight}px`;
    }

/*--D. tooltip display for table(tr, td) and image--*/
    function tooltipEventHandle() {
        const tooltip = document.createElement('div');
        tooltip.id = 'tooltip';
        document.body.appendChild(tooltip);
        let currentTooltipTarget = null;

        // D1. mouse event for pc
        document.addEventListener('click', function (e) {
            const target = e.target.closest('td[data-tooltip], tr[data-tooltip], img[data-tooltip]');
                
            if (target) {
                if (currentTooltipTarget === target) {
                    tooltip.style.display = 'none';
                    currentTooltipTarget = null;
                } else {
                    const text = target.getAttribute('data-tooltip') || '';
                    tooltip.textContent = text;
                    tooltip.classList.remove('tooltip-text', 'tooltip-image');

                    if (target.tagName.toLowerCase() === 'img') {
                        tooltip.classList.add('tooltip-image');
                    } else {
                        tooltip.classList.add('tooltip-text');
                    }
                    tooltip.style.display = 'block';
                    tooltip.style.left = `${e.pageX + 10}px`;
                    tooltip.style.top = `${e.pageY + 10}px`;
                    currentTooltipTarget = target;
                }
            } else {
                tooltip.style.display = 'none';
                currentTooltipTarget = null;
            }
        });

        // D2. touch event for mobile
        document.addEventListener('touchstart', function (e) {
            const touch = e.touches[0];
            const target = document.elementFromPoint(touch.clientX, touch.clientY).closest('td[data-tooltip], tr[data-tooltip], img[data-tooltip]');

            if (target) {

                if (currentTooltipTarget === target) {
                    tooltip.style.display = 'none';
                    currentTooltipTarget = null;
                } else {
                    const text = target.getAttribute('data-tooltip') || '';
                    tooltip.textContent = text;
                    tooltip.classList.remove('tooltip-text', 'tooltip-image');

                    if (target.tagName.toLowerCase() === 'img') {
                        tooltip.classList.add('tooltip-image');
                    } else {
                        tooltip.classList.add('tooltip-text');
                    }
                    tooltip.style.display = 'block';
                    tooltip.style.left = `${touch.pageX + 10}px`;
                    tooltip.style.top = `${touch.pageY + 10}px`;
                    currentTooltipTarget = target;
                }
            } else {
                tooltip.style.display = 'none';
                currentTooltipTarget = null;
            }
        });

        document.addEventListener('wheel', function () {
            tooltip.style.display = 'none';
            currentTooltipTarget = null;
        });
    }

/*--E. popup--*/
    function openPopup() {
        const donotShowAgain = localStorage.getItem('donotShowPopup');

        if (!donotShowAgain) {
            document.getElementById('popup').style.display = 'flex';
        }
    }
        document.getElementById('close-popup').addEventListener('click', function() {
            const donotShowAgainCheckbox = document.getElementById('donot-show-again');

            if (donotShowAgainCheckbox.checked) {
                localStorage.setItem('donotShowPopup', 'true');
            }
            document.getElementById('popup').style.display = 'none';
        });

/*--F. autoplay the youtube video identified--*/
    /*function videoPlay() {
        window.onload = function() {
            const video = document.getElementById("pdbopsVideo");

            if (video) { // fix play video with canvas animation
                video.loading = "lazy";
                video.play().then(function() {
                    console.log("Video Play Success");
                }).catch(function(error) {
                    console.log("Video Play Failure:", error);
                }).finally(function() {
                    startCanvasAnimation();                                
                });
            } else {
                console.warn("Video Load Failure");
                startCanvasAnimation();
            }
        };
    }*/
    function videoPlay() {
        window.onload = function() {
            const video = document.getElementById("pdbopsVideo");
            
            if (video) {
                const tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                const firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        
                let player;
                window.onYouTubeIframeAPIReady = function() {
                    player = new YT.Player('pdbopsVideo', {
                        events: {
                            'onReady': onPlayerReady
                        }
                    });
                };
        
                function onPlayerReady(event) {
                    event.target.setPlaybackQuality('hd720');
                    event.target.playVideo();
                }
                startCanvasAnimation();
            } else {
                console.warn("YouTube Load Failure");
                startCanvasAnimation();
            }
        };
    }

/*--G. canvas animation--*/
    let animationFrameID;
    let isAnimating = false;

    function startCanvasAnimation() {
        const canvas = document.getElementById("aniCanvas");

        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const obj = canvas.getContext('2d');
            const objAction = [];

            for (let i = 0; i <30; i++) {
                objAction.push ({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 5 + 2,
                    velocity: Math.random() * 1 + 1
                });
            }

            function drawObject() {
                obj.clearRect(0, 0, canvas.width, canvas.height);
                obj.fillStyle = 'rgba(175, 205, 235, 0.3)';

                for (let i = 0; i < objAction.length; i++) {
                    const action = objAction[i];
                    obj.beginPath();
                    obj.arc(action.x, action.y, action.radius, 0, Math.PI * 2, false);
                    obj.fill();
                    action.y += action.velocity;

                    if (action.y > canvas.height) {
                        action.y = -action.radius;
                        action.x = Math.random() * canvas.width;
                    }
                }
                animationFrameID = requestAnimationFrame(drawObject);
            }

            if (!isAnimating) {
                isAnimating = true;
                drawObject();
                console.log("Canvas Animation Success");
            }
            window.addEventListener('resize', function() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            });
        } else {
            console.error("Canvas Load Failure");
        }
    }

/*--H. stop canvas animation--*/
    function stopCanvasAnimation() {
        if (isAnimating) {
            cancelAnimationFrame(animationFrameID);
            isAnimating = false;
            console.log("Canvas Animation Stopped");
        }
    }

/*--Main : page load--*/
    document.addEventListener("DOMContentLoaded", function() {
        // DOM Content Loaded control and adjust heithts
        Promise.all([
            fetchPageContent('Menu', '#nav'),
            fetchPageContent('Cover', '#container')
        ]).then(() => {
            adjustContainerHeight();
            window.addEventListener('resize', adjustContainerHeight);
            // inter-link class for CSP
            bindInterLinkEvent();
            // tooltip
            tooltipEventHandle();
            // popup
            openPopup();
            // video
            videoPlay();
        });
    });

/*--Sub : canvas animation cancle at page unload--*/
    window.addEventListener("beforeunload", stopCanvasAnimation);
    window.addEventListener("load", startCanvasAnimation);
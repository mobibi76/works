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
                throw new Error(`Network Failure': ${response.statusText}`);
            }
            return response.text();
        }).then(text => {
            const containerElement = document.querySelector('#container');
            if (containerElement) {
                containerElement.innerHTML = text;
                containerElement.scrollTop = 0;
                bindInterLinkEvent();

                if (pageTitle.includes('Demo')) {
                    loadIframeWithTimeout('iframe', 'https://test.pdbops.com:8000/game-ko/', 5000);
                }
                stopCanvasAnimation();
                startCanvasAnimation();
            }
        }).catch(error => {
            console.error('Fetch Operation Failure:', error);
            const containerElement = document.querySelector('#container');
            if (containerElement) {
                containerElement.innerHTML = `<p>Page Load Failure: ${error.message}</p>`;
            }
        });
    }

    // B2. load pages through fetch.js with error handling
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
                if (targetElementSelector === '#container') {
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

        // Mouse event for desktop
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
                    tooltip.classList.add(target.tagName.toLowerCase() === 'img' ? 'tooltip-image' : 'tooltip-text');
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

        // Touch event for mobile
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
                    tooltip.classList.add(target.tagName.toLowerCase() === 'img' ? 'tooltip-image' : 'tooltip-text');
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
        try {
            const donotShowAgain = localStorage.getItem('donotShowPopup');
            if (!donotShowAgain) {
                document.getElementById('popup').style.display = 'flex';
            }
        } catch (error) {
            console.error('Local Storage Error:', error);
        }
    }

    document.getElementById('close-popup').addEventListener('click', function() {
        const donotShowAgainCheckbox = document.getElementById('donot-show-again');
        if (donotShowAgainCheckbox.checked) {
            localStorage.setItem('donotShowPopup', 'true');
        }
        document.getElementById('popup').style.display = 'none';
    });

/*--F. play the video identified--*/
    function videoPlay() {
        const videoElement = document.getElementById("pdbopsVideo");
        if (videoElement) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const tag = document.createElement('script');
                        tag.src = "https://www.youtube.com/iframe_api";
                        tag.setAttribute('nonce', 'abc123');
                        const firstScriptTag = document.getElementsByTagName('script')[0];
                        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

                        window.onYouTubeIframeAPIReady = function () {
                            new YT.Player('pdbopsVideo');
                        };
                        observer.disconnect();
                    }
                });
            });
            observer.observe(videoElement);
        }
    }

/*--G. canvas animation--*/
    let isAnimating = false;
    let animationFrameID = null;
    const objAction = [];

    function clearCanvasObjects() {
        objAction.length = 0;
    }

    // G1. start canvas animation
    function startCanvasAnimation() {
        const canvas = document.getElementById("aniCanvas");
    
        if (canvas && !isAnimating) {
            isAnimating = true;
            const ctx = canvas.getContext('2d');
            resizeCanvas(canvas, ctx);
            window.addEventListener('resize', () => resizeCanvas(canvas, ctx));
            clearCanvasObjects();

            for (let i = 0; i < 10; i++) {
                objAction.push({
                    x: Math.random() * canvas.width / window.devicePixelRatio,
                    y: Math.random() * canvas.height / window.devicePixelRatio,
                    radius: Math.random() * 5 + 2,
                    velocity: Math.random() * 1 + 1
                });
            }

            function drawObject() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'rgba(175, 205, 235, 0.3)';
                objAction.forEach(action => {
                    ctx.beginPath();
                    ctx.arc(action.x, action.y, action.radius, 0, Math.PI * 2, false);
                    ctx.fill();
                    action.y += action.velocity;
    
                    if (action.y > canvas.height / window.devicePixelRatio) {
                        action.y = -action.radius;
                        action.x = Math.random() * canvas.width / window.devicePixelRatio;
                    }
                });
                animationFrameID = requestAnimationFrame(drawObject);
            }
            animationFrameID = requestAnimationFrame(drawObject);
        }
    }

    // G2. stop canvas animation
    function stopCanvasAnimation() {
        if (isAnimating) {
            cancelAnimationFrame(animationFrameID);
            window.removeEventListener('resize', resizeCanvas);
            clearCanvasObjects();
            isAnimating = false;
        }
    }

    // G3. resize canvas animation
    function resizeCanvas(canvas, ctx) {
        canvas.width = window.innerWidth * window.devicePixelRatio;
        canvas.height = window.innerHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

/*--H. cookie--*/
    function generateSecureRandomValue() {
        let array = new Uint8Array(16);
        window.crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    function setCookie(name, value, days, domain, path) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; Domain=" + domain + "; Path=" + path + "; SameSite=None; Secure; HttpOnly";
    }

/*--I. iframe load timeout--*/
    function loadIframeWithTimeout(iframeSelector, src, timeout) {
        const iframe = document.querySelector(iframeSelector);

        if (!iframe) {
            console.error(`No iframe found with selector: ${iframeSelector}`);
            return;
        }
        const timer = setTimeout(function() {
            iframe.srcdoc = "<p>Server Response Failure. Try Later.<br>The server may be off.</p>";
        }, timeout);
        iframe.onload = function() {
            clearTimeout(timer);
        };
        iframe.onerror = function() {
            clearTimeout(timer);
            iframe.srcdoc = "<p>Server Response Failure. Try Later.<br>The server may be off.</p>";
        };
        iframe.src = src;
    }

/*--Main : page load--*/
    document.addEventListener("DOMContentLoaded", function() {

        setCookie("__Secure-3PSIDTS", generateSecureRandomValue(), ".youtube.com", "/");
        setCookie("__Secure-3PSID", generateSecureRandomValue(), ".youtube.com", "/");
        setCookie("__Secure-3PAPISID", generateSecureRandomValue(), ".youtube.com", "/");
        setCookie("LOGIN_INFO", generateSecureRandomValue(), ".youtube.com", "/");
        setCookie("__Secure-3PSIDCC", generateSecureRandomValue(), ".youtube.com", "/");
        setCookie("__Host-3PLSID", generateSecureRandomValue(), "accounts.google.com", "/");
        setCookie("__Secure-OSID", generateSecureRandomValue(), ".docs.google.com", "/");
        setCookie("NID", generateSecureRandomValue(), ".google.com", "/");
        setCookie("__Secure-3PSID", generateSecureRandomValue(), ".google.com", "/");
        setCookie("__Secure-3PAPISID", generateSecureRandomValue(), ".google.com", "/");
        setCookie("__Secure-3PSIDTS", generateSecureRandomValue(), ".google.com", "/");
        setCookie("__Secure-3PSIDCC", generateSecureRandomValue(), ".google.com", "/");
    
        console.log("Cookies have been set for respective domains.");

        Promise.all([
            fetchPageContent('Menu', '#nav'),
            fetchPageContent('Cover', '#container')
        ]).then(() => {
            adjustContainerHeight();
            window.addEventListener('resize', adjustContainerHeight);
            startCanvasAnimation();
            bindInterLinkEvent();
            tooltipEventHandle();
            openPopup();
            videoPlay();
        });
    });

/*--Sub : canvas animation--*/
    // Sub1. cancel at page unload
    window.addEventListener("beforeunload", stopCanvasAnimation);

    // Sub2. cancel and play on page activation
    document.addEventListener("visibilitychange", function() {
        if (document.hidden) {
            stopCanvasAnimation();
        } else {
            startCanvasAnimation();
        }
    });

    // Sub3. candel at external link click
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', function() {
            stopCanvasAnimation();
        });
    });

/*--extra: play the video identified--*/
    /*function videoPlay() {
        window.onload = function() {
            const video = document.getElementById("pdbopsVideo");

            if (video) {
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
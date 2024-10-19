/*--A. click event to all inter-link class--*/
    // A1. remove and rebind interlink
    function bindInterLinkEvent() {
        const nav = document.querySelector('#nav');
        const container = document.querySelector('#container');
        nav.removeEventListener('click', handleInterLinkClick);
        nav.addEventListener('click', handleInterLinkClick);
        container.removeEventListener('click', handleInterLinkClick);
        container.addEventListener('click', handleInterLinkClick);
    }
    // A2. handle interlink click event
    function handleInterLinkClick(event) {
        const link = event.target.closest('.inter-link');
        if (link) {
            event.preventDefault();
            const pageTitle = link.getAttribute('href').replace(/^#!/, '');
            introFetch(pageTitle);
            loadRandomStylesheet();
        }
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
                bindInterLinkEvent();
                insertEmailIfPresent();
                if (pageTitle.includes('Demo')) {
                    loadIframeWithTimeout('iframe', 'https://test.pdbops.com:8000/test/', 3500);
                }
            }
        }).catch(error => {
            console.error('Fetch Operation Failure:', error);
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
                bindInterLinkEvent();
                targetElement.scrollTop = 0;
            }
        }).catch(error => {
            console.error('Fetch Operation Failure:', error);
        });
    }
    // B3. insert contact infomarion
    function insertEmailIfPresent() {
        const emailElement = document.querySelector('#email');
        if (emailElement) {
            emailElement.innerHTML = 
                '<a href="mailto:processdesignbase@gmail.com">processdesignbase@gmail.com</a> (125-51-00257)';
            console.log('Email Inserted.');
        } else {
            console.log('#email Element Not Found, Skip Insert');
        }
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
        // D1. mouse event for desktop
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
    /*function openPopup() {
        const donotShowAgain = localStorage.getItem('donotShowPopup');
        if (donotShowAgain !== 'true') {
            document.getElementById('popup').style.display = 'flex';
        } else {
            document.getElementById('popup').style.display = 'none';
        }
    }
    document.getElementById('close-popup').addEventListener('click', function() {
        const donotShowAgainCheckbox = document.getElementById('donot-show-again');
        if (donotShowAgainCheckbox.checked) {
            localStorage.setItem('donotShowPopup', 'true');
        }
        document.getElementById('popup').style.display = 'none';
    });*/





    const closeButton = document.querySelector('#close-popup');
    if (closeButton) {
        closeButton.addEventListener('click', function () {
            const popupId = this.getAttribute('data-popup');
            const donotShowAgainCheckbox = document.querySelector(`#${popupId} input[type="checkbox"]`);
            if (donotShowAgainCheckbox && donotShowAgainCheckbox.checked) {
                localStorage.setItem(`donotShowPopup_${popupId}`, 'true');
                console.log(`Saved to localStorage: donotShowPopup_${popupId} = true`);
            }
            closePopup(popupId);
        });
    }

    function handlePopupVisibility(popupId) {
        const donotShowAgain = localStorage.getItem(`donotShowPopup_${popupId}`);
        console.log(`Popup State from Storage: ${donotShowAgain}`);
        if (donotShowAgain === 'true') {
            console.log(`Popup ${popupId} will not be shown.`);
            closePopup(popupId);
        } else {
            openPopup(popupId);
        }
    }

    function openPopup(popupId) {
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.style.display = 'flex';
            console.log(`Popup ${popupId} opened.`);
        }
    }

    function closePopup(popupId) {
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.style.display = 'none';
            console.log(`Popup ${popupId} closed.`);
        }
    }





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

            function resizeCanvas() {
                canvas.width = window.innerWidth * window.devicePixelRatio;
                canvas.height = window.innerHeight * window.devicePixelRatio;
                ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            }
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
            clearCanvasObjects();
            for (let i = 0; i < 20; i++) {
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
            clearCanvasObjects();
            isAnimating = false;
        }
    }

/*--H. cookie--*/
    function generateSecureRandomValue() {
        const array = new Uint8Array(16);
        window.crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    function setCookie(name, value, domain = '', path = '/', secure = true) {
        const sameSite = secure ? 'SameSite=None; Secure' : 'SameSite=Lax';
        document.cookie = `${name}=${value || ''}; Domain=${domain}; Path=${path}; ${sameSite}; HttpOnly`;
    }

/*--I. iframe load timeout--*/
    function loadIframeWithTimeout(iframeSelector, src, timeout) {
        const iframe = document.querySelector(iframeSelector);
        if (!iframe) {
            console.error(`No Iframe Found With Selector: ${iframeSelector}`);
            return;
        }
        const timer = setTimeout(function() {
            iframe.srcdoc = `
                <div style="text-align: center;">
                    <p>Server Response Failure. Try Later.<br>The server may be off.</p>
                    <img src="../notice/demoLoadFailure.png" alt="Demo Load Failure" style="width: 100%;">
                </div>
            `;
        }, timeout);
        iframe.onload = function() {
            clearTimeout(timer);
        };
        iframe.onerror = function() {
            clearTimeout(timer);
            iframe.srcdoc = `
                <div style="text-align: center;">
                    <p>Server Response Failure. Try Later.<br>The server may be off.</p>
                    <img src="../notice/demoLoadFailure.png" alt="Demo Load Failure" style="width: 100%;">
                </div>
            `;
        };
        iframe.src = src;
    }

/*--J. apply random css style--*/
    function loadRandomStylesheet() {
        const stylesheets = [
            '../style/style_1.css', 
            '../style/style_2.css', 
            '../style/style_3.css'
        ];
        const randomIndex = Math.floor(Math.random() * stylesheets.length);
        let existingLink = document.querySelector('link[rel="stylesheet"]');
        if (existingLink) {
            existingLink.remove();
        }
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = stylesheets[randomIndex];
        linkElement.onload = function() {
            document.body.style.visibility = 'visible';
        };
        document.body.style.visibility = 'hidden';
        document.head.appendChild(linkElement);
    }

/*--Main : page load--*/
    document.addEventListener("DOMContentLoaded", function() {
        const domains = [
            '.youtube.com', '.google.com', '.docs.google.com', '.drive.google.com', 'accounts.google.com'
        ];
        domains.forEach(domain => {
            setCookie('__Secure-3PSIDTS', generateSecureRandomValue(), domain);
            setCookie('__Secure-3PSID', generateSecureRandomValue(), domain);
            setCookie('__Secure-3PAPISID', generateSecureRandomValue(), domain);
            setCookie('LOGIN_INFO', generateSecureRandomValue(), domain);
            setCookie('COMPASS', generateSecureRandomValue(), domain);
        });
        console.log('Session cookies have been set for respective domains.');

        Promise.all([
            fetchPageContent('Menu', '#nav'),
            fetchPageContent('Cover', '#container')
        ]).then(() => {
            adjustContainerHeight();
            window.addEventListener('resize', adjustContainerHeight);
            bindInterLinkEvent();
            tooltipEventHandle();
            //openPopup();





            handlePopupVisibility('popup');





            videoPlay();
            startCanvasAnimation();
            insertEmailIfPresent();
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

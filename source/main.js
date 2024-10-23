/*--A. click event to all inter-link class--*/
    // A1. remove and rebind interlink
    function bindInterLinkEvent() {
        console.log("Inter-links Binded.");
        try {
            const nav = document.querySelector('#nav');
            const container = document.querySelector('#container');
            nav.removeEventListener('click', handleInterLinkClick);
            nav.addEventListener('click', handleInterLinkClick);
            container.removeEventListener('click', handleInterLinkClick);
            container.addEventListener('click', handleInterLinkClick);
        } catch (error) {
            console.error('Error in Binding Inter-links.:', error);
        }
    }
    // A2. handle interlink click event
    function handleInterLinkClick(event) {
        try {
            console.log("Inter-link Clicked.");
            const link = event.target.closest('.inter-link');
            if (link) {
                event.preventDefault();
                const pageTitle = link.getAttribute('href').replace(/^#!/, '');
                console.log(`Page Loaded.: ${pageTitle}`);
                introFetch(pageTitle);
                loadRandomStylesheet();
            }
        } catch (error) {
            console.error('Error in Handling Inter-link Click.:', error);
        }
    }

/*--B. fetch.js control--*/
    // B1. define introFetch function
    function introFetch(pageTitle) {
        console.log(`Page Fetched.: ${pageTitle}`);
        fetch(pageTitle).then(response => {
            if (!response.ok) {
                throw new Error(`Error in Network.: ${response.statusText}`);
            }
            return response.text();
        }).then(text => {
            console.log(`Content Fetched.: ${pageTitle}`);
            const containerElement = document.querySelector('#container');
            if (containerElement) {
                containerElement.innerHTML = text;
                containerElement.scrollTop = 0;
                bindInterLinkEvent();
                insertEmailIfPresent();
                if (pageTitle.includes('Demo')) {
                    loadIframeWithTimeout('iframe', 'https://test.pdbops.com:8000/test/', 3000);
                }
            }
        }).catch(error => {
            console.error('Fetch Operation Failed.:', error);
        });
    }
    // B2. load pages through fetch.js with error handling
    function fetchPageContent(pageTitle, targetElementSelector) {
        return fetch(pageTitle).then(response => {
            if (!response.ok) {
                throw new Error('Network Failed.');
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
            console.error('Fetch Operation Failed.:', error);
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
            console.log('#email Element Not founded, Skip Insert.');
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
        console.log("Tooltip Event Handlers Initialised.");
        try {
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
        } catch (error) {
            console.error("ERROR in {Tooltip-Event-Handle}.:", error);
        }
    }

/*--E. popup--*/
    // E1. setup popup
    function setupPopup(popupId) {
        const closeButton = document.querySelector(`#close-${popupId}`);
        if (closeButton) {
            closeButton.addEventListener('click', function () {
                const checkbox = document.querySelector(`#donot-show-again-${popupId.split('-')[1]}`);
                if (checkbox && checkbox.checked) {
                    localStorage.setItem(`donotShowPopup_${popupId}`, 'true');
                    console.log(`Popup Status Saved.: donotShowPopup_${popupId} = true`);
                }
                closePopup(popupId);
            });
        }
        handlePopupVisibility(popupId);
    }
    // E2. check visibility of popup
    function handlePopupVisibility(popupId) {
        try {
            const donotShowAgain = localStorage.getItem(`donotShowPopup_${popupId}`);
            console.log(`Popup Visibility Checked for ${popupId}: ${donotShowAgain}`);
            if (donotShowAgain === 'true') {
                closePopup(popupId);
            } else {
                openPopup(popupId);
            }
        } catch (error) {
            console.error(`Error in Handling Popup Visibility.: ${error}`);
        }
    }
    // E3. open and close popup (normal)
    /*let highestZIndex = 1000;

    function openPopup(popupId) {
        try {
            const popup = document.getElementById(popupId);
            if (popup) {
                const lastPopup = getLastVisiblePopup();
                if (lastPopup) {
                    const { bottom } = lastPopup.getBoundingClientRect();
                    popup.style.top = `${bottom + 2}px`;
                } else {
                    popup.style.top = '67px';
                }
                popup.style.display = 'flex';
                popup.style.zIndex = getNextZIndex();
                console.log(`Popup ${popupId} Opened.`);
            }
        } catch (error) {
            console.error(`Error in Opening Popup.: ${error}`);
        }
    }
    function getLastVisiblePopup() {
        const visiblePopups = Array.from(document.querySelectorAll('.popup-overlay'))
            .filter(popup => popup.style.display === 'flex');
        return visiblePopups.length > 0 ? visiblePopups[visiblePopups.length - 1] : null;
    }
    function getNextZIndex() {
        return ++highestZIndex;
    }
    function closePopup(popupId) {
        try {
            const popup = document.getElementById(popupId);
            if (popup) {
                popup.style.display = 'none';
                console.log(`Popup ${popupId} Closed.`);
            }
        } catch (error) {
            console.error(`Error in Closing Popup.: ${error}`);
        }
    }
    // E4. align popup (the 1st index.html loading)
    function alignPopupsOnLoad() {
        const popups = Array.from(document.querySelectorAll('.popup-overlay'));
        let currentBottom = 67;
        popups.forEach(popup => {
            popup.style.top = `${currentBottom}px`;
            popup.style.display = 'flex';
            currentBottom += popup.offsetHeight + 2;
        });
        console.log('Popups Aligned on Initial Load.');
    }*/










    // E3. open and close popup (within the panel)
    let highestZIndex = 1000;

    function openPopup(popupId) {
        try {
            const popup = document.getElementById(popupId);
            const pannel = document.querySelector('.popup-panel');
            if (popup) {
                popup.style.display = 'flex';
                popup.style.zIndex = getNextZIndex();
                pannel.style.display = 'flex';
                console.log(`Popup ${popupId} Opened.`);
            }
        } catch (error) {
            console.error(`Error in Opening Popup.: ${error}`);
        }
    }

    function getLastVisiblePopup() {
        const visiblePopups = Array.from(document.querySelectorAll('.popup-overlay'))
            .filter(popup => popup.style.display === 'flex');
        return visiblePopups.length > 0 ? visiblePopups[visiblePopups.length - 1] : null;
    }

    function getNextZIndex() {
        return ++highestZIndex;
    }

    function closePopup(popupId) {
        try {
            const popup = document.getElementById(popupId);
            if (popup) {
                popup.style.display = 'none';
                console.log(`Popup ${popupId} Closed.`);
                checkAndHidePannel();
            }
        } catch (error) {
            console.error(`Error in Closing Popup.: ${error}`);
        }
    }
    // E4. align popup (the 1st index.html loading)
    function alignPopupsOnLoad() {
        const pannel = document.querySelector('.popup-pannel');
        const popups = Array.from(document.querySelectorAll('.popup-overlay'));
        /*popups.forEach(popup => {
            popup.style.display = 'flex';
        });*/
        if (popups.length > 0) {
            pannel.style.display = 'flex';
            popups.forEach(popup => {
                popup.style.display = 'flex';
            });
        } else {
            pannel.style.display = 'none';
        }
        console.log('Popups Aligned on Initial Load.');
    }
    // E5. check and hide pannel
    function checkAndHidePannel() {
        const pannel = document.querySelector('.popup-pannel');
        const visiblePopups = Array.from(pannel.querySelectorAll('.popup-overlay'))
            .filter(popup => popup.style.display === 'flex');
    
        if (visiblePopups.length === 0) {
            pannel.style.display = 'none';
            console.log('All Popups Closed. Pannel Hidden.');
        }
    }










/*--F. play the video identified--*/
    function videoPlay() {
        console.log("Video Play Initialised.");
        try {
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
        } catch (error) {
            console.error("Error in Video Play.:", error);
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
        console.log("Canvas Animation Started.");
        try {
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
        } catch (error) {
            console.error("Error in Canvas Animation.:", error);
        }
    }
    // G2. stop canvas animation
    function stopCanvasAnimation() {
        console.log("Canvas Animation Terminated.");
        try {
            if (isAnimating) {
                cancelAnimationFrame(animationFrameID);
                clearCanvasObjects();
                isAnimating = false;
            }
        } catch (error) {
            console.error("Error in Canvas Animation.:", error);
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
            console.error(`No-Iframe with Selector: ${iframeSelector}`);
            return;
        }
        const timer = setTimeout(function() {
            iframe.srcdoc = `
                <div style="text-align: center;">
                    <p>Server Response Failed. Try Later.<br>The Server May Be Off.</p>
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
                    <p>Server Response Failed. Try Later.<br>The Server May Be Off.</p>
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
            console.log(`Random Stylesheet Loaded: ${linkElement.href}`);
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
        console.log('Session Cookies Set for Each Domain Respectively.');

        Promise.all([
            fetchPageContent('Menu', '#nav'),
            fetchPageContent('Cover', '#container')
        ]).then(() => {
            adjustContainerHeight();
            window.addEventListener('resize', adjustContainerHeight);
            bindInterLinkEvent();
            tooltipEventHandle();
            videoPlay();
            startCanvasAnimation();
            insertEmailIfPresent();





            setupPopup('popup-rep');
            setupPopup('popup-sub1');
            setupPopup('popup-abc123');
            setupPopup('popup-event241020');
            setupPopup('popup-isms241023');
            requestAnimationFrame(() => (alignPopupsOnLoad));





        }). catch(error => {
            console.error('Error in Loding Content.:', error);
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

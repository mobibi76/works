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
                bindInterLinkEvent();

                if (pageTitle.includes('Demo')) {
                    loadIframeWithTimeout('iframe', 'https://test.pdbops.com:8000/game-ko/', 5000);
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

/*--G. cookie--*/
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

/*--H. iframe load timeout--*/
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
            bindInterLinkEvent();
            tooltipEventHandle();
            openPopup();
            videoPlay();
        });
    });

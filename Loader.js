document.addEventListener('DOMContentLoaded', function () {
    const resources = [
        {type: 'script', src: 'https://yoannmoinet.github.io/nipplejs/javascripts/nipplejs.js', size: 38},
        {type: 'link', href: 'https://unpkg.com/swiper/swiper-bundle.min.css', size: 18},
        {type: 'script', src: 'https://unpkg.com/swiper/swiper-bundle.min.js', size: 147},
        {type: 'font', href: 'https://fonts.gstatic.com/s/materialsymbolsoutlined/v195/kJF4BvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oDMzByHX9rA6RzazHD_dY40KH8nGzv3fz_VFU22ZZLsYEpzC_1hCs5Y0J1Llf.woff2', size: 762}
    ];

//    Find file size with this website: https://www.aconvert.com/

    const loadingScreenContainer = document.getElementById('container');
    const progressBar = document.getElementById('loadingProgressBarStartup');
    const title = document.getElementById('title');
    const totalSize = resources.reduce((acc, resource) => acc + resource.size, 0); // total size of all resources
    let loadedSize = 0;

    function updateProgressBar() {
        const progress = (loadedSize / totalSize) * 100;
        progressBar.style.width = progress + '%';
        if (progress >= 100) {
            setTimeout(() => {
                if (document.readyState === "complete") {
                    loadingScreenContainer.innerHTML = `
                    <button class="start" id="start">
                        <span class="material-symbols-outlined">keyboard_double_arrow_left</span>
                        PLAY
                        <span class="material-symbols-outlined">keyboard_double_arrow_right</span>
                    </button>`;
                    loadingScreenContainer.classList.add('nowButton');
                    s();
                } else {
                    window.addEventListener('load', () => {
                        loadingScreenContainer.innerHTML = `
                        <button class="start" id="start">
                            <span class="material-symbols-outlined">keyboard_double_arrow_left</span>
                            PLAY
                            <span class="material-symbols-outlined">keyboard_double_arrow_right</span>
                        </button>`;
                        loadingScreenContainer.classList.add('nowButton');
                        s();
                    });
                }
            }, 1000); // Small delay to ensure the progress bar completes its animation
        }
    }

    function loadResource(resource) {
        return new Promise((resolve, reject) => {
            let element;
            if (resource.type === 'link') {
                element = document.createElement('link');
                element.rel = 'stylesheet';
                element.href = resource.href;
            } else if (resource.type === 'script') {
                element = document.createElement('script');
                element.src = resource.src;
            } else if (resource.type === 'font') {
                element = new FontFace('Material Symbols Outlined', `url(${resource.href})`);
                element.load().then(() => {
                    document.fonts.add(element);
                    loadedSize += resource.size;
                    updateProgressBar();
                    resolve();
                }).catch(reject);
                return;
            }

            element.onload = () => {
                loadedSize += resource.size;
                updateProgressBar();
                resolve();
            };

            element.onerror = (error) => {
                console.error(`Failed to load resource: ${resource.href || resource.src}`, error);
                title.innerHTML = `<span>NO</span> <span>INTERNET</span>`;
                progressBar.style.backgroundColor = "red";
                reject(error);
            };

            document.head.appendChild(element);
        });
    }

    // Load resources and update progress bar accordingly
    resources.forEach(resource => {
        loadResource(resource)
            .then(() => {
                // Resource loaded successfully
            })
            .catch(error => {
                console.error(`Failed to load resource: ${resource.href || resource.src}`, error);
                console.error('Failed to load all resources', error);
                title.innerHTML = `<span>NO</span> <span>INTERNET</span>`;
                progressBar.style.backgroundColor = "red";
            });
    });
});

// Exhibition Data
const EXHIBITIONS = [

    {
        title: "INDOCILI ORIZZONTI - DOVE IL SEGNO DIVENTA ENERGIA E IL GESTO SI FA EMOZIONE",
        image: "assets/Immagini/In Corso e next/Orizzonti.webp",
        exhibition: "Domenica 3 Maggio il Palasavena ospiterà <strong> Indocili Orizzonti </strong>, una mostra personale di Arianna Lazzari, dove una natura senza controllo, un mondo composto da energie spontanee che si riflettono nelle dinamiche emotive umane vengono rappresentate da una tecnica destinata al continuo mutamento: l’olio di lino usato per le opere, ingiallendo e cambiando nel tempo, riapre lo sguardo a nuove possibilità di lettura. Da anni l’artista porta avanti una ricerca segnica capace di riverberare nel vissuto di ciascuno: un gesto che delinea l’emozione e afferma l’intensità del vivere, liberandosi in un flusso che cerca il proprio spazio sulla superficie del supporto. Prendendo le mosse dal pittore italiano G. Novelli (1925-1968), secondo cui è essenziale «[…]dimenticare tutto ciò che si è appreso di equilibrio e conoscenza affinché l’atto creativo riacquisti la sua spontaneità[…]».",
        about: "<strong>Arianna Lazzari</strong> - Diplomata all’Accademia di Belle Arti di Bologna, è interessata al segno che diventa gesto vivo, traccia sensibile che attraversa la superficie. Il suo intento principale è trarre spunti dalla realtà, così da esplorarne le profondità e le ambiguità, trasformandole in visioni cariche di emozione e in nuovi orizzonti interiori."
    },
    {
        title: "L'ESTATE DI GIORGIONE - LA MARCIA AL MARE E IL RACCONTO DI QUEL PAESE",
        image: "assets/Immagini/In Corso e next/L’ESTATE DI GIORGIONE.webp",
        exhibition: "Giovedì 21 Maggio alle 17:00 il Palasavena ospiterà <strong>L’estate di Giorgione</strong>, una serie fotografica documentativa realizzata nell’estate del 2023, durante la camminata collettiva “La Marcia al Mare”, con partenza da Piacenza per arrivare alla costa ligure. Il progetto, organizzato dall’associazione OtpGea, accompagna un gruppo di adolescenti attraverso le valli e gli Appennini, con l’obiettivo di facilitare la creazione di nuovi legami e di esperienze uniche e incoraggiare così la crescita personale. Questa raccolta, nonostante ritragga momenti di gioia, cela un segreto che avvolge l’intero lavoro di un’atmosfera malinconica.",
        about: "<strong>Eugenio Bengalli</strong> - nato a Fiorenzuola d’Arda nel 2001, si forma presso il Liceo Artistico Bruno Cassinari di Piacenza. Successivamente svolge un periodo di praticantato con il collettivo Cesura, esperienza che consolida le sue basi nella fotografia. Attualmente è studente all’Accademia di Belle Arti di Bologna, dove collabora con collettivi artistici interni come Bar-H e PLai. La sua ricerca fotografica indaga restituendo visibilità a persone, comunità e contesti marginali, portando alla luce narrazioni spesso trascurate nel tessuto sociale contemporaneo."
    }
];

// Scroll position memory for past.html
let savedPastScrollY = 0;

// Initialize Barba.js
barba.init({
    transitions: [{
        name: 'opacity-transition',
        leave(data) {
            // Save scroll position when leaving past.html
            if (data.current.namespace === 'past') {
                savedPastScrollY = window.scrollY;
            }
            gsap.set(document.body, { overflow: 'hidden' });
            return gsap.to(data.current.container, {
                opacity: 0,
                duration: 0.3,
                ease: 'power1.in'
            });
        },
        enter(data) {
            updateActiveLink(data.next.url.path);
            initSlider();
            initExhibitionSwitcher();
            initLightbox();

            // Instant scroll between exit and entry
            const goingBackToPast = data.next.namespace === 'past' &&
                data.current.namespace === 'exhibition';

            if (goingBackToPast) {
                window.scrollTo(0, savedPastScrollY);
            } else {
                window.scrollTo(0, 0);
            }
            gsap.set(document.body, { overflow: '' });

            gsap.from(data.next.container, {
                opacity: 0,
                y: 10,
                duration: 0.4,
                ease: 'power2.out',
                clearProps: "all"
            });
        }
    }]
});

// Safety net: always release body overflow after any transition completes
barba.hooks.after(() => {
    document.body.style.overflow = '';
});

function initSlider() {
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const grid = section.querySelector('.poster-grid');
        const nextBtn = section.querySelector('.slideNext');
        const prevBtn = section.querySelector('.slidePrev');

        if (grid && nextBtn && prevBtn) {
            // Remove previous listeners
            const newNext = nextBtn.cloneNode(true);
            const newPrev = prevBtn.cloneNode(true);
            nextBtn.parentNode.replaceChild(newNext, nextBtn);
            prevBtn.parentNode.replaceChild(newPrev, prevBtn);

            // Clean up existing clones if any
            grid.querySelectorAll('.clone').forEach(c => c.remove());

            // Prevent image dragging
            grid.querySelectorAll('img').forEach(img => {
                img.setAttribute('draggable', 'false');
            });

            const getMetrics = () => {
                const card = grid.querySelector('.poster-card');
                if (!card) return { step: 0 };
                const cardWidth = card.offsetWidth;
                const gap = parseFloat(getComputedStyle(grid).gap) || 0;
                return { step: cardWidth + gap };
            };

            // Disable browser smooth scroll to avoid conflicts with GSAP
            grid.style.scrollBehavior = 'auto';

            newNext.addEventListener('click', () => {
                if (gsap.isTweening(grid)) return;
                const { step } = getMetrics();
                // Round current scroll to nearest step to avoid accumulation errors
                const currentPos = Math.round(grid.scrollLeft / step) * step;
                gsap.to(grid, {
                    scrollLeft: currentPos + step,
                    duration: 0.4,
                    ease: "power2.out"
                });
            });

            newPrev.addEventListener('click', () => {
                if (gsap.isTweening(grid)) return;
                const { step } = getMetrics();
                const currentPos = Math.round(grid.scrollLeft / step) * step;
                gsap.to(grid, {
                    scrollLeft: currentPos - step,
                    duration: 0.4,
                    ease: "power2.out"
                });
            });
        }
    });
}


function initExhibitionSwitcher() {
    const posterCards = document.querySelectorAll('.poster-card');

    // Auto-populate first exhibition if we are on home
    if (EXHIBITIONS.length > 0 && document.getElementById('heroTitle')) {
        populateHero(0);
        // Also mark first card as active
        if (posterCards.length > 0) posterCards[0].classList.add('active');
    }

    posterCards.forEach(card => {
        card.addEventListener('click', () => {
            const index = card.getAttribute('data-index');
            if (index !== null) {
                switchExhibition(index);
                posterCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            }
        });
    });
}

function populateHero(index) {
    const data = EXHIBITIONS[index];
    if (!data) return;

    const heroImage = document.getElementById('heroImage');
    const heroTitle = document.getElementById('heroTitle');
    const heroExhibition = document.getElementById('heroExhibition');
    const heroAbout = document.getElementById('heroAbout');

    if (heroImage) {
        heroImage.src = data.image;
        heroImage.alt = data.title;
    }
    if (heroTitle) heroTitle.textContent = data.title;
    if (heroExhibition) heroExhibition.innerHTML = data.exhibition;
    if (heroAbout) heroAbout.innerHTML = data.about;
}

function switchExhibition(index) {
    const data = EXHIBITIONS[index];
    if (!data) return;

    const heroSection = document.querySelector('.hero-section');
    const heroImage = document.getElementById('heroImage');
    const heroTitle = document.getElementById('heroTitle');
    const heroExhibition = document.getElementById('heroExhibition');
    const heroAbout = document.getElementById('heroAbout');

    // Calculate the target position: heroSection top - 100px offset (to show logo/nav)
    const targetY = heroSection.getBoundingClientRect().top + window.scrollY - 100;

    // Use GSAP ScrollTo for a MUCH smoother, fluid experience
    gsap.set(document.body, { overflow: 'hidden' });
    gsap.to(window, {
        scrollTo: { y: targetY, autoKill: false },
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
            gsap.set(document.body, { overflow: '' });
        }
    });

    gsap.to(heroSection, {
        opacity: 0,
        y: 10,
        duration: 0.3,
        onComplete: () => {
            if (heroImage) {
                heroImage.src = data.image;
                heroImage.alt = data.title;
            }
            if (heroTitle) heroTitle.textContent = data.title;
            if (heroExhibition) heroExhibition.innerHTML = data.exhibition;
            if (heroAbout) heroAbout.innerHTML = data.about;

            gsap.to(heroSection, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out"
            });
        }
    });
}

function updateActiveLink(path) {
    const navLinks = document.querySelectorAll('.nav-item');
    const currentPage = path.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage) link.classList.add('active');
    });
}

function initLightbox() {
    // Create lightbox if not exists
    let lightbox = document.querySelector('.lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-close">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </div>
            <div class="lightbox-content">
                <img src="" alt="">
            </div>
        `;
        document.body.appendChild(lightbox);

        // Close events
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.closest('.lightbox-close')) {
                lightbox.classList.remove('active');
                setTimeout(() => {
                    lightbox.style.display = 'none';
                    document.body.style.overflow = '';
                }, 400);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                lightbox.classList.remove('active');
                setTimeout(() => {
                    lightbox.style.display = 'none';
                    document.body.style.overflow = '';
                }, 400);
            }
        });
    }

    // Lightbox: showcase, story extras, locandina/poster — NOT the sub-hero banner
    const images = document.querySelectorAll(
        '.showcase-section .poster-card img,' +
        ' .story-cover img,' +
        ' .hero-image img'
    );
    images.forEach(img => {
        if (img.dataset.lightboxAttached) return;
        img.dataset.lightboxAttached = "true";

        img.addEventListener('click', (e) => {
            e.preventDefault();
            const src = img.getAttribute('src');
            const lightboxImg = lightbox.querySelector('img');
            lightboxImg.src = src;

            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                lightbox.classList.add('active');
            }, 10);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initSlider();
    initExhibitionSwitcher();
    initLightbox();
});

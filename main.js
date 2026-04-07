// Exhibition Data
const EXHIBITIONS = [
    {
        title: "DIZIONARIO DELLE PAROLE PERDUTE - UN VIAGGIO NEL LINGUAGGIO DIMENTICATO",
        image: "assets/Immagini/In Corso e next/Dizionario delle parole perdute.webp",
        exhibition: "Con la sua prima pubblicazione Matilde ci racconta dell'accuratezza della nostra lingua, tramite un dizionario originale che racconta 21 termini dimenticati. Il saggio ha lo scopo di portare alla riflessione sull'importanza delle parole e sull'impatto che esse hanno sulla nostra percezione delle cose.",
        about: " <strong> Matilde Ruffino </strong>  -  nasce a Lugo (RA) e cresce sull'isola di Chioggia. Lavora su diversi medium, favorendo il fumetto. Studia Didattica e Comunicazione dell'Arte presso l'Accademia di Belle Arti di Bologna. Attualmente \" Dizionario delle Parole Perdute \" è la sua prima pubblicazione."
    },
    {
        title: "RAIZ EXPUESTA - L'IDENTITA' COME TERRITORIO FRAMMENTATO",
        image: "assets/Immagini/In Corso e next/Raiz Expuesta.webp",
        exhibition: "Venerdì 17 Aprile alle 17:00 al Palasavena presentermo <strong> \" Raíz Expuesta \" </strong>, l'esposizione personale di Carla M. Trillo N, che ci racconta dell'identità come territorio frammentato che si consuma e si trasforma stratificandosi in un corpo che diventa archivio di ogni esperienza ed emozione. L'artista intende così unire relazioni e territorio, emotività ed immigrazione, identità e paesaggio.",
        about: "<strong>Carla M. Trillo N.</strong>  -   Nata e cresciuta a Lima, in Perù, segue una formazione nell’ambito dell’architettura durante la scuola secondaria, successivamente si avvicina verso le arti visive e studia presso la Facoltà di Arte e Design della Pontificia Universidad Católica del Perú. Attualmente vive a Bologna, dove frequenta il Triennio di Pittura presso l’Accademia di Belle Arti di Bologna."
    },
    {
        title: "MOSTRA 4 - TITOLO E DETTAGLI IN ARRIVO",
        image: "https://placehold.co/800x1200/444444/FFFFFF?text=MOSTRA+4",
        exhibition: "Descrizione della mostra 4 in fase di caricamento. Frammenta continua la sua ricerca verso nuovi orizzonti dell'arte contemporanea.",
        about: "Restate sintonizzati per scoprire i dettagli di questa nuova esposizione presso i nostri spazi."
    },
    {
        title: "MOSTRA 5 - PROSSIMAMENTE A FRAMMENTA",
        image: "https://placehold.co/800x1200/555555/FFFFFF?text=MOSTRA+5",
        exhibition: "Descrizione della mostra 5 in fase di caricamento. Una nuova prospettiva sulla visione e sulla percezione.",
        about: "Dettagli sull'artista e sulla ricerca curatoriale verranno pubblicati a breve."
    },
    {
        title: "MOSTRA 6 - CHIUSURA DELLA STAGIONE",
        image: "https://placehold.co/800x1200/666666/FFFFFF?text=MOSTRA+6",
        exhibition: "Descrizione della mostra 6 in fase di caricamento. L'ultima appuntamento della stagione espositiva corrente.",
        about: "Un evento speciale per chiudere il ciclo di mostre dedicate alla ricerca sul frammento."
    },
    {
        title: "MOSTRA 6 - CHIUSURA DELLA STAGIONE",
        image: "https://placehold.co/800x1200/666666/FFFFFF?text=MOSTRA+6",
        exhibition: "Descrizione della mostra 6 in fase di caricamento. L'ultima appuntamento della stagione espositiva corrente.",
        about: "Un evento speciale per chiudere il ciclo di mostre dedicate alla ricerca sul frammento."
    }
];

// Initialize Barba.js
barba.init({
    transitions: [{
        name: 'opacity-transition',
        leave(data) {
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

            gsap.from(data.next.container, {
                opacity: 0,
                y: 10,
                duration: 0.4,
                ease: 'power2.out'
            });

            gsap.to(window, {
                scrollTo: { y: 0, autoKill: false },
                duration: 0.4,
                ease: "power2.inOut",
                onComplete: () => {
                    gsap.set(document.body, { overflow: '' });
                }
            });
        }
    }]
});

function initSlider() {
    // Re-initialize for each section that might contain a slider
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const grid = section.querySelector('.poster-grid');
        const nextBtn = section.querySelector('.slideNext');
        const prevBtn = section.querySelector('.slidePrev');

        if (grid && nextBtn && prevBtn) {
            // Remove previous listeners if any (simple way for barba)
            const newNext = nextBtn.cloneNode(true);
            const newPrev = prevBtn.cloneNode(true);
            nextBtn.parentNode.replaceChild(newNext, nextBtn);
            prevBtn.parentNode.replaceChild(newPrev, prevBtn);

            newNext.addEventListener('click', () => {
                const card = grid.querySelector('.poster-card');
                if (!card) return;
                const cardWidth = card.offsetWidth;
                const gap = parseFloat(getComputedStyle(grid).gap) || 0;
                const scrollAmount = cardWidth + gap;

                gsap.to(grid, {
                    scrollLeft: grid.scrollLeft + scrollAmount,
                    duration: 0.6,
                    ease: 'power2.out'
                });
            });

            newPrev.addEventListener('click', () => {
                const card = grid.querySelector('.poster-card');
                if (!card) return;
                const cardWidth = card.offsetWidth;
                const gap = parseFloat(getComputedStyle(grid).gap) || 0;
                const scrollAmount = cardWidth + gap;

                gsap.to(grid, {
                    scrollLeft: grid.scrollLeft - scrollAmount,
                    duration: 0.6,
                    ease: 'power2.out'
                });
            });
        }
    });
}

function initExhibitionSwitcher() {
    const posterCards = document.querySelectorAll('.poster-card');
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

document.addEventListener('DOMContentLoaded', () => {
    initSlider();
    initExhibitionSwitcher();
});

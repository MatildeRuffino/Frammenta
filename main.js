// Exhibition Data
const EXHIBITIONS = [
    {
        title: "GIULIA RONCARATO CI PORTA ALLA SCOPERTA DELLE INSIDIE DEL CAMBIAMENTO CLIMATICO",
        image: "assets/Immagini/In Corso e next/Collage Climatico.webp",
        exhibition: "It engages with the idea that seeing, like looking deep into the universe, is never direct. What is perceived arrives filtered through time, distance, and the accumulation of prior experience. Vision is not passive; it is shaped, influenced, and often unconsciously interpreted before recognition takes place.",
        about: "Schisis considers how vision operates in the space between observation and the accumulation of prior experience. Vision is not passive; it is shaped, influenced, and often unconsciously interpreted before recognition takes place."
    },
    {
        title: "DIZIONARIO DELLE PAROLE PERDUTE - UN VIAGGIO NEL LINGUAGGIO DIMENTICATO",
        image: "assets/Immagini/In Corso e next/Dizionario delle parole perdute.webp",
        exhibition: "Una mostra che esplora il potere delle parole cadute in disuso. Ogni installazione è un frammento di memoria linguistica, un tentativo di ridare vita a concetti che non hanno più un nome nel quotidiano.",
        about: "Dizionario delle parole perdute è un progetto di ricerca visiva che unisce tipografia, installazioni sonore e arte materica per riflettere sulla fragilità della nostra cultura verbale."
    },
    {
        title: "ECODIBATTITO - IL FUTURO DELLA SOSTENIBILITA' NELL'ARTE",
        image: "assets/Immagini/In Corso e next/Raiz Expuesta.webp",
        exhibition: "Confronto tra diversi artisti sulla sostenibilità ambientale. La mostra indaga come l'arte possa fungere da catalizzatore per il cambiamento sociale e politico.",
        about: "Ecodibattito raccoglie opere create esclusivamente con materiali riciclati, sfidando lo spettatore a riconsiderare il valore dell'oggetto e la sua persistenza nel tempo."
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
    }
];

// Initialize Barba.js
barba.init({
    transitions: [{
        name: 'opacity-transition',
        leave(data) {
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
                duration: 0.6,
                ease: "power2.out"
            });
        }
    }]
});

function initSlider() {
    const grid = document.getElementById('posterGrid');
    const nextBtn = document.getElementById('slideNext');
    const prevBtn = document.getElementById('slidePrev');

    if (grid && nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            const card = grid.querySelector('.poster-card');
            const cardWidth = card.offsetWidth;
            const gap = parseFloat(getComputedStyle(grid).gap) || 0;
            const scrollAmount = cardWidth + gap;

            gsap.to(grid, {
                scrollLeft: grid.scrollLeft + scrollAmount,
                duration: 0.6,
                ease: 'power2.out'
            });
        });

        prevBtn.addEventListener('click', () => {
            const card = grid.querySelector('.poster-card');
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
    gsap.to(window, {
        scrollTo: { y: targetY, autoKill: false },
        duration: 0.5,
        ease: "power2.out"
    });

    gsap.to(heroSection, {
        opacity: 0,
        y: 10,
        duration: 0.3,
        onComplete: () => {
            if (heroImage) heroImage.src = data.image;
            if (heroTitle) heroTitle.textContent = data.title;
            if (heroExhibition) heroExhibition.textContent = data.exhibition;
            if (heroAbout) heroAbout.textContent = data.about;

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

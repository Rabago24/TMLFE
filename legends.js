"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const cards = Array.from(
        document.querySelectorAll(".legend-card")
    );

    const dotsContainer =
        document.getElementById("legends-dots");

    const previousButton =
        document.getElementById("legend-prev");

    const nextButton =
        document.getElementById("legend-next");


    if (
        cards.length === 0 ||
        !dotsContainer ||
        !previousButton ||
        !nextButton
    ) {
        return;
    }


    let currentIndex = 0;
    let intervalId = null;


    cards.forEach((card, index) => {

        const dot = document.createElement("button");

        dot.type = "button";
        dot.className = "legends-dot";

        dot.setAttribute(
            "aria-label",
            `Mostrar leyenda ${index + 1}`
        );


        dot.addEventListener("click", () => {

            showLegend(index);
            restartAutoplay();

        });


        dotsContainer.appendChild(dot);

    });


    const dots = Array.from(
        dotsContainer.querySelectorAll(".legends-dot")
    );


    function showLegend(index) {

        currentIndex =
            (index + cards.length) % cards.length;


        cards.forEach((card, cardIndex) => {

            card.classList.toggle(
                "active",
                cardIndex === currentIndex
            );

        });


        dots.forEach((dot, dotIndex) => {

            dot.classList.toggle(
                "active",
                dotIndex === currentIndex
            );

        });

    }


    function nextLegend() {

        showLegend(currentIndex + 1);

    }


    function previousLegend() {

        showLegend(currentIndex - 1);

    }


    function startAutoplay() {

        stopAutoplay();

        intervalId = window.setInterval(
            nextLegend,
            6000
        );

    }


    function stopAutoplay() {

        if (intervalId !== null) {

            window.clearInterval(intervalId);
            intervalId = null;

        }

    }


    function restartAutoplay() {

        startAutoplay();

    }


    previousButton.addEventListener("click", () => {

        previousLegend();
        restartAutoplay();

    });


    nextButton.addEventListener("click", () => {

        nextLegend();
        restartAutoplay();

    });


    const banner =
        document.querySelector(".legends-premium-banner");


    if (banner) {

        banner.addEventListener(
            "mouseenter",
            stopAutoplay
        );


        banner.addEventListener(
            "mouseleave",
            startAutoplay
        );

    }


    showLegend(0);
    startAutoplay();

});

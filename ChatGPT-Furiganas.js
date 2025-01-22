// ==UserScript==
// @name         ChatGPT Furigana Formater
// @version      2025.01.22.10.28
// @description  ChatGPT Furigana formating
// @author       Remy Maetz
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let isFormating;

    // Fonction pour transformer le texte en ajoutant les furigana
    function formatTextWithFurigana(element) {
        // Si la fonction de formatage est déjà en cours sur la page, on ne la rappelle pas.
        if (isFormating)
          return;
      
        if (!element || element.nodeType !== Node.ELEMENT_NODE) return;

        isFormating = true;

        // Sélectionne tous les noeuds texte dans l'élément
        let walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        let node;

        while (node = walker.nextNode()) {
            // Remplace le texte avec le format {{lecture}}
            let updatedText = node.nodeValue.replace(/(\p{Script=Han})\{\{(.*?)\}\}/gu, (match, kanji, kana) => {
                return `<ruby>${kanji}<rt>${kana}</rt></ruby>`;
            });

            // Remplace uniquement si le texte a changé
            if (updatedText !== node.nodeValue) {
                let span = document.createElement('span');
                span.innerHTML = updatedText;
                node.parentNode.replaceChild(span, node);
            }
        }

        isFormating = false;
    }

    // Appliquer le formatage à tout le body ou une section spécifique
    function applyFuriganaFormatting() {
        let target = document.body; // Vous pouvez changer pour cibler un élément spécifique
        formatTextWithFurigana(target);
    }

    let formatTimeout;

    // Observer pour détecter les changements dynamiques avec délai
    const observer = new MutationObserver(() => {
        clearTimeout(formatTimeout); // Réinitialise le délai à chaque changement
        formatTimeout = setTimeout(() => {
            applyFuriganaFormatting();
        }, 1000); // Délai de 1 seconde
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Appliquer le formatage initialement
    window.addEventListener('load', applyFuriganaFormatting);
})();

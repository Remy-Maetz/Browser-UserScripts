// ==UserScript==
// @name         ChatGPT Furigana Formater
// @version      2025-01-22
// @description  ChatGPT Furigana formating
// @author       Remy Maetz
// @match        https://chatgpt.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Fonction pour transformer le texte en ajoutant les furigana
    function formatTextWithFurigana(element) {
        if (!element || element.nodeType !== Node.ELEMENT_NODE) return;

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
    }

    // Appliquer le formatage à tout le body ou une section spécifique
    function applyFuriganaFormatting() {
        let target = document.body; // Vous pouvez changer pour cibler un élément spécifique
        formatTextWithFurigana(target);
    }

    // Exécuter la fonction régulièrement pour capturer les ajouts dynamiques
    const observer = new MutationObserver(() => {
        applyFuriganaFormatting();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Appliquer le formatage initialement
    window.addEventListener('load', applyFuriganaFormatting);
})();

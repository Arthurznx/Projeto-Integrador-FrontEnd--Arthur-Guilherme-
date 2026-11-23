/**
 * Ponto de Entrada Principal - Animalia
 * Inicializa a navegação acessível e a exploração dinâmica da fauna paraibana.
 */

import { inicializarNavegacao } from './components/navigation.js';
import { inicializarExploradorFauna } from './components/fauna-explorer.js';

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar navegação responsiva e observador de seções
    inicializarNavegacao();

    // Inicializar barra de pesquisa, filtros e cards da fauna
    inicializarExploradorFauna();
});

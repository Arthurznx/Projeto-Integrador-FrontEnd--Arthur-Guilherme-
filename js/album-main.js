/**
 * Ponto de Entrada da Página do Álbum Animal
 * Inicializa a navegação responsiva e o gerenciador completo do Álbum Animal.
 */

import { inicializarNavegacao } from './components/navigation.js';
import { inicializarAlbumUI } from './components/album-ui.js';

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar menu e acessibilidade de navegação
    inicializarNavegacao();

    // Inicializar lógica de acesso, criação e registros do Álbum Animal
    inicializarAlbumUI();
});

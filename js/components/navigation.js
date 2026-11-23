/**
 * Módulo de Navegação
 * Controla a interatividade do menu principal, responsividade e acessibilidade.
 */

export function inicializarNavegacao() {
    const botaoMenu = document.querySelector('#botao-menu') || document.querySelector('.botao-menu');
    const menuPrincipal = document.querySelector('#menu-principal') || document.querySelector('.menu-principal');

    if (botaoMenu && menuPrincipal) {
        // Alternar abertura do menu mobile
        botaoMenu.addEventListener('click', () => {
            const estaAberto = botaoMenu.getAttribute('aria-expanded') === 'true';
            const novoEstado = !estaAberto;

            botaoMenu.setAttribute('aria-expanded', String(novoEstado));
            menuPrincipal.classList.toggle('aberto', novoEstado);
        });

        // Fechar menu mobile ao clicar em um link interno
        menuPrincipal.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    botaoMenu.setAttribute('aria-expanded', 'false');
                    menuPrincipal.classList.remove('aberto');
                }
            });
        });

        // Fechar ao clicar fora
        document.addEventListener('click', (evento) => {
            if (
                window.innerWidth <= 768 &&
                !botaoMenu.contains(evento.target) &&
                !menuPrincipal.contains(evento.target) &&
                menuPrincipal.classList.contains('aberto')
            ) {
                botaoMenu.setAttribute('aria-expanded', 'false');
                menuPrincipal.classList.remove('aberto');
            }
        });

        // Fechar com a tecla Escape
        document.addEventListener('keydown', (evento) => {
            if (evento.key === 'Escape' && menuPrincipal.classList.contains('aberto')) {
                botaoMenu.setAttribute('aria-expanded', 'false');
                menuPrincipal.classList.remove('aberto');
                botaoMenu.focus();
            }
        });
    }

    // Gerenciar estado visual dos links ativos
    const links = document.querySelectorAll('.menu-principal a');
    const secoes = document.querySelectorAll('main section[id]');

    if ('IntersectionObserver' in window && secoes.length > 0) {
        const observador = new IntersectionObserver((entradas) => {
            entradas.forEach((entrada) => {
                if (entrada.isIntersecting) {
                    const id = entrada.target.getAttribute('id');
                    links.forEach((link) => {
                        const href = link.getAttribute('href');
                        if (href === `#${id}`) {
                            link.classList.add('ativo');
                            link.setAttribute('aria-current', 'location');
                        } else if (href && href.startsWith('#')) {
                            link.classList.remove('ativo');
                            link.removeAttribute('aria-current');
                        }
                    });
                }
            });
        }, {
            rootMargin: '-30% 0px -60% 0px'
        });

        secoes.forEach((secao) => observador.observe(secao));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');
    const closeMenu = document.getElementById('close-menu');

   
    menuToggle.addEventListener('click', () => {
        menu.style.display = 'flex';
    });

    
    closeMenu.addEventListener('click', () => {
        menu.style.display = 'none';
    });

   
    document.addEventListener('click', (event) => {
        if (!menu.contains(event.target) && event.target !== menuToggle) {
            menu.style.display = 'none';
        }
    });
});

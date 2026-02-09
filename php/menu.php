<header class="encabezado">   
    <img src="./logo.webp" alt="Logo" class="logo">
    <section class="titulo">
        <label id="coorarg">Coordenadas Argentina</label>
        <nav id="navmenu">
            <ul id="listamenu">
                <li><a href="index.php?vista=home" class = "botonnav">Inicio</a></li>
                <li><a href="index.php?vista=usuario" class = "botonnav">Datos Usuario</a></li>
                <li><a href="index.php?vista=mdt" class = "botonnav">MDT</a></li>
                <li><a href="https://transcoord.gcuello.serv00.net/" class = "botonnav">Global</a></li>
            </ul>
        </nav>
    </section>
</header>

<script>
    document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const vista = urlParams.get('vista') || 'home';

    const enlaces = document.querySelectorAll('#listamenu a');

    enlaces.forEach(enlace => {
        const hrefParams = new URL(enlace.href).searchParams;
        const hrefVista = hrefParams.get('vista');

        if (hrefVista === vista) {
            enlace.classList.add('active');
        }
    });
});
</script>
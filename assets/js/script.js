$(document).ready(function () {
    /* url API */
    const SUPER_HERO_API_URL = 'https://www.superheroapi.com/api.php/d05c7a4e9328e9de8a45eb679aa7d459/';

    /* Click en botón de buqueda #findHero */
    $('#findHero').click(function () {
        /* Input ingresado */
        const heroNumber = parseInt($('#heroNumber').val());
        if (isNaN(heroNumber)) {
            /* Verificación de que se ingresa un número */
            alert("Ingrese un número")
        } else if (heroNumber < 1 || heroNumber > 731) {
            /* Verificación de que se ingresa un número en el rango definido por https://www.superheroapi.com/ids.html */
            alert("Número no está en el rango de 1 a 731, número ingresado: " + heroNumber);
        } else {
            /* Si todo es correcto se ejecuta getHero */
            getHero(heroNumber);
            /* Se agregan algunas clases para modificar UI*/
            addClasses();
        }
    });

    /* getHero busca al superHero con url + heroNumber */
    function getHero(heroNumber) {
        /* AJAX con sintaxis de jQuery */
        $.ajax({
            url: SUPER_HERO_API_URL + heroNumber,
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                /* Información del superHero enviada al html */
                displayHeroInfo(data);
                /* gráfico de canvasJS */
                displayHeroChart(data);
            },
            error: function (error) {
                /* Información de algún posible error */
                console.log('Error: ', error);
            }
        });
    }

    /* Se agregan clases */
    function addClasses() {
        $('#mainImage').addClass("d-none");
        $('#chartContainer').addClass("chartContainer");
    }

    /* Información enviada a index.html */
    function displayHeroInfo(data) {
        const aliasesString = data.biography.aliases.join(', ');
        const superHeroHtml = `
            <h2 class="text-center fw-bold">SuperHero Encontrado</h2>
            <div class="card">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img class="imgHero img-fluid rounded w-100 object-fit-cover" src="${data.image.url}" alt="SuperHero: ${data.name}">
                    </div>
                    <div class="card-body col-md-8">
                        <p>Nombre: ${data.name}</p>
                        <p>Conexiones: ${data.connections["group-affiliation"]}</p>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">Publicado por: ${data.biography.publisher}</li>
                            <li class="list-group-item">Ocupación: ${data.work.occupation}</li>
                            <li class="list-group-item">Primera aparición: ${data.biography["first-appearance"]}</li>
                            <li class="list-group-item">Altura: ${data.appearance.height.join(' - ')}</li>
                            <li class="list-group-item">Peso: ${data.appearance.weight.join(' - ')}</li>
                            <li class="list-group-item">Alianzas: ${aliasesString}</li>
                        </ul>
                    </div>
                </div>
            </div>`;
        $('#superHero').html(superHeroHtml);
    }

    /* Gráfico de canvasJS */
    function displayHeroChart(data) {
        const powerstats = data.powerstats;
        const chartData = [];
        let hasNullData = false;
        for (let stat in powerstats) {
            if (powerstats.hasOwnProperty(stat)) {
                if (powerstats[stat] === "null") {
                    hasNullData = true;
                    break; // Detiene el ciclo for ya que hay al menos 1 dato nulo y no se puede generar el gráfico
                }
                chartData.push({ y: powerstats[stat], label: stat });
            }
        }
        const options = {
            animationEnabled: true,
            title: {
                text: `Estadísticas de Poder para ${data.name}`
            },
            data: [{
                type: "pie",
                startAngle: 55,
                showInLegend: "true",
                legendText: "{label}",
                yValueFormatString: "(##)",
                indexLabel: "{label} {y}",
                dataPoints: chartData
            }]
        };
        if (hasNullData) {
            /* Si no estan todos los datos del superHero envia un mensaje al html */
            $("#chartContainer").html(`<h2 class="text-center text-danger fw-bold">Las estadísticas del SuperHero están incompletas...</h2>`)
        } else {
            /* Si todo está bien envía el gráfico al index.html */
            $("#chartContainer").CanvasJSChart(options);
        }
    }

});
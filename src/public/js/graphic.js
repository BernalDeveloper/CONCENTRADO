function showHTML(containerId){
    // Ocultar todos los contenedores de contenido
    var containers = document.querySelectorAll('.content-container');
    containers.forEach(function(container) {
        container.style.display = 'none';
    });

    // Mostrar el contenedor de contenido específico
    var specificContainer= document.getElementsByName(containerId);
    specificContainer.forEach(function(container) {
        container.style.display = 'block';
    });
}

function sendId(containerId, idRuta){
    // Ocultar todos los contenedores de contenido
    var containers = document.querySelectorAll('.content-container');
    containers.forEach(function(container) {
        container.style.display = 'none';
    });

    // Mostrar el contenedor de contenido específico
    var specificContainer= document.getElementsByName(containerId);
    specificContainer.forEach(function(container) {
        container.style.display = 'block';
    });

    //Obtener el valor del id
    var inputRutaId = document.getElementById('idRuta');
    if(inputRutaId){
        inputRutaId.value = idRuta;
    }
}

function sendIdTable(containerId, idRuta){
    // Ocultar todos los contenedores de contenido
    var containers = document.querySelectorAll('.content-container');
    containers.forEach(function(container) {
        container.style.display = 'none';
    });

    // Mostrar el contenedor de contenido específico
    var specificContainer= document.getElementsByName(containerId);
    specificContainer.forEach(function(container) {
        container.style.display = 'block';
    });

    fetch(`/orders/${idRuta}`)
        .then(response => response.json())
        .then(data => {
            // Asumiendo que 'data' es un array de pedidos
            obtainOrders(data);
        })
        .catch(error => console.error('Error al cargar los pedidos:', error));
}

function obtainOrders(pedidos) {
    let tbody = document.querySelector('#orders-body');
    tbody.innerHTML = ''; // Limpiar filas existentes
    pedidos.forEach(pedido => {
        let tr = document.createElement('tr');
        tr.id = 'row--' + pedido.IDFOLIO;
        tr.innerHTML = `<td>${pedido.IDDOCUMENTO}</td>
                        <td>${pedido.RAZONSOCIAL}</td>
                        <td>${pedido.POBLACION}</td>
                        <td>${pedido.FOLIO}</td>
                        <td><button class="btn btn-outline-primary" onclick="sendIdOrder('order-edit', '${pedido.IDFOLIO}')">EDITAR</button></td>
                        <td><button class="btn btn-outline-danger" onclick="deleteOrder('${pedido.IDFOLIO}')">ELIMINAR</button></td>`;
        tbody.appendChild(tr);
    });
}

function sendIdOrder(containerId, idOrder){
    // Ocultar todos los contenedores de contenido
    var containers = document.querySelectorAll('.content-container');
    containers.forEach(function(container) {
        container.style.display = 'none';
    });

    // Mostrar el contenedor de contenido específico
    var specificContainer= document.getElementsByName(containerId);
    specificContainer.forEach(function(container) {
        container.style.display = 'block';
    });

    var inputOrderId = document.getElementById('idOrder');
    if(inputOrderId){
        inputOrderId.value = idOrder;
    }
}

function deleteOrder(idFolio) {
    if (confirm("¿Estás seguro de que deseas eliminar este pedido?")) {
        fetch(`/order/delete/${idFolio}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Pedido eliminado exitosamente.");
                document.getElementById('row--'+idFolio).remove(); // Remueve la fila de la tabla
            } else {
                alert("Hubo un error al eliminar el pedido.");
            }
        })
        .catch(error => console.error('Error al eliminar el pedido:', error));
    }
}

setTimeout(() => {
    document.querySelector('.alert').style.display = 'none';
}, 5000);

function initAutocomplete() {
  const input = document.getElementById('location-input');
  const autocomplete = new google.maps.places.Autocomplete(input, {
    types: ['geocode']
  });
}
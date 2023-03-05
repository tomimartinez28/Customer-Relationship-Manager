(function() {
    let DB;
    const listadoCliente = document.querySelector('#listado-clientes'); 
    
    document.addEventListener('DOMContentLoaded', function() {
        crearDB();

        if(window.indexedDB.open('crm', 1)) {
            obtenerClientes();
        } 

        listadoCliente.addEventListener('click', eliminarCliente);

    });




    // Eliminar el evento

    function eliminarCliente(e) {

        if(e.target.classList.contains('eliminar')) {

            const clienteID = Number(e.target.dataset.cliente);
            const confirmar = confirm('Deseas eliminar este cliente?'); // devuelve true or false
            if(confirmar) {
                const transaction = DB.transaction(['crm'], 'readwrite');
                const objectStore = transaction.objectStore('crm');
                objectStore.delete(clienteID)
                transaction.oncomplete = () => {
                    e.target.parentElement.parentElement.remove();
                }
                transaction.onerror = () => {
                    console.error('Hubo un error');
                }
            }
        }
    }

    


    
    // Funcion que crear una DB
    function crearDB() {
        const crearDB = window.indexedDB.open('crm', 1);

        crearDB.onerror = function() {
            console.log('ERROR AL CREAR LA BASE DE DATOS');
        }

        crearDB.onsuccess = function() {
            DB = crearDB.result;
        }
        
        crearDB.onupgradeneeded = function(e) {
            const db = e.target.result;
            const objectStore = db.createObjectStore('crm', { keyPath: 'id', autoIncrement: true });
            objectStore.createIndex('nombre', 'nombre', { unique: false });
            objectStore.createIndex('email', 'email', { unique: true });
            objectStore.createIndex('telefono', 'telefono', { unique: false });
            objectStore.createIndex('empresa', 'empresa', { unique: false });
            objectStore.createIndex('id', 'id', { unique: true });

        }
    }
    
    function obtenerClientes() {
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function() {
            console.error('Hubo un error');
        };

        abrirConexion.onsuccess = function() {
            DB = abrirConexion.result;
            const objectStore = DB.transaction('crm').objectStore('crm');
            objectStore.openCursor().onsuccess = function(e) {

                const cursor = e.target.result;

                if(cursor) {
                    const { nombre, empresa, email, telefono, id } = cursor.value;
                    
                    // CREO EL HTML
                    
                    listadoCliente.innerHTML += ` 
                        <tr>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                                <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                <p class="text-gray-700">${telefono}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                                <p class="text-gray-600">${empresa}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                                <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                                <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                            </td>
                        </tr>
                    `;

                    


                    cursor.continue();
                };
            }

        }
    }

    
})();
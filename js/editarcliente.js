(function() {
    
    let idCliente; // la inicializo para poder usarla fuera del scope de la funcion

    const formulario = document.querySelector('#formulario');
    const nombreInput = document.querySelector('#nombre'); 
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');



    document.addEventListener('DOMContentLoaded', () => {

        conectarDB();


        // ACTUALIZA EL CLIENTE
        formulario.addEventListener('submit', actualizarCliente)

        
        // verificar el ID de la URL
        const parametrosURL = new URLSearchParams(window.location.search);
        idCliente = parametrosURL.get('id');
        if(idCliente) {
            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 1000);
            
        }
    })


    function obtenerCliente(id) {

        const transaction = DB.transaction(['crm'],'readwrite');
        const objectStore = transaction.objectStore('crm');
        const cliente = objectStore.openCursor();
        cliente.onsuccess = function(e) {
            const cursor = e.target.result;
            
            if(cursor) {
                if(cursor.value.id === Number(id)) {
                    llenarFormulario(cursor.value); // le pasa el objeto
                }
                cursor.continue()
            };
        }
    }


    function actualizarCliente(e) {
        e.preventDefault();
        // validar
        if(nombreInput.value === '' || emailInput.value === '' || telefonoInput.value === '' || empresaInput.value === '') {
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return
        };


        // Actualizar cliente
        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            id: Number(idCliente),
        }

        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');
        objectStore.put(clienteActualizado)
        transaction.oncomplete = () => {
            imprimirAlerta('Cliente actualizado correctamente');
            setTimeout(() => {
                window.location.href = 'index.html'
            }, 1000);
        }
        transaction.onerror = () => imprimirAlerta('Hubo un error al actualizar el cliente', 'error');




    }


    function llenarFormulario(cliente) {
        const {nombre, telefono, email, empresa, id} = cliente;
        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
        }






})();
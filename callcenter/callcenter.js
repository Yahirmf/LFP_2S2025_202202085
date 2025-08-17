// =======================
// MODELOS
// =======================
class Operador {
    constructor(id, nombre) {
        this.id = id;
        this.nombre = nombre;
    }
}

class Cliente {
    constructor(id, nombre) {
        this.id = id;
        this.nombre = nombre;
    }
}

class Llamada {
    constructor(operador, cliente, estrellas) {
        this.operador = operador; // instancia de Operador
        this.cliente = cliente;   // instancia de Cliente
        this.estrellas = estrellas; // número (0 a 5)
    }

    clasificacion() {
        if (this.estrellas >= 4) return "Buena";
        if (this.estrellas >= 2) return "Media";
        return "Mala";
    }
}

// =======================
// CONTROLADOR PRINCIPAL
// =======================
const fs = require('fs');

class CallCenter {
    constructor() {
        this.operadores = [];
        this.clientes = [];
        this.llamadas = [];
    }

    cargarRegistros(rutaArchivo) {
        try {
            const data = fs.readFileSync(rutaArchivo, 'utf-8');
            const lineas = data.trim().split('\n');

            for (let linea of lineas) {
                const [idOp, nombreOp, estrellasStr, idCli, nombreCli] = linea.split(',');

                // Convertir calificación a número de estrellas
                const estrellas = estrellasStr.split('').filter(e => e.toLowerCase() === 'x').length;

                // Buscar o crear operador
                let operador = this.operadores.find(op => op.id === idOp);
                if (!operador) {
                    operador = new Operador(idOp, nombreOp);
                    this.operadores.push(operador);
                }

                // Buscar o crear cliente
                let cliente = this.clientes.find(c => c.id === idCli);
                if (!cliente) {
                    cliente = new Cliente(idCli, nombreCli);
                    this.clientes.push(cliente);
                }

                // Crear la llamada
                const llamada = new Llamada(operador, cliente, estrellas);
                this.llamadas.push(llamada);
            }

            console.log("✅ Registros cargados con éxito.");
        } catch (error) {
            console.log("❌ Error al cargar el archivo:", error.message);
        }
    }

    exportarHistorialHTML() {
        let html = `<html><body><h1>Historial de Llamadas</h1><table border="1"><tr><th>ID Operador</th><th>Nombre Operador</th><th>ID Cliente</th><th>Nombre Cliente</th><th>Estrellas</th></tr>`;
        for (let llamada of this.llamadas) {
            html += `<tr>
                <td>${llamada.operador.id}</td>
                <td>${llamada.operador.nombre}</td>
                <td>${llamada.cliente.id}</td>
                <td>${llamada.cliente.nombre}</td>
                <td>${'★'.repeat(llamada.estrellas)}</td>
            </tr>`;
        }
        html += `</table></body></html>`;
        fs.writeFileSync('historial.html', html);
        console.log("📄 Historial exportado en historial.html");
    }

    exportarOperadoresHTML() {
        let html = `<html><body><h1>Listado de Operadores</h1><table border="1"><tr><th>ID</th><th>Nombre</th></tr>`;
        for (let op of this.operadores) {
            html += `<tr><td>${op.id}</td><td>${op.nombre}</td></tr>`;
        }
        html += `</table></body></html>`;
        fs.writeFileSync('operadores.html', html);
        console.log("📄 Operadores exportados en operadores.html");
    }

    exportarClientesHTML() {
        let html = `<html><body><h1>Listado de Clientes</h1><table border="1"><tr><th>ID</th><th>Nombre</th></tr>`;
        for (let cli of this.clientes) {
            html += `<tr><td>${cli.id}</td><td>${cli.nombre}</td></tr>`;
        }
        html += `</table></body></html>`;
        fs.writeFileSync('clientes.html', html);
        console.log("📄 Clientes exportados en clientes.html");
    }

    exportarRendimientoHTML() {
        let totalLlamadas = this.llamadas.length;
        let html = `<html><body><h1>Rendimiento de Operadores</h1><table border="1"><tr><th>ID</th><th>Nombre</th><th>% Atención</th></tr>`;
        for (let op of this.operadores) {
            let llamadasOp = this.llamadas.filter(l => l.operador.id === op.id).length;
            let porcentaje = ((llamadasOp / totalLlamadas) * 100).toFixed(2);
            html += `<tr><td>${op.id}</td><td>${op.nombre}</td><td>${porcentaje}%</td></tr>`;
        }
        html += `</table></body></html>`;
        fs.writeFileSync('rendimiento.html', html);
        console.log("📄 Rendimiento exportado en rendimiento.html");
    }

    mostrarPorcentajesClasificacion() {
        let total = this.llamadas.length;
        let buenas = this.llamadas.filter(l => l.clasificacion() === "Buena").length;
        let medias = this.llamadas.filter(l => l.clasificacion() === "Media").length;
        let malas = this.llamadas.filter(l => l.clasificacion() === "Mala").length;

        console.log(`📊 Porcentajes de Clasificación:
        Buenas: ${(buenas / total * 100).toFixed(2)}%
        Medias: ${(medias / total * 100).toFixed(2)}%
        Malas: ${(malas / total * 100).toFixed(2)}%`);
    }

    mostrarCantidadPorEstrellas() {
        let conteo = {1:0,2:0,3:0,4:0,5:0};
        for (let llamada of this.llamadas) {
            if (llamada.estrellas >= 1 && llamada.estrellas <= 5) {
                conteo[llamada.estrellas]++;
            }
        }
        console.log("📞 Cantidad de Llamadas por Estrellas:");
        for (let i = 1; i <= 5; i++) {
            console.log(`${i} estrellas: ${conteo[i]}`);
        }
    }
}

// =======================
// MENÚ PRINCIPAL
// =======================
const readline = require('readline-sync');
const callCenter = new CallCenter();

while (true) {
    console.log(`
===== MENÚ PRINCIPAL =====
1. Cargar Registros de Llamadas
2. Exportar Historial de Llamadas
3. Exportar Listado de Operadores
4. Exportar Listado de Clientes
5. Exportar Rendimiento de Operadores
6. Mostrar Porcentaje de Clasificación de Llamadas
7. Mostrar Cantidad de Llamadas por Calificación
8. Salir
==========================
    `);

    let opcion = readline.question("Seleccione una opción: ");

    switch (opcion) {
        case '1':
            let ruta = readline.question("Ingrese la ruta del archivo CSV: ");
            callCenter.cargarRegistros(ruta);
            break;
        case '2':
            callCenter.exportarHistorialHTML();
            break;
        case '3':
            callCenter.exportarOperadoresHTML();
            break;
        case '4':
            callCenter.exportarClientesHTML();
            break;
        case '5':
            callCenter.exportarRendimientoHTML();
            break;
        case '6':
            callCenter.mostrarPorcentajesClasificacion();
            break;
        case '7':
            callCenter.mostrarCantidadPorEstrellas();
            break;
        case '8':
            console.log("👋 Saliendo del programa...");
            process.exit();
        default:
            console.log("❌ Opción inválida");
    }
}

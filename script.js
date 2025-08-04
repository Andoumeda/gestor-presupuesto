document.addEventListener('DOMContentLoaded', () => {
    const formIngreso = document.getElementById('form-ingreso');
    const formGasto = document.getElementById('form-gasto');

    const montoIngreso = document.getElementById('monto-ingreso');
    const montoGasto = document.getElementById('monto-gasto');

    const elemBalance = document.getElementById('balance');
    const elemTotalIngresos = document.getElementById('total-ingresos');
    const elemTotalGastos = document.getElementById('total-gastos');

    const elemListaIngresos = document.getElementById('lista-ingresos').querySelector('ul');
    const elemListaGastos = document.getElementById('lista-gastos').querySelector('ul');

    const elemGrafico = document.getElementById('grafico');

    let ingresos = JSON.parse(localStorage.getItem('ingresos')) || [];
    let gastos = JSON.parse(localStorage.getItem('gastos')) || [];

    let grafico;

    function actualizarBalance() {
        const totalIngresos = ingresos.reduce((acc, ingreso) => acc + ingreso.monto, 0);
        const totalGastos = gastos.reduce((acc, gasto) => acc + gasto.monto, 0);
        const balance = totalIngresos - totalGastos;

        elemBalance.style.color = (balance < 0) ? 'red'
                                : (balance > 0) ? 'green'
                                : '#222';

        elemBalance.textContent = `Balance Actual: Gs. ${balance.toLocaleString('es-PY')}`;
        elemTotalIngresos.textContent = `Gs. ${totalIngresos.toLocaleString('es-PY')}`;
        elemTotalGastos.textContent = `Gs. ${totalGastos.toLocaleString('es-PY')}`;

        localStorage.setItem('ingresos', JSON.stringify(ingresos));
        localStorage.setItem('gastos', JSON.stringify(gastos));

        actualizarListas();
        actualizarGrafico(totalIngresos, totalGastos);
    }

    function actualizarListas() {
        elemListaIngresos.innerHTML = '';
        elemListaGastos.innerHTML = '';

        ingresos.forEach((ingreso, indice) => {
            const li = document.createElement('li');
            li.innerHTML = `<div><b>${ingreso.descripcion}:</b> Gs. ${ingreso.monto.toLocaleString('es-PY')}</div>`;

            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = '× Eliminar';
            btnEliminar.onclick = () => {
                ingresos.splice(indice, 1); // Elimina 1 elemento en el índice actual
                actualizarBalance();
            };

            li.appendChild(btnEliminar);
            elemListaIngresos.appendChild(li);
        });

        gastos.forEach((gasto, indice) => {
            const li = document.createElement('li');
            li.innerHTML = `<div><b>${gasto.descripcion}:</b> Gs. ${gasto.monto.toLocaleString('es-PY')}</div>`;

            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = '× Eliminar';
            btnEliminar.onclick = () => {
                gastos.splice(indice, 1);
                actualizarBalance();
            };

            li.appendChild(btnEliminar);
            elemListaGastos.appendChild(li);
        });
    }

    function actualizarGrafico(totalIngresos, totalGastos) {
        if (grafico) {
            grafico.data.datasets[0].data = [totalIngresos, totalGastos];
            grafico.update();
        }
        else {
            grafico = new Chart(elemGrafico, {
                type: 'pie',
                data: {
                    labels: ['Ingresos', 'Gastos'],
                    datasets: [{
                        data: [totalIngresos, totalGastos],
                        backgroundColor: ['lightseagreen', '#6070f0'],
                        borderWidth: 0,
                        hoverOffset: 12
                    }]
                },
                options: {
                    plugins: {
                        legend: {
                            position: 'left',
                            labels: {
                                padding: 60,
                                usePointStyle: true,
                                pointStyle: 'rectRounded',
                                font: {
                                    size: 18
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    montoIngreso.addEventListener('input', () => {
        document.getElementById('agregar-ingreso').disabled = (montoIngreso.value <= 0);
    });

    montoGasto.addEventListener('input', () => {
        document.getElementById('agregar-gasto').disabled = (montoGasto.value <= 0);
    });

    formIngreso.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita recargar la página

        const descripcion = document.getElementById('descripcion-ingreso').value;
        const monto = parseInt(montoIngreso.value);

        ingresos.push({ descripcion, monto });
        actualizarBalance();

        e.target.reset(); // Vacía el formulario
    });

    formGasto.addEventListener('submit', (e) => {
        e.preventDefault();

        const descripcion = document.getElementById('descripcion-gasto').value;
        const monto = parseInt(montoGasto.value);

        gastos.push({ descripcion, monto });
        actualizarBalance();

        e.target.reset();
    });

    actualizarBalance();
});
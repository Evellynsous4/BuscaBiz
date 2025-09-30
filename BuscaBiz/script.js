// Carregando os dados das empresas
async function carregarEmpresas() {
    try {
        const res = await fetch('./empresas.json'); // Caminho relativo
        if (!res.ok) throw new Error('Erro ao carregar dados das empresas.');
        const empresas = await res.json();
        window.empresas = empresas; // Armazena globalmente
        popularFiltros(empresas);
        mostrarEmpresas(empresas);
    } catch (err) {
        console.error(err);
        document.getElementById('empresaList').innerHTML = `<p style="color:red;">Erro ao carregar dados das empresas.</p>`;
    }
}

// Popular selects de UF, Município, Bairro e Categoria
function popularFiltros(empresas) {
    const ufSelect = document.getElementById('ufSelect');
    const municipioSelect = document.getElementById('municipioSelect');
    const bairroSelect = document.getElementById('bairroSelect');
    const categoriaSelect = document.getElementById('categoriaSelect');

    // Popula UF
    const ufs = [...new Set(empresas.map(e => e.uf))].sort();
    ufs.forEach(uf => ufSelect.appendChild(new Option(uf, uf)));

    // Popula Categoria
    const categorias = [...new Set(empresas.map(e => e.categoria))].sort();
    categorias.forEach(cat => categoriaSelect.appendChild(new Option(cat, cat)));

    // Eventos
    ufSelect.addEventListener('change', () => {
        const uf = ufSelect.value;
        const municipios = [...new Set(empresas.filter(e => e.uf === uf).map(e => e.municipio))].sort();
        municipioSelect.innerHTML = '<option value="">Selecione o Município</option>';
        municipios.forEach(m => municipioSelect.appendChild(new Option(m, m)));
        bairroSelect.innerHTML = '<option value="">Selecione o Bairro</option>';
        filtrarEmpresas();
    });

    municipioSelect.addEventListener('change', () => {
        const uf = ufSelect.value;
        const municipio = municipioSelect.value;
        const bairros = [...new Set(empresas.filter(e => e.uf === uf && e.municipio === municipio).map(e => e.bairro))].sort();
        bairroSelect.innerHTML = '<option value="">Selecione o Bairro</option>';
        bairros.forEach(b => bairroSelect.appendChild(new Option(b, b)));
        filtrarEmpresas();
    });

    bairroSelect.addEventListener('change', filtrarEmpresas);
    categoriaSelect.addEventListener('change', filtrarEmpresas);
    document.getElementById('buscaInput').addEventListener('input', filtrarEmpresas);
}

// Filtrar empresas conforme selects e busca
function filtrarEmpresas() {
    const uf = document.getElementById('ufSelect').value;
    const municipio = document.getElementById('municipioSelect').value;
    const bairro = document.getElementById('bairroSelect').value;
    const categoria = document.getElementById('categoriaSelect').value;
    const busca = document.getElementById('buscaInput').value.toLowerCase();

    const filtradas = window.empresas.filter(e => {
        return (!uf || e.uf === uf) &&
               (!municipio || e.municipio === municipio) &&
               (!bairro || e.bairro === bairro) &&
               (!categoria || e.categoria === categoria) &&
               (!busca || e.nome.toLowerCase().includes(busca));
    });

    mostrarEmpresas(filtradas);
}

// Mostrar empresas na tela
function mostrarEmpresas(empresas) {
    const lista = document.getElementById('empresaList');
    lista.innerHTML = '';

    if (empresas.length === 0) {
        lista.innerHTML = '<p>Nenhuma empresa encontrada.</p>';
        return;
    }

    empresas.forEach(e => {
        const div = document.createElement('div');
        div.className = 'empresa-card';
        div.innerHTML = `
            <h3>${e.nome}</h3>
            <p><strong>Endereço:</strong> ${e.endereco}</p>
            <p><strong>Telefone:</strong> ${e.telefone}</p>
            <p><strong>Email:</strong> <a href="mailto:${e.email}">${e.email}</a></p>
            <p><strong>Site:</strong> <a href="${e.site}" target="_blank">${e.site}</a></p>
            <p><strong>Categoria:</strong> ${e.categoria}</p>
            <div class="mapa-container">
                <iframe
                    loading="lazy"
                    src="https://www.google.com/maps?q=${encodeURIComponent(e.endereco)}&output=embed"
                    width="100%"
                    height="200"
                    style="border:0;"
                    allowfullscreen=""
                    referrerpolicy="no-referrer-when-downgrade">
                </iframe>
            </div>
        `;
        lista.appendChild(div);
    });
}

// Inicializa
carregarEmpresas();

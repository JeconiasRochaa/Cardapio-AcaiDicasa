// Dados do cardápio
const cardapio = {
    acai: [
        { tamanho: "150g", preco: 8, acompanhamentos: 2, caldas: 1 },
        { tamanho: "200g", preco: 10, acompanhamentos: 3, caldas: 1 },
        { tamanho: "300g", preco: 15, acompanhamentos: 4, caldas: 1 },
        { tamanho: "400g", preco: 20, acompanhamentos: 5, caldas: 1 },
        { tamanho: "500g", preco: 24, acompanhamentos: 5, caldas: 1 },
        { tamanho: "Barca", preco: 35, acompanhamentos: 8, caldas: 2 }
    ],
    sorvete: [
        { tamanho: "Pequeno", preco: 5 },
        { tamanho: "Médio", preco: 10 },
        { tamanho: "Grande", preco: 15 },
        { tamanho: "Família", preco: 20 }
    ],
    acompanhamentos: [
        "Granola", "Paçoca", "Leite Condensado", "Leite em Pó", 
        "Banana", "Morango", "Kiwi", "Amendoim", "Castanha de Caju",
        "Confete", "Chocolate Granulado", "Coco Ralado", "Aveia",
        "Gotas de Chocolate", "Jujuba", "MM's"
    ],
    caldas: [
        "Chocolate", "Morango", "Caramelo", "Leite Condensado",
        "Doce de Leite", "Chocolate Branco"
    ]
};

// Estado do pedido
let pedido = {
    funcionaria: null,
    acai: null,
    sorvete: null,
    acompanhamentos: [],
    caldas: [],
    consumo: "local",
    total: 0
};

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    inicializarFuncionarias();
    carregarCardapio();
    atualizarResumoPedido();
});

// Seleção de funcionária
function inicializarFuncionarias() {
    const opcoesFuncionarias = document.querySelectorAll('.funcionaria-opcao');
    
    opcoesFuncionarias.forEach(opcao => {
        opcao.addEventListener('click', function() {
            // Remover seleção anterior
            opcoesFuncionarias.forEach(o => o.classList.remove('active'));
            
            // Selecionar nova funcionária
            this.classList.add('active');
            
            // Atualizar informações no header
            const nome = this.getAttribute('data-nome');
            const emoji = this.getAttribute('data-emoji');
            
            document.getElementById('funcionaria-nome').textContent = nome;
            document.getElementById('funcionaria-emoji').textContent = emoji;
            
            // Atualizar pedido
            pedido.funcionaria = nome;
        });
    });
}

// Carregar opções do cardápio
function carregarCardapio() {
    carregarAcai();
    carregarSorvete();
    carregarAcompanhamentos();
    carregarCaldas();
}

function carregarAcai() {
    const container = document.getElementById('acai-opcoes');
    container.innerHTML = '';
    
    cardapio.acai.forEach(item => {
        const card = document.createElement('div');
        card.className = 'produto-card';
        card.dataset.tamanho = item.tamanho;
        card.dataset.preco = item.preco;
        card.dataset.acompanhamentos = item.acompanhamentos;
        card.dataset.caldas = item.caldas;
        
        card.innerHTML = `
            <h3>Açaí ${item.tamanho}</h3>
            <div class="preco">R$ ${item.preco.toFixed(2)}</div>
            <div class="descricao">${item.acompanhamentos} acompanhamentos + ${item.caldas} calda(s)</div>
            ${item.tamanho === "300g" ? '<div class="badge">Mais Pedido</div>' : ''}
        `;
        
        card.addEventListener('click', function() {
            selecionarAcai(this);
        });
        
        container.appendChild(card);
    });
}

function carregarSorvete() {
    const container = document.getElementById('sorvete-opcoes');
    container.innerHTML = '';
    
    cardapio.sorvete.forEach(item => {
        const card = document.createElement('div');
        card.className = 'produto-card';
        card.dataset.tamanho = item.tamanho;
        card.dataset.preco = item.preco;
        
        card.innerHTML = `
            <h3>Sorvete ${item.tamanho}</h3>
            <div class="preco">R$ ${item.preco.toFixed(2)}</div>
        `;
        
        card.addEventListener('click', function() {
            selecionarSorvete(this);
        });
        
        container.appendChild(card);
    });
}

function carregarAcompanhamentos() {
    const container = document.getElementById('acompanhamentos-lista');
    container.innerHTML = '';
    
    cardapio.acompanhamentos.forEach(acompanhamento => {
        const item = document.createElement('div');
        item.className = 'acompanhamento-item';
        
        item.innerHTML = `
            <input type="checkbox" id="acomp-${acompanhamento}" value="${acompanhamento}">
            <label for="acomp-${acompanhamento}">${acompanhamento}</label>
        `;
        
        const checkbox = item.querySelector('input');
        checkbox.addEventListener('change', function() {
            atualizarAcompanhamentos();
        });
        
        container.appendChild(item);
    });
}

function carregarCaldas() {
    const container = document.getElementById('caldas-lista');
    container.innerHTML = '';
    
    cardapio.caldas.forEach(calda => {
        const item = document.createElement('div');
        item.className = 'calda-item';
        
        item.innerHTML = `
            <input type="checkbox" id="calda-${calda}" value="${calda}">
            <label for="calda-${calda}">${calda}</label>
        `;
        
        const checkbox = item.querySelector('input');
        checkbox.addEventListener('change', function() {
            atualizarCaldas();
        });
        
        container.appendChild(item);
    });
}
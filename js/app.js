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
    
    // Configurar eventos de consumo
    document.querySelectorAll('input[name="consumo"]').forEach(radio => {
        radio.addEventListener('change', function() {
            pedido.consumo = this.value;
        });
    });
    
    // Configurar envio via WhatsApp
    document.getElementById('enviar-pedido').addEventListener('click', enviarPedidoWhatsApp);
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

// Funções para seleção de produtos
function selecionarAcai(elemento) {
    // Remover seleção anterior
    document.querySelectorAll('#acai-opcoes .produto-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Selecionar novo açaí
    elemento.classList.add('selected');
    
    // Atualizar pedido
    pedido.acai = {
        tamanho: elemento.dataset.tamanho,
        preco: parseFloat(elemento.dataset.preco),
        acompanhamentosMax: parseInt(elemento.dataset.acompanhamentos),
        caldasMax: parseInt(elemento.dataset.caldas)
    };
    
    // Atualizar limites de acompanhamentos e caldas
    atualizarLimitesAcompanhamentos();
    atualizarLimitesCaldas();
    
    // Atualizar resumo
    atualizarResumoPedido();
}

function selecionarSorvete(elemento) {
    // Remover seleção anterior
    document.querySelectorAll('#sorvete-opcoes .produto-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Selecionar novo sorvete
    elemento.classList.add('selected');
    
    // Atualizar pedido
    pedido.sorvete = {
        tamanho: elemento.dataset.tamanho,
        preco: parseFloat(elemento.dataset.preco)
    };
    
    // Atualizar resumo
    atualizarResumoPedido();
}

// Atualizar acompanhamentos selecionados
function atualizarAcompanhamentos() {
    const checkboxes = document.querySelectorAll('.acompanhamento-item input:checked');
    const selecionados = Array.from(checkboxes).map(cb => cb.value);
    
    // Verificar limite
    const limite = pedido.acai ? pedido.acai.acompanhamentosMax : 0;
    
    if (selecionados.length > limite) {
        // Desmarcar o último selecionado
        checkboxes[checkboxes.length - 1].checked = false;
        alert(`Você pode selecionar no máximo ${limite} acompanhamentos para este tamanho de açaí.`);
        return;
    }
    
    pedido.acompanhamentos = selecionados;
    
    // Atualizar visual dos itens selecionados
    document.querySelectorAll('.acompanhamento-item').forEach(item => {
        const checkbox = item.querySelector('input');
        if (checkbox.checked) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
    
    atualizarResumoPedido();
}

// Atualizar caldas selecionadas
function atualizarCaldas() {
    const checkboxes = document.querySelectorAll('.calda-item input:checked');
    const selecionadas = Array.from(checkboxes).map(cb => cb.value);
    
    // Verificar limite
    const limite = pedido.acai ? pedido.acai.caldasMax : 0;
    
    if (selecionadas.length > limite) {
        // Desmarcar o último selecionado
        checkboxes[checkboxes.length - 1].checked = false;
        alert(`Você pode selecionar no máximo ${limite} calda(s) para este tamanho de açaí.`);
        return;
    }
    
    pedido.caldas = selecionadas;
    
    // Atualizar visual dos itens selecionados
    document.querySelectorAll('.calda-item').forEach(item => {
        const checkbox = item.querySelector('input');
        if (checkbox.checked) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
    
    atualizarResumoPedido();
}

// Atualizar limites de seleção
function atualizarLimitesAcompanhamentos() {
    const limite = pedido.acai ? pedido.acai.acompanhamentosMax : 0;
    const itens = document.querySelectorAll('.acompanhamento-item');
    
    // Resetar todos os checkboxes
    itens.forEach(item => {
        const checkbox = item.querySelector('input');
        checkbox.checked = false;
        item.classList.remove('selected');
        item.classList.remove('disabled');
    });
    
    // Atualizar pedido
    pedido.acompanhamentos = [];
    atualizarResumoPedido();
}

function atualizarLimitesCaldas() {
    const limite = pedido.acai ? pedido.acai.caldasMax : 0;
    const itens = document.querySelectorAll('.calda-item');
    
    // Resetar todos os checkboxes
    itens.forEach(item => {
        const checkbox = item.querySelector('input');
        checkbox.checked = false;
        item.classList.remove('selected');
        item.classList.remove('disabled');
    });
    
    // Atualizar pedido
    pedido.caldas = [];
    atualizarResumoPedido();
}

// Atualizar resumo do pedido
function atualizarResumoPedido() {
    // Calcular total
    let total = 0;
    
    if (pedido.acai) {
        total += pedido.acai.preco;
        document.getElementById('acai-selecionado').textContent = 
            `Açaí ${pedido.acai.tamanho} - R$ ${pedido.acai.preco.toFixed(2)}`;
    } else {
        document.getElementById('acai-selecionado').textContent = 'Nenhum selecionado';
    }
    
    if (pedido.sorvete) {
        total += pedido.sorvete.preco;
        document.getElementById('sorvete-selecionado').textContent = 
            `Sorvete ${pedido.sorvete.tamanho} - R$ ${pedido.sorvete.preco.toFixed(2)}`;
    } else {
        document.getElementById('sorvete-selecionado').textContent = 'Nenhum selecionado';
    }
    
    if (pedido.acompanhamentos.length > 0) {
        document.getElementById('acompanhamentos-selecionados').textContent = 
            pedido.acompanhamentos.join(', ');
    } else {
        document.getElementById('acompanhamentos-selecionados').textContent = 'Nenhum selecionado';
    }
    
    if (pedido.caldas.length > 0) {
        document.getElementById('caldas-selecionadas').textContent = 
            pedido.caldas.join(', ');
    } else {
        document.getElementById('caldas-selecionadas').textContent = 'Nenhuma selecionada';
    }
    
    // Atualizar total
    pedido.total = total;
    document.getElementById('total-valor').textContent = total.toFixed(2);
}

// Enviar pedido via WhatsApp
function enviarPedidoWhatsApp() {
    // Verificar se há uma funcionária selecionada
    if (!pedido.funcionaria) {
        alert('Por favor, selecione a funcionária que está te atendendo.');
        return;
    }
    
    // Verificar se há pelo menos um produto selecionado
    if (!pedido.acai && !pedido.sorvete) {
        alert('Por favor, selecione pelo menos um produto (açaí ou sorvete).');
        return;
    }
    
    // Verificar se o açaí tem acompanhamentos dentro do limite
    if (pedido.acai) {
        if (pedido.acompanhamentos.length > pedido.acai.acompanhamentosMax) {
            alert(`Para o açaí ${pedido.acai.tamanho}, você pode selecionar no máximo ${pedido.acai.acompanhamentosMax} acompanhamentos.`);
            return;
        }
        
        if (pedido.caldas.length > pedido.acai.caldasMax) {
            alert(`Para o açaí ${pedido.acai.tamanho}, você pode selecionar no máximo ${pedido.acai.caldasMax} calda(s).`);
            return;
        }
    }
    
    // Preparar mensagem para WhatsApp
    const mensagem = formatarMensagemWhatsApp();
    const numeroWhatsApp = "5511999999999"; // Substituir pelo número real
    
    // Codificar mensagem para URL
    const mensagemCodificada = encodeURIComponent(mensagem);
    
    // Criar URL do WhatsApp
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
    
    // Abrir WhatsApp
    window.open(urlWhatsApp, '_blank');
}

// Formatar mensagem para WhatsApp
function formatarMensagemWhatsApp() {
    let mensagem = `🍇 *PEDIDO AÇAÍDICASA* 🍇\n\n`;
    
    // Informações da funcionária
    mensagem += `*Atendente:* ${pedido.funcionaria}\n`;
    mensagem += `*Consumo:* ${pedido.consumo === 'local' ? 'No local' : 'Para viagem'}\n\n`;
    
    // Açaí
    if (pedido.acai) {
        mensagem += `*AÇAÍ:*\n`;
        mensagem += `- ${pedido.acai.tamanho} - R$ ${pedido.acai.preco.toFixed(2)}\n`;
        
        if (pedido.acompanhamentos.length > 0) {
            mensagem += `- Acompanhamentos: ${pedido.acompanhamentos.join(', ')}\n`;
        }
        
        if (pedido.caldas.length > 0) {
            mensagem += `- Caldas: ${pedido.caldas.join(', ')}\n`;
        }
        
        mensagem += `\n`;
    }
    
    // Sorvete
    if (pedido.sorvete) {
        mensagem += `*SORVETE:*\n`;
        mensagem += `- ${pedido.sorvete.tamanho} - R$ ${pedido.sorvete.preco.toFixed(2)}\n\n`;
    }
    
    // Total
    mensagem += `*TOTAL: R$ ${pedido.total.toFixed(2)}*\n\n`;
    
    // Observações
    mensagem += `_Pedido gerado via Cardápio Digital AçaíDicasa_`;
    
    return mensagem;
}
// Funções para seleção de produtos
function selecionarAcai(elemento) {
    console.log('Selecionando açaí:', elemento.dataset.tamanho);
    
    // Remover seleção anterior
    document.querySelectorAll('#acai-opcoes .produto-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Selecionar novo açaí
    elemento.classList.add('selected');
    
    // Atualizar pedido
    window.pedido.acai = {
        tamanho: elemento.dataset.tamanho,
        preco: parseFloat(elemento.dataset.preco),
        acompanhamentosMax: parseInt(elemento.dataset.acompanhamentos),
        caldasMax: parseInt(elemento.dataset.caldas)
    };
    
    console.log('Açaí atualizado no pedido:', window.pedido.acai);
    
    // Atualizar limites de acompanhamentos e caldas
    atualizarLimitesAcompanhamentos();
    atualizarLimitesCaldas();
    
    // Atualizar resumo
    atualizarResumoPedido();
}

function selecionarSorvete(elemento) {
    console.log('Selecionando sorvete:', elemento.dataset.tamanho);
    
    // Remover seleção anterior
    document.querySelectorAll('#sorvete-opcoes .produto-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Selecionar novo sorvete
    elemento.classList.add('selected');
    
    // Atualizar pedido
    window.pedido.sorvete = {
        tamanho: elemento.dataset.tamanho,
        preco: parseFloat(elemento.dataset.preco)
    };
    
    console.log('Sorvete atualizado no pedido:', window.pedido.sorvete);
    
    // Atualizar resumo
    atualizarResumoPedido();
}

// Atualizar acompanhamentos selecionados
function atualizarAcompanhamentos() {
    const checkboxes = document.querySelectorAll('.acompanhamento-item input:checked');
    const selecionados = Array.from(checkboxes).map(cb => cb.value);
    
    console.log('Acompanhamentos selecionados:', selecionados);
    
    // Verificar limite
    const limite = window.pedido.acai ? window.pedido.acai.acompanhamentosMax : 0;
    
    if (selecionados.length > limite) {
        // Desmarcar o último selecionado
        checkboxes[checkboxes.length - 1].checked = false;
        alert(`Você pode selecionar no máximo ${limite} acompanhamentos para este tamanho de açaí.`);
        return;
    }
    
    window.pedido.acompanhamentos = selecionados;
    
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
    
    console.log('Caldas selecionadas:', selecionadas);
    
    // Verificar limite
    const limite = window.pedido.acai ? window.pedido.acai.caldasMax : 0;
    
    if (selecionadas.length > limite) {
        // Desmarcar o último selecionado
        checkboxes[checkboxes.length - 1].checked = false;
        alert(`Você pode selecionar no máximo ${limite} calda(s) para este tamanho de açaí.`);
        return;
    }
    
    window.pedido.caldas = selecionadas;
    
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

// Atualizar caldas de sorvete selecionadas
function atualizarCaldasSorvete() {
    const checkboxes = document.querySelectorAll('.calda-sorvete-item input:checked');
    const selecionadas = Array.from(checkboxes).map(cb => {
        return {
            nome: cb.value,
            preco: parseFloat(cb.dataset.preco)
        };
    });
    
    console.log('Caldas sorvete selecionadas:', selecionadas);
    
    window.pedido.caldasSorvete = selecionadas;
    
    // Atualizar visual dos itens selecionados
    document.querySelectorAll('.calda-sorvete-item').forEach(item => {
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
    const limite = window.pedido.acai ? window.pedido.acai.acompanhamentosMax : 0;
    const itens = document.querySelectorAll('.acompanhamento-item');
    
    console.log('Atualizando limites acompanhamentos:', limite);
    
    // Resetar todos os checkboxes
    itens.forEach(item => {
        const checkbox = item.querySelector('input');
        checkbox.checked = false;
        item.classList.remove('selected');
        item.classList.remove('disabled');
    });
    
    // Atualizar pedido
    window.pedido.acompanhamentos = [];
    atualizarResumoPedido();
}

function atualizarLimitesCaldas() {
    const limite = window.pedido.acai ? window.pedido.acai.caldasMax : 0;
    const itens = document.querySelectorAll('.calda-item');
    
    console.log('Atualizando limites caldas:', limite);
    
    // Resetar todos os checkboxes
    itens.forEach(item => {
        const checkbox = item.querySelector('input');
        checkbox.checked = false;
        item.classList.remove('selected');
        item.classList.remove('disabled');
    });
    
    // Atualizar pedido
    window.pedido.caldas = [];
    atualizarResumoPedido();
}

// Atualizar resumo do pedido
function atualizarResumoPedido() {
    console.log('Atualizando resumo do pedido...');
    
    // Calcular total
    let total = 0;
    
    if (window.pedido.acai) {
        total += window.pedido.acai.preco;
        document.getElementById('acai-selecionado').textContent = 
            `Açaí ${window.pedido.acai.tamanho} - R$ ${window.pedido.acai.preco.toFixed(2)}`;
    } else {
        document.getElementById('acai-selecionado').textContent = 'Nenhum selecionado';
    }
    
    if (window.pedido.sorvete) {
        total += window.pedido.sorvete.preco;
        document.getElementById('sorvete-selecionado').textContent = 
            `Sorvete ${window.pedido.sorvete.tamanho} - R$ ${window.pedido.sorvete.preco.toFixed(2)}`;
    } else {
        document.getElementById('sorvete-selecionado').textContent = 'Nenhum selecionado';
    }
    
    if (window.pedido.acompanhamentos.length > 0) {
        document.getElementById('acompanhamentos-selecionados').textContent = 
            window.pedido.acompanhamentos.join(', ');
    } else {
        document.getElementById('acompanhamentos-selecionados').textContent = 'Nenhum selecionado';
    }
    
    if (window.pedido.caldas.length > 0) {
        document.getElementById('caldas-selecionadas').textContent = 
            window.pedido.caldas.join(', ');
    } else {
        document.getElementById('caldas-selecionadas').textContent = 'Nenhuma selecionada';
    }
    
    if (window.pedido.caldasSorvete.length > 0) {
        const caldasComPreco = window.pedido.caldasSorvete.map(calda => `${calda.nome} (+ R$ ${calda.preco.toFixed(2)})`);
        document.getElementById('caldas-sorvete-selecionadas').textContent = 
            caldasComPreco.join(', ');
        // Adicionar preço das caldas de sorvete ao total
        window.pedido.caldasSorvete.forEach(calda => {
            total += calda.preco;
        });
    } else {
        document.getElementById('caldas-sorvete-selecionadas').textContent = 'Nenhuma selecionada';
    }
    
    // Atualizar total
    window.pedido.total = total;
    document.getElementById('total-valor').textContent = total.toFixed(2);
    
    console.log('Resumo atualizado. Total:', total);
}
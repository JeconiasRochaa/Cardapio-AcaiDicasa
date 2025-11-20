// Enviar pedido via WhatsApp
function enviarPedidoWhatsApp() {
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
    const numeroWhatsApp = "5511919926172"; // Número do AçaíDicasa
    
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
    
    // Informações de consumo
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
        mensagem += `- ${pedido.sorvete.tamanho} - R$ ${pedido.sorvete.preco.toFixed(2)}\n`;
        
        if (pedido.caldasSorvete.length > 0) {
            const caldasTexto = pedido.caldasSorvete.map(calda => `${calda.nome} (+ R$ ${calda.preco.toFixed(2)})`).join(', ');
            mensagem += `- Caldas Premium: ${caldasTexto}\n`;
        }
        
        mensagem += `\n`;
    }
    
    // Total
    mensagem += `*TOTAL: R$ ${pedido.total.toFixed(2)}*\n\n`;
    
    // Observações
    mensagem += `_Pedido gerado via Cardápio Digital AçaíDicasa_\n`;
    mensagem += `📞 (11) 91992-6172`;
    
    return mensagem;
}
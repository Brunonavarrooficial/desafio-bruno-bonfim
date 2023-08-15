class CaixaDaLanchonete {
    constructor() {
        this.cardapio = {
            cafe: { descricao: 'Café', valor: 3.00 },
            chantily: { descricao: 'Chantily (extra do Café)', valor: 1.50 },
            suco: { descricao: 'Suco Natural', valor: 6.20 },
            sanduiche: { descricao: 'Sanduíche', valor: 6.50 },
            queijo: { descricao: 'Queijo (extra do Sanduíche)', valor: 2.00 },
            salgado: { descricao: 'Salgado', valor: 7.25 },
            combo1: { descricao: '1 Suco e 1 Sanduíche', valor: 9.50 },
            combo2: { descricao: '1 Café e 1 Sanduíche', valor: 7.50 },
        };

        this.formasDePagamento = ['debito', 'credito', 'dinheiro'];
        this.itensDependentes = ['chantily', 'queijo']

    }

    validarItens(itensCompra) {
        let qtyItemPrincipalOne
        let qtyItemPrincipalTwo
        let itemPrincipal = []

        if (itensCompra['cafe'] || itensCompra['combo2']) {
            qtyItemPrincipalOne = itensCompra['cafe'] ?? itensCompra['combo2']
            itemPrincipal.push('cafe')
        }

        if (itensCompra['sanduiche'] || itensCompra['combo1'] || itensCompra['combo2']) {
            qtyItemPrincipalTwo = itensCompra['sanduiche'] ?? itensCompra['combo1'] ?? itensCompra['combo2']
            itemPrincipal.push('sanduiche')
        }

        for (const itemExtra in itensCompra) {

            if (this.itensDependentes.includes(itemExtra)) {

                if (itensCompra[itemExtra] > qtyItemPrincipalOne || itensCompra[itemExtra] > qtyItemPrincipalTwo) {
                    return `Valor do item extra não pode ser maior que do item principal`;
                }

                if (itemExtra === 'chantily' && !itemPrincipal.includes('cafe')) {
                    return `Item extra não pode ser pedido sem o principal`;
                }

                if (itemExtra === 'queijo' && !itemPrincipal.includes('sanduiche')) {
                    return `Item extra não pode ser pedido sem o principal`;
                }
            }
        }
        return null;
    }

    calcularValorDaCompra(metodoDePagamento, itens) {

        if (!this.formasDePagamento.includes(metodoDePagamento)) {
            return 'Forma de pagamento inválida!';
        }

        if (itens.length === 0) {
            return 'Não há itens no carrinho de compra!';
        }


        const itensCompra = {};
        let valorTotal = 0;

        for (const itemQuantidade of itens) {
            const [itemCodigo, quantidade] = itemQuantidade.split(',');
            const item = this.cardapio[itemCodigo];

            if (metodoDePagamento === 'credito' && !item) {
                return 'Item inválido!';
            }

            if (metodoDePagamento === 'dinheiro' && parseInt(quantidade) === 0) {
                return 'Quantidade inválida!';
            }

            if (!this.cardapio[itemCodigo]) {
                return 'Item inválido!';
            }

            if (!itensCompra[itemCodigo]) {
                itensCompra[itemCodigo] = 0;
            }


            itensCompra[itemCodigo] += parseInt(quantidade);

            valorTotal += item.valor * parseInt(quantidade);
        }

        const validacaoItens = this.validarItens(itensCompra);
        if (validacaoItens) {
            return validacaoItens;
        }

        if (metodoDePagamento === 'dinheiro') {
            valorTotal *= 0.95;
        }

        if (metodoDePagamento === 'credito') {
            valorTotal *= 1.03;
        }

        const valorTotalFormatado = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
        return valorTotalFormatado;
    }
}



export { CaixaDaLanchonete };

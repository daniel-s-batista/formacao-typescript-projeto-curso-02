export class Armazenador {
    constructor() { }
    static salvar(chave, valor) {
        const strVal = JSON.stringify(valor);
        localStorage.setItem(chave, strVal);
    }
    static obter(chave, conversor) {
        const valor = localStorage.getItem(chave);
        if (valor === null) {
            return null;
        }
        if (conversor) {
            return JSON.parse(valor, conversor);
        }
        return JSON.parse(valor);
    }
}

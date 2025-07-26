export class Armazenador {
    private constructor() {}

    static salvar(chave: string, valor: any) : void {
        const strVal = JSON.stringify(valor);
        localStorage.setItem(chave, strVal);
    }

    static obter<T>(chave: string, conversor?: (this: any, key: string, value: any) => any) : T | null {
        const valor = localStorage.getItem(chave);

        if (valor === null) {
            return null;
        }

        if (conversor) {
            return JSON.parse(valor, conversor) as T;
        }

        return JSON.parse(valor) as T;
    }
}

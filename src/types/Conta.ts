import { Armazenador } from "./Armazenador.js";
import { validaDebito } from "./Decorators.js";
import { GrupoTransacao } from "./GrupoTransacao.js";
import { TipoTransacao } from "./TipoTransacao.js";
import { Transacao } from "./Transacao.js";

export class Conta {
    protected nome: string;
    protected saldo: number = Armazenador.obter<number>("saldo") || 0;
    private transacoes: Transacao[] = Armazenador.obter<Transacao[]>("transacoes", (key: string, value: any) => {
        if (key === "data") {
            return new Date(value);
        }

        return value;
    }) || [];

    constructor(nome: string) {
        this.nome = nome;
    }

    public getTitular() : string {
        return this.nome;
    }

    public getSaldo() : number {
        return this.saldo;
    }

    public getDataAcesso() : Date {
        return new Date();
    }

    @validaDebito
    private debitar(valor: number): void {
        this.saldo -= valor;
        Armazenador.salvar("saldo", this.saldo.toString());
    }

    @validaDebito
    private depositar(valor: number): void {
        this.saldo += valor;
        Armazenador.salvar("saldo", this.saldo.toString());
    }

    public getGruposTransacoes(): GrupoTransacao[] {
        const gruposTransacoes: GrupoTransacao[] = [];
        const listaTransacoes: Transacao[] = structuredClone(this.transacoes);
        const transacoesOrdenadas: Transacao[] = listaTransacoes.sort((t1, t2) => t2.data.getTime() - t1.data.getTime());
        let labelAtualGrupoTransacao: string = "";

        for (let transacao of transacoesOrdenadas) {
            let labelGrupoTransacao: string = transacao.data.toLocaleDateString("pt-br", { month: "long", year: "numeric" });
            if (labelAtualGrupoTransacao !== labelGrupoTransacao) {
                labelAtualGrupoTransacao = labelGrupoTransacao;
                gruposTransacoes.push({
                    label: labelGrupoTransacao,
                    transacoes: []
                });
            }
            gruposTransacoes.at(-1).transacoes.push(transacao);
        }

        return gruposTransacoes;
    }

    public registrarTransacao(novaTransacao: Transacao): void {
        if (novaTransacao.tipo == TipoTransacao.DEPOSITO) {
            this.depositar(novaTransacao.valor);
        } 
        else if (novaTransacao.tipo == TipoTransacao.TRANSFERENCIA || novaTransacao.tipo == TipoTransacao.PAGAMENTO_BOLETO) {
            this.debitar(novaTransacao.valor);
            novaTransacao.valor *= -1;
        } 
        else {
            throw new Error("Tipo de Transação é inválido!");
        }

        this.transacoes.push(novaTransacao);
        Armazenador.salvar("transacoes", this.transacoes);
    }
}

export class ContaPremium extends Conta {
    public registrarTransacao(novaTransacao: Transacao): void {
        if (novaTransacao.tipo === TipoTransacao.DEPOSITO) {
            alert("Ganhou um bônus de R$ 0.50!");
            novaTransacao.valor += 0.5
        }
        super.registrarTransacao(novaTransacao);
    }
}

const conta = new Conta("Daniel Salles Batista");
const contaPremium = new ContaPremium("Daniel Salles Batista");

export default conta;

export function validaDebito(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function(valorDebito : number) {
        if (valorDebito <= 0) {
            throw new Error("O valor a ser debitado precisa ser maior do que zero!");
        }
        if (valorDebito > this.saldo) {
            throw new Error("Seu saldo é insuficiente para realizar a operação!");
        }

        return originalMethod.apply(this, [valorDebito])
    }

    return descriptor;
}

export function validaDeposito(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function(valorDeposito : number) {
        if (valorDeposito <= 0) {
            throw new Error("O valor a ser depositado precisa ser maior do que zero!");
        }

        return originalMethod.apply(this, [valorDeposito]);
    }

    return descriptor;
}

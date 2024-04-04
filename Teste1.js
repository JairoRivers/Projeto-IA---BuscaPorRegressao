// Permite a leitura de entrada a partir do console.
const readline = require('readline');

// Cria uma interface de leitura a partir do console.
const obj = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Função para buscar caminho com retrocesso
function buscarCaminho(grafo) {
    obj.question('Digite o objetivo (ou digite "sair" para sair): ', (objetivo) => {
        if (objetivo.toLowerCase() === 'sair') {
            obj.close();
            return;
        }

        if (!grafo[objetivo]) {
            console.log("Objetivo inválido, digite outro objetivo");
            buscarCaminho(grafo);
            return;
        }

        const caminho = busca_com_retrocesso('A', objetivo, grafo);
        console.log(caminho);

        buscarCaminho(grafo);
    });
}

function busca_com_retrocesso(inicial, objetivo, grafo) {
    let LE = [inicial];             // Lista de estados sendo examinados
    let LNE = [inicial];            // Lista de nós cujos descendentes ainda não foram gerados ou examinados
    let BSS = [];                   // Lista de estados cujos descendentes não contém um nó objetivo
    let EC = inicial;               // É o estado que foi adicionado mais recentemente a LE

    console.log('LE', LE);
    console.log('LNE', LNE);
    console.log('BSS', BSS);
    console.log('EC', EC);
    console.log('');

    while (LNE.length !== 0) {
        if (EC === objetivo) {
            return LE;
        }
        if (!temFilhos(EC, BSS, LE, LNE, grafo)) {
            BSS.push(EC);
            LE.pop();
            LNE.pop();
            EC = LNE[LNE.length - 1];
        } else {
            const filhos = grafo[EC].filter(filho => !BSS.includes(filho) && !LE.includes(filho) && !LNE.includes(filho));
            const proximoFilho = filhos[0]; // Pega o próximo filho a ser explorado
            LNE.push(proximoFilho);
            LE.push(proximoFilho);
            EC = LNE[LNE.length - 1];
        }
        // Tenho que mostrar uma tabela com o LE, LNE, BSS e EC
        console.log('LE', LE);
        console.log('LNE', LNE);
        console.log('BSS', BSS);
        console.log('EC', EC);
        console.log('');
    }
    return "FALHA";
}

// Verificação de EC tem filhos
function temFilhos(EC, BSS, LE, LNE, grafo) {
    const filhos = grafo[EC];

    if (filhos.length === 0)
        return false;

    for (let i = 0; i < filhos.length; i++) {
        if (!BSS.includes(filhos[i]) && !LE.includes(filhos[i]) && !LNE.includes(filhos[i])) {
            return true;
        }
    }
    return false;
}


// Grafo Exemplo
const grafo = {
    'A': ['B', 'C', 'D'],
    'B': ['E', 'F'],
    'C': ['F', 'G'],
    'D': [],
    'E': ['H', 'I'],
    'F': ['J'],
    'H': [],
    'I': [],
    'J': [],
    'G': []
};


buscarCaminho(grafo);


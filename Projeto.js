// Permite a leitura de entrada a partir do console
const readline = require('readline');

// Cria uma interface de leitura a partir do console
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

        const caminho = busca_com_retrocesso('A', objetivo, grafo);
        console.log('\n', 'Caminho Resultado', caminho);

        buscarCaminho(grafo);
        passo = 1;
    });
}

let passo = 1;

function tabela(LE, LNE, BSS, EC) {
    function greenText(text) {
        return `\x1b[32m${text}\x1b[0m`; // Código ANSI para cor verde
    }

    console.log(`\n${"=".repeat(20)} Passo ${passo++} ${"=".repeat(20)}`);
    console.log(`${" ".repeat(5)}LE:  ${greenText(LE.join(', '))}`);
    console.log(`${" ".repeat(5)}LNE: ${greenText(LNE.join(', '))}`);
    console.log(`${" ".repeat(5)}BSS: ${greenText(BSS.join(', '))}`);
    console.log(`${" ".repeat(5)}EC:  ${greenText(EC)}`);
}

function busca_com_retrocesso(inicial, objetivo, grafo) {
    let LE = [inicial];             // Lista de estados sendo examinados
    let LNE = [inicial];            // Lista de nós cujos descendentes ainda não foram gerados ou examinados
    let BSS = [];                   // Lista de estados cujos descendentes não contém um nó objetivo
    let EC = inicial;               // Estado que foi adicionado mais recentemente a LE

    tabela(LE, LNE, BSS, EC);

    while (LNE.length !== 0) {
        if (EC === objetivo) {
            return LE;
        }
        if (!temFilhos(EC, BSS, LE, LNE, grafo)) {
            //Enquanto LE não está vazio e EC = o primeiro elemento de LE faça
            while (LE.length !== 0 && EC === LE[0]) {
                BSS.unshift(EC);
                LE.shift(); // remove primeiro elemento de LE;
                LNE.shift(); // remove primeiro elemento de LNE
                EC = LNE[0];
            }
            LE.unshift(EC)//acrescenta EC a LE;

        } else {
            const filhos = grafo[EC].filter(filho => !BSS.includes(filho) && !LE.includes(filho) && !LNE.includes(filho));
            // Adicionar os filhos de EC em LNE
            for (let i = filhos.length - 1; i >= 0; i--) {
                LNE.unshift(filhos[i]);
            }

            EC = LNE[0]; // EC := primeiro elemento de LNE
            LE.unshift(EC); // Acrescenta EC a LE
        }
        // Mostrar Passo Atual
        tabela(LE, LNE, BSS, EC);
    }
    return "FALHA";
}

// Verificação se EC tem filhos
function temFilhos(EC, BSS, LE, LNE, grafo) {

    // Obtém os filhos do estado atual no grafo
    const filhos = grafo[EC];

    if (filhos.length === 0) {
        return false;

    } else {
        // Verifica se o filho não está em (BSS, LE, LNE), sendo assim valido
        for (let i = 0; i < filhos.length; i++) {
            if (!BSS.includes(filhos[i]) && !LE.includes(filhos[i]) && !LNE.includes(filhos[i])) {
                return true;
            }
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
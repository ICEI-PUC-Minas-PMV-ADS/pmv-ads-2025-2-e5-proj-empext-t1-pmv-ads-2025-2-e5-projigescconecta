interface ViaCepResponse {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    ibge: string;
    gia: string;
    ddd: string;
    siafi: string;
    erro?: boolean;
}

export interface SimplifyResponse {
    address: string,
    neighborhood: string;
    city: string;
    state: string;
}

const VIACEP_BASE_URL = 'https://viacep.com.br/ws/';

export async function fetchZipCode(zipCode: string): Promise<SimplifyResponse> {
    const url = `${VIACEP_BASE_URL}${zipCode}/json/`

    try {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`Erro na requisição: Status ${response.status}`)
        }

        const data: ViaCepResponse = await response.json();

        if (data.erro === true) {
            throw new Error('CEP não encontrado na base de dados')
        }

        const dataResponse: SimplifyResponse = {
            address: data.logradouro,
            state: data.uf,
            neighborhood: data.bairro,
            city: data.localidade
        }

        return dataResponse
    }
    catch (error) {
        console.error("Erro ao buscar CEP:", error)
        throw new Error(error instanceof Error ? error.message : 'Falha ao buscar CEP')
    }
}
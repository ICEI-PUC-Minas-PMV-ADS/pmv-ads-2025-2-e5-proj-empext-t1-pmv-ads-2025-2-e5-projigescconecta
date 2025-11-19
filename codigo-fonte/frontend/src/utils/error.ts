import type { AxiosError } from 'axios';

type ServerErrorPayload = {
  message?: string;
  errors?: string[] | Record<string, string[]>;
};

// Extrai uma mensagem de erro amigável a partir de um objeto de erro (Axios/Backend)
// Mantém o padrão de mensagens em português para a UI
export function extractErrorMessage(error: unknown): string {
  const axiosErr = error as AxiosError<any> | undefined;
  const data: unknown = axiosErr?.response?.data ?? (error as any)?.data ?? null;

  if (!data) {
    return 'Erro ao criar';
  }

  const payload = data as ServerErrorPayload;

  // Caso errors seja um array de strings
  if (Array.isArray(payload.errors)) {
    return payload.errors.join(', ');
  }

  // Caso errors seja um objeto (ex.: ModelState do ASP.NET: { campo: ["msg1", "msg2"] })
  if (payload.errors && typeof payload.errors === 'object') {
    const errsObj = payload.errors as Record<string, string[]>;
    const messages = Object.values(errsObj).flat();
    if (messages.length > 0) {
      return messages.join(', ');
    }
  }

  // Mensagem direta
  if (typeof payload.message === 'string' && payload.message.trim() !== '') {
    return payload.message;
  }

  // Se a resposta for string
  if (typeof data === 'string') {
    return data;
  }

  try {
    return JSON.stringify(data);
  } catch {
    return 'Erro desconhecido';
  }
}
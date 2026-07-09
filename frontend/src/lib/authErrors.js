const PATTERNS = [
  [/email rate limit exceeded/i, "Muitas tentativas de cadastro em pouco tempo. Aguarde alguns minutos e tente novamente."],
  [/user already registered/i, "Já existe uma conta com esse e-mail. Tente fazer login."],
  [/invalid login credentials/i, "E-mail ou senha inválidos."],
  [/password should be at least/i, "A senha deve ter pelo menos 6 caracteres."],
  [/unable to validate email address/i, "E-mail inválido."],
  [/signup requires a valid password/i, "Informe uma senha válida."],
  [/email not confirmed/i, "Confirme seu e-mail antes de entrar."],
];

export function translateAuthError(message) {
  if (!message) return "Ocorreu um erro. Tente novamente.";
  const match = PATTERNS.find(([pattern]) => pattern.test(message));
  return match ? match[1] : message;
}

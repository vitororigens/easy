// Configurações de ambiente para a API de IA
export const ENV_CONFIG = {
  // Substitua pela sua chave da API OpenRouter
  OPENROUTER_API_KEY: 'sk-or-v1-5863979b55fe618894aa75f0281eadc011caccdb5c0302e914bd0f100cc9c916r',
  
  // URL da API OpenRouter
  OPENROUTER_URL: 'https://openrouter.ai/api/v1/chat/completions',
  
  // Modelo de IA a ser usado
  AI_MODEL: 'deepseek/deepseek-r1-0528:free',
  
  // Configurações do app
  APP_NAME: 'Easy Finance App',
  APP_URL: 'https://easy-finance-app.com',
  
  // Configurações de tokens
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.3,
};

// Função para validar se as configurações estão corretas
export const validateConfig = () => {
  if (ENV_CONFIG.OPENROUTER_API_KEY === 'YOUR_OPENROUTER_API_KEY') {
    console.warn('⚠️  OPENROUTER_API_KEY não configurada. Configure sua chave da API em src/config/env.ts');
    return false;
  }
  return true;
}; 
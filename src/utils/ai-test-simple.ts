import { ENV_CONFIG, validateConfig } from '../config/env';

/**
 * Teste simples para verificar se a API do OpenRouter está funcionando
 */
export const testOpenRouterConnection = async () => {
  console.log('🧪 Testando conexão com OpenRouter...');
  
  if (!validateConfig()) {
    console.error('❌ Configuração inválida');
    return false;
  }

  try {
    const response = await fetch(ENV_CONFIG.OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ENV_CONFIG.OPENROUTER_API_KEY}`,
        'HTTP-Referer': ENV_CONFIG.APP_URL,
        'X-Title': ENV_CONFIG.APP_NAME,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: ENV_CONFIG.AI_MODEL,
        messages: [
          {
            role: 'user',
            content: 'Responda apenas com: "OK"'
          }
        ],
        max_tokens: 10,
        temperature: 0.1
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro na API:', response.status, errorText);
      return false;
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    console.log('✅ Resposta da API:', content);
    return true;
  } catch (error) {
    console.error('❌ Erro na conexão:', error);
    return false;
  }
};

/**
 * Teste de parsing JSON simples
 */
export const testJSONParsing = () => {
  console.log('🧪 Testando parsing JSON...');
  
  const testCases = [
    '{"test": "value"}',
    '```json\n{"test": "value"}\n```',
    'Resposta: {"test": "value"}',
    '{"test": "value"} fim',
  ];

  testCases.forEach((testCase, index) => {
    try {
      const result = JSON.parse(testCase);
      console.log(`✅ Caso ${index + 1}: OK`);
    } catch (error) {
      console.log(`❌ Caso ${index + 1}: Falhou - ${testCase}`);
    }
  });
}; 
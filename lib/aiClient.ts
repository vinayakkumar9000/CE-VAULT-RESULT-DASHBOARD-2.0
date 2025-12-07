import { GoogleGenAI, Type } from "@google/genai";

/**
 * Centralized Gemini AI client for the application.
 * All AI operations (chatbot, analysis, subject details) use this client.
 */

// Get API key from environment variables
const getApiKey = (): string => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY environment variable is required. Please set it in your environment variables."
    );
  }
  return apiKey;
};

// Get model name from environment variables, default to gemini-robotics-er-1.5-preview
const getModel = (): string => {
  return process.env.GEMINI_MODEL || "gemini-robotics-er-1.5-preview";
};

// Initialize the Gemini client (lazy initialization)
let clientInstance: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI => {
  if (!clientInstance) {
    const apiKey = getApiKey();
    clientInstance = new GoogleGenAI({ apiKey });
  }
  return clientInstance;
};

/**
 * Options for calling the Gemini model
 */
export interface CallModelOptions {
  /**
   * System instruction or context for the model
   */
  systemInstruction?: string;
  /**
   * Response format - 'text' for plain text, 'json' for structured JSON
   */
  responseFormat?: 'text' | 'json';
  /**
   * JSON schema for structured responses (required if responseFormat is 'json')
   */
  jsonSchema?: {
    type: Type;
    properties?: Record<string, { type: Type; items?: { type: Type } }>;
  };
  /**
   * Temperature for response generation (0-1)
   */
  temperature?: number;
  /**
   * Maximum tokens in response
   */
  maxTokens?: number;
}

/**
 * Call the Gemini model with a prompt
 * 
 * @param prompt - The text prompt to send to the model
 * @param options - Optional configuration for the model call
 * @returns The model's response as text
 */
export const callModel = async (
  prompt: string,
  options?: CallModelOptions
): Promise<string> => {
  const client = getClient();
  const model = getModel();

  const config: any = {};

  if (options?.responseFormat === 'json') {
    config.responseMimeType = 'application/json';
  }

  if (options?.jsonSchema && options.responseFormat === 'json') {
    config.responseSchema = options.jsonSchema;
  }

  if (options?.temperature !== undefined) {
    config.temperature = options.temperature;
  }

  if (options?.maxTokens !== undefined) {
    config.maxTokens = options.maxTokens;
  }

  const requestBody: any = {
    model,
    contents: options?.systemInstruction 
      ? `${options.systemInstruction}\n\n${prompt}`
      : prompt,
  };

  // Only include config if it has actual defined values (filter out undefined)
  const configWithValues = Object.fromEntries(
    Object.entries(config).filter(([_, value]) => value !== undefined)
  );

  if (Object.keys(configWithValues).length > 0) {
    requestBody.config = configWithValues;
  }

  const response = await client.models.generateContent(requestBody);

  if (!response.text) {
    throw new Error('Empty response from Gemini model');
  }

  return response.text;
};

/**
 * Call the Gemini model and return parsed JSON response
 * 
 * @param prompt - The text prompt to send to the model
 * @param jsonSchema - JSON schema for the expected response structure
 * @param options - Optional configuration for the model call
 * @returns The parsed JSON response
 */
export const callModelJSON = async <T = any>(
  prompt: string,
  jsonSchema: CallModelOptions['jsonSchema'],
  options?: Omit<CallModelOptions, 'responseFormat' | 'jsonSchema'>
): Promise<T> => {
  const responseText = await callModel(prompt, {
    ...options,
    responseFormat: 'json',
    jsonSchema,
  });

  try {
    return JSON.parse(responseText) as T;
  } catch (error) {
    throw new Error(`Failed to parse JSON response: ${error}`);
  }
};

/**
 * Get the current model name being used
 */
export const getModelName = (): string => {
  return getModel();
};

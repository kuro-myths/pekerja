import { createOpenAI } from '@xsai-ext/providers/create'
import { z } from 'zod'

import { createOpenAICompatibleValidators } from '../../validators/openai-compatible'
import { defineProvider } from '../registry'

const nineRouterConfigSchema = z.object({
  apiKey: z
    .string('API Key')
    .optional(),
  baseUrl: z
    .string('Base URL')
    .optional()
    .default('http://localhost:20128/v1'),
})

type NineRouterConfig = z.input<typeof nineRouterConfigSchema>

export const providerNineRouter = defineProvider<NineRouterConfig>({
  id: '9router',
  name: '9Router',
  nameLocalize: ({ t }) => t('settings.pages.providers.provider.9router.title'),
  description: '9Router AI gateway (OpenAI-compatible, /v1)',
  descriptionLocalize: ({ t }) => t('settings.pages.providers.provider.9router.description'),
  tasks: ['chat'],
  icon: 'i-solar:routing-2-bold-duotone',

  createProviderConfig: ({ t }) => nineRouterConfigSchema.extend({
    apiKey: nineRouterConfigSchema.shape.apiKey.meta({
      labelLocalized: t('settings.pages.providers.catalog.edit.config.common.fields.field.api-key.label'),
      descriptionLocalized: t('settings.pages.providers.catalog.edit.config.common.fields.field.api-key.description'),
      placeholderLocalized: t('settings.pages.providers.catalog.edit.config.common.fields.field.api-key.placeholder'),
      type: 'password',
    }),
    baseUrl: nineRouterConfigSchema.shape.baseUrl.meta({
      labelLocalized: t('settings.pages.providers.catalog.edit.config.common.fields.field.base-url.label'),
      descriptionLocalized: t('settings.pages.providers.catalog.edit.config.common.fields.field.base-url.description'),
      placeholderLocalized: t('settings.pages.providers.catalog.edit.config.common.fields.field.base-url.placeholder'),
    }),
  }),
  createProvider(config) {
    return createOpenAI(config.apiKey ?? '', config.baseUrl)
  },

  validationRequiredWhen(config) {
    return !!config.baseUrl?.trim()
  },
  validators: {
    ...createOpenAICompatibleValidators({
      checks: ['connectivity', 'model_list'],
    }),
  },
})

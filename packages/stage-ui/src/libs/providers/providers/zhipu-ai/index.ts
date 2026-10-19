import { createOpenAI } from '@xsai-ext/providers/create'
import { z } from 'zod'

import { createOpenAICompatibleValidators } from '../../validators/openai-compatible'
import { defineProvider } from '../registry'

const zhipuConfigSchema = z.object({
  apiKey: z
    .string('API Key'),
  baseUrl: z
    .string('Base URL')
    .optional()
    .default('https://open.bigmodel.cn/api/paas/v4/'),
})

type ZhipuConfig = z.input<typeof zhipuConfigSchema>

export const providerZhipuAI = defineProvider<ZhipuConfig>({
  id: 'zhipu-ai',
  name: 'Zhipu AI (GLM)',
  nameLocalize: ({ t }) => t('settings.pages.providers.provider.zhipu.title'),
  description: 'bigmodel.cn / z.ai',
  descriptionLocalize: ({ t }) => t('settings.pages.providers.provider.zhipu.description'),
  tasks: ['chat'],
  icon: 'i-lobe-icons:zhipu',

  createProviderConfig: ({ t }) => zhipuConfigSchema.extend({
    apiKey: zhipuConfigSchema.shape.apiKey.meta({
      labelLocalized: t('settings.pages.providers.catalog.edit.config.common.fields.field.api-key.label'),
      descriptionLocalized: t('settings.pages.providers.catalog.edit.config.common.fields.field.api-key.description'),
      placeholderLocalized: t('settings.pages.providers.catalog.edit.config.common.fields.field.api-key.placeholder'),
      type: 'password',
    }),
    baseUrl: zhipuConfigSchema.shape.baseUrl.meta({
      labelLocalized: t('settings.pages.providers.catalog.edit.config.common.fields.field.base-url.label'),
      descriptionLocalized: t('settings.pages.providers.catalog.edit.config.common.fields.field.base-url.description'),
      placeholderLocalized: t('settings.pages.providers.catalog.edit.config.common.fields.field.base-url.placeholder'),
    }),
  }),
  createProvider(config) {
    return createOpenAI(config.apiKey, config.baseUrl)
  },

  validationRequiredWhen(config) {
    return !!config.apiKey?.trim()
  },
  validators: {
    ...createOpenAICompatibleValidators({
      checks: ['connectivity', 'model_list'],
    }),
  },
})

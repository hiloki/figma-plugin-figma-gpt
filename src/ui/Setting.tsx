import { h, JSX } from 'preact'

import {
  Button,
  Container,
  Dropdown,
  DropdownOption,
  Link,
  Muted,
  RangeSlider,
  Text,
  Textbox,
  TextboxNumeric,
  VerticalSpace,
} from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { css } from '@emotion/react'
import { useUpdateEffect } from 'react-use'

import { DEFAULT_SETTINGS } from '@/constants'
import { Model, NotifyHandler } from '@/types'
import Store from '@/ui/Store'

const modelOptions: Array<DropdownOption<Model>> = [
  { value: 'gpt-3.5-turbo' },
  { value: 'gpt-3.5-turbo-0301' },
  // { value: 'text-davinci-003' },
  // { value: 'text-curie-001' },
  // { value: 'text-babbage-001' },
  // { value: 'text-ada-001' },
  // { value: 'code-davinci-002' },
  // { value: 'code-cushman-001' },
]

export default function Setting() {
  const { settings, setSettings } = Store.useContainer()

  function onApiKeyInput(event: JSX.TargetedEvent<HTMLInputElement>) {
    setSettings({ ...settings, apiKey: event.currentTarget.value })
  }

  function onModelChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    setSettings({ ...settings, model: event.currentTarget.value as Model })
  }

  function onTemperatureChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    setSettings({ ...settings, temperature: Number(event.currentTarget.value) })
  }

  function onMaxTokensChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    setSettings({ ...settings, maxTokens: Number(event.currentTarget.value) })
  }

  function onStopInput(event: JSX.TargetedEvent<HTMLInputElement>) {
    setSettings({ ...settings, stop: event.currentTarget.value })
  }

  function onTopPChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    setSettings({ ...settings, topP: Number(event.currentTarget.value) })
  }

  function onFrequencyPenaltyChange(
    event: JSX.TargetedEvent<HTMLInputElement>
  ) {
    setSettings({
      ...settings,
      frequencyPenalty: Number(event.currentTarget.value),
    })
  }

  function onPresencePenaltyChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    setSettings({
      ...settings,
      presencePenalty: Number(event.currentTarget.value),
    })
  }

  function getMaximumLength(model: Model) {
    let length: number

    if (model === 'code-davinci-002') {
      length = 8000
    } else if (model === 'text-davinci-003') {
      length = 4000
    } else {
      length = 2048
    }

    return length
  }

  function onResetClick() {
    setSettings({
      ...settings,
      model: DEFAULT_SETTINGS.model,
      temperature: DEFAULT_SETTINGS.temperature,
      maxTokens: DEFAULT_SETTINGS.maxTokens,
      stop: DEFAULT_SETTINGS.stop,
      topP: DEFAULT_SETTINGS.topP,
      frequencyPenalty: DEFAULT_SETTINGS.frequencyPenalty,
      presencePenalty: DEFAULT_SETTINGS.presencePenalty,
    })

    emit<NotifyHandler>('NOTIFY', {
      message: 'Parameters reset.',
    })
  }

  // update maxTokens on model & maxTokens change
  useUpdateEffect(() => {
    if (settings.model === 'code-davinci-002') {
      if (settings.maxTokens > 8000) {
        setSettings({ ...settings, maxTokens: 8000 })
      }
    } else if (settings.model === 'text-davinci-003') {
      if (settings.maxTokens > 4000) {
        setSettings({ ...settings, maxTokens: 4000 })
      }
    } else {
      if (settings.maxTokens > 2048) {
        setSettings({ ...settings, maxTokens: 2048 })
      }
    }
  }, [settings.model, settings.maxTokens])

  return (
    <div
      css={css`
        padding: var(--space-medium);
      `}
    >
      {/* api key */}
      <div className="parameterTitle">
        <Text>
          <Muted>OpenAI API key</Muted>
        </Text>
        <Text>
          <Link
            href="https://platform.openai.com/account/api-keys"
            target="_blank"
          >
            Get API key
          </Link>
        </Text>
      </div>
      <VerticalSpace space="extraSmall" />
      <Textbox
        variant="border"
        value={settings.apiKey}
        onInput={onApiKeyInput}
        password
      />

      <VerticalSpace space="large" />

      {/* parameters title */}
      <div className="parameterTitle">
        <Text>
          <Muted>Parameters</Muted>
        </Text>
        <Text>
          <Link
            href="https://platform.openai.com/docs/api-reference/chat"
            target="_blank"
          >
            Documentation
          </Link>
        </Text>
      </div>

      <VerticalSpace space="medium" />

      {/* model */}
      <Text>
        <Muted>Model</Muted>
      </Text>
      <VerticalSpace space="extraSmall" />
      <Dropdown
        onChange={onModelChange}
        options={modelOptions}
        value={settings.model || null}
        variant="border"
      />

      <VerticalSpace space="extraSmall" />

      {/* temperature */}
      <div className="parameterTitle withRangeSlider">
        <Text>
          <Muted>Temperature</Muted>
        </Text>
        <div className="parameterTitleInput">
          <TextboxNumeric
            value={String(settings.temperature)}
            onInput={onTemperatureChange}
          />
        </div>
      </div>
      <RangeSlider
        increment={0.01}
        maximum={1}
        minimum={0}
        value={String(settings.temperature)}
        onChange={onTemperatureChange}
      />

      {/* maximum length */}
      <div className="parameterTitle withRangeSlider">
        <Text>
          <Muted>Maximum length</Muted>
        </Text>
        <div className="parameterTitleInput">
          <TextboxNumeric
            value={String(settings.maxTokens)}
            onInput={onMaxTokensChange}
          />
        </div>
      </div>
      <RangeSlider
        increment={1}
        maximum={getMaximumLength(settings.model)}
        minimum={0}
        value={String(settings.maxTokens)}
        onChange={onMaxTokensChange}
      />

      <VerticalSpace space="extraSmall" />

      {/* stop sequences */}
      <Text>
        <Muted>Stop sequences</Muted>
      </Text>
      <VerticalSpace space="extraSmall" />
      <Textbox variant="border" value={settings.stop} onInput={onStopInput} />

      <VerticalSpace space="extraSmall" />

      {/* top p */}
      <div className="parameterTitle withRangeSlider">
        <Text>
          <Muted>Top P</Muted>
        </Text>
        <div className="parameterTitleInput">
          <TextboxNumeric
            value={String(settings.topP)}
            onInput={onTopPChange}
          />
        </div>
      </div>
      <RangeSlider
        increment={0.01}
        maximum={1}
        minimum={0}
        value={String(settings.topP)}
        onChange={onTopPChange}
      />

      {/* frequency penalty */}
      <div className="parameterTitle withRangeSlider">
        <Text>
          <Muted>Frequency penalty</Muted>
        </Text>
        <div className="parameterTitleInput">
          <TextboxNumeric
            value={String(settings.frequencyPenalty)}
            onInput={onFrequencyPenaltyChange}
          />
        </div>
      </div>
      <RangeSlider
        increment={0.01}
        maximum={2}
        minimum={0}
        value={String(settings.frequencyPenalty)}
        onChange={onFrequencyPenaltyChange}
      />

      {/* presence penalty */}
      <div className="parameterTitle withRangeSlider">
        <Text>
          <Muted>Presence penalty</Muted>
        </Text>
        <div className="parameterTitleInput">
          <TextboxNumeric
            value={String(settings.presencePenalty)}
            onInput={onPresencePenaltyChange}
          />
        </div>
      </div>
      <RangeSlider
        increment={0.01}
        maximum={2}
        minimum={0}
        value={String(settings.presencePenalty)}
        onChange={onPresencePenaltyChange}
      />

      <VerticalSpace space="extraSmall" />

      {/* reset button */}
      <Button fullWidth secondary onClick={onResetClick}>
        Reset parameters
      </Button>
    </div>
  )
}

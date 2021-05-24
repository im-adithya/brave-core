/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react'

import { getLocale } from 'brave-ui/helpers'

import checkIcon from './assets/check.svg'
import smileySadIcon from './assets/smiley-sad.svg'

import {
  StyledBorderlessButton,
  StyledButton,
  StyledCaptchaFrame,
  StyledIcon,
  StyledTitle,
  StyledText,
  StyledWrapper
} from './style'

interface Props {
  attempts: number
}

interface State {
  showSuccessInterstitial: boolean
}

export default class AdaptiveCaptcha extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      showSuccessInterstitial: true
    }
  }

  componentDidMount () {
    const captchaFrame = document.getElementById('captcha') as HTMLIFrameElement
    if (!captchaFrame) {
      return
    }

    const captchaContentWindow = captchaFrame.contentWindow
    window.addEventListener('message', message => {
      if (message.source !== captchaContentWindow) {
        return
      }

      console.log('Received mesage from captcha iframe!')
    })
  }

  onClose = () => {
    this.setState({ showSuccessInterstitial: false })
  }

  getCaptcha = () => {
    return (
      <StyledWrapper>
        <StyledCaptchaFrame
          id='captcha'
          src='http://192.168.56.1:4242/captcha-example.html'
          sandbox='allow-scripts'
        >
        </StyledCaptchaFrame>
      </StyledWrapper>
    )
  }

  getMaxAttemptsExceededInterstitial = () => {
    return (
      <StyledWrapper>
        <StyledIcon src={smileySadIcon} />
        <StyledTitle>{getLocale('captchaMaxAttemptsExceededTitle')}</StyledTitle>
        <StyledText>{getLocale('captchaMaxAttemptsExceededText')}</StyledText>
        <StyledButton>{getLocale('contactSupport')}</StyledButton>
      </StyledWrapper>
    )
  }

  getSuccessInterstitial = () => {
    return (
      <StyledWrapper>
        <StyledIcon src={checkIcon} />
        <StyledTitle textSize='large'>{getLocale('captchaSolvedTitle')}</StyledTitle>
        <StyledText>{getLocale('captchaSolvedText')}</StyledText>
        <StyledBorderlessButton onClick={this.onClose}>{getLocale('dismiss')}</StyledBorderlessButton>
      </StyledWrapper>
    )
  }

  render () {
    if (this.props.attempts >= 10) {
      return this.getMaxAttemptsExceededInterstitial()
    }

    if (this.state.showSuccessInterstitial) {
      return this.getSuccessInterstitial()
    }

    return this.getCaptcha()
  }
}

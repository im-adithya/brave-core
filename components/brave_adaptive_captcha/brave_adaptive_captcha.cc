/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "brave/components/brave_adaptive_captcha/brave_adaptive_captcha.h"

#include <utility>

#include "brave/components/brave_adaptive_captcha/environment.h"
#include "content/public/browser/browser_context.h"
#include "content/public/browser/storage_partition.h"

namespace brave_adaptive_captcha {

Environment g_environment = PRODUCTION;

BraveAdaptiveCaptcha::BraveAdaptiveCaptcha(content::BrowserContext* context)
    : context_(context),
      url_loader_(content::BrowserContext::GetDefaultStoragePartition(context_)
                      ->GetURLLoaderFactoryForBrowserProcess()),
      captcha_challenge_(
          std::make_unique<GetAdaptiveCaptchaChallenge>(&url_loader_,
                                                        g_environment)) {}

BraveAdaptiveCaptcha::~BraveAdaptiveCaptcha() = default;

void BraveAdaptiveCaptcha::GetScheduledCaptcha(
    const std::string& payment_id,
    OnGetAdaptiveCaptchaChallenge callback) {
  captcha_challenge_->Request(payment_id, std::move(callback));
}

}  // namespace brave_adaptive_captcha

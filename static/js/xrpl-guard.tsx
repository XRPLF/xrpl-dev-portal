import { useThemeHooks } from '@redocly/theme/core/hooks';
import { isFunction } from './type-helpers'
import { FC } from 'react'
import { useEffect, useState } from 'react'
import React = require('react');
import XRPLoader from '../components/XRPLoader';
import * as xrpl from 'xrpl'

export const MIN_LOADER_MS = 1250
export const DEFAULT_TIMEOUT = 1000

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

/**
 * Evaluate a check function will eventually resolve to `true`
 *
 * If check is initially true, immediatly return `isTrue`
 * If check is initially false and becomes true, return true after `timeoutMs`
 */
export const useThrottledCheck = (
  check: () => boolean,
  timeoutMs = DEFAULT_TIMEOUT,
) => {
  const [isTrue, setIsTrue] = useState(() => check())

  useEffect(() => {
    const doCheck = async (tries = 0) => {
      const waitMs = 250,
        waitedMs = tries * waitMs

      if (check()) {
        const debouncedDelay =
          waitedMs < timeoutMs ? timeoutMs - (waitedMs % timeoutMs) : 0

        setTimeout(() => setIsTrue(true), debouncedDelay)
        return
      }

      await sleep(waitMs)

      doCheck(tries + 1)
    }

    if (!isTrue) {
      doCheck()
    }
  }, [check, isTrue])

  return isTrue
}

/**
 * Show a loading spinner if XRPL isn't loaded yet by
 * waiting at least MIN_LOADER_MS before rendering children
 * in order to make the visual loading transition smooth
 *
 * e.g. if xrpl loads after 500ms, wait
 * another MIN_LOADER_MS - 500ms before rendering children
 *
 * @param {function} testCheck for testing only, a check function to use
 */
export const XRPLGuard: FC<{ testCheck?: () => boolean, children }> = ({
  testCheck,
  children,
}) => {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  const isXRPLLoaded = useThrottledCheck(
      testCheck ?? (() => typeof xrpl === 'object'),
      MIN_LOADER_MS,
  )

  return (
    <>
      {isXRPLLoaded ? (
        isFunction(children) ? (
          children()
        ) : (
          children
        )
      ) : <XRPLoader message={translate("Loading...")}/>
        }
    </>
  )
}

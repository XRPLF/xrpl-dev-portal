// This component replaces the default Redocly Tabs functionality.
// Original Tabs styling is preserved, but this adds full-page tab
// switching and preserves tab preferences between pages.

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import styled, { css } from 'styled-components'

import type { JSX } from 'react'

import { TabList } from '@redocly/theme/markdoc/components/Tabs/TabList'
import { TabContent, TabsSize } from '@redocly/theme/markdoc/components/Tabs/Tabs'
import type { TabItemProps } from '@redocly/theme/markdoc/components/Tabs/Tabs'
import { getTabId } from '@redocly/theme/core/utils'

// Define tabs to sync by label and possible values. Must be lowercase.
const syncGroups: Record<string, string[]> = {
  language: ['javascript', 'python', 'java', 'go', 'php'],
  protocol: ['websocket', 'json-rpc', 'commandline'],
}

const syncableCategories: Record<string, string> = {}
for (const [category, labels] of Object.entries(syncGroups)) {
  for (const label of labels) {
    syncableCategories[label] = category
  }
}

function getCategory(label: string): string | undefined {
  return syncableCategories[label.toLowerCase()]
}

// Local storage of tab preferences
const storageKey = 'xrpl-preferred-tabs'

type Listener = (label: string) => void
const listeners = new Set<Listener>()

function readPrefs(): Record<string, string> {
  try {
    const raw = localStorage.getItem(storageKey)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writePrefs(prefs: Record<string, string>): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(prefs))
  } catch {
    // Local storage unavailable
  }
}

function subscribe(callback: Listener): () => void {
  listeners.add(callback)
  return () => {
    listeners.delete(callback)
  }
}

function broadcast(label: string): void {
  const category = getCategory(label)
  if (!category) return
  const prefs = readPrefs()
  prefs[category] = label.toLowerCase()
  writePrefs(prefs)
  listeners.forEach((cb) => cb(label))
}

function getPreferredLabel(candidates: string[]): string | null {
  const prefs = readPrefs()
  for (const label of candidates) {
    const category = getCategory(label)
    if (category && prefs[category] === label.toLowerCase()) {
      return label
    }
  }
  return null
}

// Tabs rendering. Keep styling 1:1 with Redocly's Tabs.

type TabsProps = {
  children: React.ReactElement<TabItemProps>[]
  className?: string
  size: TabsSize
  forceReady?: boolean
  initialTab?: string
}

export function Tabs({
  children,
  className,
  size,
  forceReady = false,
  initialTab: propInitialTab,
}: TabsProps): JSX.Element {
  const [childrenArray, setChildrenArray] = useState<React.ReactElement<TabItemProps>[]>(
    React.Children.toArray(children) as React.ReactElement<TabItemProps>[],
  )

  useEffect(() => {
    setChildrenArray(React.Children.toArray(children) as React.ReactElement<TabItemProps>[])
  }, [children])

  const containerRef = useRef<HTMLUListElement | null>(null)
  const [isReady, setIsReady] = useState(false)

  // Determine initial tab: stored preference > initial tab setting > first tab.
  const tabLabels = useMemo(() => childrenArray.map((child) => child.props.label), [childrenArray])
  const resolvedInitialTab = useMemo(() => {
    const defaultTab = childrenArray[0]?.props.label ?? ''
    const base = propInitialTab ?? defaultTab
    return getPreferredLabel(tabLabels) ?? base
  }, [childrenArray, propInitialTab, tabLabels])

  const [activeTab, setActiveTab] = useState(resolvedInitialTab)

  // Reset activeTab if tabs change and current selection no longer exists
  useEffect(() => {
    if (tabLabels.length > 0 && !tabLabels.includes(activeTab)) {
      setActiveTab(resolvedInitialTab)
    }
  }, [tabLabels, activeTab, resolvedInitialTab])

  // Keep a ref to activeTab so the subscribe listener can read it without re-subscribing
  const activeTabRef = useRef(activeTab)
  activeTabRef.current = activeTab

  // Subscribe to sync broadcasts (case-insensitive match)
  useEffect(() => {
    return subscribe((label: string) => {
      const match = tabLabels.find((l) => l.toLowerCase() === label.toLowerCase())
      if (match && match !== activeTabRef.current) {
        setActiveTab(match)
      }
    })
  }, [tabLabels])

  // Wrap onTabChange to also broadcast the selected label
  const onTabChange = useCallback((label: string) => {
    setActiveTab(label)
    broadcast(label)
  }, [])

  const handleReadyChange = useCallback((ready: boolean) => {
    setIsReady(ready)
  }, [])

  // Tab rendering (from Redocly)
  return (
    <TabsContainer
      data-component-name="Markdoc/Tabs/Tabs"
      className={className}
      $isReady={isReady || forceReady}
    >
      <TabList
        size={size}
        childrenArray={childrenArray}
        activeTab={activeTab}
        onTabChange={onTabChange}
        containerRef={containerRef}
        onReadyChange={handleReadyChange}
      />
      {childrenArray.map((child, index) => {
        const { label } = child.props
        const tabId = getTabId(label, index)
        return label === activeTab ? (
          <TabContent
            key={`content-${tabId}`}
            id={`panel-${tabId}`}
            aria-labelledby={`tab-${tabId}`}
            tabIndex={0}
            role="tabpanel"
          >
            {child.props.children}
          </TabContent>
        ) : null
      })}
    </TabsContainer>
  )
}

// Styling (from Redocly)
const TabsContainer = styled.div<{ $isReady: boolean }>`
  position: relative;
  color: var(--md-tabs-container-text-color);
  font-size: var(--md-tabs-container-font-size);
  font-family: var(--md-tabs-container-font-family);
  font-style: var(--md-tabs-container-font-style);
  font-weight: var(--md-tabs-container-font-weight);
  background-color: var(--md-tabs-container-bg-color);
  margin: var(--md-tabs-container-margin);
  padding: var(--md-tabs-container-padding);
  border: var(--md-tabs-container-border);

  ol[class^='Tabs__TabList'] {
    margin: 0;
    padding: 0;
  }

  ${({ $isReady }) =>
    !$isReady &&
    css`
      opacity: 0;
      pointer-events: none;
      overflow: hidden;
    `}
`

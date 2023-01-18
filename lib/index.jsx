import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider, Layout, Table, Tabs, Collapse, Result, FloatButton, theme } from 'antd'
import { first, filter, pick, sortBy } from 'lodash-es'
import 'antd/dist/reset.css'
import 'highlight.js/styles/monokai.css'
import {
  StatsData,
  LanguageList,
  TotalTitle,
  TotalDataSource,
  TotalColumns,
  TotalSummary,
  SourcesColumns
} from './config'
import { isDark, addListenerPrefersColorScheme, getHighlightCode, renderFileInfo } from './util'
import './index.css'

const { defaultAlgorithm, darkAlgorithm } = theme
const { BackTop } = FloatButton

const { statistic, clones } = StatsData
const { formats } = statistic

const App = () => {
  const [dark, setDark] = useState(isDark())

  const [selectedRowKeys, setSelectedRowKeys] = useState([first(LanguageList)])

  const [language] = selectedRowKeys

  const filterClones = filter(clones, { format: language })

  const sources = formats?.[language]?.sources || {}

  const SourcesDataSource = Object.entries(sources).reduce((prev, [k, v]) => {
    prev.push({
      path: k,
      ...pick(v, ['lines', 'duplicatedLines'])
    })
    return prev
  }, [])

  useEffect(() => {
    addListenerPrefersColorScheme(value => {
      setDark(value)
    })
  }, [setDark])

  return (
    <ConfigProvider
      componentSize="small"
      theme={{
        algorithm: dark ? darkAlgorithm : defaultAlgorithm
      }}
    >
      <Layout style={{ minHeight: '100vh', padding: 12 }}>
        <Table
          rowKey="language"
          dataSource={TotalDataSource}
          columns={TotalColumns}
          summary={TotalSummary}
          pagination={false}
          rowSelection={{
            type: 'radio',
            hideSelectAll: true,
            selectedRowKeys,
            onChange: setSelectedRowKeys
          }}
          title={TotalTitle}
        />
        <Tabs
          defaultActiveKey="Clones"
          style={{ marginTop: 10 }}
          items={[
            {
              key: 'Clones',
              label: ['Clones', '(', filterClones.length, ')'].join(''),
              children: (
                <>
                  <Collapse expandIconPosition="end">
                    {filterClones.map((v, i) => {
                      const { duplicationA, duplicationB } = v
                      const highlightCode = getHighlightCode(duplicationA.fragment, language)
                      return (
                        <Collapse.Panel
                          header={
                            <div>
                              {renderFileInfo(duplicationA)}
                              {renderFileInfo(duplicationB)}
                            </div>
                          }
                          key={i}
                        >
                          <pre>
                            <code
                              className={`hljs language-${language}`}
                              dangerouslySetInnerHTML={{ __html: highlightCode }}
                            ></code>
                          </pre>
                        </Collapse.Panel>
                      )
                    })}
                  </Collapse>
                  {!filterClones.length && <Result status="success" />}
                </>
              )
            },
            {
              key: 'Files',
              label: ['Files', '(', SourcesDataSource.length, ')'].join(''),
              children: (
                <>
                  <Table
                    bordered
                    rowKey="path"
                    columns={SourcesColumns}
                    dataSource={sortBy(SourcesDataSource, ['duplicatedLines']).reverse()}
                    pagination={false}
                    size="small"
                  />
                  {!SourcesDataSource.length && <Result status="success" />}
                </>
              )
            }
          ]}
        />
        <BackTop />
      </Layout>
    </ConfigProvider>
  )
}

createRoot(document.querySelector('#app')).render(<App />)

import React from 'react'
import { Table, Typography, Button } from 'antd'
import dayjs from 'dayjs'
import { add } from '@nbfe/tools/dist/index-es'
import { inflateRaw } from 'pako/dist/pako_inflate.js'

const { Text } = Typography

const inflateData = str => {
  return JSON.parse(inflateRaw(new Uint8Array(str.split(',')), { to: 'string' }))
}

window.OriginalStatsData = window.StatsData

window.StatsData = inflateData(window.OriginalStatsData)

const { StatsData } = window

export { StatsData }

export const LanguageList = Object.keys(StatsData.statistic.formats)

export const TotalDataSource = Object.entries(StatsData.statistic.formats).reduce((prev, [k, v]) => {
  prev.push({
    language: k,
    ...v.total
  })
  return prev
}, [])

export const TotalTitle = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <div style={{ height: 45, fontSize: 0 }}>
        <div style={{ transform: `scale(${45 / 85})`, transformOrigin: 'left top' }}>
          <Logo />
        </div>
      </div>
      <Button>{dayjs(StatsData.statistic.detectionDate).format('YYYY-MM-DD HH:mm:ss')}</Button>
    </div>
  )
}

export const TotalColumns = [
  {
    title: 'language',
    dataIndex: 'language',
    width: 100
  },
  {
    title: 'FILES',
    dataIndex: 'sources'
  },
  {
    title: 'LINES',
    dataIndex: 'lines'
  },
  {
    title: 'CLONES',
    dataIndex: 'clones'
  },
  {
    title: 'DUPLICATED LINES',
    render: (value, record) => {
      const { duplicatedLines, percentage } = record
      return `${duplicatedLines}(${percentage}%)`
    }
  },
  {
    title: 'DUPLICATED TOKENS',
    render: (value, record) => {
      const { duplicatedTokens, percentageTokens } = record
      return `${duplicatedTokens}(${percentageTokens}%)`
    }
  }
]

export const TotalSummary = currentData => {
  const total = {
    language: 0,
    sources: 0,
    lines: 0,
    clones: 0,
    duplicatedLines: 0,
    percentage: 0,
    duplicatedTokens: 0,
    percentageTokens: 0
  }

  currentData.forEach(v => {
    Object.entries(total).forEach(([k]) => {
      total[k] = add(total[k], v[k])
    })
  })

  const duplicatedLinesText = `${total.duplicatedLines}(${total.percentage}%)`
  const duplicatedTokensText = `${total.duplicatedTokens}(${total.percentageTokens}%)`

  return (
    <Table.Summary.Row>
      <Table.Summary.Cell />
      <Table.Summary.Cell>Summary</Table.Summary.Cell>
      <Table.Summary.Cell>{total.sources}</Table.Summary.Cell>
      <Table.Summary.Cell>{total.lines}</Table.Summary.Cell>
      <Table.Summary.Cell>{total.clones}</Table.Summary.Cell>
      <Table.Summary.Cell>{duplicatedLinesText}</Table.Summary.Cell>
      <Table.Summary.Cell>{duplicatedTokensText}</Table.Summary.Cell>
    </Table.Summary.Row>
  )
}

export const SourcesColumns = [
  {
    title: '文件路径',
    dataIndex: 'path',
    render: value => {
      return <Text copyable>{value}</Text>
    }
  },
  {
    title: 'LINES',
    dataIndex: 'lines',
    width: 60
  },
  {
    title: 'DUPLICATED LINES',
    dataIndex: 'duplicatedLines',
    width: 150
  }
]

export const Logo = () => {
  return (
    <svg width="204" height="85" xmlns="http://www.w3.org/2000/svg">
      <g>
        <text
          fontWeight="normal"
          xmlSpace="preserve"
          textAnchor="start"
          fontFamily="'Courier New', Courier, monospace"
          fontSize="70"
          y="58.5"
          x="0"
          strokeWidth="0"
          stroke="#000"
          fill="#007bff"
        >
          js
        </text>
        <text
          fontWeight="normal"
          xmlSpace="preserve"
          textAnchor="start"
          fontFamily="'Courier New', Courier, monospace"
          fontSize="70"
          y="58.5"
          x="78"
          strokeWidth="0"
          stroke="#000"
          fill="#B200B2"
        >
          cpd
        </text>
      </g>
    </svg>
  )
}

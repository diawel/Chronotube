import { ReactNode } from 'react'
import styled from 'styled-components'

export type RoundBoxProps = RoundBoxStyleType & {
  children: ReactNode
}

type RoundBoxStyleType = {
  shadow?: string
  background?: string
}

const RoundBox = styled.div<RoundBoxStyleType>(
  (style) => `
    border-radius: 24px;
    box-shadow: ${style.shadow ?? 'none'};
    background: ${style.background ?? 'none'};
  `
)

export default RoundBox
